import * as d3 from 'd3';

import Config from '../Config';
import Coin from './Coin';
import Enemy from './Enemy';
import Level3d from '../3d/Level3d';
import Scene3d from '../3d/Scene3d';

class Level extends Phaser.Group {
  constructor(game, input) {
    super(game);

    this.walls = this.game.add.group();

    this.coins = [];
    this.enemies = [];
    for (let i = 0; i < Config.population; i++) {
      this.coins.push(this.game.add.group());
      this.enemies.push(this.game.add.group());
    }

    this.create(input);

    this.level3d = new Level3d(this.walls.children);
    Scene3d.add(this.level3d);

    this.onDestroy.add(this.remove3d, this);
  }

  create(input) {
    const level = [];

    const verticalLength = Config.verticalTiles;
    const horizontalLength = Config.horizontalTiles;

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
    for (let y = 0; y < verticalLength; y++) {
      level[y] = [];
      for (let x = 0; x < horizontalLength; x++) {
        if (y > verticalLength - horizontalValues[x] - 1) {
          level[y][x] = 'x';
        }
        else if (y > verticalLength - horizontalValues[x] - 2) {
          level[y][x] = x > 10 && Math.random() < 0.025 ? '!' : ' ';
          // level[y][x] = ' ';
        }
        else if (y > verticalLength - horizontalValues[x] - 3) {
          level[y][x] = Math.random() < 0.05 ? 'o' : ' ';
          // if (x > 70) {
          //   level[y][x] = hasCoin ? ' ' : 'o';
          //   hasCoin = true;
          // } else {
          //   level[y][x] = ' ';
          // }
        }
        else {
          level[y][x] = ' ';//'o';
        }
      }
    }

    this.createSprites(level);

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

    const tileWidth = Config.tileWidth;
    const tileHeight = this.game.world.height / verticalLength;

    for (let y = 0; y < verticalLength; y++) {
      for (let x = 0; x < horizontalLength; x++) {
        switch (level[y][x]) {

          // wall
          case 'x':
            const wall = this.game.add.sprite(tileWidth * x, tileHeight * y, Phaser.Cache.MISSING);
            wall.width = tileWidth;
            wall.height = tileHeight;
            this.walls.add(wall);
            this.game.physics.arcade.enable(wall);
            wall.body.immovable = true;
            wall.body.allowGravity = false;
            break;

          // coin
          case 'o':
            for (let i = 0; i < Config.population; i++) {
              const coin = new Coin(this.game, i, tileWidth * x, tileHeight * y);
              this.coins[i].add(coin);
            }
            break;

          // enemy
          case '!':
            for (let i = 0; i < Config.population; i++) {
              const enemy = new Enemy(this.game, i, tileWidth * x, tileHeight * y);
              this.enemies[i].add(enemy);
            }
            break;
        }
      }
    }
  }

  remove3d() {
    Scene3d.remove(this.level3d);
  }
}

export default Level;
