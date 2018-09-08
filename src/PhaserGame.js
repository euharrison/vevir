import * as d3 from "d3";

import AI from './AI';
import Player from "./Player";

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

  createLevel();

  AI.nextGeneration();
}

function createLevel() {
  const level = [];

  const verticalLength = 20;
  const horizontalLength = 100;

  const maxInput = input.reduce((result, i) => Math.max(result, i));
  const maxFloorHeight = verticalLength / 2;

  const scaleVertical = d3.scaleLinear()
    .domain([0, maxInput])
    .range([0, maxFloorHeight])

  const scaledInput = input.map(i => scaleVertical(i));

  const scaleHorizontalIndex = d3.scaleLinear()
    .domain([0, scaledInput.length])
    .range([0, horizontalLength])

  const domainHorizontal = new Array(scaledInput.length).fill(0).map((v, index) => scaleHorizontalIndex(index));
  const scaleHorizontalValue = d3.scaleLinear()
    .domain(domainHorizontal)
    .range(scaledInput)

  const horizontalValues = new Array(horizontalLength).fill(0).map((v, index) => scaleHorizontalValue(index))

  for (var y = 0; y < verticalLength; y++) {
    level[y] = [];
    for (var x = 0; x < horizontalLength; x++) {
      if (y > verticalLength - horizontalValues[x] - 1) {
        level[y][x] = 'x';
      }
      else if (y > verticalLength - horizontalValues[x] - 2) {
        level[y][x] = Math.random() < 0.05 ? '!' : ' ';
      }
      else if (y > verticalLength - horizontalValues[x] - 3) {
        level[y][x] = Math.random() < 0.1 ? 'o' : ' ';
      }
      else {
        level[y][x] = ' ';//'o';
      }
    }
  }

  // debug
  // console.log(input)
  // console.log(level.map(row => `|${row.join('')}|`).join('\n'));

  createLevelSprites(level);

  /*
  // Level sample
  // x = wall, o = coin, ! = lava.
  createLevelSprites([
    'xxxxxxxxxxxxxxxxxxxxxx',
    '          !          x',
    '                  o  x',
    '          o          x',
    '                     x',
    'xxx   o   !    x     x',
    'xxxxxxxxxxxxxxxx!!!!!x',
  ]);
  //*/
}

function createLevelSprites(level) {
  const horizontalLength = level[0].length;
  const verticalLength = level.length;

  const tileWidth = game.world.width / horizontalLength;
  const tileHeight = game.world.height / verticalLength;

  for (var y = 0; y < verticalLength; y++) {
    for (var x = 0; x < horizontalLength; x++) {
      switch (level[y][x]) {

        // wall
        case 'x':
          const wall = game.add.sprite(tileWidth * x, tileHeight * y, 'wall');
          wall.width = tileWidth;
          wall.height = tileHeight;
          walls.add(wall);
          game.physics.arcade.enable(wall);
          wall.body.immovable = true;
          wall.body.allowGravity = false;
          break;

        // coin
        case 'o':
          const coin = game.add.sprite(tileWidth * x, tileHeight * y, 'coin');
          coins.add(coin);
          game.physics.arcade.enable(coin);
          break;

        // enemy
        case '!':
          const enemy = game.add.sprite(tileWidth * x, tileHeight * y, 'enemy');
          enemies.add(enemy);
          game.physics.arcade.enable(enemy);
          break;
      }
    }
  }
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
  game.physics.arcade.collide(player, walls);
  game.physics.arcade.overlap(player, coins, takeCoin, null, this);
  game.physics.arcade.overlap(player, enemies, killPlayer, null, this);

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
