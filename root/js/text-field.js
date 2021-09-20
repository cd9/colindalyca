export class TextField {
	constructor(canvas, str, x, y, fontSize, fontColor) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.str = str;
		this.x = x;
		this.y = y;
		this.fontSize = fontSize;
		this.fontColor = fontColor;
	}

	tick(frameData) {
		this.ctx.fillStyle = this.fontColor;
		this.ctx.textAlign = "center";
		this.ctx.font = `${this.fontSize}px monospace`;
		this.ctx.fillText(this.str, this.x, this.y);
	}
}
