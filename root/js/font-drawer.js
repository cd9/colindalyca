export class FontDrawer {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		// We'll just manually enter the important cells and add a border programmatically
		// Thank God for vim
		var letters = [
			[1,1,1,0,1,1,1,0,1,0,0,0,1,1,1,0,1,1,1,0,0,1,1,0,0,1,1,1,0,1,0,0,0,1,0,1],
			[1,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,1,1],
			[1,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,1,0,1,0,0,1,0,1,0,1,1,1,0,1,0,0,0,0,1,0],
			[1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,0,1,1,0,0,1,0,1,0,1,1,1,0,0,1,0]
		]

		var margin = 2;
		var scaleFactor = 2;
		var height = (letters.length + 2 * margin) * scaleFactor;
		var width = (letters[0].length + 2 * margin) * scaleFactor;

		this.blockWidth = 10;
		this.blockSpacing = 1;
		this.mouseDistance = 200;
		this.mouseDistanceSquared = Math.pow(this.mouseDistance,2);

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

	drawSingleBlock(x, y, offsetX, offsetY, mouseX, mouseY, filled) {
		if (filled){
			return;
		}
		var x = offsetX + x * this.blockWidth + (x - 1) * this.blockSpacing;
		var y = offsetY + y * this.blockWidth + (y - 1) * this.blockSpacing;
		var mouseXOffset = 0;
		var mouseYOffset = 0;
		var scaleModifier = 1;
		var squareDist = Math.pow(mouseX-x,2) + Math.pow(mouseY-y,2);
		if (squareDist < this.mouseDistanceSquared){
			mouseXOffset = 0.2*(x-mouseX)*(1-(squareDist/this.mouseDistanceSquared));
			mouseYOffset = 0.2*(y-mouseY)*(1-(squareDist/this.mouseDistanceSquared));
			scaleModifier = (squareDist/this.mouseDistanceSquared)*0.1 + 0.9;
		}
		var brightness = (1-scaleModifier)*100;
		this.ctx.fillStyle = `hsl(0,0%,${brightness}%)`;
		this.ctx.beginPath();
		this.ctx.fillRect(
			mouseXOffset + x,
			mouseYOffset + y,
			this.blockWidth*scaleModifier,
			this.blockWidth*scaleModifier
		);
		this.ctx.stroke();
	}

	tick(frameData) {
		// Draw bitmap
		var height = this.matrix.length;
		var width = this.matrix[0].length;
		var offsetX =
			(this.blockWidth * width + this.blockSpacing * (width - 1)) / -2 +
			this.canvas.width / 2;
		var offsetY =
			(this.blockWidth * height + this.blockSpacing * (height - 1)) / -2 +
			this.canvas.height / 4;
		var mouseXY = frameData.mouseXY;
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				this.drawSingleBlock(
					j, i, offsetX, offsetY, 
					mouseXY[0], mouseXY[1], 
					this.matrix[i][j] == 1);
			}
		}
	}
}
