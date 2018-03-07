function Renderer(canvas, ctx, player) {

    this._screenResolution = {width: window.innerWidth, height: window.innerHeight};
    this._canvasSize = this._screenResolution.width;
    canvas.width = canvas.height = this._canvasSize;

    this._toScreenCoordinates = gameWorldCoordinates => {
        return Object.assign(gameWorldCoordinates, {
            screenX: gameWorldCoordinates.x - player.coordinates.x + this._canvasSize / 2,
            screenY: gameWorldCoordinates.y - player.coordinates.y + this._screenResolution.height / 2
        });
    };

    this._toGameWorldCoordinates = screenCoordinates => {
        return Object.assign(screenCoordinates, {
            gameWorldX: screenCoordinates.x + player.coordinates.x - this._canvasSize / 2,
            gameWorldY: screenCoordinates.y + player.coordinates.y - this._screenResolution.height / 2
        });
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

    this._drawPlayerVision = player => {
        function getDistance(point1, point2) {
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }

        function getVector(point1, point2) {
            return {x: point2.x - point1.x, y: point2.y - point1.y};
        }

        ctx.beginPath();
        const visionPointInGameWorld = this._toGameWorldCoordinates(player.visionPoint);
        const distance = getDistance(player.coordinates, {
            x: visionPointInGameWorld.gameWorldX,
            y: visionPointInGameWorld.gameWorldY
        });
        const scale = 500 / distance;
        const deltaVector = getVector(player.coordinates, {
            x: visionPointInGameWorld.gameWorldX,
            y: visionPointInGameWorld.gameWorldY
        });
        const visionPointScaledInGameWorld = {
            x: deltaVector.x * scale + player.coordinates.x,
            y: deltaVector.y * scale + player.coordinates.y
        };
        const visionPointScaledOnScreen = this._toScreenCoordinates(visionPointScaledInGameWorld);
        const playerOnScreen = this._toScreenCoordinates(player.coordinates);
        /*console.log('player', {x: player.coordinates.x, y: player.coordinates.y});
        console.log('vision', {x: visionPointInGameWorld.gameWorldX, y: visionPointInGameWorld.gameWorldY});
        console.log('distance', getDistance({x: player.coordinates.x, y: player.coordinates.y}, {x: visionPointScaledInGameWorld.x, y: visionPointScaledInGameWorld.y}));*/
        ctx.moveTo(playerOnScreen.screenX, playerOnScreen.screenY);
        ctx.lineTo(visionPointScaledOnScreen.screenX, visionPointScaledOnScreen.screenY);

        //console.log(visionPointScaledInGameWorld)
        /* const c = getDistance({x: player.coordinates.x, y: player.coordinates.y}, {x: visionPointScaledInGameWorld.x, y: visionPointScaledInGameWorld.y});
         const a = Math.sin(30 * Math.PI * 180) / (Math.sin((180 - 30 - 90) * Math.PI * 180) / c);
         const b = Math.sqrt(Math.pow(a, 2) + Math.pow(c, 2));

         const Cy = (Math.pow(c, 2) + Math.pow(b, 2) - Math.pow(a, 2)) / (2 * c);
         const Cx = Math.sqrt(Math.pow(b, 2) - Math.pow(Cy, 2));

         const point = this._toScreenCoordinates({x: Cx + player.coordinates.x, y: Cy + player.coordinates.y});*/

        //console.log(point);

        //https://math.stackexchange.com/questions/543961/determine-third-point-of-triangle-when-two-points-and-all-sides-are-known

        //x′=xcosθ−ysinθ
        //y'=ycosθ+xsinθ


        //https://academo.org/demos/rotation-about-point/

        const point1 = this._toScreenCoordinates({
            x: (visionPointScaledInGameWorld.x - player.coordinates.x) * Math.cos(30 * Math.PI / 180) - (visionPointScaledInGameWorld.y - player.coordinates.y) * Math.sin(30 * Math.PI / 180) + player.coordinates.x,
            y: (visionPointScaledInGameWorld.y - player.coordinates.y) * Math.cos(30 * Math.PI / 180) + (visionPointScaledInGameWorld.x - player.coordinates.x) * Math.sin(30 * Math.PI / 180) + player.coordinates.y
        });

        const point2 = this._toScreenCoordinates({
            x: (visionPointScaledInGameWorld.x - player.coordinates.x) * Math.cos(330 * Math.PI / 180) - (visionPointScaledInGameWorld.y - player.coordinates.y) * Math.sin(330 * Math.PI / 180) + player.coordinates.x,
            y: (visionPointScaledInGameWorld.y - player.coordinates.y) * Math.cos(330 * Math.PI / 180) + (visionPointScaledInGameWorld.x - player.coordinates.x) * Math.sin(330 * Math.PI / 180) + player.coordinates.y
        });

        ctx.beginPath();
        ctx.moveTo(playerOnScreen.screenX, playerOnScreen.screenY);
        ctx.lineTo(point1.screenX, point1.screenY);
        ctx.lineTo(point2.screenX, point2.screenY);
        //ctx.lineTo(playerOnScreen.screenX, playerOnScreen.screenY);
        ctx.fillStyle = '#ffff0022';
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(playerOnScreen.screenX, playerOnScreen.screenY, 40, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#000000';


        /*console.log('player', {x: player.coordinates.x, y: player.coordinates.y});
        console.log('vision', {x: visionPointInGameWorld.gameWorldX, y: visionPointInGameWorld.gameWorldY});*/
        //console.log('pt1', pt1);
    };

    this._drawGameObjects = (gameObjects, player) => {

        gameObjects.map(this._toScreenCoordinates).forEach(gameObject => {
            ctx.beginPath();
            ctx.arc(gameObject.screenX, gameObject.screenY, 20, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();

            const player2 = this._toScreenCoordinates(player.coordinates);
            /*   ctx.beginPath();
               ctx.moveTo(player2.screenX, player2.screenY);
               ctx.lineTo(gameObject.screenX, gameObject.screenY);
               ctx.strokeStyle = '#ff0000';
               ctx.stroke();
               ctx.closePath();*/

            /*const c = (1 / Math.sqrt(1 + Math.pow(slope, 2)));
            const s =  (slope / Math.sqrt(1 + Math.pow(slope, 2)));
            const x = gameObject.screenX - (20 * s);
            const y = gameObject.screenY - (20 * c);
            const x2 = gameObject.screenX + (20 * s);
            const y2 = gameObject.screenY + (20 * c);*/
            /*const k = (10 / Math.sqrt(1 + Math.pow(slope, 2)));
            const x = gameObject.screenX + k;
            const y = gameObject.screenY + k * slope;
            const x2 = gameObject.screenX - k;
            const y2 = gameObject.screenY - k * slope;*/

            //x′=xcosθ−ysinθ
            //y'=ycosθ+xsinθ

            /* const angle = Math.asin(20 / getDistance({x: player.screenX, y: player.screenY}, {x: gameObject.screenX, y: gameObject.screenY})) * 57.2958;
             document.title = angle;
             const x = (gameObject.screenX - player.screenX) * Math.cos(angle * Math.PI / 180) - (gameObject.screenY - player.screenY) * Math.sin(angle * Math.PI / 180) + player.screenX;
             const y = (gameObject.screenY - player.screenY) * Math.cos(angle * Math.PI / 180) - (gameObject.screenX - player.screenX) * Math.sin(angle * Math.PI / 180) + player.screenY;
             const x2 = (gameObject.screenX - player.screenX) * Math.cos((360 - angle) * Math.PI / 180) - (gameObject.screenY - player.screenY) * Math.sin((360 - angle) * Math.PI / 180) + player.screenX;
             const y2 = (gameObject.screenY - player.screenY) * Math.cos((360 - angle) * Math.PI / 180) - (gameObject.screenX - player.screenX) * Math.sin((360 - angle) * Math.PI / 180) + player.screenY;*/


            const slopeBetweenPlayerAndGameObject = -1 * getSlope({x: player2.screenX, y: player2.screenY}, {x: gameObject.screenX, y: gameObject.screenY});
            const slope = slopeBetweenPlayerAndGameObject === 0 ? Number.POSITIVE_INFINITY : -1 / slopeBetweenPlayerAndGameObject;

            /* todo: project {x,y} and {x2,y2} on outer edge of vision so we get shadow */

            const r = Math.sqrt(1 + Math.pow(slope, 2));

            const x = r === Number.POSITIVE_INFINITY ? gameObject.screenX : gameObject.screenX + (20 / r);
            const y = r === Number.POSITIVE_INFINITY ? gameObject.screenY - 20 : gameObject.screenY - (20 * slope) / r;
            const x2 = r === Number.POSITIVE_INFINITY ? gameObject.screenX : gameObject.screenX - (20 / r);
            const y2 = r === Number.POSITIVE_INFINITY ? gameObject.screenY + 20 : gameObject.screenY + (20 * slope) / r;

            ctx.beginPath();
            ctx.moveTo(player2.screenX, player2.screenY);
            ctx.lineTo(x, y);
            ctx.moveTo(player2.screenX, player2.screenY);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();
            ctx.closePath();

            ctx.strokeStyle = '#000000';
        });
    };

    this.render = (terrain, player, minimap) => {
        this._clearCanvas();
        this._drawPlayingFieldHexagons(terrain);
        this._drawPlayerOnPlayingField();
        this._drawMinimap(terrain, minimap);
        this._drawPlayerOnMinimap(terrain, player, minimap);
        this._drawPlayerVision(player);
        this._drawGameObjects(terrain.gameObjects, player);
    }
}
