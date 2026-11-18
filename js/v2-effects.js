(function () {
  if (!document.body.classList.contains('hero-scroll-v2')) return;
  document.querySelectorAll('.hero-scroll-v2 .card').forEach(function (card) {
    function updateCard(event) {
      var rect = card.getBoundingClientRect();
      var x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      var y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      var rotateX = (0.5 - y) * 8;
      var rotateY = (x - 0.5) * 10;

      card.style.setProperty('--card-mx', (x * 100).toFixed(2) + '%');
      card.style.setProperty('--card-my', (y * 100).toFixed(2) + '%');
      card.style.transform = 'perspective(760px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-9px) scale(1.012)';
    }

    function resetCard() {
      card.style.removeProperty('transform');
      card.style.setProperty('--card-mx', '50%');
      card.style.setProperty('--card-my', '50%');
    }

    card.dataset.cardEffect = 'ready';
    card.addEventListener('pointermove', updateCard);
    card.addEventListener('pointerleave', resetCard);
    card.addEventListener('blur', resetCard, true);
  });
})();
