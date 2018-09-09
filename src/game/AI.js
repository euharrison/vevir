import Config from '../Config';

class AI {
	constructor() {
		this.generationAmount = 0;
		this.neuvol = new Neuroevolution({
			population: Config.population < 2 ? 2 : Config.population,
			network: [2, [2], 3],
		});
	}

	nextGeneration() {
		this.geneneration = this.neuvol.nextGeneration();
		this.generationAmount++;
	}

	compute(index, inputs) {
		return this.geneneration[index].compute(inputs);
	}

	setScore(index, score) {
		this.neuvol.networkScore(this.geneneration[index], this.score);
	}
}

export default new AI()
