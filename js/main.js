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
