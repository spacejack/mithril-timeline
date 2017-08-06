const soundFiles = ['sound1.mp3', 'sound2.mp3', 'sound3.mp3']

export const sounds: {[id: string]: Howl} = {}

export function loadSounds(): Promise<Howl[]> {
	return Promise.all(
		soundFiles.map(fname => loadSound('data/' + fname))
	).then(s => {
		sounds.sound1 = s[0]
		sounds.sound2 = s[1]
		sounds.sound3 = s[2]
		return s
	})
}

export function loadSound (url: string): Promise<Howl> {
	return new Promise((resolve, reject) => {
		const sound = new Howl({
			src: [url],
			onload: () => {
				resolve(sound)
			},
			onloaderror: (code, info) => {
				reject(new Error(`Failed to load sound. (${code}) ${info}`))
			}
		})
	})
}
