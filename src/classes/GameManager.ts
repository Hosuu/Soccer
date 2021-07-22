import {
	BALL_SCALE,
	GAME_HEIGHT,
	GAME_WIDTH,
	GRAVITY_STRENGTH,
	KICK_STRENGTH,
	WALL_BOUNCE_SPEED_MULTIPLER,
} from '../constants.js'
import { clamp, distance, loadImg } from '../Utils.js'
import { Button } from './Engine/InputManager.js'
import SoccerEngine from './SoccerEngine.js'

export default class GameManager {
	private readonly engine: SoccerEngine

	private readonly canvas: HTMLCanvasElement

	private isPlaying: boolean
	private score: number

	private ballImg!: HTMLImageElement
	private ballX!: number
	private ballY!: number
	private ballVelX!: number
	private ballVelY!: number

	private cursorX: number
	private cursorY: number
	private angleToBall: number

	constructor(engineRef: SoccerEngine) {
		this.engine = engineRef

		this.isPlaying = false
		this.canvas = document.querySelector('canvas')!

		this.ballX = GAME_WIDTH / 2
		this.ballY = GAME_HEIGHT / 2

		this.cursorX = 0
		this.cursorY = 0
		this.score = 0

		this.angleToBall = 0

		loadImg('./ball.png').then((img) => {
			this.ballImg = img
			this.engine._startEngine()
		})
	}

	public update(dt: number) {
		const gameScale = this.engine.gameScale
		const input = this.engine.input

		this.cursorX = clamp(
			Math.round(input.cursorPosition.x - this.canvas.getBoundingClientRect().x),
			0,
			this.canvas.width
		)
		this.cursorY = clamp(
			Math.round(input.cursorPosition.y - this.canvas.getBoundingClientRect().y),
			0,
			this.canvas.height
		)

		this.angleToBall = Math.atan2(
			this.ballY * gameScale - this.cursorY,
			this.ballX * gameScale - this.cursorX
		)

		if (!this.isPlaying) {
			//If not playing and user clicks start the game
			if (input.getDown(Button.Left) && this.isCursorOnBall()) {
				this.startGame()
			}

			return
		}

		//If user clicks on ball
		if (input.getDown(Button.Left) && this.isCursorOnBall()) {
			this.ballVelX += Math.cos(this.angleToBall) * KICK_STRENGTH
			this.ballVelY = Math.min(this.ballVelY, 0) + Math.sin(this.angleToBall) * KICK_STRENGTH
			this.score++
		}

		//Apply Gravity
		this.ballVelY += GRAVITY_STRENGTH * dt

		//Move Ball
		this.ballX += this.ballVelX * dt
		this.ballY += this.ballVelY * dt

		//Left/Right wall collision check
		if (
			this.ballX <= (this.ballImg.width * BALL_SCALE) / 2 ||
			this.ballX >= GAME_WIDTH - (this.ballImg.width * BALL_SCALE) / 2
		) {
			if (this.ballX < GAME_WIDTH / 2) this.ballX = (this.ballImg.width * BALL_SCALE) / 2
			if (this.ballX > GAME_WIDTH / 2)
				this.ballX = GAME_WIDTH - (this.ballImg.width * BALL_SCALE) / 2

			this.ballVelX *= -WALL_BOUNCE_SPEED_MULTIPLER
		}

		//Ball Fall check
		if (this.ballY > GAME_HEIGHT + this.ballImg.height * BALL_SCALE) this.resetGame()
	}

	public draw() {
		const ctx = this.canvas.getContext('2d')!
		const gameScale = this.engine.gameScale

		//Background
		ctx.fillStyle = '#050505'
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		//Background score
		if (this.score) {
			ctx.font = `${gameScale * 64}px Arial`
			const metrics = ctx.measureText(String(this.score))
			ctx.fillStyle = '#666'
			ctx.fillText(
				String(this.score),
				this.canvas.width / 2 - metrics.width / 2,
				this.canvas.height / 3 - metrics.actualBoundingBoxAscent / 2
			)
		}

		//Draw Ball
		ctx.drawImage(
			this.ballImg,
			this.ballX * gameScale - (this.ballImg.width / 2) * gameScale * BALL_SCALE,
			this.ballY * gameScale - (this.ballImg.height / 2) * gameScale * BALL_SCALE,
			this.ballImg.width * gameScale * BALL_SCALE,
			this.ballImg.height * gameScale * BALL_SCALE
		)

		//If not stared draw direcion arrow + hitbox
		if (!this.isPlaying) {
			//Ball hitbox
			ctx.fillStyle = '#f002'
			ctx.beginPath()
			ctx.arc(
				this.ballX * gameScale,
				this.ballY * gameScale,
				(this.ballImg.width * BALL_SCALE * gameScale) / 2,
				Math.PI,
				2 * Math.PI,
				true
			)
			ctx.fill()

			//Current kick direction
			if (this.isCursorOnBall()) {
				ctx.strokeStyle = '#fc5a'
				ctx.lineCap = 'round'
				ctx.lineWidth = 3 * gameScale
				ctx.beginPath()
				ctx.moveTo(this.ballX * gameScale, this.ballY * gameScale)
				const angle = Math.atan2(
					this.ballY * gameScale - this.cursorY,
					this.ballX * gameScale - this.cursorX
				)
				ctx.lineTo(
					this.ballX * gameScale + Math.cos(angle) * gameScale * 150 * KICK_STRENGTH,
					this.ballY * gameScale + Math.sin(angle) * gameScale * 150 * KICK_STRENGTH
				)
				ctx.stroke()
				ctx.closePath()
			}
		}
	}

	public startGame(): void {
		this.ballX = GAME_WIDTH / 2
		this.ballY = GAME_HEIGHT / 2

		this.score = 0

		this.ballVelX = Math.cos(this.angleToBall) * KICK_STRENGTH
		this.ballVelY = Math.sin(this.angleToBall) * KICK_STRENGTH

		this.isPlaying = true
	}

	public resetGame(): void {
		this.ballX = GAME_WIDTH / 2
		this.ballY = GAME_HEIGHT / 2
		this.isPlaying = false
	}

	private isCursorOnBall(): boolean {
		return (
			distance(
				this.cursorX,
				this.cursorY,
				this.ballX * this.engine.gameScale,
				this.ballY * this.engine.gameScale
			) <=
				(BALL_SCALE * this.engine.gameScale * this.ballImg.width) / 2 &&
			this.cursorY >= this.ballY * this.engine.gameScale
		)
	}
}
