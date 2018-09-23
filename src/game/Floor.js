import Config from '../Config';
import Floor3d from '../3d/Floor3d';
import Scene3d from '../3d/Scene3d';

class Floor extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y);

    this.width = Config.tileWidth;
    this.height = Config.tileHeight;

    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;

    // this.floor3d = new Floor3d(this);
    // Scene3d.add(this.floor3d);

    this.events.onKilled.add(this.onRemove, this);
    this.events.onDestroy.add(this.onRemove, this);
  }

  update() {
    if (!this.alive) {
      return;
    }

    this.game.debug.body(this, '#00ff00');
  }

  onRemove() {
    // Scene3d.remove(this.floor3d);
  }
}

export default Floor;
