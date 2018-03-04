function toScreenCoordinates(gameWorldCoordinates) {
    return Object.assign(gameWorldCoordinates, {
        screenX: gameWorldCoordinates.x - player.x + canvasSize / 2,
        screenY: gameWorldCoordinates.y - player.y + screenResolution.height / 2
    });
}
