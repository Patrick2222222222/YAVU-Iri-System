// JavaScript für die YAVU-Startseite

document.addEventListener("DOMContentLoaded", function () {
  // Prüfen, ob Benutzer bereits eingeloggt ist
  if (isLoggedIn()) {
    const userType = getUserType();
    redirectToUserDashboard(userType);
  }

  // Hauptnavigation mit Smooth Scroll für Anker-Links
  setupNavigation();

  // Login und Registrierung
  setupAuthentication();

  // Testimonials Slider
  setupTestimonialSlider();

  // FAQ Accordion
  setupFaqAccordion();

  // Studio-Finder mit Mapbox-Integration
  setupStudioFinder();

  // Kontaktformular
  setupContactForm();

  // Mobile Navigation
  setupMobileNavigation();

  // Animationen beim Scrollen
  setupScrollAnimations();
});

// ============ Haupt-Navigation Setup ============
function setupNavigation() {
  // Smooth Scroll für Anker-Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return; // Ignoriere leere Anker

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // 80px für Header-Höhe
          behavior: "smooth",
        });
      }
    });
  });

  // Header-Animation beim Scrollen
  const header = document.querySelector(".main-header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Header kleiner machen beim Runterscrollen
    if (scrollTop > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop;
  });
}

// ============ Mobile Navigation Setup ============
function setupMobileNavigation() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mainNav = document.querySelector(".main-nav");

  if (!mobileMenuBtn || !mainNav) return;

  mobileMenuBtn.addEventListener("click", function () {
    this.classList.toggle("active");
    mainNav.classList.toggle("mobile-active");

    if (mainNav.classList.contains("mobile-active")) {
      document.body.style.overflow = "hidden"; // Verhindere Scrollen im Hintergrund
    } else {
      document.body.style.overflow = ""; // Erlaube Scrollen wieder
    }
  });

  // Schließe Mobile-Menü bei Klick auf einen Link
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function () {
      mainNav.classList.remove("mobile-active");
      mobileMenuBtn.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

// ============ Authentifizierung Setup ============
function setupAuthentication() {
  // Login Modal
  const loginModal = document.getElementById("loginModal");
  const openLoginBtn = document.getElementById("openLoginModal");
  const closeLoginBtn = document.getElementById("closeLoginModal");
  const loginForm = document.getElementById("loginForm");
  const loginButton = document.getElementById("loginButton");
  const loginTypeBtns = document.querySelectorAll(".login-type-btn");

  // Register Modal
  const registerModal = document.getElementById("registerModal");
  const studioRegisterBtn = document.getElementById("studioRegisterFooter");
  const customerRegisterBtn = document.getElementById("customerRegisterFooter");
  const closeRegisterBtn = document.getElementById("closeRegisterModal");
  const customerRegisterForm = document.getElementById("customerRegisterForm");
  const studioRegisterForm = document.getElementById("studioRegisterForm");
  const registerTypeBtns = document.querySelectorAll(
    "#registerModal .login-type-btn"
  );

  // Password Reset Modal
  const resetPasswordModal = document.getElementById("resetPasswordModal");
  const closeResetBtn = document.getElementById("closeResetModal");
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  const forgotPasswordLink = document.querySelector(".forgot-password-link");

  // Aktuelle Login/Register-Art
  let currentLoginType = "kunde";

  // ---- Login Modal Funktionen ----
  if (openLoginBtn && loginModal) {
    // Login Modal öffnen
    openLoginBtn.addEventListener("click", () => {
      loginModal.style.display = "flex";

      // Standardmäßig Kunden-Login-Typ auswählen
      loginTypeBtns.forEach((btn) => {
        if (btn.getAttribute("data-type") === "kunde") {
          btn.classList.add("active");
          currentLoginType = "kunde";
        } else {
          btn.classList.remove("active");
        }
      });

      // Login-Formular anzeigen
      document.querySelector(".login-form").classList.add("active");
    });

    // Login Modal über Footer-Links öffnen
    const studioLoginFooter = document.getElementById("studioLoginFooter");
    const customerLoginFooter = document.getElementById("customerLoginFooter");

    if (studioLoginFooter) {
      studioLoginFooter.addEventListener("click", (e) => {
        e.preventDefault();
        setLoginType("studio");
        loginModal.style.display = "flex";
      });
    }

    if (customerLoginFooter) {
      customerLoginFooter.addEventListener("click", (e) => {
        e.preventDefault();
        setLoginType("kunde");
        loginModal.style.display = "flex";
      });
    }

    // Login Modal schließen
    if (closeLoginBtn) {
      closeLoginBtn.addEventListener("click", () => {
        loginModal.style.display = "none";
      });
    }

    // Login-Typ Buttons
    if (loginTypeBtns) {
      loginTypeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          loginTypeBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          currentLoginType = btn.getAttribute("data-type");

          // Alle Formulare ausblenden
          document
            .querySelectorAll(".login-form, .register-form, .reset-form")
            .forEach((form) => {
              form.classList.remove("active");
            });

          // Login-Formular anzeigen
          document.querySelector(".login-form").classList.add("active");
        });
      });
    }

    // Login Button
    if (loginButton) {
      loginButton.addEventListener("click", performLogin);
    }

    // Register Link im Login Modal
    const registerLink = document.querySelector(".register-link");
    if (registerLink && registerModal) {
      registerLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginModal.style.display = "none";
        registerModal.style.display = "flex";

        // Übertrage den ausgewählten Login-Typ zum Register-Modal
        setRegisterType(currentLoginType);
      });
    }

    // Forgot Password Link
    if (forgotPasswordLink && resetPasswordModal) {
      forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginModal.style.display = "none";
        resetPasswordModal.style.display = "flex";
      });
    }
  }

  // ---- Register Modal Funktionen ----
  if (registerModal) {
    // Register Modal öffnen über Footer-Links
    if (studioRegisterBtn) {
      studioRegisterBtn.addEventListener("click", (e) => {
        e.preventDefault();
        setRegisterType("studio");
        registerModal.style.display = "flex";
      });
    }

    if (customerRegisterBtn) {
      customerRegisterBtn.addEventListener("click", (e) => {
        e.preventDefault();
        setRegisterType("kunde");
        registerModal.style.display = "flex";
      });
    }

    // Register Modal öffnen über "Studio registrieren" Button
    const openStudioRegister = document.getElementById("openStudioRegister");
    if (openStudioRegister) {
      openStudioRegister.addEventListener("click", () => {
        setRegisterType("studio");
        registerModal.style.display = "flex";
      });
    }

    // Register Modal schließen
    if (closeRegisterBtn) {
      closeRegisterBtn.addEventListener("click", () => {
        registerModal.style.display = "none";
      });
    }

    // Register-Typ Buttons
    if (registerTypeBtns) {
      registerTypeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          registerTypeBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          const type = btn.getAttribute("data-type");
          toggleRegisterForms(type);
        });
      });
    }

    // Kunden-Registrierungsformular
    if (customerRegisterForm) {
      customerRegisterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        registerCustomerForm();
      });
    }

    // Studio-Registrierungsformular
    if (studioRegisterForm) {
      studioRegisterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        registerStudioForm();
      });
    }

    // Login Links im Register Modal
    const loginLinks = document.querySelectorAll(".login-link");
    if (loginLinks.length > 0 && loginModal) {
      loginLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          registerModal.style.display = "none";
          loginModal.style.display = "flex";
        });
      });
    }
  }

  // ---- Password Reset Modal Funktionen ----
  if (resetPasswordModal) {
    // Reset Modal schließen
    if (closeResetBtn) {
      closeResetBtn.addEventListener("click", () => {
        resetPasswordModal.style.display = "none";
      });
    }

    // Reset Formular
    if (resetPasswordForm) {
      resetPasswordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        requestPasswordReset();
      });
    }

    // Login Link im Reset Modal
    const loginLink = resetPasswordModal.querySelector(".login-link");
    if (loginLink && loginModal) {
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        resetPasswordModal.style.display = "none";
        loginModal.style.display = "flex";
      });
    }
  }

  // Schließen bei Klick außerhalb
  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
    if (event.target === registerModal) {
      registerModal.style.display = "none";
    }
    if (event.target === resetPasswordModal) {
      resetPasswordModal.style.display = "none";
    }
  });

  // Helper-Funktionen für Auth-Modals
  function setLoginType(type) {
    currentLoginType = type;
    loginTypeBtns.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-type") === type) {
        btn.classList.add("active");
      }
    });
  }

  function setRegisterType(type) {
    registerTypeBtns.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-type") === type) {
        btn.classList.add("active");
      }
    });

    toggleRegisterForms(type);
  }

  function toggleRegisterForms(type) {
    const customerForm = document.getElementById("customerRegisterForm");
    const studioForm = document.getElementById("studioRegisterForm");

    if (type === "kunde") {
      customerForm.classList.add("active");
      studioForm.classList.remove("active");
    } else {
      customerForm.classList.remove("active");
      studioForm.classList.add("active");
    }
  }
}

