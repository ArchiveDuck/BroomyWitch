


function startGame() { //starts the game when button in html is pressed
    document.getElementById("menu").style.display = "none"; //hides the menu on game start
    document.getElementById("canvas1").style.cursor = "none"; //hides cursor on game start
    gamestart = true; //determines if obstacles are allowed to spawn
    menuTheme.pause();
    if (muted === false){
    gameTheme.play(); //plays audiofile
    }
}


const obstaclesArray = []; //defines obstacles as an array so multiple obstacles can be drawn

let obstacleSpeed = 50; //how fast obstacles follow up after each other
let maxModifier = 120; //max 380
let minModifier = 60; // max 190
let obstacleModifier = Math.floor(Math.random() * maxModifier - minModifier);
let startValueTop = 250; //max 530 with all other values 0
let startValueBottom = 250; //max 530 with all other values 0
let minValue = 150; //minimum height of obstacles
let obstacleType = 1; //number that defines what type of obstacles (height, speed etc.) are generated
let obstacleWidth = 50; //how broad the obstacles are

class Obstacle {
    constructor(){
        this.top = Math.floor(Math.random() * ((startValueTop + obstacleModifier) - minValue) + minValue); //formula ensures there is always a minimum gap between top and bottom obstacles of 270
        this.bottom = Math.floor(Math.random() * ((startValueBottom - obstacleModifier) - minValue) + minValue); //formula ensures there is always a minimum gap between top and bottom obstacles of 270
        this.x = canvas.width;
        this.width = obstacleWidth; // width of obstacles
        this.color = 'hsla(' + hue + ', 75%, 40%, 5)'; //makes different colored obstacles
        this.counted = false;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }
    update(){
        this.x -= gamespeed; //how fast obstacles move towards the left (towards player)
        if (!this.counted && this.x < witch.x){ //increase score when obstacle is passed, but only once
        score++;
        this.counted = true; //when an obstacle is counted it can no longer increase score indefinitely
        }
        this.draw(); //draws the obstacles
    }
}

function generateObstacleType(){ //generates a random number every x frames that refers to a predefined type of obstacle in the function setObstacleType()
        if (frame%1000 === 0 && score > 10 && score < 80 && obstacleTimer <=0){ //when a score is met, a dfferend set of types is chosen from
            obstacleSpeed = 0; //set to 0 to stop drawing 
            obstacleTimer = 50; //value to determine time between drawing when a new obstacle type is chosen - counts down to 0 in main animate loop
            obstacleType = Math.floor(Math.random() * (5 - 1 + 1) + 1);
            obstaclesArray.pop(); //removes last obstacle each time a new type is selected
        }
        if (frame%750 === 0 && score >= 80 && score < 150 && obstacleTimer <=0){ //when a score is met, a dfferend set of types is chosen from
            obstacleType = Math.floor(Math.random() * (10 - 6 + 1) + 6);
            obstacleSpeed = 0; //set to 0 to stop drawing
            obstacleTimer = 50; //value to determine time between drawing when a new obstacle type is chosen - counts down to 0 in main animate loop
            obstaclesArray.pop(); //removes last obstacle each time a new type is selected
        }
        if (frame%750 === 0 && score >= 150 && obstacleTimer <=0){ //when a score is met, a dfferend set of types is chosen from
            obstacleType = Math.floor(Math.random() * (15 - 11 + 1) + 11);
            obstacleSpeed = 0; //set to 0 to stop drawing
            obstacleTimer = 50; //value to determine time between drawing when a new obstacle type is chosen - counts down to 0 in main animate loop
            obstaclesArray.pop(); //removes last obstacle each time a new type is selected
        }
       
}

function handleObstacles(){
    if (frame%obstacleSpeed === 0 && gamestart === true){ //creates new obstacle every x frames, after the game has started
        obstaclesArray.unshift(new Obstacle);
    }
    for (let i = 0; i < obstaclesArray.length; i++){
        obstaclesArray[i].update();
    }
    if (obstaclesArray.length > 15){ //removes obstacle if the array has reached a certain length
        obstaclesArray.pop(obstaclesArray[0]);
    }
}

