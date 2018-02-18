

class Ball {
    constructor() {
        this.pos = {x: width/2, y: height/2};
        this.motion = {x:0, y: 0};
        this.speed;
        this.reset();
        
    }


    reset() {
        this.enabled = false;
        this.pos = {x: width/2, y: height/2};
        this.speed = 5;
        let angle = random() * PI ;
        if(angle < PI/2)
            angle += -PI/4 - PI /2;    
        else
            angle += PI/4 - PI /2;
        this.motion.x = Math.sin(angle) * this.speed;
        this.motion.y = Math.cos(angle) * this.speed;

    }


    update() {
        if(!this.enabled ) return;

        this.pos.x += this.motion.x;
        this.pos.y += this.motion.y;
        //hittest goals
        if(this.pos.x + 20 < 0)
            pong.goal(PADDLE.RIGHT);
        else if( this.pos.x - 20 > width )
            pong.goal(PADDLE.LEFT);
        
        //hittest borders
        if(this.pos.y - 10 < 0) {
            this.pos.y = 10;
            this.motion.y = -this.motion.y;
        }
        else if( this.pos.y +10 > height) {
            this.pos.y = height - 10;
            this.motion.y = -this.motion.y;
        }

        pong.leftPaddle.checkCollision(this);
        pong.rightPaddle.checkCollision(this);
         
            
        
    }

    reflect() {
       
    }

    show() {
        fill(255);
        rectMode(RADIUS); 
        ellipse(this.pos.x, this.pos.y, 20, 20);
        rectMode(CORNER); 
    }

}