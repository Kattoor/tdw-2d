function Renderer(canvas, ctx, player) {

    this._screenResolution = {width: window.innerWidth, height: window.innerHeight};
    this._canvasSize = this._screenResolution.width;
    canvas.width = canvas.height = this._canvasSize;

    this._defaultHexagonSize = 100;

    this._defaultHexagonPoints =
        [{x: 50, y: 0}, {x: 100, y: 25 * 1.2}, {x: 100, y: 75 * 1.2},
            {x: 50, y: 100 * 1.2}, {x: 0, y: 75 * 1.2}, {x: 0, y: 25 * 1.2}];

    this._toScreenCoordinates = gameWorldCoordinates => {
        return Object.assign(gameWorldCoordinates, {
            screenX: gameWorldCoordinates.x - player.coordinates.x + this._canvasSize / 2,
            screenY: gameWorldCoordinates.y - player.coordinates.y + this._screenResolution.height / 2
        });
    };

    this._drawHexagon = (x, y, scale, moveWithPlayer, color) => {

        if (moveWithPlayer === undefined)
            moveWithPlayer = true;

        const coord = moveWithPlayer ? this._toScreenCoordinates({x, y}) : {screenX: x, screenY: y};

        const transformPoint = point => ({
            x: point.x * scale + coord.screenX,
            y: point.y * scale + coord.screenY
        });

        const drawLineToPoint = point => ctx.lineTo(point.x, point.y);

        ctx.beginPath();
        const startPoint = transformPoint(this._defaultHexagonPoints[0]);
        ctx.moveTo(startPoint.x, startPoint.y);
        this._defaultHexagonPoints.slice(1).map(transformPoint).forEach(drawLineToPoint);
        drawLineToPoint(startPoint);
        if (color === undefined)
            ctx.stroke();
        else {
            ctx.fillStyle = color;
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.stroke();
        }
    };

    this._clearCanvas = () => {
        ctx.clearRect(0, 0, this._canvasSize, this._canvasSize);
    };

    this._drawPlayingFieldHexagons = terrain => {
        const screenBounds = terrain.gameWorldBounds.map(this._toScreenCoordinates);
        const startingPoint = screenBounds[0];
        ctx.beginPath();
        ctx.moveTo(startingPoint.screenX, startingPoint.screenY);
        screenBounds.slice(1).forEach(point => ctx.lineTo(point.screenX, point.screenY));
        ctx.lineTo(startingPoint.screenX, startingPoint.screenY);
        ctx.stroke();
    };

    this._drawPlayerOnPlayingField = () => {
        /* health around player */
        ctx.beginPath();
        ctx.fillStyle = '#11FF11';
        ctx.arc(this._canvasSize / 2, this._screenResolution.height / 2, 12, 1 / 2 * Math.PI, 3 / 2 * Math.PI);
        ctx.fill();

        /* stamina around player */
        ctx.beginPath();
        ctx.fillStyle = '#0000FF';
        ctx.arc(this._canvasSize / 2, this._screenResolution.height / 2, 12, 3 / 2 * Math.PI, 1 / 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();

        /* actual player */
        ctx.fillStyle = '#000000';
        const playerScreenCoords = this._toScreenCoordinates(player.coordinates);
        ctx.arc(playerScreenCoords.screenX, playerScreenCoords.screenY, 10, 0, 2 * Math.PI);
        ctx.fill();

        /* tiny dot in player*/
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(playerScreenCoords.screenX - 1, playerScreenCoords.screenY - 1, 2, 2);
        ctx.fillStyle = '#000000';
    };

    this._drawMinimap = (terrain, minimap) => {

        const scaleToMinimap = point => ({x: point.x * minimap.minimapScale, y: point.y * minimap.minimapScale});

        const moveToMinimap = point => ({x: point.x + 50, y: point.y + this._screenResolution.height - minimap.minimapSize - 50});

        ctx.beginPath();
        //ctx.fillStyle = '#ecf0f1aa';
        ctx.fillStyle = '#ff0000';
        ctx.arc(minimap.minimapSize / 2 + 50, this._screenResolution.height - minimap.minimapSize / 2 - 50, minimap.minimapSize / 2 + minimap.minimapSize / 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#000000';

        ctx.beginPath();
        Object.values(terrain.zoneBounds).forEach(zone => {
            const hexagonScreenCoordinates = zone.map(scaleToMinimap).map(moveToMinimap);
            ctx.moveTo(hexagonScreenCoordinates[0].x, hexagonScreenCoordinates[0].y);
            hexagonScreenCoordinates.forEach(coord => ctx.lineTo(coord.x, coord.y));
            ctx.lineTo(hexagonScreenCoordinates[0].x, hexagonScreenCoordinates[0].y);
        });
        ctx.stroke();

        /*const maxAmountOfHexagonsOnARow = 3;
        const scale = minimapSize / (maxAmountOfHexagonsOnARow * this._defaultHexagonSize);
        const verticalStepComparedToDefaultHexagonSize = 90;
        const verticalStep = verticalStepComparedToDefaultHexagonSize * scale;
        const calcHexagonX = step => minimapSize - this._defaultHexagonSize * scale * (maxAmountOfHexagonsOnARow - step) + 50;
        this._drawHexagon(calcHexagonX(0.5), this._screenResolution.height - minimapSize - 50, scale, false, '#2ecc71');
        this._drawHexagon(calcHexagonX(1.5), this._screenResolution.height - minimapSize - 50, scale, false, '#2ecc71');
        this._drawHexagon(calcHexagonX(0), this._screenResolution.height - minimapSize + verticalStep - 50, scale, false, '#2ecc71');
        this._drawHexagon(calcHexagonX(1), this._screenResolution.height - minimapSize + verticalStep - 50, scale, false, '#2ecc71');
        this._drawHexagon(calcHexagonX(2), this._screenResolution.height - minimapSize + verticalStep - 50, scale, false, '#2ecc71');
        this._drawHexagon(calcHexagonX(1.5), this._screenResolution.height - minimapSize + verticalStep * 2 - 50, scale, false, '#2ecc71');
        this._drawHexagon(calcHexagonX(0.5), this._screenResolution.height - minimapSize + verticalStep * 2 - 50, scale, false, '#2ecc71');*/
    };

    this._drawPlayerOnMinimap = (terrain, player, minimap) => {
        ctx.fillRect(
            player.coordinates.x / (terrain.terrainSize / minimap.minimapSize) - minimap.minimapPlayerSize / 2 + 50,
            (this._screenResolution.height - minimap.minimapSize) + player.coordinates.y / (terrain.terrainSize / minimap.minimapSize) - minimap.minimapPlayerSize / 2 - 50,
            minimap.minimapPlayerSize,
            minimap.minimapPlayerSize);
    };

    this.render = (terrain, player, minimap) => {
        this._clearCanvas();
        this._drawPlayingFieldHexagons(terrain);
        this._drawPlayerOnPlayingField();
        this._drawMinimap(terrain, minimap);
        this._drawPlayerOnMinimap(terrain, player, minimap);
    }
}