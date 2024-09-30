/*
  VERSION:              Robin Trachsel
  DATE:                 30.09.2024
  DESCRIPTION:          esl route
*/

const express = require('express')
const {readFileSync} = require("node:fs");
const {parse} = require("fast-csv");
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('', (req, res) => {
    res.json({ message: 'esl test' })
})

// convert to csv function
function XML_to_CSV(XML_path, CSV_path) {
    const xmlData = readFileSync(XML_path, 'utf-8');

    const jsonData = parse(xmlData, {
        ignoreAttributes: false,
        attributeNamePrefix: ""
    });

    const timePeriodEnd = jsonData.ESLBillingData.Meter.TimePeriod.end;
    const valueRows = jsonData.ESLBillingData.Meter.ValueRow;
    const rows = valueRows.map(row => ({
        timePeriodEnd,            // The end time from TimePeriod
        obis: row.obis,            // OBIS code
        valueTimeStamp: row.valueTimeStamp || '', // The timestamp if available
        value: row.value,          // The meter value
        status: row.status         // The status value
    }));

    if (!CSV_path) {
    let csvString = '';
    cvsWriter
        .toString(rows, {headers: true})
        .then(data => {
            csvString = data;
            console.log(csvString);
        })
        .catch(err => {'Error with CSV string'})
    }
    return csv
}