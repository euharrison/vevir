class Player {
  constructor(game, index) {
    const player = game.add.sprite((index === 4 ? 400 : Math.random()*100), 100, 'dude');
    game.physics.arcade.enable(player);

    player.body.gravity.y = 1000;
    player.body.maxVelocity.y = 500;
    player.body.setSize(20, 32, 5, 16); 

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    player.index = index;
    player.score = 0;

    return player;
  }
}

export default Player;
