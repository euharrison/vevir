import Config from '../Config';
import Audio from './Audio';
import Level3d from '../3d/Level3d';
import Spectrogram3d from '../3d/Spectrogram3d';
import Scene3d from '../3d/Scene3d';

class Capture extends Phaser.State {
  constructor() {
    super();
    this.key = 'capture';
  }

  create() {
    this.game.spectrogram = Audio.getSpectrogram();

    this.spec3d = new Spectrogram3d(this.game.spectrogram.length);
    Scene3d.add(this.spec3d);

    this.level3d = new Level3d([]);
    Scene3d.add(this.level3d);

    Scene3d.updateCameraCapture();

    this.game.level = [];

    this.tileColumnCounter = 0;
    this.intervalId = setInterval(
      this.createTile.bind(this),
      Config.captureTime / Config.horizontalTiles
    );

    console.log(Config.captureTime / Config.horizontalTiles)
  }

  update() {
    this.game.spectrogram = Audio.getSpectrogram();
    this.spec3d.update(this.game.spectrogram);
  }

  render() {
    this.game.debug.text('CAPTURING...', 4, 40);
  }

  createTile() {
    this.game.spectrogram = Audio.getSpectrogram();

    const x = this.tileColumnCounter * Config.tileWidth;
    const wall = { x, y: 35 * Config.tileHeight };
    this.game.level.push(wall);
    this.level3d.appendTile(wall);

    // TODO podemos fixar os numeros do audio ao inves de normalizar?
    // if (Audio.getVolume() > 170) {
    if (Audio.getVolume() > 0.8) {
      const wall2 = { x, y: 15 * Config.tileHeight };
      this.game.level.push(wall2);
      this.level3d.appendTile(wall2);
    }

    this.level3d.position.x = -x;

    this.tileColumnCounter++;

    if (this.tileColumnCounter === Config.horizontalTiles) {
      this.game.state.start('play');
    }
  }

  shutdown() {
    clearTimeout(this.intervalId);
    Scene3d.remove(this.spec3d);
    Scene3d.remove(this.level3d);
  }
}

export default new Capture();
