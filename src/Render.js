import * as THREE from 'three';

import Config from './Config';
import Detector from './Detector';
import Human from './Human';
import PhaserGame from './PhaserGame';

import './scss/style.scss';

if (!Detector.webgl) Detector.addGetWebGLMessage();

class Render {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
    this.camera.position.y = 200;
    this.camera.position.z = 1 * 800;

    this.scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    this.scene.add(ambientLight);

    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    this.camera.add(pointLight);
    this.scene.add(this.camera);

    this.camera.lookAt(this.scene.position);

    //

    this.humans = [];
    for (let i = 0; i < Config.population; i++) {
      const human = new Human();
      this.humans.push(human);
      this.addHuman(human, i);
    }

    //

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('render').appendChild(this.renderer.domElement);

    this.stats = new Stats();
    document.getElementById('render').appendChild(this.stats.dom);

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

    this.stats.update();
  }

  render() {
    if (!PhaserGame.players || !PhaserGame.players.children) {
      return;
    }

    const players = PhaserGame.players.children;
    this.humans.forEach((human, i) => {
      human.update(players[i]);
    });

    const firstPlayer = PhaserGame.firstPlayer;
    if (firstPlayer) {
      // this.camera.position.x = firstPlayer.position.x;
      // this.camera.lookAt(this.humans[firstPlayer.index].position);
    }
  }

  addHuman(human, index) {
    human.rotation.y = 90 * Math.PI/180;
    human.position.x = -200;
    human.position.z = -300 * index;
    this.scene.add(human);
  }
}

export default new Render();
