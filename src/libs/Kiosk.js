import Env from './Env';

class Kiosk {
  enter(screenIndex) {
    if (!Env.NW) {
      return;
    }

    const { bounds } = (nw.Screen.screens[screenIndex] || nw.Screen.screens[0]);

    const win = nw.Window.get();
    win.leaveKioskMode();
    win.moveTo(bounds.x, bounds.y);
    win.resizeTo(bounds.width, bounds.height);

    if (!Env.DEV) {
      setTimeout(() => {
        win.enterKioskMode();
      }, 500);
    }
  }
}

export default new Kiosk();
