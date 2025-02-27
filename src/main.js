// Funzione per rilevare se il dispositivo è mobile
window.isMobileDevice = function() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

// Seleziona il canvas e il contesto
var c = document.getElementById("gameCanvas"); //var c = document.createElement("canvas");
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
//document.body.appendChild(c);

// Aggiorna le dimensioni del canvas quando la finestra viene ridimensionata (solo per dispositivi mobili)
if (isMobileDevice()) {
    window.addEventListener('resize', function () {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        c.width = screenWidth;
        c.height = screenHeight;
    });
}

// Gestione del menù
document.getElementById("startButton").addEventListener("click", function() {
    document.getElementById("menu").style.display = "none"; // Nasconde il menù
    document.getElementById("gameCanvas").style.display = "block"; // Mostra il gioco
    loop(); // Avvia il gioco
});
// Gestione del menù 2
document.getElementById("creditsButton").addEventListener("click", function() {
    document.getElementById("menu").innerHTML = `
        <h1>Ringraziamenti</h1>
        <p>Grazie per aver giocato a Graduation Gionni Jump! Un ringraziamento speciale a tutti coloro che hanno supportato lo sviluppo.</p>
        <button id="backButton">Torna indietro</button>
    `;

    document.getElementById("backButton").addEventListener("click", function() {
        location.reload(); // Ricarica la pagina per tornare al menù
    });
});

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
//var graduationImage = new Image();
//graduationImage.src = "Sprites/meCoronaPxArt.png"; // Percorso dell'immagine di laurea
var graduationImage2 = new Image();
graduationImage2.src = "Sprites/meFestaPxArt.png"; // Percorso dell'immagine di laurea

//Time variables
var fps = 60;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

// CFU da ottenere per potersi laureare
var graduationBlock = 10; // Numero di blocchi da superare per laurearsi

// Funzione per visualizzare il messaggio di laurea
function showGraduationMessage() {
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black"; // Colore del contorno
    ctx.lineWidth = 0.8; // Spessore del contorno
    ctx.textAlign = "center";
    ctx.fillText("Complimenti, ti sei laureato!", screenWidth / 2, screenHeight / 2);
    ctx.strokeText("Complimenti, ti sei laureato!", screenWidth / 2, screenHeight / 2);

    // Mostra la scritta "Premi R per ricominciare" solo su computer
    if (!isMobileDevice()) {
        ctx.font = "20px Arial";
        ctx.fillText("Premi R per ricominciare", screenWidth / 2, (screenHeight / 2) + 50);
    }

    // Mostra l'immagine di laurea
    //if (graduationImage.complete) {
    //    ctx.drawImage(graduationImage, screenWidth / 2 - 36, screenHeight / 2 - 340, 130, 320); // Regola le dimensioni e la posizione
    //}

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

        // Resetta la posizione della linea dell'obiettivo
        goalLineY = -1;

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

// Variabile globale per memorizzare la posizione della linea dell'obiettivo
var goalLineY = -1; // Inizialmente la linea non è visibile

// Funzione per disegnare la linea dell'obiettivo
function drawGoalLine() {
    // Calcola la posizione della linea dell'obiettivo
    if (goalLineY === -1 && yDistanceTravelled >= graduationBlock * 100 * 0.7) {
        // Fai apparire la linea quando il giocatore ha superato il 70% del percorso
        goalLineY = blocks[0].y - (graduationBlock * 100); // Posizione iniziale della linea
    }

    // Se la linea è visibile, disegnala
    if (goalLineY !== -1) {
        ctx.strokeStyle = "red"; // Colore della linea
        ctx.lineWidth = 3; // Spessore della linea
        ctx.beginPath();
        ctx.moveTo(0, goalLineY); // Inizia la linea a sinistra
        ctx.lineTo(screenWidth, goalLineY); // Termina la linea a destra
        ctx.stroke();

        // Aggiungi un'etichetta di testo sopra la linea
        ctx.font = "20px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("LAUREA: " + graduationBlock + " CFU", screenWidth / 2, goalLineY - 10);
    }
}

// Funzione per rimuovere i blocchi che sono oltre la linea rossa
function cleanBlocks() {
    for (var i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i] === 0) {
            blocks.splice(i, 1); // Rimuove il blocco dall'array
        }
    }
}

// Seleziona il bottone di riavvio
var restartButton = document.getElementById("restartButton");

// Aggiungi un gestore di eventi al bottone
restartButton.addEventListener("click", function () {
    // Esegui la stessa logica del tasto "R"
    blocks = [];
    lowestBlock = 0;
    difficulty = 0;
    score = 0;
    yDistanceTravelled = 0;
    player.springBootsDurability = 0;

    // Resetta la posizione della linea dell'obiettivo
    goalLineY = -1;

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
});

// Funzione per mostrare/nascondere il bottone di riavvio
function toggleRestartButton() {
    // Il bottone sarà visibile solo su dispositivi mobili
    if (isMobileDevice() && (dead || yDistanceTravelled >= graduationBlock * 100)) {
        restartButton.style.display = "block"; // Mostra il bottone
        restartButton.style.top = "60%"; // Solo la posizione cambia su mobile
    } else {
        restartButton.style.display = "none"; // Nascondi il bottone
    }
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

// Modifica la funzione loop per disegnare la linea dell'obiettivo
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
            toggleRestartButton(); // Mostra il bottone di riavvio
            return; // Esci dalla funzione per interrompere il gioco
        }

        // Aggiorna la posizione della linea dell'obiettivo
        if (goalLineY !== -1) {
            goalLineY = blocks[0].y - (graduationBlock * 100); // Aggiorna la posizione della linea in base ai blocchi
        }

        // Disegna la linea dell'obiettivo
        drawGoalLine();

        // Ciclo per disegnare i blocchi
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i] !== 0) {
                if (goalLineY !== -1 && blocks[i].y < goalLineY) {
                    blocks[i] = 0;
                    continue;
                }

                blocks[i].update();
                blocks[i].draw();
            }
        }

        // Pulisci i blocchi rimossi
        cleanBlocks();

        player.update();
        player.draw();

        showScore();

        ctx.fill();
        then = now - (delta % interval);

        // Mostra/nascondi il bottone di riavvio in base allo stato del gioco
        toggleRestartButton();
    }
}

loop();
