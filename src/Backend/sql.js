/*
  VERSION:              Robin Trachsel
  DATE:                 30.09.2024
  DESCRIPTION:          MySQL database connection
*/

const express = require('express');
const MYSQL = require('mysql2');

async function sqlQuery(SQL) {
    return new Promise((resolve, reject) => {
        const CONNECTION = MYSQL.createConnection({
            host: "localhost",
            database: "energieagentur_buenzli",
            user: process.env.MYSQL_USER || "root", // user auf MySQL Workbench ersichtlich
            password: process.env.MYSQL_PWD || "1234" // Ein Passwort, das auf MySQL Workbench gesetzt wurde
        });

        /*
            Windows:
            set MYSQL_USER=root
            set MYSQL_PWD=1234

            echo %MYSQL_USER%
            echo %MYSQL_PWD%
        */

        CONNECTION.connect((err) => {
            if (err) {
                reject(err);
                return;
            }

            CONNECTION.query(SQL, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
                CONNECTION.end();
            });
        });
    });
}

module.exports = sqlQuery;

/*
    Use in async function

    router.get('/users', async (req, res) => {
        const SQL = "SELECT * FROM users";
        const result = await sqlQuery(SQL);
        res.send(result);
    });
*/