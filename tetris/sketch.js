/**
 * A Simple jet lovely Tetris-Clone done with p5 :)
 * 
 * Author: Sven Weinstein
 * Email: sven.weinstein (at) gmail.com
 * https://github.com/winest0ne
 */

let CELL_SIZE = 20;
let CONTAINER_OFFSET = {x: 20, y:100};
let DEBUG = false;
let BG_COLOR1 = '#00001d';
let BG_COLOR2 = '#20205c';
let tetris;

function setup() {
	createCanvas(600, CELL_SIZE * 26);
	tetris = new Tetris();
}

function draw() {
	tetris.draw();
}

function keyPressed(){
    if(tetris.isGameOver && keyCode == 32)
        tetris = new Tetris();
    if (keyCode === UP_ARROW && !tetris.turnRequest) {
		tetris.turnRequest = true;
    }
}

function nextInt(max, min){
    if (typeof min === 'undefined') min = 0;
   return (random() * (max - min + 1) | 0 ) + min;
}

function lighten(c, mult){
	colorMode(HSL, 255);
	let col = color(hue(c), saturation(c), lightness(c) * mult);
	colorMode(RGB, 255);
	return col;
}


class Tetris {
	constructor(){
		this.container;
		this.currTetr;
		this.level = 0;
		this.dropSpeed;
		this.rows = 0;
		this.score = 0;
		this.turnRequest = false;
		this.keyHold = false;
		this.isGameOver = false;
		this.tetrisBag = this.fillBag();
		this.createContainer();
		frameRate(60);
	}

	draw(){	
		this.update();

		background(BG_COLOR1);
		translate(width/2 - CELL_SIZE * 5, 60);
		this.drawContainer();

		if(this.currTetr !== undefined) this.currTetr.show();
		translate(CELL_SIZE * 16, 0);
		this.showNextTetr();

		if(this.isGameOver) this.showGameOver();
	}

	update(){
		if(this.isGameOver) return;

		this.dropSpeed = this.getNESDropSpeed(this.level);
		

		if(this.currTetr === undefined) {
			this.rowCheck();
			this.popTetroid();
		}

		if(this.turnRequest) {
			this.currTetr.turn(1);
			this.turnRequest = false;
		}

		if(keyIsDown(DOWN_ARROW)) this.softDrop = true; else this.softDrop = false;

		if(!this.keyHold || frameCount % 6 == 0) {
			if(keyIsDown(LEFT_ARROW)) this.currTetr.move(-1);
			if(keyIsDown(RIGHT_ARROW)) this.currTetr.move(1);	
			this.keyHold = true;
		}

		if(!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) ) {
			this.keyHold = false;
		}

