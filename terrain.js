function Terrain() {

    this.terrainSize = 2000;

    /* Outer bounds to display on map, gets scaled. */
    this._bounds = [{x: 5, y: 3}, {x: 10, y: 0}, {x: 15, y: 3}, {x: 20, y: 0}, {x: 25, y: 3}, {x: 25, y: 9},
        {x: 30, y: 12}, {x: 30, y: 18}, {x: 25, y: 21}, {x: 25, y: 27}, {x: 20, y: 30}, {x: 15, y: 27},
        {x: 10, y: 30}, {x: 5, y: 27}, {x: 5, y: 21}, {x: 0, y: 18}, {x: 0, y: 12}, {x: 5, y: 9}];

    /* All hexagon bounds for zone detection + minimap. Also gets scaled. */
    this._zoneBounds = {
        northWestZone: [{x: 5, y: 3}, {x: 10, y: 0}, {x: 15, y: 3}, {x: 15, y: 9}, {x: 10, y: 12}, {x: 5, y: 9}],
        northEastZone: [{x: 15, y: 3}, {x: 20, y: 0}, {x: 25, y: 3}, {x: 25, y: 9}, {x: 20, y: 12}, {x: 15, y: 9}],
        westZone: [{x: 0, y: 12}, {x: 5, y: 9}, {x: 10, y: 12}, {x: 10, y: 18}, {x: 5, y: 21}, {x: 0, y: 18}],
        middleZone: [{x: 10, y: 12}, {x: 15, y: 9}, {x: 20, y: 12}, {x: 20, y: 18}, {x: 15, y: 21}, {x: 10, y: 18}],
        eastZone: [{x: 20, y: 12}, {x: 25, y: 9}, {x: 30, y: 12}, {x: 30, y: 18}, {x: 25, y: 21}, {x: 20, y: 18}],
        southWestZone: [{x: 5, y: 21}, {x: 10, y: 18}, {x: 15, y: 21}, {x: 15, y: 27}, {x: 10, y: 30}, {x: 5, y: 27}],
        southEastZone: [{x: 15, y: 21}, {x: 20, y: 18}, {x: 25, y: 21}, {x: 25, y: 27}, {x: 20, y: 30}, {x: 15, y: 27}]
    };

    this._boundsWidth = Math.max(...this._bounds.map(point => point.x)) - Math.min(...this._bounds.map(point => point.x));
    this._scale = this.terrainSize / this._boundsWidth;

    this._scaleCoordinate = coordinate => ({x: Math.floor(coordinate.x * this._scale), y: Math.floor(coordinate.y * this._scale)});

    this.gameObjects = [].concat(...Object.values(this._zoneBounds)).map(gameObject => ({x: gameObject.x * this._scale, y: gameObject.y * this._scale}));

    this.gameWorldBounds = this._bounds.map(this._scaleCoordinate);
    this.zoneBounds = Object.entries(this._zoneBounds)
        .reduce((zones, currentZone) => Object.assign(zones, {[currentZone[0]]: currentZone[1].map(this._scaleCoordinate)}), {});

    this.getDistancesToPlayer = player => {
        const distances = [];

        this.gameWorldBounds.forEach((currentPoint, index, screenBounds) => {
            const startPoint = currentPoint;
            const endPoint = index === screenBounds.length - 1 ? screenBounds[0] : screenBounds[index + 1];
            const playerPos = player.coordinates;
            const distance = getDistanceLinePlayer(startPoint, endPoint, {x: playerPos.x, y: playerPos.y});
            distances.push(distance);
        });

        return distances;
    }
}