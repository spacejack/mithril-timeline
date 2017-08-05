import * as m from 'mithril'
import app from './components/app'
import {loadSounds} from './lib/audio'

loadSounds().then(() => {
	m.mount(document.body, app)
})
