import * as THREE from 'three';

import Config from '../Config';
import ColorManager from './ColorManager';
import MathUtils from './MathUtils';

class Spectrogram3d extends THREE.Group {
  update(data) {
    this.dataSize = data.length;
    console.log(this.dataSize)

    data.forEach((value, index) => {
      if (!this.children[index]) {
        this.createBar(index);
      }

      const scale = MathUtils.map(value, 0, 200, 0.1, 1);
      this.children[index].scale.set(scale, scale, scale)
    })
  }

  createBar(index) {
    const width = 30;
    const height = 1000;
    
    const geometry = new THREE.BoxBufferGeometry(width, height, width);

    const hue = MathUtils.map(index, 0, this.dataSize, 0, 255);

    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(`hsl(${hue}, 100%, 50%)`),
      shininess: 30,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (index - (this.dataSize/2)) * (width + 1);
    mesh.position.y = 0;
    mesh.position.z = 0;
    this.add(mesh);
  }
}

export default Spectrogram3d;
