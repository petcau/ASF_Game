import Phaser from 'phaser';
import { assets } from './assets';
import {
  cloneMapLayout,
  loadMapLayout,
  type MapElementInstance,
  type MapElementType,
  type MapLayout,
} from './layout';

const WORLD_WIDTH = 1672;
const WORLD_HEIGHT = 941;

type LocationDetail = { kicker: string; title: string; description: string };

function emitLocation(scene: Phaser.Scene, detail: LocationDetail): void {
  scene.game.events.emit('location-detail', detail);
}

function mapTap(scene: Phaser.Scene, onTap: () => void): void {
  if (!scene.data.get('map-dragged') && !scene.data.get('map-editor-mode')) onTap();
}

function addInteractiveZone(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  onTap: () => void,
): Phaser.GameObjects.Zone {
  const zone = scene.add.zone(x, y, width, height)
    .setInteractive({ useHandCursor: true })
    .setData('map-navigation-zone', true)
    .setDepth(35);
  zone.on('pointerup', () => mapTap(scene, onTap));
  return zone;
}

function addHive(scene: Phaser.Scene, texture: string, x: number, y: number, height: number): Phaser.GameObjects.Image {
  const hive = scene.add.image(x, y, texture).setOrigin(0.5, 1).setDepth(18);
  hive.setScale(height / hive.height);
  return hive;
}

function enableMapNavigation(scene: Phaser.Scene): void {
  const camera = scene.cameras.main;
  const canvas = scene.game.canvas;
  const minZoom = 1;
  const maxZoom = 4;
  let dragStart: { x: number; y: number; scrollX: number; scrollY: number } | null = null;
  let pinchDistance = 0;
  let pinchZoom = 1;
  let zoomFocus = { x: camera.width / 2, y: camera.height / 2 };

  camera.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  canvas.classList.add('map-grabbable');
  scene.data.set('map-dragged', false);

  const reportZoom = (): void => {
    scene.game.events.emit('map-zoom-state', Math.round(camera.zoom * 100));
  };

  const zoomAt = (requestedZoom: number, screenX = camera.width / 2, screenY = camera.height / 2): void => {
    const nextZoom = Phaser.Math.Clamp(requestedZoom, minZoom, maxZoom);
    if (Math.abs(nextZoom - camera.zoom) < 0.001) return;
    const before = camera.getWorldPoint(screenX, screenY);
    camera.setZoom(nextZoom);
    camera.preRender();
    const after = camera.getWorldPoint(screenX, screenY);
    camera.scrollX += before.x - after.x;
    camera.scrollY += before.y - after.y;
    camera.preRender();
    reportZoom();
  };

  const zoomIn = (): void => zoomAt(camera.zoom + 0.25, zoomFocus.x, zoomFocus.y);
  const zoomOut = (): void => zoomAt(camera.zoom - 0.25, zoomFocus.x, zoomFocus.y);
  const resetZoom = (): void => {
    camera.setZoom(1);
    camera.centerOn(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    reportZoom();
  };

  scene.game.events.on('map-zoom-in', zoomIn);
  scene.game.events.on('map-zoom-out', zoomOut);
  scene.game.events.on('map-zoom-reset', resetZoom);

  scene.input.on('wheel', (
    pointer: Phaser.Input.Pointer,
    _objects: Phaser.GameObjects.GameObject[],
    _deltaX: number,
    deltaY: number,
  ) => {
    zoomFocus = { x: pointer.x, y: pointer.y };
    zoomAt(camera.zoom + (deltaY < 0 ? 0.18 : -0.18), pointer.x, pointer.y);
  });

  scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    const overEditorObject = scene.input.hitTestPointer(pointer)
      .some((object) => object.getData('map-editor-object') === true);
    if (scene.data.get('map-editor-mode') && overEditorObject) {
      scene.data.set('editor-object-dragging', true);
      return;
    }
    const downPointers = scene.input.manager.pointers.filter((item) => item.isDown);
    if (downPointers.length >= 2) {
      pinchDistance = Phaser.Math.Distance.Between(
        downPointers[0].x,
        downPointers[0].y,
        downPointers[1].x,
        downPointers[1].y,
      );
      pinchZoom = camera.zoom;
      dragStart = null;
      return;
    }
    dragStart = { x: pointer.x, y: pointer.y, scrollX: camera.scrollX, scrollY: camera.scrollY };
    scene.data.set('map-dragged', false);
    canvas.classList.add('is-dragging');
  });

  scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    zoomFocus = { x: pointer.x, y: pointer.y };
    if (scene.data.get('editor-object-dragging')) return;
    const downPointers = scene.input.manager.pointers.filter((item) => item.isDown);
    if (downPointers.length >= 2) {
      const distance = Phaser.Math.Distance.Between(
        downPointers[0].x,
        downPointers[0].y,
        downPointers[1].x,
        downPointers[1].y,
      );
      if (pinchDistance > 0) {
        const centerX = (downPointers[0].x + downPointers[1].x) / 2;
        const centerY = (downPointers[0].y + downPointers[1].y) / 2;
        zoomAt(pinchZoom * (distance / pinchDistance), centerX, centerY);
        scene.data.set('map-dragged', true);
      }
      return;
    }
    if (!pointer.isDown || !dragStart) return;
    const deltaX = pointer.x - dragStart.x;
    const deltaY = pointer.y - dragStart.y;
    if (Math.hypot(deltaX, deltaY) > 7) scene.data.set('map-dragged', true);
    camera.scrollX = dragStart.scrollX - deltaX / camera.zoom;
    camera.scrollY = dragStart.scrollY - deltaY / camera.zoom;
  });

  scene.input.on('pointerup', () => {
    dragStart = null;
    pinchDistance = 0;
    scene.data.set('editor-object-dragging', false);
    canvas.classList.remove('is-dragging');
    window.setTimeout(() => scene.data.set('map-dragged', false), 0);
  });

  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.game.events.off('map-zoom-in', zoomIn);
    scene.game.events.off('map-zoom-out', zoomOut);
    scene.game.events.off('map-zoom-reset', resetZoom);
    canvas.classList.remove('map-grabbable', 'is-dragging');
  });

  reportZoom();
}

