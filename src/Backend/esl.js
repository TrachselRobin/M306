const express = require('express');
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const csvWriter = require('fast-csv');

const router = express.Router();

const inputDir = path.join('../data/ESL-Files');
const outputCsvDir = path.join('../data/ESL-CSV');
const outputJsonDir = path.join('../data/ESL-JSON');

let convertedFiles = [];

function convertXMLToCSV(xmlFilePath, outputCsvFilePath) {
    return new Promise((resolve, reject) => {
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
            return reject(err);
        }

        console.log(`Processing CSV for file: ${xmlFilePath}`);

        const timePeriods = jsonData?.ESLBillingData?.Meter?.TimePeriod;

        if (!timePeriods) {
            console.warn(`No TimePeriod found in file: ${xmlFilePath}`);
            return resolve();
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
            return resolve();
        }

        const ws = fs.createWriteStream(outputCsvFilePath);
        csvWriter
            .write(rows, { headers: true })
            .pipe(ws)
            .on('finish', () => {
                console.log(`CSV file successfully created: ${outputCsvFilePath}`);
                convertedFiles.push(path.basename(outputCsvFilePath));
                resolve();
            })
            .on('error', (err) => {
                console.error('Error writing CSV file:', err);
                reject(err);
            });
    });
}

function convertXMLToJSON(xmlFilePath, outputJsonFilePath) {
    return new Promise((resolve, reject) => {
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
            return reject(err);
        }

        console.log(`Processing JSON for file: ${xmlFilePath}`);

        const timePeriods = jsonData?.ESLBillingData?.Meter?.TimePeriod;

        if (!timePeriods) {
            console.warn(`No TimePeriod found in file: ${xmlFilePath}`);
            return resolve();
        }

        const jsonOutput = { values: [] };
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
            return resolve();
        }

        fs.writeFileSync(outputJsonFilePath, JSON.stringify(jsonOutput, null, 2), 'utf-8');
        console.log(`JSON file successfully created: ${outputJsonFilePath}`);
        convertedFiles.push(path.basename(outputJsonFilePath));
        resolve();
    });
}

async function processAllXMLFiles() {
    return new Promise((resolve, reject) => {
        fs.readdir(inputDir, async (err, files) => {
            if (err) {
                console.error('Error reading input directory:', err);
                return reject(err);
            }

            const promises = files.map(async (file) => {
                const xmlFilePath = path.join(inputDir, file);

                if (path.extname(file).toLowerCase() === '.xml') {
                    const baseName = path.basename(file, '.xml');

                    const outputCsvFilePath = path.join(outputCsvDir, `${baseName}.csv`);
                    const outputJsonFilePath = path.join(outputJsonDir, `${baseName}.json`);

                    await convertXMLToCSV(xmlFilePath, outputCsvFilePath);
                    await convertXMLToJSON(xmlFilePath, outputJsonFilePath);
                }
            });

            await Promise.all(promises);
            resolve();
        });
    });
}

router.get('/convert', async (req, res) => {
    convertedFiles = [];  // Clear previous file names
    try {
        await processAllXMLFiles();
        res.json({ message: 'Conversion completed', convertedFiles });
    } catch (error) {
        res.status(500).json({ message: 'Error during conversion', error });
    }
});

module.exports = router;
