/*
Useful data to send in canvas element tick events.
*/
export class FrameData {
	constructor(frame, mouseXY, scrollTop) {
		this.frame = frame;
		this.mouseXY = mouseXY;
		this.scrollTop = scrollTop;
	}
}
