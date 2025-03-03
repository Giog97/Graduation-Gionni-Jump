function blockSpawner() {
    if (lowestBlock === 0) {
        var i = 1;
    } else {
        var i = lowestBlock;
    }

    for (i; i < lowestBlock + 60; i++) {
        if (i >= blocks.length) {
            blocks.push(new block());

            if (blocks[i - 1].type === "break") {
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

            let newY = blocks[i - 1].y - ((Math.random() * (80 + (difficulty * 25))) + 30);

            // **Modifica il controllo per impedire di bloccare la generazione dei blocchi troppo presto**
            if (goalLineY !== -1 && newY < goalLineY - 10) { // -50 per evitare che i blocchi si sovrappongano alla linea di arrivo
                continue; // Invece di fermare la generazione, salta questo blocco
            }

            blocks[i].y = newY;
        }
    }

    // Rimuove i blocchi che sono sotto di noi
    for (var i = 0; i < lowestBlock - 2; i++) {
        blocks.shift();
    }
}

