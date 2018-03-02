const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

const screenResolution = {width: window.innerWidth, height: window.innerHeight};
const canvasSize = screenResolution.width;
canvas.width = canvas.height = canvasSize;

const defaultHexagonSize = 100;

let intersectionPoint = {x: 0, y: 0};

function getdistanceBetweenPlayerAndUpperLeftLine() {
    const scale = terrainSize / (3 * defaultHexagonSize);
    const calcHexagonX = step => terrainSize - defaultHexagonSize * scale * (3 - step);

    const upperLeftHexagonX = calcHexagonX(0.5);
    const upperLeftHexagonY = 0;

    const hexagonPos = {x: upperLeftHexagonX, y: upperLeftHexagonY};
    const hexagonPoint1 = {x: 0, y: 25 * 1.2};
    const hexagonPoint2 = {x: 50, y: 0};

    const transformPoint = hexagonPoint => ({
        x: hexagonPoint.x * scale + hexagonPos.x,
        y: hexagonPoint.y * scale + hexagonPos.y
    });

    const startPoint = toScreenCoordinates(transformPoint(hexagonPoint1));
    const endPoint = toScreenCoordinates(transformPoint(hexagonPoint2));

    const playerPos = toScreenCoordinates(player);

    const distance = getDistanceLinePlayer(startPoint, endPoint, {x: playerPos.x, y: playerPos.y});

//    document.title = Math.round(distance.distanceVector.x) + ', ' + Math.round(distance.distanceVector.y) + ' + ' + player.x + ", " + player.y;

/*
    const ipos = toScreenCoordinates(distance.intersection);
    ctx.fillRect(ipos.screenX, ipos.screenY, 10, 10);
*/

//    intersectionPoint = distance.intersection;


    return distance;
}

function drawDistanceBetweenPlayerAndUpperLeftLine() {

    /*
    ctx.beginPath();
    ctx.strokeStyle = '#ff0000';
    ctx.moveTo(startPoint.screenX, startPoint.screenY);
    ctx.lineTo(endPoint.screenX, endPoint.screenY);
    ctx.stroke();

    ctx.strokeStyle = '#000000';
*/

}

const defaultHexagonPoints =
    [{x: 50, y: 0}, {x: 100, y: 25 * 1.2}, {x: 100, y: 75 * 1.2},
        {x: 50, y: 100 * 1.2}, {x: 0, y: 75 * 1.2}, {x: 0, y: 25 * 1.2}];

function toScreenCoordinates(gameWorldCoordinates) {
    return Object.assign(gameWorldCoordinates, {
        screenX: gameWorldCoordinates.x - player.x + canvasSize / 2,
        screenY: gameWorldCoordinates.y - player.y + screenResolution.height / 2
    });
}

function prepareHexagonStroke(x, y, scale) {
    const coord = toScreenCoordinates({x, y});

    const transformPoint = point => ({
        x: point.x * scale + coord.screenX,
        y: point.y * scale + coord.screenY
    });

    const drawLineToPoint = point => ctx.lineTo(point.x, point.y);

    const startPoint = transformPoint(defaultHexagonPoints[0]);
    ctx.moveTo(startPoint.x, startPoint.y);
    defaultHexagonPoints.slice(1).map(transformPoint).forEach(drawLineToPoint);
    drawLineToPoint(startPoint);
}

