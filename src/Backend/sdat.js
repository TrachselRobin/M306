const express = require('express');
const cors = require('cors');
const fs = require('fs');
const router = express.Router();
const corsOptions = require('./index.js');
const sqlQuery = require('./sql.js');

router.options('*', cors(corsOptions));
router.use(cors(corsOptions));

insertDataIntoDatabase();

router.get("", async (req, res) => {
    const response = [];
    const SQL = "SELECT * FROM sdat";
    const result1 = await sqlQuery(SQL);

    for (let i = 0; i < result1.length; i++) {
        const response2 = [];
        const SQL = `SELECT * FROM sdat_intervals WHERE sdat_ID = ${result1[i].ID}`;
        const result2 = await sqlQuery(SQL);

        for (let j = 0; j < result2.length; j++) {
            response2.push({
                "ID": result2[j].ID,
                "sdat_ID": result2[j].sdat_ID,
                "sequenceNr": result2[j].sequenceNr,
                "volume": result2[j].volume
            });
        }

        response.push({
            "sdat": result1[i],
            "intervals": response2
        });
    }

    res.send(response);
});

module.exports = router;

async function insertDataIntoDatabase() {
    // hole Datein aus ../data/SDAT-Files folder
    const files = fs.readdirSync('../data/SDAT-Files');

    // empty sdat, sdat_intervals tables
    await sqlQuery('DELETE FROM sdat_intervals').then(() => {
        sqlQuery('ALTER TABLE sdat_intervals AUTO_INCREMENT = 1');
    });

    await sqlQuery('DELETE FROM sdat').then(() => {
        sqlQuery('ALTER TABLE sdat AUTO_INCREMENT = 1');
    });

    // loop durch alle Datein und console.log den Inhalt
    for (let i = 0; i < files.length; i++) {
        const content = fs.readFileSync(`../data/SDAT-Files/${files[i]}`, 'utf8');

        let startTime = getIntervalStartTime(content); // 2019-03-11T23:00:00Z
        let endTime = getIntervalEndTime(content); // 2019-03-11T23:00:00Z
        startTime = startTime.substring(0, startTime.indexOf('T')) + ' ' + startTime.substring(startTime.indexOf('T') + 1, startTime.indexOf('Z'));
        endTime = endTime.substring(0, endTime.indexOf('T')) + ' ' + endTime.substring(endTime.indexOf('T') + 1, endTime.indexOf('Z'));
        const documentID = getDocumentID(content);
        const versionID = getVersionID(content);
        const intervals = getIntervalTimes(content);

        if (intervals.length === 0) {
            continue;
        }

        const SQL = `INSERT INTO sdat (IntervalStartTime, IntervalEndTime, DocumentID, VersionID) VALUES ('${startTime}', '${endTime}', '${documentID}', '${versionID}')`;
        const result = await sqlQuery(SQL);

        for (let j = 0; j < intervals.length; j++) {
            const SQL = `INSERT INTO sdat_intervals (sdat_ID, sequenceNr, volume) VALUES (${result.insertId}, ${intervals[j].sequenceNr}, ${intervals[j].volume})`;
            await sqlQuery(SQL);
        }
    }
}

function getIntervalStartTime(content) {
    return findString(content, '<rsm:StartDateTime>', '</rsm:StartDateTime>');
}

function getIntervalEndTime(content) {
    return findString(content, '<rsm:EndDateTime>', '</rsm:EndDateTime>');
}

function getDocumentID(content) {
    return findString(content, '<rsm:DocumentID>', '</rsm:DocumentID>');
}

function getVersionID(content) {
    return findString(content, '<rsm:VersionID listAgencyID="260">', '</rsm:VersionID>');
}

function getIntervalTimes(content) {
    const intervals = [];
    const occurences = content.match(/<rsm:Observation>/g);

    if (occurences === null || occurences.length > 96) {
        return intervals;
    }

    for (let i = 0; i < occurences.length; i++) {
        const sequenceNr = findString(content, '<rsm:Sequence>', '</rsm:Sequence>');
        const volume = findString(content, '<rsm:Volume>', '</rsm:Volume>');

        intervals.push({
            "sequenceNr": sequenceNr,
            "volume": volume
        });

        content = content.substring(content.indexOf('</rsm:Observation>') + '</rsm:Observation>'.length);
    }

    return intervals;
}

function findString(content, start, end) {
    const startIndex = content.indexOf(start) + start.length;
    const endIndex = content.indexOf(end, startIndex);
    return content.substring(startIndex, endIndex);
}