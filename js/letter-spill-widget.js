import { COLOR_THEME } from "./color-theme.js";
import { TextField } from "./text-field.js";

/*
Displays blurbs of text in a creative way:
- Each blurb is held as a bunch of letters in a container.
- Highlighting the container will animate a hammer, which will smash the container on click.
- Smashing a container with a hammer will spill letters out onto a floor.
- Letters will then float back into their correct spot in a paragraph.
*/
export class LetterSpillWidget {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.anchorX = canvas.width / 2;
		this.anchorY = 2900;
		this.textOffsetX = -250;
		this.textOffsetY = 500;
		this.mouseXY = [0, 0];

		this.blurbs = [
			[
				"Game Dev",
				[
					"Programming has the potential to be pretty dry, so game dev as a hobby helps",
					"add a bit of color to balance that out.",
					"",
					"I find that it's a pretty satisfying blend of engineering and arts, and I ",
					"also personally find it liberating to be able to express an idea in the",
					"form of something that will be interactive, immersive, and entertaining",
					"for others.",
					"",
					"Over the years, I've published a few games to the Play Store. Most of them",
					"have been taken down since, but I'm constantly working on new projects.",
				],
			],
			[
				"This Website",
				[
					"This website was built entirely in HTML Canvas.",
					"",
					"Why?",
					"",
					"Well for starters, I happen to be more familiar with 2D graphics and game",
					"development than I am with any modern web development framework.",
					"",
					"I also just think it's cool. This website can't be trivially scraped,",
					"and I can implement cool animations and VFX much more easily.",
					"",
					"It's also pretty unique!",
				],
			],
			[
				"Music",
				[
					"I try to listen to a lot of music.",
					"Here's a really short list of some bands I'm into:",
					"",
					"Post Rock: Godspeed You! Black Emperor, Explosions in the Sky",
					"",
					"Post Punk: Parquet Courts, IDLES, Iceage",
					"",
					"Indie Rock: The National, The Strokes, Pavement, The Unicorns",
					"",
					"Indie Folk: The Microphones, Big Thief, Bon Iver, Neutral Milk Hotel",
					"",
					"Art Pop: Angel Olsen, Weyes Blood, Animal Collective",
					"",
					"Hip Hop: Deltron 3030, Danny Brown, Cordae (+ the usual suspects)",
					"",
					"Electronic: The Avalanches, Gorillaz, Daft Punk, Portishead",
				],
			],
		];
		this.blurbOffsets = [
			[-250, 0],
			[0, 0],
			[250, 0],
		];

		this.containerWidth = 100;
		this.containerHeight = 100;
		this.containerLineWidth = 6;
		this.blurbLineHeight = 20;
		this.blurbTitleSize = 20;
		this.blurbLetterSize = 30;
		this.lerpValue = 0.1;

		// State
		this.currentPositions = [];
		this.selectedBlurbIndex = -1;
		this.overlappedBlurbIndex = -1;
		this.spillFrame = 0;

