import Phaser from 'phaser';
import './style.css';
import { gameConfig } from './game/scenes';
import { GAME_DAY_MS, getCalendar, loadSave, persistSave, resetSave, type GameLocation, type SaveState } from './game/save';

const required = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Elemento ausente: ${selector}`);
  return element;
};

const backButton = required<HTMLButtonElement>('#back-button');
const menuButton = required<HTMLButtonElement>('#menu-button');
const closeDialog = required<HTMLButtonElement>('#close-dialog');
const resetButton = required<HTMLButtonElement>('#reset-save');
const timeToggle = required<HTMLButtonElement>('#time-toggle');
const dialog = required<HTMLDialogElement>('#info-dialog');
const loading = required<HTMLElement>('#loading');
const locationKicker = required<HTMLElement>('#location-kicker');
const locationTitle = required<HTMLElement>('#location-title');
const locationDescription = required<HTMLElement>('#location-description');
const dayLabel = required<HTMLElement>('#day-label');
const dialogSeason = required<HTMLElement>('#dialog-season');
const yearProgress = required<HTMLElement>('#year-progress');
const dayMarker = required<HTMLElement>('#day-marker');

let state: SaveState = loadSave();
let clockRunning = true;
let hasFocus = document.hasFocus();
let lastFrame = performance.now();
let lastSavedAt = performance.now();

const game = new Phaser.Game({ ...gameConfig, scene: [] });
game.scene.add('site', (gameConfig.scene as Phaser.Types.Scenes.SceneType[])[0], false);
game.scene.add('apiary', (gameConfig.scene as Phaser.Types.Scenes.SceneType[])[1], false);
game.scene.start(state.location);

function navigate(location: GameLocation): void {
  state.location = location;
  backButton.classList.toggle('hidden', location === 'site');
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
});
game.events.on('location-detail', (detail: { kicker: string; title: string; description: string }) => {
  locationKicker.textContent = detail.kicker;
  locationTitle.textContent = detail.title;
  locationDescription.textContent = detail.description;
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
