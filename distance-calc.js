function getSlope(linePoint1, linePoint2) {
    return (linePoint2.y - linePoint1.y) / (linePoint2.x - linePoint1.x);
}

function getLineDataFromTwoPoints(linePoint1, linePoint2) {
    const a = linePoint2.y - linePoint1.y;
    const b = linePoint1.x - linePoint2.x;
    const c = a * linePoint1.x + b * linePoint1.y;
    return {a, b, c}
}

function getLineDataFromSlopeAndPoint(slope, linePoint1) {
    const linePoint2 = {x: linePoint1.x + 1, y: linePoint1.y + slope};
    return getLineDataFromTwoPoints(linePoint1, linePoint2);
}

function getPerpendicularIntersectionPoint(linePoint1, linePoint2, perpendicularLinePoint1) {
    const d1 = getLineDataFromTwoPoints(linePoint1, linePoint2);
    const d2 = getLineDataFromSlopeAndPoint(-1 / getSlope(linePoint1, linePoint2), perpendicularLinePoint1);
    const delta = d1.a * d2.b - d2.a * d1.b;
    const x = (d2.b * d1.c - d1.b * d2.c) / delta;
    const y = (d1.a * d2.c - d2.a * d1.c) / delta;
    return {x, y};
}

function getDistanceVector(point1, point2) {
    return {x: point1.x - point2.x, y: point1.y - point2.y};
}

function distance(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function getDistanceLinePlayer(linePoint1, linePoint2, playerPoint) {
    const lineSlope = getSlope(linePoint1, linePoint2);
    const intersectionPoint = getPerpendicularIntersectionPoint(linePoint1, linePoint2, playerPoint);
    const distanceVector = getDistanceVector(intersectionPoint, playerPoint);
    return {intersectionPoint, lineSlope, distanceVector};
}
