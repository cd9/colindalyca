import { COLOR_THEME } from "./color-theme.js";
import { TextField } from "./text-field.js";

export class TimelineWidget {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.yStart = 375;
		this.xStart = canvas.width / 2 - 100;

		this.titleTextField = new TextField(
			canvas,
			"Timeline",
			canvas.width / 2,
			this.yStart - 10,
			35,
			COLOR_THEME.green
		);
		this.blocksPerEvent = 7;
		this.blockHeight = 15;
		this.circleRadius = 8;
		this.blockWidth = 4;
		this.blockSpacing = 12;
		this.events = [
			["2021", "Software Engineer", "Google", "Mountain View, California"],
			[
				"2021",
				"Bachelor of Computer Science",
				"University of Waterloo",
				"Computer Science, Co-op",
			],
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
					if (Math.abs(mouseY - yOffset) < 50) {
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
						yOffset + 12,
						`>${event[0]}`,
						22,
						COLOR_THEME.green,
						"right",
						selected
					);

					// Render Title
					this.renderText(
						xOffset + this.blockWidth + 20,
						yOffset + 12,
						event[1],
						22,
						COLOR_THEME.purple,
						"left",
						selected
					);

					// Render Company
					this.renderText(
						xOffset + this.blockWidth + 20,
						yOffset + 35,
						event[2],
						18,
						COLOR_THEME.lightOrange,
						"left",
						false
					);

					if (selected) {
						// Render Description
						this.renderText(
							xOffset + this.blockWidth + 20,
							yOffset + 58,
							event[3],
							18,
							COLOR_THEME.blue,
							"left",
							false
						);
					}

					yOffset += circleRadius + this.blockSpacing;
				} else {
					// Otherwise, render a normal tick
					var blockHeight = Math.max(
						10,
						Math.min(
							this.blockHeight,
							(Math.abs(yOffset - mouseY) / 200) * this.blockHeight
						)
					);
					this.ctx.fillStyle = COLOR_THEME.lines;
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
