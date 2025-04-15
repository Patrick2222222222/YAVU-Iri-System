# Datenbankdesign für YAVU IRI Filler-System

## Übersicht

Für die YAVU IRI Filler-System Plattform wird eine relationale Datenbankstruktur implementiert, die die bestehenden Daten aus der statischen JSON-Struktur übernimmt und erweitert. Die Datenbank wird so konzipiert, dass sie skalierbar ist und zukünftige Funktionserweiterungen unterstützt.

## Datenbankschema

### Tabellen

#### 1. Users
```
users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    type ENUM('admin', 'studio', 'kunde') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

#### 2. Studios
```
studios (
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
```

#### 3. Customers
```
customers (
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
```

#### 4. Treatments
```
treatments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    studio_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration INT NOT NULL, /* in minutes */
    price DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
)
```

#### 5. Availability
```
availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    studio_id INT NOT NULL,
    day_of_week TINYINT NOT NULL, /* 1-7 for Monday-Sunday */
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
)
```

#### 6. Appointments
```
appointments (
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
```

#### 7. Reviews
```
reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    studio_id INT NOT NULL,
    appointment_id INT NOT NULL,
    rating TINYINT NOT NULL, /* 1-5 */
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
)
```

#### 8. Favorites
```
favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    studio_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE,
    UNIQUE KEY (customer_id, studio_id)
)
```

## Beziehungen

- Ein User kann entweder ein Admin, ein Studio oder ein Kunde sein (1:1 Beziehung mit entsprechender Tabelle)
- Ein Studio bietet mehrere Treatments an (1:n Beziehung)
- Ein Studio hat mehrere Verfügbarkeiten (1:n Beziehung)
- Ein Kunde kann mehrere Termine buchen (1:n Beziehung)
- Ein Kunde kann mehrere Bewertungen abgeben (1:n Beziehung)
- Ein Kunde kann mehrere Studios als Favoriten markieren (n:m Beziehung)

## Implementierungsplan

1. Einrichtung einer MySQL-Datenbank
2. Erstellung der Tabellen gemäß dem oben definierten Schema
3. Migration der bestehenden Daten aus der JSON-Struktur
4. Implementierung einer API für den Datenbankzugriff
5. Integration der API in das Frontend
