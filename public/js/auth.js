// Authentifizierungsfunktionen für das YAVU-System

// Funktion zum Einloggen
function login(username, password, type) {
  const data = loadFromLocalStorage();
  const user = data.users.find(
    (u) => u.username === username && u.password === password && u.type === type
  );

  if (user) {
    // Speichere Login-Status im localStorage
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: user.id,
        username: user.username,
        type: user.type,
        studioId: user.studioId || null,
        customerId: user.customerId || null,
      })
    );

    // Letzten Login speichern
    updateLastLogin(user.id);

    return true;
  }
  return false;
}

// Aktualisiere den letzten Login-Zeitpunkt
function updateLastLogin(userId) {
  const data = loadFromLocalStorage();
  const userIndex = data.users.findIndex((u) => u.id === userId);

  if (userIndex !== -1) {
    data.users[userIndex].lastLogin = new Date().toISOString();
    localStorage.setItem("yavuData", JSON.stringify(data));
  }
}

// Funktion zum Ausloggen
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// Funktion zum Überprüfen, ob ein Benutzer eingeloggt ist
function isLoggedIn() {
  return localStorage.getItem("currentUser") !== null;
}

// Funktion zum Überprüfen des Benutzertyps
function getUserType() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return user ? user.type : null;
}

// Funktion zur Berechtigungsprüfung
function checkAuthorization(allowedTypes) {
  if (!isLoggedIn()) {
    window.location.href = "index.html";
    return;
  }

  const userType = getUserType();
  if (!allowedTypes.includes(userType)) {
    window.location.href = "index.html";
    return;
  }

  // Überprüfen, ob das Studio aktiv ist (nur für Studio-Benutzer)
  if (userType === "studio") {
    const studioId = getCurrentStudioId();
    if (studioId) {
      const studioStatus = getStudioStatus(studioId);
      if (studioStatus !== "active") {
        logout();
        alert(
          "Ihr Studio ist noch nicht freigeschaltet. Bitte kontaktieren Sie den Administrator."
        );
        window.location.href = "index.html";
        return;
      }
    }
  }
}

// Funktion zum Abrufen des Studio-Status
function getStudioStatus(studioId) {
  const data = loadFromLocalStorage();
  const studio = data.studios.find((s) => s.id === studioId);
  return studio ? studio.status : null;
}

// Funktion zum Abrufen der aktuellen Benutzer-ID
function getCurrentUserId() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return user ? user.id : null;
}

// Funktion zum Abrufen der aktuellen Studio-ID
function getCurrentStudioId() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return user && user.studioId ? user.studioId : null;
}

// Funktion zum Abrufen der aktuellen Kunden-ID
function getCurrentCustomerId() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return user && user.customerId ? user.customerId : null;
}

// Funktion zum Registrieren eines neuen Kunden
function registerCustomer(name, email, password, phone = "", address = {}) {
  const data = loadFromLocalStorage();

  // Prüfen, ob E-Mail bereits vergeben ist
  const existingUser = data.users.find(
    (u) =>
      u.username === email ||
      (u.type === "kunde" &&
        data.customers.find((c) => c.id === u.customerId && c.email === email))
  );

  if (existingUser) {
    return { success: false, message: "Diese E-Mail wird bereits verwendet." };
  }

  // Neue Kunden-ID generieren
  const customerId =
    data.customers.length > 0
      ? Math.max(...data.customers.map((c) => c.id)) + 1
      : 1;

  // Neue Benutzer-ID generieren
  const userId =
    data.users.length > 0 ? Math.max(...data.users.map((u) => u.id)) + 1 : 1;

  // Neuen Kunden erstellen
  const newCustomer = {
    id: customerId,
    name: name,
    email: email,
    phone: phone || "",
    registrationDate: new Date().toISOString().split("T")[0],
    lastLogin: new Date().toISOString(),
    favoriteStudios: [],
    loyaltyPoints: 0,
    bookingCount: 0,
    address: address || {
      street: "",
      zip: "",
      city: "",
    },
    preferences: {
      notifications: {
        bookings: true,
        offers: true,
        news: false,
      },
      language: "de",
    },
  };

  // Neuen Benutzer erstellen
  const newUser = {
    id: userId,
    username: email, // E-Mail als Benutzername verwenden
    password: password,
    type: "kunde",
    customerId: customerId,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: "active",
  };

  // Zur Datenbank hinzufügen
  data.customers.push(newCustomer);
  data.users.push(newUser);

  // Datenbank speichern
  localStorage.setItem("yavuData", JSON.stringify(data));

  // Willkommensnachricht erstellen
  addWelcomeMessage(customerId, "kunde");

  return { success: true, message: "Registrierung erfolgreich!" };
}

