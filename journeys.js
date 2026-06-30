const page=document.body;
const qs=new URLSearchParams(location.search);
const incomingRef=qs.get('ref')||localStorage.getItem('unigo_ref')||'';
if(incomingRef)localStorage.setItem('unigo_ref',incomingRef);

const referralCode=email=>{
  let hash=0;
  for(const ch of (email||'UNIGO').toUpperCase())hash=(hash*31+ch.charCodeAt(0))>>>0;
  return `UNIGO-${hash.toString(36).toUpperCase().slice(0,6).padEnd(6,'X')}`;
};

document.querySelectorAll('[data-beta-form]').forEach(form=>{
  if(!form.querySelector('[name="referral_code"]')){
    const hidden=document.createElement('input');
    hidden.type='hidden';hidden.name='referral_code';hidden.value=incomingRef;
    form.appendChild(hidden);
  }
  form.addEventListener('submit',()=>{
    const email=form.querySelector('[name="email"]')?.value.trim();
    if(email){localStorage.setItem('unigo_beta_email',email);localStorage.setItem('unigo_own_ref',referralCode(email));}
  },{capture:true});
});

const audience=document.querySelector('.home-page .audience-grid')?.closest('section');
if(audience&&!document.querySelector('.journey-section')){
  const section=document.createElement('section');
  section.className='section journey-section';
  section.innerHTML=`<div class="section-heading"><p class="eyebrow">How UNIGO works</p><h2>Two clear journeys.</h2><p>Choose your path and always know what comes next.</p></div><div class="journey-grid"><article><span class="journey-label">For travelers</span><h3>Your UNIGO journey</h3><p>Join Beta → Discover → Take Action → Earn Credits → Build Passport → Unlock Rewards</p><a class="text-link" href="#join">Start as a traveler →</a></article><article><span class="journey-label">For businesses</span><h3>Become a founding partner</h3><p>Claim Profile → Complete Information → Submit Evidence → UNIGO Review → Receive Scores → Reach Travelers</p><a class="text-link" href="apply.html">Claim or apply →</a></article></div>`;
  audience.insertAdjacentElement('afterend',section);
}

const homeJoin=document.querySelector('.home-page #join');
if(homeJoin&&!document.querySelector('.early-bird-section')){
  const rewards=document.createElement('section');
  rewards.className='section early-bird-section';
  rewards.innerHTML=`<div class="section-heading"><p class="eyebrow">Early beta rewards</p><h2>Join early. Grow with UNIGO.</h2><p>Simple rewards for the people and partners helping build the movement from day one.</p></div><div class="reward-grid"><article><span class="reward-badge">Founding Member</span><h3>250 Impact Credits</h3><p>Join the traveler beta, receive a founding badge and get priority access to future partner rewards.</p></article><article><span class="reward-badge">Referral Reward</span><h3>50 + 50 Credits</h3><p>Invite a friend. When they join with your code, both of you receive 50 Impact Credits.</p></article><article><span class="reward-badge">Founding Partner</span><h3>Priority visibility</h3><p>Early businesses receive a founding badge, priority review and featured beta placement.</p></article></div><p class="reward-note">Impact Credits are beta rewards. Redemption options will expand as verified partners join.</p>`;
  homeJoin.insertAdjacentElement('beforebegin',rewards);
}

const applyForm=document.querySelector('body:not(.home-page) [data-beta-form]');
if(applyForm&&!document.querySelector('.partner-reward-card')){
  const card=document.createElement('aside');
  card.className='partner-reward-card';
  card.innerHTML='<span class="reward-badge">Founding Partner</span><strong>Join during beta</strong><p>Receive priority profile review, a founding badge and featured early visibility.</p>';
  applyForm.insertAdjacentElement('beforebegin',card);
}

if(location.pathname.includes('thank-you')&&!document.querySelector('.referral-share-card')){
  const email=localStorage.getItem('unigo_beta_email');
  const code=localStorage.getItem('unigo_own_ref')||referralCode(email);
  const url=`${location.origin}/?ref=${encodeURIComponent(code)}`;
  const host=document.querySelector('main .section,main')||document.body;
  const share=document.createElement('div');
  share.className='referral-share-card';
  share.innerHTML=`<span class="reward-badge">Your referral code</span><h3>${code}</h3><p>Invite a friend. When they join, both of you receive 50 Impact Credits.</p><button class="btn secondary" type="button">Copy invitation link</button><small>${url}</small>`;
  share.querySelector('button').addEventListener('click',async e=>{await navigator.clipboard.writeText(url);e.currentTarget.textContent='Invitation link copied';});
  host.appendChild(share);
}

const style=document.createElement('style');
style.textContent=`.journey-grid,.reward-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.journey-grid article,.reward-grid article,.partner-reward-card,.referral-share-card{padding:26px;border:1px solid rgba(255,255,255,.12);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.025));box-shadow:0 26px 80px rgba(0,0,0,.32)}.journey-grid p{line-height:1.9}.journey-label,.reward-badge{display:inline-flex;padding:7px 10px;border-radius:999px;border:1px solid rgba(215,189,117,.28);background:rgba(215,189,117,.1);color:#ead79f;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px}.early-bird-section{padding-top:48px}.reward-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.reward-grid h3{color:#f3ead8}.reward-note{margin-top:16px;font-size:12px}.partner-reward-card{margin-bottom:18px}.partner-reward-card strong{display:block;color:#fff;font-size:20px;margin-bottom:6px}.partner-reward-card p{margin:0}.referral-share-card{max-width:620px;margin:28px auto}.referral-share-card small{display:block;margin-top:14px;color:#aaa9a4;overflow-wrap:anywhere}.referral-share-card .btn{margin-top:8px}@media(max-width:900px){.reward-grid{grid-template-columns:1fr 1fr}.reward-grid article:last-child{grid-column:1/-1}}@media(max-width:700px){.journey-grid,.reward-grid{grid-template-columns:1fr}.reward-grid article:last-child{grid-column:auto}.journey-grid article,.reward-grid article,.partner-reward-card,.referral-share-card{padding:21px}}`;
document.head.appendChild(style);
