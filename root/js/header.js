export class Header {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.lineY = 50;
		this.lineWidth = 4;
		this.messages = ["welcome to my website!", "good luck scraping it!"];
		this.grabGeo();
		this.configureText();
		this.measureText();
		this.speed = 3;
	}

	measureText() {
		this.totalWidth = this.ctx.measureText(this.getFullString).width;
	}

	grabGeo() {
		fetch("http://ip-api.com/json").then((response) => {
			response.json().then((json) => {
				var message = `it appears you are in ${json.city}, ${json.region}, ${json.country}, ${json.zip} - you should use an ad blocker and a VPN!`;
				this.messages.push(message);
				this.measureText();
			});
		});
	}

	configureText() {
		this.ctx.fillStyle = "black";
		this.ctx.textAlign = "left";
		this.ctx.font = `bold 25px consolas`;
	}

	getFullString() {
		var fullString = "";
		this.messages.forEach((m) => {
			fullString += m + "            ";
		});
		return fullString;
	}

	tick(frameData) {
		// Draw line
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
			this.lineY - 15
		);
	}
}
