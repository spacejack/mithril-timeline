import * as m from 'mithril'
import stage from './stage'

let showStage = false

export default {
	view() {
		return m('.app',
			m('h1', "Mithril Timeline Expermient"),
			m('.stage-container',
				showStage && m(stage)
			),
			m('.cpanel',
				m('button',
					{
						disabled: showStage,
						onclick: () => {showStage = true}
					},
					"Open Stage"
				),
				m('button',
					{
						disabled: !showStage,
						onclick: () => {showStage = false}
					},
					"Close Stage"
				)
			)
		)
	}
}
