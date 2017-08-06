import * as m from 'mithril'

export type TimelinePromise<T> = Promise<T> & {
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

function Delay (canceled: Promise<void>) {
	return (ms: number) => {
		let timer: number | undefined
		canceled.then(() => {
			if (timer != null) {
				clearTimeout(timer)
				timer = undefined
			}
		})
		return new Promise<void>(resolve => {
			timer = setTimeout(
				() => {
					timer = undefined
					requestAnimationFrame(() => {m.redraw()})
					resolve()
				},
				ms
			)
		})
	}
}

function PlaySound (canceled: Promise<void>) {
	return (sound: Howl) => {
		const ms = Math.round(sound.duration() * 1000)
		let timer: number | undefined
		canceled.then(() => {
			if (timer != null) {
				sound.stop()
				clearTimeout(timer)
				timer = undefined
			}
		})
		return new Promise<void>(resolve => {
			sound.play()
			timer = setTimeout(
				() => {
					timer = undefined
					requestAnimationFrame(() => {m.redraw()})
					resolve()
				},
				ms
			)
		})
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
	function delay (ms: number) {
		return Delay(canceled)(ms)
	}
	function playSound (sound: Howl) {
		return PlaySound(canceled)(sound)
	}
	const cp: TimelinePromise<T> = f(delay, playSound, cancel, canceled) as any
	cp.cancel = cancel
	cp.canceled = canceled
	return cp
}
