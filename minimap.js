function Minimap(zoneBounds) {

    this.minimapSize = 200;

    this.minimapPlayerSize = 4;

    function getMinimapScale(minimapSize) {
        const allXCoordinates = [].concat(...Object.values(zoneBounds)).map(coord => coord.x);
        const deltaWidth = Math.max(...allXCoordinates) - Math.min(...allXCoordinates);
        return minimapSize / deltaWidth;
    }

    this.minimapScale = getMinimapScale(this.minimapSize);
}