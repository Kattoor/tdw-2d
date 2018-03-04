const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

const screenResolution = {width: window.innerWidth, height: window.innerHeight};
const canvasSize = screenResolution.width;
canvas.width = canvas.height = canvasSize;

const defaultHexagonSize = 100;

const defaultHexagonPoints =
    [{x: 50, y: 0}, {x: 100, y: 25 * 1.2}, {x: 100, y: 75 * 1.2},
        {x: 50, y: 100 * 1.2}, {x: 0, y: 75 * 1.2}, {x: 0, y: 25 * 1.2}];

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
    const screenBounds = getScreenBounds();
    const startingPoint = screenBounds[0];
    ctx.beginPath();
    ctx.moveTo(startingPoint.screenX, startingPoint.screenY);
    screenBounds.slice(1).forEach(point => ctx.lineTo(point.screenX, point.screenY));
    ctx.lineTo(startingPoint.screenX, startingPoint.screenY);
    ctx.stroke();
}

function drawPlayerOnPlayingField() {
    /* health around player */
    ctx.beginPath();
    ctx.fillStyle = '#11FF11';
    ctx.arc(canvasSize / 2, screenResolution.height / 2, 12, 1 / 2 * Math.PI, 3 / 2 * Math.PI);
    ctx.fill();

    /* stamina around player */
    ctx.beginPath();
    ctx.fillStyle = '#0000FF';
    ctx.arc(canvasSize / 2, screenResolution.height / 2, 12, 3 / 2 * Math.PI, 1 / 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();

    /* actual player */
    ctx.fillStyle = '#000000';
    const playerScreenCoords = toScreenCoordinates(player);
    ctx.arc(playerScreenCoords.screenX, playerScreenCoords.screenY, 10, 0, 2 * Math.PI);
    ctx.fill();

    /* tiny dot in player*/
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(playerScreenCoords.screenX - 1, playerScreenCoords.screenY - 1, 2, 2);
    ctx.fillStyle = '#000000';
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
    drawMinimap();
    drawPlayerOnMinimap();
    requestAnimationFrame(render);
}

render();
