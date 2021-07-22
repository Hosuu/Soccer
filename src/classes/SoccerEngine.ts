import { GAME_HEIGHT, GAME_WIDTH } from '../constants.js'
import BaseEngine from './Engine/BaseEngine.js'
import GameManager from './GameManager.js'

export default class SoccerEngine extends BaseEngine {
	public readonly gameManager: GameManager

	private _gameScale!: number

	constructor() {
		super()

		this.gameManager = new GameManager(this)
	}

	protected override update(): void {
		this.gameManager.update(this.deltaTime)
	}

	protected override draw(): void {
		this.gameManager.draw()
	}

	protected override onResize(): void {
		const { innerWidth: width, innerHeight: height } = window

		const gameCanvas = document.querySelector('canvas')!

		let WIDTH = GAME_WIDTH
		let HEIGHT = GAME_HEIGHT

		while (WIDTH + 9 < width && HEIGHT + 16 < height) {
			WIDTH += 9
			HEIGHT += 16
		}

		this._gameScale = HEIGHT / GAME_HEIGHT

		gameCanvas.width = WIDTH
		gameCanvas.height = HEIGHT
	}

	public get gameScale() {
		return this._gameScale
	}
}
