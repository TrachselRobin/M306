const fs = require('fs');
const path = require('path');
const sqlQuery = require('./sql'); // Import your SQL connection module

const directoryPath = '../data/ESL-JSON';

// Function to insert data into the database
async function insertData(eslData) {
    try {
        // Create a Set to store processed time periods
        const processedTimePeriods = new Set();

        // Loop through each entry in the values array
        for (const entry of eslData.values) {
            const { timePeriodEnd, obis, value, status } = entry;

            // Format the timePeriodEnd to only include the year and month (YYYY-MM)
            const monthKey = timePeriodEnd.slice(0, 7);

            // Check if this month has already been processed
            if (processedTimePeriods.has(monthKey)) {
                continue; // Skip already processed months
            }

            // Check if the timePeriodEnd already exists in the esl table
            const checkSQL = `SELECT COUNT(*) AS count FROM esl WHERE TimePeriodEnd = '${timePeriodEnd}'`;
            const checkResult = await sqlQuery(checkSQL);

            if (checkResult[0].count === 0) {
                // Insert into the esl table if not already present
                const eslInsertSQL = `
                    INSERT INTO esl (TimePeriodEnd) 
                    VALUES ('${timePeriodEnd}')
                    ON DUPLICATE KEY UPDATE ID = LAST_INSERT_ID(ID);`;
                const eslResult = await sqlQuery(eslInsertSQL);
                const eslID = eslResult.insertId; // Get the last inserted ID

                // Insert into the obis table
                const obisInsertSQL = `
                    INSERT INTO obis (code, value, status) 
                    VALUES ('${obis}', ${value}, '${status}');`;
                await sqlQuery(obisInsertSQL);

                // Insert into the esl_time_periods table
                const eslTimePeriodsInsertSQL = `
                    INSERT INTO esl_time_periods (esl_ID, TimePeriodEnd) 
                    VALUES (${eslID}, '${timePeriodEnd}');`;
                await sqlQuery(eslTimePeriodsInsertSQL);

                // Mark this month as processed
                processedTimePeriods.add(monthKey);
            }
        }
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

// Function to read and process all JSON files in the directory
async function processFiles() {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Unable to scan directory:', err);
            return;
        }
        files.forEach(async (file) => {
            if (path.extname(file) === '.json') {
                const filePath = path.join(directoryPath, file);
                fs.readFile(filePath, 'utf8', async (err, data) => {
                    if (err) {
                        console.error('Error reading file:', err);
                        return;
                    }
                    const eslData = JSON.parse(data);
                    await insertData(eslData);
                });
            }
        });
    });
}

// Run the file processing
processFiles();
