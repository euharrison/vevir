import * as THREE from 'three';

import Detector from './Detector';
import Human from './Human';

import './scss/style.scss';

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer, stats;

class Render {
  constructor() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.y = 200;
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

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    stats = new Stats();
    document.body.appendChild( stats.dom );

    //

    window.addEventListener( 'resize', this.onWindowResize, false );

    this.animate = this.animate.bind(this);
    this.animate();
  }

  onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.render();
    stats.update();
  }

  render() {
    renderer.render( scene, camera );
  }

  addHuman(human, index) {
    human.rotation.y = 90 * Math.PI/180;
    human.position.x = -200;
    human.position.z = -300 * index;
    scene.add(human);
  }
}

export default new Render();
