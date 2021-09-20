import { NameWidget } from "./name-widget.js";
import { FrameData } from "./frame-data.js";
import { Header } from "./header.js";
import { TextField } from "./text-field.js";
import { LinkWidget } from "./link-widget.js";

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
	}

	// Runs every frame
	runClock() {
		// Clear canvas every frame
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		var frameData = new FrameData(this.frame, this.mouseXY);
		this.canvasElements.forEach((ce) => ce.tick(frameData));
		this.frame++;
	}

	// Track mouse
	saveMouseCoordinates(e) {
		this.mouseXY = [e.x, e.y];
	}

	initialize() {
		// Create a canvas and add it to the HTML body
		if (this.canvas) {
			this.canvas.remove();
		}
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
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
		var linkY = 320;
		var linkX = this.canvas.width/2;
		var linkSize = 30;

		// Github Link
		this.canvasElements.push(
			new LinkWidget(
				this.canvas,
				linkX-75,
				linkY,
				"Github",
				"https://github.com/cdaly333",
				linkSize
			)
		);

		// LinkedIn Link
		this.canvasElements.push(
			new LinkWidget(
				this.canvas,
				linkX+75,
				linkY,
				"LinkedIn",
				"https://www.linkedin.com/in/cjdaly/",
				linkSize
			)
		);

		// Footer message
		this.canvasElements.push(
			new TextField(
				this.canvas,
				"This website was built entirely with HTML5 Canvas",
				this.canvas.width/2,
				this.canvas.height - 50,
				20
			)
		);

		// Tick clock for 40fps rendering
		if (this.clock) {
			clearInterval(this.clock);
		}
		this.clock = setInterval(this.runClock.bind(this), 1000 / 40);
	}
}
