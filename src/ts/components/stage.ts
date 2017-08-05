import * as m from 'mithril'
import {CancelablePromise, Timeline} from '../lib/timeline'
import {sounds} from '../lib/audio'
import fader from './fader'

const stage: m.FactoryComponent<{}> = function stage() {
	// show/hide flags
	const show = {
		title1: false,
		title2: false,
		sound1: false,
		sound2: false
	}
	let timeline: CancelablePromise<void> | undefined

	function runTimeline (dom: HTMLElement) {
		timeline = Timeline(async (delay) => {
			// Timeline "Keyframes"
			await delay(750)
			show.title1 = true
			m.redraw()

			await delay(1500)
			show.title2 = true
			m.redraw()

			await delay(1500)
			show.title1 = false
			m.redraw()

			await delay(1000)
			show.title2 = false
			m.redraw()

			await delay(750)
			const dur1 = sounds.sound1.duration() * 1000
			sounds.sound1.play()
			show.sound1 = true
			m.redraw()

			await delay(dur1)
			show.sound1 = false
			const dur2 = sounds.sound2.duration() * 1000
			sounds.sound2.play()
			show.sound2 = true
			m.redraw()

			await delay(dur2)
			show.sound2 = false
			m.redraw()
		})

		timeline.canceled.then(() => {
			// Cancel anything that may need to be canceled.
			// This is a bit ugly because we may not be sure...
			sounds.sound1.stop()
			sounds.sound2.stop()
			timeline = undefined
		})

		timeline.then(() => {
			timeline = undefined
		})
	}

	function cancelTimeline() {
		timeline && timeline.cancel()
	}

	function render() {
		return m('.stage', [
			show.title1 && m('.title1', "This is a Title"),
			show.title2 && m('.title2', "This is another Title"),
			show.sound1 && m('.sound1', "Playing sound one"),
			show.sound2 && m('.sound2', "Now playing sound two")
		])
		// Why isn't this working??
		/* return m('.stage', [
			showTitle1 && m(fader, {selector: '.title1'}, "This is a Title"),
			showTitle2 && m(fader, {selector: '.title2'}, "This is another Title"),
			showSound1 && m(fader, {selector: '.sound1', duration: '1s'}, "Playing sound one"),
			showSound2 && m(fader, {selector: '.sound2', duration: '1s'}, "Now playing sound two")
		]) */
	}

	// Return component hooks
	return {
		oncreate: (vnode) => {
			runTimeline(vnode.dom as HTMLElement)
		},
		onremove: cancelTimeline,
		view: render
	}
}

export default stage
