import { FontDrawer } from "./font-drawer.js";
import { FrameData } from "./frame-data.js";
import { CursorWidget } from "./cursor-widget.js";
import { Header } from "./header.js";

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
		this.canvasElements.forEach(ce => ce.tick(frameData));
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

		// Create a FontDrawer
		this.canvasElements.push(new FontDrawer(this.canvas));
		// Follow cursor with an annoying widget
		this.canvasElements.push(new CursorWidget(this.canvas));
		// Website header
		this.canvasElements.push(new Header(this.canvas));

		// Tick clock for 60fps rendering
		if (this.clock) {
			clearInterval(this.clock);
		}
		this.clock = setInterval(this.runClock.bind(this), 1000 / 60);
	}
}
