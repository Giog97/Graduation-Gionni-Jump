// Resetta il localStorage per debug (rimuovi questa riga in produzione)
//localStorage.removeItem("secretCreditsUnlocked"); // Serve per essere sicuro che il pulsante Ringraziamenti segreti non sarà visibile

// Serve per avere webapp
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(() => {
      console.log("Service Worker registrato!");
    });
  }  

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

// Caricamento dell'immagine degli stivali a molla
var springBootsImage = new Image();
springBootsImage.src = "Sprites/new_balance_pxArt.png"; // Percorso dell'immagine

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


// Gestione del menù principale
document.getElementById("startButton").addEventListener("click", function() {
    document.getElementById("menu").style.display = "none"; // Nasconde il menù
    document.getElementById("gameCanvas").style.display = "block"; // Mostra il gioco
    resetGame(); // Reinizializza il gioco
    loop(); // Avvia il gioco
});

// Gestione del pulsante "Ringraziamenti"
document.getElementById("creditsButton").addEventListener("click", function() {
    document.getElementById("mainMenu").style.display = "none"; // Nasconde il menù principale
    document.getElementById("creditsMenu").style.display = "flex"; // Mostra la sezione ringraziamenti
});

// Gestione del pulsante "Torna indietro"
document.getElementById("backButton").addEventListener("click", function() {
    document.getElementById("creditsMenu").style.display = "none"; // Nasconde la sezione ringraziamenti
    document.getElementById("mainMenu").style.display = "flex"; // Mostra il menù principale
});

// Nascondi il pulsante "Ringraziamenti segreti" all'inizio
document.getElementById("secretCreditsButton").style.display = "none";

