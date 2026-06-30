(async()=>{
  await import('./analytics.js');
  await import('./base-script.js');
  await import('./journeys.js');

  const proofLinks=[
    {href:'impact-scoring.html',label:'Explore the five UNIGO impact dimensions'},
    {href:'businesses.html',label:'Explore UNIGO launch cities'},
    {href:'businesses.html',label:'Explore reviewed organizations'}
  ];

  document.querySelectorAll('.proof-strip > span').forEach((item,index)=>{
    const target=proofLinks[index];
    if(!target)return;
    item.setAttribute('role','link');
    item.setAttribute('tabindex','0');
    item.setAttribute('aria-label',target.label);
    item.style.cursor='pointer';
    const open=()=>{window.location.href=target.href;};
    item.addEventListener('click',open);
    item.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open();}});
  });

  const passportPreview=document.querySelector('.passport-preview');
  if(passportPreview){
    const scores=[15,10,15,10,10];
    const total=scores.reduce((sum,score)=>sum+score,0);
    const chip=passportPreview.querySelector('.credit-chip');
    const ringValue=passportPreview.querySelector('.impact-ring strong');
    const ringLabel=passportPreview.querySelector('.impact-ring span');
    if(chip)chip.textContent='Impact Passport';
    if(ringValue)ringValue.textContent=total;
    if(ringLabel)ringLabel.textContent='Illustrative Score';
    passportPreview.querySelectorAll('.metric-grid > div strong').forEach((item,index)=>{item.textContent=scores[index]??0;});
    const heroText=passportPreview.querySelector('.phone-hero p');
    if(heroText)heroText.textContent='An illustrative view of how verified actions could shape a traveler profile.';
  }

  const page=window.location.pathname.split('/').pop()||'index.html';

  if(page==='businesses.html'){
    document.title='UNIGO Impact Directory';
    const description=document.querySelector('meta[name="description"]');
    if(description)description.setAttribute('content','Explore organizations reviewed by UNIGO using publicly available evidence across Utrecht, Amsterdam and Rotterdam.');

    const navCta=document.querySelector('.nav-cta');
    if(navCta)navCta.textContent='Join UNIGO';

    const eyebrow=document.querySelector('.page-hero .eyebrow');
    if(eyebrow)eyebrow.textContent='Impact directory';

    const heading=document.querySelector('.page-hero h1');
    if(heading)heading.textContent='Organizations Reviewed';

    const intro=document.querySelector('.page-hero .hero-text');
    if(intro)intro.textContent='A public-evidence review of businesses, venues, and facilitators in Utrecht, Amsterdam, and Rotterdam.';

    document.querySelectorAll('.tier').forEach(tier=>{
      if(tier.textContent.trim()==='Impact Partner')tier.textContent='Strong Public Evidence';
      if(tier.textContent.trim()==='Committed')tier.textContent='Public Evidence Found';
    });

    const note=document.querySelector('.pilot-note');
    if(note){
      note.innerHTML='<strong>How to read these reviews</strong><p>Scores are provisional and based only on information publicly available on each organization’s own website. These listings are not claimed profiles, verified UNIGO partners, endorsements, or audited impact assessments.</p><div class="method-grid"><span><strong>CRS</strong><br>Carbon Reduction</span><span><strong>GES</strong><br>Gender Equality</span><span><strong>LGBTQIS</strong><br>LGBTQ+ Inclusion</span><span><strong>LES</strong><br>Local Economy</span><span><strong>CIS</strong><br>Community Impact</span></div>';
    }

    const main=document.querySelector('main');
    if(main&&!document.querySelector('#directory-disclaimer')){
      const disclaimer=document.createElement('section');
      disclaimer.className='section compact';
      disclaimer.id='directory-disclaimer';
      disclaimer.innerHTML='<div class="pilot-note"><strong>Important distinction</strong><p>Being listed in this directory does not mean an organization has joined UNIGO. Confirmed partners will be identified separately only after direct agreement and review.</p><a class="btn primary" href="apply.html">Claim or Apply for a Profile</a></div>';
      main.appendChild(disclaimer);
    }
  }
})();
