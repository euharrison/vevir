import * as THREE from 'three';

import Config from '../Config';
import ColorManager from './ColorManager';

class Floor3d extends THREE.Group {
  constructor(floor) {
    super();

    const geometry = new THREE.BoxBufferGeometry(Config.tileWidth, Config.tileHeight, Config.tileDepth);

    for (let i = 0; i < Config.population; i++) {
      const hue = ColorManager.get(i);

      const material = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(`hsl(${hue}, 50%, 50%)`),
        shininess: 30,
        flatShading: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = floor.x;
      mesh.position.y = -floor.y;
      mesh.position.z = -i * (Config.tileDepth + Config.tileDepthMargin);
      this.add(mesh);
    }
  }
}

export default Floor3d;
