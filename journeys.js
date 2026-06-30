const audience = document.querySelector('.home-page .audience-grid')?.closest('section');

if (audience && !document.querySelector('.journey-section')) {
  const section = document.createElement('section');
  section.className = 'section journey-section';
  section.innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">How UNIGO works</p>
      <h2>Two clear ways to begin.</h2>
      <p>Join the launch community today while the full Impact Passport experience continues to develop.</p>
    </div>
    <div class="journey-grid">
      <article>
        <span class="journey-label">For travelers</span>
        <h3>Discover and participate</h3>
        <p>Explore responsible businesses and meaningful local experiences, join the founding community and help shape the future Impact Passport.</p>
        <a class="text-link" href="#join">Join as a traveler →</a>
      </article>
      <article>
        <span class="journey-label">For businesses and communities</span>
        <h3>Build a credible profile</h3>
        <p>Apply or claim a profile, share your impact practices and prepare for evidence review and future traveler visibility.</p>
        <a class="text-link" href="apply.html">Apply or claim a profile →</a>
      </article>
    </div>`;
  audience.insertAdjacentElement('afterend', section);
}

const applyForm = document.querySelector('body:not(.home-page) [data-beta-form]');
if (applyForm && !document.querySelector('.partner-next-step-card')) {
  const card = document.createElement('aside');
  card.className = 'partner-next-step-card';
  card.innerHTML = `
    <span class="journey-label">What happens next</span>
    <strong>UNIGO reviews your application.</strong>
    <p>We will contact you about profile information, public evidence and the next suitable participation step.</p>`;
  applyForm.insertAdjacentElement('beforebegin', card);
}

const style = document.createElement('style');
style.textContent = `
  .journey-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
  .journey-grid article,.partner-next-step-card{padding:26px;border:1px solid rgba(255,255,255,.12);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.025));box-shadow:0 26px 80px rgba(0,0,0,.32)}
  .journey-grid p{line-height:1.8}
  .journey-label{display:inline-flex;padding:7px 10px;border-radius:999px;border:1px solid rgba(215,189,117,.28);background:rgba(215,189,117,.1);color:#ead79f;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px}
  .partner-next-step-card{margin-bottom:18px}
  .partner-next-step-card strong{display:block;color:#fff;font-size:20px;margin-bottom:6px}
  .partner-next-step-card p{margin:0}
  @media(max-width:700px){.journey-grid{grid-template-columns:1fr}.journey-grid article,.partner-next-step-card{padding:21px}}
`;
document.head.appendChild(style);
