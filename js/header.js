import { COLOR_THEME } from "./color-theme.js";
/*
A scrolling message header at the top of the screen.
Also attempts to find user geo information to display as a scrolling message.
*/
export class Header {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.lineY = 30;
		this.lineWidth = 3;
		this.messages = [
			"welcome to my website!",
			"good luck scraping it!",
			"I apologize to mobile users",
			"try dragging around the terminal!",
		];
		this.grabGeo();
		this.configureText();
		this.measureText();
		this.speed = 3;
	}

	measureText() {
		this.totalWidth = this.ctx.measureText(this.getFullString).width;
	}

	grabGeo() {
		fetch("https://ip-api.com/json").then((response) => {
			response.json().then((json) => {
				var city = json.city;
				var region = json.region;
				var zip = json.zip;
				if (city && region && zip) {
					var message = `it appears you are in ${json.city}, ${json.region}, ${json.country}, ${json.zip} - you should use an ad blocker and a VPN!`;
					this.messages.push(message);
					this.measureText();
				}
			});
		});
	}

	configureText() {
		this.ctx.fillStyle = COLOR_THEME.white;
		this.ctx.textAlign = "left";
		this.ctx.font = `20px monospace`;
	}

	getFullString() {
		var fullString = "";
		this.messages.forEach((m) => {
			fullString += m + "                                 ";
		});
		return fullString;
	}

	tick(frameData) {
		// Draw line
		this.ctx.strokeStyle = COLOR_THEME.lines;
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.lineY);
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.lineTo(this.canvas.width, this.lineY);
		this.ctx.stroke();

		this.configureText();
		//Display messages
		this.ctx.fillText(
			this.getFullString(),
			this.totalWidth -
				((frameData.frame * this.speed) %
					(this.totalWidth * 2 + this.canvas.width)),
			this.lineY - 10
		);
	}
}