		//Track mouse
		window.addEventListener("click", this.onClick.bind(this));
	}

	onClick() {
		this.selectedBlurbIndex = this.overlappedBlurbIndex;
	}

	getBlurbPoints(i) {
		var x1 = this.anchorX + this.blurbOffsets[i][0] - this.containerWidth / 2;
		var x2 = this.anchorX + this.blurbOffsets[i][0] + this.containerWidth / 2;
		var y1 = this.anchorY + this.blurbOffsets[i][1];
		var y2 = this.anchorY + this.blurbOffsets[i][1] + this.containerHeight;
		return { x1, x2, y1, y2 };
	}

	renderLetters(frameData) {
		for (var i = 0; i < this.blurbs.length; i++) {
			var blurb = this.blurbs[i];
      var blurbPoints = this.getBlurbPoints(i);
 
			// Initialize letter positions
			if (this.currentPositions.length <= i) {
				var letterPositions = [];
				// For each line
				for (var j = 0; j < blurb[1].length; j++) {
					var line = blurb[1][j];
					// For each character in each line
					for (var k = 0; k < line.length; k++) {
						var randX =
							blurbPoints.x1 +
							this.containerLineWidth +
							Math.random() *
								(blurbPoints.x2 - blurbPoints.x1 - 3 * this.containerLineWidth);
						var randY =
							blurbPoints.y1 +
							this.containerLineWidth +
							(0.25 + Math.random() * 0.75) *
								(blurbPoints.y2 - blurbPoints.y1 - 3 * this.containerLineWidth);
						var randRotation = Math.random() * 360;
						letterPositions.push({
							letter: line[k],
							x: randX,
							y: randY,
							rotation: randRotation,
						});
					}
				}
				this.currentPositions.push(letterPositions);
			}

			if (i == this.selectedBlurbIndex) {
				// Get width of a single character
				var singleWidth = new TextField(
					this.canvas,
					"a",
					0,
					0,
					this.blurbLetterSize,
					COLOR_THEME.white
				).getWidth();

				// For each line
				var letterIndex = 0;
				for (var j = 0; j < blurb[1].length; j++) {
					var line = blurb[1][j];

					// For each character in each line
					for (var k = 0; k < line.length; k++) {
						var letterPosition = this.currentPositions[i][letterIndex];
						var targetX = (k + 0.5) * singleWidth + this.anchorX + this.textOffsetX;
						var targetY = j * this.blurbLineHeight + this.anchorY + this.textOffsetY;
						this.currentPositions[i][letterIndex] = {
							letter: line[k],
							x:
								letterPosition.x +
								(targetX - letterPosition.x) * this.lerpValue,
							y:
								letterPosition.y +
								(targetY - letterPosition.y) * this.lerpValue,
							rotation: letterPosition.rotation * (1-this.lerpValue),
						};
						letterIndex++;
					}
				}
			}

			// Render letters
			var letterPositions = this.currentPositions[i];
			for (var j = 0; j < letterPositions.length; j++) {
				var letterPosition = letterPositions[j];
				new TextField(
					this.canvas,
					letterPosition.letter,
					letterPosition.x,
					letterPosition.y,
					this.blurbLetterSize,
					COLOR_THEME.white,
					"center",
					letterPosition.rotation
				).tick(frameData);
			}
		}
	}

	renderTitle(frameData) {
		new TextField(
			this.canvas,
			"Blurbs",
			this.anchorX,
			this.anchorY - 75,
			30,
			COLOR_THEME.blue,
			"center"
		).tick(frameData);
	}

	renderContainers(frameData) {
		for (var i = 0; i < this.blurbs.length; i++) {
			var blurb = this.blurbs[i];
			// Top of container
			this.ctx.strokeStyle = COLOR_THEME.lines;
			this.ctx.lineWidth = this.containerLineWidth;
			var blurbPoints = this.getBlurbPoints(i);
			this.ctx.beginPath();
			this.ctx.moveTo(blurbPoints.x1, blurbPoints.y2);
			this.ctx.lineTo(blurbPoints.x1, blurbPoints.y1);
			this.ctx.lineTo(blurbPoints.x2, blurbPoints.y1);
			this.ctx.lineTo(blurbPoints.x2, blurbPoints.y2);
			if (this.selectedBlurbIndex !== i) {
				this.ctx.lineTo(
					blurbPoints.x1 - this.containerLineWidth / 2,
					blurbPoints.y2
				);
			} else {
				//TODO
			}
			this.ctx.stroke();
			new TextField(
				this.canvas,
				blurb[0],
				blurbPoints.x1 + (blurbPoints.x2 - blurbPoints.x1) / 2,
				blurbPoints.y1 - 10,
				this.blurbTitleSize,
				COLOR_THEME.purple,
				"center"
			).tick(frameData);
		}
	}

	checkOverlaps() {
		this.overlappedBlurbIndex = -1;
		for (var i = 0; i < this.blurbs.length; i++) {
			var blurbPoints = this.getBlurbPoints(i);
			var mx = this.mouseXY[0];
			var my = this.mouseXY[1];
			if (
				mx >= blurbPoints.x1 &&
				mx <= blurbPoints.x2 &&
				my >= blurbPoints.y1 &&
				my <= blurbPoints.y2
			) {
				this.overlappedBlurbIndex = i;
			}
		}
	}

	tick(frameData) {
		// Update mouse
		this.mouseXY = frameData.mouseXY;
		this.checkOverlaps();
		this.renderTitle();
		this.renderContainers(frameData);
		this.renderLetters(frameData);
	}
}
