function Renderer(canvas, ctx, player) {

    this._screenResolution = {width: window.innerWidth, height: window.innerHeight};
    this._canvasSize = this._screenResolution.width;
    canvas.width = canvas.height = this._canvasSize;

    this._clearCanvas = () => {
        ctx.clearRect(0, 0, this._canvasSize, this._canvasSize);
    };

    this._drawPlayingFieldHexagons = terrain => {
        const screenBounds = terrain.gameWorldBounds.map(CoordinateConverter.toScreenCoordinates);
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
        const playerScreenCoords = CoordinateConverter.toScreenCoordinates(player.coordinates);
        ctx.arc(playerScreenCoords.screenX, playerScreenCoords.screenY, 10, 0, 2 * Math.PI);
        ctx.fill();

        /* tiny dot in player*/
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(playerScreenCoords.screenX - 1, playerScreenCoords.screenY - 1, 2, 2);
        ctx.fillStyle = '#000000';
    };

    this._drawMinimap = (terrain, minimap) => {

        const scaleToMinimap = point => ({x: point.x * minimap.minimapScale, y: point.y * minimap.minimapScale});

        const moveToMinimap = point => ({
            x: point.x + 50,
            y: point.y + this._screenResolution.height - minimap.minimapSize - 50
        });

        ctx.beginPath();
        ctx.fillStyle = '#3498db55';
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
        ctx.fillStyle = '#2ecc71';
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#000000';
    };

    this._drawPlayerOnMinimap = (terrain, player, minimap) => {
        ctx.fillRect(
            player.coordinates.x / (terrain.terrainSize / minimap.minimapSize) - minimap.minimapPlayerSize / 2 + 50,
            (this._screenResolution.height - minimap.minimapSize) + player.coordinates.y / (terrain.terrainSize / minimap.minimapSize) - minimap.minimapPlayerSize / 2 - 50,
            minimap.minimapPlayerSize,
            minimap.minimapPlayerSize);
    };

    this._drawPlayerVision = (player, gameObjects) => {

        const playerCoords = CoordinateConverter.toScreenCoordinates(player.coordinates);
        const normalVisionTrianglePoint1Coords = CoordinateConverter.toScreenCoordinates(player.normalVisionTrianglePoints.point1);
        const normalVisionTrianglePoint2Coords = CoordinateConverter.toScreenCoordinates(player.normalVisionTrianglePoints.point2);

        /* Normal vision */
        ctx.beginPath();
        ctx.fillStyle = '#ffff0044';
        ctx.moveTo(playerCoords.screenX, playerCoords.screenY);
        //console.log(normalVisionTrianglePoint1Coords.screenX)
        ctx.lineTo(normalVisionTrianglePoint1Coords.screenX, normalVisionTrianglePoint1Coords.screenY);
        ctx.lineTo(normalVisionTrianglePoint2Coords.screenX, normalVisionTrianglePoint2Coords.screenY);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = '#000000';

        function circleInTriangle(triangle, circle) {
            const denominator = ((triangle.point2.y - triangle.point3.y) * (triangle.point1.x - triangle.point3.x) + (triangle.point3.x - triangle.point2.x) * (triangle.point1.y - triangle.point3.y));
            const interval = 2 * Math.PI / 8;
            const points = [1, 2, 3, 4, 5, 6, 7, 8]
                .map(index => {
                    const rad = index * interval;
                    const x = circle.x + circle.radius * Math.cos(rad);
                    const y = circle.y + circle.radius * Math.sin(rad);
                    return {x, y};
                });
            const atleastOnePointInTriangle = points
                .map(pointOnCircle => {
                    const a = ((triangle.point2.y - triangle.point3.y) * (pointOnCircle.x - triangle.point3.x) + (triangle.point3.x - triangle.point2.x) * (pointOnCircle.y - triangle.point3.y)) / denominator;
                    const b = ((triangle.point3.y - triangle.point1.y) * (pointOnCircle.x - triangle.point3.x) + (triangle.point1.x - triangle.point3.x) * (pointOnCircle.y - triangle.point3.y)) / denominator;
                    const c = 1 - a - b;
                    return {a, b, c};
                })
                .filter(({a, b, c}) => 0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1)
                .length >= 1;
            return {points, atleastOnePointInTriangle};
        }

        gameObjects.forEach(gameObject => {
            const visionTrianglePoint1Coords = CoordinateConverter.toScreenCoordinates(gameObject.visionTrianglePoints.point1);
            const visionTrianglePoint2Coords = CoordinateConverter.toScreenCoordinates(gameObject.visionTrianglePoints.point2);
            const gameObjectBoundsPoint1Coords = CoordinateConverter.toScreenCoordinates(gameObject.bounds.point1);
            const gameObjectBoundsPoint2Coords = CoordinateConverter.toScreenCoordinates(gameObject.bounds.point2);

            const isCircleInTriangle = circleInTriangle({point1: playerCoords, point2: normalVisionTrianglePoint1Coords, point3: normalVisionTrianglePoint2Coords}, {x: gameObject.x, y: gameObject.y, radius: 20});


            gameObject = CoordinateConverter.toScreenCoordinates(gameObject);

            /* Shadow */
            if (isCircleInTriangle.atleastOnePointInTriangle) {
                ctx.beginPath();
                ctx.moveTo(visionTrianglePoint2Coords.screenX + (visionTrianglePoint2Coords.screenX - gameObjectBoundsPoint2Coords.screenX), visionTrianglePoint2Coords.screenY + (visionTrianglePoint2Coords.screenY - gameObjectBoundsPoint2Coords.screenY));
                ctx.lineTo(gameObjectBoundsPoint2Coords.screenX, gameObjectBoundsPoint2Coords.screenY);
                ctx.lineTo(gameObjectBoundsPoint1Coords.screenX, gameObjectBoundsPoint1Coords.screenY);
                ctx.lineTo(visionTrianglePoint1Coords.screenX + (visionTrianglePoint1Coords.screenX - gameObjectBoundsPoint1Coords.screenX), visionTrianglePoint1Coords.screenY + (visionTrianglePoint1Coords.screenY - gameObjectBoundsPoint1Coords.screenY));
                ctx.fillStyle = '#ecf0f1';
                ctx.fill();
                ctx.closePath();
                ctx.fillStyle = '#000000';
            }

            /* GameObject */
            if (isCircleInTriangle.atleastOnePointInTriangle) {
                console.log('drawning')
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                console.log(gameObject.screenX, gameObject.screenY);
                ctx.arc(gameObject.screenX, gameObject.screenY, 20, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }

        });


        //const gameObject = CoordinateConverter.toScreenCoordinates(gameObjects[3]);

    };

    this._drawGameObjects = (gameObjects, player) => {


    };

    this.render = (terrain, player, minimap) => {
        this._clearCanvas();
        this._drawPlayerOnPlayingField();
        this._drawPlayerVision(player, terrain.gameObjects);
        this._drawPlayingFieldHexagons(terrain);
        this._drawMinimap(terrain, minimap);
        this._drawPlayerOnMinimap(terrain, player, minimap);
        this._drawGameObjects(terrain.gameObjects, player);
    }
}
