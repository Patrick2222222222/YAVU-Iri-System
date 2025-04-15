// JavaScript für verbesserte Responsivität und Bildformatierung

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menü Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
    });
  }
  
  // Schließen des mobilen Menüs beim Klicken auf einen Link
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        mainNav.classList.remove('active');
        if (mobileMenuBtn) {
          mobileMenuBtn.classList.remove('active');
        }
      }
    });
  });
  
  // Lazy Loading für Bilder
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback für Browser ohne IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
  
  // Optimierte Bildgrößen basierend auf Viewport
  function optimizeImages() {
    const images = document.querySelectorAll('img:not([data-src])');
    images.forEach(img => {
      // Stellen Sie sicher, dass Bilder nicht über ihren Container hinausragen
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      
      // Fügen Sie eine Klasse hinzu, um Übergänge zu ermöglichen
      if (!img.classList.contains('optimized')) {
        img.classList.add('optimized');
      }
    });
  }
  
  // Führen Sie die Bildoptimierung beim Laden und bei Größenänderungen durch
  optimizeImages();
  window.addEventListener('resize', optimizeImages);
  
  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      answer.classList.toggle('active');
      
      // Ändern Sie das Icon
      const icon = this.querySelector('.faq-icon');
      if (icon) {
        icon.textContent = answer.classList.contains('active') ? '-' : '+';
      }
    });
  });
  
  // Smooth Scrolling für Anker-Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Berücksichtigen Sie die Header-Höhe
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Modales Fenster für Login/Registrierung
  const loginModal = document.getElementById('loginModal');
  const openLoginModalBtn = document.getElementById('openLoginModal');
  const closeModalBtn = document.querySelector('.close-modal');
  
  if (openLoginModalBtn && loginModal) {
    openLoginModalBtn.addEventListener('click', function() {
      loginModal.style.display = 'block';
    });
  }
  
  if (closeModalBtn && loginModal) {
    closeModalBtn.addEventListener('click', function() {
      loginModal.style.display = 'none';
    });
  }
  
  // Schließen des modalen Fensters beim Klicken außerhalb
  window.addEventListener('click', function(e) {
    if (loginModal && e.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });
  
  // Umschalten zwischen Login und Registrierung
  const loginTypeBtns = document.querySelectorAll('.login-type-btn');
  const registerForm = document.querySelector('.register-form');
  
  loginTypeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      loginTypeBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      if (this.textContent.trim() === 'REGISTRIEREN' && registerForm) {
        registerForm.classList.add('active');
      } else if (registerForm) {
        registerForm.classList.remove('active');
      }
    });
  });
  
  // Responsive Tabellen
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('table-responsive');
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
});
