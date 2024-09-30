const express = require('express');
const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');
const csvWriter = require('fast-csv');
const path = require('path');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('', (req, res) => {
    res.json({ message: 'esl test' });
});

function convertXMLToCSV(xmlFilePath, outputCsvFilePath = null) {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: ""
    });

    const jsonData = parser.parse(xmlData);

    console.log(JSON.stringify(jsonData, null, 2));

    const timePeriodEnd = jsonData.ESLBillingData.Meter.TimePeriod.end;
    const valueRows = jsonData.ESLBillingData.Meter.TimePeriod.ValueRow;

    if (!valueRows || !Array.isArray(valueRows)) {
        console.error('ValueRow is not defined or is not an array.');
        return;
    }

    const rows = valueRows.map(row => ({
        timePeriodEnd,
        obis: row.obis,
        valueTimeStamp: row.valueTimeStamp || '',
        value: row.value,
        status: row.status
    }));

    if (!outputCsvFilePath) {
        csvWriter
            .writeToString(rows, { headers: true })
            .then(data => {
                console.log(data);
            })
            .catch(err => console.error('Error generating CSV string:', err));
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
        ignoreAttributes: false, // To capture attributes like obis, value, and valueTimeStamp
        attributeNamePrefix: "" // Remove prefix for easier access
    });

    const jsonData = parser.parse(xmlData);

    console.log(JSON.stringify(jsonData, null, 2));

    const timePeriodEnd = jsonData.ESLBillingData.Meter.TimePeriod.end;
    const valueRows = jsonData.ESLBillingData.Meter.TimePeriod.ValueRow; // Access ValueRow directly

    const jsonOutput = {
        timePeriodEnd: timePeriodEnd,
        values: valueRows.map(row => ({
            obis: row.obis,            // OBIS code
            valueTimeStamp: row.valueTimeStamp || '', // The timestamp if available
            value: row.value,          // The meter value
            status: row.status         // The status value
        }))
    };

    fs.writeFileSync(outputJsonFilePath, JSON.stringify(jsonOutput, null, 2), 'utf-8');
    console.log(`JSON file successfully created: ${outputJsonFilePath}`);
}

convertXMLToCSV(
    path.join('../data/ESL-Files', 'EdmRegisterWertExport_20190131_eslevu_20190322160349.xml'),
    path.join('../data/ESL-CSV', 'output.csv')
);

convertXMLToJSON(
    path.join('../data/ESL-Files', 'EdmRegisterWertExport_20190131_eslevu_20190322160349.xml'),
    path.join('../data/ESL-JSON', 'output.json')
);