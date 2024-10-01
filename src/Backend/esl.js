const express = require('express');
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const csvWriter = require('fast-csv');

const router = express.Router();

const sqlQuery = require('./sql.js')

const inputDir = path.join('../data/ESL-Files');
const outputCsvDir = path.join('../data/ESL-CSV');
const outputJsonDir = path.join('../data/ESL-JSON');


router.use(express.json())
router.use(express.urlencoded({ extended: true }))

function convertXMLToCSV(xmlFilePath, outputCsvFilePath) {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: ""
    });

    let jsonData;
    try {
        jsonData = parser.parse(xmlData);
    } catch (err) {
        console.error(`Error parsing XML for file: ${xmlFilePath}`, err);
        return;
    }

    console.log(`Processing CSV for file: ${xmlFilePath}`);

    const timePeriods = jsonData?.ESLBillingData?.Meter?.TimePeriod;

    if (!timePeriods) {
        console.warn(`No TimePeriod found in file: ${xmlFilePath}`);
        return;
    }

    const rows = [];

    const timePeriodsArray = Array.isArray(timePeriods) ? timePeriods : [timePeriods];

    timePeriodsArray.forEach(period => {
        const timePeriodEnd = period.end;
        const valueRows = period.ValueRow;

        if (!valueRows) {
            console.warn(`No ValueRow found in TimePeriod for file: ${xmlFilePath}`);
            return;
        }

        const valueRowsArray = Array.isArray(valueRows) ? valueRows : [valueRows];

        valueRowsArray.forEach(row => {
            rows.push({
                timePeriodEnd,
                obis: row.obis,
                valueTimeStamp: row.valueTimeStamp || '',
                value: row.value,
                status: row.status
            });
        });
    });

    if (rows.length === 0) {
        console.warn(`No data to write for file: ${xmlFilePath}`);
        return;
    }

    const ws = fs.createWriteStream(outputCsvFilePath);
    csvWriter
        .write(rows, { headers: true })
        .pipe(ws)
        .on('finish', () => {
            console.log(`CSV file successfully created: ${outputCsvFilePath}`);
        })
        .on('error', (err) => {
            console.error('Error writing CSV file:', err);
        });
}

function convertXMLToJSON(xmlFilePath, outputJsonFilePath) {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: ""
    });

    let jsonData;
    try {
        jsonData = parser.parse(xmlData);
    } catch (err) {
        console.error(`Error parsing XML for file: ${xmlFilePath}`, err);
        return;
    }

    console.log(`Processing JSON for file: ${xmlFilePath}`);

    const timePeriods = jsonData?.ESLBillingData?.Meter?.TimePeriod;

    if (!timePeriods) {
        console.warn(`No TimePeriod found in file: ${xmlFilePath}`);
        return;
    }

    const jsonOutput = {
        values: []
    };

    const timePeriodsArray = Array.isArray(timePeriods) ? timePeriods : [timePeriods];

    timePeriodsArray.forEach(period => {
        const timePeriodEnd = period.end;
        const valueRows = period.ValueRow;

        if (!valueRows) {
            console.warn(`No ValueRow found in TimePeriod for file: ${xmlFilePath}`);
            return;
        }

        const valueRowsArray = Array.isArray(valueRows) ? valueRows : [valueRows];

        valueRowsArray.forEach(row => {
            jsonOutput.values.push({
                timePeriodEnd,
                obis: row.obis,
                valueTimeStamp: row.valueTimeStamp || '',
                value: row.value,
                status: row.status
            });
        });
    });

    if (jsonOutput.values.length === 0) {
        console.warn(`No data to write for file: ${xmlFilePath}`);
        return;
    }

    fs.writeFileSync(outputJsonFilePath, JSON.stringify(jsonOutput, null, 2), 'utf-8');
    console.log(`JSON file successfully created: ${outputJsonFilePath}`);
}

function processAllXMLFiles() {
    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error('Error reading input directory:', err);
            return;
        }

        files.forEach(file => {
            const xmlFilePath = path.join(inputDir, file);

            if (path.extname(file).toLowerCase() === '.xml') {
                const baseName = path.basename(file, '.xml');

                const outputCsvFilePath = path.join(outputCsvDir, `${baseName}.csv`);
                const outputJsonFilePath = path.join(outputJsonDir, `${baseName}.json`);

                convertXMLToCSV(xmlFilePath, outputCsvFilePath);
                convertXMLToJSON(xmlFilePath, outputJsonFilePath);
            }
        });
    });
}
router.get('/convert', (req, res) => {
    processAllXMLFiles();
    res.json({ message: 'Conversion started' });
});

module.exports = router;
