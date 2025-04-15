// Datei zur Integration des Frontends mit dem Backend
// Diese Datei wird in das public-Verzeichnis kopiert und stellt die Verbindung zum Backend her

// API-Endpunkte
const API_BASE_URL = '/api';

// Funktion zum Abrufen aller Benutzer
async function getUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Benutzer');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    return [];
  }
}

// Funktion zum Abrufen aller Studios
async function getStudios() {
  try {
    const response = await fetch(`${API_BASE_URL}/studios`);
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Studios');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    return [];
  }
}

// Funktion zum Abrufen aller Treatments eines Studios
async function getStudioTreatments(studioId) {
  try {
    const response = await fetch(`${API_BASE_URL}/studios/${studioId}/treatments`);
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Treatments');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    return [];
  }
}

// Funktion zum Abrufen aller Verfügbarkeiten eines Studios
async function getStudioAvailability(studioId) {
  try {
    const response = await fetch(`${API_BASE_URL}/studios/${studioId}/availability`);
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Verfügbarkeiten');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    return [];
  }
}

// Funktion zum Abrufen aller Termine eines Kunden
async function getCustomerAppointments(customerId) {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/customer/${customerId}`);
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Termine');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    return [];
  }
}

// Funktion zum Abrufen aller Termine eines Studios
async function getStudioAppointments(studioId) {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/studio/${studioId}`);
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Termine');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    return [];
  }
}

// Funktion zum Erstellen eines neuen Termins
async function createAppointment(appointmentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fehler beim Erstellen des Termins');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    throw error;
  }
}

// Funktion zum Aktualisieren eines Termins
async function updateAppointment(appointmentId, appointmentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fehler beim Aktualisieren des Termins');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    throw error;
  }
}

// Funktion zum Löschen eines Termins
async function deleteAppointment(appointmentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fehler beim Löschen des Termins');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    throw error;
  }
}

// Funktion zum Anmelden eines Benutzers
async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fehler bei der Anmeldung');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    throw error;
  }
}

// Funktion zum Hinzufügen eines Studios zu den Favoriten
async function addFavorite(customerId, studioId) {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ studio_id: studioId })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fehler beim Hinzufügen des Favoriten');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    throw error;
  }
}

// Funktion zum Entfernen eines Studios aus den Favoriten
async function removeFavorite(customerId, studioId) {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/favorites/${studioId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fehler beim Entfernen des Favoriten');
    }
    return await response.json();
  } catch (error) {
    console.error('API-Fehler:', error);
    throw error;
  }
}

// Exportiere alle Funktionen
window.api = {
  getUsers,
  getStudios,
  getStudioTreatments,
  getStudioAvailability,
  getCustomerAppointments,
  getStudioAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  login,
  addFavorite,
  removeFavorite
};
