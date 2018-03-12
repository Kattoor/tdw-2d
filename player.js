function Player(x, y, speed, terrain) {

    this.coordinates = {x, y};
    const movement = [0, 0, 0, 0];
    this._visionPoint = {x: x + 1, y};
    this.normalVisionTrianglePoints = {point1: {x: 0, y: 0}, point2: {x: 0, y: 0}};
    this.gameObjectBounds = {point1: {}, point2: {}};

    document.onkeydown = e => {
        if (e.keyCode >= 37 && e.keyCode <= 40)
            movement[e.keyCode - 37] = 1;
    };

    document.onkeyup = e => {
        if (e.keyCode >= 37 && e.keyCode <= 40)
            movement[e.keyCode - 37] = 0;
    };

    document.onmousemove = e => {
        this._visionPoint = CoordinateConverter.toGameWorldCoordinates({x: e.pageX, y: e.pageY});
    };

    this._calculateNormalTriangleVisionPoints = function () {

        //https://math.stackexchange.com/questions/543961/determine-third-point-of-triangle-when-two-points-and-all-sides-are-known
        //https://academo.org/demos/rotation-about-point/

        function getDistance(point1, point2) {
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }

        function getVector(point1, point2) {
            return {x: point2.x - point1.x, y: point2.y - point1.y};
        }

        const maxSight = 500;
        const distance = getDistance(this.coordinates, {
            x: this._visionPoint.gameWorldX,
            y: this._visionPoint.gameWorldY
        });
        const scale = maxSight / distance;
        const deltaVector = getVector(this.coordinates, {
            x: this._visionPoint.gameWorldX,
            y: this._visionPoint.gameWorldY
        });
        const visionPointScaledToMaxSight = {
            x: deltaVector.x * scale + this.coordinates.x,
            y: deltaVector.y * scale + this.coordinates.y
        };

        this.normalVisionTrianglePoints = {
            point1: {
                x: (visionPointScaledToMaxSight.x - this.coordinates.x) * Math.cos(30 * Math.PI / 180) - (visionPointScaledToMaxSight.y - this.coordinates.y) * Math.sin(30 * Math.PI / 180) + this.coordinates.x,
                y: (visionPointScaledToMaxSight.y - this.coordinates.y) * Math.cos(30 * Math.PI / 180) + (visionPointScaledToMaxSight.x - this.coordinates.x) * Math.sin(30 * Math.PI / 180) + this.coordinates.y
            },
            point2: {
                x: (visionPointScaledToMaxSight.x - this.coordinates.x) * Math.cos(330 * Math.PI / 180) - (visionPointScaledToMaxSight.y - this.coordinates.y) * Math.sin(330 * Math.PI / 180) + this.coordinates.x,
                y: (visionPointScaledToMaxSight.y - this.coordinates.y) * Math.cos(330 * Math.PI / 180) + (visionPointScaledToMaxSight.x - this.coordinates.x) * Math.sin(330 * Math.PI / 180) + this.coordinates.y
            }
        };
    };

    this._updateMouseCoordsInGameWorld = () => {
        this._visionPoint = CoordinateConverter.toGameWorldCoordinates(this._visionPoint);
    };

    this._updateVisionTriangle = () => {
       // const gameObjects = terrain.gameObjects.slice(3, 4);

       // this.gameObjectBounds = [];
        //this.visionTrianglePoints = [];

        terrain.gameObjects = terrain.gameObjects.map(gameObject => {
            const slopeBetweenPlayerAndGameObject = -1 * getSlope(this.coordinates, gameObject);
            const slope = slopeBetweenPlayerAndGameObject === 0 ? Number.POSITIVE_INFINITY : -1 / slopeBetweenPlayerAndGameObject;

            const r = Math.sqrt(1 + Math.pow(slope, 2));

            let x = r === Number.POSITIVE_INFINITY ? gameObject.x : gameObject.x + (20 / r);
            let y = r === Number.POSITIVE_INFINITY ? gameObject.y - 20 : gameObject.y - (20 * slope) / r;
            let x2 = r === Number.POSITIVE_INFINITY ? gameObject.x : gameObject.x - (20 / r);
            let y2 = r === Number.POSITIVE_INFINITY ? gameObject.y + 20 : gameObject.y + (20 * slope) / r;

            if ((this.coordinates.y > gameObject.y && this.coordinates.x < gameObject.x) || (this.coordinates.y >= gameObject.y && this.coordinates.x > gameObject.x)) {
                let a = x2;
                let b = y2;
                x2 = x;
                y2 = y;
                x = a;
                y = b;
            }

            const intersectionPoint1 = getIntersectionPoint({point1: this.coordinates, point2: {x, y}}, {point1: {x: this.normalVisionTrianglePoints.point1.x, y: this.normalVisionTrianglePoints.point1.y}, point2: {x: this.normalVisionTrianglePoints.point2.x, y: this.normalVisionTrianglePoints.point2.y}});
            const intersectionPoint2 = getIntersectionPoint({point1: this.coordinates, point2: {x: x2, y: y2}}, {point1: {x: this.normalVisionTrianglePoints.point1.x, y: this.normalVisionTrianglePoints.point1.y}, point2: {x: this.normalVisionTrianglePoints.point2.x, y: this.normalVisionTrianglePoints.point2.y}});

            gameObject.bounds = {point1: {x, y}, point2: {x: x2, y: y2}};
            gameObject.visionTrianglePoints = {point1: intersectionPoint1, point2: intersectionPoint2};

            return gameObject;
        });

        /*
        *
        * const visionPoints = {point1, point2};

        const gameObject = CoordinateConverter.toScreenCoordinates(gameObjects[3]);
        //gameObjects.slice(3, 4).map(CoordinateConverter.toScreenCoordinates).forEach(gameObject => {
        ctx.beginPath();
        ctx.arc(gameObject.screenX, gameObject.screenY, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        const player2 = CoordinateConverter.toScreenCoordinates(player.coordinates);

        const slopeBetweenPlayerAndGameObject = -1 * getSlope({x: player2.screenX, y: player2.screenY}, {x: gameObject.screenX, y: gameObject.screenY});
        const slope = slopeBetweenPlayerAndGameObject === 0 ? Number.POSITIVE_INFINITY : -1 / slopeBetweenPlayerAndGameObject;

        /!* todo: project {x,y} and {x2,y2} on outer edge of vision so we get shadow *!/

        const r = Math.sqrt(1 + Math.pow(slope, 2));

        const x = r === Number.POSITIVE_INFINITY ? gameObject.screenX : gameObject.screenX + (20 / r);
        const y = r === Number.POSITIVE_INFINITY ? gameObject.screenY - 20 : gameObject.screenY - (20 * slope) / r;
        const x2 = r === Number.POSITIVE_INFINITY ? gameObject.screenX : gameObject.screenX - (20 / r);
        const y2 = r === Number.POSITIVE_INFINITY ? gameObject.screenY + 20 : gameObject.screenY + (20 * slope) / r;

        const intersectionPoint1 = getIntersectionPoint({point1: {x: player2.screenX, y: player2.screenY}, point2: {x: x, y: y}}, {point1: {x: visionPoints.point1.screenX, y: visionPoints.point1.screenY}, point2: {x: visionPoints.point2.screenX, y: visionPoints.point2.screenY}});
        const intersectionPoint2 = getIntersectionPoint({point1: {x: player2.screenX, y: player2.screenY}, point2: {x: x2, y: y2}}, {point1: {x: visionPoints.point1.screenX, y: visionPoints.point1.screenY}, point2: {x: visionPoints.point2.screenX, y: visionPoints.point2.screenY}});


        * */
    };

    this.update = terrain => {

        const movementBlock = [0, 0, 0, 0];
        const distances = terrain.getDistancesToPlayer(this);

        [distances[0], distances[2], distances[16]].forEach(distance => {
            if (distance.distanceVector.x + 6 >= 0 && distance.lineSlope > -1 && distance.lineSlope < 0 && distance.linesIntersect) {
                movementBlock[0] = 1;
                movementBlock[1] = 1;
            }
        });

        [distances[1], distances[3], distances[5]].forEach(distance => {
            if (distance.distanceVector.x - 6 <= 0 && distance.lineSlope > 0 && distance.lineSlope < 1 && distance.linesIntersect) {
                movementBlock[1] = 1;
                movementBlock[2] = 1;
            }
        });

        [distances[4], distances[6], distances[8]].forEach(distance => {
            if (distance.distanceVector.x - 12 <= 0 && distance.lineSlope === Number.POSITIVE_INFINITY && distance.linesIntersect) {
                movementBlock[2] = 1;
            }
        });

        [distances[7], distances[9], distances[11]].forEach(distance => {
            if (distance.distanceVector.x - 6 <= 0 && distance.lineSlope > -1 && distance.lineSlope < 0 && distance.linesIntersect) {
                movementBlock[2] = 1;
                movementBlock[3] = 1;
            }
        });

        [distances[10], distances[12], distances[14]].forEach(distance => {
            if (distance.distanceVector.x + 6 >= 0 && distance.lineSlope > 0 && distance.lineSlope < 1 && distance.linesIntersect) {
                movementBlock[0] = 1;
                movementBlock[3] = 1;
            }
        });

        [distances[13], distances[15], distances[17]].forEach(distance => {
            if (distance.distanceVector.x + 12 >= 0 && distance.lineSlope === Number.NEGATIVE_INFINITY && distance.linesIntersect) {
                movementBlock[0] = 1;
            }
        });

        if (movement[0] && !movementBlock[0])
            this.coordinates.x -= speed;
        if (movement[1] && !movementBlock[1])
            this.coordinates.y -= speed;
        if (movement[2] && !movementBlock[2])
            this.coordinates.x += speed;
        if (movement[3] && !movementBlock[3])
            this.coordinates.y += speed;

        this._updateMouseCoordsInGameWorld();
        this._updateVisionTriangle();
        this._calculateNormalTriangleVisionPoints();
    };
}
