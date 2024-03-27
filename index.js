const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3000
const decks = require('./catalog_merged.json')

const corsWhitelist = {
  origin: /^https?:\/\/(www.)?portfolio52\.com/,
  optionsSuccessStatus: 200
}

app.use(express.static('public'))

app.get('/api/first20', cors(corsWhitelist), (req, res) => {
  const first20 = decks.slice(0, 20)
  res.status(200).json(first20);
})

app.get('/api/decks', cors(corsWhitelist), (req, res) => {
  const { id } = req.query
  if (!id || !Array.isArray(id)) {
    res.status(200).end()
    return
  }

  const collection = []
  id.forEach((s) => {
    const deck = decks.find(({ number }) => `${number}` === s)
    if (!deck) { return }
    collection.push(deck)
  })
  res.status(200).json(collection)
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the Express API
module.exports = app
