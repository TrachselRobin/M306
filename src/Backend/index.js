/*
  VERSION:              Robin Trachsel
  DATE:                 30.09.2024
  DESCRIPTION:          Backend entry point
*/

const express  = require('express')
const sdat     = require('./sdat.js')
const esl      = require('./esl.js')
const user     = require('./user.js')

const app      = express()
const host     = '127.0.0.1'
const port     = 3000

const sqlQuery = require('./sql.js')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(log)

app.use('/sdat', sdat)
app.use('/esl', esl)

// Catch-all route for undefined endpoints
app.get('*', async (req, res) => {
  const sql = 'SELECT * FROM users'
  const result = await sqlQuery(sql)
  console.log(result)
  res.status(404).send({ error: 'Endpoint not found' })
})

// Start the server
app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`)
})

// Logging middleware
function log(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
}