import $ from 'jquery';

import AudioController from './AudioController';
import PhaserGame from './PhaserGame';

import './scss/style.scss';

$(window).on('keypress', onKeyPress);

function onKeyPress(e) {
  switch(e.key) {
    case 'r':
    case 'R':
      PhaserGame.restart();
      break;
    case 'u':
    case 'U':
      const spectrogram = AudioController.getSpectrogram();
      PhaserGame.updateLevel(spectrogram);
      break;
  }
}
