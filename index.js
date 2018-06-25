const flastm = require('flastm')
const sleep = require('sleep')

const config = {
	api_key: process.env.api_key,
	secret: process.env.api_secret,
	username: process.env.username,
	password: process.env.password,
	sleep: process.env.sleep,
	limit: process.env.limit
}
const lastfm = flastm(config)
lastfm.user.getRecentTracks(config.username, {
	page: 1,
	limit: config.limit
}).then(res => {
	lastfm.auth.getMobileSession()
	.then(session => {
		var sk = session.session.key
		var tracks = res.recenttracks.track
		console.log(`Track found: ${tracks.length}`)
		tracks.forEach(track => {
			var artist = track.artist['#text']
			var name = track.name
			lastfm.track.updateNowPlaying(
				artist,
				name,
				sk
			).catch(e => console.error(e))
			console.log(`${artist} - ${name}   Scrobbling now`)
			sleep.sleep(Number(config.sleep))
		})
	})
	.catch(e => console.error(e))
})
