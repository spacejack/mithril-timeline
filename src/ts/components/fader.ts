import * as m from 'mithril'
import {waitFrames} from '../lib/wait'

export interface Attrs {
	selector: string,
	duration?: string
}

/** A component that fades-in and fades-out */
export default {
	oncreate({dom}) {
		waitFrames(2).then(() => {
			// Must wait 2 frames for CSS transition to work
			(dom as HTMLElement).style.opacity = '1'
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
					opacity: '0',
					transition: 'opacity ' + duration
				}
			},
			children
		)
	}
} as m.Component<Attrs,{}>