// Login-Funktion
function performLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Benutzertyp ermitteln
  const loginTypeBtns = document.querySelectorAll(".login-type-btn");
  let selectedType = "kunde"; // Standardwert

  loginTypeBtns.forEach((btn) => {
    if (btn.classList.contains("active")) {
      selectedType = btn.getAttribute("data-type");
    }
  });

  if (!username || !password) {
    showNotification("Bitte geben Sie Benutzername und Passwort ein.", "error");
    return;
  }

  const success = login(username, password, selectedType);

  if (success) {
    redirectToUserDashboard(selectedType);
  } else {
    showNotification(
      "Ungültige Anmeldedaten oder falscher Benutzertyp!",
      "error"
    );
  }
}

// Umleitung zum richtigen Dashboard
function redirectToUserDashboard(userType) {
  switch (userType) {
    case "admin":
      window.location.href = "admin.html";
      break;
    case "studio":
      window.location.href = "studio.html";
      break;
    case "kunde":
      window.location.href = "customer.html";
      break;
  }
}

// Kunden-Registrierung
function registerCustomerForm() {
  const name = document.getElementById("customerName").value;
  const email = document.getElementById("customerEmail").value;
  const password = document.getElementById("customerPassword").value;
  const passwordConfirm = document.getElementById(
    "customerPasswordConfirm"
  ).value;
  const terms = document.getElementById("customerTerms").checked;

  // Validierung
  if (!name || !email || !password) {
    showNotification("Bitte füllen Sie alle Pflichtfelder aus.", "error");
    return;
  }

  if (password !== passwordConfirm) {
    showNotification("Die Passwörter stimmen nicht überein.", "error");
    return;
  }

  if (!terms) {
    showNotification(
      "Bitte akzeptieren Sie die AGB und Datenschutzerklärung.",
      "error"
    );
    return;
  }

  // Registrierungsfunktion aufrufen
  const result = registerCustomer(name, email, password);

  if (result.success) {
    showNotification(result.message, "success");
    document.getElementById("customerRegisterForm").reset();

    // Modal schließen
    setTimeout(() => {
      document.getElementById("registerModal").style.display = "none";
      document.getElementById("loginModal").style.display = "flex";
    }, 2000);
  } else {
    showNotification(result.message, "error");
  }
}

