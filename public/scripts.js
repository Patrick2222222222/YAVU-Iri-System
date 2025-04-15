// Gemeinsame Funktionen für alle Backoffice-Bereiche
document.addEventListener('DOMContentLoaded', function() {
  console.log('Backoffice-Funktionalität geladen');
  
  // Tab-Wechsel-Funktionalität
  initTabSwitching();
  
  // Notification-Bell-Funktionalität
  initNotificationBell();
  
  // Modal-Funktionalität
  initModals();
  
  // Logout-Funktionalität
  initLogout();
});

// Tab-Wechsel-Funktionalität
function initTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabButtons.length > 0) {
    console.log('Tab-Buttons gefunden:', tabButtons.length);
    
    // Standardmäßig ersten Tab aktivieren, wenn kein aktiver Tab vorhanden ist
    let activeTabFound = false;
    tabButtons.forEach(button => {
      if (button.classList.contains('active')) {
        activeTabFound = true;
        const targetId = button.getAttribute('data-target');
        if (targetId) {
          showTabContent(targetId);
        }
      }
    });
    
    if (!activeTabFound && tabButtons.length > 0) {
      tabButtons[0].classList.add('active');
      const targetId = tabButtons[0].getAttribute('data-target');
      if (targetId) {
        showTabContent(targetId);
      }
    }
    
    // Event-Listener für Tab-Buttons
    tabButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Aktiven Tab-Button entfernen
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Aktuellen Tab-Button aktivieren
        this.classList.add('active');
        
        // Tab-Inhalt anzeigen
        const targetId = this.getAttribute('data-target');
        if (targetId) {
          showTabContent(targetId);
        }
      });
    });
  } else {
    console.log('Keine Tab-Buttons gefunden');
  }
  
  // Funktion zum Anzeigen des Tab-Inhalts
  function showTabContent(targetId) {
    console.log('Zeige Tab-Inhalt:', targetId);
    
    // Alle Tab-Inhalte ausblenden
    tabContents.forEach(content => {
      content.style.display = 'none';
    });
    
    // Ziel-Tab-Inhalt anzeigen
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.style.display = 'block';
    } else {
      console.error('Tab-Inhalt nicht gefunden:', targetId);
    }
  }
}

// Notification-Bell-Funktionalität
function initNotificationBell() {
  const notificationBell = document.getElementById('notificationBell');
  const notificationDropdown = document.getElementById('notificationDropdown');
  
  if (notificationBell && notificationDropdown) {
    console.log('Notification-Bell gefunden');
    
    notificationBell.addEventListener('click', function(e) {
      e.stopPropagation();
      notificationDropdown.classList.toggle('show');
    });
    
    // Dropdown schließen, wenn außerhalb geklickt wird
    document.addEventListener('click', function(e) {
      if (!notificationBell.contains(e.target) && !notificationDropdown.contains(e.target)) {
        notificationDropdown.classList.remove('show');
      }
    });
  } else {
    console.log('Notification-Bell oder Dropdown nicht gefunden');
  }
}

