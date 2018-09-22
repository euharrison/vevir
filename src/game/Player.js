import AI from './AI';
import Config from '../Config';
import Player3d from '../3d/Player3d';
import Scene3d from '../3d/Scene3d';

class Player extends Phaser.Sprite {
  constructor(index, game, level) {
    super(game, 50, (Config.verticalTiles-3) * Config.tileHeight);

    this.width = Config.tileHeight;
    this.height = Config.tileHeight;

    this.game.physics.arcade.enable(this);

    this.body.gravity.y = Config.playerGravity;
    this.body.maxVelocity.y = Config.playerJump;

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    this.level = level;
    this.index = index;
    this.score = 0;
    this.coins = 0;

    this.humanControl = Config.humanControl && index === 0;
    if (this.humanControl) {
      this.facing = 'left';
      this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    this.player3d = new Player3d(index);
    Scene3d.add(this.player3d);

    this.events.onKilled.add(this.onRemove, this);
    this.events.onDestroy.add(this.onRemove, this);
  }

  update() {
    if (!this.alive) {
      return;
    }

    this.game.debug.body(this, '#0000ff');

    this.body.velocity.x = 0;
    if (this.humanControl) {
      this.computeAI(true);
      this.updateByHuman();
    } else {
      this.updateByAI();
    }

    this.player3d.update(this);
  }

  updateByHuman() {
    if (this.cursors.right.isDown) {
      this.body.velocity.x = Config.playerVelocity;
    }
    else if (this.cursors.left.isDown) {
      this.body.velocity.x = -Config.playerVelocity;
    }

    // TODO usar o player.body.onFloor()
    if (this.cursors.up.isDown && this.body.touching.down) {
      this.jump();
    }
  }

  updateByAI() {
    const brain = this.computeAI();

    if (brain.goRight && !brain.goLeft) {
      this.body.velocity.x = Config.playerVelocity;
    }
    
    if (brain.goLeft && !brain.goRight) {
      this.body.velocity.x = -Config.playerVelocity;
    }

    if (brain.jump && this.body.touching.down) {
      this.jump();
    }
  }

  jump() {
    this.body.velocity.y = -Config.playerJump;
  }

  computeAI(debug) {
    const enemyX = this.getNearstX(this.level.enemies[this.index]);
    const enemyDist = enemyX - this.position.x;
    const enemyPercent = Math.min(enemyDist/400, 1);

    const floorX = this.getNearstX(this.level.floors);
    const floorDist = floorX - this.position.x;
    const floorPercent = Math.min(floorDist/400, 1);

    const coinX = this.getNearstX(this.level.coins[this.index]);
    const coinDist = coinX - this.position.x;
    const coinPercent = Math.min(coinDist/400, 1);

    const input = [
      enemyPercent,
      // floorPercent,
      // coinPercent,
    ];

    const output = AI.compute(this.index, input).map(o => Math.round(o));

    if (debug) {
      // console.log(output, input)
    }

    return {
      goRight: true, //output[0],
      goLeft: false, //output[1],
      jump: output[0], //output[2],
    };
  }

  getNearstX() {
    let closerX = Infinity;
    this.level.enemies[this.index].children.forEach(item => {
      if (
        item.position.x > this.position.x &&
        item.position.x < closerX
      ) {
        closerX = item.position.x;
      }
    });
    return closerX;
  }

  getScore() {
    return Math.pow((
      this.position.x +
      this.coins * (Config.horizontalTiles * Config.tileWidth * 0.5)
    )/1000, 2);
  }

  onRemove() {
    AI.setScore(this.index, this.getScore());

    Scene3d.remove(this.player3d);
    this.level.removeSimulation(this.index);
  }
}

export default Player;
