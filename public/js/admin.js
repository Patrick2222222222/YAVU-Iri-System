// Spezifische Funktionen für den Admin-Bereich
document.addEventListener('DOMContentLoaded', function() {
  console.log('Admin-Funktionalität geladen');
  
  // Sidebar-Menü initialisieren
  initSidebarMenu();
  
  // Schulungsbereich initialisieren
  initTrainingSection();
  
  // Statistiken initialisieren
  initStats();
});

// Sidebar-Menü initialisieren
function initSidebarMenu() {
  const menuItems = document.querySelectorAll('.sidebar-menu a');
  
  if (menuItems.length > 0) {
    menuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Aktiven Menüpunkt entfernen
        menuItems.forEach(menuItem => {
          menuItem.classList.remove('active');
        });
        
        // Aktuellen Menüpunkt aktivieren
        this.classList.add('active');
        
        // Seiteninhalt aktualisieren basierend auf Menüpunkt
        updateContent(this.textContent.trim());
      });
    });
    
    // Schulungsmenü-Link speziell behandeln
    const trainingMenuLink = document.getElementById('trainingMenuLink');
    if (trainingMenuLink) {
      trainingMenuLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Aktiven Menüpunkt entfernen
        menuItems.forEach(menuItem => {
          menuItem.classList.remove('active');
        });
        
        // Aktuellen Menüpunkt aktivieren
        this.classList.add('active');
        
        // Schulungsbereich anzeigen
        showTrainingSection();
      });
    }
  }
  
  // Seiteninhalt aktualisieren
  function updateContent(menuItem) {
    // Hier würde der Inhalt basierend auf dem Menüpunkt geladen werden
    console.log(`Menüpunkt "${menuItem}" ausgewählt`);
    
    // Schulungsbereich ein-/ausblenden
    const trainingSection = document.getElementById('trainingManagementSection');
    if (trainingSection) {
      trainingSection.style.display = menuItem.includes('Schulungen') ? 'block' : 'none';
    }
  }
  
  // Schulungsbereich anzeigen
  function showTrainingSection() {
    const trainingSection = document.getElementById('trainingManagementSection');
    if (trainingSection) {
      trainingSection.style.display = 'block';
    }
  }
}

// Schulungsbereich initialisieren
function initTrainingSection() {
  // Upload-Button
  const uploadTrainingBtn = document.getElementById('uploadTrainingBtn');
  if (uploadTrainingBtn) {
    uploadTrainingBtn.addEventListener('click', function() {
      const trainingModal = document.getElementById('trainingModal');
      if (trainingModal) {
        trainingModal.style.display = 'block';
      }
    });
  }
  
  // Zugang-Verwalten-Button
  const manageAccessBtn = document.getElementById('manageAccessBtn');
  if (manageAccessBtn) {
    manageAccessBtn.addEventListener('click', function() {
      const accessModal = document.getElementById('accessModal');
      if (accessModal) {
        // Schulungen für Dropdown laden
        const accessTraining = document.getElementById('accessTraining');
        if (accessTraining) {
          accessTraining.innerHTML = `
            <option value="">Schulung auswählen...</option>
            <option value="1">IRI Filler-System Grundlagen</option>
            <option value="2">Hygiene und Sicherheit</option>
            <option value="3">Fortgeschrittene Anwendungstechniken</option>
            <option value="4">Spezial-Technik: Konturierung</option>
          `;
        }
        
        // Studios für Zugriffsliste laden
        const studioAccessList = document.getElementById('studioAccessList');
        if (studioAccessList) {
          studioAccessList.innerHTML = `
            <div class="studio-access-item">
              <div class="studio-name">Beauty Lounge Berlin</div>
              <div class="access-toggle">
                <input type="checkbox" id="access1" checked>
                <label for="access1"></label>
              </div>
            </div>
            <div class="studio-access-item">
              <div class="studio-name">Aesthetic Sense München</div>
              <div class="access-toggle">
                <input type="checkbox" id="access2" checked>
                <label for="access2"></label>
              </div>
            </div>
            <div class="studio-access-item">
              <div class="studio-name">Skin Perfect Hamburg</div>
              <div class="access-toggle">
                <input type="checkbox" id="access3">
                <label for="access3"></label>
              </div>
            </div>
            <div class="studio-access-item">
              <div class="studio-name">Beauty Lounge Köln</div>
              <div class="access-toggle">
                <input type="checkbox" id="access4">
                <label for="access4"></label>
              </div>
            </div>
          `;
        }
        
        // Modal anzeigen
        accessModal.style.display = 'block';
      }
    });
  }
  
  // Allen Zugang gewähren
  const grantAllAccessBtn = document.getElementById('grantAllAccessBtn');
  if (grantAllAccessBtn) {
    grantAllAccessBtn.addEventListener('click', function() {
      const accessCheckboxes = document.querySelectorAll('#studioAccessList input[type="checkbox"]');
      accessCheckboxes.forEach(checkbox => {
        checkbox.checked = true;
      });
    });
  }
  
  // Allen Zugang entziehen
  const revokeAllAccessBtn = document.getElementById('revokeAllAccessBtn');
  if (revokeAllAccessBtn) {
    revokeAllAccessBtn.addEventListener('click', function() {
      const accessCheckboxes = document.querySelectorAll('#studioAccessList input[type="checkbox"]');
      accessCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    });
  }
  
  // Änderungen speichern
  const saveAccessBtn = document.getElementById('saveAccessBtn');
  if (saveAccessBtn) {
    saveAccessBtn.addEventListener('click', function() {
      // Hier würden die Zugriffsrechte gespeichert werden
      showToast('Zugriffsrechte erfolgreich gespeichert!');
      
      // Modal schließen
      const accessModal = document.getElementById('accessModal');
      if (accessModal) {
        accessModal.style.display = 'none';
      }
    });
  }
  
  // Schulungs-Upload-Formular
  const uploadTrainingForm = document.getElementById('uploadTrainingForm');
  if (uploadTrainingForm) {
    uploadTrainingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Upload-Fortschritt simulieren
      const uploadProgressBar = document.getElementById('uploadProgressBar');
      if (uploadProgressBar) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          uploadProgressBar.style.width = `${progress}%`;
          
          if (progress >= 100) {
            clearInterval(interval);
            
            // Erfolgsmeldung anzeigen
            showToast('Schulung erfolgreich hochgeladen!');
            
            // Modal schließen
            const trainingModal = document.getElementById('trainingModal');
            if (trainingModal) {
              setTimeout(() => {
                trainingModal.style.display = 'none';
                
                // Formular zurücksetzen
                uploadTrainingForm.reset();
                uploadProgressBar.style.width = '0%';
              }, 1000);
            }
          }
        }, 300);
      }
    });
  }
  
  // Schulungslisten mit Event-Listenern versehen
  initTrainingListButtons();
}

