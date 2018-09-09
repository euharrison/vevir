import * as THREE from 'three';

class Terrain extends THREE.Group {
  constructor() {
    super();

    const tiles = [
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 100, y: 100, width: 100, height: 100 },
      { x: 200, y: 100, width: 100, height: 100 },
    ];

    const texture = new THREE.TextureLoader().load('assets/images/crate.gif');
    const geometry = new THREE.BoxBufferGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    tiles.forEach(tile => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = tile.x;
      mesh.position.y = -tile.y;
      this.add( mesh );
    });
  }
}

export default Terrain;
