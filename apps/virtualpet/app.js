require("Font6x8").add(Graphics);

var tamagotchi = 1;
var radius = 10;
var saved = 0;
var saveTime = 0|getTime();

//Bar Constants
const BAR_WIDTH = 33;
const BAR_PADDING = 1;
const BAR_POS_Y = 5;
const BAR_HEIGHT = 15;
const BAR_START_X = 5;
const BAR_SPACING = 2;

//Pet Stats
var hunger = 100;
var thirst = 100;
var cleanliness = 100;
var health = 100;
var happiness = 100;

//Decay Rates
const hungerDecay = 0.003;
const thirstDecay = 0.003;
const cleanlinessDecay = 0.003;
const healthDecay = [0,0.0015,0.006];
const happinessDecay = 0.0015;

var csv = [];

function saveState(){
    csv = [
    0|getTime(), // Time to the nearest second
    hunger,
    thirst,
    cleanliness,
    health,
    happiness
  ];

  var f = require("Storage").write("petlog.csv", csv.join(","));
  saved = 1;
}

function loadState(){
  var l = require("Storage").read("petlog.csv");
  if(l!==undefined){
    console.log(l);
    csv = l.split(",");
    console.log(csv);
    saveTime = csv[0];
    hunger = csv[1];
    thirst = csv[2];
    cleanliness = csv[3];
    health = csv[4];
    happiness = csv[5];
  }
}

function update(){
  var currentTime = 0|getTime();
  var deltaTime = currentTime - saveTime;
  hunger -= hungerDecay * deltaTime;
  thirst -= thirstDecay * deltaTime;
  cleanliness -= cleanlinessDecay * deltaTime;
  if(cleanliness < 33){
    health -= healthDecay[2] * deltaTime;
  } else if(cleanliness <= 66){
    health -= healthDecay[1] * deltaTime;
  }
  happiness -= happinessDecay * deltaTime;
  saveTime = currentTime;
}


function draw(){
  g.clear();
  drawBG();
  update();
  drawStats();
  drawPet();
  if(saved){
    g.setColor(1,0,0);
    g.fillRect(100,100,110,110);
    saved = 0;
  }
  g.flip();
}

function drawStats(){
  var barX = BAR_START_X;
  drawBar({x:barX, stat:hunger});
  drawText({txt:"Hunger", x:barX });
  barX = barX + BAR_WIDTH + 2 * BAR_PADDING + BAR_SPACING;
  drawBar({x:barX, stat:thirst});
  drawText({txt:"Thirst", x:barX });
  barX = barX + BAR_WIDTH + 2 * BAR_PADDING + BAR_SPACING;
  drawBar({x:barX, stat:health});
  drawText({txt:"Health", x:barX });
}

function drawText(e){
  g.setColor(0,0,0);
  g.setFont6x8();
  g.drawString(e.txt, e.x + 4, BAR_POS_Y + 4 * BAR_PADDING, false);
}

function drawBar(e){
  g.setColor(1,1,1);
  g.fillRect(e.x, BAR_POS_Y, e.x + BAR_WIDTH + 2 * BAR_PADDING, BAR_POS_Y + BAR_HEIGHT);
  if(e.stat > 66){
    g.setColor(0,1,0);
  }else if(e.stat < 33){
    g.setColor(1,0,0);
  }else{
    g.setColor(1,1,0);
  }
  var barWidth = (e.stat / 100) * BAR_WIDTH;
  g.fillRect(e.x + BAR_PADDING, BAR_POS_Y + BAR_PADDING, e.x + BAR_PADDING + barWidth, BAR_POS_Y + BAR_HEIGHT - BAR_PADDING);
}

function drawBG(){
  //Draw Grass
  g.setColor(0,0.8,0);
  g.fillRect(0,80,120,120);
  //Draw Sky
  g.setColor('#b8fdff');
  g.fillRect(0,0,120,80);
}

function drawPet(){
  g.setColor(1,1,1);
  g.fillCircle(60,80,radius);
  g.setColor(0,0,0);
  g.drawCircle(60,80,radius);
}

function incRad(){
  radius++;
}

function decRad(){
  radius--;
}

loadState();

setWatch(function(){
  hunger--;
  console.log(hunger);
}, BTN2, { repeat: true, edge: "falling" });

setWatch(function(e) {
    saveState();
}, BTN3, { repeat:true, edge:'rising' });

setTimeout(()=>{
  Bangle.setLCDMode("120x120");
  g.clear();
  draw();
  setInterval(draw, 100);
  setInterval(saveState, 10000);
},10);
