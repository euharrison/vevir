import Config from '../Config';

class ColorManager {
  constructor() {
    this.colors = [];
    this.shuffle();
  }

  shuffle() {
    const availableColors = 8;
    for (let i = 0; i < Config.population; i++) {
      this.colors[i] = Math.floor(Math.random()*availableColors) * (256/availableColors);
    }
  }

  get(index) {
    return this.colors[index];
  }
}

export default new ColorManager();
