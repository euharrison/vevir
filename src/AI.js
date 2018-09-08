// var Neuvol;
// var game;
// var maxScore=0;
// var differentTypesOfFood = 10;

// Bird.prototype.checkFood = function(food, fed){
// 	if (fed) {
// 		this.weight += food.isPoison ? -20 : 5;
// 	}
// 	this.fedLastFood = fed;
// }

// this.ctx.fillText("Score : "+ this.score, 10, 25);
// this.ctx.fillText("Max Score : "+this.maxScore, 10, 50);
// this.ctx.fillText("Generation : "+this.generation, 10, 75);
// this.ctx.fillText("Alive : "+this.alives+" / "+Neuvol.options.population, 10, 100);


class AI {
	constructor() {
		this.Neuvol = new Neuroevolution({
			population: 10,
			network: [2, [2], 1],
		});
	}

	start() {
		// 	// this.score = 0;
		// 	// this.foods = [];
		// 	// this.birds = [];

		this.gen = this.Neuvol.nextGeneration();
				console.log('this.gen', this.gen);
			for (var i in this.gen) {
				const index = Number(i);
				var percent = index / this.gen.length;
				// console.log('this.gen', this.gen);
				// var b = new Bird({
				// 	x: this.width * 0.2,
				// 	y: this.height * percent,
				// 	index: index,
				// });
				// this.birds.push(b)
			}
		// 	this.generation++;
		// 	this.alives = this.birds.length;
	}

	process(inputs, i) {
		return this.gen[i].compute(inputs);
		// var fed = res > 0.5;
	}

	setScore(score, i) {
		this.Neuvol.networkScore(this.gen[i], this.score);
	}
}

export default new AI()
