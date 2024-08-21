//const batSprite = new Image();
//batSprite.src = 'batComplete.png';



//let batDistanceMax = 4500;
//let batdistanceMin = 3500;

//let batDistance = Math.floor(Math.random() * (batDistanceMax - batdistanceMin) + batdistanceMin); //generates random value between two values to determine how far away past screen edge bat spawns

let bat2AnimationSpeed = 4;


class Bat2 {
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
        this.x -= gamespeed * 1.5 + 1; //bat movement speed along x-axis per frame
        bat2AnimationSpeed = 4; //speed of bat animation
        if (this.xCutout >= 0 && frame%bat2AnimationSpeed === 0 ){
        this.xCutout -= this.width; //move to next image on spritesheet every X amount of frames
        } 
        if (this.xCutout <= 0) {
        this.xCutout = this.width * 4; //if last image of spritesheet is reached, go back to first image
        } 
        this.draw(); //call draw function to draw the image on screen
        if (spell2Collision === true){
            return;
        }
    }

    updateDeath(){
        this.x -= gamespeed * 1.5 + 1; //bat movement speed along x-axis per frame
        bat2AnimationSpeed = 10; //change animation speed to better suit bat death animation
        if (this.xDCutout >= 0 && frame%bat2AnimationSpeed === 0 ){
            this.xDCutout -= this.width;
        } 
        this.drawDeath();
        if (this.xDCutout <= 0){ //after death animation is finished...
            this.resetAfterCollision(); //... call reset function and after bat is reset...
            this.xDCutout = this.width * 4; //...reset death animation to starting image for next time it needs to play
        }
        if(spell2Collision == false){
            return; //stops running this function when bat is reset after collision
        }
    }

    resetAfterCollision(){ //resets bat position to random x and y (between defined limits) when bat is killed
            this.x = 1200 + batDistance;
            this.y = Math.floor(Math.random() * (650 - 150) + 150);
            spell2Collision = false; //resets collision detection for spell and bat
            bat2AnimationSpeed = 4; //resets animation speed to default 
            bat2Hitbox = true; //resets collision detection between player and bat
    }

    resetPastScreen(){ //resets bat position to random x and y (between defined limits) when bat flies past screen edge
        this.x = 1200 + batDistance;
        this.y = Math.floor(Math.random() * (650 - 150) + 150); 

    }
}


function handleBats2(){
    if (score >= 100 && spell2Collision === false){ //determines when bat starts spawning AND when to do the default bat animation
        bat2.update();   
    }
    if (spell2Collision === true){ //activates the bat death animation when bat is hit by a spell and generates a new random value for where bat spawns
        batDistance = Math.floor(Math.random() * (batDistanceMax - batdistanceMin) + batdistanceMin);
        bat2.updateDeath();    
    }
    if (bat2.x + bat2.width < 0){ //if a bat flies past and leaves the screen, go to reset function and generates a new random value for where bat spawns
        batDistance = Math.floor(Math.random() * (batDistanceMax - batdistanceMin) + batdistanceMin);

        bat2.resetPastScreen();  
    }
    //Below: when a score is met, the bat spawning distance gets shorter, but remains random

}


const bat2 = new Bat2;

//COLLISION BAT, SPELL AND PLAYER

function handleProjectileCollision2(){ //handles collision between spell and bat
    for (let i = 0; i < spellArray.length; i++){
        if (bat2.x + 40 < spellArray[i].x + spellArray[i].width/3
        && bat2.x + bat2.width > spellArray[i].x
        && bat2.y < spellArray[i].y + spellArray[i].height
        && bat2.y + bat2.height > spellArray[i].y
        ){
            bat2Hitbox = false; //prevents collision between player and bat after bat is killed
            spell2Collision = true;
            spellShot = false; //resets ability to cast spells after bat is killed
            batsKilled += 1;
            spellHitsBat2.play(); //plays explosion sound when bat is hit
            spellCast.pause(); //stops spell casting sound when bat is hit
            spellReset = true; //removes spell from array
        }    
    }
}

function batCollision2(){ //detects collision between player and bat (numbers added and subtracted are to give some room and make hitbox better fitting with images on screen)
    if (witch.x + witch.width - 20 > bat2.x + 50 
        && witch.x < bat2.x + bat2.width - 100
        && (witch.y + witch.height - 20 > bat2.y +10 
        && witch.y + 15 < bat2.y + 10 + bat2.height - 20) 
        && bat2Hitbox === true){ 
        return true;          
    }
}
