/** Wait for a specified number of frames */
export function waitFrames (frames: number): Promise<number> {
	if (!frames || frames < 1) {
		return Promise.resolve(frames)
	}
	return new Promise(resolve => {
		let count = 0
		function loop() {
			if (count >= frames) {
				resolve(frames)
			} else {
				++count
				requestAnimationFrame(loop)
			}
		}
		loop()
	})
}
