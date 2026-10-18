import Phaser from 'phaser';
import { assets } from './assets';

const WORLD_WIDTH = 1672;
const WORLD_HEIGHT = 941;

type LocationDetail = { kicker: string; title: string; description: string };

function emitLocation(scene: Phaser.Scene, detail: LocationDetail): void {
  scene.game.events.emit('location-detail', detail);
}

function addHotspot(scene: Phaser.Scene, x: number, y: number, width: number, height: number, label: string, onTap: () => void): void {
  const glow = scene.add.rectangle(x, y, width, height, 0xf5c34b, 0.08)
    .setStrokeStyle(4, 0xffdc76, 0.85)
    .setInteractive({ useHandCursor: true });
  scene.tweens.add({ targets: glow, alpha: { from: 0.45, to: 1 }, duration: 1200, yoyo: true, repeat: -1 });
  const text = scene.add.text(x, y - height / 2 - 17, label, {
    fontFamily: 'Trebuchet MS, sans-serif', fontSize: '22px', color: '#fff7d6',
    backgroundColor: '#173f35dd', padding: { x: 12, y: 7 },
  }).setOrigin(0.5);
  glow.on('pointerover', () => text.setScale(1.04));
  glow.on('pointerout', () => text.setScale(1));
  glow.on('pointerup', onTap);
}

export class SiteScene extends Phaser.Scene {
  constructor() { super('site'); }

  preload(): void {
    this.load.image('site', assets.site);
    this.load.image('house', assets.house);
    this.load.image('shop', assets.shop);
    this.load.image('fence', assets.fence);
  }

  create(): void {
    this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'site');

    this.add.image(1330, 595, 'house').setScale(0.205).setOrigin(0.5, 0.78);
    this.add.image(1455, 720, 'shop').setScale(0.16).setOrigin(0.5, 0.78);
    this.add.image(275, 240, 'fence').setScale(0.27).setOrigin(0.5);

    addHotspot(this, 275, 235, 330, 210, 'Meliponário', () => {
      this.game.events.emit('navigate', 'apiary');
      this.scene.start('apiary');
    });
    addHotspot(this, 1332, 555, 245, 185, 'Casa', () => emitLocation(this, {
      kicker: 'Casa do meliponicultor', title: 'Seu ponto de apoio',
      description: 'O caderno e as configurações chegarão nas próximas versões.',
    }));
    addHotspot(this, 1455, 695, 210, 145, 'Lojinha', () => emitLocation(this, {
      kicker: 'Lojinha do sítio', title: 'Produção local',
      description: 'Aqui serão vendidos mel, própolis e saburá colhidos no jogo.',
    }));
    addHotspot(this, 825, 515, 410, 245, 'Área de plantio', () => emitLocation(this, {
      kicker: 'Área de plantio', title: 'Solo pronto para flores',
      description: 'Nas próximas versões, as flores alimentarão as colônias ao longo do ano.',
    }));

    emitLocation(this, {
      kicker: 'Seu sítio', title: 'Primavera na Bahia',
      description: 'Toque nos locais destacados para explorar.',
    });
    this.game.events.emit('scene-ready', 'site');
  }
}

export class ApiaryScene extends Phaser.Scene {
  constructor() { super('apiary'); }

  preload(): void {
    this.load.image('site', assets.site);
    this.load.image('fence', assets.fence);
    this.load.image('hives', assets.hives);
  }

  create(): void {
    this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'site').setTint(0x5d735c).setAlpha(0.58);
    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x0a211c, 0.34);
    this.add.image(WORLD_WIDTH / 2, 505, 'fence').setScale(0.72, 0.62);

    const hive = this.add.image(535, 500, 'hives').setOrigin(0, 0).setCrop(0, 120, 555, 750).setScale(0.92);
    hive.setInteractive(new Phaser.Geom.Rectangle(0, 0, 555, 750), Phaser.Geom.Rectangle.Contains);
    if (hive.input) hive.input.cursor = 'pointer';
    this.tweens.add({ targets: hive, y: 488, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    this.add.text(WORLD_WIDTH / 2, 128, 'Meliponário', {
      fontFamily: 'Georgia, serif', fontSize: '54px', color: '#fff1bd', stroke: '#173f35', strokeThickness: 8,
    }).setOrigin(0.5);
    this.add.text(WORLD_WIDTH / 2, 190, '1 colônia de Jataí', {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '27px', color: '#e9dca8',
    }).setOrigin(0.5);

    hive.on('pointerup', () => emitLocation(this, {
      kicker: 'Colônia 01 · Jataí', title: 'Caixa INPA',
      description: 'A abertura e a revisão da caixa serão construídas na versão 0.2.',
    }));

    emitLocation(this, {
      kicker: 'Meliponário', title: 'Sua primeira colônia',
      description: 'Toque na caixa para consultar seu estado inicial.',
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
