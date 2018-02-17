/**
 * A Simple jet lovely Tetris-Clone done with p5 :)
 * 
 * Author: Sven Weinstein
 * Email: sven.weinstein (at) gmail.com
 * https://github.com/winest0ne
 */

let shapes = [
    //I
    [[0,0,0,0],
     [1,1,1,1],
     [0,0,0,0],
     [0,0,0,0],],

    //J
    [[1,0,0],
     [1,1,1],
     [0,0,0]],

    //L
    [[0,0,1],
     [1,1,1],
     [0,0,0]],

    //O
    [[1,1],
     [1,1]],

    //S
    [[0,1,1],
     [1,1,0],
     [0,0,0]],

    //T
    [[0,1,0],
     [1,1,1],
     [0,0,0]],

    //Z
    [[1,1,0],
     [0,1,1],
     [0,0,0]],
];

let colors = ['#00FFFF', '#0000FF', '#FFA500', '#FFFF00', '#00FF00', '#800080', '#FF0000' ];



class Tetroid {
    

    constructor(shapeId){
        this.shapeId = shapeId;
        this.matrix = shapes[shapeId].slice(0);
        this.isFalling = false;
        this.spawned = false;
        this.posX = 3;
        this.posY = -1;
        this.lockingCycles = 0;
    }

    spawn() {
        this.isFalling = true;
    }

    update() {
        let doUpdate = false;
        if(!this.isFalling) return; 
        //normal update
        
        if(frameCount % tetris.dropSpeed == 0 ) doUpdate = true;
        //softDropping
        if(tetris.softDrop && frameCount % 4 == 0) doUpdate = true;

        if(!doUpdate) return;
        console.log(tetris.dropSpeed);

        this.posY++;


        if(this.collidesVertical()){
            //rollback
            this.posY--; 
            //engage locking
            this.lockingCycles++;
            //trigger locking
            if(this.lockingCycles >= 2) {
                this.lockingCycles = 0;
                this.place();
                return;
            }    
        }

    }


    get width(){
        return this.matrix[0].length;
    }

    get height(){
        return this.matrix.length;
    }

    show() {
        let drawX = this.posX  * CELL_SIZE;
        let drawY = (this.posY - this.height + 1) * CELL_SIZE;
        tetris.drawTetr(this, drawX, drawY);
    }

    turn(dir) {
        //create rotatedArray
        let newMat = new Array(this.width);
        for(let i = 0; i < newMat.length; i++) {
            newMat[i] = new Int8Array(this.height);
        }
    
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(dir == 1) 
                    newMat[x][this.height - 1 - y] = this.matrix[y][x]; 
                else if(dir == -1)
                    newMat[this.width -1 - x][y] = this.matrix[y][x];
            }
        }
        let oldMat = this.matrix;
        this.matrix = newMat;

        //wallkick
        if(this.collidesHorizontal())
            this.posX++;
        if(this.collidesHorizontal())
            this.posX -=2;
        if(this.collidesHorizontal()) {
            this.posX++;
            this.matrix = oldMat;
        }

    }

    move(dir) {
        if(!this.isFalling) return;
        let oldPos = this.posX;
            this.posX += dir;
        if(this.collidesHorizontal())
            this.posX = oldPos;
    }

    place(){
        this.isFalling = false;
        for(let tetrY = 0; tetrY < this.height; tetrY++) {
			for(let tetrX = 0; tetrX < this.width; tetrX++) {
                let containerY = tetrY + this.posY - this.height + 1;
                if(containerY < 0) {
                    tetris.gameOver();
                    return;
                }                    
                if(this.matrix[tetrY][tetrX] == 1) {
                    tetris.container[containerY][tetrX + this.posX] = this.shapeId + 1;
                }
            }
        }
        tetris.currTetr = undefined;
    }

    collidesVertical(){
        for(let tetrY = 0; tetrY < this.height; tetrY++) {
			for(let tetrX = 0; tetrX < this.width; tetrX++) {
                
                if(this.matrix[tetrY][tetrX] == 1) {
                    let containerY = tetrY + this.posY - this.height + 1;
                    let containerX = tetrX + this.posX;
                    if(containerY > 19)
                        return true;
                    if(containerY >=0 && tetris.container[containerY][containerX] > 0)
                        return true;
                }
            }
        }
    }

    collidesHorizontal(tryWallkick){
        for(let tetrY = 0; tetrY < this.height; tetrY++) {
			for(let tetrX = 0; tetrX < this.width; tetrX++) {
                //matrix has piece
                if(this.matrix[tetrY][tetrX] == 1) {
                    let containerY = tetrY + this.posY - this.height + 1;
                    let containerX = tetrX + this.posX;

                    if(containerX < 0 || containerX > 9)
                        return true;
                    if(containerY >=0 && tetris.container[containerY][containerX] > 0)
                        return true;
                }
            }
        }
    }



}