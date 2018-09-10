import Config from '../Config';
import AI from './AI';
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
    this.game.world.setBounds(0, 0, Config.tileWidth*Config.horizontalTiles, Config.tileHeight*Config.verticalTiles);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    ColorManager.shuffle();

    this.level = new Level(this.game, this.game.spectrogram);

    this.players = this.game.add.group();
    for (let i = 0; i < Config.population; i++) {
      this.players.add(
        new Player(i, this.game, this.level)
      );
    }

    AI.nextGeneration();

    this.gameTimer = setTimeout(() => this.restart(), Config.restartTime*1000);
  }

  update() {
    this.game.physics.arcade.collide(this.players, this.level.walls);

    for (let i = 0; i < Config.population; i++) {
      this.game.physics.arcade.overlap(this.players.children[i], this.level.coins[i], this.takeCoin, null, this);
      this.game.physics.arcade.overlap(this.players.children[i], this.level.enemies[i], this.killPlayer, null, this);
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

    Scene3d.updateCameraPlay(this);
  }

  render() {
    this.game.debug.text(this.game.time.fps, 0, 40);

    // this.game.debug.text(this.game.time.physicsElapsed, 20, 20);
    this.game.debug.cameraInfo(this.game.camera, 20, 20);

    // this.game.debug.text(`Score: ${this.firstPlayer ? this.firstPlayer.score : 0}`, 20, 40);
    // this.game.debug.text(`Max Score: ${this.maxScore}`, 20, 60);
    // this.game.debug.text(`Generation: ${AI.generationAmount}`, 20, 80);
    // this.game.debug.text(`Alives: ${this.players.children.filter(p => p.alive).length}`, 20, 100);

    if (this.firstPlayer) {
      // this.game.debug.body(this.firstPlayer);
      // this.game.debug.bodyInfo(this.firstPlayer, 20, 20);
      // this.game.debug.spriteCoords(this.firstPlayer, 20, 450);
    }
  }

  takeCoin(player, coin) {
    coin.kill();
    player.score++;
    this.maxScore = Math.max(this.maxScore, player.score);
  }

  killPlayer(player, enemy) {
    player.kill();
  }

  restart() {
    clearTimeout(this.gameTimer);
    this.game.state.restart();
  }
}

export default new Play();
