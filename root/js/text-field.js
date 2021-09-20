export class TextField {
	constructor(canvas, str, x, y, fontSize) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.str = str;
		this.x = x;
		this.y = y;
		this.fontSize = fontSize;
	}

	tick(frameData) {
		this.ctx.fillStyle = "black";
		this.ctx.textAlign = "center";
		this.ctx.font = `${this.fontSize}px consolas`;
		this.ctx.fillText(this.str, this.x, this.y);
	}
}
