const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const jsonDir = path.join(__dirname, '..', 'data', 'SDAT-JSON');
const csvDir = path.join(__dirname, '..', 'data', 'SDAT-CSV');

if (!fs.existsSync(jsonDir)) {
  fs.mkdirSync(jsonDir);
}

if (!fs.existsSync(csvDir)) {
  fs.mkdirSync(csvDir);
}

router.get('', (req, res) => {
  const dirPath = path.join(__dirname, '..', 'data', 'SDAT-Files');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Fehler beim Lesen des Verzeichnisses', error: err });
    }

    res.json({ files });
  });
});

router.get('/convert-json', (req, res) => {
  const dirPath = path.join(__dirname, '..', 'data', 'SDAT-Files');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Fehler beim Lesen des Verzeichnisses', error: err });
    }

    const xmlFiles = files.filter(file => file.endsWith('.xml'));
    const parser = new xml2js.Parser();
    const jsonResults = [];

    xmlFiles.forEach(file => {
      const filePath = path.join(dirPath, file);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          return res.status(500).json({ message: 'Fehler beim Lesen der Datei', error: err });
        }

        parser.parseString(data, (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Fehler beim Parsen der XML', error: err });
          }
          jsonResults.push(result);

          const jsonFilePath = path.join(jsonDir, `${file.replace('.xml', '.json')}`);
          fs.writeFile(jsonFilePath, JSON.stringify(result, null, 2), (err) => {
            if (err) {
              return res.status(500).json({ message: 'Fehler beim Speichern der JSON-Datei', error: err });
            }
          });

          if (jsonResults.length === xmlFiles.length) {
            res.json(jsonResults);
          }
        });
      });
    });
  });
});

router.get('/convert-csv', (req, res) => {
  const dirPath = path.join(__dirname, '..', 'data', 'SDAT-Files');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Fehler beim Lesen des Verzeichnisses', error: err });
    }

    const xmlFiles = files.filter(file => file.endsWith('.xml'));
    const parser = new xml2js.Parser();
    const csvResults = [];

    xmlFiles.forEach(file => {
      const filePath = path.join(dirPath, file);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          return res.status(500).json({ message: 'Fehler beim Lesen der Datei', error: err });
        }

        parser.parseString(data, (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Fehler beim Parsen der XML', error: err });
          }

          const csvData = convertToCSV(result);
          csvResults.push(csvData);

          const csvFilePath = path.join(csvDir, `${file.replace('.xml', '.csv')}`);
          fs.writeFile(csvFilePath, csvData, (err) => {
            if (err) {
              return res.status(500).json({ message: 'Fehler beim Speichern der CSV-Datei', error: err });
            }
          });

          if (csvResults.length === xmlFiles.length) {
            res.type('text/csv');
            res.send(csvResults.join('\n'));
          }
        });
      });
    });
  });
});

const convertToCSV = (json) => {
  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const pre = prefix.length ? `${prefix}.` : '';
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
      } else {
        acc[`${pre}${key}`] = obj[key];
      }
      return acc;
    }, {});
  };

  const dataArray = Array.isArray(json) ? json : [json];

  const flattenedData = dataArray.map(flattenObject);

  const header = Object.keys(flattenedData[0]).join(',') + '\n';
  const rows = flattenedData.map(row => Object.values(row).join(',')).join('\n');

  return header + rows;
};

module.exports = router;
