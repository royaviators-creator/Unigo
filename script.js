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

    const chip = passportPreview.querySelector('.credit-chip');
    const ringValue = passportPreview.querySelector('.impact-ring strong');
    const ringLabel = passportPreview.querySelector('.impact-ring span');

    if (chip) chip.textContent = 'Impact Passport';
    if (ringValue) ringValue.textContent = total;
    if (ringLabel) ringLabel.textContent = 'Impact Score';

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

    const heroText = passportPreview.querySelector('.phone-hero p');
    if (heroText) heroText.textContent = 'Verified actions build your score, badges and traveler level.';
  }

  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'impact-passport.html') {
    const intro = document.querySelector('.page-hero .hero-text');
    if (intro) intro.textContent = 'A personal record of verified travel actions, five impact dimensions, badges and traveler levels.';

    const demoScore = document.querySelector('.passport-score');
    if (demoScore) demoScore.textContent = '60 Impact Score';

    const demoScoreNote = demoScore?.nextElementSibling;
    if (demoScoreNote) demoScoreNote.textContent = 'Illustrative traveler progress';

    document.querySelectorAll('.action-card strong').forEach((item, index) => {
      const labels = ['CRS +15', 'LGBTQIS +15', 'GES +10 · LES +10', 'CIS +10'];
      item.textContent = labels[index] || 'Verified contribution';
    });

    const historyHeading = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('How the 60 Impact Credits are earned'));
    if (historyHeading) historyHeading.textContent = 'How the demo Impact Score is built.';

    const rewardHeading = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Impact Credits follow verified effort'));
    const rewardSection = rewardHeading?.closest('section');
    if (rewardSection) {
      rewardSection.innerHTML = `
        <p class="eyebrow">One simple traveler system</p>
        <h2>Your Passport unlocks business offers.</h2>
        <div class="tier-grid">
          <article class="tier-card">
            <h3>Impact Score</h3>
            <p><strong>Progress</strong></p>
            <p>Your score grows across CRS, GES, LGBTQIS, LES and CIS through verified actions.</p>
          </article>
          <article class="tier-card">
            <h3>Badges</h3>
            <p><strong>Recognition</strong></p>
            <p>Badges show meaningful milestones such as Circular Explorer, Pride Ally or Community Builder.</p>
          </article>
          <article class="tier-card">
            <h3>Traveler Level</h3>
            <p><strong>Access</strong></p>
            <p>Your overall level can qualify you for offers created directly by participating businesses.</p>
          </article>
        </div>
        <div class="demo-note">
          <strong>Example</strong>
          <p>A café may offer a free drink to travelers with the Community Builder badge. A tour provider may offer early access to Impact Advocates. UNIGO only verifies eligibility and displays the offer.</p>
        </div>`;
    }

    const safeguards = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Credible enough to trust'))?.closest('section');
    if (safeguards) {
      const offerBlock = document.createElement('section');
      offerBlock.className = 'section compact';
      offerBlock.innerHTML = `
        <p class="eyebrow">Business offers</p>
        <h2>No points, wallets or redemption currency.</h2>
        <div class="rules">
          <article><h3>Business-controlled</h3><p>Each business chooses the offer, eligibility rule, quantity, expiry and conditions.</p></article>
          <article><h3>Passport-based access</h3><p>Eligibility can be based on a badge, traveler level or relevant verified action.</p></article>
          <article><h3>Simple confirmation</h3><p>The traveler shows or shares their Passport status. The business confirms and provides the offer directly.</p></article>
          <article><h3>UNIGO stays neutral</h3><p>UNIGO does not issue money, fund discounts or manage a reward balance.</p></article>
        </div>`;
      safeguards.parentNode.insertBefore(offerBlock, safeguards);
    }
  }

  if (page === 'impact-scoring.html') {
    const travelerHeading = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Impact Credits remain separate'));
    const travelerSection = travelerHeading?.closest('section');
    if (travelerSection) {
      travelerSection.innerHTML = `
        <p class="eyebrow">Two clear scoring systems</p>
        <h2>Traveler progress and business assessment stay separate.</h2>
        <div class="framework-grid">
          <article class="framework-card"><h3>Traveler Impact Score</h3><p>Progress across CRS, GES, LGBTQIS, LES and CIS.</p><small>Builds the traveler's Passport, level and badges.</small></article>
          <article class="framework-card"><h3>Business Impact Score (BIS)</h3><p>Evidence-based assessment of business practices.</p><small>Measures the business, not its offers.</small></article>
          <article class="framework-card"><h3>Business Offers</h3><p>Optional benefits created directly by businesses.</p><small>Unlocked by Passport badges, levels or verified actions—without credits or currency.</small></article>
        </div>
        <div class="evidence-box"><strong>Offer evaluation</strong><p>Businesses control the offer. UNIGO checks clarity, fairness, availability, suitability and whether the eligibility rule can be verified through the Impact Passport.</p></div>
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
        <h2>Businesses reward the travelers they want to welcome.</h2>
        <p class="hero-text">Offers are created and provided directly by each business. UNIGO simply connects the offer to clear Impact Passport criteria.</p>
        <div class="method-grid">
          <span><strong>1. Choose the offer</strong><br>Discount, upgrade, free item, event access or special experience.</span>
          <span><strong>2. Choose eligibility</strong><br>A badge, traveler level or relevant verified action.</span>
          <span><strong>3. Set the limits</strong><br>Quantity, expiry, booking conditions and availability.</span>
          <span><strong>4. Confirm directly</strong><br>The traveler presents their Passport status and the business provides the offer.</span>
        </div>
        <div class="pilot-note"><strong>UNIGO's role</strong><p>UNIGO displays the offer, verifies the Passport condition and tracks basic performance. It does not fund rewards, issue credits or manage a wallet.</p></div>
        <a class="btn primary" href="apply.html">Apply as a Partner</a>`;
      main.appendChild(offers);
    }
  }
})();
