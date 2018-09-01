import * as THREE from 'three';

class Human extends THREE.Group {
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
  }

  update(weight) {
    var timerMouth = Date.now() * 0.01;
    this.mouth.scale.y = MathMap(Math.sin(timerMouth), -1, 1, 0.5, 1);

    const isDead = weight < 50 || weight > 100;
    if (isDead) {
      // TODO delete human
      // human.parent.remove(this);
      this.visible = false;
      this.scale.set(0.001, 0.001, 0.001);
    } else {
      const scale = MathMap(weight, 50, 70, 0.25, 1);
      this.scale.set(scale, scale, scale);
    }
  }
}

export default Human;

function MathMap(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
