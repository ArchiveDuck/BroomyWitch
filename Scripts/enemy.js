const batSprite = new Image();
batSprite.src = "Images/batComplete.png";



let batDistanceMax = 4500;
let batdistanceMin = 3500;

let batDistance = Math.floor(Math.random() * (batDistanceMax - batdistanceMin) + batdistanceMin); //generates random value between two values to determine how far away past screen edge bat spawns

let batAnimationSpeed = 4;


class Bat {
    constructor(){
        this.x = 1200 + batDistance;
        this.y = Math.floor(Math.random() * (650 - 150) + 150);
        this.originalWidth = 640; //width of entire spritesheet
        this.originalHeight = 200; //heigh of entire spritesheet
        this.width = (this.originalWidth/4);
        this.height = (this.originalHeight/2);
        this.yCutout = this.height;
        this.xCutout = this.width * 4; //used for changing image on spritesheet
        this.xDCutout = this.width * 4; //used for changing image on spritesheet on bat death
    }

    draw(){
    
        //ctx.fillStyle = 'yellow';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(batSprite, //source of image, as defined earlier in variable
        this.originalWidth - this.xCutout, //cut out part of sprite width
        this.height - this.yCutout,  //cut out part of sprite height
        this.width, //determine width of cut out part within image
        this.height, //determine heigth of cut out part within image
        this.x, this.y, this.width , this.height); //location and size of sprite      
    }

    drawDeath(){
        //ctx.fillStyle = 'yellow';
        //ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.drawImage(batSprite, //source of image, as defined earlier in variable
        this.originalWidth - this.xDCutout, //cut out part of sprite width
        this.height,  //cut out part of sprite height 
        this.width, //determine width of cut out part within image
        this.height, //determine heigth of cut out part within image
        this.x, this.y, this.width , this.height); //location and size of sprite
    }

  
    update(){
        this.x -= gamespeed * 1.5; //bat movement speed along x-axis per frame
        batAnimationSpeed = 4; //speed of bat animation
        if (this.xCutout >= 0 && frame%batAnimationSpeed === 0 ){
        this.xCutout -= this.width; //move to next image on spritesheet every X amount of frames
        } 
        if (this.xCutout <= 0) {
        this.xCutout = this.width * 4; //if last image of spritesheet is reached, go back to first image
        } 
        this.draw(); //call draw function to draw the image on screen
        if (spellCollision === true){
            return;
        }
    }

    updateDeath(){
        this.x -= gamespeed * 1.5; //bat movement speed along x-axis per frame
        batAnimationSpeed = 10; //change animation speed to better suit bat death animation
        if (this.xDCutout >= 0 && frame%batAnimationSpeed === 0 ){
            this.xDCutout -= this.width;
        } 
        this.drawDeath();
        if (this.xDCutout <= 0){ //after death animation is finished...
            this.resetAfterCollision(); //... call reset function and after bat is reset...
            this.xDCutout = this.width * 4; //...reset death animation to starting image for next time it needs to play
        }
        if(spellCollision == false){
            return; //stops running this function when bat is reset after collision
        }
    }

    resetAfterCollision(){ //resets bat position to random x and y (between defined limits) when bat is killed
            this.x = 1200 + batDistance;
            this.y = Math.floor(Math.random() * (650 - 150) + 150);
            spellCollision = false; //resets collision detection for spell and bat
            batAnimationSpeed = 4; //resets animation speed to default 
            batHitbox = true; //resets collision detection between player and bat
            //spellReset = false;
    }

    resetPastScreen(){ //resets bat position to random x and y (between defined limits) when bat flies past screen edge
        this.x = 1200 + batDistance;
        this.y = Math.floor(Math.random() * (650 - 150) + 150); 
    }
}


function handleBats(){
    if (score >= 1 && spellCollision === false){ //determines when bat starts spawning AND when to do the default bat animation
        bat.update();   
    }
    if (spellCollision === true){ //activates the bat death animation when bat is hit by a spell and generates a new random value for where bat spawns
        batDistance = Math.floor(Math.random() * (batDistanceMax - batdistanceMin) + batdistanceMin);
        bat.updateDeath();
           
    }
    if (bat.x + bat.width < 0){ //if a bat flies past and leaves the screen, go to reset function and generates a new random value for where bat spawns
        batDistance = Math.floor(Math.random() * (batDistanceMax - batdistanceMin) + batdistanceMin);

        bat.resetPastScreen();  
    }
    //Below: when a score is met, the bat spawning distance gets shorter, but remains random
    if (score === 20){
        batDistanceMax = 4000;
        batdistanceMin = 3000;
    } else if (score === 30) {
        batDistanceMax = 3500;
        batdistanceMin = 2500;
    } else if (score === 45) {
        batDistanceMax = 3000;
        batdistanceMin = 2000; 
    } else if (score === 60) {
        batDistanceMax = 2500;
        batdistanceMin = 1500;   
    } else if (score === 80) {
        batDistanceMax = 2000;
        batdistanceMin = 1000;
    } else if (score === 100) {
        batDistanceMax = 1500;
        batdistanceMin = 500;
    } else if (score === 120) {
        batDistanceMax = 1000;
        batdistanceMin = 250;
    } else if (score === 150) {
        batDistanceMax = 750;
        batdistanceMin = 250;
    } else if (score === 200) {
        batDistanceMax = 500;
        batdistanceMin = 250;
    }



}


const bat = new Bat;

//COLLISION BAT, SPELL AND PLAYER


function handleProjectileCollision(){ //handles collision between spell and bat
    for (let i = 0; i < spellArray.length; i++){
        if (bat.x + 40 < spellArray[i].x + spellArray[i].width/3
        && bat.x + bat.width > spellArray[i].x
        && bat.y < spellArray[i].y + spellArray[i].height
        && bat.y + bat.height > spellArray[i].y
        ){
            batHitbox = false; //prevents collision between player and bat after bat is killed
            spellCollision = true; //for animation see enemy.js
            spellShot = false; //resets ability to cast spells after bat is killed
            batsKilled += 1;
            spellHitsBat.play(); //plays explosion sound when bat is hit
            spellCast.pause(); //stops spell casting sound when bat is hit
            spellReset = true; //removes spell from array
        }    
    }
}


function batCollision(){ //detects collision between player and bat (numbers added and subtracted are to give some room and make hitbox better fitting with images on screen)
    if (witch.x + witch.width - 20 > bat.x + 50 
        && witch.x < bat.x + bat.width - 100
        && (witch.y + witch.height - 20 > bat.y +10 
        && witch.y + 15 < bat.y + 10 + bat.height - 20) 
        && batHitbox === true){ 
        return true;          
    }
}

