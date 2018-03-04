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

setInterval(() => {

    const distances = getDistances();

    [distances[0], distances[2], distances[16]].forEach(distance => {
        if (distance.distanceVector.x + 6 >= 0 && distance.lineSlope > -1 && distance.lineSlope < 0 && distance.linesIntersect) {
            movement[0] = 0;
            movement[1] = 0;
            console.log('hit 0, 2 or 16')
        }
    });

    [distances[1], distances[3], distances[5]].forEach(distance => {
        if (distance.distanceVector.x - 6 <= 0 && distance.lineSlope > 0 && distance.lineSlope < 1 && distance.linesIntersect) {
            movement[1] = 0;
            movement[2] = 0;
            console.log(distance);
        }
    });

    [distances[4], distances[6], distances[8]].forEach(distance => {
        // linesIntersect of distances[4] (vertical line, right-up) is false when it should be true!
        if (distance.distanceVector.x - 12 <= 0 && distance.lineSlope === Number.POSITIVE_INFINITY && distance.linesIntersect) {
            movement[2] = 0;
            console.log('hit 4, 6 or 8')
        }
    });

    [distances[7], distances[9], distances[11]].forEach(distance => {
        if (distance.distanceVector.x - 6 <= 0 && distance.lineSlope > -1 && distance.lineSlope < 0 && distance.linesIntersect) {
            movement[2] = 0;
            movement[3] = 0;
            console.log('hit 7, 9 or 11')
        }
    });

    [distances[10], distances[12], distances[14]].forEach(distance => {
        if (distance.distanceVector.x + 6 >= 0 && distance.lineSlope > 0 && distance.lineSlope < 1 && distance.linesIntersect) {
            movement[0] = 0;
            movement[3] = 0;
            console.log('hit 10, 12 or 14')
        }
    });

    [distances[13], distances[15], distances[17]].forEach(distance => {
        if (distance.distanceVector.x + 12 >= 0 && distance.lineSlope === Number.NEGATIVE_INFINITY && distance.linesIntersect) {
            movement[0] = 0;
            console.log('hit 13, 15 or 17')
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
}, 1000 / 60);
