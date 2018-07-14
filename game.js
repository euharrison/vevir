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
	this.health = 2500;

	this.init(json);
}

Bird.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Bird.prototype.eat = function(food){
	if (food) {
		this.health += food.isPoison ? -500 : 500;
	}
}

Bird.prototype.update = function(){
	this.health--;
}

Bird.prototype.isDead = function(){
	return this.health < 0 || this.health > 5000;
}

var Food = function(json){
	this.x = 0;
	this.y = 0;
	this.width = 130;
	this.height = 130;
	this.speed = 3;
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
		var percent = Number(i)/this.gen.length;
		var b = new Bird({
			x: this.width / 2,
			y: this.height * percent,
		});
		this.birds.push(b)
	}
	this.generation++;
	this.alives = this.birds.length;
}

Game.prototype.update = function(){
	this.backgroundx += this.backgroundSpeed;

	var foodEaten = false;

	for(var i in this.birds){
		if(this.birds[i].alive){

			if (!this.nextFood) {
				this.nextFood = new Food({x:this.width, y:this.height/2, id: Math.floor(Math.random() * 100) + 1 });
				this.foods.push(this.nextFood);
			}

			if (this.nextFood.x < this.width/2) {
				foodEaten = true;

				var inputs = [
					this.birds[i].health,
					this.nextFood.isPoison ? 1 : 0,
				];
				var res = this.gen[i].compute(inputs);
				if(res > 0.5){
					this.birds[i].eat(this.nextFood);
				}
			}

			this.birds[i].update();

			if(this.birds[i].isDead()){
				this.birds[i].alive = false;
				this.alives--;

				Neuvol.networkScore(this.gen[i], this.score);

				if(this.isItEnd()){
					this.start();
				}
			}
		}
	}

	if (foodEaten) {
		this.nextFood = null;
	}

	for(var i = 0; i < this.foods.length; i++){
		this.foods[i].update();
		if(this.foods[i].isOut()){
			this.foods.splice(i, 1);
			i--;
		}
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
		var y = this.foods[i].y + this.foods[i].height;
		if (this.foods[i].isPoison) {
			this.ctx.drawImage(images.avocadoPoison, x, y, this.foods[i].width, this.foods[i].height);
		} else {
			this.ctx.drawImage(images.avocado, x, y, this.foods[i].width, this.foods[i].height);
		}
		this.ctx.fillText('Alimento '+this.foods[i].id, x, y);
		this.ctx.fillText(this.foods[i].isPoison ? 'POISON!!!' : 'saudavel', x, y + 20);
	}

	this.ctx.fillStyle = "#FFC600";
	this.ctx.strokeStyle = "#CE9E00";
	for(var i in this.birds){
		if(this.birds[i].alive){
			this.ctx.save(); 
			this.ctx.translate(this.birds[i].x + this.birds[i].width/2, this.birds[i].y + this.birds[i].height/2);
			this.ctx.rotate(Math.PI/2 * this.birds[i].gravity/20);
			this.ctx.drawImage(images.bird, -this.birds[i].width/2, -this.birds[i].height/2, this.birds[i].width, this.birds[i].height);
			this.ctx.fillText(this.birds[i].health, 0, 0);
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
		avocadoPoison:"./img/avocado-poison.png",
	}

	var start = function(){
		Neuvol = new Neuroevolution({
			population:10,
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
