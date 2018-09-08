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
  }

  update() {
    // if (this.alive) console.log('update', this.index)
  }
}

export default Player;
