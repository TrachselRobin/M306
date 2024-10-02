DROP DATABASE IF EXISTS `energieagentur_buenzli`;
CREATE DATABASE `energieagentur_buenzli`;
USE `energieagentur_buenzli`;

-- Beibehalten der Tabelle Users
CREATE TABLE `Users` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,  -- Benutzer ID umbenannt zu ID
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelle für SDAT-Dateien
CREATE TABLE `sdat` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,
    `IntervalStartTime` DATETIME,
    `IntervalEndTime` DATETIME,
    `DocumentID` VARCHAR(255),
    `VersionID` VARCHAR(50)
);

-- Tabelle für SDAT-Intervalldaten
CREATE TABLE `sdat_intervals` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,
    `sdat_ID` INT,
    `sequenceNr` INT,
    `volume` DECIMAL(10, 4),
    FOREIGN KEY (`sdat_ID`) REFERENCES `sdat`(`ID`)
);

-- Tabelle für ESL-Dateien
CREATE TABLE `esl` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,
    `TimePeriodEnd` DATETIME UNIQUE  -- Es sollte jeweils immer nur einmal dieselbe TimePeriodEnd vorkommen
);

-- Tabelle für OBIS-Daten
CREATE TABLE `obis` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(20),
    `value` DECIMAL(10, 4),
    `status` VARCHAR(10)
);

CREATE TABLE `esl_time_periods` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,
    `esl_ID` INT NOT NULL,
    `TimePeriodEnd` DATETIME NOT NULL,
    UNIQUE KEY (`TimePeriodEnd`)
);

INSERT INTO `Users` (username, password_hash, email) VALUES
('Robin', '84i8fNlTuVH/344GJ12UlG3FLwPtllNkl/vlNEadONY=', 'asdf@asdf.asdf');