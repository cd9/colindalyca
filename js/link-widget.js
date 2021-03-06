import { COLOR_THEME } from "./color-theme.js";

/*
Renders a text field and does collision detection and navigation when a click/touch is detected.
*/
export class LinkWidget {
	constructor(canvas, x, y, str, link, fontSize) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.str = str;
		this.link = link;
		this.fontSize = fontSize;
		this.x = x;
		this.y = y;
		this.mouseXY = [0, 0];
		this.configureText();
		this.overlapping = false;

		var measurement = this.ctx.measureText(str);
		this.xStart = x - measurement.width / 2;
		this.xEnd = x + measurement.width / 2;
		this.yStart = y - fontSize * 0.75;
		this.yEnd = y + fontSize * 0.75;

		window.addEventListener("click", this.onClick.bind(this));
	}

	onClick(e) {
		if (this.overlapping) {
			window.open(this.link);
		}
		this.overlapping = false;
	}

	onTouch(e) {
		var touch = e.touches[0];
		this.mouseXY = [touch.pageX, touch.pageY];
		this.checkOverlapping();
		this.onClick();
	}

	configureText() {
		var fontSizeFinal = this.fontSize;
		if (this.overlapping) {
			fontSizeFinal += 2;
			this.ctx.fillStyle = COLOR_THEME.purple;
		} else {
			this.ctx.fillStyle = COLOR_THEME.blue;
		}
		this.ctx.textAlign = "center";
		this.ctx.font = `bold ${fontSizeFinal}px monospace`;
	}

	checkOverlapping() {
		var x = this.mouseXY[0];
		var y = this.mouseXY[1];
		this.overlapping =
			x >= this.xStart && x <= this.xEnd && y >= this.yStart && y <= this.yEnd;
	}

	tick(frameData) {
		this.mouseXY = frameData.mouseXY;
		this.checkOverlapping();
		this.configureText();
		this.ctx.fillText(this.str, this.x, this.y);
	}
}
