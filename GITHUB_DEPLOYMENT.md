# YAVU IRI Filler-System - Bereitstellung auf GitHub

Diese Anleitung beschreibt, wie das YAVU IRI Filler-System auf GitHub bereitgestellt werden kann.

## Vorbereitete Dateien

Das Repository wurde bereits mit allen notwendigen Dateien vorbereitet:

- Frontend-Dateien (HTML, CSS, JavaScript)
- Backend-Komponenten (Node.js/Express)
- Dokumentation (README.md)
- Lizenzinformationen (LICENSE)
- .gitignore-Konfiguration

## Schritte zur GitHub-Bereitstellung

1. **GitHub-Konto erstellen** (falls noch nicht vorhanden)
   - Besuchen Sie [GitHub](https://github.com/)
   - Klicken Sie auf "Sign up" und folgen Sie den Anweisungen

2. **Neues Repository erstellen**
   - Klicken Sie auf das "+" Symbol in der oberen rechten Ecke
   - Wählen Sie "New repository"
   - Geben Sie einen Namen ein (z.B. "yavu-iri-system")
   - Fügen Sie eine Beschreibung hinzu
   - Wählen Sie "Public" für öffentlichen Zugriff
   - Klicken Sie auf "Create repository"

3. **Lokales Repository initialisieren und Dateien hochladen**
   ```bash
   # Im Projektverzeichnis
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/IHR_BENUTZERNAME/yavu-iri-system.git
   git push -u origin main
   ```

4. **GitHub Pages aktivieren** (optional für Frontend-Hosting)
   - Gehen Sie zu den Repository-Einstellungen
   - Scrollen Sie zu "GitHub Pages"
   - Wählen Sie den Branch "main" und den Ordner "/" oder "/docs"
   - Klicken Sie auf "Save"

5. **README und Dokumentation überprüfen**
   - Stellen Sie sicher, dass alle Links und Informationen korrekt sind
   - Aktualisieren Sie die Kontaktinformationen

## Zusätzliche Empfehlungen

- **GitHub Issues aktivieren** für Fehlerverfolgung und Feature-Anfragen
- **GitHub Actions** für automatisierte Tests und Deployments einrichten
- **Collaborators hinzufügen**, um anderen Zugriff auf das Repository zu gewähren
- **Branch-Schutzregeln** für den Hauptzweig einrichten

## Nach der Bereitstellung

Nach erfolgreicher Bereitstellung auf GitHub können Sie:

1. Die URL des Repositories mit anderen teilen
2. Pull Requests für Verbesserungen akzeptieren
3. Issues für Fehler und Feature-Anfragen verwalten
4. Releases für wichtige Versionen erstellen

## Hinweise zur Weiterentwicklung

Für die Weiterentwicklung des Projekts empfehlen wir:

1. Feature-Branches für neue Funktionen zu erstellen
2. Pull Requests für Code-Reviews zu nutzen
3. Semantische Versionierung für Releases zu verwenden
4. Die Dokumentation kontinuierlich zu aktualisieren
