import { useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"

function App() {
	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const accessToken = params.get("access_token")
		const refreshToken = params.get("refresh_token")
		console.log(accessToken, refreshToken)

		if (refreshToken) {
			fetch(`/refresh_token?refresh_token=${refreshToken}`)
				.then((res) => res.json())
				.then((data) => console.log(data))
				.catch((err) => console.log(err))
		}
	}, [])
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a className="App-link" href="http://localhost:3001/login">
					Login with Spotify
				</a>
			</header>
		</div>
	)
}

export default App
