import {createElement as h, Component} from 'react'
import {Timeline, TimelinePromise} from '../lib/timeline'
import {sounds} from '../lib/audio'
import fader from './fader'

// Immutable timeline state object
interface State {
	readonly title1: boolean
	readonly title2: boolean
	readonly sound1: boolean
	readonly sound2: boolean
	readonly completed: boolean
	readonly paused: boolean
}

export default class Stage extends Component<{},State> {
	protected timeline: TimelinePromise<void>

	constructor() {
		super()

		this.state = {
			title1: false,
			title2: false,
			sound1: false,
			sound2: false,
			completed: false,
			paused: false
		}

		this.timeline = Timeline(async (delay, playSound) => {
			// Timeline "Keyframes"
			await delay(750)
			this.setState({title1: true})

			await delay(1500)
			this.setState({title2: true})

			await delay(1500)
			this.setState({title1: false})

			await delay(1000)
			this.setState({title2: false})

			await delay(750)
			this.setState({sound1: true})

			await playSound(sounds.sound1)
			this.setState({sound1: false, sound2: true})

			await playSound(sounds.sound2)
			this.setState({sound2: false})
		})

		this.timeline.then(() => {
			this.setState({completed: true})
		})
	}

	componentWillUnmount() {
		this.timeline.cancel()
	}

	render() {
		const s = this.state
		return h('div', {className: 'stage'}, [
			s.title1 && h(fader, {className: 'title1', duration: '0.25s'}, "This is a Title"),
			s.title2 && h(fader, {className: 'title2', duration: '0.25s'}, "This is another Title"),
			s.sound1 && h(fader, {className: 'sound1', duration: '1s'}, "Playing sound one"),
			s.sound2 && h(fader, {className: 'sound2', duration: '1s'}, "Now playing sound two"),
			!s.completed && h('button',
				{
					className: 'btn-pause',
					onClick: () => {
						const paused = !s.paused
						if (paused) {
							this.timeline.pause()
						} else {
							this.timeline.resume()
						}
						this.setState({paused})
					}
				},
				s.paused ? "resume" : "pause"
			)
		])
	}
}
