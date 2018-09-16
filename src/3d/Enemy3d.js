import * as THREE from 'three';

import Config from '../Config';

class Enemy3d extends THREE.Group {
  constructor(enemy, index) {
    super();

    const geometry = new THREE.SphereBufferGeometry(30, 10, 7);

    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(`hsl(0, 100%, 50%)`),
      shininess: 30,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = enemy.position.x;
    mesh.position.y = -enemy.position.y;
    mesh.position.z = -index * (Config.tileDepth + Config.tileDepthMargin);
    this.add(mesh);
  }
}

export default Enemy3d;
