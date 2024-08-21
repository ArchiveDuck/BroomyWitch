const witchSprite = new Image();
witchSprite.src = "Images/witch.png";

class Witch {
    constructor(){
        this.x = 150; //starting position horizontal - this doesn't change during the game
        this.y = 200; //starting position vertical - this changes during the game
        this.vy = 0 // fall velocity increase
        this.originalWidth = 459;
        this.width = this.originalWidth / 3;
        this.height = 150;
        this.weight = 3.5; //increase to increase fall speed
        this.xCutout = this.width * 3;

       
        
    }
    update(){ //makes player fall and increase fall speed
        let curve = Math.sin(angle) * 5; //makes player bob up and down when idle at bottom
        if (this.y > canvas.height - (this.height * 1.1) + curve){ //makes player stay on screen and not fall through bottom
            this.y = canvas.height - (this.height * 1.1) + curve; //change * number here and on previous line to change bobbing altitude
            this.vy = 0;
        } else {
            this.y += this.weight;
            this.vy *= 0.9;
            this.y += this.vy;
        }
        if (this.y < 0 + (this.height * 0.0005)){ //makes it unable to go past top of screen
            this.y = 0 + (this.height * 0.0005);
            this.vy = 0;
        }
        if (spacePressed && this.y > this.height * 0.5 ) this.flap(); 
        if (zPressed) this.attack();
         
        
    }
    draw(){ //draws the image on screen
        //ctx.fillStyle = 'red';
        //ctx.fillRect(this.x +15, this.y + 15, this.width - 30, this.height - 30);
        ctx.drawImage(witchSprite, this.originalWidth - this.xCutout, 0, this.originalWidth / 3, //cut out part of sprite width
            this.height, //cut out part of sprite height
            this.x, this.y, this.originalWidth / 3 , this.height);
    }
    flap(){
        this.vy -= 2; //how fast flies up
        this.xCutout = this.width * 2; //switch to different part of image when flying up
    }
    attack(){
        this.xCutout = this.width; //switch to different part of image when attack (casting spell) is used
    }
    
  
    
}

const Timeout = setInterval(checkAnimation, 500); //creates a small delay so that when SPACE or Z is released, the animation doesn't immediately flick back to default image

function checkAnimation(){
    if (witch.xCutout = witch.width * 2){
        witch.xCutout = witch.width * 3;
    }
    if (witch.xCutout = witch.width){
        witch.xCutout = witch.width * 3; 
    }
} 

const witch = new Witch();


const witchDeath = new Image();
witchDeath.src = "Images/witchDeath.png"; 
witchDeath.x = 200;
witchDeath.y = 250;
witchDeath.width = 141;
witchDeath.height = 150;

const broom = new Image();
broom.src = "Images/witchBroom.png";
broom.x = 200;
broom.y = witch.y;
broom.width = 141;
broom.height = 150;



function deathAnimation(){
        ctx.drawImage(witchDeath, witch.x, witch.y + fallSpeed, witchDeath.width, witchDeath.height)
        ctx.drawImage(broom, witch.x + broomSpeed, witch.y, broom.width, broom.height)
        broomSpeed+= 18; //makes broom fly on
        fallSpeed += 10; // makes witch fall down
        witch.xCutout = 5000; //makes original witch image disappear by setting the sprite cutout value to somewhere deep in the void 
}