// Funktion zum Registrieren eines neuen Studios
function registerStudio(
  name,
  location,
  email,
  password,
  contact = "",
  phone = ""
) {
  const data = loadFromLocalStorage();

  // Prüfen, ob E-Mail bereits vergeben ist
  const existingUser = data.users.find((u) => u.username === email);

  if (existingUser) {
    return { success: false, message: "Diese E-Mail wird bereits verwendet." };
  }

  // Neue Studio-ID generieren
  const studioId =
    data.studios.length > 0
      ? Math.max(...data.studios.map((s) => s.id)) + 1
      : 1;

  // Neue Benutzer-ID generieren
  const userId =
    data.users.length > 0 ? Math.max(...data.users.map((u) => u.id)) + 1 : 1;

  // Neues Studio erstellen
  const newStudio = {
    id: studioId,
    name: name,
    location: location,
    contact: contact || "",
    email: email,
    phone: phone || "",
    rating: 0,
    reviewCount: 0,
    status: "pending", // Muss erst vom Admin bestätigt werden
    registrationDate: new Date().toISOString().split("T")[0],
    lastLogin: new Date().toISOString(),
    description: "",
    treatments: [],
    availability: [
      { day: 1, start: "09:00", end: "17:00" }, // Montag
      { day: 2, start: "09:00", end: "17:00" }, // Dienstag
      { day: 3, start: "09:00", end: "17:00" }, // Mittwoch
      { day: 4, start: "09:00", end: "17:00" }, // Donnerstag
      { day: 5, start: "09:00", end: "17:00" }, // Freitag
    ],
    blockedDates: [],
    // Neu: Schulungszugriff und Zertifikate
    training: {
      accessibleModules: [],
      completedModules: [],
      certificates: [],
    },
    social: {
      instagram: "",
      facebook: "",
      website: "",
    },
  };

  // Neuen Benutzer erstellen
  const newUser = {
    id: userId,
    username: email, // E-Mail als Benutzername verwenden
    password: password,
    type: "studio",
    studioId: studioId,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: "pending", // Status wird mit dem Studio synchronisiert
  };

  // Zur Datenbank hinzufügen
  data.studios.push(newStudio);
  data.users.push(newUser);

  // Datenbank speichern
  localStorage.setItem("yavuData", JSON.stringify(data));

  // Benachrichtigung an Admin über neue Studio-Registrierung
  const messageId =
    data.messages.length > 0
      ? Math.max(...data.messages.map((m) => m.id)) + 1
      : 1;

  const notification = {
    id: messageId,
    sender: "System",
    recipient: "admin",
    subject: "Neue Studio-Registrierung",
    content: `Neues Studio "${name}" hat sich registriert und wartet auf Freischaltung.`,
    timestamp: new Date().toISOString(),
    read: false,
    type: "notification",
    priority: "high",
  };

  data.messages.push(notification);
  localStorage.setItem("yavuData", JSON.stringify(data));

  // Willkommensnachricht erstellen
  addWelcomeMessage(studioId, "studio");

  return {
    success: true,
    message:
      "Registrierung erfolgreich! Ihr Konto wird geprüft und in Kürze freigeschaltet.",
  };
}

