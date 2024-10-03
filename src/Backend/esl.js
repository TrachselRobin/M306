/*
  VERSION:              Robin Trachsel
  DATE:                 30.09.2024
  DESCRIPTION:          Router zum Verarbeiten von ESL-Dateien
*/

const express = require('express');
const cors = require('cors');
const sqlQuery = require('./sql.js');
const router = express.Router();
const path = require('path');
const xml2js = require('xml2js');
const corsOptions = require('./index.js');
const fs = require('fs');

router.options('*', cors(corsOptions));
router.use(cors(corsOptions));

// Verzeichnis mit ESL-Dateien
const eslDirectory = path.join(__dirname, '../data/ESL-Files');

// Funktion zum Einlesen der XML-Dateien und Speichern in der Datenbank beim Start
async function processEslFiles() {
	await sqlQuery('DELETE FROM obis').then(() => {
		sqlQuery('ALTER TABLE obis AUTO_INCREMENT = 1');
	});

	await sqlQuery('DELETE FROM esl_time_periods').then(() => {
		sqlQuery('ALTER TABLE esl_time_periods AUTO_INCREMENT = 1');
	});

    try {
        const files = fs.readdirSync(eslDirectory).filter(file => file.endsWith('.xml'));

        for (const file of files) {
            const filePath = path.join(eslDirectory, file);
            const xmlData = fs.readFileSync(filePath, 'utf8');

            const parsedData = await parseXml(xmlData);
            const firstTimePeriod = getFirstTimePeriod(parsedData);

            if (firstTimePeriod) {
                // Daten der ersten TimePeriod in die Datenbank speichern
                await saveTimePeriodToDatabase(firstTimePeriod);
            }
        }
        console.log("Alle Dateien wurden verarbeitet.");
    } catch (error) {
        console.error("Fehler beim Verarbeiten der Dateien:", error);
    }
}

// Endpunkt zum Abrufen aller gespeicherten TimePeriods aus der Datenbank
router.get('', async (req, res) => {
    try {
        const getAllTimePeriodsSql = `
            SELECT 
                esl_time_periods.TimePeriodEnd,
                esl.ID AS esl_ID,
                obis.code,
                obis.value,
                obis.status
            FROM 
                esl_time_periods
            JOIN 
                esl ON esl_time_periods.esl_ID = esl.ID
            JOIN 
                obis ON obis.esl_ID = esl.ID;
        `;
        const timePeriods = await sqlQuery(getAllTimePeriodsSql);

        res.status(200).json(timePeriods);
    } catch (error) {
        console.error("Fehler beim Abrufen der TimePeriods:", error);
        res.status(500).json({ error: 'Fehler beim Abrufen der TimePeriods' });
    }
});

// Hilfsfunktion zum Parsen der XML-Datei
async function parseXml(xmlData) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Hilfsfunktion zum Abrufen der ersten TimePeriod
function getFirstTimePeriod(parsedData) {
    if (parsedData.ESLBillingData && parsedData.ESLBillingData.Meter && parsedData.ESLBillingData.Meter.TimePeriod) {
        const timePeriods = Array.isArray(parsedData.ESLBillingData.Meter.TimePeriod)
            ? parsedData.ESLBillingData.Meter.TimePeriod
            : [parsedData.ESLBillingData.Meter.TimePeriod];

        return timePeriods[0]; // Erste TimePeriod zurückgeben
    }
    return null;
}

// Hilfsfunktion zum Speichern der TimePeriod in die Datenbank
async function saveTimePeriodToDatabase(timePeriod) {
    const { $, ValueRow } = timePeriod;
    const end = $?.end; // Abrufen des 'end'-Werts aus der '$'-Eigenschaft

    // Überprüfen, ob 'end' vorhanden ist
    if (!end) {
        console.error("TimePeriod hat keinen gültigen 'end'-Wert:", timePeriod);
        return false;
    }

    try {
        // Prüfen, ob die TimePeriod existiert, um Duplikate zu vermeiden
        const checkSql = `SELECT * FROM esl_time_periods WHERE TimePeriodEnd = '${end}'`;
        const checkResult = await sqlQuery(checkSql);

        let eslID = null;

        // Wenn die TimePeriod nicht existiert, fügen wir sie hinzu
        if (checkResult.length === 0) {
            // Erstelle neuen Eintrag in der 'esl' Tabelle und erhalte die ID
            const insertEslSql = `INSERT INTO esl (esl_time_periods_ID) VALUES (NULL)`;
            const eslResult = await sqlQuery(insertEslSql);
            eslID = eslResult.insertId;

            // Speichere die TimePeriod
            const insertTimePeriodSql = `INSERT INTO esl_time_periods (TimePeriodEnd, esl_ID) VALUES ('${end}', ${eslID})`;
            const timePeriodResult = await sqlQuery(insertTimePeriodSql);
            const esl_time_periods_ID = timePeriodResult.insertId;

            // ValueRows in der OBIS-Tabelle speichern
            for (const valueRow of ValueRow) {
                const { $: valueData } = valueRow;
                const { obis, value, status } = valueData;

                // OBIS-Daten in die Datenbank einfügen
                const insertObisSql = `
                    INSERT INTO obis (esl_ID, code, value, status) 
                    VALUES (${eslID}, '${obis}', ${value}, '${status}')
                `;
                await sqlQuery(insertObisSql);
            }

            return true;
        } else {
            console.log(`TimePeriod mit Endzeit ${end} existiert bereits.`);
            return false;
        }
    } catch (error) {
        console.error("Fehler beim Speichern der TimePeriod:", error);
        return false;
    }
}

// Dateien beim Start des Servers einlesen
processEslFiles();

module.exports = router;
