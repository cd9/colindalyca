import { NameWidget } from "./name-widget.js";
import { FrameData } from "./frame-data.js";
import { Header } from "./header.js";
import { TextField } from "./text-field.js";
import { LinkWidget } from "./link-widget.js";
import { TimelineWidget } from "./timeline-widget.js";
import { COLOR_THEME } from "./color-theme.js";

export class CanvasManager {
	constructor() {
		this.canvas = null;
		this.ctx = null;
		this.clock = null;
		this.canvasElements = [];
		this.frame = 0;
		this.mouseXY = [];

		window.onload = this.initialize.bind(this);
		window.onresize = this.initialize.bind(this);
		window.onmousemove = this.saveMouseCoordinates.bind(this);
		this.saveMouseCoordinates({ pageX: window.innerWidth / 2, pageY: 700 });
	}

	// Runs every frame
	runClock() {
		// Clear canvas every frame
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = COLOR_THEME.background;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		var frameData = new FrameData(this.frame, this.mouseXY);
		this.canvasElements.forEach((ce) => ce.tick(frameData));
		this.frame++;
	}

	// Track mouse
	saveMouseCoordinates(e) {
		this.mouseXY = [e.pageX, e.pageY];
	}

	initialize() {
		// Create a canvas and add it to the HTML body
		if (this.canvas) {
			this.canvas.remove();
		}
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = Math.max(window.innerHeight, 2200);
		document.body.appendChild(this.canvas);

		// Save the context
		this.ctx = this.canvas.getContext("2d");

		// Reset canvas elements
		this.canvasElements = [];

		// Create a NameWidget
		this.canvasElements.push(new NameWidget(this.canvas));

		// Website header
		this.canvasElements.push(new Header(this.canvas));

		// Link Bar
		var linkY = 285;
		var linkX = this.canvas.width / 2;
		var linkSize = 25;

		// Github Link
		this.canvasElements.push(
			new LinkWidget(
				this.canvas,
				linkX - 75,
				linkY,
				">Github",
				"https://github.com/cdaly333",
				linkSize
			)
		);

		// LinkedIn Link
		this.canvasElements.push(
			new LinkWidget(
				this.canvas,
				linkX + 75,
				linkY,
				">LinkedIn",
				"https://www.linkedin.com/in/cjdaly/",
				linkSize
			)
		);

		// Source Code Link
		this.canvasElements.push(
			new LinkWidget(
				this.canvas,
				linkX,
				this.canvas.height - 10,
				"Source Code",
				"https://github.com/cdaly333/colindalyca",
				12
			)
		);

		this.canvasElements.push(new TimelineWidget(this.canvas));

		// Footer message
		this.canvasElements.push(
			new TextField(
				this.canvas,
				"This website was built from scratch using native HTML5 Canvas :^)",
				this.canvas.width / 2,
				this.canvas.height - 30,
				16,
				COLOR_THEME.lightOrange
			)
		);

		// Tick clock for 40fps rendering
		if (this.clock) {
			clearInterval(this.clock);
		}
		this.clock = setInterval(this.runClock.bind(this), 1000 / 40);
	}
}
