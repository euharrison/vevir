import Config from '../Config';

class AI {
	constructor() {
		this.generationAmount = 0;
		this.neuvol = new Neuroevolution({
			population: Config.population < 2 ? 2 : Config.population,
			// network: [2, [2], 3],
			network: [2, [2], 1],

			// elitism: 0.5, // Best networks kepts unchanged for the next

			historic: 5,
			lowHistoric: true,

			// // various factors and parameters (along with default values).
			// network: [1, [1], 1], // Perceptron network structure (1 hidden
			// // layer).
			// population: 50, // Population by generation.
			// elitism: 0.2, // Best networks kepts unchanged for the next
			// // generation (rate).
			// randomBehaviour: 0.2, // New random networks for the next generation
			// // (rate).
			// mutationRate: 0.1, // Mutation rate on the weights of synapses.
			// mutationRange: 0.5, // Interval of the mutation changes on the
			// // synapse weight.
			// historic: 0, // Latest generations saved.
			// lowHistoric: false, // Only save score (not the network).
			// scoreSort: -1, // Sort order (-1 = desc, 1 = asc).
			// nbChild: 1 // Number of children by breeding.
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
		this.neuvol.networkScore(this.geneneration[index], score);
	}
}

export default new AI()
