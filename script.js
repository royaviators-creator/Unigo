(async () => {
  await import('./analytics.js');
  await import('./base-script.js');
  await import('./journeys.js');

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
