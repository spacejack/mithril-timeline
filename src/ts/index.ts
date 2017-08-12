import {createElement as h} from 'react'
import {render} from 'react-dom'
import app from './components/app'
import {loadSounds} from './lib/audio'

loadSounds().then(() => {
	render(h(app, {}), document.body)
})
