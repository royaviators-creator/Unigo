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

    const openLink = () => { window.location.href = target.href; };
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
  if (passportPreview) {
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
  }

  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'impact-passport.html') {
    const rewardHeading = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Impact Credits follow verified effort'));
    const rewardSection = rewardHeading?.closest('section');
    if (rewardSection) {
      rewardSection.innerHTML = `
        <p class="eyebrow">Two separate systems</p>
        <h2>Build impact. Earn rewards.</h2>
        <div class="tier-grid">
          <article class="tier-card">
            <h3>Impact Score</h3>
            <p><strong>Non-spendable</strong></p>
            <p>Your long-term record across CRS, GES, LGBTQIS, LES and CIS. It grows through verified actions and is never reduced when rewards are redeemed.</p>
          </article>
          <article class="tier-card">
            <h3>Impact Credits (IC)</h3>
            <p><strong>Spendable rewards</strong></p>
            <p>Credits are earned from verified actions and can be redeemed for offers created and funded by participating businesses.</p>
          </article>
          <article class="tier-card">
            <h3>Badges & Levels</h3>
            <p><strong>Recognition</strong></p>
            <p>Badges and levels reflect milestones in the Passport. They are not spent and remain part of the traveler's impact identity.</p>
          </article>
        </div>
        <div class="demo-note">
          <strong>Example</strong>
          <p>A traveler joins a verified cleanup: their Carbon and Community scores increase, they earn Impact Credits, and they may unlock a badge. Redeeming those credits later does not reduce their Impact Score.</p>
        </div>`;
    }

    const safeguards = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Credible enough to trust'))?.closest('section');
    if (safeguards) {
      const offerBlock = document.createElement('section');
      offerBlock.className = 'section compact';
      offerBlock.innerHTML = `
        <p class="eyebrow">Reward marketplace</p>
        <h2>Businesses fund offers, not the credits themselves.</h2>
        <div class="rules">
          <article><h3>Business-created offers</h3><p>Partners choose the reward, required IC, quantity, validity period and redemption conditions.</p></article>
          <article><h3>No fixed euro exchange</h3><p>Impact Credits are not cash and do not have a guaranteed euro value. Each offer has its own value and credit requirement.</p></article>
          <article><h3>UNIGO evaluation</h3><p>UNIGO reviews fairness, clarity, availability, customer value and whether the offer supports responsible participation.</p></article>
          <article><h3>Data improves pricing</h3><p>Redemption rate, repeat visits, unused capacity and customer feedback help UNIGO recommend better IC ranges over time.</p></article>
        </div>`;
      safeguards.parentNode.insertBefore(offerBlock, safeguards);
    }
  }

  if (page === 'impact-scoring.html') {
    const travelerHeading = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Impact Credits remain separate'));
    const travelerSection = travelerHeading?.closest('section');
    if (travelerSection) {
      travelerSection.innerHTML = `
        <p class="eyebrow">Three distinct systems</p>
        <h2>Scoring, rewards and offers stay separate.</h2>
        <div class="framework-grid">
          <article class="framework-card"><h3>Traveler Impact Score</h3><p>Non-spendable progress across CRS, GES, LGBTQIS, LES and CIS.</p><small>Represents verified contribution and remains in the Impact Passport.</small></article>
          <article class="framework-card"><h3>Impact Credits (IC)</h3><p>Spendable reward currency earned from verified actions.</p><small>Redeemed for business offers without reducing the traveler's Impact Score.</small></article>
          <article class="framework-card"><h3>Business Impact Score (BIS)</h3><p>Evidence-based assessment of business practices.</p><small>Separate from customer rewards and offer pricing.</small></article>
        </div>
        <div class="evidence-box"><strong>Offer evaluation</strong><p>Businesses set the reward, IC requirement, quantity and expiry. UNIGO checks customer value, clarity, fairness, responsible fit and redemption performance. Impact Credits are not cash and have no fixed euro exchange rate.</p></div>
        <div class="hero-actions"><a class="btn primary" href="impact-passport.html">Explore the Passport</a><a class="btn secondary" href="apply.html">Create a Partner Offer</a></div>`;
    }
  }

  if (page === 'businesses.html') {
    const main = document.querySelector('main');
    if (main && !document.querySelector('#partner-offers')) {
      const offers = document.createElement('section');
      offers.className = 'section compact';
      offers.id = 'partner-offers';
      offers.innerHTML = `
        <p class="eyebrow">Partner offers</p>
        <h2>Turn responsible actions into customer rewards.</h2>
        <p class="hero-text">Participating businesses can create limited offers that travelers redeem with Impact Credits.</p>
        <div class="method-grid">
          <span><strong>1. Choose the offer</strong><br>Discount, upgrade, free item, event access or community experience.</span>
          <span><strong>2. Set the terms</strong><br>Required IC, quantity, expiry and any booking conditions.</span>
          <span><strong>3. UNIGO reviews it</strong><br>Fairness, clarity, value, availability and alignment with responsible travel.</span>
          <span><strong>4. Measure performance</strong><br>Redemptions, repeat visits, customer feedback and unused capacity.</span>
        </div>
        <div class="pilot-note"><strong>Who pays?</strong><p>The business provides the redeemed reward as part of its customer acquisition or loyalty budget. UNIGO issues and records Impact Credits; credits are not cash and are not purchased by travelers.</p></div>
        <a class="btn primary" href="apply.html">Apply as a Partner</a>`;
      main.appendChild(offers);
    }
  }
})();