// Studio-Registrierung
function registerStudioForm() {
  const name = document.getElementById("studioName").value;
  const location = document.getElementById("studioLocation").value;
  const contact = document.getElementById("studioContact").value;
  const email = document.getElementById("studioEmail").value;
  const phone = document.getElementById("studioPhone").value;
  const password = document.getElementById("studioPassword").value;
  const passwordConfirm = document.getElementById(
    "studioPasswordConfirm"
  ).value;
  const terms = document.getElementById("studioTerms").checked;

  // Validierung
  if (!name || !location || !email || !password) {
    showNotification("Bitte füllen Sie alle Pflichtfelder aus.", "error");
    return;
  }

  if (password !== passwordConfirm) {
    showNotification("Die Passwörter stimmen nicht überein.", "error");
    return;
  }

  if (!terms) {
    showNotification(
      "Bitte akzeptieren Sie die AGB und Datenschutzerklärung.",
      "error"
    );
    return;
  }

  // Registrierungsfunktion aufrufen
  const result = registerStudio(
    name,
    location,
    email,
    password,
    contact,
    phone
  );

  if (result.success) {
    showNotification(result.message, "success");
    document.getElementById("studioRegisterForm").reset();

    // Modal schließen
    setTimeout(() => {
      document.getElementById("registerModal").style.display = "none";
      document.getElementById("loginModal").style.display = "flex";
    }, 2000);
  } else {
    showNotification(result.message, "error");
  }
}

