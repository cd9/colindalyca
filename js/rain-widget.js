/*
Renders "raindrop" color effects down the screen.
*/
export class RainWidget {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.numDrops = 10;
		this.dropGridResolution = 10;
		this.dropLength = 16;
		this.dropY = 0;
		this.dropSpeed = 4;
		this.dropSizePeak = 8;
		this.xBlockStart = 100;
		this.xBlockEnd = canvas.width - 100;
		this.dropLocations = [];
		var self = this;
		for (var i = 0; i < this.numDrops; i++) {
			self.spawnDrop(i);
		}
	}

	spawnDrop(dropIndex) {
		var spawnLeft = dropIndex < this.numDrops / 2;
		var xMin = spawnLeft ? 0 : this.xBlockEnd;
		var xMax = spawnLeft ? this.xBlockStart : this.canvas.width;
		var randX = xMin + Math.random() * (xMax - xMin);
		while (dropIndex > this.dropLocations.length - 1) {
			this.dropLocations.push([-100, -100]);
		}
		this.dropLocations[dropIndex] = [
			randX,
			-this.canvas.height * Math.random(),
		];
	}

	renderRect(x, y, size, brightness) {
		var hue = ((x + y) / 10) % 256;
		size *= 0.5 + (Math.abs(((x + y) % 100) - 50) / 50) * 0.5;
		this.ctx.fillStyle = `hsl(${hue},100%,${brightness}%)`;
		this.ctx.fillRect(x - size / 2, y - size / 2, size, size);
	}

	tick(frameData) {
		for (var i = 0; i < this.dropLocations.length; i++) {
			var xy = this.dropLocations[i];
			this.ctx.beginPath();

			var center = [
				Math.floor(xy[0] / this.dropGridResolution) * this.dropGridResolution,
				Math.floor(xy[1] / this.dropGridResolution) * this.dropGridResolution,
			];

			var numDrops = 1;
			var startY = center[1];
			var endY = center[1] + this.dropGridResolution * (this.dropLength - 1);
			for (var j = 0; j < this.dropLength / 2; j++) {
				var roundedDrops = 1 + Math.floor(numDrops / 2) * 2;
				var startX =
					center[0] - (this.dropGridResolution * (roundedDrops - 1)) / 2;
				var dropScale = j / (this.dropLength / 2 - 1);
				for (var k = 0; k < roundedDrops; k++) {
					this.renderRect(
						startX + this.dropGridResolution * k,
						startY + this.dropGridResolution * j,
						this.dropSizePeak * dropScale,
						50 * dropScale
					);
					if (j < this.dropLength / 2 - 1) {
						this.renderRect(
							startX + this.dropGridResolution * k,
							endY - this.dropGridResolution * (j + 1),
							this.dropSizePeak * dropScale,
							50 * dropScale
						);
					}
				}
				numDrops += 0.25;
			}

			xy[1] += this.dropSpeed;
			if (xy[1] > this.canvas.height) {
				this.spawnDrop(i);
			}
		}
	}
}