// Mostra il pulsante "Ringraziamenti segreti" solo se è stato sbloccato
if (localStorage.getItem("secretCreditsUnlocked") === "true") {
    document.getElementById("secretCreditsButton").style.display = "block";
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
var graduationBlock = 300; // Numero di blocchi da superare per laurearsi (300 per 300CFU)

// Funzione per visualizzare il messaggio di laurea
function showGraduationMessage() {
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black"; // Colore del contorno
    ctx.lineWidth = 0.8; // Spessore del contorno
    ctx.textAlign = "center";
    ctx.fillText("Complimenti, ti sei laureato!", screenWidth / 2, screenHeight / 2 - (screenHeight / 5));
    ctx.strokeText("Complimenti, ti sei laureato!", screenWidth / 2, screenHeight / 2 - (screenHeight / 5));

    // Mostra la scritta "Premi R per ricominciare" solo su computer
    if (!isMobileDevice()) {
        // Scritta "Premi R per ricominciare"
        ctx.font = "20px Arial";
        ctx.fillText("Premi R per ricominciare", screenWidth / 2, (screenHeight / 2 - (screenHeight / 5)) + screenHeight / 5);//+ 50);

        // Scritta "Premi M per tornare al menù"
        ctx.font = "20px Arial";
        ctx.fillText("Premi M per tornare al menù", screenWidth / 2, (screenHeight / 2 - (screenHeight / 5)) + screenHeight / 10); //+ 100);
    }

    // Mostra l'immagine di laurea
    //if (graduationImage.complete) {
    //    ctx.drawImage(graduationImage, screenWidth / 2 - 36, screenHeight / 2 - 340, 130, 320); // Regola le dimensioni e la posizione
    //}

    // Mostra l'immagine di laurea 2
    if (graduationImage2.complete) {
        const imageWidth = 220;
        const imageHeight = 250;
    
        const imageX = (screenWidth / 2) - (imageWidth / 2); // Centra l'immagine orizzontalmente
        const imageY = screenHeight - imageHeight; // Posiziona il bordo inferiore dell'immagine al bordo inferiore dello schermo
    
        ctx.drawImage(graduationImage2, imageX, imageY, imageWidth, imageHeight);

        //ctx.drawImage(graduationImage2, screenWidth / 2 - 150, screenHeight / 2 + 80, 285, 320); // Regola le dimensioni e la posizione
    }

    // Mostra il pulsante "Ringraziamenti segreti" nel menù
    document.getElementById("secretCreditsButton").style.display = "block";

    // Salva lo stato del pulsante nel localStorage
    localStorage.setItem("secretCreditsUnlocked", "true");
}

// Controlla se il pulsante "Ringraziamenti segreti" è stato sbloccato quando la pagina viene caricata
window.onload = function() {
    if (localStorage.getItem("secretCreditsUnlocked") === "true") {
        document.getElementById("secretCreditsButton").style.display = "block";
    }
};

// Funzione per tornare al menù
function returnToMenu() {
    // Resetta le variabili del gioco
    resetGame();

    // Nasconde il canvas e mostra il menù
    document.getElementById("gameCanvas").style.display = "none";
    document.getElementById("menu").style.display = "flex"; // Mostra il menù
    document.getElementById("restartButton").style.display = "none"; // Nasconde il bottone di riavvio
    document.getElementById("menuButton").style.display = "none"; // Nasconde il bottone del menù

    // Mostra il pulsante "Ringraziamenti segreti" se è stato sbloccato
    if (localStorage.getItem("secretCreditsUnlocked") === "true") {
        document.getElementById("secretCreditsButton").style.display = "block";
    }
}

function keydown(e) {
    if (e.keyCode === 65) { // A key
        holdingLeftKey = true;
    } else if (e.keyCode === 68) { // D key
        holdingRightKey = true;
    }

    if (e.keyCode === 82 && (dead || yDistanceTravelled >= graduationBlock * 100)) { // R key
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

    // Se il giocatore è morto o ha superato i 300 blocchi, premi il tasto M per tornare al menù
    if (e.keyCode === 77 && (dead || yDistanceTravelled >= graduationBlock * 100)) { // M key
        returnToMenu();
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
var goalLineRED = 0; // Inizialmente la linea non è visibile

// Funzione per disegnare la linea dell'obiettivo
function drawGoalLine() {
    // Se la linea dell'obiettivo non è stata ancora impostata e il giocatore ha raggiunto il punteggio necessario
    if (goalLineY === -1 && yDistanceTravelled >= graduationBlock * 100 * 0.7) {
        goalLineY = blocks[0].y - (graduationBlock * 100); // Imposta la linea come posizione fissa
    }

    // Se la linea è visibile, disegnala
    if (goalLineY !== -1) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, goalLineY);
        ctx.lineTo(screenWidth, goalLineY);
        ctx.stroke();

        // Testo sopra la linea
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
    resetGame(); // Reinizializza il gioco
    dead = false; // Imposta lo stato del giocatore come "vivo"
    loop(); // Avvia il gioco
});

// Aggiungi un gestore di eventi al pulsante "Ringraziamenti segreti"
document.getElementById("secretCreditsButton").addEventListener("click", function() {
    // Reindirizza alla pagina dei ringraziamenti segreti
    window.location.href = "secret_credits.html";
});

// Seleziona il bottone per tornare al menù
var menuButton = document.getElementById("menuButton");

// Aggiungi un gestore di eventi al bottone
menuButton.addEventListener("click", function () {
    returnToMenu();
});

// Funzione per mostrare/nascondere il bottone di riavvio
function toggleRestartButton() {
    // Il bottone sarà visibile solo su dispositivi mobili
    if (isMobileDevice() && (dead || yDistanceTravelled >= graduationBlock * 100)) {
        restartButton.style.display = "block"; // Mostra il bottone
        // restartButton.style.top = "60%"; // Solo la posizione cambia su mobile
        menuButton.style.display = "block"; // Mostra il bottone del menù
    } else {
        restartButton.style.display = "none"; // Nascondi il bottone
        menuButton.style.display = "none"; // Nasconde il bottone del menù
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

// Funzione per reinizializzare il gioco
function resetGame() {
    // Resetta tutte le variabili del gioco
    blocks = [];
    lowestBlock = 0;
    difficulty = 0;
    score = 0;
    yDistanceTravelled = 0;
    player.springBootsDurability = 0;
    goalLineY = -1;
    dead = false;

    // Resetta la posizione del giocatore
    player.x = 300;
    player.y = 550;

    // Ricrea il primo blocco
    blocks.push(new block);
    blocks[0].x = 300;
    blocks[0].y = 650;
    blocks[0].monster = 0;
    blocks[0].type = 0;
    blocks[0].powerup = 0;

    // Avvia lo spawner dei blocchi
    blockSpawner();
}

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

//loop(); // Questo fa si che il gioco venga avviato automaticamente anche quando il menu è visibile
