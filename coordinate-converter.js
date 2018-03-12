function CoordinateConverter(player, renderer) {

    this.toScreenCoordinates = gameWorldCoordinates => {
        return Object.assign(gameWorldCoordinates, {
            screenX: gameWorldCoordinates.x - player.coordinates.x + renderer._canvasSize / 2,
            screenY: gameWorldCoordinates.y - player.coordinates.y + renderer._screenResolution.height / 2
        });
    };

    this.toGameWorldCoordinates = screenCoordinates => {
        return Object.assign(screenCoordinates, {
            gameWorldX: screenCoordinates.x + player.coordinates.x - renderer._canvasSize / 2,
            gameWorldY: screenCoordinates.y + player.coordinates.y - renderer._screenResolution.height / 2
        });
    };
}
