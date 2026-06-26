CREATE DATABASE IF NOT EXISTS leadflow;

USE leadflow;

CREATE TABLE IF NOT EXISTS leads (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    company VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL,

    phone VARCHAR(20),

    status ENUM('New','Contacted','Qualified','Closed')
    DEFAULT 'New',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);