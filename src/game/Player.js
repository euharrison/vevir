import AI from './AI';
import Config from '../Config';
import Player3d from '../3d/Player3d';
import Scene3d from '../3d/Scene3d';

class Player extends Phaser.Sprite {
  constructor(index, game, level) {
    super(game, 30 + index*10, 100, 'player');

    game.physics.arcade.enable(this);

    this.body.gravity.y = 1000;
    this.body.maxVelocity.y = 500;
    this.body.setSize(20, 32, 5, 16);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('turn', [4], 20, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);

    this.level = level;
    this.index = index;
    this.score = 0;
    this.jumpTimer = 0;

    this.humanControl = Config.humanControl && index === 0;
    if (this.humanControl) {
      this.facing = 'left';
      this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    this.player3d = new Player3d();
    this.player3d.position.z = -100 * index;
    Scene3d.add(this.player3d);

    this.events.onKilled.add(this.remove3d, this);
    this.events.onDestroy.add(this.remove3d, this);
  }

  update() {
    if (!this.alive) {
      return;
    }

    this.body.velocity.x = 0;
    if (this.humanControl) {
      // this.computeAI(true);
      this.updateByHuman();
    } else {
      this.updateByAI();
    }

    this.player3d.update(this);
  }

  updateByHuman() {
    if (this.cursors.left.isDown) {
      this.body.velocity.x = -150;

      if (this.facing !== 'left') {
        this.animations.play('left');
        this.facing = 'left';
      }
    }
    else if (this.cursors.right.isDown) {
      this.body.velocity.x = 150;

      if (this.facing !== 'right') {
        this.animations.play('right');
        this.facing = 'right';
      }
    }
    else {
      if (this.facing !== 'idle') {
        this.animations.stop();

        if (this.facing === 'left') {
          this.frame = 0;
        } else {
          this.frame = 5;
        }

        this.facing = 'idle';
      }
    }

    // TODO usar o player.body.onFloor()
    if (this.cursors.up.isDown && this.body.touching.down && this.game.time.now > this.jumpTimer) {
      this.body.velocity.y = -500;
      this.jumpTimer = this.game.time.now + 750;
    }
  }

  updateByAI() {
    const brain = this.computeAI();

    if (brain.goRight && !brain.goLeft) {
      this.body.velocity.x = 150;
    }
    
    if (brain.goLeft && !brain.goRight) {
      this.body.velocity.x = -150;
    }

    if (brain.jump && this.body.touching.down && this.game.time.now > this.jumpTimer) {
      this.body.velocity.y = -500;
      this.jumpTimer = this.game.time.now + 750;
    }
  }

  computeAI(debug) {
    // TODO
    // local da moeda mais próxima
    // local do inimigo mais próximo
    // relevo a frente e p tras
    // se pode ou não pular

    const playerX = this.position.x;
    const playerY = this.position.y;

    // TODO pegar a coin mais perto
    const coin = this.level.coins.children[0];
    const coinX = coin.position.x;
    const coinY = coin.position.y;

    const coinDistanceX = (coinX - playerX) / this.game.world.width;
    const coinDistanceY = (coinY - playerY) / this.game.world.height;

    const input = [
      coinDistanceX,
      coinDistanceY,
      // can jump
    ];

    const output = AI.compute(this.index, input).map(o => Math.round(o));

    if (debug) {
      console.log(output, input)
    }

    return {
      goRight: output[0],
      goLeft: output[1],
      jump: output[2],
    };
  }

  remove3d() {
    Scene3d.remove(this.player3d);
  }
}

export default Player;
