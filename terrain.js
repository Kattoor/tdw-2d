const terrainSize = 2000;

const bounds = [{x: 5, y: 3}, {x: 10, y: 0}, {x: 15, y: 3}, {x: 20, y: 0}, {x: 25, y: 3}, {x: 25, y: 9},
    {x: 30, y: 12}, {x: 30, y: 18}, {x: 25, y: 21}, {x: 25, y: 27}, {x: 20, y: 30}, {x: 15, y: 27},
    {x: 10, y: 30}, {x: 5, y: 27}, {x: 5, y: 21}, {x: 0, y: 18}, {x: 0, y: 12}, {x: 5, y: 9}];


const boundsWidth = Math.max(...bounds.map(point => point.x)) - Math.min(...bounds.map(point => point.x));
const scale = terrainSize / boundsWidth;

const gameWorldBounds = bounds.map(point => ({x: point.x * scale, y: point.y * scale}));

function getScreenBounds() {
    return gameWorldBounds.map(toScreenCoordinates)
}

function getDistances() {
    const distances = [];

    getScreenBounds().forEach((currentPoint, index, screenBounds) => {
        const startPoint = currentPoint;
        const endPoint = index === screenBounds.length - 1 ? screenBounds[0] : screenBounds[index + 1];
        const playerPos = toScreenCoordinates(player);
        const distance = getDistanceLinePlayer(startPoint, endPoint, {x: playerPos.x, y: playerPos.y});
        distances.push(distance);
    });

    return distances;
}