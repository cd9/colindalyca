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
		this.anchorX = canvas.getWidth() / 2;
		this.anchorY = 5100;
		this.textOffsetX = -460;
		this.textOffsetY = 200;
		this.mouseXY = [0, 0];

		this.blurbs = [
			[
				"Game Dev",
				[
					"Programming has the potential to be pretty dry, so game dev as a hobby",
					"helps add a bit of color to balance that out.",
					"",
					"I find that it's a pretty satisfying blend of engineering and arts,",
					"and I also personally find it liberating to be able to express an idea",
					"in the form of something that will be interactive, immersive, and ",
					"(hopefully) entertaining for others.",
					"",
					"Over the years, I've published a few games to the Play Store. I've ",
					"taken most of them down since, but I'm usually working on something.",
				],
			],
			[
				"Website",
				[
					"This website was built entirely in HTML Canvas.",
					"",
					"Why?",
					"",
					"Well for starters, I happen to be more familiar with 2D graphics and",
					"game development than I am with any modern web development framework.",
					"",
					"It's also pretty unique!",
					"",
					"This website can't be trivially scraped,",
					"and I can implement novel animations and VFX easily.",
					"",
					"Take this effect for example!",
					"",
					"Mostly though, I just think it's cool.",
				],
			],
			[
				"Music",
				[
					"I try to listen to a lot of music.",
					"",
					"Here's a short list of some bands I'm into:",
					"",
					"Post Rock:   Godspeed You! Black Emperor, Explosions in the Sky",
					"             Fishmans, Mouse on the Keys",
					"             Black Country, New Road",
					"",
					"Post Punk:   Parquet Courts, IDLES, Iceage",
					"",
					"Indie Rock:  The National, The Strokes, Pavement, The Unicorns",
					"             Arcade Fire, Modest Mouse, Car Seat Headrest",
					"",
					"Indie Folk:  The Microphones / Mount Eerie / any Phil Elverum project",
					"             Neutral Milk Hotel / any Jeff Mangum project",
					"             Big Thief, Bon Iver",
					"",
					"Art Pop:     Angel Olsen, Weyes Blood, Animal Collective",
					"",
					"Hip Hop:     Injury Reserve, Deltron 3030, Danny Brown, Kendrick",
					"             A Tribe Called Quest, Kanye, Milo, Tyler, Frank Ocean",
					"             Cordae, the usual suspects",
					"",
					"Electronic:  The Avalanches, Gorillaz, Daft Punk, Portishead",
					"",
					"I recommend any and all of the above artists.",
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
		this.blurbLineHeight = 35;
		this.blurbTitleSize = 20;
		this.blurbLetterSize = 24;
		this.lerpValue = 0.15;

		// State
		this.currentPositions = null;
		this.targetPositions = [];
		this.currentIndexToAnimate = [];
		this.lettersPerFrame = 1.5;
		this.selectedBlurbIndex = 2;
		this.overlappedBlurbIndex = -1;
		this.spillFrame = 0;
		this.mouseThreshold = 3000;
		this.yDelta = 15;

		//Track mouse
		window.addEventListener("click", this.onClick.bind(this));
	}

	onClick() {
		this.selectedBlurbIndex = this.overlappedBlurbIndex;
		if (this.selectedBlurbIndex != -1) {
			this.currentPositions = null;
		}
	}

	getBlurbPoints(i) {
		var x1 = this.anchorX + this.blurbOffsets[i][0] - this.containerWidth / 2;
		var x2 = this.anchorX + this.blurbOffsets[i][0] + this.containerWidth / 2;
		var y1 = this.anchorY + this.blurbOffsets[i][1];
		var y2 = this.anchorY + this.blurbOffsets[i][1] + this.containerHeight;
		return { x1, x2, y1, y2 };
	}

	renderLetters(frameData) {
		if (this.selectedBlurbIndex == -1) {
			return;
		}
		var blurb = this.blurbs[this.selectedBlurbIndex];
		var blurbPoints = this.getBlurbPoints(this.selectedBlurbIndex);

		// Initialize letter positions
		if (this.currentPositions === null) {
			this.currentIndexToAnimate = 0;
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
			this.currentPositions = letterPositions;

			// Set target positions
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
					this.targetPositions[letterIndex] = {
						x: (k + 0.5) * singleWidth + this.anchorX + this.textOffsetX,
						y: j * this.blurbLineHeight + this.anchorY + this.textOffsetY,
						rotation: 0,
					};
					letterIndex++;
				}
			}
		}

		// Gradually animate all letters
		this.currentIndexToAnimate += this.lettersPerFrame;

		// Render letters
		for (var j = this.currentPositions.length - 1; j >= 0; j--) {
			var position = this.currentPositions[j];
			var target = this.targetPositions[j];
			var color = COLOR_THEME.white;
			if (!this.doPositionsMatch(position, target, 5)) {
				color = COLOR_THEME.grey;
			}
			if (
				!this.doPositionsMatch(position, target) &&
				this.currentIndexToAnimate >= j
			) {
				position.x = position.x + (target.x - position.x) * this.lerpValue;
				position.y = position.y + (target.y - position.y) * this.lerpValue;
				position.rotation =
					position.rotation +
					(target.rotation - position.rotation) * this.lerpValue;
			}

			var distanceSquaredFromMouse =
				Math.pow(this.mouseXY[0] - position.x, 2) +
				Math.pow(this.mouseXY[1] - position.y, 2);
			var yPos = position.y;
			if (distanceSquaredFromMouse < this.mouseThreshold) {
				yPos -=
					(1 - distanceSquaredFromMouse / this.mouseThreshold) * this.yDelta;
			}

			new TextField(
				this.canvas,
				position.letter,
				position.x,
				yPos,
				this.blurbLetterSize,
				color,
				"center",
				position.rotation
			).tick(frameData);
		}
	}

	doPositionsMatch(p1, p2, threshold) {
		var t = 0.5;
		if (threshold) {
			t = threshold;
		}
		return Math.abs(p1.x - p2.x) < t && Math.abs(p1.y - p2.y) < t;
	}

	renderTitle(frameData) {
		new TextField(
			this.canvas,
			"Blurbs",
			this.anchorX,
			this.anchorY - 50,
			40,
			COLOR_THEME.green,
			"center"
		).tick(frameData);
	}

	renderContainers(frameData) {
		for (var i = 0; i < this.blurbs.length; i++) {
			var blurb = this.blurbs[i];
			// Top of container
			this.ctx.strokeStyle = COLOR_THEME.lines;
			var lineWidth = this.containerLineWidth;
			if (i === this.overlappedBlurbIndex) {
				lineWidth *= 1.5;
			}
			this.ctx.lineWidth = lineWidth;
			var blurbPoints = this.getBlurbPoints(i);
			this.ctx.beginPath();
			this.ctx.moveTo(blurbPoints.x1, blurbPoints.y2);
			this.ctx.lineTo(blurbPoints.x1, blurbPoints.y1);
			this.ctx.lineTo(blurbPoints.x2, blurbPoints.y1);
			this.ctx.lineTo(blurbPoints.x2, blurbPoints.y2);
			if (this.selectedBlurbIndex !== i) {
				this.ctx.lineTo(blurbPoints.x1 - lineWidth / 2, blurbPoints.y2);
			} else {
				//TODO
			}
			this.ctx.stroke();
			new TextField(
				this.canvas,
				blurb[0],
				blurbPoints.x1 + (blurbPoints.x2 - blurbPoints.x1) / 2,
				blurbPoints.y1 + this.containerHeight / 2,
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
		if (frameData.scrollTop + window.innerHeight <= this.anchorY - 100) {
			return;
		}
		this.mouseXY = frameData.mouseXY;
		this.checkOverlaps();
		this.renderTitle();
		this.renderContainers(frameData);
		this.renderLetters(frameData);
	}
}
