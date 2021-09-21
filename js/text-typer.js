import { COLOR_THEME } from "./color-theme.js";

export class TextTyper {
	constructor(canvas, fontSize, fontColor) {
		this.canvas = canvas;
		this.fontColor = fontColor;
		this.ctx = canvas.getContext("2d");
		this.str = "";
		this.typedString = "";
		this.fontSize = fontSize;
		this.x = -1000;
		this.y = -1000;
		this.enabled = false;
		this.startFrame = -1;
		this.charsPerFrame = 1;
		this.cursorWidth = 10;
		this.blinkPeriod = 30;
	}

	position(x, y) {
		this.x = x;
		this.y = y;
	}

	tryStart(str, id) {
		this.str = str;
		this.id = id;
		this.enabled = true;
	}

	tryStop(id) {
		if (this.id == id) {
			this.enabled = false;
			this.startFrame = -1;
		}
	}

	tick(frameData) {
		if (this.enabled) {
			if (this.startFrame == -1) {
				this.startFrame = frameData.frame;
			}
			this.typedString = this.str.substr(
				0,
				Math.min(
					(frameData.frame - this.startFrame) * this.charsPerFrame,
					this.str.length
				)
			);
		} else {
			return;
		}

		// Format text
		this.ctx.textAlign = "left";
		this.ctx.font = `${this.fontSize}px monospace`;

		// Draw a blinking cursor
		var fullyTyped = this.str == this.typedString;
		if (
			!fullyTyped ||
			(fullyTyped && Math.ceil(frameData.frame / this.blinkPeriod) % 2 == 0)
		) {
			var cursorWidth = fullyTyped ? this.cursorWidth : 2;
			var measuredWidth = this.ctx.measureText(this.typedString).width;
			var width = fullyTyped
				? measuredWidth - this.cursorWidth - 2
				: measuredWidth;
			this.ctx.fillStyle = COLOR_THEME.pink;
			this.ctx.beginPath();
			this.ctx.fillRect(
				this.x + width + 2,
				this.y - this.fontSize + 2,
				cursorWidth,
				this.fontSize * 1.25
			);
		}

		this.ctx.fillStyle = this.fontColor;
		this.ctx.fillText(this.typedString, this.x, this.y);
	}
}
