import Config from '../Config';
import Audio from './Audio';
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

    Scene3d.updateCameraCapture();

    this.finishTimerId = setTimeout(() => this.finish(), 20 * 1000);
  }

  update() {
    this.game.spectrogram = Audio.getSpectrogram();
    this.spec3d.update(this.game.spectrogram);
  }

  render() {
    this.game.debug.text('CAPTURING...', 4, 40);
  }

  finish() {
    this.game.state.start('play');
  }

  shutdown() {
    clearInterval(this.finishTimerId);
    Scene3d.remove(this.spec3d);
  }
}

export default new Capture();
