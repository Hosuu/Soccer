import { GAME_HEIGHT, GAME_WIDTH } from '../constants.js';
import BaseEngine from './Engine/BaseEngine.js';
import GameManager from './GameManager.js';
export default class SoccerEngine extends BaseEngine {
    gameManager;
    _gameScale;
    constructor() {
        super();
        this.gameManager = new GameManager(this);
    }
    update() {
        this.gameManager.update(this.deltaTime);
    }
    draw() {
        this.gameManager.draw();
    }
    onResize() {
        const { innerWidth: width, innerHeight: height } = window;
        const gameCanvas = document.querySelector('canvas');
        let WIDTH = GAME_WIDTH;
        let HEIGHT = GAME_HEIGHT;
        while (WIDTH + 9 < width && HEIGHT + 16 < height) {
            WIDTH += 9;
            HEIGHT += 16;
        }
        this._gameScale = HEIGHT / GAME_HEIGHT;
        gameCanvas.width = WIDTH;
        gameCanvas.height = HEIGHT;
    }
    get gameScale() {
        return this._gameScale;
    }
}
//# sourceMappingURL=SoccerEngine.js.map