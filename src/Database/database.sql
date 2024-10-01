DROP DATABASE IF EXISTS energieagentur_buenzli;
CREATE DATABASE energieagentur_buenzli;
USE energieagentur_buenzli;


CREATE TABLE `Users` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,  -- Benutzer ID 
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `sessions` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,  -- Session ID 
    `user_id` INT NOT NULL,
    `session_id` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`ID`) ON DELETE CASCADE  -- user_id referenziert die ID Spalte von Users
);

CREATE TABLE `Sensors` (
    `ID` VARCHAR(50) PRIMARY KEY,  -- Sensor ID 
    `obis_code` VARCHAR(50) NOT NULL,
    `sensor_type` ENUM('Bezug', 'Einspeisung') NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `Meter_Readings` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,  -- Zählerstands ID 
    `sensor_id` VARCHAR(50),
    `timestamp` TIMESTAMP NOT NULL,
    `absolute_value` DECIMAL(12,4) NOT NULL,
    `relative_value` DECIMAL(12,4) NOT NULL,
    `unit` VARCHAR(50) NOT NULL,
    `condition` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`sensor_id`) REFERENCES `Sensors`(`ID`) ON DELETE CASCADE  -- sensor_id referenziert die ID Spalte von Sensors
);

CREATE TABLE `Interval_Readings` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,  -- Intervall ID
    `sensor_id` VARCHAR(50),
    `start_time` TIMESTAMP NOT NULL,
    `end_time` TIMESTAMP NOT NULL,
    `resolution` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`sensor_id`) REFERENCES `Sensors`(`ID`) ON DELETE CASCADE  -- sensor_id referenziert die ID Spalte von Sensors
);

CREATE TABLE `CSV_Exports` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,  -- CSV Export ID
    `sensor_id` VARCHAR(50),
    `export_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `file_path` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`sensor_id`) REFERENCES `Sensors`(`ID`) ON DELETE CASCADE  -- sensor_id referenziert die ID Spalte von Sensors
);

CREATE TABLE `JSON_Exports` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,  -- JSON Export ID 
    `sensor_id` VARCHAR(50),
    `export_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `json_data` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`sensor_id`) REFERENCES `Sensors`(`ID`) ON DELETE CASCADE  -- sensor_id referenziert die ID Spalte von Sensors
);