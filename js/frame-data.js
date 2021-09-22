/*
Useful data to send in canvas element tick events.
*/
export class FrameData {
	constructor(frame, mouseXY) {
		this.frame = frame;
		this.mouseXY = mouseXY;
	}
}
