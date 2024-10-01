const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'energieagentur_buenzli',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});

const jsonDirectoryPath = path.join('../data/ESL-JSON');
const csvDirectoryPath = path.join('../data/ESL-CSV'); // Update to the correct path for CSV files

fs.readdir(jsonDirectoryPath, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
        const filePath = path.join(jsonDirectoryPath, file);
        if (path.extname(file) === '.json') {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) throw err;

                const query = 'INSERT INTO JSON_Exports (json_data) VALUES (?)';
                connection.query(query, [data], (err, results) => {
                    if (err) throw err;
                    console.log(`Inserted data from JSON file ${file}: ID = ${results.insertId}`);
                });
            });
        }
    });
});

fs.readdir(csvDirectoryPath, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
        const filePath = path.join(csvDirectoryPath, file);
        if (path.extname(file) === '.csv') {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) throw err;

                const query = 'INSERT INTO CSV_Exports (csv_data) VALUES (?)';
                connection.query(query, [data], (err, results) => {
                    if (err) throw err;
                    console.log(`Inserted data from CSV file ${file}: ID = ${results.insertId}`);
                });
            });
        }
    });
});

// Close the connection after a while to allow all inserts to complete
setTimeout(() => {
    connection.end();
    console.log('Database connection closed.');
}, 5000);
