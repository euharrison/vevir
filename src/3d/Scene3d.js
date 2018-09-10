import * as THREE from 'three';

import Config from '../Config';
import Detector from './Detector';

if (!Detector.webgl) Detector.addGetWebGLMessage();

class Scene3d extends THREE.Scene {
  constructor() {
    super();

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);

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

    if (Config.showFPS) {
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

    this.renderer.render(this, this.camera);

    if (this.stats) {
      this.stats.update();
    }
  }

  updateCameraCapture() {
    this.camera.position.set(0, 0, 8000);
    this.camera.rotation.set(0, 0, 0);
  }

  updateCameraPlay(play) {
    if (!play || !play.players || !play.players.children) {
      return;
    }

    this.camera.rotation.x = -20 * Math.PI/180;
    this.camera.rotation.y = 0;
    this.camera.rotation.z = 0;

    this.camera.position.x = play.camera.position.x + play.camera.view.width/2 + 100;
    this.camera.position.y = -play.camera.position.y - play.camera.view.height/2 + 300;

    // TODO pensar numa maneira mais suave de mover a camera, dá um impacto visual muito grande
    // const frontPlayer = play.players.children.find(p => p.alive);
    // const index = frontPlayer ? frontPlayer.index : 0;
    // const camZ = -index * (Config.tileDepth + Config.tileDepthMargin) + 800;
    // this.camera.position.z += (camZ - this.camera.position.z) * 0.02;
    this.camera.position.z = 800;
  }
}

export default new Scene3d();
