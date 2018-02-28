const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

const canvasSize = 800;
const terrainSize = 5000;
const minimapSize = 150;
const minimapPlayerSize = 4;
const defaultHexagonSize = 100;

const player = {x: Math.round(Math.random() * terrainSize), y: Math.round(Math.random() * terrainSize)};
const movement = [0, 0, 0, 0];
const defaultHexagonPoints =
    [{x: 50, y: 0}, {x: 100, y: 25 * 1.2}, {x: 100, y: 75 * 1.2},
        {x: 50, y: 100 * 1.2}, {x: 0, y: 75 * 1.2}, {x: 0, y: 25 * 1.2}];

ctx.width = ctx.height = canvasSize;

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
        y: point.y * scale + y - (moveWithPlayer ? player.y : 0) + (moveWithPlayer ? canvasSize / 2 : 0)
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
    ctx.fillRect(canvasSize / 2 - 5, canvasSize / 2 - 5, 10, 10);
}

function drawMinimap() {
    ctx.clearRect(0, canvasSize - minimapSize, minimapSize, minimapSize);
    ctx.strokeRect(0, canvasSize - minimapSize, minimapSize, minimapSize);
    const maxAmountOfHexagonsOnARow = 3;
    const scale = minimapSize / (maxAmountOfHexagonsOnARow * defaultHexagonSize);
    const verticalStepComparedToDefaultHexagonSize = 90;
    const verticalStep = verticalStepComparedToDefaultHexagonSize * scale;
    drawHexagon(minimapSize - defaultHexagonSize * scale * 2.5, canvasSize - minimapSize, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale * 1.5, canvasSize - minimapSize, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale * 3, canvasSize - minimapSize + verticalStep, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale * 2, canvasSize - minimapSize + verticalStep, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale, canvasSize - minimapSize + verticalStep, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale * 1.5, canvasSize - minimapSize + verticalStep * 2, scale, false);
    drawHexagon(minimapSize - defaultHexagonSize * scale * 2.5, canvasSize - minimapSize + verticalStep * 2, scale, false);
}

function drawPlayerOnMinimap() {
    ctx.fillRect(
        player.x / (terrainSize / minimapSize) - minimapPlayerSize / 2,
        (canvasSize - minimapSize) + player.y / (terrainSize / minimapSize) - minimapPlayerSize / 2,
        minimapPlayerSize,
        minimapPlayerSize);
}

function render() {
    clearCanvas();
    drawPlayingFieldHexagons();
    drawPlayerOnPlayingField();
    drawMinimap();
    drawPlayerOnMinimap();
    requestAnimationFrame(render);
}

render();

setInterval(() => {
    if (movement[0])
        player.x--;
    if (movement[1])
        player.y--;
    if (movement[2])
        player.x++;
    if (movement[3])
        player.y++;

    document.title = `${player.x} - ${player.y}`;
}, 1000 / 60);