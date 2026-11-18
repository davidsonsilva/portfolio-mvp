(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 8) {
      nav.style.boxShadow = '0 1px 0 rgba(0,0,0,0.04)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });
})();

(function () {
  function setupGlow(card) {
    var luz = card.querySelector('.luz');
    if (!luz) return;
    card.addEventListener('mousemove', function (event) {
      var rect = card.getBoundingClientRect();
      var x = event.clientX - rect.left - luz.offsetWidth / 2;
      var y = event.clientY - rect.top - luz.offsetHeight / 2;
      luz.style.opacity = '1';
      luz.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    });
    card.addEventListener('mouseleave', function () {
      luz.style.opacity = '0';
    });
  }

  document.querySelectorAll('.ext-card').forEach(setupGlow);
})();

(function () {
  var hero = document.getElementById('hero');
  var video = document.querySelector('.hero-video:not([data-scroll-scrub])');
  if (!hero || !video) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        video.currentTime = 0;
        video.play();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(hero);
})();

(function () {
  var hero = document.getElementById('hero');
  var video = document.querySelector('.hero-video[data-scroll-scrub]');
  var copy = document.getElementById('heroCopy');
  if (!hero || !video) return;

  var targetTime = 0;
  var scheduled = false;

  function updateTarget() {
    scheduled = false;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    var scrollable = Math.max(1, hero.offsetHeight - window.innerHeight);
    var progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / scrollable));
    targetTime = progress * Math.max(0, video.duration - 0.04);
    if (copy) copy.style.opacity = Math.max(0, 1 - progress / 0.55).toFixed(3);
    if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.016) {
      video.currentTime = targetTime;
    }
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateTarget);
  }

  video.pause();
  video.addEventListener('loadedmetadata', updateTarget);
  video.addEventListener('seeked', function () {
    if (Math.abs(video.currentTime - targetTime) > 0.016) scheduleUpdate();
  });
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  scheduleUpdate();
})();

(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var nome = form.nome.value;
    var email = form.email.value;
    var mensagem = form.mensagem.value;
    var body = 'Nome: ' + nome + '\nE-mail: ' + email + '\n\n' + mensagem;
    var mailto = 'mailto:davidson.f.silva@gmail.com'
      + '?subject=' + encodeURIComponent('Contato via portfolio')
      + '&body=' + encodeURIComponent(body);
    window.location.href = mailto;
  });
})();
