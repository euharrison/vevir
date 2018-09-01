import Render from './Render';

(function() {
	var timeouts = [];
	var messageName = "zero-timeout-message";

	function setZeroTimeout(fn) {
		timeouts.push(fn);
		window.postMessage(messageName, "*");
	}

	function handleMessage(event) {
		if (event.source == window && event.data == messageName) {
			event.stopPropagation();
			if (timeouts.length > 0) {
				var fn = timeouts.shift();
				fn();
			}
		}
	}

	window.addEventListener("message", handleMessage, true);

	window.setZeroTimeout = setZeroTimeout;
})();

var Neuvol;
var game;
var FPS = 60;
var maxScore=0;
var differentTypesOfFood = 10;

var images = {};

var speed = function(fps){
	FPS = parseInt(fps);
}

var loadImages = function(sources, callback){
	var nb = 0;
	var loaded = 0;
	var imgs = {};
	for(var i in sources){
		nb++;
		imgs[i] = new Image();
		imgs[i].src = sources[i];
		imgs[i].onload = function(){
			loaded++;
			if(loaded == nb){
				callback(imgs);
			}
		}
	}
}

var Bird = function(json){
	this.x = 80;
	this.y = 250;
	this.width = 40;
	this.height = 30;

	this.alive = true;
	this.gravity = 0;
	this.velocity = 0.3;
	this.jump = -6;
	this.weight = 75;

	this.init(json);
}

Bird.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Bird.prototype.checkFood = function(food, fed){
	if (fed) {
		this.weight += food.isPoison ? -20 : 5;
	}
	this.fedLastFood = fed;
}

Bird.prototype.update = function(){
	this.weight -= 0.02;
}

Bird.prototype.isDead = function(){
	return this.weight < 50 || this.weight > 100;
}

var Food = function(json){
	this.x = 0;
	this.y = 0;
	this.width = 130;
	this.height = 130;
	this.speed = 5;
	this.id = 1;

	this.init(json);

	this.isPoison = this.id % 2 === 1;
}

Food.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Food.prototype.update = function(){
	this.x -= this.speed;
}

Food.prototype.isOut = function(){
	if(this.x + this.width < 0){
		return true;
	}
}

var Game = function(){
	this.foods = [];
	this.birds = [];
	this.score = 0;
	this.canvas = document.querySelector("#flappy");
	this.ctx = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.gen = [];
	this.alives = 0;
	this.generation = 0;
	this.backgroundSpeed = 0.5;
	this.backgroundx = 0;
	this.maxScore = 0;
}

Game.prototype.start = function(){
	this.score = 0;
	this.foods = [];
	this.birds = [];

	this.nextFood = null;

	this.gen = Neuvol.nextGeneration();
	for(var i in this.gen){
		const index = Number(i);
		var percent = index/this.gen.length;
		var b = new Bird({
			x: this.width * 0.2,
			y: this.height * percent,
		});
		this.birds.push(b)

		Render.addHuman(index);
	}
	this.generation++;
	this.alives = this.birds.length;
}

Game.prototype.update = function(){
	this.backgroundx += this.backgroundSpeed;

	for(var i = 0; i < this.foods.length; i++){
		this.foods[i].update();
		if(this.foods[i].isOut()){
			this.foods.splice(i, 1);
			i--;
		}
	}

	var foodEaten = false;

	for(var i in this.birds){
		if(this.birds[i].alive){

			if (!this.nextFood) {
				var id = Math.floor(Math.random() * differentTypesOfFood) + 1;
				this.nextFood = new Food({x:this.width, y:(id-1)*this.height/differentTypesOfFood, id:id });
				this.foods.push(this.nextFood);
			}

			if (this.nextFood.x < this.width * 0.2) {
				foodEaten = true;

				var inputs = [
					this.nextFood.id,
					Math.floor(this.birds[i].weight/10),
				];
				// console.log(inputs)
				var res = this.gen[i].compute(inputs);
				var fed = res > 0.5;
				this.birds[i].checkFood(this.nextFood, fed);
			}

			this.birds[i].update();

			if(this.birds[i].isDead()){
				this.birds[i].alive = false;
				this.alives--;

				Neuvol.networkScore(this.gen[i], this.score);
			}
		}
	}

	if (foodEaten) {
		this.nextFood = null;
	}

	this.score++;
	this.maxScore = (this.score > this.maxScore) ? this.score : this.maxScore;
	var self = this;

	if(FPS == 0){
		setZeroTimeout(function(){
			self.update();
		});
	}else{
		setTimeout(function(){
			self.update();
		}, 1000/FPS);
	}

	if(this.isItEnd()){
		this.start();
	}
}

