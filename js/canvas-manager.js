import { NameWidget } from "./name-widget.js";
import { FrameData } from "./frame-data.js";
import { Header } from "./header.js";
import { TextField } from "./text-field.js";
import { LinkWidget } from "./link-widget.js";
import { TimelineWidget } from "./timeline-widget.js";
import { COLOR_THEME } from "./color-theme.js";
import { RainWidget } from "./rain-widget.js";
import { TerminalWidget } from "./terminal-widget.js";

/*
Sets up a canvas in the DOM.
Manages layout and rendering.
*/
export class CanvasManager {
	constructor() {
		this.canvas = null;
		this.ctx = null;
		this.clock = null;
		this.canvasElements = [];
		this.frame = 0;
		this.mouseXY = [];
		this.oldWidth = 0;
		this.oldHeight = 0;

		window.onload = this.onPageChanged.bind(this);
		window.onresize = this.onPageChanged.bind(this);
		window.onmousemove = this.saveMouseCoordinates.bind(this);
		this.saveMouseCoordinates({
			pageX: document.body.clientWidth / 2,
			pageY: 700,
		});
	}

	onPageChanged() {
		if (
			this.oldWidth !== document.body.clientWidth ||
			this.oldHeight !== document.body.clientHeight
		) {
			this.oldWidth = document.body.clientWidth;
			this.oldHeight = document.body.clientHeight;
			this.initialize();
		}
	}

	// Runs every frame
	runClock() {
		// Clear canvas every frame
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.beginPath();

		// Fill background
		this.ctx.fillStyle = COLOR_THEME.background;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Call tick event on every canvas element
		var frameData = new FrameData(this.frame, this.mouseXY);
		this.canvasElements.forEach((ce) => ce.tick(frameData));
		this.frame++;
		console.log(document.body.clientWidth);
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
		this.canvas.height = Math.max(document.body.clientHeight, 2800);
		this.canvas.width = document.body.clientWidth;
		document.body.appendChild(this.canvas);

		// Save the context
		this.ctx = this.canvas.getContext("2d");

		// Reset canvas elements
		this.canvasElements = [];

		// Website header
		this.canvasElements.push(new Header(this.canvas));

		// Rain Widget
		this.canvasElements.push(new RainWidget(this.canvas));

		// Name Widget
		this.canvasElements.push(new NameWidget(this.canvas));

		// Terminal Widget
		this.canvasElements.push(new TerminalWidget(this.canvas));

		// Timeline Widget
		this.canvasElements.push(new TimelineWidget(this.canvas));

		// Link Bar
		var linkY = 295;
		var linkX = this.canvas.width / 2;
		var linkSize = 25;

		// Github Link
		this.canvasElements.push(
			new LinkWidget(
				this.canvas,
				linkX - 75,
				linkY,
				">Github",
				"https://github.com/cd9",
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

		// Footer message
		this.canvasElements.push(
			new TextField(
				this.canvas,
				"This website was build entirely with HTML Canvas",
				this.canvas.width / 2,
				this.canvas.height - 30,
				16,
				COLOR_THEME.purple
			)
		);

		// Initialize clock for 50fps rendering
		if (this.clock) {
			clearInterval(this.clock);
		}
		this.clock = setInterval(this.runClock.bind(this), 1000 / 50);
	}
}
