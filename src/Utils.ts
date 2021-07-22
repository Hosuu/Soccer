export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

export function loadImg(path: string): Promise<HTMLImageElement> {
	return new Promise((res, rej) => {
		const img = new Image()
		img.addEventListener('load', () => {
			res(img)
		})
		img.src = path
	})
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
	return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}
