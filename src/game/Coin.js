import Config from '../Config';
import Coin3d from '../3d/Coin3d';
import Scene3d from '../3d/Scene3d';

class Coin extends Phaser.Sprite {
  constructor(game, x, y, index) {
    super(game, x, y);

    this.width = Config.tileHeight;
    this.height = Config.tileHeight;

    this.game.physics.arcade.enable(this);

    this.coin3d = new Coin3d(this, index);
    Scene3d.add(this.coin3d);

    this.events.onKilled.add(this.onRemove, this);
    this.events.onDestroy.add(this.onRemove, this);
  }

  update() {
    if (!this.alive) {
      return;
    }

    this.game.debug.body(this, '#ffff00');
  }

  onRemove() {
    Scene3d.remove(this.coin3d);
  }
}

export default Coin;
