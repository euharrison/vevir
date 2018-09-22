import * as THREE from 'three';

import Config from '../Config';
import ColorManager from './ColorManager';
import MathUtils from './MathUtils';
import Floor3d from './Floor3d';

class Spectrogram3d extends THREE.Group {
  constructor() {
    super();

    this.floor3d = new Floor3d({ x: Config.tileWidth, y: 0 });
    this.add(this.floor3d);
  }

  update(data) {
    this.dataSize = data.length;

    this.floor3d.children.forEach((floor, index) => {
      const value = data[index] || 0;
      const scale = MathUtils.map(value, 0, 200, 1, 20);
      // floor.scale.set(scale, 1, 1);

      const y = Config.verticalTiles * Config.tileHeight;
      floor.position.y = -y + (scale * Config.tileHeight/2) - 10;
    })
  }
}

export default Spectrogram3d;
