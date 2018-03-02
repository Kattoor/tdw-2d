const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

const screenResolution = {width: window.innerWidth, height: window.innerHeight};
const canvasSize = screenResolution.width;
canvas.width = canvas.height = canvasSize;

const defaultHexagonSize = 100;

function getDistances() {
    const scale = terrainSize / 30;

    const transformPoint = hexagonPoint => ({
        x: hexagonPoint.x * scale,
        y: hexagonPoint.y * scale,
    });

    const distances = [];

    bounds.forEach((currentPoint, index, bounds) => {
        const nextPoint = index === bounds.length - 1 ? bounds[0] : bounds[index + 1];
        const startPoint = toScreenCoordinates(transformPoint(currentPoint));
        const endPoint = toScreenCoordinates(transformPoint(nextPoint));
        const playerPos = toScreenCoordinates(player);
        const distance = getDistanceLinePlayer(startPoint, endPoint, {x: playerPos.x, y: playerPos.y});
        distances.push(distance);
    });

    return distances;
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

const bounds = [{x: 5, y: 3}, {x: 10, y: 0}, {x: 15, y: 3}, {x: 20, y: 0}, {x: 25, y: 3}, {x: 25, y: 9},
    {x: 30, y: 12}, {x: 30, y: 18}, {x: 25, y: 21}, {x: 25, y: 27}, {x: 20, y: 30}, {x: 15, y: 27},
    {x: 10, y: 30}, {x: 5, y: 27}, {x: 5, y: 21}, {x: 0, y: 18}, {x: 0, y: 12}, {x: 5, y: 9}];

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
    const boundsWidth = 30;
    const scale = terrainSize / boundsWidth;
    const startingPoint = toScreenCoordinates({x: bounds[0].x * scale, y: bounds[0].y * scale});
    //document.title = startingPoint.screenX + ', ' + startingPoint.screenY;
    ctx.beginPath();
    ctx.moveTo(startingPoint.screenX, startingPoint.screenY);
    bounds.slice(1).map(point => ({
        x: point.x * scale,
        y: point.y * scale
    })).map(toScreenCoordinates).forEach(point => ctx.lineTo(point.screenX, point.screenY));
    ctx.lineTo(startingPoint.screenX, startingPoint.screenY);
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

    /*const distances = getDistances();
    distances.forEach(distance => {
        if (distance.distanceVector.x < 0)
            ctx.strokeStyle = '#00ff00';
        else
            ctx.strokeStyle = '#ff0000';
        const interSectionPointOnScreen = toScreenCoordinates(distance.intersectionPoint);
        ctx.beginPath();
        ctx.moveTo(interSectionPointOnScreen.screenX, interSectionPointOnScreen.screenY);
        ctx.lineTo(playerScreenCoords.screenX, playerScreenCoords.screenY);
        ctx.stroke();
    });*/
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