// Passwort zurücksetzen
function requestPasswordReset() {
  const email = document.getElementById("resetEmail").value;

  if (!email) {
    showNotification("Bitte geben Sie Ihre E-Mail-Adresse ein.", "error");
    return;
  }

  const result = resetPassword(email);

  if (result.success) {
    showNotification(result.message, "success");
    document.getElementById("resetPasswordForm").reset();

    // Modal schließen
    setTimeout(() => {
      document.getElementById("resetPasswordModal").style.display = "none";
      document.getElementById("loginModal").style.display = "flex";
    }, 3000);
  } else {
    showNotification(result.message, "error");
  }
}

// ============ Testimonials Slider Setup ============
function setupTestimonialSlider() {
  const slider = document.getElementById("testimonialsSlider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".testimonial-slide");
  const dots = slider.querySelectorAll(".dot");
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");

  if (slides.length === 0) return;

  let currentSlide = 0;

  // Initialisieren - ersten Slide anzeigen
  slides[currentSlide].classList.add("active");
  if (dots.length > 0) {
    dots[currentSlide].classList.add("active");
  }

  // Dots-Klick-Handler
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  // Prev-Button-Klick-Handler
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goToSlide(currentSlide - 1);
    });
  }

  // Next-Button-Klick-Handler
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goToSlide(currentSlide + 1);
    });
  }

  // Automatisches Fortsetzen
  let slideInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 6000);

  // Pause bei Mouseover
  slider.addEventListener("mouseenter", () => {
    clearInterval(slideInterval);
  });

  // Fortsetzen bei Mouseleave
  slider.addEventListener("mouseleave", () => {
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
  });

  // Touch-Events für mobile Geräte
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50; // Mindestdistanz für Swipe
    if (touchEndX < touchStartX - swipeThreshold) {
      // Nach links swipen -> nächster Slide
      goToSlide(currentSlide + 1);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Nach rechts swipen -> vorheriger Slide
      goToSlide(currentSlide - 1);
    }
  }

  // Zu bestimmtem Slide gehen
  function goToSlide(n) {
    // Aktuellen Slide deaktivieren
    slides[currentSlide].classList.remove("active");
    if (dots.length > 0) {
      dots[currentSlide].classList.remove("active");
    }

    // Neuen Slide-Index berechnen (zirkulär)
    currentSlide = (n + slides.length) % slides.length;

    // Neuen Slide aktivieren
    slides[currentSlide].classList.add("active");
    if (dots.length > 0) {
      dots[currentSlide].classList.add("active");
    }
  }
}

// ============ FAQ Accordion Setup ============
function setupFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Alle schließen
      faqItems.forEach((faq) => {
        faq.classList.remove("active");
      });

      // Aktuelles öffnen, wenn es nicht geöffnet war
      if (!isOpen) {
        item.classList.add("active");
      }
    });
  });
}

