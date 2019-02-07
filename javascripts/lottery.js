
    var canvas, ctx, container;
    canvas = document.createElement( 'canvas' );
    ctx = canvas.getContext("2d");
    var balls = []

    var interval = null

    var vx = 5.0;
    var vy;
    var i = 0;
    
    var gravity = 0.5;  
    var bounce = 0.7; 
    var xFriction = 0.4;

    function Ball(x, y, radius) {
        this.radius = radius;
        this.vx = 5.0;
        this.vy = 0;
        this.mass = this.radius * this.radius * this.radius;
        this.x = x;
        this.y = y;
        this.color = 'white';
        this.text = Math.floor(Math.random() * 100) + 1
        this.draw = function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.stroke()
            ctx.closePath();
        };
        this.speed = function() {
            // magnitude of velocity vector
            return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        };
        this.angle = function() {
            //angle of ball with the x axis
            return Math.atan2(this.vy, this.vx);
        };
        this.kineticEnergy = function () {
            return (0.5 * this.mass * this.speed() * this.speed());
        };
        this.onGround = function() {
            return (this.y + this.radius == canvas.height)
        }
    }

    function randomX() {
        x = Math.floor(Math.random() * canvas.width);
        if (x < 30) {
            x = 30;
        } else if (x + 30 > canvas.width) {
            x = canvas.width - 30;
        }
        return x;
    }

    function randomY() {
        y = Math.floor(Math.random() * canvas.height);
        if (y < 30) {
            y = 30;
        } else if (y + 30 > canvas.height) {
            y = canvas.height - 30;
        }
        return y;
    }

    function randomColor() {
        red = Math.floor(Math.random() * 3) * 127;
        green = Math.floor(Math.random() * 3) * 127;
        blue = Math.floor(Math.random() * 3) * 127;
        rc = "rgb(" + red + ", " + green + ", " + blue + ")";
        return rc;
    }
 
    function init(){
       setupCanvas();
      vy = (Math.random() * -15) + -5;

        for (let i = 0; i < 30; i++) {
            balls.push(new Ball(randomX(), randomY(), 22))
        }
 
    }//end init method
 
    function draw() {

        i++

        console.log(i)

        if (i >= 300 && i <= 320) {
            clearInterval(interval)
            i = 0
            return;
        }

        ctx.clearRect(0,0,canvas.width, canvas.height); 

        balls.map((ball) => {

            ball.draw()
            ballMovement(ball) 
            staticCollision()
            ballCollision()
            
        })
 
    }

    function doLottery() {

        for (var obj in balls) {
            balls[obj].vy -= Math.floor(Math.random() * 10) + 1;
            balls[obj].vx -= Math.floor(Math.random() * 10) + 1;
        }
    }

    interval = setInterval(draw, 1000/35); 
    
    function ballMovement(ball){

            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vy += gravity;

            ctx.beginPath()
            ctx.fillStyle = "black";
            ctx.font = "bold 18px Arial";
            ctx.textAlign="center";
            ctx.fillText(ball.text, ball.x, ball.y);
            
            //If either wall is hit, change direction on x axis
            if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0){
                ball.vx *= -1;
            } 
            
              // Ball hits the floor
            if (ball.y + ball.radius > canvas.height){// ||
              
                // Re-positioning on the base
               ball.y = canvas.height - ball.radius;
                //bounce the ball
                  ball.vy *= -bounce;
                //do this otherwise, ball never stops bouncing
                  if(ball.vy<0 && ball.vy>-2.1)
                            ball.vy=0;
                //do this otherwise ball never stops on xaxis
                 if(Math.abs(ball.vx)<1.1)
                     ball.vx=0;
           
                 xF(ball);
                 
            }
        
    }

    function distanceNextFrame(a, b) {
        return Math.sqrt((a.x + a.vx - b.x - b.vx)**2 + (a.y + a.vy - b.y - b.vy)**2) - a.radius - b.radius;
    }

    function distance(a, b) {
        return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
    }
    
    function ballCollision() {
        for (var obj1 in balls) {
            for (var obj2 in balls) {
                if (obj1 !== obj2 && distanceNextFrame(balls[obj1], balls[obj2]) <= 0) {
                    var theta1 = balls[obj1].angle();
                    var theta2 = balls[obj2].angle();
                    var phi = Math.atan2(balls[obj2].y - balls[obj1].y, balls[obj2].x - balls[obj1].x);
                    var m1 = balls[obj1].mass;
                    var m2 = balls[obj2].mass;
                    var v1 = balls[obj1].speed();
                    var v2 = balls[obj2].speed();

                    var dx1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);
                    var dy1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(theta1-phi) * Math.sin(phi+Math.PI/2);
                    var dx2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(theta2-phi) * Math.cos(phi+Math.PI/2);
                    var dy2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(theta2-phi) * Math.sin(phi+Math.PI/2);

                    balls[obj1].vx = dx1F;                
                    balls[obj1].vy = dy1F;                
                    balls[obj2].vx = dx2F;                
                    balls[obj2].vy = dy2F;
                }            
            }
            //ballMovement(balls[obj1]);
        }
    } 

    function staticCollision() {
        for (var obj1 in balls) {
            for (var obj2 in balls) {
                if (obj1 !== obj2 &&
                    distance(balls[obj1], balls[obj2]) < balls[obj1].radius + balls[obj2].radius)
                {
                    var theta = Math.atan2((balls[obj1].y - balls[obj2].y), (balls[obj1].x - balls[obj2].x));
                    var overlap = balls[obj1].radius + balls[obj2].radius - distance (balls[obj1], balls[obj2]);
                    var smallerObject = balls[obj1].radius < balls[obj2].radius ? obj1 : obj2
                    balls[smallerObject].x -= overlap * Math.cos(theta);
                    balls[smallerObject].y -= overlap * Math.sin(theta);
                }
            }
        }
    }  

    function xF(ball){
         if(ball.vx>0)
            ball.vx = ball.vx - xFriction;
         if(ball.vx<0)
            ball.vx = ball.vx + xFriction;
    }
    
    
    
    
    
 
     function setupCanvas() {//setup canvas
 
 
        container = document.createElement( 'div' );
        container.className = "balls-container";
     
        canvas.width = 300; 
        canvas.height = 300; 
        document.querySelector(".globe-wrap").appendChild( container );
        container.appendChild(canvas);  
     
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth =2;   
    }
 