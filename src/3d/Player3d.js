import * as THREE from 'three';

import Config from '../Config'
import ColorManager from './ColorManager';
import MathUtils from './MathUtils'

class Player3d extends THREE.Group {
  constructor(index) {
    super();

    this.randomTime = Math.random() * 1000;

    const hue = ColorManager.get(index);

    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(`hsl(${hue}, 100%, 50%)`),
      shininess: 30,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    var geometry = new THREE.Geometry();

    const triangles = [
      // wing left
      [
        100, 0, 0,
        0,   0, -2.5,
        0,   -10, -30,
      ],
      // wing-nail left 
      [
        100, 0, 0,
        0,   -5, -30,
        0,   -10, -30,
      ],
      // wing right
      [
        100, 0, 0,
        0,   0, 2.5,
        0,   -10, 30,
      ],
      // wing-nail right
      [
        100, 0, 0,
        0,   -5, 30,
        0,   -10, 30,
      ],
      // base left
      [
        100, 0, -2.5,
        0,   0, -2.5,
        0,   -20, 0,
      ],
      // base right
      [
        100, 0, 2.5,
        0,   0, 2.5,
        0,   -20, 0,
      ],
    ];

    for (let i = 0; i < triangles.length; i++) {
      const t = triangles[i];
      geometry.vertices.push(new THREE.Vector3(t[0], t[1], t[2]));
      geometry.vertices.push(new THREE.Vector3(t[3], t[4], t[5]));
      geometry.vertices.push(new THREE.Vector3(t[6], t[7], t[8]));
      
      geometry.faces.push(new THREE.Face3(i*3, i*3 + 1, i*3 + 2));
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);
    
    const scale = 1.1;
    this.scale.set(scale, scale, scale);

    this.position.z = -index * (Config.tileDepth + Config.tileDepthMargin);
  }

  update(player) {
    this.visible = player.alive;

    if (!this.visible) {
      return;
    }

    this.position.x = player.x;
    this.position.y = -player.y + 30;

    const time = Date.now() * 0.005 + this.randomTime;

    const yRot = 0;
    const xRot = Math.sin(time)*5 * Math.PI/180;
    const zRot = MathUtils.map(player.body.deltaY(), 10, -10, -5, 5) * Math.PI/180;

    // https://github.com/mrdoob/three.js/issues/187#issuecomment-1066636
    this.quaternion.set(0, yRot, 0, 1).normalize();
    const tmpQuaternion = new THREE.Quaternion();
    tmpQuaternion.set(xRot, 0, zRot, 1).normalize();
    this.quaternion.multiply(tmpQuaternion);
  }
}

export default Player3d;
