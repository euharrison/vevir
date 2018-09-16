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
      floor.scale.set(1, scale, 1);

      const y = Config.verticalTiles * Config.tileHeight;
      floor.position.y = -y + (scale * Config.tileHeight/2) - 10;
    })
  }

  createBar(index) {
    const width = 50;
    const height = 50 * 100;

    const geometry = new THREE.BoxBufferGeometry(width, height, width);

    const hue = MathUtils.map(index, 0, this.dataSize, 0, 255);

    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(`hsl(${hue}, 100%, 50%)`),
      shininess: 30,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (index - (this.dataSize/2)) * (width * 1.5);
    mesh.position.y = 0;
    mesh.position.z = -1000;
    this.add(mesh);
  }
}

export default Spectrogram3d;
