import Config from '../Config';
import AI from './AI';
import Audio from './Audio';
import Player from './Player';
import Level from './Level';
import ColorManager from '../3d/ColorManager';
import Scene3d from '../3d/Scene3d';

class Play extends Phaser.State {
  constructor() {
    super();
    this.key = 'play';
    this.maxScore = 0;
  }

  create() {
    Scene3d.enableFog();

    Scene3d.camera.near = 600;
    Scene3d.camera.far = 20000;
    Scene3d.camera.updateProjectionMatrix();

    ColorManager.shuffle();

    this.game.camera.x = -300;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.level = new Level(this.game);
    this.game.tiles.forEach((tile) => this.level.createTile(tile));

    this.players = this.game.add.group();
    for (let i = 0; i < Config.population; i++) {
      this.players.add(
        new Player(i, this.game, this.level)
      );
    }

    AI.nextGeneration();

    this.restartTimeoutId = setTimeout(() => this.restart(), Config.restartTime);
  }

  update() {
    // this.game.physics.arcade.collide(this.players, this.level.floors);

    for (let i = 0; i < Config.population; i++) {
      this.game.physics.arcade.overlap(this.players.children[i], this.level.coins[i], this.takeCoin, null, this);
      this.game.physics.arcade.overlap(this.players.children[i], this.level.enemies[i], this.killPlayer, null, this);
      this.game.physics.arcade.overlap(this.players.children[i], this.level.checkpoints[i], this.takeCheckpoint, null, this);
    }

    this.firstPlayer = null;
    this.players.children.forEach(player => {
      if (!player.alive) return;
      if (!this.firstPlayer || player.x > this.firstPlayer.x) {
        this.firstPlayer = player;
      }
    })
    if (Config.humanControl && this.players.children[0].alive) {
      this.firstPlayer = this.players.children[0];
    }

    if (!this.firstPlayer) {
      this.restart();
    } else {
      this.game.camera.follow(this.firstPlayer, undefined, 0.05, 0.05);
    }

    Scene3d.updateCamera(this.camera);

    // back to capture mode if speak loud
    const volume = Audio.getVolume();
    if (Config.changeOnSpeak && volume > 30) {
      if (!this.audioTimeout) {
        this.audioTimeout = setTimeout(() => {
          this.game.state.start('capture');
        }, 500);
      }
    } else {
      clearTimeout(this.audioTimeout);
      this.audioTimeout = null;
    }
  }

  render() {
    this.game.debug.text(this.game.time.fps, 0, 40);

    // this.game.debug.text(this.game.time.physicsElapsed, 20, 20);
    // this.game.debug.cameraInfo(this.game.camera, 20, 20);

    this.game.debug.text(`Score: ${this.firstPlayer ? this.firstPlayer.score : 0}`, 20, 40);
    this.game.debug.text(`Max Score: ${this.maxScore}`, 20, 60);
    this.game.debug.text(`Generation: ${AI.generationAmount}`, 20, 80);
    this.game.debug.text(`Alives: ${this.players.children.filter(p => p.alive).length}`, 20, 100);

    lastScore.forEach((s, i) => {
      this.game.debug.text(`${s}`, 20, 120 + i*20);
    })


    this.players.children.forEach((p, i) => {
      // if (p.alive) this.game.debug.text(`${p.getNextEnemyX()}`, 220, 120 + i*20);
    })

    if (this.firstPlayer) {
      // this.game.debug.body(this.firstPlayer);
      // this.game.debug.bodyInfo(this.firstPlayer, 20, 20);
      // this.game.debug.spriteCoords(this.firstPlayer, 20, 450);
    }
  }

  takeCoin(player, coin) {
    coin.kill();
    player.coins++;
    this.maxScore = Math.max(this.maxScore, player.getScore());
  }

  killPlayer(player, enemy) {
    player.kill();
  }

  takeCheckpoint(player, checkpoint) {
    checkpoint.kill();
    player.checkpoints++;
  }

  restart() {
    this.game.state.restart();
  }

  shutdown() {
    lastScore = this.players.children.map(p => p.getScore());
    
    clearTimeout(this.restartTimeoutId);
  }
}

let lastScore = [];

export default new Play();