export class SiteScene extends Phaser.Scene {
  constructor() { super('site'); }

  preload(): void {
    this.load.image('site', assets.site);
    this.load.image('house', assets.house);
    this.load.image('shop', assets.shop);
    this.load.image('fence', assets.fence);
    this.load.image('saf', assets.saf);
    this.load.image('hive-front-small', assets.hiveFrontSmall);
    this.load.image('hive-front-medium', assets.hiveFrontMedium);
    this.load.image('hive-front-large', assets.hiveFrontLarge);
    this.load.image('hive-left-small', assets.hiveLeftSmall);
    this.load.image('hive-left-medium', assets.hiveLeftMedium);
    this.load.image('hive-left-large', assets.hiveLeftLarge);
    this.load.image('hive-right-small', assets.hiveRightSmall);
    this.load.image('hive-right-medium', assets.hiveRightMedium);
    this.load.image('hive-right-large', assets.hiveRightLarge);
    this.load.image('jatai-flight-1', assets.jataiFlight1);
    this.load.image('jatai-flight-2', assets.jataiFlight2);
    this.load.image('jatai-flight-3', assets.jataiFlight3);
  }

  create(): void {
    this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'site');
    enableMapNavigation(this);
    let layout = loadMapLayout();
    let selectedId: string | null = null;
    let editorMode = false;
    let collectionMode = false;
    const editableObjects = new Map<string, Phaser.GameObjects.Image>();
    const collectionMarkers = new Map<string, Phaser.GameObjects.Container>();
    const opaqueTextureBounds = new Map<string, Phaser.Geom.Rectangle>();
    const activeBeeSprites = new Set<Phaser.GameObjects.Sprite>();
    const activeBeeTweens = new Set<Phaser.Tweens.Tween>();
    const beeTweenSpeedFactors = new Map<Phaser.Tweens.Tween, number>();
    const activeBeeTimers = new Set<Phaser.Time.TimerEvent>();
    let beeFlightGeneration = 0;
    let beeFlightSpeed = 0.25;

