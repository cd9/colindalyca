export class NameWidget {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		// We'll just manually enter the important cells and add a border programmatically
		// Thank God for vim
		var letters = [
			[
				1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0,
				0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1,
			],
			[
				1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1,
				0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1,
			],
			[
				1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1,
				0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0,
			],
			[
				1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0,
				0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0,
			],
		];

		var margin = 2;
		var scaleFactor = 2;
		var height = (letters.length + 2 * margin) * scaleFactor;
		var width = (letters[0].length + 2 * margin) * scaleFactor;

		this.blockWidth = 10;
		this.blockSpacing = 1;
		this.mouseDistance = 300;
		this.mouseDistanceSquared = Math.pow(this.mouseDistance, 2);

		// Make blank matrix
		this.matrix = Array.from(Array(height), (_) => Array(width).fill(0));

		// Fill in letters
		for (
			var i = margin * scaleFactor;
			i < (margin + letters.length) * scaleFactor;
			i++
		) {
			for (
				var j = margin * scaleFactor;
				j < (margin + letters[0].length) * scaleFactor;
				j++
			) {
				this.matrix[i][j] =
					letters[Math.floor(i / scaleFactor) - margin][
						Math.floor(j / scaleFactor) - margin
					];
			}
		}
	}

	drawString(str) {
		this.stringToDraw = str;
	}

	drawSingleBlock(
		x,
		y,
		offsetX,
		offsetY,
		mouseX,
		mouseY,
		frame,
		saturation,
		filled
	) {
		// Draw blanks for letter fill
		if (filled) {
			return;
		}
		var x = offsetX + x * this.blockWidth + (x - 1) * this.blockSpacing;
		var y = offsetY + y * this.blockWidth + (y - 1) * this.blockSpacing;
		var hue = ((x + y) / 10 + frame) % 256;

		// If mouse is near, create a bubble effect
		var mouseXOffset = 0;
		var mouseYOffset = 0;
		var scaleModifier =
			0.6 + (Math.abs((((x + y) / 20 + frame / 3) % 61) - 30) / 30) * 0.4;
		var squareDist = Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2);
		if (squareDist < this.mouseDistanceSquared) {
			var closeFactor = 1 - squareDist / this.mouseDistanceSquared;
			mouseXOffset = 0.2 * (x - mouseX) * closeFactor;
			mouseYOffset = 0.2 * (y - mouseY) * closeFactor;
			scaleModifier =
				(squareDist / this.mouseDistanceSquared) * 0.1 + scaleModifier * 0.9;
		}
		var brightness =
			50 + Math.max(0, (1 - squareDist / this.mouseDistanceSquared) * 50);
		this.ctx.fillStyle = `hsl(${hue},${saturation}%,${brightness}%)`;
		this.ctx.beginPath();
		this.ctx.fillRect(
			mouseXOffset + x,
			mouseYOffset + y,
			this.blockWidth * scaleModifier,
			this.blockWidth * scaleModifier
		);
	}

	tick(frameData) {
		// Draw bitmap
		var height = this.matrix.length;
		var width = this.matrix[0].length;
		var offsetX =
			(this.blockWidth * width + this.blockSpacing * (width - 1)) / -2 +
			this.canvas.width / 2;
		var mouseXY = frameData.mouseXY;
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				this.drawSingleBlock(
					j,
					i,
					offsetX,
					75,
					mouseXY[0],
					mouseXY[1],
					frameData.frame,
					50,
					this.matrix[i][j] == 1
				);
			}
		}
	}
}
