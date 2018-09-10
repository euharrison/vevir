import Config from '../Config';
import AI from './AI';
import Player from "./Player";
import LevelGenerator from "./LevelGenerator";

class Play extends Phaser.State {
  constructor() {
    super();
    this.key = 'play';
    this.maxScore = 0;
    this.levelInput = [121, 140, 142, 128, 122, 116, 97, 66, 62, 49, 23, 10, 8, 12, 0, 0];
  }

  preload() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.game.load.spritesheet('player', 'assets/images/dude.png', 32, 48);
    this.game.load.image('background', 'assets/images/background2.png');

    this.game.load.image('wall', 'img/wall.png');
    this.game.load.image('coin', 'img/bird.png');
    this.game.load.image('enemy', 'img/enemy.png');
  }

  create() {
    this.game.world.setBounds(0, 0, this.game.width * Config.levelWidth, this.game.height);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

    this.level = new LevelGenerator(this.game);
    this.level.create(this.levelInput);

    this.players = this.game.add.group();
    for (let i = 0; i < Config.population; i++) {
      this.players.add(
        new Player(i, this.game, this.level)
      );
    }

    AI.nextGeneration();

    this.gameTimer = setTimeout(() => this.restart(), 2000);
  }

  update() {
    this.game.physics.arcade.collide(this.players, this.level.walls);
    this.game.physics.arcade.overlap(this.players, this.level.coins, this.takeCoin, null, this);
    this.game.physics.arcade.overlap(this.players, this.level.enemies, this.killPlayer, null, this);

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
    // coin.kill();
    player.score++;
    this.maxScore = Math.max(this.maxScore, player.score);
  }

  killPlayer(player, coin) {
    // console.log('killPlayer', player, coin)
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