// ============ Studio-Finder Setup mit Mapbox ============
function setupStudioFinder() {
  const studioFinderForm = document.querySelector(".studio-finder-form");
  const searchStudioBtn = document.getElementById("searchStudioBtn");
  const studioMap = document.getElementById("studioMap");
  const studioResults = document.getElementById("studioResults");

  if (!studioFinderForm || !searchStudioBtn || !studioResults) return;

  // Mapbox Access Token - Ersetzen Sie dies durch Ihren eigenen Token
  mapboxgl.accessToken =
    "pk.eyJ1IjoieWF2dSIsImEiOiJjbG9qcXBtOWUwY2E5MnFuOHM0YnI2YmZiIn0.I5TXWqEp3a8vFQwRMBIT3A";

  let map;
  let markers = [];

  // Karte initialisieren, wenn das Element existiert
  if (studioMap) {
    initMap();
  }

  // Suchbutton-Klick-Handler
  searchStudioBtn.addEventListener("click", () => {
    const location = document.getElementById("location").value;
    const radius = document.getElementById("radius").value;

    if (!location) {
      showNotification("Bitte geben Sie einen Standort ein.", "error");
      return;
    }

    // Standort geocodieren und Studios suchen
    geocodeLocation(location, radius);
  });

  // Enter-Taste in der Standorteingabe
  const locationInput = document.getElementById("location");
  if (locationInput) {
    locationInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        searchStudioBtn.click();
      }
    });
  }

  // Mapbox Karte initialisieren
  function initMap() {
    // Standardkartenansicht auf Deutschland zentrieren
    map = new mapboxgl.Map({
      container: studioMap,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [10.4515, 51.1657], // Zentrum von Deutschland
      zoom: 5,
    });

    // Karten-Steuerelemente hinzufügen
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Geolocation-Steuerung hinzufügen
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    // Karte bei Laden stylen
    map.on("load", function () {
      // Hier kann weiterer Kartensetup erfolgen, wie z.B. Daten-Quellen hinzufügen
    });
  }

  // Standort mit Mapbox Geocoding API geocodieren
  async function geocodeLocation(locationName, radiusKm) {
    try {
      // Laden-Animation anzeigen
      studioResults.innerHTML = `
        <div class="loading-indicator">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Studios werden gesucht...</p>
        </div>
      `;

      // Geocoding-Anfrage an Mapbox API
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          locationName
        )}.json?access_token=${mapboxgl.accessToken}&country=de&limit=1`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;

        // Karte auf den geocodierten Standort zentrieren
        map.flyTo({
          center: [lng, lat],
          zoom: 11,
          essential: true,
        });

        // Zum Standort einen Marker hinzufügen
        new mapboxgl.Marker({
          color: "#FFFFFF",
        })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<p>Ihr Standort: ${data.features[0].place_name}</p>`
            )
          )
          .addTo(map);

        // Studios in der Nähe suchen
        searchStudiosNearby(lng, lat, radiusKm);
      } else {
        showNotification(
          "Der angegebene Ort konnte nicht gefunden werden.",
          "error"
        );
        studioResults.innerHTML = `
          <div class="no-results">
            <p>Der angegebene Ort konnte nicht gefunden werden.</p>
          </div>
        `;
      }
    } catch (error) {
      console.error("Geocoding-Fehler:", error);
      showNotification(
        "Bei der Standortsuche ist ein Fehler aufgetreten.",
        "error"
      );
      studioResults.innerHTML = `
        <div class="no-results">
          <p>Bei der Standortsuche ist ein Fehler aufgetreten.</p>
        </div>
      `;
    }
  }

  // Studios in der Nähe eines Standorts suchen
  function searchStudiosNearby(lng, lat, radiusKm) {
    const data = loadFromLocalStorage();

    // Vorhandene Marker entfernen
    markers.forEach((marker) => marker.remove());
    markers = [];

    // In einer echten App würde hier eine Geo-Suche stattfinden
    // Für den Prototyp zeigen wir alle aktiven Studios an und berechnen die Entfernung
    const activeStudios = data.studios.filter(
      (studio) => studio.status === "active"
    );

    // Entfernung zum Standort berechnen und Studios sortieren
    const studiosWithDistance = activeStudios
      .map((studio) => {
        // Zufällige Standortkoordinaten für jedes Studio generieren (für den Prototyp)
        // In einer realen App würden diese aus der Datenbank kommen
        const studioLng = lng + (Math.random() - 0.5) * 0.1;
        const studioLat = lat + (Math.random() - 0.5) * 0.1;

        // Entfernung berechnen
        const distance = calculateDistance(lat, lng, studioLat, studioLng);

        return {
          ...studio,
          distance,
          coordinates: [studioLng, studioLat],
        };
      })
      .filter((studio) => studio.distance <= radiusKm) // Nur Studios innerhalb des Radius
      .sort((a, b) => a.distance - b.distance); // Nach Entfernung sortieren

    // Ergebnisse anzeigen
    displayStudioResults(studiosWithDistance);

    // Studios auf der Karte hinzufügen
    addStudiosToMap(studiosWithDistance);
  }

  // Studios auf der Karte anzeigen
  function addStudiosToMap(studios) {
    studios.forEach((studio) => {
      // Marker-Element erstellen
      const markerEl = document.createElement("div");
      markerEl.className = "marker";
      markerEl.style.backgroundColor = "#d4af37";
      markerEl.style.width = "30px";
      markerEl.style.height = "30px";
      markerEl.style.borderRadius = "50%";
      markerEl.style.border = "2px solid white";
      markerEl.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
      markerEl.style.cursor = "pointer";
      markerEl.style.display = "flex";
      markerEl.style.alignItems = "center";
      markerEl.style.justifyContent = "center";
      markerEl.innerHTML = `<i class="fas fa-spa" style="color: #000000;"></i>`;

      // Popup-Inhalt erstellen
      const popupHTML = `
        <div class="popup-content">
          <h3>${studio.name}</h3>
          <p>${studio.location}</p>
          <div class="popup-rating">
            ${"★".repeat(Math.floor(studio.rating))}${"☆".repeat(
        5 - Math.floor(studio.rating)
      )}
            <span>(${studio.reviewCount} Bewertungen)</span>
          </div>
          <div class="popup-actions">
            <button class="action-btn studio-details-btn" data-id="${
              studio.id
            }">DETAILS</button>
            <button class="action-btn btn-primary studio-book-btn" data-id="${
              studio.id
            }">BUCHEN</button>
          </div>
        </div>
      `;

      // Marker mit Popup erstellen
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(studio.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
        .addTo(map);

      // Marker-Referenz speichern
      markers.push(marker);

      // Event-Listener für Popup-Buttons
      marker.getPopup().on("open", () => {
        setTimeout(() => {
          const detailsBtn = document.querySelector(
            `.studio-details-btn[data-id="${studio.id}"]`
          );
          const bookBtn = document.querySelector(
            `.studio-book-btn[data-id="${studio.id}"]`
          );

          if (detailsBtn) {
            detailsBtn.addEventListener("click", () => {
              // In einer finalen Version würde hier zur Studioprofilseite weitergeleitet werden
              showStudioDetails(studio.id);
            });
          }

          if (bookBtn) {
            bookBtn.addEventListener("click", () => {
              bookAppointment(studio.id);
            });
          }
        }, 100);
      });
    });

    // Karte auf alle Marker anpassen, falls vorhanden
    if (studios.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      studios.forEach((studio) => {
        bounds.extend(studio.coordinates);
      });

      // Padding hinzufügen und Karte auf Grenzen anpassen
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }
}

// Studio-Ergebnisse im Ergebnisbereich anzeigen
function displayStudioResults(studios) {
  studioResults.innerHTML = "";

  if (studios.length === 0) {
    studioResults.innerHTML = `
        <div class="no-results">
          <p>Keine Studios in Ihrer Nähe gefunden.</p>
          <p>Versuchen Sie es mit einem größeren Suchradius oder einem anderen Standort.</p>
        </div>
      `;
    return;
  }

  studios.forEach((studio) => {
    // Studiokarte erstellen
    const studioCard = document.createElement("div");
    studioCard.className = "studio-card";

    // Entfernung auf eine Dezimalstelle runden
    const formattedDistance = Math.round(studio.distance * 10) / 10;

    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += i <= Math.round(studio.rating) ? "★" : "☆";
    }

    studioCard.innerHTML = `
        <div class="studio-image">
          <img src="images/studio-placeholder.jpg" alt="${studio.name}">
        </div>
        <div class="studio-info">
          <h3><i class="fas fa-spa"></i> ${studio.name}</h3>
          <div class="studio-rating">${stars} <span>(${
      studio.reviewCount
    } Bewertungen)</span></div>
          <p><i class="fas fa-map-marker-alt"></i> ${studio.location}</p>
          <p><i class="fas fa-route"></i> ${formattedDistance} km entfernt</p>
          <p><i class="fas fa-phone"></i> ${
            studio.phone || "Keine Telefonnummer angegeben"
          }</p>
        </div>
        <div class="studio-actions">
          <button class="action-btn profile-btn" data-id="${
            studio.id
          }"><i class="fas fa-info-circle"></i> PROFIL</button>
          <button class="action-btn btn-primary book-btn" data-id="${
            studio.id
          }"><i class="fas fa-calendar-plus"></i> TERMIN BUCHEN</button>
        </div>
      `;

    // Event-Listener für Buttons
    const profileBtn = studioCard.querySelector(".profile-btn");
    const bookBtn = studioCard.querySelector(".book-btn");

    profileBtn.addEventListener("click", () => {
      showStudioDetails(studio.id);
    });

    bookBtn.addEventListener("click", () => {
      bookAppointment(studio.id);
    });

    studioResults.appendChild(studioCard);

    // Animation für die Karte
    studioCard.addEventListener("mouseenter", () => {
      // Finde den entsprechenden Marker und öffne das Popup
      const marker = markers.find((m) =>
        m.getPopup()._content.includes(`data-id="${studio.id}"`)
      );
      if (marker) {
        marker.togglePopup();
      }
    });

    studioCard.addEventListener("mouseleave", () => {
      // Popup wieder schließen
      const marker = markers.find((m) =>
        m.getPopup()._content.includes(`data-id="${studio.id}"`)
      );
      if (marker && marker.getPopup().isOpen()) {
        marker.togglePopup();
      }
    });
  });

  // ScrollTo-Ergebnisse
  studioResults.scrollIntoView({ behavior: "smooth" });
}