// Modal-Funktionalität
function initModals() {
  const modals = document.querySelectorAll('.modal');
  const modalTriggers = document.querySelectorAll('[id$="Btn"]');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  if (modals.length > 0) {
    console.log('Modals gefunden:', modals.length);
    
    // Modal-Trigger-Buttons
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Modal-ID aus Button-ID ableiten
        let modalId = '';
        
        if (this.id === 'newBookingBtn' || this.id === 'appointmentsBookingBtn') {
          modalId = 'bookingModal';
        } else if (this.id === 'addStudioAction') {
          modalId = 'studioModal';
        } else if (this.id === 'sendMessageAction') {
          modalId = 'messageModal';
        } else if (this.id === 'addTrainingAction' || this.id === 'uploadTrainingBtn') {
          modalId = 'trainingModal';
        } else if (this.id === 'manageAccessBtn') {
          modalId = 'accessModal';
        } else if (this.id.includes('review')) {
          modalId = 'reviewModal';
        } else if (this.id.includes('message')) {
          modalId = 'messageModal';
        } else if (this.id === 'showAddTreatmentBtn') {
          // Behandlungsformular ein-/ausblenden
          const formContainer = document.getElementById('addTreatmentFormContainer');
          if (formContainer) {
            formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
          }
          return;
        }
        
        // Modal öffnen
        if (modalId) {
          const modal = document.getElementById(modalId);
          if (modal) {
            modal.style.display = 'block';
          }
        }
      });
    });
    
    // Schließen-Buttons
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });
    
    // Modals schließen, wenn außerhalb geklickt wird
    window.addEventListener('click', function(e) {
      modals.forEach(modal => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    });
    
    // Formular-Submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Formular-ID auswerten und entsprechende Aktion ausführen
        const formId = this.id;
        console.log('Formular abgesendet:', formId);
        
        // Erfolgsmeldung anzeigen
        showSuccessMessage(formId);
        
        // Modal schließen
        const modal = this.closest('.modal');
        if (modal) {
          setTimeout(() => {
            modal.style.display = 'none';
          }, 1500);
        }
        
        // Formular zurücksetzen
        this.reset();
      });
    });
  } else {
    console.log('Keine Modals gefunden');
  }
  
  // Erfolgsmeldung anzeigen
  function showSuccessMessage(formId) {
    let message = '';
    
    switch(formId) {
      case 'bookingForm':
        message = 'Termin erfolgreich gebucht!';
        break;
      case 'profileForm':
        message = 'Profil erfolgreich gespeichert!';
        break;
      case 'reviewForm':
        message = 'Bewertung erfolgreich abgesendet!';
        break;
      case 'messageForm':
        message = 'Nachricht erfolgreich gesendet!';
        break;
      case 'addStudioForm':
        message = 'Studio erfolgreich hinzugefügt!';
        break;
      case 'sendMessageForm':
        message = 'Nachricht erfolgreich gesendet!';
        break;
      case 'uploadTrainingForm':
        message = 'Schulung erfolgreich hochgeladen!';
        break;
      case 'availabilityForm':
        message = 'Öffnungszeiten erfolgreich gespeichert!';
        break;
      case 'addTreatmentForm':
        message = 'Behandlung erfolgreich hinzugefügt!';
        break;
      default:
        message = 'Aktion erfolgreich ausgeführt!';
    }
    
    // Toast-Nachricht anzeigen
    showToast(message);
  }
}

// Logout-Funktionalität
function initLogout() {
  const logoutButton = document.getElementById('logoutButton');
  
  if (logoutButton) {
    console.log('Logout-Button gefunden');
    
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Bestätigungsdialog anzeigen
      if (confirm('Möchten Sie sich wirklich abmelden?')) {
        // Zur Login-Seite zurückkehren
        window.location.href = 'index.html';
      }
    });
  } else {
    console.log('Logout-Button nicht gefunden');
  }
}

