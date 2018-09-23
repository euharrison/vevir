import anime from 'animejs';

import AI from './AI';
import Config from '../Config';
import Audio from './Audio';
import Level from './Level';
import Spectrogram3d from '../3d/Spectrogram3d';
import ColorManager from '../3d/ColorManager';
import Scene3d from '../3d/Scene3d';

class Capture extends Phaser.State {
  constructor() {
    super();
    this.key = 'capture';
  }

  create() {
    Scene3d.camera.near = 600;
    Scene3d.camera.far = 20000;
    Scene3d.camera.updateProjectionMatrix();

    ColorManager.shuffle();
    AI.setupNewAI();

    this.game.spectrogram = Audio.getSpectrogram();

    this.spec3d = new Spectrogram3d(this.game.spectrogram.length);
    Scene3d.add(this.spec3d);

    this.level = new Level(this.game);

    const x = this.column * Config.tileWidth;
    const y = Config.verticalTiles * Config.tileHeight;

    this.game.tiles = [];

    this.column = 0;
    this.intervalId = setInterval(
      this.createTile.bind(this),
      Config.captureTime / Config.horizontalTiles
    );

    this.cameraDistance = 2300;

    anime({
      targets: this.game.camera,
      duration: Config.captureTime,
      easing: 'linear',
      x: [-this.cameraDistance, (Config.horizontalTiles * Config.tileWidth) - this.cameraDistance],// - 3000 - 10000,
    })
  }

  update() {
    Scene3d.updateCamera(this.camera);

    this.game.spectrogram = Audio.getSpectrogram();

    this.spec3d.update(this.game.spectrogram);
    this.spec3d.position.x = this.game.camera.x + this.cameraDistance;
  }

  render() {
    this.game.debug.text('CAPTURING...', 20, 400);
    this.game.debug.cameraInfo(this.game.camera, 20, 20);
  }

  createTile() {
    const x = this.column * Config.tileWidth;
    const maxY = Config.verticalTiles * Config.tileHeight;

    // top/bottom tiles to hit world bounds
    // TODO remove it, we don't need it anymore
    const tiles = [
      { type: 'wall', x, y: 0 - Config.tileHeight },
      { type: 'wall', x, y: maxY + Config.tileHeight },
    ];

    let type = '';
    const progressPercent = this.column / Config.horizontalTiles;

    // phase 1, fly 
    if (progressPercent < 0.1) {
      // 
    }
    // phase 2, checkpoints 
    else if (progressPercent < 0.3) {
      type = 'checkpoint';
    }
    // phase 3, enemies 
    else if (progressPercent < 0.5) {
      const types = ['enemy', 'checkpoint'];
      type = types[this.column % 2];
    }
    // phase 4, coins 
    else {
      const types = ['coin', 'enemy', 'checkpoint'];
      type = types[this.column % 3];
    }

    // TODO podemos fixar os numeros do audio ao inves de normalizar?
    // if (Audio.getVolume() > 170) {
    // if (Audio.getVolume() > 0.8) {
    if (type) {
      tiles.push({ type, x, y: Math.random() * maxY });
    }

    tiles.forEach((tile) => this.level.createTile(tile));

    this.game.tiles.push(...tiles);

    this.column++;
    if (this.column === Config.horizontalTiles) {
      this.finish();
    }
  }

  finish() {
    clearTimeout(this.intervalId);

    Scene3d.remove(this.spec3d);

    anime({
      targets: this.game.camera,
      duration: 3000,
      easing: 'easeInOutExpo',
      delay: 1000,
      x: -300,
      complete: () => {
        setTimeout(() => this.game.state.start('play'), 1000);
      },
    })
  }

  shutdown() {
    clearTimeout(this.intervalId);
    Scene3d.remove(this.spec3d);
  }
}

export default new Capture();
