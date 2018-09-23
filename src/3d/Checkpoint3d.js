import * as THREE from 'three';

import Config from '../Config';

class Checkpoint3d extends THREE.Group {
  constructor(checkpoint, index) {
    super();

    const geometry = new THREE.TorusBufferGeometry(Config.tileHeight*2, 4, 10, 24);

    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(`hsl(180, 100%, 50%)`),
      shininess: 30,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = checkpoint.position.x;
    mesh.position.y = -checkpoint.position.y + (Config.tileHeight*1);
    mesh.position.z = -index * (Config.tileDepth + Config.tileDepthMargin);
    mesh.rotation.y = 90 * Math.PI/180;
    this.add(mesh);
  }
}

export default Checkpoint3d;
