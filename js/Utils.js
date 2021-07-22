export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
export function loadImg(path) {
    return new Promise((res, rej) => {
        const img = new Image();
        img.addEventListener('load', () => {
            res(img);
        });
        img.src = path;
    });
}
export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
//# sourceMappingURL=Utils.js.map