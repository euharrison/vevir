import Config from '../Config';
import AI from './AI';
import Player from "./Player";
import Level from "./Level";

class Play extends Phaser.State {
  constructor() {
    super();
    this.key = 'play';
    this.maxScore = 0;
    this.levelInput = [121, 140, 142, 128, 122, 116, 97, 66, 62, 49, 23, 10, 8, 12, 0, 0];
  }

  preload() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.time.advancedTiming = true;
  }

  create() {
    this.game.world.setBounds(0, 0, Config.tileWidth*Config.horizontalTiles, Config.tileHeight*Config.verticalTiles);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.level = new Level(this.game, this.levelInput);

    this.players = this.game.add.group();
    for (let i = 0; i < Config.population; i++) {
      this.players.add(
        new Player(i, this.game, this.level)
      );
    }

    AI.nextGeneration();

    this.gameTimer = setTimeout(() => this.restart(), Config.restartTime);
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

    if (!this.firstPlayer) {
      this.restart();
    } else {
      this.game.camera.follow(this.focusPlayer(), undefined, 0.1, 0.1);
    }
  }

  render() {
    if (Config.devMode) {
      game.debug.text(this.game.time.fps, 0, 40);   

      // this.game.debug.text(this.game.time.physicsElapsed, 20, 20);
      // this.game.debug.cameraInfo(this.game.camera, 20, 20);

      // this.game.debug.text(`Score: ${this.focusPlayer() ? this.focusPlayer().score : 0}`, 20, 40);
      // this.game.debug.text(`Max Score: ${this.maxScore}`, 20, 60);
      // this.game.debug.text(`Generation: ${AI.generationAmount}`, 20, 80);
      // this.game.debug.text(`Alives: ${this.players.children.filter(p => p.alive).length}`, 20, 100);

      if (this.focusPlayer()) {
        // this.game.debug.body(this.focusPlayer());
        // this.game.debug.bodyInfo(this.focusPlayer(), 20, 20);
        // this.game.debug.spriteCoords(this.focusPlayer(), 20, 450);
      }
    }
  }

  focusPlayer() {
    return Config.humanControl ? this.players.children[0] : this.firstPlayer;
  }

  takeCoin(player, coin) {
    // console.log('takeCoin', player, coin)
    coin.kill();
    player.score++;
    this.maxScore = Math.max(this.maxScore, player.score);
  }

  killPlayer(player, enemy) {
    // console.log('killPlayer', player, enemy)
    player.kill();
  }

  restart() {
    // console.log('restart');
    clearTimeout(this.gameTimer);
    this.players.children.forEach(p => AI.setScore(p.index, p.score));

    this.game.state.restart();
  }

  updateLevel(input) {
    this.levelInput = input;
    this.restart();
  }
}

const config = {
  width: Config.gameWidth,
  height: Config.gameHeight,
  renderer: Config.devMode ? Phaser.AUTO : Phaser.HEADLESS,
  antialias: false,
  parent: 'game',
}
const game = new Phaser.Game(config);
const play = new Play();

game.state.add('play', play);  
game.state.start('play');

export default play;
