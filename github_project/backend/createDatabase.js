// Skript zum Erstellen der MySQL-Datenbank und Tabellen

const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  let connection;

  try {
    // Verbindung zum MySQL-Server herstellen (ohne Datenbank)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('Verbindung zum MySQL-Server hergestellt');

    // Datenbank erstellen, falls sie nicht existiert
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Datenbank ${process.env.DB_NAME} erstellt oder bereits vorhanden`);

    // Verbindung zur erstellten Datenbank herstellen
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log(`Datenbank ${process.env.DB_NAME} ausgewählt`);

    // Tabellen erstellen
    console.log('Erstelle Tabellen...');

    // Users Tabelle
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        type ENUM('admin', 'studio', 'kunde') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Users Tabelle erstellt');

    // Studios Tabelle
    await connection.query(`
      CREATE TABLE IF NOT EXISTS studios (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        contact VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        rating DECIMAL(2,1) DEFAULT 0,
        review_count INT DEFAULT 0,
        status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
        registration_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Studios Tabelle erstellt');

    // Customers Tabelle
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        phone VARCHAR(20),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Customers Tabelle erstellt');

    // Treatments Tabelle
    await connection.query(`
      CREATE TABLE IF NOT EXISTS treatments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        studio_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        duration INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
      )
    `);
    console.log('Treatments Tabelle erstellt');

    // Availability Tabelle
    await connection.query(`
      CREATE TABLE IF NOT EXISTS availability (
        id INT PRIMARY KEY AUTO_INCREMENT,
        studio_id INT NOT NULL,
        day_of_week TINYINT NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
      )
    `);
    console.log('Availability Tabelle erstellt');

    // Appointments Tabelle
    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        studio_id INT NOT NULL,
        treatment_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
        FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE
      )
    `);
    console.log('Appointments Tabelle erstellt');

    // Reviews Tabelle
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        studio_id INT NOT NULL,
        appointment_id INT NOT NULL,
        rating TINYINT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
      )
    `);
    console.log('Reviews Tabelle erstellt');

    // Favorites Tabelle
    await connection.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        studio_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
        UNIQUE KEY (customer_id, studio_id)
      )
    `);
    console.log('Favorites Tabelle erstellt');

    console.log('Alle Tabellen wurden erfolgreich erstellt');

  } catch (error) {
    console.error('Fehler beim Erstellen der Datenbank:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Datenbankverbindung geschlossen');
    }
  }
}

// Skript ausführen
createDatabase();
