require("dotenv").config()
const express = require("express")
const querystring = require("querystring")
const axios = require("axios")

const app = express()
const PORT = 3001
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI

app.get("/", (req, res) => {
	res.json("Hello world")
})

const generateRandomString = function (length) {
	var text = ""
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return text
}

const stateKey = "spotify_auth_state"
app.get("/login", (req, res) => {
	const state = generateRandomString(16)
	res.cookie(stateKey, state)
	const scope = "user-read-private user-read-email"
	res.redirect(
		"https://accounts.spotify.com/authorize?" +
			querystring.stringify({
				response_type: "code",
				client_id: CLIENT_ID,
				redirect_uri: REDIRECT_URI,
				state,
				scope,
			})
	)
})

app.get("/callback", (req, res) => {
	const code = req.query.code || null

	axios({
		method: "post",
		url: "https://accounts.spotify.com/api/token",
		data: querystring.stringify({
			grant_type: "authorization_code",
			code: code,
			redirect_uri: REDIRECT_URI,
		}),
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${new Buffer.from(
				`${CLIENT_ID}:${CLIENT_SECRET}`
			).toString("base64")}`,
		},
	})
		.then((response) => {
			if (response.status === 200) {
				const { refresh_token, access_token } = response.data
				const queryParams = querystring.stringify({
					access_token,
					refresh_token,
				})
				// redirect to react app
				// pass tokens in query params
				res.redirect(`http://localhost:3000/?${queryParams}`)
			} else {
				res.redirect(`/?${querystring.stringify({ error: "invalid_token" })}`)
			}
		})
		.catch((error) => {
			res.send(error)
		})
})

app.get("/refresh_token", (req, res) => {
	const { refresh_token } = req.query

	axios({
		method: "post",
		url: "https://accounts.spotify.com/api/token",
		data: querystring.stringify({
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		}),
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${new Buffer.from(
				`${CLIENT_ID}:${CLIENT_SECRET}`
			).toString("base64")}`,
		},
	})
		.then((response) => {
			res.send(response.data)
		})
		.catch((error) => {
			res.send(error)
		})
})

app.listen(PORT, () => {
	console.log(`listening on http:localhost:${PORT}`)
})
