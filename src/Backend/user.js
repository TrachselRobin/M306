/*
  VERSION:              Robin Trachsel
  DATE:                 30.09.2024
  DESCRIPTION:          login logout and get users etc. (endpoint: /users)

  CREATE TABLE `Users` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,  -- Benutzer ID umbenannt zu ID
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

const express = require('express')
const router = express.Router()

const sqlQuery = require('./sql.js')

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.use(log)

router.get('', async (req, res) => {
    const sql = 'SELECT * FROM users'
    const result = await sqlQuery(sql)
    res.send(result)
})

router.get('/:id', async (req, res) => {
    const sql = `SELECT * FROM users WHERE id = ${req.params.id}`
    const result = await sqlQuery(sql)
    res.send(result)
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const sql = `SELECT * FROM users WHERE username = '${username}' AND password_hash = '${password}'`
    const result = await sqlQuery(sql)
    res.send(result)
})