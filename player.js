function Player(x, y, speed) {

    this.coordinates = {x, y};
    const movement = [0, 0, 0, 0];

    document.onkeydown = e => {
        if (e.keyCode >= 37 && e.keyCode <= 40)
            movement[e.keyCode - 37] = 1;
    };

    document.onkeyup = e => {
        if (e.keyCode >= 37 && e.keyCode <= 40)
            movement[e.keyCode - 37] = 0;
    };

    this.update = terrain => {

        const movementBlock = [0, 0, 0, 0];
        const distances = terrain.getDistancesToPlayer(this);

        [distances[0], distances[2], distances[16]].forEach(distance => {
            if (distance.distanceVector.x + 6 >= 0 && distance.lineSlope > -1 && distance.lineSlope < 0 && distance.linesIntersect) {
                movementBlock[0] = 1;
                movementBlock[1] = 1;
            }
        });

        [distances[1], distances[3], distances[5]].forEach(distance => {
            if (distance.distanceVector.x - 6 <= 0 && distance.lineSlope > 0 && distance.lineSlope < 1 && distance.linesIntersect) {
                movementBlock[1] = 1;
                movementBlock[2] = 1;
            }
        });

        [distances[4], distances[6], distances[8]].forEach(distance => {
            if (distance.distanceVector.x - 12 <= 0 && distance.lineSlope === Number.POSITIVE_INFINITY && distance.linesIntersect) {
                movementBlock[2] = 1;
            }
        });

        [distances[7], distances[9], distances[11]].forEach(distance => {
            if (distance.distanceVector.x - 6 <= 0 && distance.lineSlope > -1 && distance.lineSlope < 0 && distance.linesIntersect) {
                movementBlock[2] = 1;
                movementBlock[3] = 1;
            }
        });

        [distances[10], distances[12], distances[14]].forEach(distance => {
            if (distance.distanceVector.x + 6 >= 0 && distance.lineSlope > 0 && distance.lineSlope < 1 && distance.linesIntersect) {
                movementBlock[0] = 1;
                movementBlock[3] = 1;
            }
        });

        [distances[13], distances[15], distances[17]].forEach(distance => {
            if (distance.distanceVector.x + 12 >= 0 && distance.lineSlope === Number.NEGATIVE_INFINITY && distance.linesIntersect) {
                movementBlock[0] = 1;
            }
        });

        if (movement[0] && !movementBlock[0])
            this.coordinates.x -= speed;
        if (movement[1] && !movementBlock[1])
            this.coordinates.y -= speed;
        if (movement[2] && !movementBlock[2])
            this.coordinates.x += speed;
        if (movement[3] && !movementBlock[3])
            this.coordinates.y += speed;
    };
}