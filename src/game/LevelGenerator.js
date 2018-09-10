import * as d3 from 'd3';

import Level3d from '../3d/Level3d';
import Render from '../3d/Render';

class LevelGenerator extends Phaser.Group {
  constructor(game) {
    super(game);

    this.walls = this.game.add.group();
    this.coins = this.game.add.group();
    this.enemies = this.game.add.group();

    this.level3d = new Level3d();
    Render.scene.add(this.level3d);

    this.onDestroy.add(this.remove3d, this);
  }

  create(input) {
    const level = [];

    const verticalLength = 20;
    const horizontalLength = 100;

    const maxInput = input.reduce((result, i) => Math.max(result, i));
    const maxFloorHeight = verticalLength / 2;

    const scaleVertical = d3.scaleLinear()
      .domain([0, maxInput])
      .range([0, maxFloorHeight])

    const scaledInput = input.map(i => scaleVertical(i));

    const scaleHorizontalIndex = d3.scaleLinear()
      .domain([0, scaledInput.length])
      .range([0, horizontalLength])

    const domainHorizontal = new Array(scaledInput.length).fill(0).map((v, index) => scaleHorizontalIndex(index));
    const scaleHorizontalValue = d3.scaleLinear()
      .domain(domainHorizontal)
      .range(scaledInput)

    const horizontalValues = new Array(horizontalLength).fill(0).map((v, index) => scaleHorizontalValue(index))

    let hasCoin = false;
    for (var y = 0; y < verticalLength; y++) {
      level[y] = [];
      for (var x = 0; x < horizontalLength; x++) {
        if (y > verticalLength - horizontalValues[x] - 1) {
          level[y][x] = 'x';
        }
        else if (y > verticalLength - horizontalValues[x] - 2) {
          // level[y][x] = Math.random() < 0.05 ? '!' : ' ';
          level[y][x] = ' ';
        }
        else if (y > verticalLength - horizontalValues[x] - 3) {
          // level[y][x] = Math.random() < 0.1 ? 'o' : ' ';
          if (x > 70) {
            level[y][x] = hasCoin ? ' ' : 'o';
            hasCoin = true;
          } else {
            level[y][x] = ' ';
          }
        }
        else {
          level[y][x] = ' ';//'o';
        }
      }
    }

    this.createSprites(level);

    this.level3d.create(this.walls.children);

    // Debug
    // console.log(input)
    // console.log(level.map(row => `|${row.join('')}|`).join('\n'));
  }

  /*
  Level sample
  x = wall, o = coin, ! = lava.
  'xxxxxxxxxxxxxxxxxxxxxx',
  '          !          x',
  '                  o  x',
  '          o          x',
  '                     x',
  'xxx   o   !    x     x',
  'xxxxxxxxxxxxxxxx!!!!!x',
  */
  createSprites(level) {
    const horizontalLength = level[0].length;
    const verticalLength = level.length;

    const tileWidth = this.game.world.width / horizontalLength;
    const tileHeight = this.game.world.height / verticalLength;

    for (var y = 0; y < verticalLength; y++) {
      for (var x = 0; x < horizontalLength; x++) {
        switch (level[y][x]) {

          // wall
          case 'x':
            const wall = this.game.add.sprite(tileWidth * x, tileHeight * y, 'wall');
            wall.width = tileWidth;
            wall.height = tileHeight;
            this.walls.add(wall);
            this.game.physics.arcade.enable(wall);
            wall.body.immovable = true;
            wall.body.allowGravity = false;
            break;

          // coin
          case 'o':
            const coin = this.game.add.sprite(tileWidth * x, tileHeight * y, 'coin');
            this.coins.add(coin);
            this.game.physics.arcade.enable(coin);
            break;

          // enemy
          case '!':
            const enemy = this.game.add.sprite(tileWidth * x, tileHeight * y, 'enemy');
            this.enemies.add(enemy);
            this.game.physics.arcade.enable(enemy);
            break;
        }
      }
    }
  }

  remove3d() {
    Render.scene.remove(this.level3d);
  }
}

export default LevelGenerator;
