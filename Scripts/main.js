//DEFINE CANVAS IN JAVASCRIPT


const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 800;

//GLOBAL VARIABLES

let spacePressed = false; //related to flying up and flying animation
let zPressed = false; //related to casting spell and casting animation
let angle = 0; //used for bobbing animation when player is on bottom of screen
let hue = 0; //determines what color obstacles have
let frame = 0;
let score = 0; //score is counted in top right corner
let batsKilled = 0;

let gamespeed = 6; //defines how fast obstacles and bats move towards player

let gamestart = false; //determines when the game has started

let broomSpeed = 10; //related to death animation
let fallSpeed = 10; //related to death animation

let muted = false; //used in mute and unmute functions


//SPELL
let spellShot = false;
let spellArray = [];
let spellCollision = false;
let spell2Collision = false;
let spellCutout = 110;
let spellReset = false;

const projectile = new Image(); //declares spell image variable
projectile.src = "Images/spell.png"; //loads image for spell from source file


//BAT HITBOX
let batHitbox = true; //determines when collision with bat can happen //add bat2Hitbox
let bat2Hitbox = true;


let isDead = false;

let gamePaused = false;




//AUDIO

const gameTheme = new Audio("Audio/BroomyWitchBG_Loop.mp3"); //loads audiofile
gameTheme.loop = true; //makes audio loop

const menuTheme = new Audio("Audio/Menu.mp3"); //load menu theme
menuTheme.loop = true;
menuTheme.play(); //makes manu theme play

const hitSound = new Audio("Audio/Punch.mp3");

const spellHitsBat = new Audio ("Audio/spellHitsBat.mp3");
spellHitsBat.volume = 0.5; //decreases volume to half

const spellHitsBat2 = new Audio ("Audio/spellHitsBat2.mp3");
spellHitsBat2.volume = 0.5; //decreases volume to half


const spellCast = new Audio("Audio/spellFired.mp3");
spellCast.volume = 0.5; //decreases volume to half



//SET-UP TO CREATE MOVING BACKGROUND IMAGE

let x = 1;
const bgImage = document.getElementById('canvas1');

function moveBackground(){ //moves background image by gamespeed
  x -=gamespeed *0.8;
  bgImage.style.backgroundPositionX = x + "px";
}



let obstacleTimer = 0;

//MAIN ANIMATION / GAMELOOP FUNCTION

function animate(){ 
    ctx.clearRect(0, 0, canvas.width, canvas.height); //removes duplicate images each frame - crucial for animation!
    moveBackground();
    angle+=0.25; //bobbing at bottom speed
    hue++; //creates different colored obstacles
    if (gamestart === true){
        frame++; //increase frame count for every animation loop after game has started, so obstacle generation is always on the same loop
    }
    if (isDead === false){ //only draw the witch when player is alive
        witch.update();
        witch.draw();  
   }
   increaseGameSpeed(); //calls increase gamespeed function when a score is met
   handleSpells();
   if (obstacleTimer > 0){ //timer to create a short delay between different obstacle types to prevent impossible to dodge combination
    obstacleTimer--;
   }
   generateObstacleType();
   setObstacleType();
   handleObstacles();
   handleScore(); //placed after obstacle generating function so it is drawn on top of the obstacles
    handleBats();
    handleBats2();
    batCollision();
    batCollision2();
   handleProjectileCollision();
   handleProjectileCollision2();
   handleCollisions(); //call collision detection function
   if (handleCollisions() || batCollision() || batCollision2()) {
    spellShot = true;
    isDead = true;
    gamespeed = 0;
    witch.weight = 0;
    }
    if (isDead === true){
        deathAnimation();
    }
    if (broomSpeed >= 11 && broomSpeed < 100){ //prevents audio effect from playing twice
       hitSound.play();
       gameTheme.pause(); //makes game audio stop when collision happens
        
    }
    if (broomSpeed > 1800){
    menuTheme.currentTime = 0; //resets menu theme to begin when it plays again after game over
    menuTheme.play(); //plays menu theme when game is over
    document.getElementById("menu").style.display = "block"; //shows menu when game is over
    document.getElementById("play").style.display = "none"; //hides play button
    document.getElementById("return").style.display = "block"; //shows return button
    ctx.font = "2em Arial, Helvetica, sans-serif";
    ctx.fillStyle = "yellow";
    ctx.fillText('Game over! Your score is ' + score, 160, canvas.height/2 - 10);
    ctx.fillText('Number of bats killed: ' + batsKilled, 160, canvas.height/2 + 30);
    document.getElementById("canvas1").style.cursor = "default"; //shows cursor on game end
    return; //makes animation loop stop
   } 

   //debug();
   if (gamePaused === false){
    requestAnimationFrame(animate); //repeats the function each frame
   }
  
}

