let CELL_SIZE = 80;
let padding = 5;
let WIDTH = HEIGHT = 5 * padding + 4 * CELL_SIZE;
let game;

function setup() {
	createCanvas(WIDTH, HEIGHT);
	newGame();

}

function draw() {
	game.draw();

}

function newGame() {
	game = new Game2048();
}


function keyPressed() {
	game.shift(keyCode);
	game.gameOver != game.check();

}

function nextInt(max, min) {
	if (typeof min === 'undefined') min = 0;
	return (random() * (max - min + 1) | 0) + min;
}

class Game2048 {
	constructor() {
		this.board = [];
		this.gameOver = false;
		this.clearBoard();
		this.insertRandom();
		this.insertRandom();

	}


	draw() {
		background(75);
		
		let offset = CELL_SIZE + padding;
		translate(padding, padding);
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				let value = this.board[i][j];
				let col = color(200);
				if (value > 0) {
					colorMode(HSB, 255);
					let hue = Math.log2(value) / Math.log2(2048) / 6;
					col = color(255 * (1 / 6 - hue), 160, 255);
					colorMode(RGB, 255);
				}

				fill(col);
				rect(j * offset, i * offset, CELL_SIZE, CELL_SIZE);
				fill(0);
				textSize(20);
				textAlign(CENTER, CENTER);
				text(this.board[i][j], j * offset + CELL_SIZE / 2, i * offset + CELL_SIZE / 2);
			}
		}
	}

	clearBoard() {
		this.board = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		// this.board = [
		// 	[2, 4, 8, 16],
		// 	[32, 64, 128, 256],
		// 	[512, 1024, 2048, 0],
		// 	[0, 0, 0, 0]
		// ];
	}

	mirrorX() {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 2; j++) {
				let temp = this.board[i][j];
				this.board[i][j] = this.board[i][3 - j];
				this.board[i][3 - j] = temp;
			}
		}
	}

	rotate(dir) {
		let newMat = new Array(4);
		for (let i = 0; i < 4; i++) {
			newMat[i] = new Array(4);
		}

		for (let y = 0; y < 4; y++) {
			for (let x = 0; x < 4; x++) {
				if (dir == 1)
					newMat[x][4 - 1 - y] = this.board[y][x];
				else if (dir == -1)
					newMat[4 - 1 - x][y] = this.board[y][x];
			}
		}

		this.board = newMat;
	}

	check() {
		let cEmpty = 0;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (this.board[i][j] == 0)
					cEmpty++;
			}
		}
		if (cEmpty > 0)
			return true;

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {

				if (j > 0 && this.board[i][j - 1] == this.board[i][j])
					return true;
				if (i > 0 && this.board[i - 1][j] == this.board[i][j])
					return true;
			}
		}

		return false;
	}

	shift(dir) {
		let changed = false;
		switch (dir) {
			case LEFT_ARROW:
				changed = this.shiftLeft();
				break;
			case RIGHT_ARROW:
				this.mirrorX();
				changed = this.shiftLeft();
				this.mirrorX();
				break;
			case UP_ARROW:
				this.rotate(-1);
				changed = this.shiftLeft();
				this.rotate(1);
				break;
			case DOWN_ARROW:
				this.rotate(1);
				changed = this.shiftLeft();
				this.rotate(-1);
				break;
			default:
				return;
				break;
		}
		if (changed)
			this.insertRandom();

	}



	shiftLeft() {
		let copy = [];
		for (var i = 0; i < this.board.length; i++)
			copy[i] = this.board[i].slice(0);

		for (let i = 0; i < 4; i++) {
			//row
			let prev;
			let curr;
			let alreadyMerged = false;
			for (let j = 1; j < 4; j++) {
				if (j <= 0)
					prev = -1;
				else
					prev = this.board[i][j - 1];
				curr = this.board[i][j];
				if (prev == curr && curr > 0 && !alreadyMerged) {

					this.board[i][j - 1] *= 2; //double prev
					this.board[i][j] = 0; // curr zero
					alreadyMerged = true;

				} else {
					if (prev == 0 && curr > 0) {
						this.board[i][j] = 0;
						this.board[i][j - 1] = curr;
						j -= 2;
					}
				}
			}
		}

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (copy[i][j] != this.board[i][j])
					return true;
			}
		}
		return false;
	}

	insertRandom() {
		let value = random() > .80 ? 4 : 2;
		let emptyCells = 0;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (this.board[i][j] == 0) {
					emptyCells++;
				}
			}
		}
		let insertPos = nextInt(emptyCells - 1);
		let currIndex = 0;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (this.board[i][j] == 0) {
					if (currIndex == insertPos) {
						this.board[i][j] = value;
						return;
					}
					currIndex++;
				}

			}
		}

	}
}