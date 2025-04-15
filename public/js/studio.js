// Spezifische Funktionen für den Studio-Bereich
document.addEventListener('DOMContentLoaded', function() {
  console.log('Studio-Funktionalität geladen');
  
  // Buchungstabelle füllen
  populateBookingsTable();
  
  // Kalender initialisieren
  initCalendar();
  
  // Verfügbarkeitsformular initialisieren
  initAvailabilityForm();
  
  // Behandlungen initialisieren
  initTreatments();
});

// Buchungstabelle füllen
function populateBookingsTable() {
  const bookingsTable = document.getElementById('bookingsTable');
  if (bookingsTable) {
    bookingsTable.innerHTML = `
      <tr>
        <td>15.03.2025</td>
        <td>14:30</td>
        <td>Marie Schmidt</td>
        <td>IRI Filler-Behandlung</td>
        <td><span class="status-badge confirmed">Bestätigt</span></td>
        <td>
          <button class="action-btn small view-booking-btn" data-id="1"><i class="fas fa-eye"></i></button>
          <button class="action-btn small edit-booking-btn" data-id="1"><i class="fas fa-edit"></i></button>
          <button class="action-btn small cancel-booking-btn" data-id="1"><i class="fas fa-times"></i></button>
        </td>
      </tr>
      <tr>
        <td>16.03.2025</td>
        <td>10:00</td>
        <td>Thomas Müller</td>
        <td>IRI Filler-Behandlung</td>
        <td><span class="status-badge pending">Ausstehend</span></td>
        <td>
          <button class="action-btn small view-booking-btn" data-id="2"><i class="fas fa-eye"></i></button>
          <button class="action-btn small edit-booking-btn" data-id="2"><i class="fas fa-edit"></i></button>
          <button class="action-btn small cancel-booking-btn" data-id="2"><i class="fas fa-times"></i></button>
        </td>
      </tr>
      <tr>
        <td>17.03.2025</td>
        <td>11:30</td>
        <td>Laura Weber</td>
        <td>IRI Filler-Auffrischung</td>
        <td><span class="status-badge pending">Ausstehend</span></td>
        <td>
          <button class="action-btn small view-booking-btn" data-id="3"><i class="fas fa-eye"></i></button>
          <button class="action-btn small edit-booking-btn" data-id="3"><i class="fas fa-edit"></i></button>
          <button class="action-btn small cancel-booking-btn" data-id="3"><i class="fas fa-times"></i></button>
        </td>
      </tr>
      <tr>
        <td>18.03.2025</td>
        <td>15:00</td>
        <td>Julia Becker</td>
        <td>IRI Filler-Behandlung</td>
        <td><span class="status-badge confirmed">Bestätigt</span></td>
        <td>
          <button class="action-btn small view-booking-btn" data-id="4"><i class="fas fa-eye"></i></button>
          <button class="action-btn small edit-booking-btn" data-id="4"><i class="fas fa-edit"></i></button>
          <button class="action-btn small cancel-booking-btn" data-id="4"><i class="fas fa-times"></i></button>
        </td>
      </tr>
    `;
    
    // Event-Listener für Buchungs-Buttons
    initBookingButtons();
  }
}

// Event-Listener für Buchungs-Buttons
function initBookingButtons() {
  // Ansicht-Buttons
  const viewButtons = document.querySelectorAll('.view-booking-btn');
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      const bookingId = this.getAttribute('data-id');
      alert(`Buchungsdetails für Buchung #${bookingId} werden angezeigt.`);
    });
  });
  
  // Bearbeiten-Buttons
  const editButtons = document.querySelectorAll('.edit-booking-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const bookingId = this.getAttribute('data-id');
      openBookingModal(bookingId);
    });
  });
  
  // Stornieren-Buttons
  const cancelButtons = document.querySelectorAll('.cancel-booking-btn');
  cancelButtons.forEach(button => {
    button.addEventListener('click', function() {
      const bookingId = this.getAttribute('data-id');
      if (confirm(`Möchten Sie die Buchung #${bookingId} wirklich stornieren?`)) {
        // Hier würde die Stornierung durchgeführt werden
        showToast('Buchung erfolgreich storniert!');
        
        // Zeile aus Tabelle entfernen (für Demo-Zwecke)
        const row = this.closest('tr');
        if (row) {
          row.remove();
        }
      }
    });
  });
}

