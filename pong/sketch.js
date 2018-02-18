let pong; 
let PADDLE = {LEFT:0, RIGHT:1};

function setup() {
	pong = new Pong();
}

function draw() {
	pong.update();
}


class Pong {
	constructor(){
		createCanvas(1000, 600);
		
		frameRate(60);
		this.leftPaddle = new Paddle(PADDLE.LEFT);
		this.rightPaddle = new Paddle(PADDLE.RIGHT);
		this.points = new Int16Array(2);
		this.ball = new Ball();
		this.scoreElemP1 = document.getElementById("player1");
		this.scoreElemP2 = document.getElementById("player2");
	}

	update(){
		//controls		
		if(keyIsDown(87))
			this.leftPaddle.move(-1);
		else if(keyIsDown(83))
			this.leftPaddle.move(1);

		if(keyIsDown(UP_ARROW))
			this.rightPaddle.move(-1);
		else if(keyIsDown(DOWN_ARROW))
			this.rightPaddle.move(1);


		//update
		this.leftPaddle.update();
		this.rightPaddle.update();
		this.ball.update();

		background(0, 22, 59);

		//draw
		this.leftPaddle.show();
		this.rightPaddle.show();
		this.ball.show();
	}

	goal(player) {
		this.points[player]++;
		this.scoreElemP1.innerHTML = this.points[PADDLE.LEFT];
		this.scoreElemP2.innerHTML = this.points[PADDLE.RIGHT];
		this.ball.reset();
		this.leftPaddle.reset();
		this.rightPaddle.reset();
	}

	start() {
		this.ball.enabled = true;		
	}
}