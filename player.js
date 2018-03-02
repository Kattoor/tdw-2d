//const player = {x: Math.round(Math.random() * terrainSize), y: Math.round(Math.random() * terrainSize)};

const player = {x: 0, y: 0};

const movement = [0, 0, 0, 0];

document.onkeydown = e => {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        movement[e.keyCode - 37] = 1;
};

document.onkeyup = e => {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        movement[e.keyCode - 37] = 0;
};


let i = 0;
setInterval(() => {

    /*const distance = getdistanceBetweenPlayerAndUpperLeftLine();
    if (distance.distanceVector.x + 6 >= 0) {
        movement[0] = 0;
        movement[1] = 0;
    }
*/

    const distances = getDistances();

    if (i++ % 100 === 0) {
        console.clear();
        console.log(Math.round(distances[4].intersectionPoint.x) + ', ' + Math.round(distances[4].intersectionPoint.y));
        console.log(Math.round(distances[4].distanceVector.x) + ', ' + Math.round(distances[4].distanceVector.y) + ', ' + (distances[4].lineSlope === Number.POSITIVE_INFINITY ? '+' : '-') + distances[4].lineSlope + ', ' + distances[4].linesIntersect);
        console.log(Math.round(distances[6].distanceVector.x) + ', ' + Math.round(distances[6].distanceVector.y) + ', ' + (distances[6].lineSlope === Number.POSITIVE_INFINITY ? '+' : '-') + distances[6].lineSlope + ', ' + distances[6].linesIntersect);
    }

    [distances[0], distances[2], distances[16]].forEach(distance => {
        if (distance.distanceVector.x + 6 >= 0 && distance.lineSlope > -1 && distance.lineSlope < 0 && distance.linesIntersect) {
            movement[0] = 0;
            movement[1] = 0;
        }
    });

    [distances[1], distances[3], distances[5]].forEach(distance => {
        if (distance.distanceVector.x - 6 <= 0 && distance.lineSlope > 0 && distance.lineSlope < 1 && distance.linesIntersect) {
            movement[1] = 0;
            movement[2] = 0;
        }
    });

    [distances[4], distances[6], distances[8]].forEach(distance => {
        // linesIntersect of distances[4] (vertical line, right-up) is false when it should be true!
        if (distance.distanceVector.x - 12 <= 0 && distance.lineSlope === Number.POSITIVE_INFINITY && distance.linesIntersect) {
            movement[2] = 0;
        }
        const point = toScreenCoordinates({x: distance.intersectionPoint.x, y: distance.intersectionPoint.y});
        document.title = point.screenX + ', ' + point.screenY;
        ctx.fillRect(point.screenX, point.screenY, 20, 20)
    });

    [distances[7], distances[9], distances[11]].forEach(distance => {
        if (distance.distanceVector.x - 6 <= 0 && distance.lineSlope > -1 && distance.lineSlope < 0 && distance.linesIntersect) {
            movement[2] = 0;
            movement[3] = 0;
        }
    });

    [distances[10], distances[12], distances[14]].forEach(distance => {
        if (distance.distanceVector.x + 6 >= 0 && distance.lineSlope > 0 && distance.lineSlope < 1 && distance.linesIntersect) {
            movement[0] = 0;
            movement[3] = 0;
        }
    });

    [distances[13], distances[15], distances[17]].forEach(distance => {
        if (distance.distanceVector.x + 12 >= 0 && distance.lineSlope === Number.NEGATIVE_INFINITY && distance.linesIntersect) {
            movement[0] = 0;
        }
    });

    if (movement[0])
        player.x -= 8;
    if (movement[1])
        player.y -= 8;
    if (movement[2])
        player.x += 8;
    if (movement[3])
        player.y += 8;


    /*
    if (distance.distanceVector.x < 0)
        ctx.strokeStyle = '#00ff00';
    else
        ctx.strokeStyle = '#ff0000';*/

    //document.title = `${player.x} - ${player.y}`;
}, 1000 / 60);