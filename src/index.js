import $ from 'jquery';

// import AI from './AI';
import AudioController from './AudioController';
import PhaserGame from './PhaserGame';

import './scss/style.scss';

$(window).on('keypress', onKeyPress);

function onKeyPress(e) {
  switch(e.key) {
    case 'r':
    case 'R':
      const spectrogram = AudioController.getSpectrogram();
      PhaserGame.restart(spectrogram);
      break;
  }
}
