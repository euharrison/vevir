import * as THREE from 'three';

import Config from '../Config';
import ColorManager from './ColorManager';

class Floor3d extends THREE.Group {
  constructor(floor) {
    super();

    const geometry = new THREE.CylinderGeometry( Config.tileHeight/2, Config.tileHeight/2, Config.tileWidth, 8);

    for (let i = 0; i < Config.population; i++) {
      const hue = ColorManager.get(i);

      const material = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(`hsl(${hue}, 50%, 50%)`),
        shininess: 30,
        flatShading: true,
      });

      var cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.x = floor.x;
      cylinder.position.y = -floor.y;
      cylinder.position.z = -i * (Config.tileDepth + Config.tileDepthMargin);
      cylinder.rotation.z = 90 * Math.PI/180;
      this.add(cylinder);
    }
  }
}

export default Floor3d;
