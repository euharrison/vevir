import * as THREE from 'three';

import MathUtils from '../MathUtils';

class Player3d extends THREE.Group {
  constructor() {
    super();

    const humanHue = Math.random() * 255;

    var material = new THREE.MeshPhongMaterial( { 
      color: new THREE.Color(`hsl(${humanHue}, 100%, 50%)`),
      shininess: 30,
      flatShading: true,
    } );
    
    const head = new THREE.Mesh( new THREE.SphereBufferGeometry( 100, 10, 7 ), material );
    // obheadject.position.set( -300, 0, 200 );
    // scene.add( head );

    var eyeMaterial = new THREE.MeshPhongMaterial( { 
      color: 0xffffff,
      shininess: 30,
      flatShading: true,
    } );

    const eyeLeft = new THREE.Mesh( new THREE.SphereBufferGeometry( 40, 10, 7 ), eyeMaterial );
    eyeLeft.rotation.x = Math.PI/2;
    eyeLeft.position.set( -35, 25, 70 );

    const eyeRight = new THREE.Mesh( new THREE.SphereBufferGeometry( 40, 10, 7 ), eyeMaterial );
    eyeRight.rotation.x = Math.PI/2;
    eyeRight.position.set( 35, 25, 70 );

    var eyeDotMaterial = new THREE.MeshPhongMaterial( { 
      color: 0x000000,
      shininess: 30,
      flatShading: true,
    } );

    const eyeLeftDot = new THREE.Mesh( new THREE.SphereBufferGeometry( 11, 10, 7 ), eyeDotMaterial );
    eyeLeftDot.rotation.x = Math.PI/2;
    eyeLeftDot.position.set( -35, 25, 100 );

    const eyeRightDot = new THREE.Mesh( new THREE.SphereBufferGeometry( 11, 10, 7 ), eyeDotMaterial );
    eyeRightDot.rotation.x = Math.PI/2;
    eyeRightDot.position.set( 35, 25, 100 );

    var sickEyeMaterial = new THREE.MeshPhongMaterial( { 
      color: 0xff0000,
      shininess: 30,
      flatShading: true,
    } );

    const sickEye = new THREE.Mesh( new THREE.SphereBufferGeometry( 40, 10, 7 ), sickEyeMaterial );
    sickEye.position.set( 35, 25, 70 );

    var mouthMaterial = new THREE.MeshPhongMaterial( { 
      color: new THREE.Color(`hsl(${humanHue}, 50%, 50%)`),
      shininess: 30,
      flatShading: true,
    } );

    this.mouth = new THREE.Mesh( new THREE.TorusBufferGeometry( 20, 10, 10, 10 ), mouthMaterial );
    this.mouth.rotation.x = 30 * Math.PI/180;
    this.mouth.position.set( 0, -45, 82 );

    this.add( head );
    this.add( eyeLeft );
    this.add( eyeRight );
    this.add( eyeLeftDot );
    this.add( eyeRightDot );
    // human.add( sickEye );
    this.add( this.mouth );

    const scale = 0.5;
    this.scale.set(scale, scale, scale);
  }

  update(player) {
    this.visible = player.alive;

    if (!this.visible) {
      return;
    }

    var timerMouth = Date.now() * 0.01;
    this.mouth.scale.y = MathUtils.map(Math.sin(timerMouth), -1, 1, 0.25, 1);

    this.position.x = player.x;
    this.position.y = -player.y;

    const yRot = (player.body.velocity.x < 0 ? -90 : 90) * Math.PI/180;
    const xRot = MathUtils.map(player.body.deltaY(), 10, -10, 15, -15) * Math.PI/180;
    const zRot = 0;

    // https://github.com/mrdoob/three.js/issues/187#issuecomment-1066636
    this.quaternion.set(0, yRot, 0, 1).normalize();
    var tmpQuaternion = new THREE.Quaternion();
    tmpQuaternion.set(xRot, 0, zRot, 1).normalize();
    this.quaternion.multiply(tmpQuaternion);
  }
}

export default Player3d;
