var game = new Phaser.Game(1024, 768, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

  game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
  game.load.image('background', 'assets/images/background2.png');

  game.load.image('player', 'img/bird.png');
  game.load.image('wall', 'img/bird.png');
  game.load.image('coin', 'img/bird.png');
  game.load.image('enemy', 'img/bird.png');
}

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;


var walls;
var coins;
var enemies;

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

  // Design the level. x = wall, o = coin, ! = lava.
  var level = [
      'xxxxxxxxxxxxxxxxxxxxxx',
      '!         !          x',
      '!                 o  x',
      '!                 o  x',
      '!                 o  x',
      '!                 o  x',
      '!                 o  x',
      '!                 o  x',
      '!                 o  x',
      '!                 o  x',
      '!                 o  x',
      '!                 o  x',
      '!                 o  x',
      '!                 o  x',
      '!                 o  x',
      '!         o          x',
      '!                    x',
      '!     o   !    x     x',
      'xxxxxxxxxxxxxxxx!!!!!x',
  ];
  const tileWidth = 20;
  const tileHeight = 40;
  // Create the level by going through the array
  for (var i = 0; i < level.length; i++) {
    for (var j = 0; j < level[i].length; j++) {

      // Create a wall and add it to the 'walls' group
      if (level[i][j] == 'x') {
        var wall = game.add.sprite(30+tileWidth*j, 30+tileHeight*i, 'wall');
        walls.add(wall);
        // wall.body.immovable = true; 
      }

      // Create a coin and add it to the 'coins' group
      else if (level[i][j] == 'o') {
        var coin = game.add.sprite(30+tileWidth*j, 30+tileHeight*i, 'coin');
        coins.add(coin);
        coin
        game.physics.arcade.enable(coin);
      }

      // Create a enemy and add it to the 'enemies' group
      else if (level[i][j] == '!') {
        var enemy = game.add.sprite(30+tileWidth*j, 30+tileHeight*i, 'enemy');
        enemies.add(enemy);
      }
    }
  }

}

function update() {

  // game.physics.arcade.collide(player, layer);
  // game.physics.arcade.collide(player, layer);

  // Make the player and the walls collide
  // game.physics.arcade.collide(player, walls);

  // Call the 'takeCoin' function when the player takes a coin
  game.physics.arcade.overlap(player, coins, takeCoin, null, this)


  // // Call the 'restart' function when the player touches the enemy
  // game.physics.arcade.overlap(player, enemies, restart, null, this);


  player.body.velocity.x = 0;

  if (cursors.left.isDown)
  {
    player.body.velocity.x = -150;

    if (facing != 'left')
    {
      player.animations.play('left');
      facing = 'left';
    }
  }
  else if (cursors.right.isDown)
  {
    player.body.velocity.x = 150;

    if (facing != 'right')
    {
      player.animations.play('right');
      facing = 'right';
    }
  }
  else
  {
    if (facing != 'idle')
    {
      player.animations.stop();

      if (facing == 'left')
      {
          player.frame = 0;
      }
      else
      {
          player.frame = 5;
      }

      facing = 'idle';
    }
  }
  
  if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
  {
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

  console.log('coin')

  coin.kill();

}

