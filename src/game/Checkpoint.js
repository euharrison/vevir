import Config from '../Config';
import Checkpoint3d from '../3d/Checkpoint3d';
import Scene3d from '../3d/Scene3d';

class Checkpoint extends Phaser.Sprite {
  constructor(game, x, y, index) {
    super(game, x, y - (Config.tileHeight*0.5));

    this.width = Config.tileHeight;
    this.height = Config.tileHeight * 2;

    this.game.physics.arcade.enable(this);

    this.checkpoint3d = new Checkpoint3d(this, index);
    Scene3d.add(this.checkpoint3d);

    this.events.onKilled.add(this.onRemove, this);
    this.events.onDestroy.add(this.onRemove, this);
  }

  update() {
    if (!this.alive) {
      return;
    }

    this.game.debug.body(this, '#00ffff');
  }

  onRemove() {
    Scene3d.remove(this.checkpoint3d);
  }
}

export default Checkpoint;