// Willkommensnachricht erstellen
function addWelcomeMessage(recipientId, type) {
  const data = loadFromLocalStorage();

  const messageId =
    data.messages.length > 0
      ? Math.max(...data.messages.map((m) => m.id)) + 1
      : 1;

  let content, recipient;

  if (type === "kunde") {
    const customer = data.customers.find((c) => c.id === recipientId);
    recipient = customer.name;
    content = `
      <p>Herzlich Willkommen bei YAVU, ${customer.name}!</p>
      <p>Wir freuen uns, Sie als neuen Kunden begrüßen zu dürfen. Mit YAVU können Sie ganz einfach IRI Filler-Behandlungen bei zertifizierten Studios in Ihrer Nähe buchen.</p>
      <p>So geht's los:</p>
      <ol>
        <li>Vervollständigen Sie Ihr Profil</li>
        <li>Suchen Sie Studios in Ihrer Nähe</li>
        <li>Buchen Sie Ihre erste Behandlung</li>
      </ol>
      <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
      <p>Ihr YAVU-Team</p>
    `;
  } else if (type === "studio") {
    const studio = data.studios.find((s) => s.id === recipientId);
    recipient = studio.name;
    content = `
      <p>Herzlich Willkommen bei YAVU, ${studio.name}!</p>
      <p>Vielen Dank für Ihre Registrierung. Ihr Konto wird derzeit von unserem Team geprüft und in Kürze freigeschaltet.</p>
      <p>Nach der Freischaltung können Sie:</p>
      <ol>
        <li>Ihr Studioprofil vervollständigen</li>
        <li>Behandlungen und Verfügbarkeiten einrichten</li>
        <li>Zugang zu exklusiven Schulungsmaterialien erhalten</li>
        <li>Buchungen von Kunden empfangen</li>
      </ol>
      <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
      <p>Ihr YAVU-Team</p>
    `;
  } else {
    return;
  }

  const welcomeMessage = {
    id: messageId,
    sender: "YAVU Team",
    recipient: recipient,
    subject: "Willkommen bei YAVU",
    content: content,
    timestamp: new Date().toISOString(),
    read: false,
    type: "welcome",
    priority: "normal",
  };

  data.messages.push(welcomeMessage);
  localStorage.setItem("yavuData", JSON.stringify(data));
}

// Funktion zum Zurücksetzen des Passworts
function resetPassword(email) {
  const data = loadFromLocalStorage();
  const user = data.users.find((u) => u.username === email);

  if (!user) {
    return { success: false, message: "E-Mail-Adresse nicht gefunden." };
  }

  // In einer echten Anwendung würde hier eine E-Mail mit Reset-Link versendet werden
  // Für diese Demo setzen wir das Passwort direkt zurück auf einen Standardwert
  const resetPasswordTo = "reset123";

  // Passwort ändern
  const userIndex = data.users.findIndex((u) => u.id === user.id);
  data.users[userIndex].password = resetPasswordTo;
  data.users[userIndex].passwordResetAt = new Date().toISOString();

  // Datenbank speichern
  localStorage.setItem("yavuData", JSON.stringify(data));

  return {
    success: true,
    message:
      'Passwort wurde zurückgesetzt. Sie können sich jetzt mit dem temporären Passwort "' +
      resetPasswordTo +
      '" anmelden. Bitte ändern Sie es nach dem Anmelden.',
  };
}

