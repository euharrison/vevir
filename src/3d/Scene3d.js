import * as THREE from 'three';

import Config from '../Config';
import Detector from './Detector';
import Play from '../game/Play';

if (!Detector.webgl) Detector.addGetWebGLMessage();

class Scene3d extends THREE.Scene {
  constructor() {
    super();

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
    this.camera.rotation.x = -20 * Math.PI/180;

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    this.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    this.camera.add(pointLight);
    this.add(this.camera);

    //

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('render').appendChild(this.renderer.domElement);

    // if (Config.devMode) {
      this.stats = new Stats();
      document.getElementById('render').appendChild(this.stats.dom);
    // }

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
    this.renderer.render(this, this.camera);

    if (this.stats) {
      this.stats.update();
    }
  }

  render() {
    if (!Play || !Play.players || !Play.players.children) {
      return;
    }

    this.camera.position.x = Play.camera.position.x + Play.camera.view.width/2 - 100;
    this.camera.position.y = -Play.camera.position.y - Play.camera.view.height/2 + 300;

    const frontPlayer = Play.players.children.find(p => p.alive);
    const index = frontPlayer ? frontPlayer.index : 0;
    const camZ = -index * (Config.tileDepth + Config.tileDepthMargin) + 800;
    this.camera.position.z += (camZ - this.camera.position.z) * 0.05;

// console.log(index)

    // if (Play.firstPlayer) {
      // console.log(Play.firstPlayer.index)
    // }

  }
}

export default new Scene3d();
