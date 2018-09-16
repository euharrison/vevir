import * as THREE from 'three';

import Config from '../Config';

class Coin3d extends THREE.Group {
  constructor(coin, index) {
    super();

    const geometry = new THREE.SphereBufferGeometry(20, 4, 2);

    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(`hsl(60, 100%, 50%)`),
      shininess: 30,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = coin.position.x;
    mesh.position.y = -coin.position.y;
    mesh.position.z = -index * (Config.tileDepth + Config.tileDepthMargin);
    this.add(mesh);
  }
}

export default Coin3d;
