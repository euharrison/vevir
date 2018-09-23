import Env from './Env';

class DevTools {
  open() {
    if (Env.NW) {
      nw.Window.get().showDevTools();
    }
  }

  close() {
    if (Env.NW) {
      nw.Window.get().closeDevTools();
    }
  }
}

export default new DevTools();
