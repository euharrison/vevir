import Config from '../Config';

class ColorManager {
  constructor() {
    this.colors = [];
    this.shuffle();
  }

  shuffle() {
    for (let i = 0; i < Config.population; i++) {
      this.colors[i] = Math.floor(Math.random() * 256);
    }
  }

  get(index) {
    return this.colors[index];
  }
}

export default new ColorManager();