// Funktion zum Ändern des Passworts
function changePassword(currentPassword, newPassword) {
  if (!isLoggedIn()) {
    return { success: false, message: "Sie sind nicht angemeldet." };
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = loadFromLocalStorage();

  // Benutzer finden
  const userIndex = data.users.findIndex((u) => u.id === currentUser.id);

  if (userIndex === -1) {
    return { success: false, message: "Benutzer nicht gefunden." };
  }

  // Aktuelles Passwort überprüfen
  if (data.users[userIndex].password !== currentPassword) {
    return { success: false, message: "Aktuelles Passwort ist falsch." };
  }

  // Passwort ändern
  data.users[userIndex].password = newPassword;
  data.users[userIndex].passwordChangedAt = new Date().toISOString();

  // Datenbank speichern
  localStorage.setItem("yavuData", JSON.stringify(data));

  return { success: true, message: "Passwort wurde erfolgreich geändert." };
}

// Funktion zum Überprüfen, ob ein Benutzer ein Studio favorisiert hat
function isStudioFavorited(studioId) {
  if (!isLoggedIn() || getUserType() !== "kunde") {
    return false;
  }

  const customerId = getCurrentCustomerId();
  if (!customerId) return false;

  const data = loadFromLocalStorage();
  const customer = data.customers.find((c) => c.id === customerId);

  return (
    customer &&
    customer.favoriteStudios &&
    customer.favoriteStudios.includes(studioId)
  );
}

// Funktion zum Hinzufügen oder Entfernen eines Studios aus den Favoriten
function toggleFavoriteStudio(studioId) {
  if (!isLoggedIn() || getUserType() !== "kunde") {
    return { success: false, message: "Sie müssen als Kunde angemeldet sein." };
  }

  const customerId = getCurrentCustomerId();
  if (!customerId) {
    return {
      success: false,
      message: "Kundendaten konnten nicht geladen werden.",
    };
  }

  const data = loadFromLocalStorage();
  const customerIndex = data.customers.findIndex((c) => c.id === customerId);

  if (customerIndex === -1) {
    return {
      success: false,
      message: "Kundendaten konnten nicht geladen werden.",
    };
  }

  // Sicherstellen, dass das favoriteStudios-Array existiert
  if (!data.customers[customerIndex].favoriteStudios) {
    data.customers[customerIndex].favoriteStudios = [];
  }

  // Prüfen, ob das Studio bereits favorisiert ist
  const isFavorited =
    data.customers[customerIndex].favoriteStudios.includes(studioId);

  if (isFavorited) {
    // Studio aus Favoriten entfernen
    data.customers[customerIndex].favoriteStudios = data.customers[
      customerIndex
    ].favoriteStudios.filter((id) => id !== studioId);

    // Datenbank speichern
    localStorage.setItem("yavuData", JSON.stringify(data));

    return {
      success: true,
      message: "Studio wurde aus Ihren Favoriten entfernt.",
      action: "removed",
    };
  } else {
    // Studio zu Favoriten hinzufügen
    data.customers[customerIndex].favoriteStudios.push(studioId);

    // Datenbank speichern
    localStorage.setItem("yavuData", JSON.stringify(data));

    return {
      success: true,
      message: "Studio wurde zu Ihren Favoriten hinzugefügt.",
      action: "added",
    };
  }
}

// Funktion zum Verwalten des Schulungszugangs (nur für Admin)
function manageTrainingAccess(studioId, moduleId, hasAccess) {
  if (!isLoggedIn() || getUserType() !== "admin") {
    return {
      success: false,
      message: "Sie benötigen Administratorrechte für diese Aktion.",
    };
  }

  const data = loadFromLocalStorage();
  const studioIndex = data.studios.findIndex((s) => s.id === studioId);

  if (studioIndex === -1) {
    return { success: false, message: "Studio nicht gefunden." };
  }

  // Sicherstellen, dass die training-Struktur existiert
  if (!data.studios[studioIndex].training) {
    data.studios[studioIndex].training = {
      accessibleModules: [],
      completedModules: [],
      certificates: [],
    };
  }

  // Sicherstellen, dass accessibleModules existiert
  if (!data.studios[studioIndex].training.accessibleModules) {
    data.studios[studioIndex].training.accessibleModules = [];
  }

  const moduleIndex =
    data.studios[studioIndex].training.accessibleModules.indexOf(moduleId);

  if (hasAccess && moduleIndex === -1) {
    // Zugang gewähren
    data.studios[studioIndex].training.accessibleModules.push(moduleId);

    // Benachrichtigung an das Studio senden
    const moduleData = data.trainingModules.find((m) => m.id === moduleId);
    if (moduleData) {
      const messageId =
        data.messages.length > 0
          ? Math.max(...data.messages.map((m) => m.id)) + 1
          : 1;

      const notification = {
        id: messageId,
        sender: "YAVU Team",
        recipient: data.studios[studioIndex].name,
        subject: "Neuer Schulungszugang freigeschaltet",
        content: `Sie haben Zugang zur Schulung "${moduleData.title}" erhalten. Besuchen Sie den Schulungsbereich in Ihrem Dashboard, um die Inhalte anzusehen.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: "training_access",
        priority: "high",
      };

      data.messages.push(notification);
    }
  } else if (!hasAccess && moduleIndex !== -1) {
    // Zugang entziehen
    data.studios[studioIndex].training.accessibleModules.splice(moduleIndex, 1);
  }

  // Datenbank speichern
  localStorage.setItem("yavuData", JSON.stringify(data));

  return {
    success: true,
    message: hasAccess
      ? "Zugang zur Schulung wurde gewährt."
      : "Zugang zur Schulung wurde entzogen.",
  };
}

// Funktion zum Markieren einer Schulung als abgeschlossen (für Studios)
function completeTrainingModule(moduleId) {
  if (!isLoggedIn() || getUserType() !== "studio") {
    return {
      success: false,
      message: "Sie müssen als Studio angemeldet sein.",
    };
  }

  const studioId = getCurrentStudioId();
  if (!studioId) {
    return {
      success: false,
      message: "Studiodaten konnten nicht geladen werden.",
    };
  }

  const data = loadFromLocalStorage();
  const studioIndex = data.studios.findIndex((s) => s.id === studioId);

  if (studioIndex === -1) {
    return { success: false, message: "Studio nicht gefunden." };
  }

  // Prüfen, ob Zugang zur Schulung besteht
  if (
    !data.studios[studioIndex].training ||
    !data.studios[studioIndex].training.accessibleModules ||
    !data.studios[studioIndex].training.accessibleModules.includes(moduleId)
  ) {
    return { success: false, message: "Kein Zugang zu dieser Schulung." };
  }

  // Sicherstellen, dass completedModules existiert
  if (!data.studios[studioIndex].training.completedModules) {
    data.studios[studioIndex].training.completedModules = [];
  }

  // Prüfen, ob Schulung bereits abgeschlossen wurde
  if (data.studios[studioIndex].training.completedModules.includes(moduleId)) {
    return { success: false, message: "Schulung wurde bereits abgeschlossen." };
  }

  // Schulung als abgeschlossen markieren
  data.studios[studioIndex].training.completedModules.push(moduleId);

  // Zertifikat erstellen, falls alle Module einer Kategorie abgeschlossen sind
  const moduleData = data.trainingModules.find((m) => m.id === moduleId);
  if (moduleData) {
    const categoryModules = data.trainingModules.filter(
      (m) => m.category === moduleData.category
    );
    const completedInCategory = categoryModules.filter((m) =>
      data.studios[studioIndex].training.completedModules.includes(m.id)
    );

    // Wenn alle Module einer Kategorie abgeschlossen sind und noch kein Zertifikat existiert
    if (categoryModules.length === completedInCategory.length) {
      // Sicherstellen, dass certificates existiert
      if (!data.studios[studioIndex].training.certificates) {
        data.studios[studioIndex].training.certificates = [];
      }

      // Prüfen, ob Zertifikat für diese Kategorie bereits existiert
      const existingCert = data.studios[studioIndex].training.certificates.find(
        (c) => c.category === moduleData.category
      );

      if (!existingCert) {
        // Neues Zertifikat erstellen
        const newCertificate = {
          id: Date.now(),
          title: `Zertifizierung: ${getCategoryName(moduleData.category)}`,
          category: moduleData.category,
          issueDate: new Date().toISOString().split("T")[0],
          validUntil: getExpiryDate(365), // 1 Jahr gültig
          modules: categoryModules.map((m) => m.id),
        };

        data.studios[studioIndex].training.certificates.push(newCertificate);

        // Benachrichtigung über Zertifikat senden
        const messageId =
          data.messages.length > 0
            ? Math.max(...data.messages.map((m) => m.id)) + 1
            : 1;

        const notification = {
          id: messageId,
          sender: "YAVU Team",
          recipient: data.studios[studioIndex].name,
          subject: "Neues Zertifikat erhalten",
          content: `Herzlichen Glückwunsch! Sie haben alle Schulungen im Bereich "${getCategoryName(
            moduleData.category
          )}" abgeschlossen und ein Zertifikat erhalten.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "certificate",
          priority: "high",
        };

        data.messages.push(notification);
      }
    }
  }

  // Datenbank speichern
  localStorage.setItem("yavuData", JSON.stringify(data));

  return {
    success: true,
    message: "Schulung erfolgreich als abgeschlossen markiert.",
  };
}

