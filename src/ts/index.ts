import * as Preact from 'preact'
import app from './components/app'
import {loadSounds} from './lib/audio'

loadSounds().then(() => {
	Preact.render(Preact.h(app, {}), document.body)
})
