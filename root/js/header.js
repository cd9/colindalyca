export class Header {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.height = 50;
		this.lineWidth = 4;
	}

	tick(frameData) {
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.height);
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.lineTo(this.canvas.width, this.height);
		this.ctx.stroke();
	}
}
