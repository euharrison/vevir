import $ from 'jquery';
import Env from './Env';

class KeyboardShortcuts {
  enable() {
    $(window).on('keypress', (e) => this.onKeyPress(e));
  }

  disable() {
    $(window).off('keypress', (e) => this.onKeyPress(e));
  }

  onKeyPress(e) {
    switch (e.keyCode) {
      case 82: // R
      case 114: // r
        this.reload();
        break;

      case 70: // F
      case 102: // f
        this.toggleKiosk();
        break;

      case 81: // Q
      case 113: // q
        this.quit();
        break;
    }
  }

  reload() {
    if (location) {
      location.href = location.href;
      // location.reload();
    }
  }

  toggleKiosk() {
    if (Env.NW) {
      const win = nw.Window.get();
      if (win.isKioskMode) {
        win.leaveKioskMode();
      } else {
        win.enterKioskMode();
      }
    }
  }

  quit() {
    if (Env.NW) {
      nw.App.quit();
    }
  }
}

export default new KeyboardShortcuts();
