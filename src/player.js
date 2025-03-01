var springBootsImage = new Image();
springBootsImage.src = "Sprites/new_balance_pxArt.png"; // Percorso dell'immagine

var player = new function() {
    this.x = 300;
    this.y = 550;
    this.img = new Image();
    this.img.src = "Sprites/rightPlayer.png";
    this.width = 40;
    this.height = 90;
    this.xSpeed = 6.7; // Velocità di movimento orizzontale fissa
    //this.xSpeed = screenWidth * 0.02; // Regola la velocità in base alla larghezza dello schermo
    this.ySpeed = 0;
    this.springBootsDurability = 0;
    this.direction = "left";

    this.update = function() {
        if (!dead) {
            this.ySpeed += gravity;
            if (this.y <= screen.height / 2 - 200 && this.ySpeed <= 0) {
                for (var i = 0; i < blocks.length; i++) {
                    blocks[i].y -= this.ySpeed;
                }
            } else {
                this.y += this.ySpeed;
            }
            yDistanceTravelled -= this.ySpeed;
        } else {
            ctx.font = "bold 26px Arial";
            ctx.fillStyle = "red";
            ctx.strokeStyle = "black"; // Colore del contorno
            ctx.lineWidth = 0.8; // Spessore del contorno
            ctx.textAlign = "center";
            ctx.fillText("Hai rinunciato agli studi!", screenWidth / 2, screenHeight / 2 - (screenHeight / 5)); 
            ctx.strokeText("Hai rinunciato agli studi!", screenWidth / 2, screenHeight / 2 - (screenHeight / 5));


            // Mostra la scritta "Premi R per riniziare l'università" solo su computer
            if (!isMobileDevice()) {
                // Scritta "Premi R per riniziare l'università"
                ctx.font = "20px Arial";
                ctx.fillText("Premi R per riniziare l'università", screenWidth / 2, (screenHeight / 2 - (screenHeight / 5)) + screenHeight / 5);//+ 50);

                // Scritta "Premi M per tornare al menu"
                ctx.font = "20px Arial";
                ctx.fillText("Premi M per tornare al menu", screenWidth / 2, (screenHeight / 2 - (screenHeight / 5)) + screenHeight / 10); //+ 100);
            }
        }

        //A key pressed
        if (holdingLeftKey) {
            this.direction = "left";
            this.img.src = "Sprites/leftPlayer.png";
            player.moveLeft();
        }
        //D key pressed 
        if (holdingRightKey) {
            this.direction = "right";
            this.img.src = "Sprites/rightPlayer.png";
            player.moveRight();
        }

        //Check for jump
        for (var i = 0; i < blocks.length; i++) {
            if (this.ySpeed >= 0) {
                if (this.x >= blocks[i].x - this.width + 15 && this.x <= blocks[i].x + blocks[i].width - 15 &&
                    this.y >= blocks[i].y - this.height && this.y <= blocks[i].y + blocks[i].height - this.height) {
                    if (blocks[i].type === "break") {
                        if (!blocks[i].isBroken) {
                            this.jump(blocks[i].powerup, blocks[i].type);
                            blocks[i].isBroken = true; // Imposta il blocco come rotto
                        }
                    } else if (blocks[i].monster !== 0) {
                        this.jump(blocks[i].powerup, blocks[i].type);
                        blocks[i] = 0;
                    } else {
                        this.jump(blocks[i].powerup, blocks[i].type);
                    }
                }
            } 
            if (this.y > blocks[i].y) {
                //Check for hit monster
                if (blocks[i].monster !== 0 && blocks[i].monster !== undefined) {
                    if (this.x >= blocks[i].x - this.width + 15 && this.x <= blocks[i].x + blocks[i].width - 15 &&
                        this.y >= blocks[i].y - blocks[i].height && this.y <= blocks[i].y + blocks[i].height) {
                        dead = true;
                    }
                }
            }
        }


        for (var i = blocks.length-1; i > 0; i--) {
            if (blocks[i].y > screenHeight) {
                lowestBlock = i+1;
                break;
            }
        }

        if (this.y >= blocks[lowestBlock].y) {
            dead = true;
        }

        if (lowestBlock >= 45) {
            if (difficulty < 6) {
                difficulty += 1;
            }
            blockSpawner();
        }
    }
    
    this.jump = function(powerup, type) {
        this.ySpeed = -13.2;

        if (powerup === "springBoots") {
            this.springBootsDurability = 6;
        }
        
        if (type === 0) {
            if (powerup === "spring") {
                this.ySpeed = -20;
            } 
        }

        if (this.springBootsDurability !== 0) {
            this.ySpeed = -20;
            this.springBootsDurability -= 1;
        }  
    }

    this.moveLeft = function() {
        this.x -= this.xSpeed;
        if (this.x <= -this.width) {
            this.x = screenWidth;
        }
    }

    this.moveRight = function() {
        this.x += this.xSpeed;
        if (this.x >= screenWidth) {
            this.x = -this.width;
        }
    }

    this.draw = function() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

        if (this.springBootsDurability !== 0) {
            if (this.direction === "right") {
                // posso caricare la mia immagine con le new balance
                ctx.fillStyle = "blue";
                ctx.fillRect(this.x + 10, this.y + 66, 15, 10);
                ctx.fillRect(this.x + 33, this.y + 66, 15, 10);  
                ctx.fillStyle = "grey";
                ctx.fillRect(this.x + 10, this.y + 76, 15, 15);
                ctx.fillRect(this.x + 33, this.y + 76, 15, 15);
            } else {
                // posso caricare la mia immagine con le new balance
                ctx.fillStyle = "blue";
                ctx.fillRect(this.x + 30, this.y + 66, 15, 10);
                ctx.fillRect(this.x + 53, this.y + 66, 15, 10);  
                ctx.fillStyle = "grey";
                ctx.fillRect(this.x + 30, this.y + 76, 15, 15);
                ctx.fillRect(this.x + 53, this.y + 76, 15, 15);
            }
        }
    }
}
