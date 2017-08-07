import * as m from 'mithril'
import * as stream from 'mithril/stream'
import {Stream} from 'mithril/stream'
import {Timeline} from '../lib/timeline'
import {sounds} from '../lib/audio'
import fader from './fader'

// Immutable timeline state object
interface State {
	readonly title1: boolean
	readonly title2: boolean
	readonly sound1: boolean
	readonly sound2: boolean
}

const stage: m.FactoryComponent<{}> = function stage() {
	// show/hide flags
	const state: Stream<State> = stream({
		title1: false,
		title2: false,
		sound1: false,
		sound2: false
	})
	// Redraw on state changes
	state.map(s => {m.redraw()})

	let paused = false
	let completed = false

	const timeline = Timeline(async (delay, playSound) => {
		// Timeline "Keyframes"
		await delay(750)
		state({...state(), title1: true})

		await delay(1500)
		state({...state(), title2: true})

		await delay(1500)
		state({...state(), title1: false})

		await delay(1000)
		state({...state(), title2: false})

		await delay(750)
		state({...state(), sound1: true})

		await playSound(sounds.sound1)
		state({...state(), sound1: false, sound2: true})

		await playSound(sounds.sound2)
		state({...state(), sound2: false})
	})

	timeline.then(() => {
		completed = true
		m.redraw()
	})

	// Return component hooks
	return {
		onremove() {
			timeline.cancel()
		},
		view() {
			const s = state()
			return m('.stage', [
				s.title1 && m(fader, {selector: '.title1'}, "This is a Title"),
				s.title2 && m(fader, {selector: '.title2'}, "This is another Title"),
				s.sound1 && m(fader, {selector: '.sound1', duration: '1s'}, "Playing sound one"),
				s.sound2 && m(fader, {selector: '.sound2', duration: '1s'}, "Now playing sound two"),
				!completed && m('button.btn-pause',
					{
						onclick() {
							paused = !paused
							if (paused) timeline.pause()
							else timeline.resume()
						}
					},
					paused ? "resume" : "pause"
				)
			])
		}
	}
}

export default stage
