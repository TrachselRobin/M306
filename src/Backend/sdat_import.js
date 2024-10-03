const fs = require('fs');
const path = require('path');
const sqlQuery = require('./sql'); // Adjust path if necessary

// Function to upload SDAT data
async function uploadSdatData() {
    const directoryPath = path.join(__dirname, '../data/SDAT-JSON');

    // Read all files in the directory
    fs.readdir(directoryPath, async (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        // Filter for JSON files
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        // Process each JSON file
        for (const file of jsonFiles) {
            const jsonFilePath = path.join(directoryPath, file);
            try {
                // Read the JSON file
                const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

                // Extract relevant data
                const header = jsonData["rsm:ValidatedMeteredData_12"]["rsm:ValidatedMeteredData_HeaderInformation"][0];
                const meteringData = jsonData["rsm:ValidatedMeteredData_12"]["rsm:MeteringData"][0];

                const intervalStartTime = header["rsm:BusinessScopeProcess"][0]["rsm:ReportPeriod"][0]["rsm:StartDateTime"][0];
                const intervalEndTime = header["rsm:BusinessScopeProcess"][0]["rsm:ReportPeriod"][0]["rsm:EndDateTime"][0];
                const documentID = meteringData["rsm:DocumentID"][0];
                const versionID = header["rsm:InstanceDocument"][0]["rsm:VersionID"][0]["_"];

                // Insert data into the 'sdat' table
                const insertSdatSQL = `
                    INSERT INTO sdat (IntervalStartTime, IntervalEndTime, DocumentID, VersionID)
                    VALUES (STR_TO_DATE('${intervalStartTime}', '%Y-%m-%dT%H:%i:%sZ'), STR_TO_DATE('${intervalEndTime}', '%Y-%m-%dT%H:%i:%sZ'), '${documentID}', '${versionID}')
                `;
                const sdatResult = await sqlQuery(insertSdatSQL);

                // Get the inserted ID
                const sdatID = sdatResult.insertId;

                // Process and insert interval data
                const observations = meteringData["rsm:Observation"];
                const insertIntervalSQLs = observations.map(observation => {
                    const sequenceNr = observation["rsm:Position"][0]["rsm:Sequence"][0];
                    const volume = observation["rsm:Volume"][0];
                    return `
                        INSERT INTO sdat_intervals (sdat_ID, sequenceNr, volume)
                        VALUES (${sdatID}, ${sequenceNr}, ${volume})
                    `;
                });

                // Execute all interval inserts
                for (const sql of insertIntervalSQLs) {
                    await sqlQuery(sql);
                }

                console.log(`Data successfully uploaded from ${file}`);
            } catch (error) {
                console.error(`Error processing file ${file}:`, error);
            }
        }
    });
}

// Call the function to upload SDAT data from all files
uploadSdatData().catch(console.error);
