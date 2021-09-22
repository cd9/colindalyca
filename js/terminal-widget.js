import { COLOR_THEME } from "./color-theme.js";
import { TextField } from "./text-field.js";
import { TextTyper } from "./text-typer.js";

/*
Renders a fake terminal that opens a vim session and types out welcome messages
*/
export class TerminalWidget {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		// Window
		this.windowWidth = 800;
		this.windowHeight = 450;
		this.windowX = this.canvas.width / 2 - this.windowWidth / 2;
		this.windowY = 325;
		this.outlineWidth = 3;
		this.windowBarWidth = 20;
		this.windowBarFontSize = 16;
		this.windowBarString = "cdaly@cdalyca: ~";
		this.windowMargin = 5;

		// Terminal
		this.fontSize = 17;
		this.lineGap = 1;
		this.totalLines = 23;
		this.welcomeMessage = [
			"Welcome to my website!",
			"My name is Colin, I'm a Software Engineer from Canada.",
			"",
			"I'm also a recent graduate from the University of Waterloo,",
			"  where I studied Computer Science (Co-op).",
			"",
			"I've worked all across the Bay Area and New York,",
			"  at companies like Google, Splunk, and Yext.",
			"",
			"I'm also a game developer and a music enthusiast.",
			"",
			"This website was created entirely with HTML Canvas and no external libraries.",
			"",
			"Want to get in touch? Drop me a line at dalyco884@gmail.com.",
			"",
			"Thanks for visiting my website! ",
			"                                      \\      ^..^",
			"                                       \\_____/\\_\\",
			"                                       /\\   /\\   -ARF!",
			"                                      /  \\ /  \\ "
		];

		this.vimTextFields = [];
		this.vimTextTypers = [];
		this.animationFrame = 0;
	}

	// Renders the terminal window
	renderWindow(frameData) {
		this.ctx.strokeStyle = COLOR_THEME.lines;
		this.ctx.fillStyle = COLOR_THEME.dark;
		this.ctx.lineWidth = this.outlineWidth;
		this.ctx.beginPath();
		this.ctx.fillRect(
			this.windowX,
			this.windowY,
			this.windowWidth,
			this.windowHeight
		);
		this.ctx.strokeRect(
			this.windowX,
			this.windowY,
			this.windowWidth,
			this.windowHeight
		);
		this.ctx.fillStyle = COLOR_THEME.lines;
		this.ctx.fillRect(
			this.windowX,
			this.windowY,
			this.windowWidth,
			this.windowBarWidth
		);
		if (!this.barTextField) {
			this.barTextField = new TextField(
				this.canvas,
				this.windowBarString,
				this.windowX + this.outlineWidth,
				this.windowY + 14,
				this.windowBarFontSize,
				COLOR_THEME.dark,
				"left"
			);
		}
		this.barTextField.tick(frameData);
	}

	// Renders the vim background and hint footer
	renderVimBackground(x, y, cursorX, cursorY, insert, nonBlankLines) {
		var buildTextField = function (str, lineNumber, color) {
			return new TextField(
				this.canvas,
				str,
				x,
				y + (this.fontSize + this.lineGap) * lineNumber,
				this.fontSize,
				color,
				"left"
			);
		}.bind(this);

		if (this.vimTextFields.length == 0) {
			for (var i = 0; i < this.totalLines; i++) {
				this.vimTextFields.push(buildTextField("~", i, COLOR_THEME.blue));
			}
		}

		for (var i = 0; i < nonBlankLines; i++) {
			this.vimTextFields[i] = buildTextField("", i, COLOR_THEME.blue);
		}

		// Last line
		var lastIndex = this.vimTextFields.length - 1;
		var footer = insert
			? `-- INSERT --                                                 ${cursorY},${cursorX}     All`
			: `"welcome-message.txt" [New File]                             0,0-1     All`;
		this.vimTextFields[lastIndex] = buildTextField(
			footer,
			lastIndex,
			COLOR_THEME.white
		);
	}

	// Sequentially types out all welcome message strings
	renderVimAnimation(frameData) {
		var frame = this.animationFrame;
		var xOffset = this.windowX + this.windowMargin;
		var yOffset = this.windowY + this.windowBarWidth * 2;
		var nonBlankLines = 0;
		var cursorX = 0;
		var cursorY = 1;

		if (frame == 0) {
			// FRAME 0
			// Initialize prompt text field
			var promptString = "cjdaly@cjdalyca:~#   ";
			this.promptTextField = new TextField(
				this.canvas,
				promptString,
				xOffset,
				yOffset,
				this.fontSize,
				COLOR_THEME.terminalGreen,
				"left"
			);
			this.promptWidth = this.ctx.measureText(promptString).width;
		} else if (frame < 120) {
			// FRAMES 1-119
			// Render prompt text field
			this.promptTextField.tick(frameData);

			// FRAME 60
			// Render prompt input
			if (frame == 60) {
				this.promptTextTyper = new TextTyper(
					this.canvas,
					this.fontSize,
					COLOR_THEME.white,
					false
				);
				this.promptTextTyper.position(xOffset + this.promptWidth, yOffset);
				this.promptTextTyper.tryStart("vim welcome-message.txt", "init");
			}
			this.promptTextTyper?.tick(frameData);
		} else {
			// FRAMES 120+
			if (frame == 120) {
				// FRAME 120
				this.promptTextTyper.tryStop("init");
			} else if (frame == 160) {
				// FRAME 160
				// Spawn all TextTypers
				var numMessages = this.welcomeMessage.length;
				for (var i = 0; i < numMessages; i++) {
					this.vimTextTypers.push(
						new TextTyper(
							this.canvas,
							this.fontSize,
							COLOR_THEME.white,
							i == numMessages - 1
						)
					);
				}
			} else if (frame >= 160) {
				// Position all TextTypers
				for (var i = 0; i < this.welcomeMessage.length; i++) {
					var typer = this.vimTextTypers[i];
					typer.position(xOffset, yOffset + i * (this.fontSize + this.lineGap));
				}

				// Determine which message to type out
				var charsTyped = frame - 160;
				var currentMessageIndex = 0;
				var currentMessage = this.welcomeMessage[currentMessageIndex];
				while (
					charsTyped > currentMessage.length &&
					currentMessageIndex + 1 < this.welcomeMessage.length
				) {
					charsTyped -= currentMessage.length;
					currentMessageIndex += 1;
					currentMessage = this.welcomeMessage[currentMessageIndex];
				}

				// Type out the current message
				this.vimTextTypers[currentMessageIndex].tryStart(
					currentMessage,
					currentMessage
				);

				// Cursor index for vim footer
				cursorX =
					currentMessageIndex == this.welcomeMessage.length - 1
						? currentMessage.length - 1
						: charsTyped - 1;
				cursorY = currentMessageIndex;
				nonBlankLines = cursorY + 1;
			}

			this.renderVimBackground(
				xOffset,
				yOffset,
				cursorX,
				cursorY,
				frame > 160,
				nonBlankLines
			);
		}
	}

	tick(frameData) {
		this.renderWindow(frameData);
		this.vimTextFields.forEach((t) => t.tick(frameData));
		this.vimTextTypers.forEach((t) => t.tick(frameData));
		this.renderVimAnimation(frameData);
		this.animationFrame++;
	}
}