Game.prototype.isItEnd = function(){
	for(var i in this.birds){
		if(this.birds[i].alive){
			return false;
		}
	}
	return true;
}

Game.prototype.display = function(){
	this.ctx.clearRect(0, 0, this.width, this.height);
	for(var i = 0; i < Math.ceil(this.width / images.background.width) + 1; i++){
		this.ctx.drawImage(images.background, i * images.background.width - Math.floor(this.backgroundx%images.background.width), 0)
	}

	for(var i in this.foods){
		var x = this.foods[i].x;
		var y = this.foods[i].y;
		if (this.foods[i].isPoison) {
			this.ctx.drawImage(images.poop, x, y, this.foods[i].width, this.foods[i].height);
		} else {
			this.ctx.drawImage(images.avocado, x, y, this.foods[i].width, this.foods[i].height);
		}
		if (this.foods[i].isPoison) {
			this.ctx.fillStyle = "#FF0000";
		} else {
			this.ctx.fillStyle = "#FFFFFF";
		}
		this.ctx.fillText('Alimento '+this.foods[i].id, x+130, y+50);
		this.ctx.fillText(this.foods[i].isPoison ? 'VENENO !!!' : 'Saudavel', x+130, y+50+20);
	}

	this.ctx.fillStyle = "#FFFFFF";
	this.ctx.strokeStyle = "#CE9E00";
	for(var i in this.birds){
		if(this.birds[i].alive){
			this.ctx.save(); 
			this.ctx.translate(this.birds[i].x + this.birds[i].width/2, this.birds[i].y + this.birds[i].height/2);
			this.ctx.rotate(Math.PI/2 * this.birds[i].gravity/20);

			var maxDiff = 25;
			var sizePercent = 1 + (this.birds[i].weight - 75)/maxDiff;
			var width = this.birds[i].width * sizePercent;
			var height = this.birds[i].height * sizePercent;
			this.ctx.drawImage(images.bird, -width/2, -height/2, width, height);

			this.ctx.fillText(this.birds[i].weight.toFixed(0)+'kg', 25, 8);
			this.ctx.fillText(this.birds[i].fedLastFood ? 'nham nham' : '', 100, 8);

			this.ctx.restore();
		}
	}

	this.ctx.fillStyle = "white";
	this.ctx.font="20px Oswald, sans-serif";
	this.ctx.fillText("Score : "+ this.score, 10, 25);
	this.ctx.fillText("Max Score : "+this.maxScore, 10, 50);
	this.ctx.fillText("Generation : "+this.generation, 10, 75);
	this.ctx.fillText("Alive : "+this.alives+" / "+Neuvol.options.population, 10, 100);

	var self = this;
	requestAnimationFrame(function(){
		self.display();
	});
}

window.onload = function(){
	var sprites = {
		bird:"./img/bird.png",
		background:"./img/background.png",
		avocado:"./img/avocado.png",
		poop:"./img/poop.png",
	}

	var start = function(){
		Neuvol = new Neuroevolution({
			population: 10,
			network:[2, [2], 1],
		});
		game = new Game();
		game.start();
		game.update();
		game.display();
	}


	loadImages(sprites, function(imgs){
		images = imgs;
		start();
	})

}
