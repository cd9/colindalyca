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
		window.addEventListener("touchstart", this.onTouch.bind(this));
	}

	onClick(e) {
		if (this.overlapping) {
			window.open(this.link);
		}
	}

	onTouch(e){
		var touch = e.touches[0]
		this.mouseXY = [touch.pageX, touch.pageY];
		this.checkOverlapping();
		this.onClick();
	}

	configureText() {
		var fontSizeFinal = this.fontSize;
		if (this.overlapping) {
			fontSizeFinal += 2;
			this.ctx.fillStyle = "blue";
		} else {
			this.ctx.fillStyle = "black";
		}
		this.ctx.textAlign = "center";
		this.ctx.font = `bold ${fontSizeFinal}px consolas`;
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
