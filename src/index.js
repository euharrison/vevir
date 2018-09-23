import $ from 'jquery';

import Config from './Config';
import Capture from './game/Capture';
import Play from './game/Play';
import LevelSample from './game/LevelSample';

import './scss/style.scss';

const game = new Phaser.Game({
  width: Config.gameWidth,
  height: Config.gameHeight,
  renderer: Config.devMode ? Phaser.AUTO : Phaser.HEADLESS,
  antialias: false,
  parent: 'game',
});

const boot = {
  preload: function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.time.advancedTiming = true;
    game.world.setBounds(
      0,
      -Config.tileHeight,
      Config.tileWidth * Config.horizontalTiles,
      Config.tileHeight * (Config.verticalTiles + 2)
    );
    game.camera.bounds = null;
  },
  create: function() {
    game.state.start('capture');
    // game.state.start('play');
  },
}

// first level sample
game.tiles = LevelSample;

game.state.add('boot', boot);
game.state.add('capture', Capture);
game.state.add('play', Play);

game.state.start('boot');

// shortcuts

$(window).on('keypress', onKeyPress);

function onKeyPress(e) {
  switch(e.key) {
    case ' ':
      if (game.state.current === 'capture') {
        game.state.start('play');
      } else {
        game.state.start('capture');
      }
      break;
    case 'r':
    case 'R':
      game.state.start('play');
      break;
  }
}
