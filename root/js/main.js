import { FontDrawer } from "./font-drawer.js";
import { FrameData } from "./frame-data.js";

var canvas = null;
var ctx = null;
var clock = null;
var canvasElements = [];
var frame = 0;
var mouseCoordinates = [];

// Runs every frame
var runClock = function () {
	// Clear canvas every frame
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var frameData = new FrameData(frame, mouseCoordinates);
	canvasElements.forEach((ce) => ce.tick(frameData));
	frame++;
};

// Track mouse
var saveMouseCoordinates = function (e) {
	mouseCoordinates = [e.x, e.y];
};

var initialize = function () {
	// Create a canvas and add it to the HTML body
	canvas = document.createElement("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);

	// Save the context
	ctx = canvas.getContext("2d");

	// Create a FontDrawer
	var fontDrawer = new FontDrawer(canvas);
	canvasElements.push(fontDrawer);

	// Tick clock for 60fps rendering
	if (clock !== null) {
		clearInterval(clock);
	}
	clock = setInterval(runClock, 1000 / 60);
};

window.onload = initialize;
window.onmousemove = saveMouseCoordinates;