    if (!this.anims.exists('jatai-flight')) {
      this.anims.create({
        key: 'jatai-flight',
        frames: [
          { key: 'jatai-flight-1' },
          { key: 'jatai-flight-2' },
          { key: 'jatai-flight-3' },
        ],
        frameRate: 14,
        repeat: -1,
        yoyo: true,
      });
    }

    const selection = this.add.image(0, 0, 'site')
      .setTintFill(0xffdc62)
      .setAlpha(0.34)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(10000)
      .setVisible(false);
    this.tweens.add({
      targets: selection,
      alpha: { from: 0.25, to: 0.48 },
      duration: 650,
      yoyo: true,
      repeat: -1,
    });

    const findElement = (id: string): MapElementInstance | undefined => layout.elements.find((item) => item.id === id);
    const emitLayout = (): void => {
      this.game.events.emit('map-editor-layout-change', cloneMapLayout(layout));
    };
    const refreshCollectionMarkers = (): void => {
      collectionMarkers.forEach((marker) => marker.destroy());
      collectionMarkers.clear();
      layout.collectionPoints.forEach((point, index) => {
        const circle = this.add.circle(0, 0, 15, 0xf4cb4f, 0.92)
          .setStrokeStyle(3, 0x173c31, 1);
        const number = this.add.text(0, 0, String(index + 1), {
          color: '#173c31',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          fontStyle: 'bold',
        }).setOrigin(0.5);
        const marker = this.add.container(point.x, point.y, [circle, number])
          .setSize(34, 34)
          .setDepth(8800)
          .setData('collection-point-marker', true)
          .setInteractive({ useHandCursor: true });
        marker.on('pointerup', (
          _pointer: Phaser.Input.Pointer,
          _localX: number,
          _localY: number,
          event: Phaser.Types.Input.EventData,
        ) => {
          if (!collectionMode) return;
          event.stopPropagation();
          layout.collectionPoints = layout.collectionPoints.filter((item) => item.id !== point.id);
          refreshCollectionMarkers();
          emitLayout();
        });
        collectionMarkers.set(point.id, marker);
      });
    };
    const reportSelection = (): void => {
      const element = selectedId ? findElement(selectedId) : undefined;
      this.game.events.emit('map-editor-selection', element ? { ...element } : null);
    };
    const getOpaqueTextureBounds = (textureKey: string): Phaser.Geom.Rectangle => {
      const cached = opaqueTextureBounds.get(textureKey);
      if (cached) return cached;

      const frame = this.textures.getFrame(textureKey);
      const fallback = new Phaser.Geom.Rectangle(0, 0, frame.cutWidth, frame.cutHeight);
      const canvas = document.createElement('canvas');
      canvas.width = frame.cutWidth;
      canvas.height = frame.cutHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context || frame.source.image instanceof Uint8Array) return fallback;

