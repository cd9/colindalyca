import { COLOR_THEME } from "./color-theme.js";
import { TextField } from "./text-field.js";
import { TextTyper } from "./text-typer.js";

/*
Widget that displays career timeline information in a vertical graphic.
Reacts to mouse and types out text when a timeline node is overlapped.
*/
export class TimelineWidget {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.yStart = 850;
		this.xStart = canvas.getScaledWidth() / 2 - 200;
		this.titleTextField = new TextField(
			canvas,
			"Timeline",
			canvas.getScaledWidth() / 2,
			this.yStart - 10,
			35,
			COLOR_THEME.green
		);
		this.blocksPerEvent = 9;
		this.blockHeight = 20;
		this.circleRadius = 8;
		this.blockWidth = 4;
		this.blockSpacing = 12;
		this.locationTextTyper = new TextTyper(this.canvas, 20, COLOR_THEME.blue);
		this.descriptionTextTyper = new TextTyper(
			this.canvas,
			20,
			COLOR_THEME.orange
		);
		this.scrollY = 0;
		window.addEventListener(
			"scroll",
			function () {
				var scrollTop =
					window.pageYOffset || document.documentElement.scrollTop;
				this.scrollY = scrollTop + window.innerHeight / 3;
			}.bind(this)
		);
		this.events = [
			[
				"2021",
				"Software Engineer",
				"Google",
				"Mountain View, California",
				"Classified Work",
			],
			[
				"2021",
				"Bachelor of Computer Science",
				"University of Waterloo",
				"Computer Science, Co-op",
				"Related & unrelated coursework",
			],
			[
				"2020",
				"Software Engineering Intern",
				"Google",
				"Remote, New York",
				"Chrome & Nest Dev Tools [javascript, node.js]",
			],
			[
				"2020",
				"Software Engineering Intern",
				"Yext",
				"New York, New York",
				"Data-intensive microservice development [java]",
			],
			[
				"2019",
				"Software Engineering Intern",
				"Splunk",
				"Santa Clara, California",
				"VR & AR app development [C#, Unity, javascript]",
			],
			[
				"2018",
				"Software Engineering Intern",
				"Splunk",
				"Santa Clara, California",
				"VR & AR app development [C#, Unity, javascript]",
			],
			[
				"2018",
				"VR/AR Developer",
				"Spatial",
				"New York, New York",
				"VR & AR app development [C#, Unity, WSL, Hololens]",
			],
			[
				"2017",
				"VC Intern",
				"Khazanah Nasional Berhad",
				"San Francisco, California",
				"Various projects",
			],
		];
	}

	renderText(x, y, str, fontSize, color, align, bold) {
		this.ctx.fillStyle = color;
		this.ctx.textAlign = align;
		var prefix = bold ? "bold " : "";
		this.ctx.font = `${prefix}${fontSize}px monospace`;
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
						event[0],
						28,
						COLOR_THEME.green,
						"right",
						selected
					);

					// Render Title
					this.renderText(
						xOffset + this.blockWidth + 20,
						yOffset + 12,
						event[1],
						28,
						COLOR_THEME.white,
						"left",
						selected
					);

					// Render Company
					this.renderText(
						xOffset + this.blockWidth + 20,
						yOffset + 40,
						event[2],
						22,
						COLOR_THEME.purple,
						"left",
						false
					);

					// Save animation ids
					var locationId = event[0] + event[1] + event[2];
					var descriptionId = event[0] + event[1] + event[4];
					if (selected) {
						// Render location and description with a textTyper
						this.locationTextTyper.tryStart(event[3], locationId);
						this.locationTextTyper.position(
							xOffset + this.blockWidth + 20,
							yOffset + 70
						);
						this.descriptionTextTyper.tryStart(event[4], descriptionId);
						this.descriptionTextTyper.position(
							xOffset + this.blockWidth + 20,
							yOffset + 100
						);
					} else {
						this.locationTextTyper.tryStop(locationId);
						this.descriptionTextTyper.tryStop(descriptionId);
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
		this.renderEvents(this.scrollY);
		this.titleTextField.tick(frameData);
		this.locationTextTyper.tick(frameData);
		this.descriptionTextTyper.tick(frameData);
	}
}
