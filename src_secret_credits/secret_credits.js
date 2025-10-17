// Lista di nomi e messaggi personalizzati
const specialNames = {
    "Gionni": "Grazie, Gionni! Sei il creatore di questo gioco e senza di te nulla di tutto questo sarebbe stato possibile. Sei la parte più folle di me e di te ne ho bisogno come il pane.",
    "Giog97": "Grazie, Giog97! La parte gamer/nerd che è in me è quella che ha permesso di svagarmi e che mi ha dato la testardaggine per affrontare ogni nuova sfida.",
    "Giovanni Stefanini": "Che dire di te, Gionni?! Beh, siamo tra gli ultimi (ma non gli ultimissimi) ad aver completato il percorso universitario. È stata dura, davvero. Dura vedere gli altri laurearsi prima di noi, iniziare nuovi capitoli della loro vita, comprare casa, intraprendere lavori spettacolari o partire per viaggi straordinari… e noi? Beh, anche noi abbiamo fatto molto. Forse non “progetti di vita” nel senso tradizionale, ma esperienze che per me lo sono state a tutti gli effetti. In questi anni ho vissuto tanto, ho conosciuto persone straordinarie e ho costruito amicizie che porterò con me per sempre. Mi piace pensare di essere stato uno su cui gli amici potevano contare, o almeno qualcuno che ci ha sempre provato. Ed è per questo che voglio guardare al mio percorso universitario (lungo, travagliato, ma vero) come a qualcosa che ha saputo dare fiducia e speranza alle persone che mi stanno accanto. Sono sicuro che almeno uno, davanti a una difficoltà, avrà pensato: “Boia, mi laureo prima del Gionni!” oppure “Menomale che c’è il Gionni”. Sicuramente non Marta, che avrebbe preferito un Gionni più rapido nel laurearsi e meno preso dal rugby! Ma la ringrazio infinitamente per la pazienza e la comprensione che ha avuto. In questi anni di università, mi ha accompagnato la convizione che andava tutto bene, perchè nel frattempo allenavo. Sul campo, come allenatore, sento di aver dato tutto me stesso, forse non sempre nella tecnica, ma nell’aspetto umano sicuramente. Mi considero una persona paziente, eternamente insicura, che difficilmente dice di no, perché non vuole far star male gli altri, e che spesso si mette in secondo piano. Per qualcuno questi potrebbero essere dei limiti, ma per me sono la mia forza: ciò che mi spinge, ciò che mi fa sentire una persona migliore. Come ingegnere informatico forse non sarò il migliore, magari solo nella media. Come amico, non sempre presente. Come figlio, non sempre motivo d’orgoglio. Come ragazzo, a volte distratto e poco costante, anche se buono e rispettoso. Come allenatore, non perfetto tecnicamente, ma empatico. Tra le tante insicurezze, oggi una cosa è certa ... il mio percorso universitario finalmente si conclude. Insieme ad esso però sono arrivato a una nuova consapevolezza che mi rasserena: sono il migliore al mondo a essere il Gionni. E va bene così. Quindi grazie, Gionni. Te lo dovevo. Ricordatelo!",
    "Marta Berni": "Marta non essere impaziente ancora non mi sono laureato!",
    "ChatGpt": "Grazie per il codice e gli esempi di codice che mi hai fornito, alle spiegazioni senza senso e aver scritto in italiano corretto o inglese al posto mio",
    "Deepseek":"Grazie per le traduzioni e per gli esempi di codice che mi hai fornito",
    "Stefano Dainelli": "Grazie fratello Daino, per essere stato il miglior compagno di avventure che potessi desiderare. La mia carriera universitaria e il mio percorso di formazione giungono al termine, dopo un viaggio costellato di fatiche, soddisfazioni e momenti indimenticabili (monopattino style) che ti hanno sempre visto al mio fianco. Si chiude così un capitolo bellissimo della nostra vita: quello in cui siamo stati compagni di università, in cui ci siamo sostenuti a vicenda, abbiamo smaniato, superato ostacoli per noi insormontabili e condiviso mille esperienze. Di tutto questo, ciò che più mi mancherà sarà lo stare insieme a te, a studiare, a demoralizzarci, a gasarci, a smaniare come solo noi sappiamo fare, sentirci tutti i giorni per infamarci o per darci forza. Ormai sei più di un amico, sei un fratello. Solo tu puoi capire fino in fondo la fatica, la sofferenza e la gioia che hanno accompagnato questo percorso, perché le hai vissute anche tu. GRAZIE INFINITE, FRATELLO. Rifarei Ingegneria Informatica mille volte, con tutti i momenti difficili che mi hanno fatto vacillare ... ma solo se al mio fianco ci fossi ancora tu.",
    "Pietro Stefanini": "Grazie Pitersong, per avermi fatto sentire speciale e capace proprio quando ne avevo più bisogno. Grazie per i tuoi consigli pratici, da “cavallo maggiore”, che mi hanno aiutato ad affrontare ansie, paure, pre-esami e scelte universitarie. Nei momenti più difficili mi sono spesso chiesto “Cosa avrebbe fatto Pit?” ed ha sempre funzionato per superarli. Grazie per essere stato una fonte d’ispirazione, di saggezza e di fiducia. Siamo 2 a 3, ma può bastare così ... dopotutto, a qualcosa devo pur farti vincere."
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