// Schulungslisten-Buttons initialisieren
function initTrainingListButtons() {
  // Bearbeiten-Buttons
  const editButtons = document.querySelectorAll('.training-actions .fa-edit');
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const trainingItem = this.closest('.training-item');
      const trainingTitle = trainingItem.querySelector('h4').textContent;
      
      // Schulungs-Modal öffnen
      const trainingModal = document.getElementById('trainingModal');
      if (trainingModal) {
        // Formularfelder mit Schulungsdaten füllen
        const trainingTitleInput = document.getElementById('trainingTitle');
        const trainingDescription = document.getElementById('trainingDescription');
        
        if (trainingTitleInput && trainingDescription) {
          trainingTitleInput.value = trainingTitle;
          trainingDescription.value = trainingItem.querySelector('p').textContent;
        }
        
        // Modal anzeigen
        trainingModal.style.display = 'block';
      }
    });
  });
  
  // Löschen-Buttons
  const deleteButtons = document.querySelectorAll('.training-actions .fa-trash');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const trainingItem = this.closest('.training-item');
      const trainingTitle = trainingItem.querySelector('h4').textContent;
      
      if (confirm(`Möchten Sie die Schulung "${trainingTitle}" wirklich löschen?`)) {
        // Schulung entfernen
        trainingItem.remove();
        
        // Erfolgsmeldung anzeigen
        showToast('Schulung erfolgreich gelöscht!');
      }
    });
  });
}

// Statistiken initialisieren
function initStats() {
  // Hier würden die Statistiken mit echten Daten gefüllt werden
  
  // Schnellaktionen initialisieren
  initQuickActions();
}

// Schnellaktionen initialisieren
function initQuickActions() {
  // Neues Studio
  const addStudioAction = document.getElementById('addStudioAction');
  if (addStudioAction) {
    addStudioAction.addEventListener('click', function() {
      const studioModal = document.getElementById('studioModal');
      if (studioModal) {
        studioModal.style.display = 'block';
      }
    });
  }
  
  // Nachricht senden
  const sendMessageAction = document.getElementById('sendMessageAction');
  if (sendMessageAction) {
    sendMessageAction.addEventListener('click', function() {
      const messageModal = document.getElementById('messageModal');
      if (messageModal) {
        // Empfänger-Dropdown füllen
        const messageRecipient = document.getElementById('messageRecipient');
        if (messageRecipient) {
          messageRecipient.innerHTML = `
            <option value="">Empfänger wählen...</option>
            <option value="all">Alle Studios</option>
            <option value="1">Beauty Lounge Berlin</option>
            <option value="2">Aesthetic Sense München</option>
            <option value="3">Skin Perfect Hamburg</option>
            <option value="4">Beauty Lounge Köln</option>
          `;
        }
        
        // Modal anzeigen
        messageModal.style.display = 'block';
      }
    });
  }
  
  // Schulung anlegen
  const addTrainingAction = document.getElementById('addTrainingAction');
  if (addTrainingAction) {
    addTrainingAction.addEventListener('click', function() {
      const trainingModal = document.getElementById('trainingModal');
      if (trainingModal) {
        trainingModal.style.display = 'block';
      }
    });
  }
  
  // Studio-Formular
  const addStudioForm = document.getElementById('addStudioForm');
  if (addStudioForm) {
    addStudioForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Hier würde das Studio gespeichert werden
      showToast('Studio erfolgreich hinzugefügt!');
      
      // Modal schließen
      const studioModal = document.getElementById('studioModal');
      if (studioModal) {
        setTimeout(() => {
          studioModal.style.display = 'none';
          
          // Formular zurücksetzen
          addStudioForm.reset();
        }, 1000);
      }
    });
  }
  
  // Nachrichten-Formular
  const sendMessageForm = document.getElementById('sendMessageForm');
  if (sendMessageForm) {
    sendMessageForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Hier würde die Nachricht gesendet werden
      showToast('Nachricht erfolgreich gesendet!');
      
      // Modal schließen
      const messageModal = document.getElementById('messageModal');
      if (messageModal) {
        setTimeout(() => {
          messageModal.style.display = 'none';
          
          // Formular zurücksetzen
          sendMessageForm.reset();
        }, 1000);
      }
    });
  }
}

// Toast-Nachricht anzeigen (falls nicht in scripts.js definiert)
function showToast(message, duration = 3000) {
  // Prüfen, ob die Funktion bereits in scripts.js definiert ist
  if (typeof window.showToast === 'function') {
    window.showToast(message, duration);
    return;
  }
  
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
