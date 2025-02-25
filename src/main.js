// Funzione per rilevare se il dispositivo è mobile
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

var c = document.createElement("canvas");
var ctx = c.getContext("2d");

// Dimensioni fisse per il computer
var fixedWidth = 450; // Larghezza fissa per il computer // Mod: da 500 
var fixedHeight = 700; // Altezza fissa per il computer // Mod: da 800 

// Imposta le dimensioni del canvas in base al dispositivo
if (isMobileDevice()) {
    // Dimensioni dinamiche per i dispositivi mobili
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
} else {
    // Dimensioni fisse per il computer
    var screenWidth = fixedWidth;
    var screenHeight = fixedHeight;
}

c.width = screenWidth;
c.height = screenHeight;
document.body.appendChild(c);

// Aggiorna le dimensioni del canvas quando la finestra viene ridimensionata (solo per dispositivi mobili)
if (isMobileDevice()) {
    window.addEventListener('resize', function () {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        c.width = screenWidth;
        c.height = screenHeight;
    });
}

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
var graduationBlock = 30; // Numero di blocchi da superare per laurearsi

// Funzione per visualizzare il messaggio di laurea
function showGraduationMessage() {
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black"; // Colore del contorno
    ctx.lineWidth = 0.8; // Spessore del contorno
    ctx.textAlign = "center";
    ctx.fillText("Complimenti, ti sei laureato!", screenWidth / 2, screenHeight / 2 + 20);
    ctx.strokeText("Complimenti, ti sei laureato!", screenWidth / 2, screenHeight / 2 + 20);

    ctx.font = "20px Arial";
    ctx.fillText("Premi R per ricominciare", screenWidth / 2, (screenHeight / 2) + 50);

    // Mostra l'immagine di laurea
    if (graduationImage.complete) {
        ctx.drawImage(graduationImage, screenWidth / 2 - 36, screenHeight / 2 - 340, 130, 320); // Regola le dimensioni e la posizione
    }

    // Mostra l'immagine di laurea 2
    if (graduationImage2.complete) {
        ctx.drawImage(graduationImage2, screenWidth / 2 - 150, screenHeight / 2 + 80, 285, 320); // Regola le dimensioni e la posizione
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

// Funzione per mostrare il punteggio
function showScore() {
    if (yDistanceTravelled > score) {
        score = Math.round(yDistanceTravelled/100); //mod: dividendo per 100 si fa vedere il numero di blocchi che viene superato
    }

    ctx.font = "36px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText("CFU: " + score, 15, 40);
}

// Variabili per i controlli touch
var touchStartX = 0;
var touchEndX = 0;

// Gestione del touch
window.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX; // Memorizza la posizione iniziale del touch
});

window.addEventListener('touchmove', function (e) {
    touchEndX = e.touches[0].clientX; // Ottieni la posizione corrente del touch
    var deltaX = touchEndX - touchStartX; // Calcola la differenza orizzontale

    if (deltaX < -20) { // Se il touch si sposta a sinistra
        holdingLeftKey = true;
        holdingRightKey = false;
    } else if (deltaX > 20) { // Se il touch si sposta a destra
        holdingRightKey = true;
        holdingLeftKey = false;
    } else { // Se il touch non si sposta abbastanza
        holdingLeftKey = false;
        holdingRightKey = false;
    }
});

window.addEventListener('touchend', function () {
    holdingLeftKey = false;
    holdingRightKey = false;
});

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
