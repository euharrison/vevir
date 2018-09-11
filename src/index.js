import $ from 'jquery';

import Config from './Config';
import Capture from './game/Capture';
import Play from './game/Play';

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
  },
  create: function() {
    // game.state.start('capture');
    game.state.start('play');
  },
}

// first audio sample
game.spectrogram = [121, 140, 142, 168, 122, 116, 160, 66, 62, 49, 23, 10, 8, 12, 0, 0];

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
