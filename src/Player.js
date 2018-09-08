class Player extends Phaser.Sprite {
  constructor(game, index) {
    super(game, (index === 4 ? 400 : Math.random()*100), 100, 'player');

    game.physics.arcade.enable(this);

    this.body.gravity.y = 1000;
    this.body.maxVelocity.y = 500;
    this.body.setSize(20, 32, 5, 16);

    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('turn', [4], 20, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);

    this.index = index;
    this.score = 0;

    this.humanControl = (index === 4);
    if (this.humanControl) {
      this.facing = 'left';
      this.jumpTimer = 0;
      this.cursors = this.game.input.keyboard.createCursorKeys();
    }
  }

  update() {
    if (this.humanControl) {
      this.updateByHuman();
    }
  }

  updateByHuman() {
    if (!this.alive) {
      return;
    }

    this.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      this.body.velocity.x = -150;

      if (this.facing !== 'left') {
        this.animations.play('left');
        this.facing = 'left';
      }
    }
    else if (this.cursors.right.isDown) {
      this.body.velocity.x = 150;

      if (this.facing !== 'right') {
        this.animations.play('right');
        this.facing = 'right';
      }
    }
    else {
      if (this.facing !== 'idle') {
        this.animations.stop();

        if (this.facing === 'left') {
          this.frame = 0;
        } else {
          this.frame = 5;
        }

        this.facing = 'idle';
      }
    }

    // TODO usar o player.body.onFloor()
    if (this.cursors.up.isDown && this.body.touching.down && this.game.time.now > this.jumpTimer) {
      this.body.velocity.y = -500;
      this.jumpTimer = this.game.time.now + 750;
    }
  }
}

export default Player;