// Buchungs-Modal öffnen
function openBookingModal(bookingId) {
  const bookingModal = document.getElementById('bookingModal');
  if (bookingModal) {
    // Hier würden die Buchungsdaten geladen werden
    
    // Modal anzeigen
    bookingModal.style.display = 'block';
  }
}

// Kalender initialisieren
function initCalendar() {
  const calendar = document.getElementById('calendar');
  const currentMonth = document.getElementById('currentMonth');
  const prevMonth = document.getElementById('prevMonth');
  const nextMonth = document.getElementById('nextMonth');
  
  if (calendar && currentMonth) {
    // Aktuelles Datum
    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonthIndex = now.getMonth();
    
    // Monat anzeigen
    renderCalendar(currentYear, currentMonthIndex);
    
    // Event-Listener für Monatsnavigation
    if (prevMonth) {
      prevMonth.addEventListener('click', function() {
        currentMonthIndex--;
        if (currentMonthIndex < 0) {
          currentMonthIndex = 11;
          currentYear--;
        }
        renderCalendar(currentYear, currentMonthIndex);
      });
    }
    
    if (nextMonth) {
      nextMonth.addEventListener('click', function() {
        currentMonthIndex++;
        if (currentMonthIndex > 11) {
          currentMonthIndex = 0;
          currentYear++;
        }
        renderCalendar(currentYear, currentMonthIndex);
      });
    }
  }
  
  // Kalender rendern
  function renderCalendar(year, month) {
    // Monatsnamen
    const monthNames = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    
    // Aktuellen Monat anzeigen
    if (currentMonth) {
      currentMonth.textContent = `${monthNames[month]} ${year}`;
    }
    
    if (calendar) {
      // Erster Tag des Monats
      const firstDay = new Date(year, month, 1);
      // Letzter Tag des Monats
      const lastDay = new Date(year, month + 1, 0);
      
      // Anzahl der Tage im Monat
      const daysInMonth = lastDay.getDate();
      
      // Wochentag des ersten Tags (0 = Sonntag, 1 = Montag, ...)
      let firstDayOfWeek = firstDay.getDay();
      // Anpassung für europäischen Kalender (Montag = 0, Sonntag = 6)
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      
      // Kalender-HTML erstellen
      let calendarHTML = `
        <div class="calendar-header">
          <div class="weekday">Mo</div>
          <div class="weekday">Di</div>
          <div class="weekday">Mi</div>
          <div class="weekday">Do</div>
          <div class="weekday">Fr</div>
          <div class="weekday">Sa</div>
          <div class="weekday">So</div>
        </div>
        <div class="calendar-grid">
      `;
      
      // Leere Zellen für Tage vor dem ersten Tag des Monats
      for (let i = 0; i < firstDayOfWeek; i++) {
        calendarHTML += `<div class="calendar-day empty"></div>`;
      }
      
      // Tage des Monats
      for (let day = 1; day <= daysInMonth; day++) {
        // Prüfen, ob der Tag Termine hat (Dummy-Daten)
        const hasAppointments = [5, 10, 15, 20, 25].includes(day);
        const appointmentClass = hasAppointments ? 'has-appointments' : '';
        
        // Prüfen, ob der Tag heute ist
        const isToday = (day === now.getDate() && month === now.getMonth() && year === now.getFullYear());
        const todayClass = isToday ? 'today' : '';
        
        calendarHTML += `
          <div class="calendar-day ${appointmentClass} ${todayClass}">
            <div class="day-number">${day}</div>
            ${hasAppointments ? '<div class="appointment-indicator">3</div>' : ''}
          </div>
        `;
      }
      
      calendarHTML += `</div>`;
      
      // Kalender anzeigen
      calendar.innerHTML = calendarHTML;
      
      // Event-Listener für Kalendertage
      const calendarDays = calendar.querySelectorAll('.calendar-day:not(.empty)');
      calendarDays.forEach(day => {
        day.addEventListener('click', function() {
          const dayNumber = this.querySelector('.day-number').textContent;
          const date = new Date(year, month, parseInt(dayNumber));
          
          // Datum im Zeitstrahl setzen
          const timelineDate = document.getElementById('timelineDate');
          if (timelineDate) {
            const formattedDate = date.toISOString().split('T')[0];
            timelineDate.value = formattedDate;
            
            // Zeitstrahl aktualisieren
            updateTimeline(date);
          }
        });
      });
    }
  }
  
  // Zeitstrahl aktualisieren
  function updateTimeline(date) {
    const timeline = document.getElementById('timeline');
    if (timeline) {
      // Formatiertes Datum
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('de-DE', options);
      
      // Zeitstrahl-HTML erstellen
      let timelineHTML = `<h3>${formattedDate}</h3>`;
      
      // Zeitslots
      const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00'
      ];
      
      // Dummy-Termine
      const appointments = [
        { time: '10:00', duration: 60, customer: 'Thomas Müller', treatment: 'IRI Filler-Behandlung' },
        { time: '14:30', duration: 30, customer: 'Marie Schmidt', treatment: 'IRI Filler-Auffrischung' }
      ];
      
      timelineHTML += `<div class="timeline-slots">`;
      
      timeSlots.forEach(timeSlot => {
        // Prüfen, ob ein Termin zu diesem Zeitslot existiert
        const appointment = appointments.find(app => app.time === timeSlot);
        
        if (appointment) {
          // Dauer in Anzahl der 30-Minuten-Slots umrechnen
          const slotSpan = appointment.duration / 30;
          
          timelineHTML += `
            <div class="timeline-slot booked" style="grid-row: span ${slotSpan}">
              <div class="appointment-time">${timeSlot}</div>
              <div class="appointment-details">
                <div class="appointment-customer">${appointment.customer}</div>
                <div class="appointment-treatment">${appointment.treatment}</div>
              </div>
            </div>
          `;
        } else {
          timelineHTML += `
            <div class="timeline-slot">
              <div class="slot-time">${timeSlot}</div>
              <button class="add-appointment-btn" data-time="${timeSlot}">+</button>
            </div>
          `;
        }
      });
      
      timelineHTML += `</div>`;
      
      // Zeitstrahl anzeigen
      timeline.innerHTML = timelineHTML;
      
      // Event-Listener für Termin-Hinzufügen-Buttons
      const addButtons = timeline.querySelectorAll('.add-appointment-btn');
      addButtons.forEach(button => {
        button.addEventListener('click', function() {
          const time = this.getAttribute('data-time');
          openNewBookingModal(date, time);
        });
      });
    }
  }
  
  // Neues Buchungs-Modal öffnen
  function openNewBookingModal(date, time) {
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) {
      // Datum und Uhrzeit im Modal setzen
      const bookingDate = document.getElementById('bookingDate');
      const bookingTime = document.getElementById('bookingTime');
      
      if (bookingDate && bookingTime) {
        bookingDate.value = date.toISOString().split('T')[0];
        bookingTime.value = time;
      }
      
      // Modal anzeigen
      bookingModal.style.display = 'block';
    }
  }
  
  // Zeitstrahl-Datum-Event-Listener
  const timelineDate = document.getElementById('timelineDate');
  if (timelineDate) {
    timelineDate.addEventListener('change', function() {
      const selectedDate = new Date(this.value);
      updateTimeline(selectedDate);
    });
    
    // Initial mit aktuellem Datum
    timelineDate.value = now.toISOString().split('T')[0];
    updateTimeline(now);
  }
}

