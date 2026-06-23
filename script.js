// An curent
  document.getElementById('year').textContent = new Date().getFullYear();

  // Meniu-icoană (dropdown dreapta sus)
  const menuIcon = document.getElementById('menuIcon');
  const iconMenu = document.getElementById('iconMenu');
  function toggleMenu(){
    iconMenu.classList.toggle('open');
    menuIcon.classList.toggle('active');
  }
  iconMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    iconMenu.classList.remove('open');
    menuIcon.classList.remove('active');
  }));
  document.addEventListener('click', (e) => {
    if(!iconMenu.contains(e.target) && !menuIcon.contains(e.target)){
      iconMenu.classList.remove('open');
      menuIcon.classList.remove('active');
    }
  });

  // ---- COMUTATOR LIMBĂ RO / EN ----
  let lang = 'ro';
  function applyLang(){
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-ro]').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if(val !== null) el.innerHTML = val;
    });
    // placeholder-e formular
    document.querySelectorAll('[data-ro-ph]').forEach(el => {
      el.setAttribute('placeholder', el.getAttribute('data-' + lang + '-ph'));
    });
    document.getElementById('langLabel').textContent = (lang === 'ro') ? 'EN' : 'RO';
    // reataseaza anul (a fost rescris prin innerHTML in footer)
    const y = document.getElementById('year');
    if(y) y.textContent = new Date().getFullYear();
  }
  function toggleLang(){
    lang = (lang === 'ro') ? 'en' : 'ro';
    applyLang();
  }

  // FAQ acordeon
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('open');
        const a = item.querySelector('.faq-a');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // Formular static: deschide aplicația de email a vizitatorului
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const okMsg = document.getElementById('formMsg');
      const errMsg = document.getElementById('formErr');
      okMsg.style.display = 'none';
      errMsg.style.display = 'none';

      if(!document.getElementById('consentChk').checked){
        alert(lang === 'ro'
          ? 'Te rog să bifezi acordul privind prelucrarea datelor pentru a putea trimite mesajul.'
          : 'Please tick the data-processing consent to send the message.'
        );
        return;
      }

      const data = new FormData(contactForm);
      const subject = encodeURIComponent('Mesaj de pe site - Daniela Vasilescu');
      const body = [
        'Nume: ' + (data.get('nume') || ''),
        'Email: ' + (data.get('email') || ''),
        'Telefon: ' + (data.get('telefon') || ''),
        '',
        'Mesaj:',
        data.get('mesaj') || ''
      ].join('\n');

      window.location.href = 'mailto:contact@danielavasilescu.ro?subject=' + subject + '&body=' + encodeURIComponent(body);
      okMsg.style.display = 'block';
      contactForm.reset();
      setTimeout(() => { okMsg.style.display = 'none'; }, 7000);
    });
  }
  // Newsletter static: pregătește un email de abonare
  const newsForm = document.getElementById('newsForm');
  if(newsForm){
    newsForm.addEventListener('submit', function(e){
      e.preventDefault();
      const okMsg = document.getElementById('newsMsg');
      const email = new FormData(newsForm).get('email') || '';
      const subject = encodeURIComponent('Abonare meditații gratuite');
      const body = encodeURIComponent('Bună, Daniela! Doresc să primesc meditații gratuite pe adresa: ' + email);
      window.location.href = 'mailto:contact@danielavasilescu.ro?subject=' + subject + '&body=' + body;
      okMsg.style.display = 'block';
      newsForm.reset();
      setTimeout(() => { okMsg.style.display = 'none'; }, 6000);
    });
  }
  // ---- COOKIE CONSENT ----
  let cookieChoice = null;
  const cookieBanner = document.getElementById('cookieBanner');
  const ckSettings = document.getElementById('ckSettings');

  try {
    cookieChoice = localStorage.getItem('dv_cookie_choice');
  } catch (err) {
    cookieChoice = null;
  }

  function showCookieBanner(){
    if(cookieChoice){
      ckSettings.classList.add('show');
      return;
    }
    setTimeout(()=>cookieBanner.classList.add('show'), 900);
  }
  function setCookieConsent(choice){
    cookieChoice = choice; // 'accept' | 'essential' | 'reject'
    try {
      localStorage.setItem('dv_cookie_choice', choice);
    } catch (err) {}
    cookieBanner.classList.remove('show');
    ckSettings.classList.add('show');
    // Aici se pot activa/dezactiva scripturile de statistică în funcție de alegere:
    // if(choice === 'accept'){ /* încarcă analytics */ }
  }
  function reopenCookies(){
    ckSettings.classList.remove('show');
    cookieBanner.classList.add('show');
  }
  showCookieBanner();

  // ---- MODALE LEGALE ----
  function openModal(id){
    document.getElementById(id).classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id){
    document.getElementById(id).classList.remove('show');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){
      document.querySelectorAll('.modal-ov.show').forEach(m=>m.classList.remove('show'));
      document.body.style.overflow='';
    }
  });

  // Animatii reveal la scroll (cu efect de cascada pe grupuri)
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(en.isIntersecting){
        const el = en.target;
        const delay = el.dataset.delay ? parseFloat(el.dataset.delay) : 0;
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('in');
        obs.unobserve(el);
      }
    });
  }, {threshold:.14, rootMargin:'0px 0px -40px 0px'});

  // aplica decalaj progresiv (stagger) pe elementele din acelasi grup
  function staggerGroup(selector){
    document.querySelectorAll(selector).forEach(group => {
      group.querySelectorAll('.reveal').forEach((el, i) => {
        el.dataset.delay = (i * 90);
      });
    });
  }
  staggerGroup('.cards');
  staggerGroup('.proces-grid');
  staggerGroup('.studii-list');
  staggerGroup('.testi-grid');
  staggerGroup('.galerie');
  staggerGroup('.timeline');

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