animate(); //calls the animate function at start



//SCORE

function handleScore(){
    ctx.fillStyle = 'yellow';  //score counter color
    ctx.font = '4em Arial, Helvetica, sans-serif'; //score counter style
    ctx.strokeText("Score: " + score, 800, 70); //sore counter position
    ctx.fillText("Score: " + score, 800, 70); //score counter text position

}


//CASTING SPELLS



window/addEventListener('keyup', cast) //executes cast function when key is pressed


function cast(e){
    if (e.code === "KeyZ" && spellShot === false || e.code === "ArrowRight" && spellShot === false) {
        let spell = {
            x : witch.x + witch.width,
            y: witch.y +95,
            width: 110,
            height: 10,
            lcutout : 110   
        }
        spellArray.push(spell); //pushes a new spell into spellArray when key is pressed
        spellShot = true; //disables casting spell until spell has past screen width or has hit bat (see while loop in function handleSpells())
        spellCast.currentTime = 0; //resets spell sound track to start each time a spell is cast
        spellCast.play(); //plays sound when casting spell 
    }
}

function handleSpells() {
    for (let i = 0; i < spellArray.length; i++){
        let spell = spellArray[i];
        spell.x += 10; //speed of spell
        ctx.drawImage(projectile, spell.width - spellCutout, 0, spell.width/3, spell.height, 
            spell.x, spell.y, spell.width/3, spell.height);
        if (spellCutout > 36 && frame%10 === 0){ //animation speed of spell
            spellCutout -=36; //value to animate next part of spell sprite
        }
        if (spellCutout <= 36){ //value to indicate last part of spell sprite
            spellCutout = 110; //reset to begin when last part of animation is reached
        }
        if (spellReset === true || spellArray[i].x > canvas.width){
            spellArray.pop(); //removes spell from array when past screen or after collision with bat
        spellShot = false;
        spellReset = false; //immediatley reloads spell in array

        }    
    }
}



//INCREASE GAMESPEED
  

function increaseGameSpeed(){ //increase gamespeed when a score is met
    if (score === 10){
        gamespeed = 6.25;
    } else if (score === 25){
        gamespeed = 6.5;
    } else if (score === 40) {
        gamespeed = 6.75;
    } else if (score === 60){
        gamespeed = 7;
    } else if (score === 90){
        gamespeed = 7.25;
    } else if (score === 120){
        gamespeed = 7.5;
    } else if (score === 150){
        gamespeed = 7.75;
    } else if (score === 180){
        gamespeed = 8;
    }  else if (score === 220){
        gamespeed = 8.25;
    }  else if (score === 250){
        gamespeed = 8.5;
    } else if (score === 280){
        gamespeed = 8.75;
    } else if (score === 310){
        gamespeed = 9;
    } else if (score === 350){
        gamespeed = 9.25;
    } else if (score === 400){
        gamespeed = 9.5;
    } else if (score === 450){
        gamespeed = 9.75;
    } else if (score === 500){
        gamespeed = 10;
    } else if (score === 550){
        gamespeed = 10.25;
    } else if (score === 600){
        gamespeed = 10.5;
    } else if (score === 650){
        gamespeed = 10.75;
    } else if (score === 700){
        gamespeed = 11;
    } 

}







//MOVEMENT KEY BINDINGS


window/addEventListener('keydown', function(e){ //related to witch animation and movement
    if (e.code === 'Space' || e.code === 'ArrowUp') spacePressed = true;
    
});
window/addEventListener('keyup', function(e){ //related to witch animation and movement
    if (e.code === 'Space' ||  e.code === 'ArrowUp') spacePressed = false;
    
});

window/addEventListener('keydown', function(e){ //related to witch animation when casting spell
    if (e.code === 'KeyZ' || e.code === 'ArrowRight') zPressed = true;
});

window/addEventListener('keyup', function(e){ //related to witch animation when casting spell
    if (e.code === 'KeyZ' || e.code === 'ArrowRight') zPressed = false;
    
});







