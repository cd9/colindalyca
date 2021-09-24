/*
Simple widget to render a text field.
*/
export class TextField {
	constructor(canvas, str, x, y, fontSize, fontColor, textAlign, rotation) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.str = str;
		this.x = x;
		this.y = y;
		this.fontSize = fontSize;
		this.fontColor = fontColor;
		this.textAlign = textAlign ? textAlign : "center";
		this.rotation = rotation ? rotation : 0;
	}

	getWidth(){
		this.setContext();
		return this.ctx.measureText(this.str).width;
	}

	setContext(){
		this.ctx.fillStyle = this.fontColor;
		this.ctx.textAlign = this.textAlign;
		this.ctx.font = `${this.fontSize}px monospace`;
	}

	tick(frameData) {
		this.setContext();
		if (this.rotation > 0) {
			this.ctx.save();
			var textWidth = this.ctx.measureText(this.str).width;
			this.ctx.translate(this.x + textWidth / 2, this.y);
			this.ctx.rotate((Math.PI / 180) * this.rotation);
			this.ctx.fillText(this.str, 0, 0);
			this.ctx.restore();
			return;
		}
		this.ctx.fillText(this.str, this.x, this.y);
	}
}
