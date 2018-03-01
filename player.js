const player = {x: Math.round(Math.random() * terrainSize), y: Math.round(Math.random() * terrainSize)};

const movement = [0, 0, 0, 0];

document.onkeydown = e => {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        movement[e.keyCode - 37] = 1;
};

document.onkeyup = e => {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        movement[e.keyCode - 37] = 0;
};

setInterval(() => {
    if (movement[0])
        player.x -= 8;
    if (movement[1])
        player.y -= 8;
    if (movement[2])
        player.x += 8;
    if (movement[3])
        player.y += 8;

    //document.title = `${player.x} - ${player.y}`;
}, 1000 / 60);