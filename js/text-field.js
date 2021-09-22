export class TextField {
	constructor(canvas, str, x, y, fontSize, fontColor, textAlign) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.str = str;
		this.x = x;
		this.y = y;
		this.fontSize = fontSize;
		this.fontColor = fontColor;
		if (textAlign) {
			this.textAlign = textAlign;
		} else {
			this.textAlign = "center";
		}
	}

	tick(frameData) {
		this.ctx.fillStyle = this.fontColor;
		this.ctx.textAlign = this.textAlign;
		this.ctx.font = `${this.fontSize}px monospace`;
		this.ctx.fillText(this.str, this.x, this.y);
	}
}
