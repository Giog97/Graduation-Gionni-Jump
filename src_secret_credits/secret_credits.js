// Lista di nomi e messaggi personalizzati
const specialNames = {
    "Gionni": "Grazie, Gionni! Sei il creatore di questo gioco e senza di te nulla di tutto questo sarebbe stato possibile. Sei la parte più folle di me e di te ne ho bisogno come il pane.",
    "Giog97": "Grazie, Giog97! La parte gamer/nerd che è in me è quella che ha permesso di svagarmi e che mi ha dato la testardaggine per affrontare ogni nuova sfida.",
    "Giovanni Stefanini": "Giova! Sei un grande, fatti forza perchè il successo non è definitivo, il fallimento non è fatale: è il coraggio di continuare che conta!",
};

// TODO aggiungi qui i nomi e cognomi con i ringraziamenti personalizzati

// Funzione per salvare il nome e mostrare il ringraziamento personalizzato
function saveName() {
    const userName = document.getElementById("userName").value;
    const thankYouMessage = document.getElementById("thankYouMessage");

    if (userName) {
        // Nascondi il form e mostra il messaggio di ringraziamento
        document.querySelector("p").style.display = "none";
        document.getElementById("userName").style.display = "none";
        document.querySelector("button[onclick='saveName()']").style.display = "none";

        // Mostra il ringraziamento personalizzato
        thankYouMessage.style.display = "block";
        thankYouMessage.innerHTML = getThankYouMessage(userName);
    } else {
        alert("Per favore, inserisci il tuo nome.");
    }
}

// Funzione per generare un ringraziamento personalizzato in base al nome
function getThankYouMessage(name) {
    // Verifica se il nome è nella lista dei nomi speciali
    if (specialNames[name]) {
        return specialNames[name]; // Restituisci il messaggio personalizzato
    } else {
        // Se il nome non è nella lista, restituisci un messaggio generico
        const genericMessages = [
            `Un enorme grazie a te, ${name}! Se hai giocato a questo gioco e sei arrivato fin qui per sentirti dire GRAZIE vieni da me e dimmelo, sarò pronto ad abbracciarti e ringraziarti. Se mi hai dedicato parte del tuo tempo, non potrò mai esserti abbastanza grato. Per me è importante e adesso lo sai!`,
        ];

        // Scegli un messaggio casuale dall'array
        const randomIndex = Math.floor(Math.random() * genericMessages.length);
        return genericMessages[randomIndex];
    }
}

// Funzione per tornare al menù principale
function goBackToMenu() {
    window.location.href = "index.html"; // Reindirizza alla pagina principale del gioco
}