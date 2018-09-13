import * as THREE from 'three';

import Config from '../Config';
import ColorManager from './ColorManager';

class Level3d extends THREE.Group {
  constructor(tiles) {
    super();

    const geometry = new THREE.BoxBufferGeometry(Config.tileWidth, Config.tileHeight, Config.tileDepth);

    for (let i = 0; i < Config.population; i++) {

      const hue = ColorManager.get(i);

      const material = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(`hsl(${hue}, 50%, 50%)`),
        shininess: 30,
        flatShading: true,
      });

      // TODO merge mesh for better performance
      // var geom = new THREE.Geometry();
      // geom.mergeMesh(new THREE.Mesh(new THREE.BoxGeometry(2,20,2)));
      // geom.mergeMesh(new THREE.Mesh(new THREE.BoxGeometry(5,5,5)));
      // geom.mergeVertices(); // optional
      // scene.add(new THREE.Mesh(geom, material));
      //https://threejs.org/docs/#api/en/core/BufferGeometry.fromGeometry
      //https://threejs.org/docs/#api/en/core/BufferGeometry.merge

      const index = i;

      tiles.forEach(tile => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = tile.x;
        mesh.position.y = -tile.y;
        mesh.position.z = -index * (Config.tileDepth + Config.tileDepthMargin);
        this.add(mesh);

        mesh.simulation = index;
      });
    }
  }

  appendTile(tile, index = 0) {
    const geometry = new THREE.BoxBufferGeometry(Config.tileWidth, Config.tileHeight*10, Config.tileDepth);

    const hue = ColorManager.get(index);

    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(`hsl(${hue}, 50%, 50%)`),
      shininess: 30,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = tile.x;
    mesh.position.y = -tile.y;
    mesh.position.z = -index * (Config.tileDepth + Config.tileDepthMargin);
    this.add(mesh);

    mesh.simulation = index;
  }

  removeSimulation(index) {
    const objects = this.children.filter(c => c.simulation === index);
    this.remove(...objects);
  }
}

export default Level3d;