//MENU NAVIGATION

function displayInstructionsMenu(){ //function linked in html file
    document.getElementById("menu").style.display = "none"; //hides the menu
    document.getElementById("instructions").style.display = "block"; //displays the instructions 
   

}

function backToMenu(){ //function linked in html file
    document.getElementById("menu").style.display = "block"; //displays the menu
    document.getElementById("instructions").style.display = "none"; //hides the instructions
}

function displayCredits(){
    document.getElementById("menu").style.display = "none"; //hides the menu
    document.getElementById("credits").style.display = "block"; //displays the instructions 
}

function backToMenu2(){ //function linked in html file
    document.getElementById("menu").style.display = "block"; //displays the menu
    document.getElementById("credits").style.display = "none"; //hides the instructions
}


//MUTE AND UNMUTE


window/addEventListener('keyup', toggleMute); //when key is pressed, activate function toggleMute

function toggleMute(e){
    if (e.code === "KeyM" && muted === false) {
        mute();
    } else if (e.code === "KeyM" && muted === true){
        unmute();
    }

}


function mute(){
    document.getElementById("mute").style.display = "none"; //displays the menu
    document.getElementById("unmute").style.display = "block"; //hides the instructions
    gameTheme.volume = 0;
    menuTheme.volume = 0;
    hitSound.volume = 0;
    spellHitsBat.volume = 0;
    spellHitsBat2.volume = 0;
    spellCast.volume = 0;
    muted = true;
}



function unmute(){
    document.getElementById("mute").style.display = "block"; //displays the menu
    document.getElementById("unmute").style.display = "none"; //hides the instructions
    gameTheme.volume = 1;
    menuTheme.volume = 1;
    hitSound.volume = 1;
    spellHitsBat.volume = 0.5;
    spellHitsBat2.volume = 0.5;
    spellCast.volume = 0.5;
    muted = false;
    if (gamestart === true && isDead === false){ //play gameTheme when unmuting after game has started and when player is alive
        gameTheme.play();
    }
}


//PAUSE AND UNPAUSE


window/addEventListener('keyup', togglePause); //when key is pressed, activate function togglePause()

function togglePause(e){
    if (e.code === "KeyP" && gamePaused === false && gamestart === true) { //key is P, when game is not paused and when game has started. activate function gamePause()
    gamePause();
    } else if (e.code === "KeyP" && gamePaused === true){ //when game is paused and P key is pressed, activate function unpauseGame()
    unpauseGame();
    }
}

function gamePause(){
    gamePaused = true; //set this to true to stop animate() function from executing
    document.getElementById("menu").style.display = "block"; //displays the menu
    document.getElementById("continue").style.display = "block"; //displays the continue button, which can also be clicked to unpause
    document.getElementById("canvas1").style.cursor = "default"; //shows cursor on game pause
}


function unpauseGame() {    
        gamePaused = false; //set to false te re-enable pausing
        document.getElementById("menu").style.display = "none"; //hides the menu
        document.getElementById("continue").style.display = "none"; //hides the continue button
        document.getElementById("canvas1").style.cursor = "none"; //hides cursor after unpausing
        animate(); //re-activates the loooping animate() function
}



window.onkeydown = function(e) { //prevents scrolling when spacebar is pressed
    return !(e.keyCode == 32 && e.target == document.body);
  }; 

window.onkeydown = function(e) { //prevents sideway scrolling when arrow right is pressed
    return !(e.keyCode == 39 && e.target == document.body);
}; 



//DEBUG -- ACTIVATE DEBUG FUNCTION IN ANIMATE();
/*

function debug(){
    ctx.fillStyle = 'yellow';
    ctx.font = '3em Arial, Helvetica, sans-serif';
    //ctx.strokeText(INSTERT VARIABLE, x, y); 
    //ctx.fillText(INSTERT VARIABLE, x, y); 
    ctx.strokeText(obstacleSpeed, 200, 70); 
    ctx.fillText(obstacleSpeed, 200, 70); 
    ctx.strokeText(obstacleTimer, 500, 70); 
    ctx.fillText(obstacleTimer, 500, 70); 
    ctx.strokeText(obstacleType, 600, 70); 
    ctx.fillText(obstacleType, 600, 70); 
    ctx.strokeText(frame, 50, 70); 
    ctx.fillText(frame, 50, 70);
}
*/