// Studiodetails anzeigen (Placeholder für die finale Version)
function showStudioDetails(studioId) {
  const data = loadFromLocalStorage();
  const studio = data.studios.find((s) => s.id === studioId);

  if (!studio) {
    showNotification("Studio-Daten konnten nicht geladen werden.", "error");
    return;
  }

  // Hier würde in der finalen Version zur Studioprofilseite navigiert werden
  alert(
    `Profil von ${studio.name} wird in der finalen Version verfügbar sein.`
  );
}

// Termin buchen
function bookAppointment(studioId) {
  // Prüfen, ob Benutzer eingeloggt ist
  if (isLoggedIn() && getUserType() === "kunde") {
    window.location.href = `customer.html?book=${studioId}`;
  } else {
    // Login-Modal öffnen und Typ auf "kunde" setzen
    const loginModal = document.getElementById("loginModal");
    const loginTypeBtns = document.querySelectorAll(".login-type-btn");

    loginTypeBtns.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-type") === "kunde") {
        btn.classList.add("active");
      }
    });

    loginModal.style.display = "flex";
    showNotification(
      "Bitte melden Sie sich an, um einen Termin zu buchen.",
      "info"
    );
  }
}

// Entfernung zwischen zwei Koordinaten berechnen (Haversine-Formel)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Erdradius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Entfernung in km
  return distance;
}

