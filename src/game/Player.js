import AI from './AI';
import Config from '../Config';
import Player3d from '../3d/Player3d';
import Scene3d from '../3d/Scene3d';

class Player extends Phaser.Sprite {
  constructor(index, game, level) {
    super(game, 50, 0);

    this.width = Config.tileHeight;
    this.height = Config.tileHeight;

    this.game.physics.arcade.enable(this);

    this.body.gravity.y = Config.playerGravity;
    this.body.maxVelocity.y = Config.playerJump;

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    this.level = level;
    this.index = index;
    this.score = 0;
    this.coins = 0;
    this.checkpoints = 0;

    this.humanControl = Config.humanControl && index === 0;
    if (this.humanControl) {
      this.facing = 'left';
      this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    this.player3d = new Player3d(index);
    Scene3d.add(this.player3d);

    this.events.onKilled.add(this.onRemove, this);
    this.events.onDestroy.add(this.onRemove, this);
  }

  update() {
    if (!this.alive) {
      return;
    }

    if (this.missedCheckpoints()) {
      this.kill();
    }

    this.game.debug.body(this, '#0000ff');

    this.body.velocity.x = 0;
    if (this.humanControl) {
      this.computeAI(true);
      this.updateByHuman();
    } else {
      this.updateByAI();
    }

    this.player3d.update(this);
  }

  updateByHuman() {
    if (this.cursors.right.isDown) {
      this.body.velocity.x = Config.playerVelocity;
    }
    else if (this.cursors.left.isDown) {
      this.body.velocity.x = -Config.playerVelocity;
    }

    // if (this.cursors.up.isDown && this.body.touching.down) {
    if (this.cursors.up.isDown) {
      this.jump();
    }
  }

  updateByAI() {
    const brain = this.computeAI();

    if (brain.goRight && !brain.goLeft) {
      this.body.velocity.x = Config.playerVelocity;
    }
    
    if (brain.goLeft && !brain.goRight) {
      this.body.velocity.x = -Config.playerVelocity;
    }

    // if (brain.jump && this.body.touching.down) {
    if (brain.jump) {
      this.jump();
    }
  }

  jump() {
    this.body.velocity.y = -Config.playerJump;
  }

  computeAI(debug) {
    const maxY = Config.verticalTiles * Config.tileHeight;

    const nearst = this.getNearst();

    const percentX = (nearst.x - this.position.x) / Config.tileWidth;
    const inputX = Math.max(Math.min(percentX, 1), 0);

    const percentY = (nearst.y - this.position.y) / maxY;
    const inputY = (Math.max(Math.min(percentY, 1), -1) + 1) / 2;
    
    // const nearstDist = nearst.y - this.position.y;
    // const enemyPercent = Math.min(enemyDist/Config.tileWidth, 1);

    const typeValues = {
      'coin': 0,
      'enemy': 0.5,
      'checkpoint': 1,
    }

    const playerY = this.position.y / maxY;
    const nearstY = nearst.y / maxY;
    const type = typeValues[nearst.type];

    const input = [
      // inputX,
      // inputY,
      playerY,
      nearstY,
      type,
    ];

    const output = AI.compute(this.index, input).map(o => Math.round(o));

    // if (debug) {
    if (this.index === 0) {

      // console.log(maxY, this.position.y)
      //max player y = 380
      // console.log(this.hasAllCheckpoints())
      // console.log(this.position.x, this.checkpoints)
      // if (Math.random() < 0.3) 
        // console.log(output, input)
    }

    return {
      goRight: true, //output[0],
      goLeft: false, //output[1],
      jump: output[0], //output[2],
    };
  }

  missedCheckpoints() {
    const checkpointsBehind = this.level.tiles.filter(t => t.type === 'checkpoint' && (t.x+100) < this.x).length;
    const checkpointsMissings = checkpointsBehind - this.checkpoints;
    return (checkpointsMissings > 0);
  }

  getNearst() {
    let nearst = { x: Infinity, y: Infinity };
    this.level.tiles.filter(t => t.type !== 'wall').forEach(item => {
      if (item.x > this.x && item.x < nearst.x) {
        nearst = item;
      }
    });
    return nearst;
  }

  getScore() {
    return Math.pow((
      this.position.x +
      this.coins * (Config.horizontalTiles * Config.tileWidth * 0.5)
    )/1000, 2);
  }

  onRemove() {
    AI.setScore(this.index, this.getScore());

    Scene3d.remove(this.player3d);
    this.level.removeSimulation(this.index);
  }
}

export default Player;
