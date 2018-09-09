import * as THREE from 'three';

class Terrain extends THREE.Group {
  constructor(tiles) {
    super();

    var material = new THREE.MeshPhongMaterial( { 
      // color: new THREE.Color(`hsl(${humanHue}, 100%, 50%)`),
      color: new THREE.Color(`hsl(150, 100%, 50%)`),
      shininess: 30,
      flatShading: true,
    } );

    const geometry = new THREE.BoxBufferGeometry(tiles[0].width, tiles[0].height, 100);

    tiles.forEach(tile => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = tile.x;
      mesh.position.y = -tile.y;
      this.add( mesh );
    });
  }
}

export default Terrain;
