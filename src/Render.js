import * as THREE from 'three';

import Detector from './Detector';
import Human from './Human';

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

  const human = new Human();
  console.log(human)
  scene.add( human );
  // scene.add( human.getHuman() );

  const human2 = new Human();
  human2.position.x = 200;
  scene.add( human2 );

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
  // human.rotation.y = timer * 2.5;

  var timerMouth = Date.now() * 0.01;
  // mouth.scale.y = MathMap(Math.sin(timerMouth), -1, 1, 0.5, 1);

  renderer.render( scene, camera );

}

function MathMap(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
