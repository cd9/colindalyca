export class FontDrawer {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	drawString(str) {
		this.stringToDraw = str;
	}

	tick(frameData) {
		// Draw some text for fun
		var width = this.canvas.width;
		var height = this.canvas.height;
		this.ctx.textAlign = "center";
		this.ctx.font = `${Math.sin(frameData.frame / 100) * 30 + 60}px Consolas`;
		var mouseXY = frameData.mouseCoordinates;
		this.ctx.fillText(`Colin Daly`, mouseXY[0], mouseXY[1]);
	}
}
