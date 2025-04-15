# YAVU IRI Filler-System

Eine moderne Plattform für nadelfreie Hyaluron-Behandlungen in Kosmetikstudios.

## Über das Projekt

Das YAVU IRI Filler-System ist eine innovative Plattform, die es Kunden ermöglicht, nadelfreie Hyaluron-Behandlungen in zertifizierten Kosmetikstudios zu buchen. Die Plattform bietet verschiedene Benutzerrollen (Kunden, Studios, Administratoren) mit spezifischen Funktionen und Dashboards.

## Funktionen

### Für Kunden
- Registrierung und Login
- Suche nach zertifizierten Studios
- Buchung von Terminen
- Verwaltung von Favoriten
- Einsicht in die Behandlungshistorie
- Profilbearbeitung

### Für Studios
- Registrierung und Login
- Terminverwaltung
- Verfügbarkeitseinstellungen
- Schulungsfunktion mit Zertifizierungsmöglichkeit
- Statistiken und Diagramme zur Geschäftsanalyse
- Kundenverwaltung

### Für Administratoren
- Umfassende Benutzerverwaltung
- Studio-Verwaltung mit Genehmigungsprozess
- Systemweite Statistiken und Berichte
- Schulungsverwaltung und Zertifizierungskontrolle

## Technologien

- HTML5
- CSS3 mit responsivem Design
- JavaScript (ES6+)
- Node.js und Express für das Backend
- SQLite Datenbank (migrierbar zu MySQL für Produktion)

## Installation und Verwendung

1. Repository klonen:
   ```
   git clone https://github.com/yourusername/yavu-iri-system.git
   ```

2. In das Projektverzeichnis wechseln:
   ```
   cd yavu-iri-system
   ```

3. Backend-Abhängigkeiten installieren:
   ```
   cd backend
   npm install
   ```

4. Datenbank initialisieren:
   ```
   node initDB.js
   ```

5. Server starten:
   ```
   node server.js
   ```

6. Im Browser öffnen:
   ```
   http://localhost:3000
   ```

## Testbenutzer

Für Testzwecke können folgende Anmeldedaten verwendet werden:

- **Kunde**: Benutzername "kunde", Passwort "password"
- **Studio**: Benutzername "studio", Passwort "password"
- **Admin**: Benutzername "admin", Passwort "password"

## Projektstruktur

```
yavu-iri-system/
├── backend/             # Backend-Code
│   ├── routes/          # API-Routen
│   ├── db.js            # Datenbankverbindung
│   ├── server.js        # Express-Server
│   └── ...
├── images/              # Bilder und Medien
├── styles.css           # Hauptstilsheet
├── responsive.css       # Responsive Design Stilsheet
├── scripts.js           # Hauptskriptdatei
├── responsive.js        # Responsive Design Skripte
├── index.html           # Startseite
├── customer.html        # Kundendashboard
├── studio.html          # Studiodashboard
├── admin.html           # Admindashboard
└── ...
```

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE) Datei für Details.

## Kontakt

YAVU - [info@yavu-iri.de](mailto:info@yavu-iri.de)

Projektlink: [https://github.com/yourusername/yavu-iri-system](https://github.com/yourusername/yavu-iri-system)
