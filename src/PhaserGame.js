var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser-example');

game.state.add('main', { preload: preload, create: create, update: update, render: render });  
game.state.start('main');

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;


var map;
var layer;

var walls;
var coins;
var enemies;

function preload() {
  game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
  game.load.image('background', 'assets/images/background2.png');

  game.load.image('wall', 'img/wall.png');
  game.load.image('coin', 'img/bird.png');
  game.load.image('enemy', 'img/enemy.png');


  game.load.tilemap('level1', 'assets/games/starstruck/level1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles-1', 'assets/games/starstruck/tiles-1.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  bg = game.add.tileSprite(0, 0, game.width, game.height, 'background');

  player = game.add.sprite(32, 320, 'dude');
  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.collideWorldBounds = true;
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


    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  Add a Tileset image to the map
    map.addTilesetImage('wall');

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    layer = map.create('level1', 40, 30, 32, 32);
    layer.scrollFactorX = 0.5;
    layer.scrollFactorY = 0.5;

    //  Resize the world
    layer.resizeWorld();

    console.log(layer.getTileX(40))

    map.putTile(60, 
      1,
      1, 
      layer);


    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    // layer.resizeWorld();


  createLevel();
}

function createLevel() {
  // Design the level. x = wall, o = coin, ! = lava.
  var level = [
      'xxxxxxxxxxxxxxxxxxxxxx',
      '          !          x',
      '                  o  x',
      '                  o  x',
      '                  o  x',
      '                  o  x',
      '                  o  x',
      '                  o  x',
      '                  o  x',
      '                  o  x',
      '                  o  x',
      '                  o  x',
      '                  o  x',
      '                  o  x',
      '                  o  x',
      '          o          x',
      '                     x',
      'xxx   o   !    x     x',
      'xxxxxxxxxxxxxxxx!!!!!x',
  ];

  const initalX = -20;
  const tileWidth = 20;
  const tileHeight = 40;

  // Create the level by going through the array
  for (var i = 0; i < level.length; i++) {
    for (var j = 0; j < level[i].length; j++) {

      // Create a wall and add it to the 'walls' group
      if (level[i][j] == 'x') {
        // var wall = game.add.sprite(30+tileWidth*j, 30+tileHeight*i, 'wall');
        // walls.add(wall);
        // game.physics.arcade.enable(wall);
        // wall.body.immovable = true;

        var tilesprite = game.add.tileSprite(30+tileWidth*j, 30+tileHeight*i, tileWidth, tileHeight, 'wall');
        walls.add(tilesprite);
        game.physics.arcade.enable(tilesprite);
        // game.physics.enable([ ball, tilesprite ], Phaser.Physics.ARCADE);

        // ball.body.collideWorldBounds = true;
        // ball.body.bounce.set(1);

        // tilesprite.body.collideWorldBounds = true;
        tilesprite.body.immovable = true;
        tilesprite.body.allowGravity = false;
      }

      // Create a coin and add it to the 'coins' group
      else if (level[i][j] == 'o') {
        var coin = game.add.sprite(30+tileWidth*j, 30+tileHeight*i, 'coin');
        coins.add(coin);
        game.physics.arcade.enable(coin);
      }

      // Create a enemy and add it to the 'enemies' group
      else if (level[i][j] == '!') {
        var enemy = game.add.sprite(30+tileWidth*j, 30+tileHeight*i, 'enemy');
        enemies.add(enemy);
        game.physics.arcade.enable(enemy);
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
