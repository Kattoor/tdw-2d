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

function getPerpendicularIntersectionPoint(line1Data, line2Data) {
    const delta = line1Data.a * line2Data.b - line2Data.a * line1Data.b;
    const x = (line2Data.b * line1Data.c - line1Data.b * line2Data.c) / delta;
    const y = (line1Data.a * line2Data.c - line2Data.a * line1Data.c) / delta;
    return {x, y};
}

function getDistanceVector(point1, point2) {
    return {x: point1.x - point2.x, y: point1.y - point2.y};
}

function getDistance(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function doLinesIntersect(linePoint1, linePoint2, intersectionPoint) {
    /*  linePoint1.x = Math.round(linePoint1.x);
      linePoint1.y = Math.round(linePoint1.y);
      linePoint2.x = Math.round(linePoint2.x);
      linePoint2.y = Math.round(linePoint2.y);
      intersectionPoint.x = Math.round(intersectionPoint.x);
      intersectionPoint.y = Math.round(intersectionPoint.y);*/
    const xAlright = () => (linePoint1.x <= intersectionPoint.x && linePoint2.x >= intersectionPoint.x) ||
        (linePoint1.x >= intersectionPoint.x && linePoint2.x <= intersectionPoint.x);
    const yAlright = () => (linePoint1.y <= intersectionPoint.y && linePoint2.y >= intersectionPoint.y) ||
        (linePoint1.y >= intersectionPoint.y && linePoint2.y <= intersectionPoint.y);
    return xAlright() && yAlright();
}

function getDistanceLinePlayer(linePoint1, linePoint2, playerPoint) {
    const lineSlope = getSlope(linePoint1, linePoint2);
    const line1Data = getLineDataFromTwoPoints(linePoint1, linePoint2);
    const perpendicularLineData = getLineDataFromSlopeAndPoint(-1 / lineSlope, playerPoint);

    const intersectionPoint = getPerpendicularIntersectionPoint(line1Data, perpendicularLineData);
    const distance = getDistance(intersectionPoint, playerPoint);
    const distanceVector = getDistanceVector(intersectionPoint, playerPoint);
    const linesIntersect = doLinesIntersect(linePoint1, linePoint2, intersectionPoint);
    return {intersectionPoint, lineSlope, distance, distanceVector, linesIntersect};
}
