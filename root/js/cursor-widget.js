export class CursorWidget {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.offsets = [60, 190, 200];
		this.sizes = [3, 4, 6];
		this.distances = [30, 60, 90];
		this.targetPositions = [];
		this.currentPositions = [];
		this.speeds = [1, 2, 4];
		this.colors = ["blue", "red", "green"];
		this.maxLerpValue = 0.2;
		this.maxSize = this.sizes[0];
		this.sizes.forEach((s) => (this.maxSize = Math.max(this.maxSize, s)));
	}

	lerp(start, end, lerpValue) {
		return start + (end - start) * lerpValue;
	}

	tick(frameData) {
		var mouseXY = frameData.mouseXY;
		for (var i = 0; i < this.offsets.length; i++) {
			var angle = this.offsets[i] + frameData.frame * this.speeds[i];
			var distance = this.distances[i];
			var size = this.sizes[i];
			var xOffset = Math.cos(angle * (Math.PI / 180)) * distance;
			var yOffset = Math.sin(angle * (Math.PI / 180)) * distance;

			if (i > this.targetPositions.length - 1) {
				if (mouseXY[0] && mouseXY[1]) {
					this.targetPositions.push([0, 0]);
					this.currentPositions.push([1, 1]);
				} else {
					return;
				}
			}

			this.targetPositions[i] = [mouseXY[0] + xOffset, mouseXY[1] + yOffset];

			var lerpValue = this.maxLerpValue * (size / this.maxSize);
			this.currentPositions[i][0] = this.lerp(
				this.currentPositions[i][0],
				this.targetPositions[i][0],
				lerpValue
			);
			this.currentPositions[i][1] = this.lerp(
				this.currentPositions[i][1],
				this.targetPositions[i][1],
				lerpValue
			);

			this.ctx.beginPath();
			this.ctx.arc(
				this.currentPositions[i][0],
				this.currentPositions[i][1],
				size,
				0,
				2 * Math.PI
			);
			this.ctx.fillStyle = this.colors[i];
			this.ctx.fill();
		}
	}
}
