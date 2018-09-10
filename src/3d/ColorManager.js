import Config from '../Config';

class ColorManager {
  constructor() {
    this.colors = [];
    this.shuffle();
  }

  shuffle() {
    const availableColors = 8;
    for (let i = 0; i < Config.population; i++) {
      // TODO definir um padrão de cores visual harmonico
      // this.colors[i] = Math.floor(Math.random()*availableColors) * (256/availableColors);
      this.colors[i] = Math.floor(availableColors*i/Config.population) * (256/availableColors);
    }
  }

  get(index) {
    return this.colors[index];
  }
}

export default new ColorManager();
