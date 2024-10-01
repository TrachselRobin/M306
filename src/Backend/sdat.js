/*
  VERSION:              Robin Trachsel
  DATE:                 30.09.2024
  DESCRIPTION:          sdat route
*/

const express  = require('express')
const router   = express.Router()
const fs       = require('fs');
const path     = require('path');

const sqlQuery = require('./sql.js')

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('', (req, res) => {
  const dirPath = path.join(__dirname, '..', 'data', 'SDAT-Files');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Fehler beim Lesen des Verzeichnisses', error: err });
    }

    res.json({ files });
  });
})

module.exports = router;
