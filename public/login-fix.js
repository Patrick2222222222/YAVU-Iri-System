// Verbesserte Login-Funktionalität für YAVU IRI Filler-System
document.addEventListener('DOMContentLoaded', function() {
  console.log('Login-Fix geladen');
  
  // Login-Modal-Elemente
  const loginModal = document.getElementById('loginModal');
  const closeModalBtn = document.querySelector('.close-modal');
  const openLoginModalBtn = document.getElementById('openLoginModal');
  
  // Tab-Elemente für Benutzertypen
  const tabButtons = document.querySelectorAll('.tab-button');
  const kundeTab = document.querySelector('.tab-button[data-tab="kunde"]');
  const studioTab = document.querySelector('.tab-button[data-tab="studio"]');
  const adminTab = document.querySelector('.tab-button[data-tab="admin"]');
  
  // Login-Formular-Handler
  const loginForm = document.querySelector('.login-form') || document.querySelector('form');
  
  // Modal-Steuerung
  if (openLoginModalBtn) {
    openLoginModalBtn.addEventListener('click', function() {
      if (loginModal) {
        loginModal.style.display = 'block';
      }
    });
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
      if (loginModal) {
        loginModal.style.display = 'none';
      }
    });
  }
  
  // Schließen des Modals bei Klick außerhalb
  window.addEventListener('click', function(e) {
    if (loginModal && e.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });
  
  // Tab-Wechsel-Funktionalität
  if (tabButtons.length > 0) {
    tabButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        // Aktiven Tab entfernen
        tabButtons.forEach(function(btn) {
          btn.classList.remove('active');
        });
        
        // Neuen Tab aktivieren
        this.classList.add('active');
      });
    });
  }
  
  // Login-Formular-Handler
  if (loginForm) {
    console.log('Login-Formular gefunden');
    
    // Direkter Event-Listener auf den Anmelden-Button
    const loginButton = document.querySelector('button[type="submit"]') || 
                        document.querySelector('.login-button') ||
                        document.querySelector('button.btn-primary') ||
                        document.querySelector('button:contains("ANMELDEN")');
    
    if (loginButton) {
      console.log('Login-Button gefunden');
      loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogin();
      });
    }
    
    // Formular-Submit-Event
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLogin();
    });
  } else {
    console.error('Login-Formular nicht gefunden');
  }
  
  // Login-Handler-Funktion
  function handleLogin() {
    const usernameInput = document.querySelector('input[name="username"]') || 
                         document.querySelector('#username') || 
                         document.querySelector('input[type="text"]') ||
                         document.querySelector('input:not([type="password"])');
                         
    const passwordInput = document.querySelector('input[name="password"]') || 
                         document.querySelector('#password') || 
                         document.querySelector('input[type="password"]');
    
    if (!usernameInput || !passwordInput) {
      console.error('Login-Felder nicht gefunden', usernameInput, passwordInput);
      return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
      showError('Bitte geben Sie Benutzername und Passwort ein.');
      return;
    }
    
    console.log('Login-Versuch mit:', username, password);
    
    // Aktiver Tab für Benutzertyp ermitteln
    const activeTab = document.querySelector('.tab-button.active') || 
                     document.querySelector('.tab-button[data-tab="kunde"]');
                     
    const userType = activeTab ? 
                    (activeTab.getAttribute('data-tab') || activeTab.textContent.toLowerCase().trim()) : 
                    'kunde';
    
    console.log('Benutzertyp:', userType);
    
    // Validierung der Anmeldedaten basierend auf Benutzertyp
    let isValid = false;
    let redirectUrl = '';
    
    if (userType === 'kunde' || userType.includes('kunde')) {
      isValid = (username === 'kunde' && password === 'password');
      redirectUrl = 'customer.html';
    } else if (userType === 'studio' || userType.includes('studio')) {
      isValid = (username === 'studio' && password === 'password');
      redirectUrl = 'studio.html';
    } else if (userType === 'admin' || userType.includes('admin')) {
      isValid = (username === 'admin' && password === 'password');
      redirectUrl = 'admin.html';
    }
    
    if (isValid) {
      console.log('Login erfolgreich, Weiterleitung zu:', redirectUrl);
      
      // Erfolgreiche Anmeldung - Weiterleitung
      window.location.href = redirectUrl;
    } else {
      // Fehlgeschlagene Anmeldung
      showError('Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.');
    }
  }
  
  // Hilfsfunktion zum Anzeigen von Fehlermeldungen
  function showError(message) {
    // Bestehende Fehlermeldungen entfernen
    const existingError = document.querySelector('.login-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Neue Fehlermeldung erstellen
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.style.color = '#c41e3a';
    errorDiv.style.backgroundColor = 'rgba(196, 30, 58, 0.1)';
    errorDiv.style.padding = '10px';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.marginBottom = '15px';
    errorDiv.style.textAlign = 'center';
    errorDiv.innerHTML = message;
    
    // Fehlermeldung einfügen
    const form = document.querySelector('form');
    if (form) {
      form.insertBefore(errorDiv, form.firstChild);
    } else {
      // Alternativ: Alert anzeigen, wenn kein Formular gefunden wird
      alert(message);
    }
    
    // Fehlermeldung nach 5 Sekunden ausblenden
    setTimeout(function() {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }
  
  // Initialisierung: Kunde-Tab als Standard aktivieren
  if (kundeTab) {
    kundeTab.click();
  }
});
