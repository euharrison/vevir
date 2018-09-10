import $ from 'jquery';

import AudioController from './AudioController';
import Play from './game/Play';

import './scss/style.scss';

$(window).on('keypress', onKeyPress);

function onKeyPress(e) {
  switch(e.key) {
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