function drawHexagon(x, y, scale, moveWithPlayer, color) {

    if (moveWithPlayer === undefined)
        moveWithPlayer = true;

    const coord = moveWithPlayer ? toScreenCoordinates({x, y}) : {screenX: x, screenY: y};

    const transformPoint = point => ({
        x: point.x * scale + coord.screenX,
        y: point.y * scale + coord.screenY
    });

    const drawLineToPoint = point => ctx.lineTo(point.x, point.y);

    ctx.beginPath();
    const startPoint = transformPoint(defaultHexagonPoints[0]);
    ctx.moveTo(startPoint.x, startPoint.y);
    defaultHexagonPoints.slice(1).map(transformPoint).forEach(drawLineToPoint);
    drawLineToPoint(startPoint);
    if (color === undefined)
        ctx.stroke();
    else {
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.stroke();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

function drawPlayingFieldHexagons() {
    const maxAmountOfHexagonsOnARow = 3;
    const scale = terrainSize / (maxAmountOfHexagonsOnARow * defaultHexagonSize);
    const verticalStepComparedToDefaultHexagonSize = 90;
    const verticalStep = verticalStepComparedToDefaultHexagonSize * scale;
    const calcHexagonX = step => terrainSize - defaultHexagonSize * scale * (maxAmountOfHexagonsOnARow - step);
    ctx.beginPath();
    prepareHexagonStroke(calcHexagonX(0.5), 0, scale);
    prepareHexagonStroke(calcHexagonX(1.5), 0, scale);
    prepareHexagonStroke(calcHexagonX(0), verticalStep, scale);
    prepareHexagonStroke(calcHexagonX(1), verticalStep, scale);
    prepareHexagonStroke(calcHexagonX(2), verticalStep, scale);
    prepareHexagonStroke(calcHexagonX(1.5), verticalStep * 2, scale);
    prepareHexagonStroke(calcHexagonX(0.5), verticalStep * 2, scale);
    ctx.stroke();
}

function drawPlayerOnPlayingField() {
    ctx.beginPath();
    ctx.fillStyle = '#11FF11';
    ctx.arc(canvasSize / 2, screenResolution.height / 2, 12, 1 / 2 * Math.PI, 3 / 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#0000FF';
    ctx.arc(canvasSize / 2, screenResolution.height / 2, 12, 3 / 2 * Math.PI, 1 / 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    const playerScreenCoords = toScreenCoordinates(player);
    ctx.arc(playerScreenCoords.screenX, playerScreenCoords.screenY, 10, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#0000ff';
    ctx.fillRect(playerScreenCoords.screenX - 1, playerScreenCoords.screenY - 1, 2, 2);
    ctx.fillStyle = '#000000';

    const distance = getdistanceBetweenPlayerAndUpperLeftLine();
    if (distance.distanceVector.x < 0)
        ctx.strokeStyle = '#00ff00';
    else
        ctx.strokeStyle = '#ff0000';
    const interSectionPointOnScreen = toScreenCoordinates(distance.intersectionPoint);
    ctx.beginPath();
    ctx.moveTo(interSectionPointOnScreen.screenX, interSectionPointOnScreen.screenY);
    ctx.lineTo(playerScreenCoords.screenX, playerScreenCoords.screenY);
    ctx.stroke();
    ctx.strokeStyle = '#000000';
}

function drawBorders() {
    const borders = [
        {x: 0, y: -20, width: terrainSize, height: 20}, {x: terrainSize + 20, y: 0, width: 20, height: terrainSize},
        {x: 0, y: terrainSize + 20, width: terrainSize, height: 20}, {x: 0, y: 0, width: 20, height: terrainSize}];

    //borders.map(border => Object.assign(border, toScreenCoordinates(border))).forEach(border => ctx.fillRect(border.x, border.y, border.width, border.height));
}

function drawMinimap() {
    ctx.beginPath();
    ctx.fillStyle = '#ecf0f1aa';
    ctx.arc(minimapSize / 2 + 50, screenResolution.height - minimapSize / 2 - 50, minimapSize / 2 + minimapSize / 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#000000';

    const maxAmountOfHexagonsOnARow = 3;
    const scale = minimapSize / (maxAmountOfHexagonsOnARow * defaultHexagonSize);
    const verticalStepComparedToDefaultHexagonSize = 90;
    const verticalStep = verticalStepComparedToDefaultHexagonSize * scale;
    const calcHexagonX = step => minimapSize - defaultHexagonSize * scale * (maxAmountOfHexagonsOnARow - step) + 50;
    drawHexagon(calcHexagonX(0.5), screenResolution.height - minimapSize - 50, scale, false, '#2ecc71');
    drawHexagon(calcHexagonX(1.5), screenResolution.height - minimapSize - 50, scale, false, '#2ecc71');
    drawHexagon(calcHexagonX(0), screenResolution.height - minimapSize + verticalStep - 50, scale, false, '#2ecc71');
    drawHexagon(calcHexagonX(1), screenResolution.height - minimapSize + verticalStep - 50, scale, false, '#2ecc71');
    drawHexagon(calcHexagonX(2), screenResolution.height - minimapSize + verticalStep - 50, scale, false, '#2ecc71');
    drawHexagon(calcHexagonX(1.5), screenResolution.height - minimapSize + verticalStep * 2 - 50, scale, false, '#2ecc71');
    drawHexagon(calcHexagonX(0.5), screenResolution.height - minimapSize + verticalStep * 2 - 50, scale, false, '#2ecc71');
    drawDistanceBetweenPlayerAndUpperLeftLine();
}

function drawPlayerOnMinimap() {
    ctx.fillRect(
        player.x / (terrainSize / minimapSize) - minimapPlayerSize / 2 + 50,
        (screenResolution.height - minimapSize) + player.y / (terrainSize / minimapSize) - minimapPlayerSize / 2 - 50,
        minimapPlayerSize,
        minimapPlayerSize);
}

function render() {
    clearCanvas();
    drawPlayingFieldHexagons();
    drawPlayerOnPlayingField();
    drawBorders();
    drawMinimap();
    drawPlayerOnMinimap();
    requestAnimationFrame(render);
}

render();