// Hilfsfunktion: Kategoriename ermitteln
function getCategoryName(categoryKey) {
  const categories = {
    basic: "Grundlagen",
    advanced: "Fortgeschritten",
    special: "Spezial-Techniken",
  };

  return categories[categoryKey] || categoryKey;
}

// Hilfsfunktion: Ablaufdatum berechnen
function getExpiryDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

// Bei Seitenladung prüfen, ob der richtige Benutzertyp für die aktuelle Seite angemeldet ist
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;

  // Wenn auf der Hauptseite, keine Weiterleitung
  if (currentPath.endsWith("index.html") || currentPath.endsWith("/")) {
    return;
  }

  // Weiterleitung basierend auf Benutzertyp
  if (currentPath.includes("admin.html")) {
    checkAuthorization(["admin"]);
  } else if (currentPath.includes("studio.html")) {
    checkAuthorization(["studio"]);
  } else if (currentPath.includes("customer.html")) {
    checkAuthorization(["kunde"]);
  }
});

// Initialisierung: Wenn Login-Form vorhanden ist, Event-Listener hinzufügen
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginButton = document.getElementById("loginButton");
  const registerLink = document.querySelector(".register-link");
  const forgotPasswordLink = document.querySelector(".forgot-password-link");

  if (loginForm && loginButton) {
    loginButton.addEventListener("click", function () {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Benutzertyp bestimmen
      const loginTypeBtns = document.querySelectorAll(".login-type-btn");
      let selectedType = "kunde"; // Standardwert

      loginTypeBtns.forEach((btn) => {
        if (btn.classList.contains("active")) {
          selectedType = btn.getAttribute("data-type");
        }
      });

      if (!username || !password) {
        alert("Bitte geben Sie Benutzername und Passwort ein.");
        return;
      }

      const success = login(username, password, selectedType);

      if (success) {
        // Weiterleitung zur entsprechenden Seite
        if (selectedType === "admin") {
          window.location.href = "admin.html";
        } else if (selectedType === "studio") {
          window.location.href = "studio.html";
        } else {
          window.location.href = "customer.html";
        }
      } else {
        alert("Ungültige Anmeldedaten oder falscher Benutzertyp!");
      }
    });
  }

  // Falls Registrierungslink vorhanden ist
  if (registerLink) {
    registerLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Hier Modal öffnen oder zu Registrierungsseite weiterleiten
      document.getElementById("loginModal").style.display = "none";
      document.getElementById("registerModal").style.display = "flex";
    });
  }

  // Falls "Passwort vergessen"-Link vorhanden ist
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Hier Modal öffnen oder zu Passwort-Reset-Seite weiterleiten
      document.getElementById("loginModal").style.display = "none";
      document.getElementById("resetPasswordModal").style.display = "flex";
    });
  }

  // Logout-Buttons initialisieren
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  // Tabs initialisieren, falls vorhanden
  initializeTabs();
});

