/*
  VERSION:              Robin Trachsel
  DATE:                 30.09.2024
  DESCRIPTION:          sdat route
*/

const express = require('express')
const router = express.Router()

const sqlQuery = require('./sql.js')

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.use(log)