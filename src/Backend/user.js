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
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-Mail und Passwort erforderlich' });
    }

    // Hash das Passwort korrekt
    const passwordHash = hashPassword(password);

    // Manuelles Einfügen der Variablen in die SQL-Abfrage
    const sql = `SELECT * FROM users WHERE email = '${email}' AND password_hash = '${passwordHash}'`;

    try {
        const result = await sqlQuery(sql);

        if (result.length > 0) {
            const user = result[0];

            // Erzeuge JWT Token
            const token = jwt.sign({ id: user.ID, username: user.email }, SECRET_KEY, { expiresIn: '30m' });

            res.json({
                message: 'Login erfolgreich',
                token: token
            });
        } else {
            res.status(401).json({ message: 'Ungültiger Benutzername oder Passwort' });
        }
    } catch (error) {
        console.error('SQL Fehler:', error);
        res.status(500).json({ message: 'Interner Serverfehler' });
    }
});


function verify(req, res, next) {
    // Token wird aus dem Authorization-Header extrahiert
    const authHeader = req.headers['authorization'];

    console.log(authHeader);
    
    // Überprüfen, ob ein Token vorhanden ist
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Kein Token angegeben oder Token ist ungültig' });
    }

    // Token extrahieren (Bearer <Token>)
    const token = authHeader.split(' ')[1];

    // Token verifizieren
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Ungültiger Token' });
        }
        
        // Token erfolgreich verifiziert, Benutzerinformationen in req speichern
        req.user = decoded;
        next();
    });
}

function hashPassword(password) {
    // Hier wird das Passwort korrekt gehashed
    const hash = crypto.createHash('sha256');
    return hash.update(password).digest('base64');
}

module.exports = router;