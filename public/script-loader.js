// Einbindung der JavaScript-Dateien in die HTML-Dateien
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script-Loader geladen');
  
  // Gemeinsame Skripte für alle Seiten
  loadScript('scripts.js');
  
  // Spezifische Skripte basierend auf der aktuellen Seite
  const currentPage = getCurrentPage();
  
  switch(currentPage) {
    case 'index':
      // Login-Fix für die Hauptseite
      loadScript('login-fix.js');
      break;
    case 'customer':
      // Skripte für den Kundenbereich
      loadScript('js/customer.js');
      break;
    case 'studio':
      // Skripte für den Studiobereich
      loadScript('js/studio.js');
      break;
    case 'admin':
      // Skripte für den Adminbereich
      loadScript('js/admin.js');
      break;
  }
});

// Hilfsfunktion zum Laden von Skripten
function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
  console.log(`Skript geladen: ${src}`);
}

// Hilfsfunktion zur Ermittlung der aktuellen Seite
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  
  if (!filename || filename === '' || filename === 'index.html') {
    return 'index';
  }
  
  return filename.replace('.html', '');
}