function setObstacleType(){ //sets the type of obstacle and generates a random modifier
    if (frame%obstacleSpeed === 0){
    obstacleModifier = Math.floor(Math.random() * maxModifier - minModifier); //gives random number between positive and negative limits that is used to randomise obstacle heigth
    }
    //Below are all values to determine what kind of obstacles are generated, ordered in types defined by a number
    if (obstacleType === 1 && obstacleTimer <=0){ //ERRATIC - SLIM
        obstacleSpeed = 50;
        maxModifier = 230;
        minModifier = 230;
        startValueTop = 260;
        startValueBottom = 260;
        minValue = 150;
        obstacleWidth = 50;
    } 
    if (obstacleType === 2 && obstacleTimer <=0){ //LONG TOP - SLIM
        obstacleSpeed = 50;
        maxModifier = 0;
        minModifier = 0;
        startValueTop = 455;
        startValueBottom = 0;
        minValue = 70;
        obstacleWidth = 50; 
    } 
    if (obstacleType === 3 && obstacleTimer <=0){ //LONG BOTTOM - SLIM
        obstacleSpeed = 50;
        maxModifier = 0;
        minModifier = 0;
        startValueTop = 0;
        startValueBottom = 455;
        minValue = 70;
        obstacleWidth = 50; 
    }
    if (obstacleType === 4 && obstacleTimer <=0){ //DEFAULT - SLIM
        obstacleSpeed = 60;
        maxModifier = 380;
        minModifier = 190;
        startValueTop = 260;
        startValueBottom = 260;
        minValue = 150;
        obstacleWidth = 50; 
    } 
    if (obstacleType === 5 && obstacleTimer <=0){ //FAST - SLIM
        obstacleSpeed = 35;
        maxModifier = 240;
        minModifier = 120;
        startValueTop = 260;
        startValueBottom = 260;
        minValue = 150;
        obstacleWidth = 50;
    } 
    if (obstacleType === 6 && obstacleTimer <=0){ //ERRATIC - MEDIUM
        obstacleSpeed = 60;
        maxModifier = 230;
        minModifier = 230;
        startValueTop = 260;
        startValueBottom = 260;
        minValue = 150;
        obstacleWidth = 100; 
    } 
    if (obstacleType === 7 && obstacleTimer <=0){ //LONG TOP - MEDIUM
        obstacleSpeed = 50;
        maxModifier = 0;
        minModifier = 0;
        startValueTop = 455;
        startValueBottom = 0;
        minValue = 70;
        obstacleWidth = 100; 
    } 
    if (obstacleType === 8 && obstacleTimer <=0){ //LONG BOTTOM - MEDIUM
        obstacleSpeed = 50;
        maxModifier = 0;
        minModifier = 0;
        startValueTop = 0;
        startValueBottom = 455;
        minValue = 70;
        obstacleWidth = 100; 
    }
    if (obstacleType === 9 && obstacleTimer <=0){ //DEFAULT - MEDIUM
        obstacleSpeed = 60;
        maxModifier = 380;
        minModifier = 190;
        startValueTop = 260;
        startValueBottom = 260;
        minValue = 150;
        obstacleWidth = 100; 
    } 
    if (obstacleType === 10 && obstacleTimer <=0){ //FAST - MEDIUM
        obstacleSpeed = 35;
        maxModifier = 240;
        minModifier = 120;
        startValueTop = 260;
        startValueBottom = 260;
        minValue = 150;
        obstacleWidth = 100;
    } 
    if (obstacleType === 11 && obstacleTimer <=0){ //ERRATIC - BROAD
        obstacleSpeed = 65;
        maxModifier = 230;
        minModifier = 230;
        startValueTop = 260;
        startValueBottom = 260;
        minValue = 150;
        obstacleWidth = 150; 
    } 
    if (obstacleType === 12 && obstacleTimer <=0){ //LONG TOP - BROAD
        obstacleSpeed = 50;
        maxModifier = 0;
        minModifier = 0;
        startValueTop = 455;
        startValueBottom = 0;
        minValue = 70;
        obstacleWidth = 150; 
    } 
    if (obstacleType === 13 && obstacleTimer <=0){ //LONG BOTTOM - BROAD
        obstacleSpeed = 50;
        maxModifier = 0;
        minModifier = 0;
        startValueTop = 0;
        startValueBottom = 455;
        minValue = 70;
        obstacleWidth = 150; 
    }
    if (obstacleType === 14 && obstacleTimer <=0){ //DEFAULT - BROAD
        obstacleSpeed = 60;
        maxModifier = 380;
        minModifier = 190;
        startValueTop = 260;
        startValueBottom = 260;
        minValue = 150;
        obstacleWidth = 150; 
    } 
    if (obstacleType === 15 && obstacleTimer <=0){ //FAST - BROAD
        obstacleSpeed = 42;
        maxModifier = 240;
        minModifier = 120;
        startValueTop = 260;
        startValueBottom = 260;
        minValue = 150;
        obstacleWidth = 150;
    }   
}

function handleCollisions(){ //handles collisions between player and obstacles (numbers added and subtracted are to give some room and make hitbox better fitting with images on screen)
    for (let i = 0; i < obstaclesArray.length; i++){
        if (witch.x + 30 < obstaclesArray[i].x + obstaclesArray[i].width 
        && witch.x  + witch.width - 60  > obstaclesArray[i].x 
        && ((witch.y + 25  < 0 + obstaclesArray[i].top && witch.y  + witch.height  > 0) 
        || (witch.y - 25  > canvas.height - obstaclesArray[i].bottom - witch.height  
        && witch.y  + witch.height  < canvas.height ))
        ){
            return true;   
        }
    }
}




