export type EmitterCallback = () => void

export interface Emitter {
	onemit(cb: EmitterCallback): void
	emit(): void
}

export function Emitter(): Emitter {
	const callbacks: (EmitterCallback)[] = []
	return {
		onemit(cb: EmitterCallback) {
			callbacks.push(cb)
		},
		emit() {
			for (let i = 0; i < callbacks.length; ++i) {
				callbacks[i]()
			}
		}
	}
}

export type TimelinePromise<T> = Promise<T> & {
	pause(): void
	resume(): void
	cancel(): void
	canceled: Promise<void>
}

function CancelToken() {
	let cancel: () => void = undefined as any
	const canceled = new Promise<void>(resolve => {
		cancel = resolve
	})
	return {cancel, canceled}
}

function Delay<T,U> (canceled: Promise<void>, paused: Emitter, resumed: Emitter) {
	return (ms: number) => {
		let timer: number | undefined
		let tStart = 0
		let tPaused = 0
		let tRemain: number | undefined
		let complete: () => void

		canceled.then(() => {
			if (timer != null) {
				clearTimeout(timer)
				timer = undefined
			}
		})

		paused.onemit(() => {
			if (tRemain == null && timer != null) {
				tPaused = Date.now()
				tRemain = ms - (tPaused - tStart)
				clearTimeout(timer)
				timer = undefined
			}
		})

		resumed.onemit(() => {
			if (tRemain != null) {
				const t = Date.now()
				// Must shift start time forward
				tStart += t - tPaused
				timer = setTimeout(
					() => {
						timer = undefined
						complete()
					},
					tRemain
				)
				tRemain = undefined
			}
		})

		const promise = new Promise<void>(resolve => {
			complete = resolve
		})

		tStart = Date.now()
		timer = setTimeout(
			() => {
				timer = undefined
				complete()
			},
			ms
		)

		return promise
	}
}

function PlaySound (canceled: Promise<void>, paused: Emitter, resumed: Emitter) {
	return (sound: Howl) => {
		const ms = Math.round(sound.duration() * 1000)
		let timer: number | undefined
		let tStart = 0
		let tPaused = 0
		let tRemain: number | undefined
		let complete: () => void

		canceled.then(() => {
			if (timer != null) {
				sound.stop()
				clearTimeout(timer)
				timer = undefined
			}
			if (tRemain != null) {
				// Reset playhead of paused sound
				sound.stop()
				tRemain = undefined
			}
		})

		paused.onemit(() => {
			if (tRemain == null && timer != null) {
				sound.pause()
				tPaused = Date.now()
				tRemain = ms - (tPaused - tStart)
				clearTimeout(timer)
				timer = undefined
			}
		})

		resumed.onemit(() => {
			if (tRemain != null) {
				const t = Date.now()
				// Must shift start time forward
				tStart += t - tPaused
				sound.play()
				timer = setTimeout(
					() => {
						timer = undefined
						complete()
					},
					tRemain
				)
				tRemain = undefined
			}
		})

		const promise = new Promise<void>(resolve => {
			complete = resolve
		})

		tStart = Date.now()
		sound.play()
		timer = setTimeout(
			() => {
				timer = undefined
				complete()
			},
			ms
		)

		return promise
	}
}

export function Timeline<T>(
	f: (
		delay: (ms: number) => Promise<void>,
		playSound: (sound: Howl) => Promise<void>,
		cancel: () => void,
		canceled: Promise<void>
	) => Promise<T>
) {
	const {cancel, canceled} = CancelToken()
	const pauseEmitter = Emitter()
	const resumeEmitter = Emitter()
	function delay (ms: number) {
		return Delay(canceled, pauseEmitter, resumeEmitter)(ms)
	}
	function playSound (sound: Howl) {
		return PlaySound(canceled, pauseEmitter, resumeEmitter)(sound)
	}
	const cp: TimelinePromise<T> = f(delay, playSound, cancel, canceled) as any
	cp.pause = pauseEmitter.emit
	cp.resume = resumeEmitter.emit
	cp.cancel = cancel
	cp.canceled = canceled
	return cp
}
