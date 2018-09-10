import Enemy3d from '../3d/Enemy3d';
import Scene3d from '../3d/Scene3d';

class Enemy extends Phaser.Sprite {
  constructor(game, index, x, y) {
    super(game, x, y);

    this.width = 30;
    this.height = 30;

    this.game.physics.arcade.enable(this);

    this.enemy3d = new Enemy3d(this, index);
    Scene3d.add(this.enemy3d);

    this.events.onKilled.add(this.remove3d, this);
    this.events.onDestroy.add(this.remove3d, this);
  }

  update() {
    if (!this.alive) {
      return;
    }

    this.game.debug.body(this, '#ff0000');
  }

  remove3d() {
    Scene3d.remove(this.enemy3d);
  }
}

export default Enemy;
