import * as m from 'mithril'
import {TimelinePromise, Timeline} from '../lib/timeline'
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

	const timeline = Timeline(async (delay, playSound) => {
		// Timeline "Keyframes"
		await delay(750)
		show.title1 = true

		await delay(1500)
		show.title2 = true

		await delay(1500)
		show.title1 = false

		await delay(1000)
		show.title2 = false

		await delay(750)
		show.sound1 = true

		await playSound(sounds.sound1)
		show.sound1 = false
		show.sound2 = true

		await playSound(sounds.sound2)
		show.sound2 = false
	})

	// Return component hooks
	return {
		onremove() {
			timeline.cancel()
		},
		view() {
			return m('.stage', [
				show.title1 && m(fader, {selector: '.title1'}, "This is a Title"),
				show.title2 && m(fader, {selector: '.title2'}, "This is another Title"),
				show.sound1 && m(fader, {selector: '.sound1', duration: '1s'}, "Playing sound one"),
				show.sound2 && m(fader, {selector: '.sound2', duration: '1s'}, "Now playing sound two")
			])
		}
	}
}

export default stage
