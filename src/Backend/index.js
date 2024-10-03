/*
  VERSION:              Robin Trachsel
  DATE:                 30.09.2024
  DESCRIPTION:          Backend entry point
*/

const express = require('express');
const cors = require('cors');
const user = require('./user.js');
const esl = require('./esl.js');
const sdat = require('./sdat.js');

const app = express();
const host = '127.0.0.1';
const port = 3000;

// Import the conversion functions for ESL XML files
const csvConverter = require('./esl_xml_to_csv');
const jsonConverter = require('./esl_xml_to_json');

const corsOptions = {
    origin: ["http://127.0.0.1:5500", "http://localhost:63342"],
    optionsSuccessStatus: 200,
    methods: 'GET, POST, DELETE',
    allowedHeaders: 'Content-Type',
    credentials: true,
    preflightContinue: false
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(log);  // Logging middleware

app.use('/user', user);
app.use('/esl', esl);
app.use('/sdat', sdat);

app.use(cors(corsOptions));
app.options('*', cors());  // Enable CORS preflight for all routes

// Add routes for ESL XML to CSV/JSON conversions
app.get('/esl/convert/csv', csvConverter);

app.get('/esl/convert/json', jsonConverter);

// Catch-all route for undefined endpoints
app.get('*', async (req, res) => {
    res.status(404).send({ error: 'Endpoint not found' });
});

// Start the server
app.listen(port, host, () => {
    console.log(`Example app listening at http://${host}:${port}`);
});

// Logging middleware function
function log(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} \t${req.headers.origin}`);
    next();
}

module.exports = app;
