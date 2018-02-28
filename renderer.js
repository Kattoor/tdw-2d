const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

const screenResolution = {width: window.innerWidth, height: window.innerHeight};
const canvasSize = screenResolution.width;
canvas.width = canvas.height = canvasSize;

const terrainSize = 5000;
const minimapSize = 150;
const minimapPlayerSize = 4;
const defaultHexagonSize = 100;

const player = {x: Math.round(Math.random() * terrainSize), y: Math.round(Math.random() * terrainSize)};
const movement = [0, 0, 0, 0];
const defaultHexagonPoints =
    [{x: 50, y: 0}, {x: 100, y: 25 * 1.2}, {x: 100, y: 75 * 1.2},
        {x: 50, y: 100 * 1.2}, {x: 0, y: 75 * 1.2}, {x: 0, y: 25 * 1.2}];

document.onkeydown = e => {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        movement[e.keyCode - 37] = 1;
};

document.onkeyup = e => {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        movement[e.keyCode - 37] = 0;
};

function drawHexagon(x, y, scale, moveWithPlayer) {

    if (moveWithPlayer === undefined)
        moveWithPlayer = true;

    const transformPoint = point => ({
        x: point.x * scale + x - (moveWithPlayer ? player.x : 0) + (moveWithPlayer ? canvasSize / 2 : 0),
        y: point.y * scale + y - (moveWithPlayer ? player.y : 0) + (moveWithPlayer ? screenResolution.height / 2 : 0)
    });

    const drawLineToPoint = point => ctx.lineTo(point.x, point.y);

    ctx.beginPath();
    const startPoint = transformPoint(defaultHexagonPoints[0]);
    ctx.moveTo(startPoint.x, startPoint.y);
    defaultHexagonPoints.slice(1).map(transformPoint).forEach(drawLineToPoint);
    drawLineToPoint(startPoint);
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

function drawPlayingFieldHexagons() {
    const maxAmountOfHexagonsOnARow = 3;
    const scale = terrainSize / (maxAmountOfHexagonsOnARow * defaultHexagonSize);
    const verticalStepComparedToDefaultHexagonSize = 90;
    const verticalStep = verticalStepComparedToDefaultHexagonSize * scale;
    drawHexagon(terrainSize - defaultHexagonSize * scale * 2.5, 0, scale);
    drawHexagon(terrainSize - defaultHexagonSize * scale * 1.5, 0, scale);
    drawHexagon(terrainSize - defaultHexagonSize * scale * 3, verticalStep, scale);
    drawHexagon(terrainSize - defaultHexagonSize * scale * 2, verticalStep, scale);
    drawHexagon(terrainSize - defaultHexagonSize * scale, verticalStep, scale);
    drawHexagon(terrainSize - defaultHexagonSize * scale * 1.5, verticalStep * 2, scale);
    drawHexagon(terrainSize - defaultHexagonSize * scale * 2.5, verticalStep * 2, scale);
}

function drawPlayerOnPlayingField() {
    ctx.beginPath();
    ctx.fillStyle = '#11FF11';
    ctx.arc(canvasSize / 2 - 5, screenResolution.height / 2 - 5, 12, 1 / 2 * Math.PI, 3 / 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#0000FF';
    ctx.arc(canvasSize / 2 - 5, screenResolution.height / 2 - 5, 12, 3 / 2 * Math.PI, 1 / 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.arc(canvasSize / 2 - 5, screenResolution.height / 2 - 5, 10, 0, 2 * Math.PI);
    ctx.fill();
}

function drawBorders() {
    const borders = [
        {x: 0, y: -20, width: terrainSize, height: 20}, {x: terrainSize + 20, y: 0, width: 20, height: terrainSize},
        {x: 0, y: terrainSize + 20, width: terrainSize, height: 20}, {x: 0, y: 0, width: 20, height: terrainSize}];

    borders.map(border => Object.assign(border, {
        x: border.x - player.x + canvasSize / 2,
        y: border.y - player.y + screenResolution.height / 2
    })).forEach(border => ctx.fillRect(border.x, border.y, border.width, border.height));
}

function drawMinimap() {
    ctx.clearRect(0, screenResolution.height - minimapSize, minimapSize, minimapSize);
    ctx.strokeRect(0, screenResolution.height - minimapSize, minimapSize, minimapSize);
    const maxAmountOfHexagonsOnARow = 3;
    const scale = minimapSize / (maxAmountOfHexagonsOnARow * defaultHexagonSize);
    const verticalStepComparedToDefaultHexagonSize = 90;
    const verticalStep = verticalStepComparedToDefaultHexagonSize * scale;
    drawHexagon(minimapSize - defaultHexagonSize * scale * 2.5, screenResolution.height - minimapSize, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale * 1.5, screenResolution.height - minimapSize, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale * 3, screenResolution.height - minimapSize + verticalStep, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale * 2, screenResolution.height - minimapSize + verticalStep, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale, screenResolution.height - minimapSize + verticalStep, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale * 1.5, screenResolution.height - minimapSize + verticalStep * 2, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale * 2.5, screenResolution.height - minimapSize + verticalStep * 2, scale, false);
}

function drawPlayerOnMinimap() {
    ctx.fillRect(
        player.x / (terrainSize / minimapSize) - minimapPlayerSize / 2,
        (screenResolution.height - minimapSize) + player.y / (terrainSize / minimapSize) - minimapPlayerSize / 2,
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

setInterval(() => {
    if (movement[0])
        player.x -= 8;
    if (movement[1])
        player.y -= 8;
    if (movement[2])
        player.x += 8;
    if (movement[3])
        player.y += 8;

    document.title = `${player.x} - ${player.y} - ${screenResolution.height}`;
}, 1000 / 60);