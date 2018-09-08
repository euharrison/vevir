import * as d3 from "d3";

import AI from './AI';
import Player from "./Player";
import LevelGenerator from "./LevelGenerator";

const devMode = true;

const totalPlayers = 10;

const gameWidth = 1920/2;
const gameHeight = 1080/2;

// const worldWidth = gameWidth;
const worldWidth = gameWidth * 2;
const worldHeight = gameHeight;

const game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'phaser');

game.state.add('main', { preload: preload, create: create, update: update, render: render });  
game.state.start('main');

game.desiredFps = 2;

let players = [];
let firstPlayer;
let facing = 'left';
let jumpTimer = 0;
let cursors;
let jumpButton;
let bg;

let walls;
let coins;
let enemies;

let input = [121, 140, 142, 128, 122, 116, 97, 66, 62, 49, 23, 0, 0, 0, 0, 0];

let maxScore = 0;

let level;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
  game.load.image('background', 'assets/images/background2.png');

  game.load.image('wall', 'img/wall.png');
  game.load.image('coin', 'img/bird.png');
  game.load.image('enemy', 'img/enemy.png');
}

function create() {
  game.world.setBounds(0, 0, worldWidth, worldHeight);

  game.physics.startSystem(Phaser.Physics.ARCADE);

  bg = game.add.tileSprite(0, 0, game.width, game.height, 'background');

  players = [];
  for (let i = 0; i < totalPlayers; i++) {
    const player = new Player(game, i);

    player.checkWorldBounds = true;
    player.events.onOutOfBounds.add(killPlayer, this);

    players.push(player);
  }

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  walls = game.add.group();
  coins = game.add.group();
  enemies = game.add.group();

  level = new LevelGenerator(game);
  level.create(input)

  AI.nextGeneration();
}

function update() {
  players.forEach(updatePlayer);

  firstPlayer = null;
  players.forEach(player => {
    if (!player.alive) return;
    if (!firstPlayer || player.x > firstPlayer.x) {
      firstPlayer = player;
    }
  })

  if (!firstPlayer) {
    restart();
  } else {
    game.camera.follow(firstPlayer, undefined, 0.1, 0.1);
  }
}

function updatePlayer(player) {
  game.physics.arcade.collide(player, level.walls);
  game.physics.arcade.overlap(player, level.coins, takeCoin, null, this);
  game.physics.arcade.overlap(player, level.enemies, killPlayer, null, this);

  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -150;

    if (facing != 'left') {
      player.animations.play('left');
      facing = 'left';
    }
  }
  else if (cursors.right.isDown) {
    player.body.velocity.x = 150;

    if (facing != 'right') {
      player.animations.play('right');
      facing = 'right';
    }
  }
  else {
    if (facing != 'idle') {
      player.animations.stop();

      if (facing == 'left') {
        player.frame = 0;
      } else {
        player.frame = 5;
      }

      facing = 'idle';
    }
  }

  if (firstPlayer && firstPlayer.index === player.index) {
    // if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
    if (jumpButton.isDown && player.body.touching.down && game.time.now > jumpTimer) {
      player.body.velocity.y = -500;
      jumpTimer = game.time.now + 750;
    }
  } else {
    // TODO transformar o gameState em class
    // e passar para a AI processar usando qq variável
    // possíveis variáveis:
      // local da moeda mais próxima
      // local do inimigo mais próximo
      // relevo a frente e p tras
      // olhar aquele link de ref
    const inputs = [
      player.position.x / game.world.width,
      player.position.y / game.world.height,
      // coins.children[0].position.x,
      // coins.children[0].position.y,
      // can jump
    ];
    const result = AI.compute(player.index, inputs);
    // console.log(result, player.index, inputs)

    if (result > 0.5) {
      player.body.velocity.x = 150;
    } else {
      player.body.velocity.x = -150;
    }
  }
}

function render() {
  if (devMode) {
    // game.debug.text(game.time.physicsElapsed, 20, 20);
    // game.debug.cameraInfo(game.camera, 20, 20);

    game.debug.text(`Score: ${firstPlayer ? firstPlayer.score : 0}`, 20, 40);
    game.debug.text(`Max Score: ${maxScore}`, 20, 60);
    game.debug.text(`Generation: ${AI.generationAmount}`, 20, 80);
    game.debug.text(`Alives: ${players.filter(p => p.alive).length}`, 20, 100);

    if (firstPlayer) {
      // game.debug.body(firstPlayer);
      // game.debug.bodyInfo(firstPlayer, 20, 20);
      game.debug.spriteCoords(firstPlayer, 20, 450);
    }
  }
}

function takeCoin(player, coin) {
  // console.log('takeCoin', player, coin)
  player.score++;

  maxScore = Math.max(maxScore, player.score);

  coin.kill();
}

function killPlayer(player, coin) {
  // console.log('killPlayer', player, coin)
  player.kill();
}

function restart() {
  console.log('restart');

  players.forEach(p => AI.setScore(p.index, p.score));

  game.state.start('main');
}

function updateLevel(_input) {
  input = _input;
  restart();
}

export default {
  restart,
  updateLevel,
}
