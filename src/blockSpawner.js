function blockSpawner() {
    if (lowestBlock === 0) {
        var i = 1;
    } else {
        var i = lowestBlock;
    }

    // Controlla se la linea dell'obiettivo è visibile
    if (goalLineY !== -1) {
        // Interrompi la generazione di nuovi blocchi se la linea è visibile
        return;
    }

    for (i; i < lowestBlock + 60; i++) {
        if (i >= blocks.length) {
            blocks.push(new block);

            if (blocks[i-1].type === "break") {
                blocks[i].type = 0;
            } else {
                blocks[i].type = spawnBlock();
            }

            blocks[i].powerup = 0;
            blocks[i].monster = 0;

            if (blocks[i].type === 0) {
                blocks[i].powerup = spawnPowerup();

                if (blocks[i].powerup === 0) {
                    blocks[i].monster = spawnMonster();
                }
            }

            blocks[i].x = Math.random() * (screenWidth - blocks[i].width);

            // Calcola la posizione y del nuovo blocco
            let newY = blocks[i-1].y - ((Math.random() * (80 + (difficulty * 25))) + 30);

            // Se la linea rossa è visibile, assicurati che il blocco non sia generato oltre la linea
            if (goalLineY !== -1 && newY < goalLineY) {
                newY = goalLineY + 10; // Posiziona il blocco appena sotto la linea rossa
            }

            blocks[i].y = newY;
        }
    }

    // Rimuovi i blocchi che sono sotto di noi
    for (var i = 0; i < lowestBlock - 2; i++) {
        blocks.shift();
    }
}
