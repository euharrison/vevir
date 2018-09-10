import * as THREE from 'three';

class Enemy3d extends THREE.Group {
  constructor(enemy, index) {
    super();

    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(`hsl(0, 100%, 50%)`),
      shininess: 30,
      flatShading: true,
    });

    const tileDepth = 100;

    const mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(30, 10, 7), material);
    mesh.position.x = enemy.position.x;
    mesh.position.y = -enemy.position.y;
    mesh.position.z = -index * tileDepth;
    this.add(mesh);
  }
}

export default Enemy3d;
