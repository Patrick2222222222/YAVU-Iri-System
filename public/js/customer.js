// Spezifische Funktionen für den Kundenbereich
document.addEventListener('DOMContentLoaded', function() {
  console.log('Kunden-Funktionalität geladen');
  
  // Behandlungshistorie-Tabelle füllen
  populateTreatmentHistory();
  
  // Bewertungen füllen
  populateReviews();
  
  // Nachrichten füllen
  populateMessages();
  
  // Event-Listener für Bewertungssterne
  initRatingStars();
});

// Behandlungshistorie-Tabelle füllen
function populateTreatmentHistory() {
  const treatmentsTable = document.getElementById('treatmentsTable');
  if (treatmentsTable && treatmentsTable.querySelector('tbody')) {
    treatmentsTable.querySelector('tbody').innerHTML = `
      <tr>
        <td>15.02.2025</td>
        <td>IRI Filler-Behandlung</td>
        <td>Beauty Lounge Berlin</td>
        <td>Sarah Meyer</td>
        <td>
          <button class="action-btn small review-btn" data-id="1">Bewerten</button>
          <button class="action-btn small">Details</button>
        </td>
      </tr>
      <tr>
        <td>10.01.2025</td>
        <td>IRI Filler-Auffrischung</td>
        <td>Aesthetic Sense München</td>
        <td>Julia Weber</td>
        <td>
          <button class="action-btn small review-btn" data-id="2">Bewerten</button>
          <button class="action-btn small">Details</button>
        </td>
      </tr>
      <tr>
        <td>05.12.2024</td>
        <td>IRI Filler-Behandlung</td>
        <td>Beauty Lounge Berlin</td>
        <td>Sarah Meyer</td>
        <td>
          <button class="action-btn small">Bereits bewertet</button>
          <button class="action-btn small">Details</button>
        </td>
      </tr>
    `;
    
    // Event-Listener für Bewertungs-Buttons
    const reviewButtons = treatmentsTable.querySelectorAll('.review-btn');
    reviewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const bookingId = this.getAttribute('data-id');
        openReviewModal(bookingId);
      });
    });
  }
}

// Bewertungs-Modal öffnen
function openReviewModal(bookingId) {
  const reviewModal = document.getElementById('reviewModal');
  const reviewBookingId = document.getElementById('reviewBookingId');
  const reviewStudioName = document.getElementById('reviewStudioName');
  const reviewTreatment = document.getElementById('reviewTreatment');
  
  if (reviewModal && reviewBookingId && reviewStudioName && reviewTreatment) {
    // Buchungs-ID setzen
    reviewBookingId.value = bookingId;
    
    // Dummy-Daten basierend auf Buchungs-ID
    if (bookingId === '1') {
      reviewStudioName.textContent = 'Beauty Lounge Berlin';
      reviewTreatment.textContent = 'IRI Filler-Behandlung';
    } else if (bookingId === '2') {
      reviewStudioName.textContent = 'Aesthetic Sense München';
      reviewTreatment.textContent = 'IRI Filler-Auffrischung';
    }
    
    // Modal anzeigen
    reviewModal.style.display = 'block';
  }
}

// Bewertungen füllen
function populateReviews() {
  const userReviewsContainer = document.getElementById('userReviewsContainer');
  if (userReviewsContainer) {
    userReviewsContainer.innerHTML = `
      <div class="review-card">
        <div class="review-header">
          <div class="review-studio">Beauty Lounge Berlin</div>
          <div class="review-date">05.12.2024</div>
        </div>
        <div class="review-treatment">IRI Filler-Behandlung</div>
        <div class="review-rating">★★★★★</div>
        <div class="review-comment">
          Hervorragende Behandlung! Sehr professionell und schmerzfrei. Das Ergebnis ist natürlich und genau wie gewünscht.
        </div>
      </div>
    `;
  }
  
  const pendingReviewsContainer = document.getElementById('pendingReviewsContainer');
  if (pendingReviewsContainer) {
    pendingReviewsContainer.innerHTML = `
      <div class="pending-review-card">
        <div class="pending-review-info">
          <div class="pending-review-studio">Beauty Lounge Berlin</div>
          <div class="pending-review-date">15.02.2025</div>
          <div class="pending-review-treatment">IRI Filler-Behandlung</div>
        </div>
        <button class="action-btn review-btn" data-id="1">JETZT BEWERTEN</button>
      </div>
      <div class="pending-review-card">
        <div class="pending-review-info">
          <div class="pending-review-studio">Aesthetic Sense München</div>
          <div class="pending-review-date">10.01.2025</div>
          <div class="pending-review-treatment">IRI Filler-Auffrischung</div>
        </div>
        <button class="action-btn review-btn" data-id="2">JETZT BEWERTEN</button>
      </div>
    `;
    
    // Event-Listener für Bewertungs-Buttons
    const reviewButtons = pendingReviewsContainer.querySelectorAll('.review-btn');
    reviewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const bookingId = this.getAttribute('data-id');
        openReviewModal(bookingId);
      });
    });
  }
}

// Nachrichten füllen
function populateMessages() {
  const messagesContainer = document.getElementById('messagesContainer');
  if (messagesContainer) {
    messagesContainer.innerHTML = `
      <div class="message-card unread">
        <div class="message-header">
          <div class="message-sender">Beauty Lounge Berlin</div>
          <div class="message-date">03.03.2025</div>
        </div>
        <div class="message-subject">Terminbestätigung</div>
        <div class="message-preview">Sehr geehrter Herr Mustermann, hiermit bestätigen wir Ihren Termin am 15.03.2025 um 14:30 Uhr...</div>
        <div class="message-actions">
          <button class="action-btn small">Antworten</button>
          <button class="action-btn small">Löschen</button>
        </div>
      </div>
      <div class="message-card">
        <div class="message-header">
          <div class="message-sender">YAVU System</div>
          <div class="message-date">01.03.2025</div>
        </div>
        <div class="message-subject">Willkommen bei YAVU</div>
        <div class="message-preview">Herzlich willkommen im YAVU IRI Filler-System! Wir freuen uns, dass Sie sich für unsere Plattform entschieden haben...</div>
        <div class="message-actions">
          <button class="action-btn small">Antworten</button>
          <button class="action-btn small">Löschen</button>
        </div>
      </div>
    `;
  }
}

// Bewertungssterne initialisieren
function initRatingStars() {
  const stars = document.querySelectorAll('.star');
  const ratingValue = document.getElementById('ratingValue');
  
  if (stars.length > 0 && ratingValue) {
    stars.forEach(star => {
      // Hover-Effekt
      star.addEventListener('mouseover', function() {
        const value = this.getAttribute('data-value');
        highlightStars(value);
      });
      
      // Hover-Ende
      star.addEventListener('mouseout', function() {
        const selectedValue = ratingValue.value;
        if (selectedValue) {
          highlightStars(selectedValue);
        } else {
          resetStars();
        }
      });
      
      // Klick-Event
      star.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        ratingValue.value = value;
        highlightStars(value);
      });
    });
  }
  
  // Sterne bis zum angegebenen Wert hervorheben
  function highlightStars(value) {
    stars.forEach(star => {
      const starValue = star.getAttribute('data-value');
      if (starValue <= value) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }
  
  // Alle Sterne zurücksetzen
  function resetStars() {
    stars.forEach(star => {
      star.classList.remove('active');
    });
  }
}