		this.currTetr.update();
	}

	updateScore(rows) {
        let pointsPerRows = [0, 40, 100, 300, 1200];
        this.score += (this.level+1) * pointsPerRows[rows];
	}
	
	rowCheck(){
        let rows = 0; 
        for(let y = 19; y >= 0; y--) {
            let rowComplete = true;
            for(let x = 0; x < 10; x++) {
                if(this.container[y][x] == 0) {
                    rowComplete = false;
                    break;
                }                 
            }

            if(rowComplete) {
                this.container[y] = new Int8Array(10);
                let deletedRow = this.container[y];
                for(let y1 = y; y1 > 0; y1--) {
                    this.container[y1] = this.container[y1-1];
                }
                this.container[0] = deletedRow;
                rows++;
                y++;
            }            
        }
        this.updateScore(rows);
		this.rows += rows;
		if(rows > 0 && this.rows % 10 == 0) {
			this.level++;
		}
			
		
    }

	gameOver(){
		this.isGameOver = true;
	}

	popTetroid(){
		this.currTetr = this.tetrisBag.pop();
		if(this.tetrisBag.length == 0)
			this.tetrisBag = this.fillBag();
		this.currTetr.spawn();
	}

	showGameOver() {
        resetMatrix()
		background(BG_COLOR1);

        textAlign(CENTER, BOTTOM);
        textSize(50);
		fill(255, 200, 0);
		text("Score: " + this.score, width/2, height/2);
        fill(255, 0, 0);
        text("GAME OVER!", width/2, height/2 - 100);
        textAlign(CENTER, TOP);
		textSize(25);
		textStyle(BOLD);
		fill(200);
        text("press [SPACE] to play again", width/2, height/2 + 100);
	}

	drawTetr(tetr, offX, offY) {

		for(let y = 0; y < tetr.height; y++) {
			for(let x = 0; x < tetr.width; x++) {
				if(tetr.matrix[y][x] > 0) {
					
					fill(colors[tetr.shapeId]);
					rect(x * CELL_SIZE + offX, y * CELL_SIZE + offY, CELL_SIZE, CELL_SIZE);
				} else {
					if(DEBUG) {
						fill(200,200,200,20);
						rect(x * CELL_SIZE + offX, y * CELL_SIZE + offY, CELL_SIZE, CELL_SIZE);
					}
				}	
			}									
		}
	}



	drawContainer(){
		
		fill(BG_COLOR2);
		rect(0,0, 10 * CELL_SIZE, 20 * CELL_SIZE);
		fill(0);

		//horizontal lines
		for(let i = 0; i <=20; i++) {
			let height = i * CELL_SIZE;
			line(0, height, 10* CELL_SIZE, height);
		}

		//vertical lines
		for(let i = 0; i <=10; i++) {
			let width = i * CELL_SIZE;
			line(width, 0, width, 20* CELL_SIZE);
		}

		//placed blocks
		for(let y = 0; y < 20; y++) {
			for(let x = 0; x < 10; x++) {
				let cVal = this.container[y][x];
				if(cVal > 0) {
					fill(colors[cVal - 1])
					rect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
				}
			}
		}
	}

	showNextTetr(){
		textAlign(RIGHT,TOP);
		fill(255);

		// right column
        textSize(30);
        text("Next:", 0, 0);
		let nextTetr = this.tetrisBag[this.tetrisBag.length - 1];
		this.drawTetr(nextTetr, - (nextTetr.width) * CELL_SIZE, 40) ;

		showInfo("Level:", leadingZeroes(this.level, 3), 0, 100);

		// left column
		resetMatrix();
		translate(width/2 - 140  , 60 );

		showInfo("Score:", leadingZeroes(this.score, 6), 0, 0);
		showInfo("Rows:", leadingZeroes(this.rows, 3), 0, 100);



		function leadingZeroes(value, digits){
			let str = value.toString();
			for (let i =str.length; i < digits; i++){
				str = '0' + str;
			}
			return str;
		}


		function showInfo(name, value, x, y) {

			textSize(30);
			fill(255);
			text(name, x, y);

			textSize(25);
			fill(255,240,0);
			text(value, x, y + 40); 
		}
		
        
    }


	createContainer(){
		this.container = new Array(20);
		for(let i = 0; i < 20; i++)
			this.container[i] = new Int8Array(10);
		//predefine containers content, more in presets.js	
		//injectArray(this.container, doubleTSpinSetup);
	}

	fillBag(){
		
		let tempBag = new Array(7);
		for(let i = 0; i < 7; i++) {
			tempBag[i] = new Tetroid(i);
		}

		for(let i = 7; i > 0; i--) {
			let rnd = nextInt(i - 1);
			let startIdx = 7 - i;
			let index2 = rnd + startIdx;
			swap(tempBag, startIdx, index2);
		}

		function swap(arr ,i, j) {
			let temp;
			temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp; 
		}
		
		return tempBag;
	}

	getNESDropSpeed(level) {
		let lowerLevels = [48,43,38,33,28,23,18,13,8,6];
		if(level < 10) return lowerLevels[level];
		else if(level <=15) return 5;
		else if (level >= 16 && level <= 18) return 4;
		else if (level >= 19 && level <= 28) return 4;  
		else return 1;      
	}

}