// Tabs initialisieren - wird für Customer und Studio Dashboard verwendet
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  if (tabButtons.length === 0 || tabContents.length === 0) return;

  // Standardmäßig ersten Tab aktiv setzen, alle anderen ausblenden
  tabContents.forEach((content) => {
    content.style.display = "none";
  });

  const firstTabContent = document.getElementById(
    tabButtons[0].getAttribute("data-target")
  );
  if (firstTabContent) {
    firstTabContent.style.display = "block";
  }

  // Event-Listener für Tab-Buttons
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Alle Tab-Buttons deaktivieren
      tabButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      // Alle Tab-Inhalte ausblenden
      tabContents.forEach((content) => {
        content.style.display = "none";
      });

      // Angeklickten Tab aktivieren
      this.classList.add("active");

      // Zugehörigen Inhalt anzeigen
      const targetId = this.getAttribute("data-target");
      const targetContent = document.getElementById(targetId);

      if (targetContent) {
        targetContent.style.display = "block";

        // Für Schulungsbereich: Prüfen, ob Ausbildungsdaten geladen werden müssen
        if (
          targetId === "trainingsTab" &&
          typeof loadTrainingData === "function"
        ) {
          loadTrainingData();
        }

        // Für Buchungsverwaltung: Prüfen, ob Buchungsdaten aktualisiert werden müssen
        if (targetId === "bookingsTab" && typeof loadBookings === "function") {
          loadBookings();
        }

        // Animation hinzufügen
        targetContent.classList.add("fade-in");
        setTimeout(() => {
          targetContent.classList.remove("fade-in");
        }, 500);
      }

      // URL-Hash aktualisieren für direkten Link zu diesem Tab
      window.location.hash = targetId;

      // Event auslösen, damit andere Komponenten reagieren können
      const tabChangeEvent = new CustomEvent("tabChanged", {
        detail: {
          tabId: targetId,
        },
      });
      document.dispatchEvent(tabChangeEvent);
    });
  });

  // Bei Seitenladen prüfen, ob ein Tab in der URL angegeben ist
  const hashTab = window.location.hash.substring(1);
  if (hashTab) {
    const hashTabButton = document.querySelector(
      `.tab-button[data-target="${hashTab}"]`
    );
    if (hashTabButton) {
      hashTabButton.click();
    }
  }

  // Falls kein Tab in der URL angegeben ist, standardmäßig den ersten Tab aktivieren
  else {
    const firstTabButton = tabButtons[0];
    if (firstTabButton) {
      firstTabButton.click();
    }
  }
}

// Funktion zum Abrufen von Benutzerinformationen
function getUserInfo() {
  if (!isLoggedIn()) {
    return null;
  }

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const data = loadFromLocalStorage();

  if (user.type === "kunde") {
    const customer = data.customers.find((c) => c.id === user.customerId);
    if (customer) {
      return {
        id: user.id,
        type: user.type,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        registrationDate: customer.registrationDate,
        favoriteStudios: customer.favoriteStudios || [],
        address: customer.address || {},
        preferences: customer.preferences || {},
        loyaltyPoints: customer.loyaltyPoints || 0,
        bookingCount: customer.bookingCount || 0,
      };
    }
  } else if (user.type === "studio") {
    const studio = data.studios.find((s) => s.id === user.studioId);
    if (studio) {
      return {
        id: user.id,
        type: user.type,
        name: studio.name,
        location: studio.location,
        email: studio.email,
        phone: studio.phone,
        contact: studio.contact,
        rating: studio.rating,
        reviewCount: studio.reviewCount,
        status: studio.status,
        registrationDate: studio.registrationDate,
        training: studio.training || {},
        social: studio.social || {},
      };
    }
  } else if (user.type === "admin") {
    return {
      id: user.id,
      type: user.type,
      username: user.username,
    };
  }

  return null;
}

