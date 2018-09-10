import * as THREE from 'three';

import Config from '../Config';
import Detector from './Detector';
import Play from '../game/Play';

if (!Detector.webgl) Detector.addGetWebGLMessage();

class Render {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
    this.camera.position.z = 800 * 2;
    this.camera.rotation.x = -10 * Math.PI/180;

    this.scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    this.scene.add(ambientLight);

    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    this.camera.add(pointLight);
    this.scene.add(this.camera);

    //

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('render').appendChild(this.renderer.domElement);

    if (Config.devMode) {
      this.stats = new Stats();
      document.getElementById('render').appendChild(this.stats.dom);
    }

    //

    window.addEventListener('resize', this.onWindowResize.bind(this));

    this.update = this.update.bind(this);
    this.update();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update(timestamp) {
    window.requestAnimationFrame(this.update);

    this.render();
    this.renderer.render(this.scene, this.camera);

    if (this.stats) {
      this.stats.update();
    }
  }

  render() {
    if (!Play || !Play.players || !Play.players.children) {
      return;
    }

    this.camera.position.x = Play.camera.position.x + Play.camera.view.width/2;
  }
}

export default new Render();
