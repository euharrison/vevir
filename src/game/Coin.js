import Coin3d from '../3d/Coin3d';
import Scene3d from '../3d/Scene3d';

class Coin extends Phaser.Sprite {
  constructor(game, index, x, y) {
    super(game, x, y, 'coin');

    this.game.physics.arcade.enable(this);

    this.coin3d = new Coin3d(this, index);
    Scene3d.add(this.coin3d);

    this.events.onKilled.add(this.remove3d, this);
    this.events.onDestroy.add(this.remove3d, this);
  }

  remove3d() {
    Scene3d.remove(this.coin3d);
  }
}

export default Coin;