// Verfügbarkeitsformular initialisieren
function initAvailabilityForm() {
  const availabilityForm = document.getElementById('availabilityForm');
  const dayCheckboxes = document.querySelectorAll('.availability-day input[type="checkbox"]');
  
  if (availabilityForm && dayCheckboxes.length > 0) {
    // Checkboxen mit Event-Listenern versehen
    dayCheckboxes.forEach(checkbox => {
      // Initial alle Checkboxen aktivieren
      checkbox.checked = true;
      
      // Zugehörige Zeitfelder aktivieren/deaktivieren
      const dayId = checkbox.id;
      const dayNumber = dayId.replace('day', '');
      const startTime = document.getElementById(`startTime${dayNumber}`);
      const endTime = document.getElementById(`endTime${dayNumber}`);
      
      if (startTime && endTime) {
        startTime.disabled = !checkbox.checked;
        endTime.disabled = !checkbox.checked;
        
        // Event-Listener für Checkbox-Änderungen
        checkbox.addEventListener('change', function() {
          startTime.disabled = !this.checked;
          endTime.disabled = !this.checked;
        });
      }
    });
    
    // Formular-Submit-Event
    availabilityForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Hier würden die Öffnungszeiten gespeichert werden
      showToast('Öffnungszeiten erfolgreich gespeichert!');
    });
  }
  
  // Blockierte Tage initialisieren
  const addBlockedDateBtn = document.getElementById('addBlockedDateBtn');
  const newBlockedDate = document.getElementById('newBlockedDate');
  const blockedDatesContainer = document.getElementById('blockedDatesContainer');
  
  if (addBlockedDateBtn && newBlockedDate && blockedDatesContainer) {
    // Dummy-Daten für blockierte Tage
    const blockedDates = [
      { date: '2025-04-01', reason: 'Feiertag' },
      { date: '2025-04-10', reason: 'Betriebsausflug' }
    ];
    
    // Blockierte Tage anzeigen
    renderBlockedDates();
    
    // Event-Listener für Hinzufügen-Button
    addBlockedDateBtn.addEventListener('click', function() {
      const date = newBlockedDate.value;
      
      if (date) {
        // Datum zum Array hinzufügen
        blockedDates.push({ date, reason: 'Geschlossen' });
        
        // Blockierte Tage neu rendern
        renderBlockedDates();
        
        // Eingabefeld leeren
        newBlockedDate.value = '';
        
        // Erfolgsmeldung anzeigen
        showToast('Blockierter Tag hinzugefügt!');
      }
    });
    
    // Blockierte Tage rendern
    function renderBlockedDates() {
      let html = '';
      
      blockedDates.forEach((blockedDate, index) => {
        // Datum formatieren
        const date = new Date(blockedDate.date);
        const formattedDate = date.toLocaleDateString('de-DE');
        
        html += `
          <div class="blocked-date-item">
            <div class="blocked-date-info">
              <div class="blocked-date">${formattedDate}</div>
              <div class="blocked-reason">${blockedDate.reason}</div>
            </div>
            <button class="action-btn small remove-blocked-date" data-index="${index}">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
      });
      
      // HTML einfügen
      blockedDatesContainer.innerHTML = html;
      
      // Event-Listener für Entfernen-Buttons
      const removeButtons = blockedDatesContainer.querySelectorAll('.remove-blocked-date');
      removeButtons.forEach(button => {
        button.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          
          // Datum aus Array entfernen
          blockedDates.splice(index, 1);
          
          // Blockierte Tage neu rendern
          renderBlockedDates();
          
          // Erfolgsmeldung anzeigen
          showToast('Blockierter Tag entfernt!');
        });
      });
    }
  }
}

// Behandlungen initialisieren
function initTreatments() {
  const addTreatmentForm = document.getElementById('addTreatmentForm');
  
  if (addTreatmentForm) {
    // Formular-Submit-Event
    addTreatmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Formularwerte auslesen
      const treatmentName = document.getElementById('treatmentName').value;
      const treatmentDuration = document.getElementById('treatmentDuration').value;
      
      if (treatmentName && treatmentDuration) {
        // Hier würde die Behandlung gespeichert werden
        showToast('Behandlung erfolgreich hinzugefügt!');
        
        // Formular zurücksetzen
        this.reset();
        
        // Formular ausblenden
        const formContainer = document.getElementById('addTreatmentFormContainer');
        if (formContainer) {
          formContainer.style.display = 'none';
        }
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
