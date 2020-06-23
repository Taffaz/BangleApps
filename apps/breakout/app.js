//global constants
const BALL_RADIUS = 2;
const SCREEN_WIDTH = 120;
const SCREEN_HEIGHT = 120;
const PADDLE_HEIGHT = 4;
const PADDLE_WIDTH = 20;
const BRICK_WIDTH = 15;
const BRICK_HEIGHT = 3;
const BRICK_PADDING = 5;
const BRICK_OFFSET_TOP = 20;
const BRICK_OFFSET_LEFT = 2;

//global variables
var paddleX = (SCREEN_WIDTH - PADDLE_WIDTH) / 2;
var ballX = SCREEN_WIDTH / 2;
var ballY = SCREEN_HEIGHT - 30;
var brickRowCount = 3;
var brickColCount = 6;
var bricks = [];
var dx = 3;
var dy = -3;
var gameOver = 0;

//instantiate bricks[]
function instantiateBricks(){
  for(var c = 0; c < brickColCount; c++){
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++){
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function drawBall(){
  g.fillCircle(ballX, ballY,BALL_RADIUS);
}

function drawPaddle(){
  g.fillRect(paddleX, SCREEN_HEIGHT - PADDLE_HEIGHT,paddleX + PADDLE_WIDTH, SCREEN_HEIGHT - 2*PADDLE_HEIGHT);
}

function drawBricks(){
  for(var c = 0; c < brickColCount; c++){
    for(var r = 0; r < brickRowCount; r++){
      if(bricks[c][r].status == 1) {
        var brickX = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
        var brickY = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        g.fillRect(brickX, brickY, brickX + BRICK_WIDTH, brickY + BRICK_HEIGHT);
      }
    }
  }
}

function collisionDetection(){
  var testX = ballX;
  var testY = ballY;
  var distX, distY, distance;
  for(var c = 0; c < brickColCount; c++){
    for(var r = 0; r < brickRowCount; r++){
      var b = bricks[c][r];
      if(b.status == 1) {
        testX = ballX;
        testY = ballY;
        if(ballX < b.x){
          testX = b.x;
        } else if(ballX > b.x + BRICK_WIDTH){
          testX = b.x + BRICK_WIDTH;
        }
        if(ballY < b.y){
          testY = b.y;
        } else if (ballY > b.y + BRICK_HEIGHT){
          testY = b.y + BRICK_HEIGHT;
        }
        distX = ballX - testX;
        distY = ballY - testY;
        distance = Math.sqrt( (distX * distX) + (distY * distY) );
        if(distance <= BALL_RADIUS){

          dy = -dy;
          b.status = 0;
          Bangle.beep(1,350);
        }
      }
    }
  }  
  
  testX = ballX;
  testY = ballY;
  
  if(ballX < paddleX){
    testX = paddleX;
  } else if(ballX > paddleX + PADDLE_WIDTH){
    testX = paddleX + PADDLE_WIDTH;
  }
  testY = SCREEN_HEIGHT - 2 * PADDLE_HEIGHT;
  distX = ballX - testX;
  distY = ballY - testY;
  distance = Math.sqrt( (distX* distX) + (distY * distY) );
  if(distance <= BALL_RADIUS){
    dy = -dy;
    Bangle.beep(1,350);
  }
}

function update(){
  collisionDetection();
  
  if(ballX + dx > SCREEN_WIDTH - BALL_RADIUS || ballX + dx < BALL_RADIUS) {
      dx = -dx;
    }
    if(ballY + dy < BALL_RADIUS){
      dy = -dy;
    } else if (ballY + dy > SCREEN_HEIGHT - BALL_RADIUS) {
        gameOver = 1;
    }
    ballX += dx;
    ballY += dy;
}

function draw(){
  g.clear();
  if(gameOver){
    g.drawString("GAME OVER:\nPress Top Button to restart", 5, 50, true);
  }else{
    drawBall();
    drawPaddle();
    drawBricks();
  }
  g.flip();
}

instantiateBricks();

setWatch(function(e) {
  if(gameOver){
    paddleX = (SCREEN_WIDTH - PADDLE_WIDTH) / 2;
    ballX = SCREEN_WIDTH / 2;
    ballY = SCREEN_HEIGHT - 30;
    dx = 3;
    dy = -3;
    instantiateBricks();
    gameOver = 0;
  }
}, BTN1, {edge:"rising", debounce:50, repeat:true});

setWatch(function(e) {
  if(paddleX > 0)
    paddleX -= 5;
  else
    paddleX = 0;
}, BTN4, {edge:"rising", debounce:50, repeat:true});

setWatch(function() {
  if(paddleX < SCREEN_WIDTH - PADDLE_WIDTH)
    paddleX += 5;
  else
    paddleX = SCREEN_WIDTH - PADDLE_WIDTH;
}, BTN5, {edge:"rising", debounce:50, repeat:true});

// Finally, start everything going
setTimeout(()=>{
  Bangle.setLCDMode("120x120");
  g.clear();
  draw();
  setInterval(draw, 100);
  setInterval(update, 30);
},10);
