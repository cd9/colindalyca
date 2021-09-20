import { TextField } from "./text-field.js";

export class TimelineWidget {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.yStart = 400;
		this.xStart = canvas.width / 2 - 100;

		this.titleTextField = new TextField(
			canvas,
			"Timeline",
			canvas.width / 2,
			this.yStart - 10,
			35
		);
		this.blocksPerEvent = 7;
		this.blockHeight = 30;
		this.circleRadius = 10;
		this.blockWidth = 6;
		this.blockSpacing = 12;
		this.events = [
			["2021", "Software Engineer", "Google", "Mountain View, California"],
			["2020", "Software Engineering Intern", "Google", "Remote, New York"],
			["2020", "Software Engineering Intern", "Yext", "New York, New York"],
			[
				"2018-2019",
				"Software Engineering Intern (VR/AR)",
				"Splunk",
				"Santa Clara, California",
			],
			["2018", "VR/AR Developer", "Spatial", "New York, New York"],
			[
				"2017",
				"VC Intern",
				"Khazanah Nasional Berhad",
				"San Francisco, California",
			],
		];
	}

	renderText(x, y, str, fontSize, color, align, bold) {
		this.ctx.fillStyle = color;
		this.ctx.textAlign = align;
		var prefix = bold ? "bold " : "";
		this.ctx.font = `${prefix}${fontSize}px consolas`;
		this.ctx.fillText(str, x, y);
	}

	renderEvents(mouseY) {
		var yOffset = this.yStart;

		for (var i = 1; i <= this.events.length; i++) {
			var event = this.events[i - 1];
			var xOffset = this.xStart;

			for (var j = 1; j <= this.blocksPerEvent; j++) {
				// If center tick, display text and a circle
				if (j - 1 === this.blocksPerEvent - j) {
					var circleRadius = this.circleRadius;
					var selected = false;
					if (Math.abs(mouseY - yOffset) < 100) {
						circleRadius *= 1.2;
						selected = true;
					}

					this.ctx.arc(
						xOffset + this.blockWidth / 2,
						yOffset + this.circleRadius / 2,
						circleRadius,
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
						"right",
						selected
					);

					// Render Title
					this.renderText(
						xOffset + this.blockWidth + 20,
						yOffset + 15,
						event[1],
						25,
						"black",
						"left",
						selected
					);

					// Render Company
					this.renderText(
						xOffset + this.blockWidth + 20,
						yOffset + 40,
						event[2],
						22,
						"#420099",
						"left",
						selected
					);

					if (selected) {
						// Render Description
						this.renderText(
							xOffset + this.blockWidth + 20,
							yOffset + 65,
							event[3],
							20,
							"blue",
							"left",
							false
						);
					}

					yOffset += circleRadius + this.blockSpacing;
				} else {
					// Otherwise, render a normal tick
					var blockHeight = Math.max(
						5,
						Math.min(20, (Math.abs(yOffset - mouseY) / 200) * this.blockHeight)
					);
					this.ctx.fillStyle = "black";
					this.ctx.beginPath();
					this.ctx.fillRect(xOffset, yOffset, this.blockWidth, blockHeight);
					yOffset += blockHeight + this.blockSpacing;
				}
			}
		}
	}

	tick(frameData) {
		this.renderEvents(frameData.mouseXY[1]);
		this.titleTextField.tick(frameData);
	}
}