// Toast-Nachricht anzeigen
function showToast(message, duration = 3000) {
  // Bestehende Toast-Nachrichten entfernen
  const existingToasts = document.querySelectorAll('.toast-message');
  existingToasts.forEach(toast => {
    document.body.removeChild(toast);
  });
  
  // Neue Toast-Nachricht erstellen
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  
  // Toast-Styling
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = '#4CAF50';
  toast.style.color = 'white';
  toast.style.padding = '15px 20px';
  toast.style.borderRadius = '4px';
  toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  toast.style.zIndex = '9999';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease-in-out';
  
  // Toast zum DOM hinzufügen
  document.body.appendChild(toast);
  
  // Toast anzeigen
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // Toast nach Dauer ausblenden
  setTimeout(() => {
    toast.style.opacity = '0';
    
    // Toast nach Ausblenden entfernen
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// Hilfsfunktion zum Hinzufügen von Dummy-Daten
function populateDummyData() {
  // Termine für Kunden-Dashboard
  const appointmentsContainer = document.querySelector('.appointments-container');
  if (appointmentsContainer) {
    appointmentsContainer.innerHTML = `
      <div class="appointment-card">
        <div class="appointment-date">15. März 2025</div>
        <div class="appointment-time">14:30 Uhr</div>
        <div class="appointment-details">
          <h3>IRI Filler-Behandlung</h3>
          <p>Beauty Lounge Berlin</p>
        </div>
        <div class="appointment-status confirmed">Bestätigt</div>
      </div>
      <div class="appointment-card">
        <div class="appointment-date">22. April 2025</div>
        <div class="appointment-time">10:00 Uhr</div>
        <div class="appointment-details">
          <h3>IRI Filler-Auffrischung</h3>
          <p>Aesthetic Sense München</p>
        </div>
        <div class="appointment-status pending">Ausstehend</div>
      </div>
    `;
  }
  
  // Studios für Kunden-Dashboard
  const studiosContainer = document.querySelector('.studios-container');
  if (studiosContainer) {
    studiosContainer.innerHTML = `
      <div class="studio-card">
        <div class="studio-image">
          <img src="images/studio1.jpg" alt="Beauty Lounge Berlin" />
        </div>
        <h3>Beauty Lounge Berlin</h3>
        <div class="studio-rating">★★★★★</div>
        <p>Spezialisiert auf IRI Filler-Behandlungen</p>
        <button class="action-btn">TERMIN BUCHEN</button>
      </div>
      <div class="studio-card">
        <div class="studio-image">
          <img src="images/studio2.jpg" alt="Aesthetic Sense München" />
        </div>
        <h3>Aesthetic Sense München</h3>
        <div class="studio-rating">★★★★☆</div>
        <p>Premium-Studio für Gesichtsbehandlungen</p>
        <button class="action-btn">TERMIN BUCHEN</button>
      </div>
    `;
  }
  
  // Angebote für Kunden-Dashboard
  const offersContainer = document.querySelector('.offers-container');
  if (offersContainer) {
    offersContainer.innerHTML = `
      <div class="offer-card">
        <div class="offer-badge">NEU</div>
        <h3>Frühlings-Special</h3>
        <p>20% Rabatt auf alle IRI Filler-Behandlungen im März</p>
        <button class="action-btn">MEHR ERFAHREN</button>
      </div>
      <div class="offer-card">
        <div class="offer-badge">BELIEBT</div>
        <h3>Freundinnen-Paket</h3>
        <p>Buchen Sie zu zweit und erhalten Sie 15% Rabatt</p>
        <button class="action-btn">MEHR ERFAHREN</button>
      </div>
    `;
  }
  
  // Buchungen für Studio-Dashboard
  const dashboardBookingsTable = document.getElementById('dashboardBookingsTable');
  if (dashboardBookingsTable) {
    dashboardBookingsTable.innerHTML = `
      <tr>
        <td>15.03.2025</td>
        <td>14:30</td>
        <td>Marie Schmidt</td>
        <td>IRI Filler-Behandlung</td>
        <td><span class="status-badge confirmed">Bestätigt</span></td>
        <td>
          <button class="action-btn small"><i class="fas fa-eye"></i></button>
          <button class="action-btn small"><i class="fas fa-edit"></i></button>
          <button class="action-btn small"><i class="fas fa-times"></i></button>
        </td>
      </tr>
      <tr>
        <td>16.03.2025</td>
        <td>10:00</td>
        <td>Thomas Müller</td>
        <td>IRI Filler-Behandlung</td>
        <td><span class="status-badge pending">Ausstehend</span></td>
        <td>
          <button class="action-btn small"><i class="fas fa-eye"></i></button>
          <button class="action-btn small"><i class="fas fa-edit"></i></button>
          <button class="action-btn small"><i class="fas fa-times"></i></button>
        </td>
      </tr>
    `;
  }
  
  // Studios für Admin-Dashboard
  const studiosTable = document.getElementById('studiosTable');
  if (studiosTable && studiosTable.querySelector('tbody')) {
    studiosTable.querySelector('tbody').innerHTML = `
      <tr>
        <td>Beauty Lounge Köln</td>
        <td>Köln</td>
        <td>01.03.2025</td>
        <td><span class="status-badge pending">Prüfung</span></td>
        <td>
          <button class="action-btn small"><i class="fas fa-eye"></i></button>
          <button class="action-btn small"><i class="fas fa-edit"></i></button>
          <button class="action-btn small"><i class="fas fa-check"></i></button>
        </td>
      </tr>
      <tr>
        <td>Skin Perfect Hamburg</td>
        <td>Hamburg</td>
        <td>28.02.2025</td>
        <td><span class="status-badge active">Aktiv</span></td>
        <td>
          <button class="action-btn small"><i class="fas fa-eye"></i></button>
          <button class="action-btn small"><i class="fas fa-edit"></i></button>
          <button class="action-btn small"><i class="fas fa-times"></i></button>
        </td>
      </tr>
    `;
  }
  
  // Nachrichten für Admin-Dashboard
  const messagesContainer = document.getElementById('messagesContainer');
  if (messagesContainer) {
    messagesContainer.innerHTML = `
      <div class="message-card">
        <div class="message-header">
          <div class="message-sender">Beauty Lounge Berlin</div>
          <div class="message-date">03.03.2025</div>
        </div>
        <div class="message-subject">Frage zur Zertifizierung</div>
        <div class="message-preview">Sehr geehrtes YAVU-Team, wir haben eine Frage bezüglich der Verlängerung unserer Zertifizierung...</div>
        <div class="message-actions">
          <button class="action-btn small"><i class="fas fa-reply"></i></button>
          <button class="action-btn small"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="message-card">
        <div class="message-header">
          <div class="message-sender">Aesthetic Sense München</div>
          <div class="message-date">01.03.2025</div>
        </div>
        <div class="message-subject">Schulungstermine</div>
        <div class="message-preview">Hallo, wir möchten gerne weitere Mitarbeiter für das IRI Filler-System schulen lassen...</div>
        <div class="message-actions">
          <button class="action-btn small"><i class="fas fa-reply"></i></button>
          <button class="action-btn small"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  }
  
  // Schulungen für Admin-Dashboard
  const basicTrainingList = document.getElementById('basicTrainingList');
  if (basicTrainingList) {
    basicTrainingList.innerHTML = `
      <div class="training-item">
        <div class="training-info">
          <h4>IRI Filler-System Grundlagen</h4>
          <p>Einführung in die nadelfreie Technologie</p>
        </div>
        <div class="training-actions">
          <button class="action-btn small"><i class="fas fa-edit"></i></button>
          <button class="action-btn small"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="training-item">
        <div class="training-info">
          <h4>Hygiene und Sicherheit</h4>
          <p>Grundlegende Hygienevorschriften</p>
        </div>
        <div class="training-actions">
          <button class="action-btn small"><i class="fas fa-edit"></i></button>
          <button class="action-btn small"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  }
  
  const advancedTrainingList = document.getElementById('advancedTrainingList');
  if (advancedTrainingList) {
    advancedTrainingList.innerHTML = `
      <div class="training-item">
        <div class="training-info">
          <h4>Fortgeschrittene Anwendungstechniken</h4>
          <p>Präzise Anwendung für optimale Ergebnisse</p>
        </div>
        <div class="training-actions">
          <button class="action-btn small"><i class="fas fa-edit"></i></button>
          <button class="action-btn small"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  }
  
  const specialTrainingList = document.getElementById('specialTrainingList');
  if (specialTrainingList) {
    specialTrainingList.innerHTML = `
      <div class="training-item">
        <div class="training-info">
          <h4>Spezial-Technik: Konturierung</h4>
          <p>Fortgeschrittene Konturierungstechniken</p>
        </div>
        <div class="training-actions">
          <button class="action-btn small"><i class="fas fa-edit"></i></button>
          <button class="action-btn small"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  }
}

// Dummy-Daten beim Laden der Seite einfügen
document.addEventListener('DOMContentLoaded', function() {
  populateDummyData();
});
