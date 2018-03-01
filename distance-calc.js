function rico(x1, y1, x2, y2) {
    return (y2 - y1) / (x2 - x1);
}

function vgl1(x1, y1, x2, y2) {
    const a = y2 - y1;
    const b = x1 - x2;
    const c = a * x1 + b * y1;
    return {a, b, c}
}

function vgl2(rico, playerX, playerY) {
    const x1 = playerX;
    const y1 = playerY;
    const x2 = x1 + 1;
    const y2 = y1 + rico;
    return vgl1(x1, y1, x2, y2);
}

function intersect(x1, y1, x2, y2, playerX, playerY) {
    const d1 = vgl1(x1, y1, x2, y2);
    const d2 = vgl2(-1 / rico(x1, y1, x2, y2), playerX, playerY);
    const delta = d1.a * d2.b - d2.a * d1.b;
    const x = (d2.b * d1.c - d1.b * d2.c) / delta;
    const y = (d1.a * d2.c - d2.a * d1.c) / delta;
    return {x, y};
}

function distanceVector(point1, point2) {
    return {x: point1.x - point2.x, y: point1.y - point2.y};
}

function distance(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function getDistanceLinePlayer(pointA, pointB, pointPlayer) {
    /*console.log('............')
    console.log(pointA);
    console.log(pointB);
    console.log(pointPlayer)*/
    return distanceVector(intersect(pointA.x, pointA.y, pointB.x, pointB.y, pointPlayer.x, pointPlayer.y), pointPlayer);
}
