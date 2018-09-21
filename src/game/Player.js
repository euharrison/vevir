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
    this.jumpTimer = 0;
    this.jumpCount = 0;

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
    if (this.cursors.up.isDown && this.body.touching.down && this.game.time.now > this.jumpTimer) {
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

    if (brain.jump && this.body.touching.down && this.game.time.now > this.jumpTimer) {
      this.jump();
    }
  }

  jump() {
    this.jumpCount++;

    this.body.velocity.y = -Config.playerJump;
    this.jumpTimer = this.game.time.now + (Config.playerJump * 1.5);
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

    const forwards = this.level.floors.children.filter(w => w.position.x > playerX);

    let closerX = Infinity;
    forwards.forEach(w => {
      closerX = Math.min(closerX, w.position.x);
    });

    const neighbors = forwards.filter(w => w.position.x === closerX);

    let yDest = Config.gameHeight;
    neighbors.forEach(w => {
      yDest = Math.min(yDest, w.position.y);
    });

    // TODO entender melhor o comportamento da rede, pois nemo Math.random está deixando "aleatório"
    const input = [
      // playerY / Config.gameHeight,
      // yDest / Config.gameHeight,

      // playerX / Config.gameWidth,
      // this.getNextEnemyX() / Config.gameWidth,

      this.getInput(),

      // coinDistanceX,
      // coinDistanceY,
      // can jump
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

  getNextEnemyX() {
    const playerX = this.position.x;
    const children = this.level.enemies[this.index].children;
    const forwards = children.filter(w => w.position.x > playerX);
    let closerX = Infinity;
    forwards.forEach(w => {
      closerX = Math.min(closerX, w.position.x);
    });
    return closerX;
  }

  getInput() {
    let playerDist = (this.getNextEnemyX() - this.position.x);
    if (playerDist > 400) {
      playerDist = 400;
    }
    return playerDist / 400;
  }

  getScore() {
    return this.position.x * this.position.x; // - (this.jumpCount * 10);
  }

  onRemove() {
    // TODO usar a position.x e a quantidade de moedas como score
    // console.log('JUMP', this.jumpCount, this.position.x, this.getScore())
    AI.setScore(this.index, this.getScore());

    Scene3d.remove(this.player3d);
    this.level.removeSimulation(this.index);
  }
}

export default Player;