// Funktion zum Aktualisieren der Benutzerinformationen
function updateUserInfo(userInfo) {
  if (!isLoggedIn()) {
    return { success: false, message: "Sie sind nicht angemeldet." };
  }

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const data = loadFromLocalStorage();

  if (user.type === "kunde") {
    const customerIndex = data.customers.findIndex(
      (c) => c.id === user.customerId
    );
    if (customerIndex === -1) {
      return { success: false, message: "Kundendaten nicht gefunden." };
    }

    // Nur bestimmte Felder aktualisieren
    const updatableFields = [
      "name",
      "email",
      "phone",
      "address",
      "preferences",
    ];
    updatableFields.forEach((field) => {
      if (userInfo[field] !== undefined) {
        data.customers[customerIndex][field] = userInfo[field];
      }
    });

    // E-Mail auch in der users-Tabelle aktualisieren, wenn sie geändert wurde
    if (
      userInfo.email !== undefined &&
      userInfo.email !== data.customers[customerIndex].email
    ) {
      const userIndex = data.users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        data.users[userIndex].username = userInfo.email;
      }
    }
  } else if (user.type === "studio") {
    const studioIndex = data.studios.findIndex((s) => s.id === user.studioId);
    if (studioIndex === -1) {
      return { success: false, message: "Studiodaten nicht gefunden." };
    }

    // Nur bestimmte Felder aktualisieren
    const updatableFields = [
      "name",
      "location",
      "contact",
      "phone",
      "description",
      "social",
    ];
    updatableFields.forEach((field) => {
      if (userInfo[field] !== undefined) {
        data.studios[studioIndex][field] = userInfo[field];
      }
    });

    // E-Mail nicht direkt aktualisierbar (erfordert Admin-Genehmigung)
  }

  // Datenbank speichern
  localStorage.setItem("yavuData", JSON.stringify(data));

  return {
    success: true,
    message: "Ihre Daten wurden erfolgreich aktualisiert.",
  };
}

// Funktion zum Überprüfen, ob ein Benutzer Zugriff auf ein Schulungsmodul hat
function hasTrainingAccess(moduleId) {
  if (!isLoggedIn() || getUserType() !== "studio") {
    return false;
  }

  const studioId = getCurrentStudioId();
  if (!studioId) return false;

  const data = loadFromLocalStorage();
  const studio = data.studios.find((s) => s.id === studioId);

  return (
    studio &&
    studio.training &&
    studio.training.accessibleModules &&
    studio.training.accessibleModules.includes(moduleId)
  );
}

// Funktion zum Überprüfen, ob ein Benutzer ein Schulungsmodul abgeschlossen hat
function hasCompletedTraining(moduleId) {
  if (!isLoggedIn() || getUserType() !== "studio") {
    return false;
  }

  const studioId = getCurrentStudioId();
  if (!studioId) return false;

  const data = loadFromLocalStorage();
  const studio = data.studios.find((s) => s.id === studioId);

  return (
    studio &&
    studio.training &&
    studio.training.completedModules &&
    studio.training.completedModules.includes(moduleId)
  );
}

// Funktion zum Abrufen aller Zertifikate eines Studios
function getStudioCertificates() {
  if (!isLoggedIn() || getUserType() !== "studio") {
    return [];
  }

  const studioId = getCurrentStudioId();
  if (!studioId) return [];

  const data = loadFromLocalStorage();
  const studio = data.studios.find((s) => s.id === studioId);

  return studio && studio.training && studio.training.certificates
    ? studio.training.certificates
    : [];
}

