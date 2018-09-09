import * as d3 from "d3";

import Config from './Config';
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
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.load.spritesheet('player', 'assets/images/dude.png', 32, 48);
    game.load.image('background', 'assets/images/background2.png');

    game.load.image('wall', 'img/wall.png');
    game.load.image('coin', 'img/bird.png');
    game.load.image('enemy', 'img/enemy.png');
  }

  create() {
    game.world.setBounds(0, 0, game.width * Config.worldWidth, game.height);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, game.width, game.height, 'background');

    this.level = new LevelGenerator(game);
    this.level.create(this.levelInput);

    this.players = game.add.group();
    for (let i = 0; i < Config.population; i++) {
      const player = new Player(i, game, this.level);
      this.players.add(player);
      player.checkWorldBounds = true;
      player.events.onOutOfBounds.add(this.killPlayer);
    }

    AI.nextGeneration();

    this.gameTimer = setTimeout(() => this.restart(), 7000);
  }

  update() {
    game.physics.arcade.collide(this.players, this.level.walls);
    game.physics.arcade.overlap(this.players, this.level.coins, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.players, this.level.enemies, this.killPlayer, null, this);

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
      game.camera.follow(this.firstPlayer, undefined, 0.1, 0.1);
    }
  }

  render() {
    if (Config.devMode) {
      // game.debug.text(game.time.physicsElapsed, 20, 20);
      // game.debug.cameraInfo(game.camera, 20, 20);

      game.debug.text(`Score: ${this.firstPlayer ? this.firstPlayer.score : 0}`, 20, 40);
      game.debug.text(`Max Score: ${this.maxScore}`, 20, 60);
      game.debug.text(`Generation: ${AI.generationAmount}`, 20, 80);
      game.debug.text(`Alives: ${this.players.children.filter(p => p.alive).length}`, 20, 100);

      if (this.firstPlayer) {
        // game.debug.body(this.firstPlayer);
        // game.debug.bodyInfo(this.firstPlayer, 20, 20);
        game.debug.spriteCoords(this.firstPlayer, 20, 450);
      }
    }
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

    game.state.restart();
  }

  updateLevel(input) {
    this.levelInput = input;
    this.restart();
  }
}

const game = new Phaser.Game(Config.screenWidth/2, Config.screenHeight/2, Phaser.AUTO, 'game');
const play = new Play();

game.state.add('play', play);  
game.state.start('play');

export default play;
