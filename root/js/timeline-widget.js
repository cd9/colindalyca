export class TimelineWidget {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.yStart = 350;

		this.xStart = canvas.width / 2 - 100;
		this.blocksPerEvent = 7;
		this.blockHeight = 20;
		this.circleRadius = 10;
		this.blockWidth = 6;
		this.blockSpacing = 12;
		this.events = [
			["2021", "Software Engineer", "Google"],
			["2020", "Software Engineering Intern", "Google"],
			["2020", "Software Engineering Intern", "Yext"],
			["2018-2019", "Software Engineering Intern (VR/AR)", "Splunk"],
			["2018", "VR/AR Developer", "Spatial"],
			["2017", "VC Intern", "Khazanah Nasional Berhad"],
		];
	}

	renderText(x, y, str, fontSize, color, align) {
		this.ctx.fillStyle = color;
		this.ctx.textAlign = align;
		this.ctx.font = `bold ${fontSize}px consolas`;
		this.ctx.fillText(str, x, y);
	}

	renderEvents() {
		var yOffset = this.yStart;

		for (var i = 1; i <= this.events.length; i++) {
			var event = this.events[i - 1];
			var xOffset = this.xStart;

			for (var j = 1; j <= this.blocksPerEvent; j++) {
				// If center tick, display text and a circle
				if (j - 1 === this.blocksPerEvent - j) {
					this.ctx.arc(
						xOffset + this.blockWidth / 2,
						yOffset + this.circleRadius / 2,
						this.circleRadius,
						0,
						2 * Math.PI
					);
					this.ctx.fill();

					// Render date
					this.renderText(
						xOffset + this.blockWidth - 20,
						yOffset + 15,
						event[0],
						30,
						"#333333",
						"right"
					);

					// Render Title
					this.renderText(
						xOffset + this.blockWidth + 20,
						yOffset + 15,
						event[1],
						25,
						"black",
						"left"
					);

					// Render Company
					this.renderText(
						xOffset + this.blockWidth + 20,
						yOffset + 40,
						event[2],
						22,
						"#420099",
						"left"
					);

					yOffset += this.circleRadius + this.blockSpacing;
				} else {
					// Otherwise, render a normal tick
					this.ctx.fillStyle = "black";
					this.ctx.beginPath();
					this.ctx.fillRect(xOffset, yOffset, this.blockWidth, this.blockHeight);
					yOffset += this.blockHeight + this.blockSpacing;
				}
			}
		}
	}

	tick(frameData) {
		this.renderEvents();
	}
}
