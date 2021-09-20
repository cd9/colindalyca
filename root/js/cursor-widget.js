export class CursorWidget {

	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	tick(frameData) {
		var mouseXY = frameData.mouseXY;
		this.ctx.beginPath();
		this.ctx.arc(mouseXY[0],mouseXY[1],50,0,2*Math.PI);
		this.ctx.stroke();
	}
}
