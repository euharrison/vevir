import * as THREE from 'three';

import Detector from './Detector';

import './scss/style.scss';

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer, stats;

var human, mouth;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.y = 400;
  camera.position.z = 1 * 800;

  scene = new THREE.Scene();

  var light;

  var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
  scene.add( ambientLight );

  var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
  camera.add( pointLight );
  scene.add( camera );

  camera.lookAt( scene.position );

  //

  const humanHue = Math.random() * 255;

  var material = new THREE.MeshPhongMaterial( { 
    color: new THREE.Color(`hsl(${humanHue}, 100%, 50%)`),
    shininess: 30,
    flatShading: true,
  } );

  //

  const head = new THREE.Mesh( new THREE.SphereBufferGeometry( 100, 10, 7 ), material );
  // obheadject.position.set( -300, 0, 200 );
  scene.add( head );

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

  // radio espessura segmentos-no-tubo
  mouth = new THREE.Mesh( new THREE.TorusBufferGeometry( 20, 10, 10, 10 ), mouthMaterial );
  mouth.rotation.x = 30 * Math.PI/180;
  mouth.position.set( 0, -45, 82 );

  human = new THREE.Group();
  human.add( head );
  human.add( eyeLeft );
  human.add( eyeRight );
  human.add( eyeLeftDot );
  human.add( eyeRightDot );
  // human.add( sickEye );
  human.add( mouth );
  scene.add( human );

  // human.rotation.y = 0;
  // human.rotation.y = Math.PI/2 /2;

  //

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  stats = new Stats();
  document.body.appendChild( stats.dom );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function render() {

  var timer = Date.now() * 0.0001;
  human.rotation.y = timer * 2.5;

  var timerMouth = Date.now() * 0.01;
  mouth.scale.y = MathMap(Math.sin(timerMouth), -1, 1, 0.5, 1);

  renderer.render( scene, camera );

}

function MathMap(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
