import Config from '../Config';

class Capture extends Phaser.State {
  constructor() {
    super();
    this.key = 'capture';
  }

  create() {
    console.log('capture create')

    setTimeout(() => this.finish(), 2000);
  }

  update() {

  }

  render() {
    this.game.debug.text('CAPTURING...', 4, 40);
  }

  finish() {
    console.log('capture finish')
    this.game.state.start('play');
  }
}

export default new Capture();
