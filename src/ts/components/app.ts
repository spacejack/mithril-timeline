import {h, Component} from 'preact'
import stage from './stage'

//let showStage = false

export interface State {
	showStage: boolean
}

export default class App extends Component<{},State> {
	constructor() {
		super()
		this.setState({showStage: false})
	}

	render() {
		return h('div', {className: 'app'},
			h('h1', {}, "Preact Timeline Expermient"),
			h('div', {className: 'stage-container'},
				this.state.showStage ? h(stage, {}) : h('div', {})
			),
			h('div', {className: 'cpanel'},
				h('button',
					{
						disabled: this.state.showStage,
						onClick: () => {
							this.setState({showStage: true})
						}
					},
					"Open Stage"
				),
				h('button',
					{
						disabled: !this.state.showStage,
						onClick: () => {
							this.setState({showStage: false})
						}
					},
					"Close Stage"
				)
			)
		)
	}
}
