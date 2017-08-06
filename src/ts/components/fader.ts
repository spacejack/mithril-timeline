import * as m from 'mithril'
import {waitFrames} from '../lib/wait'

export interface Attrs {
	selector: string,
	duration?: string
}

/** A component that fades-in and fades-out */
export default {
	oncreate({dom}) {
		const style = (dom as HTMLElement).style
		style.opacity = '0'
		waitFrames(2).then(() => {
			// Must wait 2 frames for CSS transition to work
			style.opacity = '1'
		})
	},
	onbeforeremove({dom}) {
		(dom as HTMLElement).style.opacity = '0'
		return new Promise<Event>(resolve => {
			dom.addEventListener('transitionend', resolve)
		})
	},
	view({attrs: {selector, duration = '0.25s'}, children}) {
		return m(selector,
			{
				style: {
					transition: 'opacity ' + duration
				}
			},
			children
		)
	}
} as m.Component<Attrs,{}>
