export class CursorWidget {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.offsets = [60, 190, 200];
		this.sizes = [2, 4, 6];
		this.distances = [20, 30, 40];
		this.speeds = [4, 8, 12];
	}

	tick(frameData) {
		var mouseXY = frameData.mouseXY;
		for (var i = 0; i < this.offsets.length; i++) {
			var angle = this.offsets[i] + frameData.frame*this.speeds[i];
			var distance = this.distances[i];
			var xOffset = Math.cos(angle*(Math.PI/180))*distance;
			var yOffset = Math.sin(angle*(Math.PI/180))*distance;
			this.ctx.beginPath();
			this.ctx.arc(mouseXY[0]+xOffset, mouseXY[1]+yOffset, this.sizes[i], 0, 2 * Math.PI);
			this.ctx.fillStyle = "black";
			this.ctx.fill();
			this.ctx.stroke();
		}
	}
}