// ============ Kontaktformular Setup ============
function setupContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;
    const dataProtection = document.getElementById("dataProtection").checked;

    // Validierung
    if (!name || !email || !subject || !message) {
      showNotification("Bitte füllen Sie alle Pflichtfelder aus.", "error");
      return;
    }

    if (!dataProtection) {
      showNotification(
        "Bitte akzeptieren Sie die Datenschutzerklärung.",
        "error"
      );
      return;
    }

    // Formular-Daten sammeln
    const formData = {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    };

    // In einer echten App würde die Nachricht an den Server gesendet werden
    // Für den Prototyp simulieren wir einen erfolgreichen Versand
    console.log("Kontaktformular-Daten:", formData);

    showNotification(
      "Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns in Kürze bei Ihnen melden.",
      "success"
    );
    contactForm.reset();
  });
}

// ============ Scroll-Animation Setup ============
function setupScrollAnimations() {
  // Elemente, die animiert werden sollen
  const animatedElements = document.querySelectorAll(".fade-in, .slide-in-up");

  // IntersectionObserver für Scroll-Animationen
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          // Element nur einmal animieren
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // 10% des Elements muss sichtbar sein
      rootMargin: "0px 0px -50px 0px", // Löst etwas früher aus
    }
  );

  // Beobachtung starten
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// ============ Hilfsfunktionen ============

