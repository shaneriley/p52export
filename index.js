const express = require('express')
const app = express()
const PORT = 3000
const decks = require('./catalog_merged.json')

app.use(express.static('public'))

app.get('/api/first20', (req, res) => {
  const first20 = decks.slice(0, 20)
  res.status(200).json(first20);
})

app.get('/api/decks', (req, res) => {
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
