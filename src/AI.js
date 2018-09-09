class AI {
	constructor() {
		this.generationAmount = 0;
		this.neuvol = new Neuroevolution({
			population: 100,
			network: [2, [2], 2],
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
