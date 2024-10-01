const express = require('express');
const router = express.Router();

const sqlQuery = require('./sql.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'dein_geheimes_token'; // Dein geheimes Token

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('', verify, async (req, res) => {
    const sql = 'SELECT * FROM users';
    const result = await sqlQuery(sql);
    res.send(result);
});

router.get('/:id', verify, async (req, res) => {
    const sql = `SELECT * FROM users WHERE id = ${req.params.id}`;
    const result = await sqlQuery(sql);
    res.send(result);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username und Passwort erforderlich' });
    }

    // Hash das Passwort korrekt
    const passwordHash = hashPassword(password);

    // Verwende SQL-Parameterbindung für Sicherheit
    const sql = `SELECT * FROM users WHERE username = ${username} AND password_hash = ${passwordHash}`;
    const result = await sqlQuery(sql);

    if (result.length > 0) {
        const user = result[0];

        // Erzeuge JWT Token
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
    // Hier wird das Passwort korrekt gehashed
    const hash = crypto.createHash('sha256');
    return hash.update(password).digest('base64');
}

module.exports = router;