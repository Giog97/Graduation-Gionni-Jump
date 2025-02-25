var c = document.createElement("canvas");
var ctx = c.getContext("2d");

var screenWidth = 450; // Mod: da 500 portata a 300
var screenHeight = 700; // Mod: da 800 portata a 500
c.width = screenWidth;
c.height = screenHeight;
document.body.appendChild(c);

window.addEventListener('keydown',this.keydown,false);
window.addEventListener('keyup',this.keyup,false);

//Variables
const gravity = 0.34;
var holdingLeftKey = false;
var holdingRightKey = false;
var keycode;
var dead = false;
var difficulty = 0;
var lowestBlock = 0;
var score = 0;
var yDistanceTravelled = 0;

var blocks = [];
var powerups = [];

// Caricamento immagini me con la corona
var graduationImage = new Image();
graduationImage.src = "Sprites/meCoronaPxArt.png"; // Percorso dell'immagine di laurea
var graduationImage2 = new Image();
graduationImage2.src = "Sprites/meFestaPxArt.png"; // Percorso dell'immagine di laurea

//Time variables
var fps = 60;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

// CFU da ottenere per potersi laureare
var graduationBlock = 50; // Numero di blocchi da superare per laurearsi

// Funzione per visualizzare il messaggio di laurea
function showGraduationMessage() {
    ctx.font = "bold 26px Arial";
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black"; // Colore del contorno
    ctx.lineWidth = 0.8; // Spessore del contorno
    ctx.textAlign = "center";
    ctx.fillText("Complimenti, ti sei laureato!", screenWidth / 2, screenHeight / 2);
    ctx.strokeText("Complimenti, ti sei laureato!", screenWidth / 2, screenHeight / 2);

    ctx.font = "20px Arial";
    ctx.fillText("Premi R per ricominciare", screenWidth / 2, (screenHeight / 2) + 50);

    // Mostra l'immagine di laurea
    if (graduationImage.complete) {
        ctx.drawImage(graduationImage, screenWidth / 2 - 36, screenHeight / 2 - 250, 87, 220); // Regola le dimensioni e la posizione
    }

    // Mostra l'immagine di laurea 2
    if (graduationImage2.complete) {
        ctx.drawImage(graduationImage2, screenWidth / 2 - 100, screenHeight / 2 + 100, 196, 220); // Regola le dimensioni e la posizione
    }
}

function keydown(e) {
    if (e.keyCode === 65) {
        holdingLeftKey = true;
    } else if (e.keyCode === 68) {
        holdingRightKey = true;
    }

    if (e.keyCode === 82 && (dead || yDistanceTravelled >= graduationBlock * 100)) {
        blocks = [];
        lowestBlock = 0;
        difficulty = 0;
        score = 0;
        yDistanceTravelled = 0;
        player.springBootsDurability = 0;

        blocks.push(new block);
        blocks[0].x = 300;
        blocks[0].y = 650;
        blocks[0].monster = 0;
        blocks[0].type = 0;
        blocks[0].powerup = 0;

        blockSpawner();

        player.x = 300;
        player.y = 550;

        dead = false;
    }
}

function keyup(e) {
    if (e.keyCode === 65) {
        holdingLeftKey = false;
    } else if (e.keyCode === 68) {
        holdingRightKey = false;
    }
}

function showScore() {
    if (yDistanceTravelled > score) {
        score = Math.round(yDistanceTravelled/100); //mod: dividendo per 100 si fa vedere il numero di blocchi che viene superato
    }

    ctx.font = "36px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText("CFU: " + score, 15, 40);
}

blocks.push(new block);
blocks[0].x = 300;
blocks[0].y = 650;
blocks[0].monster = 0;
blocks[0].type = 0;
blocks[0].powerup = 0;

blockSpawner();

function loop() {
    requestAnimationFrame(loop);

    // Questo imposta il FPS a 60
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        var backgroundImage = new Image();
        backgroundImage.src = "Sprites/background.png";
        ctx.drawImage(backgroundImage, 0, 0, screenWidth, screenHeight);

        // Controlla se il giocatore ha superato i 300 blocchi
        if (yDistanceTravelled >= graduationBlock * 100) {
            dead = true; // Interrompi il gioco
            showGraduationMessage(); // Mostra il messaggio e l'immagine di laurea
            then = now - (delta % interval);
            return; // Esci dalla funzione per interrompere il gioco
        }

        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i] !== 0) {
                blocks[i].update();
                blocks[i].draw();
            }
        }

        player.update();
        player.draw();

        showScore();

        ctx.fill();
        then = now - (delta % interval);
    }
}

loop();
