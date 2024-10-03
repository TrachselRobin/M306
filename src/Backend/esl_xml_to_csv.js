const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const archiver = require('archiver');

module.exports = async function (req, res) {
    const xmlDir = path.join(__dirname, '../data/ESL-Files');
    console.log(`Attempting to read directory: ${xmlDir}`); // Log the directory path
    const parser = new xml2js.Parser();

    // Create a zip file
    res.attachment('esl_files.zip');
    const archive = archiver('zip');

    // Pipe the zip file to the response
    archive.pipe(res);

    // Read all files in the XML directory
    fs.readdir(xmlDir, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`); // Log the error
            return res.status(500).send({ error: 'Unable to scan directory' });
        }

        // Filter for XML files
        const xmlFiles = files.filter(file => path.extname(file) === '.xml');

        if (xmlFiles.length === 0) {
            return res.status(404).send({ error: 'No XML files found' });
        }

        // Use a counter to finalize the archive only after all files have been processed
        let processedFiles = 0;

        // Loop through the XML files
        xmlFiles.forEach(file => {
            const filePath = path.join(xmlDir, file);
            fs.readFile(filePath, 'utf8', (err, xmlData) => {
                if (err) {
                    console.error(`Error reading file ${file}: ${err}`);
                    processedFiles++; // Increment to avoid hanging
                    return; // Skip to the next file
                }

                // Parse the XML and convert to JSON
                parser.parseString(xmlData, (err, result) => {
                    if (err) {
                        console.error(`Error parsing file ${file}: ${err}`);
                        processedFiles++; // Increment to avoid hanging
                        return; // Skip to the next file
                    }

                    // Convert XML to CSV
                    const csvData = convertToCSV(result);
                    const csvFileName = `${path.basename(file, '.xml')}.csv`;

                    // Append CSV file to the zip archive
                    archive.append(csvData, { name: csvFileName });

                    processedFiles++;

                    // Check if all files have been processed
                    if (processedFiles === xmlFiles.length) {
                        // Finalize the zip file
                        archive.finalize();
                    }
                });
            });
        });
    });
};

function convertToCSV(jsonData) {
    // Initialize CSV output with headers
    let csvOutput = 'TimePeriodEnd,OBIS,Value,Status\n';

    // Extract TimePeriodEnd from the Meter element
    const timePeriodEnd = jsonData.ESLBillingData.Meter[0].TimePeriod[0].$.end;

    // Extract ValueRow elements
    const valueRows = jsonData.ESLBillingData.Meter[0].TimePeriod[0].ValueRow;

    valueRows.forEach(row => {
        const obis = row.$.obis;  // Get the obis attribute
        const value = row.$.value;  // Get the value attribute
        const status = row.$.status;  // Get the status attribute

        // Append data to the CSV output
        csvOutput += `${timePeriodEnd},${obis},${value},${status}\n`;
    });

    return csvOutput;
}
