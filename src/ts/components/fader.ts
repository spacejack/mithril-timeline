import {createElement as h, Component} from 'react'
import {waitFrames} from '../lib/wait'

export interface Props {
	className?: string,
	duration?: string
}

export default class Fader extends Component<Props> {
	div: HTMLDivElement

	componentDidMount() {
		this.div.style.opacity = '0'
		waitFrames(2).then(() =>  {this.div.style.opacity = '1'})
	}

	// TODO: Exit animation (fade-out)
	/* componentWillUnmount() {
		this.div.style.opacity = '0'
	} */

	render() {
		return h('div',
			{
				ref: (div: HTMLDivElement) => {this.div = div},
				className: this.props.className || '',
				style: {
					transition: 'opacity ' + (this.props.duration || '0.25s')
					//opacity: 0
				}
			},
			this.props.children
		)
	}
}
