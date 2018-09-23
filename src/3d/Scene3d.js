import * as THREE from 'three';

import Config from '../Config';
import Detector from './Detector';

if (!Detector.webgl) Detector.addGetWebGLMessage();

class Scene3d extends THREE.Scene {
  constructor() {
    super();

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
    this.add(this.camera);

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    this.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.y = 1000;
    this.camera.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.2);
    pointLight2.position.z = 500;
    this.camera.add(pointLight2);

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

  updateCamera(camera) {
    this.camera.rotation.y = -90 * Math.PI/180;

    this.camera.position.x = camera.position.x + camera.view.width/2 - 600;
    this.camera.position.y = 150;
    this.camera.position.z = (-Config.population+1) * (Config.tileDepth+Config.tileDepthMargin) / 2;
  }

  enableFog() {
    this.fog = new THREE.FogExp2(0x000000, 0.00055);
  }

  disableFog() {
    this.fog = null;
  }
}

export default new Scene3d();
