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
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const jwt = require('jsonwebtoken');

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('', verify, async (req, res) => {
    const sql = 'SELECT * FROM users'
    const result = await sqlQuery(sql)
    res.send(result)
})

router.get('/:id', verify, async (req, res) => {
    const sql = `SELECT * FROM users WHERE id = ${req.params.id}`
    const result = await sqlQuery(sql)
    res.send(result)
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const passwordHash = hashPassword(password);

    const sql = `SELECT * FROM users WHERE username = ? AND password_hash = ?`;
    const result = await sqlQuery(sql, [username, passwordHash]);

    if (result.length > 0) {
        const user = result[0];

        const token = jwt.sign({ id: user.ID, username: user.username }, SECRET_KEY, { expiresIn: '30m' });

        res.json({
            message: 'Login erfolgreich',
            token: token
        });
    } else {
        res.status(401).json({ message: 'Ungültiger Benutzername oder Passwort' });
    }
});

function verify(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Kein Token angegeben' });
    } else {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Ungültiger Token' });
            } else {
                req.user = decoded;
                next();
            }
        });
    }
}

function hashPassword(password) {
    return createHash('sha256').update(password).digest('base64');
}

module.exports = router;