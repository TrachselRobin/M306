const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const archiver = require('archiver');

module.exports = async function (req, res) {
    const directoryPath = path.join(__dirname, '../data/ESL-Files');
    console.log(`Attempting to read directory: ${directoryPath}`); // Log the directory path
    const parser = new xml2js.Parser();

    // Create a zip file
    res.attachment('esl_files.zip');
    const archive = archiver('zip');

    // Pipe the zip file to the response
    archive.pipe(res);

    // Read all files in the directory
    fs.readdir(directoryPath, (err, files) => {
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
            const filePath = path.join(directoryPath, file);
            const xmlData = fs.readFileSync(filePath, 'utf8');

            // Parse the XML and convert to JSON
            parser.parseString(xmlData, (err, result) => {
                if (err) {
                    console.error(`Error parsing file ${file}: ${err}`);
                    return; // Skip to the next file
                }

                const jsonData = JSON.stringify(result, null, 2);
                const jsonFileName = `${path.basename(file, '.xml')}.json`;

                // Append JSON file to the zip archive
                archive.append(jsonData, { name: jsonFileName });

                processedFiles++;

                // Check if all files have been processed
                if (processedFiles === xmlFiles.length) {
                    // Finalize the zip file
                    archive.finalize();
                }
            });
        });
    });
};