      context.drawImage(
        frame.source.image,
        frame.cutX,
        frame.cutY,
        frame.cutWidth,
        frame.cutHeight,
        0,
        0,
        frame.cutWidth,
        frame.cutHeight,
      );
      const pixels = context.getImageData(0, 0, frame.cutWidth, frame.cutHeight).data;
      let minX = frame.cutWidth;
      let minY = frame.cutHeight;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < frame.cutHeight; y += 1) {
        for (let x = 0; x < frame.cutWidth; x += 1) {
          if (pixels[((y * frame.cutWidth + x) * 4) + 3] <= 10) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
      const bounds = maxX >= minX && maxY >= minY
        ? new Phaser.Geom.Rectangle(minX, minY, maxX - minX + 1, maxY - minY + 1)
        : fallback;
      opaqueTextureBounds.set(textureKey, bounds);
      return bounds;
    };
    const refreshSelection = (): void => {
      const target = selectedId ? editableObjects.get(selectedId) : undefined;
      if (!editorMode || !target) {
        selection.setVisible(false);
        return;
      }
      selection
        .setTexture(target.texture.key)
        .setPosition(target.x, target.y)
        .setOrigin(target.originX, target.originY)
        .setScale(target.scaleX, target.scaleY)
        .setRotation(target.rotation)
        .setFlip(target.flipX, target.flipY)
        .setVisible(true);
    };

    const applyScale = (target: Phaser.GameObjects.Image, element: MapElementInstance): void => {
      const multiplier = Phaser.Math.Clamp(element.size, 20, 300) / 100;
      if (element.type === 'fence') target.setDisplaySize(200 * multiplier, 102 * multiplier);
      else if (element.type === 'house') target.setScale((150 / target.height) * multiplier);
      else if (element.type === 'shop') target.setScale((140 / target.height) * multiplier);
      else if (element.type === 'saf') target.setScale((160 / target.height) * multiplier);
      else target.setScale((104 / target.height) * multiplier);
    };
    const refreshDepths = (): void => {
      layout.elements.forEach((element, layer) => {
        element.layer = layer;
        editableObjects.get(element.id)?.setDepth(20 + layer);
      });
    };

    const createElement = (element: MapElementInstance): Phaser.GameObjects.Image => {
      const target = this.add.image(element.x, element.y, element.type).setOrigin(0.5).setDepth(20 + element.layer);
      applyScale(target, element);
      target.setData('map-editor-object', true);
      const opaqueBounds = getOpaqueTextureBounds(element.type);
      const hitPadding = 4;
      target.setInteractive(
        new Phaser.Geom.Rectangle(
          Math.max(0, opaqueBounds.x - hitPadding),
          Math.max(0, opaqueBounds.y - hitPadding),
          Math.min(target.width, opaqueBounds.width + (hitPadding * 2)),
          Math.min(target.height, opaqueBounds.height + (hitPadding * 2)),
        ),
        Phaser.Geom.Rectangle.Contains,
      );
      if (target.input) target.input.cursor = 'pointer';
      this.input.setDraggable(target);
      const selectTarget = (): void => {
        if (!editorMode) return;
        selectedId = element.id;
        reportSelection();
        refreshSelection();
      };
      target.on('pointerdown', (
        _pointer: Phaser.Input.Pointer,
        _localX: number,
        _localY: number,
        event: Phaser.Types.Input.EventData,
      ) => {
        if (!editorMode) return;
        event.stopPropagation();
        selectTarget();
      });
      target.on('dragstart', () => {
        if (!editorMode) return;
        this.data.set('editor-object-dragging', true);
        selectTarget();
      });
      target.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (!editorMode || selectedId !== element.id) return;
        element.x = Math.round(Phaser.Math.Clamp(dragX, 20, WORLD_WIDTH - 20));
        element.y = Math.round(Phaser.Math.Clamp(dragY, 20, WORLD_HEIGHT - 20));
        target.setPosition(element.x, element.y);
        reportSelection();
        emitLayout();
        refreshSelection();
      });
      target.on('dragend', () => this.data.set('editor-object-dragging', false));
      editableObjects.set(element.id, target);
      return target;
    };

    layout.elements.forEach(createElement);
    refreshDepths();
    refreshCollectionMarkers();

    const setEditorMode = (enabled: boolean): void => {
      editorMode = enabled;
      this.data.set('map-editor-mode', enabled);
      this.children.list.forEach((child) => {
        if (!child.input) return;
        if (child.getData('map-editor-object') === true) child.input.enabled = enabled;
        else if (child.getData('map-navigation-zone') === true) child.input.enabled = !enabled;
      });
      refreshSelection();
      reportSelection();
    };
    const selectEditorObject = (id: string): void => {
      if (!editableObjects.has(id)) return;
      selectedId = id;
      reportSelection();
      refreshSelection();
    };
    const addEditorObject = ({ type, clientX, clientY }: {
      type: MapElementType;
      clientX: number;
      clientY: number;
    }): void => {
      const canvasBounds = this.game.canvas.getBoundingClientRect();
      const screenX = ((clientX - canvasBounds.left) / canvasBounds.width) * this.cameras.main.width;
      const screenY = ((clientY - canvasBounds.top) / canvasBounds.height) * this.cameras.main.height;
      const dropPoint = this.cameras.main.getWorldPoint(screenX, screenY);
      const count = layout.elements.length;
      const element: MapElementInstance = {
        id: `${type}-${Date.now()}-${count}`,
        type,
        x: Math.round(Phaser.Math.Clamp(dropPoint.x, 40, WORLD_WIDTH - 40)),
        y: Math.round(Phaser.Math.Clamp(dropPoint.y, 40, WORLD_HEIGHT - 40)),
        size: type === 'fence' || type === 'house' || type === 'shop' || type === 'saf' ? 100 : 50,
        layer: layout.elements.length,
      };
      layout.elements.push(element);
      createElement(element);
      refreshDepths();
      selectedId = element.id;
      reportSelection();
      emitLayout();
      refreshSelection();
    };
    const duplicateEditorObject = (id: string): void => {
      const source = findElement(id);
      if (!source) return;
      const duplicate: MapElementInstance = {
        ...source,
        id: `${source.type}-${Date.now()}-${layout.elements.length}`,
        x: Math.round(Phaser.Math.Clamp(source.x + 35, 20, WORLD_WIDTH - 20)),
        y: Math.round(Phaser.Math.Clamp(source.y + 20, 20, WORLD_HEIGHT - 20)),
        layer: layout.elements.length,
      };
      layout.elements.push(duplicate);
      createElement(duplicate);
      refreshDepths();
      selectedId = duplicate.id;
      reportSelection();
      emitLayout();
      refreshSelection();
    };
    const updateEditorObject = ({ id, x, y, size }: Partial<MapElementInstance> & { id: string }): void => {
      const element = findElement(id);
      const target = editableObjects.get(id);
      if (!element || !target) return;
      if (Number.isFinite(x)) element.x = Math.round(Phaser.Math.Clamp(x as number, 20, WORLD_WIDTH - 20));
      if (Number.isFinite(y)) element.y = Math.round(Phaser.Math.Clamp(y as number, 20, WORLD_HEIGHT - 20));
      if (Number.isFinite(size)) element.size = Math.round(Phaser.Math.Clamp(size as number, 20, 300));
      target.setPosition(element.x, element.y);
      applyScale(target, element);
      reportSelection();
      emitLayout();
      refreshSelection();
    };
    const deleteEditorObject = (id: string): void => {
      editableObjects.get(id)?.destroy();
      editableObjects.delete(id);
      layout.elements = layout.elements.filter((element) => element.id !== id);
      refreshDepths();
      selectedId = null;
      reportSelection();
      emitLayout();
      refreshSelection();
    };
    const changeEditorLayer = ({ id, direction }: { id: string; direction: 'up' | 'down' }): void => {
      const index = layout.elements.findIndex((element) => element.id === id);
      if (index < 0) return;
      const nextIndex = Phaser.Math.Clamp(index + (direction === 'up' ? 1 : -1), 0, layout.elements.length - 1);
      if (nextIndex === index) return;
      [layout.elements[index], layout.elements[nextIndex]] = [layout.elements[nextIndex], layout.elements[index]];
      refreshDepths();
      reportSelection();
      emitLayout();
      refreshSelection();
    };
    const clearSelectionFromMap = (pointer: Phaser.Input.Pointer): void => {
      if (!editorMode || !selectedId) return;
      const overEditorObject = this.input.hitTestPointer(pointer)
        .some((object) => object.getData('map-editor-object') === true);
      if (overEditorObject) return;
      selectedId = null;
      reportSelection();
      refreshSelection();
    };
    const clearEditorObjects = (): void => {
      editableObjects.forEach((target) => target.destroy());
      editableObjects.clear();
      layout = { elements: [], collectionPoints: [] };
      refreshCollectionMarkers();
      selectedId = null;
      reportSelection();
      emitLayout();
      refreshSelection();
    };

    const stopBeeFlight = (emitFinished = true): void => {
      beeFlightGeneration += 1;
      activeBeeTweens.forEach((tween) => tween.stop());
      activeBeeTweens.clear();
      beeTweenSpeedFactors.clear();
      activeBeeTimers.forEach((timer) => timer.remove(false));
      activeBeeTimers.clear();
      activeBeeSprites.forEach((bee) => bee.destroy());
      activeBeeSprites.clear();

      if (emitFinished) {
        this.game.events.emit('map-bees-finished');
      }
    };

    const setBeeFlightSpeed = (speed: number): void => {
      beeFlightSpeed = Phaser.Math.Clamp(Number(speed) || 0.25, 0.1, 1);
      activeBeeTweens.forEach((tween) => {
        tween.timeScale = beeFlightSpeed * (beeTweenSpeedFactors.get(tween) ?? 1);
      });
    };

    const getHiveForagerCount = (type: MapElementType): number => {
      if (type.endsWith('-small')) return 2;
      if (type.endsWith('-medium')) return 4;
      return 6;
    };

    const setCollectionMode = (enabled: boolean): void => {
      collectionMode = enabled;
      this.game.canvas.classList.toggle('collection-point-mode', enabled);
      this.children.list.forEach((child) => {
        if (child.input && child.getData('map-navigation-zone') === true) {
          child.input.enabled = !enabled && !editorMode;
        }
      });
    };

    const addCollectionPoint = (pointer: Phaser.Input.Pointer): void => {
      if (!collectionMode || editorMode || this.data.get('map-dragged')) return;
      const overMarker = this.input.hitTestPointer(pointer)
        .some((object) => object.getData('collection-point-marker') === true);
      if (overMarker) return;
      const point = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      layout.collectionPoints.push({
        id: `collection-${Date.now()}-${layout.collectionPoints.length}`,
        x: Math.round(Phaser.Math.Clamp(point.x, 0, WORLD_WIDTH)),
        y: Math.round(Phaser.Math.Clamp(point.y, 0, WORLD_HEIGHT)),
      });
      refreshCollectionMarkers();
      emitLayout();
    };

    const playBeeFlight = (): void => {
      const hives = layout.elements.filter((element) => (
        element.type.startsWith('hive-') && editableObjects.has(element.id)
      ));
      if (hives.length === 0 || layout.collectionPoints.length === 0) return;

      stopBeeFlight(false);
      const generation = beeFlightGeneration;
      const totalForagers = hives.reduce((total, hive) => total + getHiveForagerCount(hive.type), 0);
      const collectionDecks = new Map<string, number[]>();
      const drawCollectionPoint = (hiveId: string) => {
        let deck = collectionDecks.get(hiveId);
        if (!deck || deck.length === 0) {
          deck = Phaser.Utils.Array.Shuffle(layout.collectionPoints.map((_point, index) => index));
          collectionDecks.set(hiveId, deck);
        }
        return layout.collectionPoints[deck.pop() as number];
      };
      this.game.events.emit('map-bees-started', hives.map((hive) => hive.id), totalForagers);

      hives.forEach((hive) => {
        const hiveId = hive.id;
        const foragerCount = getHiveForagerCount(hive.type);
        const scheduleFlight = (index: number, cycle: number, delay: number): void => {
          let timer!: Phaser.Time.TimerEvent;
          timer = this.time.delayedCall(delay, () => {
            activeBeeTimers.delete(timer);
            if (generation !== beeFlightGeneration) return;

            const currentHive = findElement(hiveId);
            const currentHiveObject = editableObjects.get(hiveId);
            if (!currentHive || !currentHive.type.startsWith('hive-') || !currentHiveObject) {
              stopBeeFlight();
              return;
            }

            const origin = new Phaser.Math.Vector2(
              currentHiveObject.x,
              currentHiveObject.y - currentHiveObject.displayHeight * 0.08,
            );
            const collectionPoint = drawCollectionPoint(hiveId);
            const destination = new Phaser.Math.Vector2(collectionPoint.x, collectionPoint.y);
            const direction = destination.clone().subtract(origin).normalize();
            const perpendicular = new Phaser.Math.Vector2(-direction.y, direction.x);
            const curveSide = (index + cycle) % 2 === 0 ? 1 : -1;
            const bend = (45 + (index % 3) * 18) * curveSide;
            const curve = new Phaser.Curves.CubicBezier(
              origin,
              origin.clone().lerp(destination, 0.32).add(perpendicular.clone().scale(bend)),
              origin.clone().lerp(destination, 0.72).add(perpendicular.clone().scale(-bend * 0.45)),
              destination,
            );
            const bee = this.add.sprite(origin.x, origin.y, 'jatai-flight-1')
              .setDisplaySize(15 + (index % 3), 19 + (index % 3))
              .setDepth(9000 + index)
              .setVisible(false)
              .setData('role', 'campeira')
              .setData('home-hive-id', hiveId);

            bee.play('jatai-flight');
            activeBeeSprites.add(bee);
            const flight = { progress: 0 };
            let previousX = origin.x;
            let tween!: Phaser.Tweens.Tween;

            tween = this.tweens.add({
              targets: flight,
              progress: 1,
              duration: 2550 + (index % 4) * 260,
              hold: 380 + (index % 3) * 110,
              yoyo: true,
              ease: 'Sine.inOut',
              onStart: () => bee.setVisible(true),
              onUpdate: () => {
                if (generation !== beeFlightGeneration || !bee.active) return;
                const point = curve.getPoint(flight.progress);
                bee.setPosition(point.x, point.y);
                bee.setFlipX(point.x < previousX);
                previousX = point.x;
              },
              onComplete: () => {
                activeBeeTweens.delete(tween);
                beeTweenSpeedFactors.delete(tween);
                activeBeeSprites.delete(bee);
                bee.destroy();
                if (generation !== beeFlightGeneration) return;
                scheduleFlight(index, cycle + 1, 2000);
              },
            });
            const cycleSpeedFactor = Phaser.Math.FloatBetween(0.97, 1.03);
            beeTweenSpeedFactors.set(tween, cycleSpeedFactor);
            tween.timeScale = beeFlightSpeed * cycleSpeedFactor;
            activeBeeTweens.add(tween);
          });
          activeBeeTimers.add(timer);
        };

        for (let index = 0; index < foragerCount; index += 1) {
          scheduleFlight(index, 0, index * 360);
        }
      });
    };

    const selectUpperField = (): void => emitLocation(this, {
      kicker: 'Plantio norte',
      title: 'Flores de primavera',
      description: 'Área para espécies florais que fornecem néctar, pólen e resina às campeiras.',
    });
    const selectLowerField = (): void => emitLocation(this, {
      kicker: 'Plantio sul',
      title: 'Reserva de florada',
      description: 'Segundo cultivo para escalonar a floração e reduzir a falta de alimento.',
    });
    addInteractiveZone(this, 790, 405, 360, 150, selectUpperField);
    addInteractiveZone(this, 820, 585, 420, 180, selectLowerField);

    const selectLake = (): void => emitLocation(this, {
      kicker: 'Recurso natural',
      title: 'Lago e nascente',
      description: 'Água e vegetação ciliar ajudam a manter um ambiente saudável para o sítio.',
    });
    const selectForest = (): void => emitLocation(this, {
      kicker: 'Mata nativa',
      title: 'Fonte de diversidade',
      description: 'A floresta fornece alimento, resina e locais adequados para os enxames.',
    });
    addInteractiveZone(this, 1110, 205, 390, 220, selectLake);
    addInteractiveZone(this, 1490, 205, 290, 260, selectForest);

    this.game.events.on('map-editor-mode', setEditorMode);
    this.game.events.on('map-editor-select', selectEditorObject);
    this.game.events.on('map-editor-add', addEditorObject);
    this.game.events.on('map-editor-update', updateEditorObject);
    this.game.events.on('map-editor-duplicate', duplicateEditorObject);
    this.game.events.on('map-editor-layer', changeEditorLayer);
    this.game.events.on('map-editor-delete', deleteEditorObject);
    this.game.events.on('map-editor-clear', clearEditorObjects);
    this.game.events.on('map-play-bees', playBeeFlight);
    this.game.events.on('map-stop-bees', stopBeeFlight);
    this.game.events.on('map-bee-speed', setBeeFlightSpeed);
    this.game.events.on('map-collection-mode', setCollectionMode);
    this.input.on('pointerdown', clearSelectionFromMap);
    this.input.on('pointerup', addCollectionPoint);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('map-editor-mode', setEditorMode);
      this.game.events.off('map-editor-select', selectEditorObject);
      this.game.events.off('map-editor-add', addEditorObject);
      this.game.events.off('map-editor-update', updateEditorObject);
      this.game.events.off('map-editor-duplicate', duplicateEditorObject);
      this.game.events.off('map-editor-layer', changeEditorLayer);
      this.game.events.off('map-editor-delete', deleteEditorObject);
      this.game.events.off('map-editor-clear', clearEditorObjects);
      this.game.events.off('map-play-bees', playBeeFlight);
      this.game.events.off('map-stop-bees', stopBeeFlight);
      this.game.events.off('map-bee-speed', setBeeFlightSpeed);
      this.game.events.off('map-collection-mode', setCollectionMode);
      this.input.off('pointerdown', clearSelectionFromMap);
      this.input.off('pointerup', addCollectionPoint);
      this.game.canvas.classList.remove('collection-point-mode');
      stopBeeFlight(false);
    });
    this.game.events.emit('map-editor-layout-ready', cloneMapLayout(layout) satisfies MapLayout);

    emitLocation(this, {
      kicker: 'Seu sítio',
      title: 'Primavera na Bahia',
      description: 'Abra “Posicionar objetos” para montar livremente o mapa.',
    });
    this.game.events.emit('scene-ready', 'site');
  }
}

