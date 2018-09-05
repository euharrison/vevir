
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

// Create the state that will contain the whole game
var mainState = {  
  preload: function() {  
    game.load.image('player', 'img/bird.png');
    game.load.image('wall', 'img/bird.png');
    game.load.image('coin', 'img/bird.png');
    game.load.image('enemy', 'img/bird.png');
  },

  create: function() {  
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');

    game.physics.arcade.gravity.y = 250;

    this.player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.body.bounce.y = 0.2;
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(20, 32, 5, 16);

    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('turn', [4], 20, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  //   // Set the background color to blue
  //   game.stage.backgroundColor = '#3598db';

  //   // Start the Arcade physics system (for movements and collisions)
  //   game.physics.startSystem(Phaser.Physics.ARCADE);

  //   // Add the physics engine to all game objects
  //   game.world.enableBody = true;

  //   // Variable to store the arrow key pressed
  //   this.cursor = game.input.keyboard.createCursorKeys();

  //   // Create the player in the middle of the game
  //   this.player = game.add.sprite(70, 100, 'player');
  //   game.physics.enable(this.player, Phaser.Physics.ARCADE);

  //   // Add gravity to make it fall
  //   this.player.body.gravity.y = 600;

    // Create 3 groups that will contain our objects
    this.walls = game.add.group();
    this.coins = game.add.group();
    this.enemies = game.add.group();

    // Design the level. x = wall, o = coin, ! = lava.
    var level = [
        'xxxxxxxxxxxxxxxxxxxxxx',
        '!         !          x',
        '!                 o  x',
        '!         o          x',
        '!                    x',
        '!     o   !    x     x',
        'xxxxxxxxxxxxxxxx!!!!!x',
    ];
    // Create the level by going through the array
    for (var i = 0; i < level.length; i++) {
      for (var j = 0; j < level[i].length; j++) {

        // Create a wall and add it to the 'walls' group
        if (level[i][j] == 'x') {
          var wall = game.add.sprite(30+20*j, 30+20*i, 'wall');
          this.walls.add(wall);
          // wall.body.immovable = true; 
        }

        // Create a coin and add it to the 'coins' group
        else if (level[i][j] == 'o') {
          var coin = game.add.sprite(30+20*j, 30+20*i, 'coin');
          this.coins.add(coin);
        }

        // Create a enemy and add it to the 'enemies' group
        else if (level[i][j] == '!') {
          var enemy = game.add.sprite(30+20*j, 30+20*i, 'enemy');
          this.enemies.add(enemy);
        }
      }
    }

  },

  update: function() { 

    this.player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        this.player.body.velocity.x = -150;

        if (facing != 'left')
        {
            this.player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        this.player.body.velocity.x = 150;

        if (facing != 'right')
        {
            this.player.animations.play('right');
            // facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            this.player.animations.stop();

            if (facing == 'left')
            {
                this.player.frame = 0;
            }
            else
            {
                this.player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && this.player.body.onFloor() && game.time.now > jumpTimer)
    {
        this.player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

    // // Move the player when an arrow key is pressed
    // if (this.cursor.left.isDown) 
    //     this.player.body.velocity.x = -200;
    // else if (this.cursor.right.isDown) 
    //     this.player.body.velocity.x = 200;
    // else 
    //     this.player.body.velocity.x = 0;

    // // Make the player jump if he is touching the ground
    // console.log(this.cursor.up.isDown, this.player.body.onFloor())
    // if (this.cursor.up.isDown && this.player.body.onFloor()) 
    //     this.player.body.velocity.y = -250;


    // // if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    // // {
    // //     player.body.velocity.y = -500;
    // //     jumpTimer = game.time.now + 750;
    // // }
// blocked
    // Make the player and the walls collide
    game.physics.arcade.collide(this.player, this.walls);

    // Call the 'takeCoin' function when the player takes a coin
    game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this);

    // Call the 'restart' function when the player touches the enemy
    game.physics.arcade.overlap(this.player, this.enemies, this.restart, null, this);

  },

  // Function to kill a coin
  takeCoin: function(player, coin) {
    coin.kill();
  },

  // Function to restart the game
  restart: function() {
    game.state.start('main');
  }
};

// Initialize the game and start our state
var game = new Phaser.Game(500, 200);  
game.state.add('main', mainState);  
game.state.start('main');
