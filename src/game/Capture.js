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
    setTimeout(() => this.finish(), 20000);

    this.spectrogram3d = new Spectrogram3d();
    Scene3d.add(this.spectrogram3d);
  }

  update() {
    this.game.spectrogram = Audio.getSpectrogram();
    this.spectrogram3d.update(this.game.spectrogram);

    Scene3d.updateCameraCapture(this);
  }

  render() {
    this.game.debug.text('CAPTURING...', 4, 40);
  }

  finish() {
    this.game.state.start('play');
  }

  shutdown() {
    Scene3d.remove(this.spectrogram3d);
  }
}

export default new Capture();
