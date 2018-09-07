var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser-example');

game.state.add('main', { preload: preload, create: create, update: update, render: render });  
game.state.start('main');

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

var walls;
var coins;
var enemies;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
  game.load.image('background', 'assets/images/background2.png');

  game.load.image('wall', 'img/wall.png');
  game.load.image('coin', 'img/bird.png');
  game.load.image('enemy', 'img/enemy.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  bg = game.add.tileSprite(0, 0, game.width, game.height, 'background');

  player = game.add.sprite(32, 320, 'dude');
  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.gravity.y = 1000;
  player.body.maxVelocity.y = 500;
  player.body.setSize(20, 32, 5, 16);

  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('turn', [4], 20, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  walls = game.add.group();
  coins = game.add.group();
  enemies = game.add.group();

  const input = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10];
  createLevel(input);
}

function createLevel(input) {
  const level = [];

  const resolution = 50;
  const verticalLength = input.reduce((result, i) => Math.max(result, i)) + 1; // always left at least one blank space
  const horizontalLength = input.length;

  for (var y = 0; y < verticalLength; y++) {
    level[y] = [];
    for (var x = 0; x < horizontalLength; x++) {
      if (x === 0 || x === horizontalLength - 1) {
        level[y][x] = ' ';
      }
      else if (y > verticalLength - input[x]) {
        level[y][x] = 'x';
      }
      else if (y === verticalLength - 1) {
        level[y][x] = 'x';
      }
      else {
        level[y][x] = ' ';
      }
    }
  }

  createLevelSprites(level);

  /*
  // Level sample
  // x = wall, o = coin, ! = lava.
  createLevelSprites([
    'xxxxxxxxxxxxxxxxxxxxxx',
    '          !          x',
    '                  o  x',
    '                  o  x',
    '                  o  x',
    '          o          x',
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

  const tileWidth = game.width / horizontalLength;
  const tileHeight = game.height / verticalLength;

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
  game.physics.arcade.collide(player, walls);
  game.physics.arcade.overlap(player, coins, takeCoin, null, this)
  game.physics.arcade.overlap(player, enemies, restart, null, this);

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
  
  // if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
  if (jumpButton.isDown && player.body.touching.down && game.time.now > jumpTimer) {
    player.body.velocity.y = -500;
    jumpTimer = game.time.now + 750;
  }
}

function render () {
  // game.debug.text(game.time.physicsElapsed, 32, 32);
  // game.debug.body(player);
  game.debug.bodyInfo(player, 16, 24);
}

function takeCoin (player, coin) {
  // console.log('takeCoin', player, coin)
  coin.kill();
}

function restart(player, enemy) {
  // console.log('restart', player, enemy)
  game.state.start('main');
}

export default {
  restart,
}
