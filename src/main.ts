import Phaser from 'phaser';
import './style.css';
import { assets } from './game/assets';
import { gameConfig } from './game/scenes';
import {
  cloneMapLayout,
  loadMapLayout,
  MAP_ELEMENT_LABELS,
  saveMapLayout,
  type MapElementInstance,
  type MapElementType,
  type MapLayout,
} from './game/layout';
import { GAME_DAY_MS, getCalendar, loadSave, persistSave, resetSave, type GameLocation, type SaveState } from './game/save';

document.body.classList.remove('boot-pending');

const required = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Elemento ausente: ${selector}`);
  return element;
};

const startScreen = required<HTMLElement>('#start-screen');
const startGameButton = required<HTMLButtonElement>('#start-game-button');
const backButton = required<HTMLButtonElement>('#back-button');
const menuButton = required<HTMLButtonElement>('#menu-button');
const closeDialog = required<HTMLButtonElement>('#close-dialog');
const resetButton = required<HTMLButtonElement>('#reset-save');
const timeToggle = required<HTMLButtonElement>('#time-toggle');
const dialog = required<HTMLDialogElement>('#info-dialog');
const loading = required<HTMLElement>('#loading');
const dayLabel = required<HTMLElement>('#day-label');
const dialogSeason = required<HTMLElement>('#dialog-season');
const yearProgress = required<HTMLElement>('#year-progress');
const dayMarker = required<HTMLElement>('#day-marker');
const gameShell = required<HTMLElement>('#game-shell');
const editMapButton = required<HTMLButtonElement>('#edit-map-button');
const beeFlightControls = required<HTMLElement>('#bee-flight-controls');
const playMapButton = required<HTMLButtonElement>('#play-map-button');
const collectionModeButton = required<HTMLButtonElement>('#collection-mode-button');
const beeSpeed = required<HTMLInputElement>('#bee-speed');
const beeSpeedLabel = required<HTMLOutputElement>('#bee-speed-label');
const beeHiveSmallSummary = required<HTMLElement>('#bee-hive-small-summary');
const beeHiveMediumSummary = required<HTMLElement>('#bee-hive-medium-summary');
const beeHiveLargeSummary = required<HTMLElement>('#bee-hive-large-summary');
const beeHiveTotalSummary = required<HTMLElement>('#bee-hive-total-summary');
const beeTotalSummary = required<HTMLElement>('#bee-total-summary');
const mapEditor = required<HTMLElement>('#map-editor');
const closeMapEditorButton = required<HTMLButtonElement>('#close-map-editor');
const paletteTabs = required<HTMLElement>('#palette-tabs');
const elementPalette = required<HTMLElement>('#element-palette');
const mapObjectSelect = required<HTMLSelectElement>('#map-object-select');
const mapObjectX = required<HTMLInputElement>('#map-object-x');
const mapObjectY = required<HTMLInputElement>('#map-object-y');
const mapObjectSize = required<HTMLInputElement>('#map-object-size');
const mapObjectSizeLabel = required<HTMLOutputElement>('#map-object-size-label');
const saveMapLayoutButton = required<HTMLButtonElement>('#save-map-layout');
const copyMapLayoutButton = required<HTMLButtonElement>('#copy-map-layout');
const duplicateMapObjectButton = required<HTMLButtonElement>('#duplicate-map-object');
const lowerMapObjectButton = required<HTMLButtonElement>('#lower-map-object');
const raiseMapObjectButton = required<HTMLButtonElement>('#raise-map-object');
const deleteMapObjectButton = required<HTMLButtonElement>('#delete-map-object');
const clearMapLayoutButton = required<HTMLButtonElement>('#clear-map-layout');
const mapEditorStatus = required<HTMLOutputElement>('#map-editor-status');

let state: SaveState = loadSave();
const requestedScene = new URLSearchParams(window.location.search).get('scene');
const initialLocation: GameLocation = import.meta.env.DEV && requestedScene === 'apiary' ? 'apiary' : state.location;
let clockRunning = true;
let hasFocus = document.hasFocus();
let lastFrame = performance.now();
let lastSavedAt = performance.now();
let mapLayout: MapLayout = loadMapLayout();
let selectedMapObject: string | null = null;
let editorOpen = false;
let beesFlying = false;
let collectionMode = false;

startGameButton.addEventListener('click', () => {
  startScreen.classList.add('is-dismissed');
  startScreen.setAttribute('aria-hidden', 'true');
  window.setTimeout(() => startScreen.remove(), 450);
});

const isHiveType = (type: MapElementType): boolean => type.startsWith('hive-');

function updatePlayButton(): void {
  const hasHive = mapLayout.elements.some((element) => isHiveType(element.type));
  const hiveCounts = { small: 0, medium: 0, large: 0 };
  mapLayout.elements.forEach((element) => {
    if (!isHiveType(element.type)) return;
    if (element.type.endsWith('-small')) hiveCounts.small += 1;
    else if (element.type.endsWith('-medium')) hiveCounts.medium += 1;
    else hiveCounts.large += 1;
  });
  const totalForagers = hiveCounts.small * 2 + hiveCounts.medium * 4 + hiveCounts.large * 6;
  beeHiveSmallSummary.textContent = String(hiveCounts.small);
  beeHiveMediumSummary.textContent = String(hiveCounts.medium);
  beeHiveLargeSummary.textContent = String(hiveCounts.large);
  beeHiveTotalSummary.textContent = String(hiveCounts.small + hiveCounts.medium + hiveCounts.large);
  beeTotalSummary.textContent = String(totalForagers);
  const hasCollectionPoint = mapLayout.collectionPoints.length > 0;
  playMapButton.disabled = !hasHive || !hasCollectionPoint || state.location !== 'site';
  playMapButton.title = !hasHive
    ? 'Coloque uma caixa no mapa.'
    : !hasCollectionPoint ? 'Marque ao menos um ponto de coleta.' : '';
  playMapButton.classList.toggle('is-playing', beesFlying);
  playMapButton.textContent = beesFlying ? '■ Parar' : '▶ Play';
  beeSpeed.disabled = !hasHive || state.location !== 'site';
  collectionModeButton.disabled = beesFlying || state.location !== 'site';
  collectionModeButton.classList.toggle('is-active', collectionMode);
  collectionModeButton.textContent = collectionMode
    ? `Concluir marcação (${mapLayout.collectionPoints.length})`
    : `Marcar pontos de coleta (${mapLayout.collectionPoints.length})`;
}

const paletteCategories: Array<{
  id: string;
  label: string;
  rows: MapElementType[][];
}> = [
  { id: 'structures', label: 'Estruturas', rows: [['fence', 'house', 'shop']] },
  {
    id: 'hives',
    label: 'Caixas',
    rows: [
      ['hive-left-small', 'hive-left-medium', 'hive-left-large'],
      ['hive-right-small', 'hive-right-medium', 'hive-right-large'],
      ['hive-front-small', 'hive-front-medium', 'hive-front-large'],
    ],
  },
  { id: 'agroforestry', label: 'Agrofloresta', rows: [['saf']] },
];
const paletteImages: Record<MapElementType, string> = {
  fence: assets.fence,
  house: assets.house,
  shop: assets.shop,
  saf: assets.saf,
  'hive-front-small': assets.hiveFrontSmall,
  'hive-front-medium': assets.hiveFrontMedium,
  'hive-front-large': assets.hiveFrontLarge,
  'hive-left-small': assets.hiveLeftSmall,
  'hive-left-medium': assets.hiveLeftMedium,
  'hive-left-large': assets.hiveLeftLarge,
  'hive-right-small': assets.hiveRightSmall,
  'hive-right-medium': assets.hiveRightMedium,
  'hive-right-large': assets.hiveRightLarge,
};

type PaletteDrag = {
  type: MapElementType;
  pointerId: number;
  startX: number;
  startY: number;
  moved: boolean;
  ghost: HTMLImageElement;
};

let paletteDrag: PaletteDrag | null = null;

function movePaletteGhost(clientX: number, clientY: number): void {
  if (!paletteDrag) return;
  paletteDrag.ghost.style.left = `${clientX}px`;
  paletteDrag.ghost.style.top = `${clientY}px`;
}

function sizePaletteGhost(type: MapElementType, source: HTMLImageElement, ghost: HTMLImageElement): void {
  const scene = game.scene.getScene('site');
  const camera = scene.cameras.main;
  const canvasBounds = game.canvas.getBoundingClientRect();
  const screenScaleX = (canvasBounds.width / camera.width) * camera.zoom;
  const screenScaleY = (canvasBounds.height / camera.height) * camera.zoom;
  const aspectRatio = source.naturalWidth > 0 && source.naturalHeight > 0
    ? source.naturalWidth / source.naturalHeight
    : 1;
  let worldWidth: number;
  let worldHeight: number;
  if (type === 'fence') {
    worldWidth = 200;
    worldHeight = 102;
  } else {
    worldHeight = type === 'house' ? 150 : type === 'shop' ? 140 : type === 'saf' ? 160 : 52;
    worldWidth = worldHeight * aspectRatio;
  }
  ghost.style.width = `${worldWidth * screenScaleX}px`;
  ghost.style.height = `${worldHeight * screenScaleY}px`;
}

function startPaletteDrag(event: PointerEvent, type: MapElementType, source: HTMLImageElement): void {
  if (!editorOpen || paletteDrag || event.button !== 0) return;
  event.preventDefault();
  const ghost = document.createElement('img');
  ghost.className = 'palette-drag-ghost';
  ghost.src = source.src;
  ghost.alt = '';
  sizePaletteGhost(type, source, ghost);
  document.body.append(ghost);
  paletteDrag = {
    type,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
    ghost,
  };
  document.body.classList.add('is-palette-dragging');
  mapEditorStatus.textContent = 'Arraste o objeto até a posição desejada no mapa.';
  movePaletteGhost(event.clientX, event.clientY);
}

function finishPaletteDrag(event: PointerEvent, cancelled = false): void {
  if (!paletteDrag || event.pointerId !== paletteDrag.pointerId) return;
  const drag = paletteDrag;
  const canvasBounds = game.canvas.getBoundingClientRect();
  const droppedOnMap = !cancelled
    && drag.moved
    && event.clientX >= canvasBounds.left
    && event.clientX <= canvasBounds.right
    && event.clientY >= canvasBounds.top
    && event.clientY <= canvasBounds.bottom;
  if (droppedOnMap) {
    game.events.emit('map-editor-add', {
      type: drag.type,
      clientX: event.clientX,
      clientY: event.clientY,
    });
    mapEditorStatus.textContent = 'Objeto colocado. Arraste-o novamente para ajustar.';
  } else {
    mapEditorStatus.textContent = 'Arraste uma imagem do painel e solte sobre o mapa.';
  }
  drag.ghost.remove();
  paletteDrag = null;
  document.body.classList.remove('is-palette-dragging');
}

window.addEventListener('pointermove', (event) => {
  if (!paletteDrag || event.pointerId !== paletteDrag.pointerId) return;
  event.preventDefault();
  if (Math.hypot(event.clientX - paletteDrag.startX, event.clientY - paletteDrag.startY) > 5) {
    paletteDrag.moved = true;
  }
  movePaletteGhost(event.clientX, event.clientY);
}, { passive: false });
window.addEventListener('pointerup', (event) => finishPaletteDrag(event));
window.addEventListener('pointercancel', (event) => finishPaletteDrag(event, true));

let activePaletteCategory = paletteCategories[0].id;

function renderPalette(): void {
  elementPalette.replaceChildren();
  const category = paletteCategories.find((item) => item.id === activePaletteCategory) ?? paletteCategories[0];
  category.rows.forEach((types) => {
    const row = document.createElement('div');
    row.className = 'element-palette-row';
    types.forEach((type) => {
      const button = document.createElement('button');
      const image = document.createElement('img');
      button.type = 'button';
      button.title = MAP_ELEMENT_LABELS[type];
      button.setAttribute('aria-label', `Adicionar ${MAP_ELEMENT_LABELS[type]}`);
      image.src = paletteImages[type];
      image.alt = '';
      image.setAttribute('aria-hidden', 'true');
      button.append(image);
      button.addEventListener('pointerdown', (event) => startPaletteDrag(event, type, image));
      row.append(button);
    });
    elementPalette.append(row);
  });
}

paletteCategories.forEach((category) => {
  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'palette-tab';
  tab.textContent = category.label;
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-selected', String(category.id === activePaletteCategory));
  tab.addEventListener('click', () => {
    activePaletteCategory = category.id;
    paletteTabs.querySelectorAll<HTMLButtonElement>('.palette-tab').forEach((button) => {
      button.setAttribute('aria-selected', String(button === tab));
    });
    renderPalette();
  });
  paletteTabs.append(tab);
});
renderPalette();

function selectedElement(): MapElementInstance | undefined {
  return selectedMapObject ? mapLayout.elements.find((element) => element.id === selectedMapObject) : undefined;
}

function refreshObjectSelect(): void {
  const counts = new Map<MapElementType, number>();
  mapObjectSelect.replaceChildren();
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = mapLayout.elements.length ? 'Selecione um objeto' : 'Nenhum objeto colocado';
  mapObjectSelect.append(placeholder);
  mapLayout.elements.forEach((element) => {
    const count = (counts.get(element.type) ?? 0) + 1;
    counts.set(element.type, count);
    const option = document.createElement('option');
    option.value = element.id;
    option.textContent = `${MAP_ELEMENT_LABELS[element.type]} ${count}`;
    mapObjectSelect.append(option);
  });
  mapObjectSelect.value = selectedMapObject ?? '';
}

function updateCoordinateFields(): void {
  const element = selectedElement();
  const enabled = Boolean(element);
  [
    mapObjectX,
    mapObjectY,
    mapObjectSize,
    duplicateMapObjectButton,
    lowerMapObjectButton,
    raiseMapObjectButton,
    deleteMapObjectButton,
  ]
    .forEach((control) => { control.disabled = !enabled; });
  if (!element) {
    mapObjectX.value = '';
    mapObjectY.value = '';
    mapObjectSize.value = '110';
    mapObjectSizeLabel.value = '110%';
    mapObjectSizeLabel.textContent = '110%';
    return;
  }
  mapObjectSelect.value = element.id;
  mapObjectX.value = String(element.x);
  mapObjectY.value = String(element.y);
  mapObjectSize.value = String(element.size);
  mapObjectSizeLabel.value = `${element.size}%`;
  mapObjectSizeLabel.textContent = `${element.size}%`;
}

function setEditorOpen(open: boolean): void {
  if (open && beesFlying) game.events.emit('map-stop-bees');
  if (open && collectionMode) setCollectionMode(false);
  editorOpen = open;
  mapEditor.classList.toggle('hidden', !open);
  gameShell.classList.toggle('editor-open', open);
  editMapButton.classList.toggle('hidden', open || state.location !== 'site');
  game.events.emit('map-editor-mode', open);
  if (open) {
    if (selectedMapObject) game.events.emit('map-editor-select', selectedMapObject);
    mapEditorStatus.textContent = 'Arraste uma imagem do painel e solte sobre o mapa.';
    refreshObjectSelect();
    updateCoordinateFields();
  }
  window.setTimeout(() => {
    game.scale.refresh();
  }, 50);
}

function setCollectionMode(enabled: boolean): void {
  collectionMode = enabled && !beesFlying && state.location === 'site';
  if (collectionMode && editorOpen) setEditorOpen(false);
  game.events.emit('map-collection-mode', collectionMode);
  updatePlayButton();
}

const game = new Phaser.Game({ ...gameConfig, scene: [] });
game.scene.add('site', (gameConfig.scene as Phaser.Types.Scenes.SceneType[])[0], false);
game.scene.add('apiary', (gameConfig.scene as Phaser.Types.Scenes.SceneType[])[1], false);
game.scene.start(initialLocation);

function navigate(location: GameLocation): void {
  state.location = location;
  backButton.classList.toggle('hidden', location === 'site');
  editMapButton.classList.toggle('hidden', location !== 'site' || editorOpen);
  beeFlightControls.classList.toggle('hidden', location !== 'site');
  if (location !== 'site' && editorOpen) setEditorOpen(false);
  if (location !== 'site' && collectionMode) setCollectionMode(false);
  updatePlayButton();
  persistSave(state);
}

function updateCalendar(): void {
  const calendar = getCalendar(state.elapsedMs);
  dayLabel.textContent = `Dia ${calendar.day}`;
  dialogSeason.textContent = calendar.season;
  yearProgress.style.width = `${calendar.progress * 100}%`;
  dayMarker.style.left = `${calendar.progress * 100}%`;
}

function setClockRunning(next: boolean): void {
  clockRunning = next;
  timeToggle.textContent = next ? '▶ 1×' : 'Ⅱ Pausado';
  timeToggle.setAttribute('aria-label', next ? 'Pausar o tempo' : 'Continuar o tempo');
}

function tick(now: number): void {
  const delta = Math.min(1000, now - lastFrame);
  lastFrame = now;
  if (clockRunning && hasFocus && !document.hidden) state.elapsedMs += delta;
  updateCalendar();
  if (now - lastSavedAt >= 5000) {
    persistSave(state);
    lastSavedAt = now;
  }
  requestAnimationFrame(tick);
}

game.events.on('navigate', navigate);
game.events.on('scene-ready', (location: GameLocation) => {
  loading.classList.add('hidden');
  navigate(location);
  if (location === 'site') setEditorOpen(true);
});
game.events.on('map-editor-layout-ready', (layout: MapLayout) => {
  mapLayout = cloneMapLayout(layout);
  selectedMapObject = null;
  refreshObjectSelect();
  updateCoordinateFields();
  updatePlayButton();
});
game.events.on('map-editor-layout-change', (layout: MapLayout) => {
  mapLayout = cloneMapLayout(layout);
  refreshObjectSelect();
  updateCoordinateFields();
  updatePlayButton();
});
game.events.on('map-bees-started', (_hiveIds: string[], totalForagers: number) => {
  beesFlying = true;
  playMapButton.dataset.foragers = String(totalForagers);
  updatePlayButton();
});
game.events.on('map-bees-finished', () => {
  beesFlying = false;
  delete playMapButton.dataset.foragers;
  updatePlayButton();
});
game.events.on('map-editor-selection', (element: MapElementInstance | null) => {
  selectedMapObject = element?.id ?? null;
  if (element) {
    const current = mapLayout.elements.find((item) => item.id === element.id);
    if (current) Object.assign(current, element);
  }
  refreshObjectSelect();
  updateCoordinateFields();
  mapEditorStatus.textContent = element
    ? `${MAP_ELEMENT_LABELS[element.type]}: X ${element.x}, Y ${element.y}, ${element.size}%, camada ${element.layer + 1}`
    : 'Clique em um elemento acima para adicioná-lo.';
});

backButton.addEventListener('click', () => {
  game.scene.stop('apiary');
  game.scene.start('site');
  navigate('site');
});
menuButton.addEventListener('click', () => dialog.showModal());
closeDialog.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
timeToggle.addEventListener('click', () => setClockRunning(!clockRunning));
editMapButton.addEventListener('click', () => setEditorOpen(true));
playMapButton.addEventListener('click', () => {
  if (beesFlying) {
    game.events.emit('map-stop-bees');
    return;
  }
  setCollectionMode(false);
  setEditorOpen(false);
  game.events.emit('map-play-bees');
});
collectionModeButton.addEventListener('click', () => setCollectionMode(!collectionMode));
beeSpeed.addEventListener('input', () => {
  const speed = Number(beeSpeed.value);
  beeSpeedLabel.value = `${speed}×`;
  game.events.emit('map-bee-speed', speed);
});
closeMapEditorButton.addEventListener('click', () => setEditorOpen(false));
mapObjectSelect.addEventListener('change', () => {
  selectedMapObject = mapObjectSelect.value || null;
  updateCoordinateFields();
  if (selectedMapObject) game.events.emit('map-editor-select', selectedMapObject);
});

function applyObjectInputs(): void {
  if (!selectedMapObject) return;
  const x = Number(mapObjectX.value);
  const y = Number(mapObjectY.value);
  const size = Number(mapObjectSize.value);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(size)) return;
  game.events.emit('map-editor-update', { id: selectedMapObject, x, y, size });
}

mapObjectX.addEventListener('input', applyObjectInputs);
mapObjectY.addEventListener('input', applyObjectInputs);
mapObjectSize.addEventListener('input', applyObjectInputs);
saveMapLayoutButton.addEventListener('click', () => {
  saveMapLayout(mapLayout);
  mapEditorStatus.textContent = 'Mapa salvo neste navegador.';
});
copyMapLayoutButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(mapLayout, null, 2));
    mapEditorStatus.textContent = 'JSON do mapa copiado.';
  } catch {
    mapEditorStatus.textContent = 'Não foi possível copiar o JSON.';
  }
});
deleteMapObjectButton.addEventListener('click', () => {
  if (selectedMapObject) game.events.emit('map-editor-delete', selectedMapObject);
});
duplicateMapObjectButton.addEventListener('click', () => {
  if (selectedMapObject) game.events.emit('map-editor-duplicate', selectedMapObject);
});
lowerMapObjectButton.addEventListener('click', () => {
  if (selectedMapObject) game.events.emit('map-editor-layer', { id: selectedMapObject, direction: 'down' });
});
raiseMapObjectButton.addEventListener('click', () => {
  if (selectedMapObject) game.events.emit('map-editor-layer', { id: selectedMapObject, direction: 'up' });
});
clearMapLayoutButton.addEventListener('click', () => {
  if (!mapLayout.elements.length || !window.confirm('Remover todos os objetos colocados no mapa?')) return;
  game.events.emit('map-editor-clear');
  saveMapLayout({ elements: [], collectionPoints: [] });
  mapEditorStatus.textContent = 'Todos os objetos foram removidos.';
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Delete' || !editorOpen || !selectedMapObject) return;
  const target = event.target;
  if (target instanceof HTMLElement && target.matches('input, select, textarea, [contenteditable="true"]')) return;
  event.preventDefault();
  game.events.emit('map-editor-delete', selectedMapObject);
});
resetButton.addEventListener('click', () => {
  state = resetSave();
  updateCalendar();
  dialog.close();
  if (!game.scene.isActive('site')) {
    game.scene.stop('apiary');
    game.scene.start('site');
  }
});

document.addEventListener('visibilitychange', () => {
  lastFrame = performance.now();
  if (document.hidden) persistSave(state);
});
window.addEventListener('pagehide', () => persistSave(state));
window.addEventListener('blur', () => {
  hasFocus = false;
  lastFrame = performance.now();
  persistSave(state);
});
window.addEventListener('focus', () => {
  hasFocus = true;
  lastFrame = performance.now();
});

updateCalendar();
requestAnimationFrame(tick);

// Mantém a conversão central documentada para testes e futuras telas.
console.info(`Relógio do jogo: 1 dia = ${GAME_DAY_MS / 60000} minutos reais.`);
