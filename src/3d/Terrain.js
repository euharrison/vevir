import * as THREE from 'three';

import Config from '../Config';

class Terrain extends THREE.Group {
  constructor(tiles) {
    super();

    var material = new THREE.MeshPhongMaterial( { 
      // color: new THREE.Color(`hsl(${humanHue}, 100%, 50%)`),
      color: new THREE.Color(`hsl(150, 100%, 50%)`),
      shininess: 30,
      flatShading: true,
    } );

    const tileDepth = 100;

    const width = tiles[0].width;
    const height = tiles[0].height;
    const depth = tileDepth * Config.population;

    const geometry = new THREE.BoxBufferGeometry(width, height, depth);

    tiles.forEach(tile => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = tile.x;
      mesh.position.y = -tile.y;
      mesh.position.z = -depth/2 + tileDepth;
      this.add(mesh);
    });
  }
}

export default Terrain;
