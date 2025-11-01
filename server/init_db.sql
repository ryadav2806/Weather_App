
CREATE DATABASE IF NOT EXISTS weatherdb;
USE weatherdb;
CREATE TABLE IF NOT EXISTS searches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    temp_c DOUBLE,
    description VARCHAR(255),
    timestamp DATETIME,
    raw_json JSON
);
