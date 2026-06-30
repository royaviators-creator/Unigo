(async () => {
  await import('./analytics.js');
  await import('./base-script.js');
  await import('./journeys.js');

  const proofLinks = [
    { href: 'impact-scoring.html', label: 'Explore the five UNIGO impact dimensions' },
    { href: 'businesses.html', label: 'Explore UNIGO pilot cities' },
    { href: 'businesses.html', label: 'Explore UNIGO initial partners' }
  ];

  document.querySelectorAll('.proof-strip > span').forEach((item, index) => {
    const target = proofLinks[index];
    if (!target) return;

    item.setAttribute('role', 'link');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', target.label);
    item.style.cursor = 'pointer';
    item.style.transition = 'border-color .2s ease, background .2s ease, transform .2s ease';

    const openLink = () => window.location.href = target.href;
    item.addEventListener('click', openLink);
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLink();
      }
    });
    item.addEventListener('mouseenter', () => {
      item.style.borderColor = 'rgba(215,189,117,.42)';
      item.style.background = 'rgba(255,255,255,.065)';
      item.style.transform = 'translateY(-2px)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.borderColor = '';
      item.style.background = '';
      item.style.transform = '';
    });
  });

  const passportPreview = document.querySelector('.passport-preview');
  if (!passportPreview) return;

  const scores = [15, 10, 15, 10, 10];
  const total = scores.reduce((sum, score) => sum + score, 0);

  const creditChip = passportPreview.querySelector('.credit-chip');
  const ringValue = passportPreview.querySelector('.impact-ring strong');
  const ringLabel = passportPreview.querySelector('.impact-ring span');

  if (creditChip) creditChip.textContent = `${total} IC`;
  if (ringValue) ringValue.textContent = total;
  if (ringLabel) ringLabel.textContent = 'Impact Credits';

  passportPreview.querySelectorAll('.metric-grid > div strong').forEach((item, index) => {
    item.textContent = scores[index] ?? 0;
  });

  const badges = passportPreview.querySelector('.badges');
  if (badges) {
    badges.innerHTML = [
      '🌿 Circular Explorer',
      '⚖️ Equality Supporter',
      '🌈 Pride Ally',
      '💚 Local Champion',
      '🤝 Community Builder'
    ].map(label => `<span>${label}</span>`).join('');
  }
})();
