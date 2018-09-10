import AI from './AI';
import Config from '../Config';
import Player3d from '../3d/Player3d';
import Scene3d from '../3d/Scene3d';

class Player extends Phaser.Sprite {
  constructor(index, game, level) {
    super(game, 50, 300);

    this.width = 20;
    this.height = 30;

    this.game.physics.arcade.enable(this);

    this.body.gravity.y = 1000;
    this.body.maxVelocity.y = 500;

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    this.level = level;
    this.index = index;
    this.score = 0;
    this.jumpTimer = 0;

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
      // this.computeAI(true);
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
    if (this.cursors.up.isDown && this.body.touching.down && this.game.time.now > this.jumpTimer) {
      this.body.velocity.y = -Config.playerJump;
      this.jumpTimer = this.game.time.now + (Config.playerJump * 1.5);
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

    if (brain.jump && this.body.touching.down && this.game.time.now > this.jumpTimer) {
      this.body.velocity.y = -Config.playerJump;
      this.jumpTimer = this.game.time.now + (Config.playerJump * 1.5);
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
    const coin = { position:{ x: 100, y: 100 } };//this.level.coins.children[0];
    const coinX = coin.position.x;
    const coinY = coin.position.y;

    const coinDistanceX = (coinX - playerX) / this.game.world.width;
    const coinDistanceY = (coinY - playerY) / this.game.world.height;

    // TODO entender melhor o comportamento da rede, pois nemo Math.random está deixando "aleatório"
    const input = [
      Math.random(),
      Math.random(),
      // coinDistanceX,
      // coinDistanceY,
      // can jump
    ];

    const output = AI.compute(this.index, input).map(o => Math.round(o));

    if (debug) {
      console.log(output, input)
    }

    return {
      goRight: true, //output[0],
      goLeft: false, //output[1],
      jump: output[0], //output[2],
    };
  }

  onRemove() {
    // TODO usar a position.x e a quantidade de moedas como score
    AI.setScore(this.index, this.position.x);

    Scene3d.remove(this.player3d);
    this.level.removeSimulation(this.index);
  }
}

export default Player;
