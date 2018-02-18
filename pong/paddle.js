let GAP = 40;
class Paddle {
    constructor(side) {
        this.size = {w: 20 , h: 100}
        this.pos = {x: 0  , y: 0};
        this.speed = 12;

        if(side == PADDLE.LEFT)
            this.pos.x = GAP;
        else if(side == PADDLE.RIGHT)
            this.pos.x = width - GAP - this.size.w;
        this.reset();
    }


    reset(){
        this.pos.y = height/2 - this.size.h /2;
    }

    update() {

    }

    checkCollision(ball) {
        if(ball.pos.y >= this.pos.y && ball.pos.y <= this.pos.y + this.size.h) {
            let relYPaddle = (ball.pos.y - this.pos.y) / this.size.h;
            if (Math.abs(this.pos.x - ball.pos.x) < 10) {

                ball.pos.x = this.pos.x - 10;
                ball.speed *= 1.05;
                let angle = PI / 180 * ((150 * relYPaddle) + 15) - PI;
                ball.motion.x = Math.sin(angle) * ball.speed;
                ball.motion.y = Math.cos(angle) * ball.speed;

            } else if (Math.abs(this.pos.x + this.size.w - ball.pos.x) < 10) {

                ball.pos.x = this.pos.x + this.size.w + 10;
                ball.speed *= 1.05;
                let angle = PI / 180 * ((150 * relYPaddle) + 15) - PI;
                ball.motion.x = -Math.sin(angle) * ball.speed;
                ball.motion.y = Math.cos(angle) * ball.speed;
            }
        }
    }

    show() {
        fill(255);
        rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        //this.debugTrace();
    }

    debugTrace(){
        stroke(255, 204, 0);
        for(let i = 0; i <= this.size.h; i +=5 ) {
            let x1 = this.pos.x + this.size.w;
            let y1 = this.pos.y + i;
            let relYPaddle = i / this.size.h;
            let angle = PI / 180 * ((150 * relYPaddle) + 15) - PI;
            let x2 = -Math.sin(angle) * 200 + x1;
            let y2 = Math.cos(angle) * 200 + y1;
            
            line(x1,y1,x2,y2);
        }

        for(let i = 0; i <= this.size.h; i +=5 ) {
            let x1 = this.pos.x;
            let y1 = this.pos.y + i;
            let relYPaddle = i / this.size.h;
            let angle = PI / 180 * ((150 * relYPaddle) + 15) - PI;
            let x2 = Math.sin(angle) * 200 + x1;
            let y2 = Math.cos(angle) * 200 + y1;
            
            line(x1,y1,x2,y2);
        }
        stroke(0);
    }

    move(direction) {
        pong.start();
        let oldPos = this.pos.y;
        this.pos.y += direction * this.speed;

        if(this.pos.y + direction < 0)
            this.pos.y = 0;
        else if(this.pos.y + direction > height - this.size.h )
        this.pos.y = height - this.size.h;
            
       
        
    }

}