// Benachrichtigung anzeigen
function showNotification(message, type = "info") {
  // Bestehende Benachrichtigungen entfernen
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notif) => {
    notif.remove();
  });

  // Neue Benachrichtigung erstellen
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  // Icon basierend auf Typ hinzufügen
  let icon;
  switch (type) {
    case "success":
      icon = '<i class="fas fa-check-circle"></i>';
      break;
    case "error":
      icon = '<i class="fas fa-exclamation-circle"></i>';
      break;
    case "info":
    default:
      icon = '<i class="fas fa-info-circle"></i>';
      break;
  }

  notification.innerHTML = `
    ${icon} <span>${message}</span>
    <button class="notification-close">&times;</button>
  `;

  document.body.appendChild(notification);

  // Schließen-Button-Handler
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      notification.remove();
    }, 500);
  });

  // Nach 5 Sekunden automatisch entfernen
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 5000);
}

// Datum formatieren
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("de-DE", options);
}

// Check Mobile Device
function isMobileDevice() {
  return (
    window.innerWidth <= 768 ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

// Smooth Scroll Polyfill für ältere Browser
if (!("scrollBehavior" in document.documentElement.style)) {
  const smoothScrollTo = function (to, duration) {
    const element = document.scrollingElement || document.documentElement,
      start = element.scrollTop,
      change = to - start,
      startDate = +new Date();

    // t = current time, b = start value, c = change in value, d = duration
    const easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const animateScroll = function () {
      const currentDate = +new Date();
      const currentTime = currentDate - startDate;
      element.scrollTop = parseInt(
        easeInOutQuad(currentTime, start, change, duration)
      );
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollTop = to;
      }
    };
    animateScroll();
  };

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const to = targetElement.offsetTop - 80;
        smoothScrollTo(to, 1000);
      }
    });
  });
}

// Animation bei Seiten-Ladung
document.addEventListener("DOMContentLoaded", function () {
  // Header-Elemente mit Animation
  const header = document.querySelector(".main-header");
  if (header) {
    header.classList.add("fade-in");
    header.style.animationDelay = "0.2s";
  }

  // Hero-Bereich mit Animation
  const heroContent = document.querySelector(".hero-content");
  const heroImage = document.querySelector(".hero-image");

  if (heroContent) {
    heroContent.classList.add("slide-in-up");
    heroContent.style.animationDelay = "0.4s";
  }

  if (heroImage) {
    heroImage.classList.add("fade-in");
    heroImage.style.animationDelay = "0.6s";
  }

  // About-Bereich mit Animation
  const aboutImage = document.querySelector(".about-image");
  const aboutContent = document.querySelector(".about-content");

  if (aboutImage) {
    aboutImage.classList.add("fade-in");
    aboutImage.style.animationDelay = "0.2s";
  }

  if (aboutContent) {
    aboutContent.classList.add("slide-in-up");
    aboutContent.style.animationDelay = "0.4s";
  }
});