export class ApiaryScene extends Phaser.Scene {
  constructor() { super('apiary'); }

  preload(): void {
    this.load.image('site', assets.site);
    this.load.image('fence', assets.fence);
    this.load.image('hive-front-small', assets.hiveFrontSmall);
    this.load.image('hive-front-medium', assets.hiveFrontMedium);
    this.load.image('hive-front-large', assets.hiveFrontLarge);
  }

  create(): void {
    this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'site').setTint(0x5d735c).setAlpha(0.58);
    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x0a211c, 0.42);
    this.add.image(WORLD_WIDTH / 2, 535, 'fence').setDisplaySize(1200, 645).setDepth(10);

    const stages = [
      { texture: 'hive-front-small', x: 555, title: 'Ninho', description: 'Estado inicial da colônia de Jataí.' },
      { texture: 'hive-front-medium', x: 835, title: 'Sobreninho', description: 'Amplia a área de cria quando a colônia cresce.' },
      { texture: 'hive-front-large', x: 1125, title: 'Melgueira', description: 'Recebe a maior parte dos potes de alimento.' },
    ];

    stages.forEach((stage, index) => {
      const hive = addHive(this, stage.texture, stage.x, 675, index === 0 ? 320 : 360);
      hive.setInteractive({ useHandCursor: true });
      hive.on('pointerup', () => emitLocation(this, {
        kicker: `Caixa INPA · estágio ${index + 1}`,
        title: stage.title,
        description: stage.description,
      }));
      this.add.text(stage.x, 730, stage.title, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '23px',
        color: '#fff4c8',
        backgroundColor: '#12372fe6',
        padding: { x: 14, y: 8 },
      }).setOrigin(0.5).setDepth(30);
    });

    this.add.text(WORLD_WIDTH / 2, 110, 'Meliponário', {
      fontFamily: 'Georgia, serif',
      fontSize: '54px',
      color: '#fff1bd',
      stroke: '#173f35',
      strokeThickness: 8,
    }).setOrigin(0.5).setDepth(30);
    this.add.text(WORLD_WIDTH / 2, 172, 'Evolução da caixa INPA da Jataí', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '27px',
      color: '#e9dca8',
    }).setOrigin(0.5).setDepth(30);

    emitLocation(this, {
      kicker: 'Meliponário',
      title: 'Sua primeira colônia',
      description: 'Compare os três estágios planejados para a caixa e toque em cada um para saber mais.',
    });
    this.game.events.emit('scene-ready', 'apiary');
  }
}

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  backgroundColor: '#173f35',
  scene: [SiteScene, ApiaryScene],
  transparent: false,
  render: { antialias: true, pixelArt: false, roundPixels: true },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: 3 },
};
