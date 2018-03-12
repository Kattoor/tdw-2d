function Game() {

    const terrain = new Terrain();

    const player = new Player(0, 0, 4, terrain);

    const canvas = document.getElementsByTagName('canvas')[0];
    const canvasContext = canvas.getContext('2d');
    const renderer = new Renderer(canvas, canvasContext, player);

    const minimap = new Minimap(terrain.zoneBounds);

    const coordinateConverter = new CoordinateConverter(player, renderer);
    CoordinateConverter = coordinateConverter;

    this._update = () => {
        player.update(terrain);
    };

    this._render = () => {
        renderer.render(terrain, player, minimap);
    };

    this.startGameLoop = () => {
        setInterval(() => {
            this._update();
            this._render();
        }, 1000 / 60);
    };
}
