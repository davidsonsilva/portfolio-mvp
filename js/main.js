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
