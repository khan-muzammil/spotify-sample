const express = require("express")

const app = express()

app.get("/", (req, res) => {
	res.json("Hello world")
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`listening on http:localhost:${PORT}`)
})
