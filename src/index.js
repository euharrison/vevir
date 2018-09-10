import $ from 'jquery';

import Config from './Config';
import AudioController from './AudioController';
import Capture from './capture/Capture';
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
    game.state.start('capture');
  },
}

game.state.add('boot', boot);
game.state.add('capture', Capture);
game.state.add('play', Play);

game.state.start('boot');

// shortcuts

$(window).on('keypress', onKeyPress);

function onKeyPress(e) {
  switch(e.key) {
    case ' ':
      game.state.start('capture');
      break;
    case 'r':
    case 'R':
      Play.restart();
      break;
    case 'u':
    case 'U':
      const spectrogram = AudioController.getSpectrogram();
      Play.updateLevel(spectrogram);
      break;
  }
}
