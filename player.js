//const player = {x: Math.round(Math.random() * terrainSize), y: Math.round(Math.random() * terrainSize)};

const player = {x: 1700, y: 1000};

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

    const distance = getdistanceBetweenPlayerAndUpperLeftLine();
    if (distance.distanceVector.x >= 0) {
        movement[0] = 0;
        movement[1] = 0;
    }

    if (movement[0])
        player.x -= 4;
    if (movement[1])
        player.y -= 4;
    if (movement[2])
        player.x += 4;
    if (movement[3])
        player.y += 4;


    /*
    if (distance.distanceVector.x < 0)
        ctx.strokeStyle = '#00ff00';
    else
        ctx.strokeStyle = '#ff0000';*/

    //document.title = `${player.x} - ${player.y}`;
}, 1000 / 60);