// Funktion zum Ausstellen eines Zertifikats (für Admin)
function issueCertificate(studioId, certificateData) {
  if (!isLoggedIn() || getUserType() !== "admin") {
    return {
      success: false,
      message: "Sie benötigen Administratorrechte für diese Aktion.",
    };
  }

  if (!certificateData || !certificateData.title || !certificateData.category) {
    return { success: false, message: "Unvollständige Zertifikatsdaten." };
  }

  const data = loadFromLocalStorage();
  const studioIndex = data.studios.findIndex((s) => s.id === studioId);

  if (studioIndex === -1) {
    return { success: false, message: "Studio nicht gefunden." };
  }

  // Sicherstellen, dass die training-Struktur existiert
  if (!data.studios[studioIndex].training) {
    data.studios[studioIndex].training = {
      accessibleModules: [],
      completedModules: [],
      certificates: [],
    };
  }

  // Sicherstellen, dass certificates existiert
  if (!data.studios[studioIndex].training.certificates) {
    data.studios[studioIndex].training.certificates = [];
  }

  // Neues Zertifikat erstellen
  const newCertificate = {
    id: Date.now(),
    title: certificateData.title,
    category: certificateData.category,
    issueDate: new Date().toISOString().split("T")[0],
    validUntil: certificateData.validUntil || getExpiryDate(365), // 1 Jahr gültig standardmäßig
    modules: certificateData.modules || [],
    issuedBy: "YAVU Admin",
  };

  data.studios[studioIndex].training.certificates.push(newCertificate);

  // Benachrichtigung über Zertifikat senden
  const messageId =
    data.messages.length > 0
      ? Math.max(...data.messages.map((m) => m.id)) + 1
      : 1;

  const notification = {
    id: messageId,
    sender: "YAVU Team",
    recipient: data.studios[studioIndex].name,
    subject: "Neues Zertifikat erhalten",
    content: `Herzlichen Glückwunsch! Sie haben ein neues Zertifikat "${newCertificate.title}" erhalten.`,
    timestamp: new Date().toISOString(),
    read: false,
    type: "certificate",
    priority: "high",
  };

  data.messages.push(notification);

  // Datenbank speichern
  localStorage.setItem("yavuData", JSON.stringify(data));

  return {
    success: true,
    message: "Zertifikat erfolgreich ausgestellt.",
    certificate: newCertificate,
  };
}

// Funktion zum Aktualisieren des Zugriffsstatus für ein Studio (für Admin)
function updateStudioStatus(studioId, newStatus) {
  if (!isLoggedIn() || getUserType() !== "admin") {
    return {
      success: false,
      message: "Sie benötigen Administratorrechte für diese Aktion.",
    };
  }

  if (!["active", "pending", "inactive"].includes(newStatus)) {
    return { success: false, message: "Ungültiger Status." };
  }

  const data = loadFromLocalStorage();
  const studioIndex = data.studios.findIndex((s) => s.id === studioId);

  if (studioIndex === -1) {
    return { success: false, message: "Studio nicht gefunden." };
  }

  // Status aktualisieren
  const oldStatus = data.studios[studioIndex].status;
  data.studios[studioIndex].status = newStatus;

  // Auch im users-Array aktualisieren
  const userIndex = data.users.findIndex(
    (u) => u.studioId === studioId && u.type === "studio"
  );
  if (userIndex !== -1) {
    data.users[userIndex].status = newStatus;
  }

  // Benachrichtigung über Statusänderung senden
  const messageId =
    data.messages.length > 0
      ? Math.max(...data.messages.map((m) => m.id)) + 1
      : 1;

  let msgContent = "";

  if (newStatus === "active" && oldStatus !== "active") {
    msgContent =
      "Ihr Studio wurde aktiviert und ist jetzt für Kunden sichtbar. Sie können nun Ihr Profil vervollständigen und Behandlungen anbieten.";
  } else if (newStatus === "inactive" && oldStatus !== "inactive") {
    msgContent =
      "Ihr Studio wurde deaktiviert und ist für Kunden nicht mehr sichtbar. Bitte kontaktieren Sie den Administrator für weitere Informationen.";
  } else if (newStatus === "pending" && oldStatus !== "pending") {
    msgContent =
      "Ihr Studio befindet sich im Prüfungsstatus. Bitte warten Sie auf die Freischaltung durch den Administrator.";
  }

  if (msgContent) {
    const notification = {
      id: messageId,
      sender: "YAVU Team",
      recipient: data.studios[studioIndex].name,
      subject: "Statusänderung Ihres Studios",
      content: msgContent,
      timestamp: new Date().toISOString(),
      read: false,
      type: "status_change",
      priority: "high",
    };

    data.messages.push(notification);
  }

  // Datenbank speichern
  localStorage.setItem("yavuData", JSON.stringify(data));

  return {
    success: true,
    message: `Status des Studios wurde zu "${newStatus}" geändert.`,
  };
}
