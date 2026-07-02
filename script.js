(() => {
  const nav = document.querySelector('.nav');
  const isHome = /\/(?:index\.html)?$/.test(location.pathname) || location.pathname === '/';
  const earlyAccessHref = isHome ? '#join' : 'index.html#join';
  if (nav) {
    nav.innerHTML = `<a href="about.html">About</a><a href="impact-movement.html">Impact Movement</a><a href="businesses.html">Businesses</a><a href="impact-passport.html">Passport</a><a href="impact-scoring.html">Scoring</a><a href="apply.html">Apply</a><a href="faq.html">FAQ</a><a class="nav-cta" href="${earlyAccessHref}">Get Early Access</a>`;
  }
})();

(async () => {
  await import('./analytics.js');
  await import('./base-script.js');
  await import('./journeys.js');

  const proofLinks = [
    { href: 'impact-scoring.html', label: 'Explore the five UNIGO impact dimensions' },
    { href: 'businesses.html', label: 'Explore UNIGO launch cities' },
    { href: 'businesses.html', label: 'Explore UNIGO initial partners' }
  ];
  const dimensions = {
    CRS: { icon: '🌿', label: 'Carbon Reduction' },
    GES: { icon: '⚖️', label: 'Gender Equality' },
    LGBTQIS: { icon: '🌈', label: 'LGBTQ+ Inclusion' },
    LES: { icon: '💚', label: 'Local Economy' },
    CIS: { icon: '🤝', label: 'Community Impact' }
  };
  const orderedDimensions = Object.keys(dimensions);
  const applyDimension = (el, code) => {
    const dimension = dimensions[code];
    if (!el || !dimension) return;
    el.classList.add('impact-dimension');
    el.dataset.dim = code;
    el.dataset.icon = dimension.icon;
    el.setAttribute('aria-label', `${code}: ${dimension.label}`);
  };
  const strongestDimension = card => {
    const values = [...card.querySelectorAll('.breakdown span')].map(item => {
      const code = orderedDimensions.find(dim => item.textContent.includes(dim));
      const value = Number(item.querySelector('strong')?.textContent || 0);
      return { code, value };
    }).filter(item => item.code);
    return values.sort((a, b) => b.value - a.value)[0]?.code || 'CIS';
  };

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
  document.querySelectorAll('.score-grid article').forEach(article => {
    const code = article.querySelector('span')?.textContent.trim();
    applyDimension(article, code);
  });
  document.querySelectorAll('.movement-pillars li').forEach(item => {
    const label = item.querySelector('strong')?.textContent.trim() || '';
    const code = label.includes('Carbon') ? 'CRS' : label.includes('Gender') ? 'GES' : label.includes('Inclusion') ? 'LGBTQIS' : label.includes('Local') ? 'LES' : 'CIS';
    applyDimension(item, code);
  });
  document.querySelectorAll('.dimension-grid .dimension').forEach(card => {
    const code = card.querySelector('small')?.textContent.trim();
    applyDimension(card, code);
    const description = card.querySelector('p');
    if (description && dimensions[code]) description.textContent = dimensions[code].label;
  });
  document.querySelectorAll('.metric-grid > div').forEach(card => {
    if (card.closest('.passport-preview')) return;
    const code = card.querySelector('small')?.textContent.trim();
    applyDimension(card, code);
  });
  document.querySelectorAll('.breakdown span').forEach(item => {
    const code = orderedDimensions.find(dim => item.textContent.includes(dim));
    applyDimension(item, code);
  });
  document.querySelectorAll('.marquee div').forEach(item => {
    item.dataset.repeat = item.textContent;
  });

  const passportPreview = document.querySelector('.passport-preview');
  if (passportPreview) {
    const scores = [15, 10, 15, 10, 10];
    const badgeLabels = [
      '🌿 Circular Explorer',
      '⚖️ Equality Supporter',
      '🌈 Pride Ally',
      '💚 Local Champion',
      '🤝 Community Builder'
    ];
    const total = scores.reduce((sum, score) => sum + score, 0);

    const chip = passportPreview.querySelector('.credit-chip');
    const ringValue = passportPreview.querySelector('.impact-ring strong');
    const ringLabel = passportPreview.querySelector('.impact-ring span');

    if (chip) chip.textContent = 'Impact Passport';
    if (ringValue) ringValue.textContent = total;
    if (ringLabel) ringLabel.textContent = 'Impact Score';

    passportPreview.querySelectorAll('.metric-grid > div').forEach((card, index) => {
      const code = orderedDimensions[index];
      const dimension = dimensions[code];
      if (!dimension) return;
      card.innerHTML = `<small>${code}</small><strong>${scores[index] ?? 0}</strong><span>${dimension.label}</span>`;
      applyDimension(card, code);
    });

    const badges = passportPreview.querySelector('.badges');
    if (badges) {
      badges.innerHTML = badgeLabels.map(label => `<span>${label}</span>`).join('');
    }

    const heroText = passportPreview.querySelector('.phone-hero p');
    if (heroText) heroText.textContent = 'Verified actions build your score, badges and traveler level.';
  }
  document.querySelectorAll('.experience-card .pill').forEach(pill => {
    const text = pill.textContent;
    const code = text.includes('Circular') ? 'CRS' : text.includes('Inclusive') ? 'LGBTQIS' : text.includes('Social') ? 'GES' : 'CIS';
    pill.classList.add('dimension-chip');
    pill.dataset.dim = code;
    pill.dataset.icon = dimensions[code].icon;
  });

  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'impact-passport.html') {
    const intro = document.querySelector('.page-hero .hero-text');
    if (intro) intro.textContent = 'A personal record of verified travel actions, five Impact Dimensions, badges and traveler levels.';

    const demoScore = document.querySelector('.passport-score');
    if (demoScore) demoScore.textContent = '60 Impact Score';

    const demoScoreNote = demoScore?.nextElementSibling;
    if (demoScoreNote) demoScoreNote.textContent = 'Illustrative traveler progress';
    const passportHead = document.querySelector('.passport-head');
    if (passportHead && !passportHead.querySelector('.traveler-identity')) {
      passportHead.insertAdjacentHTML('afterbegin', '<div class="traveler-identity"><span class="avatar-placeholder">IE</span><div><small>Traveler identity</small><strong>Impact Explorer</strong><em>Netherlands launch cohort</em></div></div>');
    }
    const passportDemo = document.querySelector('.passport-demo');
    const badgeRow = passportDemo?.querySelector('.badge-row');
    if (passportDemo && badgeRow && !document.querySelector('.passport-badge-section')) {
      const badgeSection = document.createElement('section');
      badgeSection.className = 'section compact passport-badge-section';
      badgeSection.innerHTML = '<p class="eyebrow">Recognition</p><h2>Passport badges earned through verified action.</h2>';
      badgeSection.appendChild(badgeRow);
      passportDemo.closest('section').insertAdjacentElement('afterend', badgeSection);
    }

    document.querySelectorAll('.action-card strong').forEach((item, index) => {
      const labels = ['CRS +15', 'LGBTQIS +15', 'GES +10 · LES +10', 'CIS +10'];
      item.textContent = labels[index] || 'Verified contribution';
    });

    const historyHeading = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('How the 60 Impact Credits are earned'));
    if (historyHeading) historyHeading.textContent = 'How the illustrative Impact Score is built.';

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

  if (page === 'apply.html') {
    const applicationSection = document.querySelector('.form-section');
    if (applicationSection && !document.querySelector('#partner-offers')) {
      const offers = document.createElement('section');
      offers.className = 'section compact partner-offer-section';
      offers.id = 'partner-offers';
      offers.innerHTML = `
        <div class="section-heading">
          <p class="eyebrow">Partner offers</p>
          <h2>Clear benefits, owned by each partner.</h2>
          <p>Participating businesses choose the benefit, eligibility rule, limits and availability. UNIGO connects the offer to visible Impact Passport criteria.</p>
        </div>
        <div class="method-grid">
          <span><strong>Offer</strong><br>Discount, upgrade, welcome item, event access or special experience.</span>
          <span><strong>Eligibility</strong><br>A badge, traveler level or relevant verified action.</span>
          <span><strong>Limits</strong><br>Quantity, expiry, booking conditions and availability.</span>
          <span><strong>Confirmation</strong><br>The traveler presents their Passport status and the business provides the offer directly.</span>
        </div>
        <div class="pilot-note"><strong>UNIGO's role</strong><p>UNIGO displays the offer, verifies the Passport condition and tracks basic performance. It does not fund rewards, issue credits or manage a wallet.</p></div>`;
      applicationSection.insertAdjacentElement('beforebegin', offers);
    }
  }
  if (page === 'businesses.html') {
    document.querySelectorAll('.evidence-link').forEach(link => {
      link.textContent = 'Visit Website';
    });
    let currentCity = '';
    document.querySelectorAll('.city-title,.impact-business').forEach(node => {
      if (node.classList.contains('city-title')) currentCity = node.textContent.trim();
      if (node.classList.contains('impact-business') && !node.querySelector('.business-meta')) {
        const code = strongestDimension(node);
        const title = node.querySelector('h3');
        title?.insertAdjacentHTML('afterend', `<div class="business-meta"><span class="location-chip">${currentCity}</span><span class="dimension-chip" data-dim="${code}" data-icon="${dimensions[code].icon}">${dimensions[code].label}</span></div>`);
      }
    });
  }
})();
