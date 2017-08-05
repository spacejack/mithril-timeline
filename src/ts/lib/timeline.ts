export type CancelablePromise<T> = Promise<T> & {
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
		let timer: number
		canceled.then(() => {
			clearTimeout(timer)
		})
		return new Promise<void>(resolve => {
			timer = setTimeout(resolve, ms)
		})
	}
}

export function Timeline<T>(
	f: (
		delay: (ms: number) => Promise<void>,
		cancel: () => void,
		canceled: Promise<void>
	) => Promise<T>
) {
	const {cancel, canceled} = CancelToken()
	function delay (ms: number) {
		return Delay(canceled)(ms)
	}
	const cp: CancelablePromise<T> = f(delay, cancel, canceled) as any
	cp.cancel = cancel
	cp.canceled = canceled
	return cp
}
