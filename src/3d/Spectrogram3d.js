import * as THREE from 'three';

import Config from '../Config';
import ColorManager from './ColorManager';
import MathUtils from './MathUtils';
import Floor3d from './Floor3d';

class Spectrogram3d extends THREE.Group {
  constructor() {
    super();

    this.floor3d = new Floor3d({ x: -Config.tileWidth, y: 0 });
    // this.floor3d = new Floor3d({ x: 0, y: 0 });
    this.add(this.floor3d);
  }

  update(data) {
    this.dataSize = data.length;

    const minY = Config.verticalTiles * 2;
    const maxY = Config.verticalTiles * (Config.tileHeight - 2);

    this.floor3d.children.forEach((floor, index) => {
      let value = data[index] || 0;

      // debug max values
      // if (index === 0) {
      //   value = 0;
      // } else if (index === 1) {
      //   value = 250;
      // }

      let y = MathUtils.map(value, 0, 250, minY, maxY);
      if (y < minY) {
        y = minY;
      }
      if (y > maxY) {
        y = maxY;
      }

      floor.position.y = y;
    })
  }
}

export default Spectrogram3d;
