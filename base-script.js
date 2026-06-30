const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');
if(menuBtn&&nav){
  menuBtn.addEventListener('click',()=>{
    nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
  }));
}

const ensureMeta=(selector,attrs,value)=>{
  let el=document.head.querySelector(selector);
  if(!el){
    el=document.createElement('meta');
    Object.entries(attrs).forEach(([key,val])=>el.setAttribute(key,val));
    document.head.appendChild(el);
  }
  el.setAttribute('content',value);
};
ensureMeta('meta[property="og:image"]',{property:'og:image'},'/assets/UNIGO_Premium_Social_Share_Card.png');
ensureMeta('meta[property="og:image:width"]',{property:'og:image:width'},'1200');
ensureMeta('meta[property="og:image:height"]',{property:'og:image:height'},'630');
ensureMeta('meta[property="og:site_name"]',{property:'og:site_name'},'UNIGO');
ensureMeta('meta[name="twitter:card"]',{name:'twitter:card'},'summary_large_image');
ensureMeta('meta[name="twitter:image"]',{name:'twitter:image'},'/assets/UNIGO_Premium_Social_Share_Card.png');

const travelerFormMarkup=()=>`<form class="beta-form" data-beta-form>
  <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:1px;width:1px;opacity:0">
  <input type="hidden" name="type" value="traveler">
  <div class="form-grid">
    <label>Full name<input name="name" type="text" autocomplete="name" required maxlength="120" placeholder="Your name"></label>
    <label>Email address<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com"></label>
    <label>City or country<input name="city" type="text" autocomplete="address-level2" maxlength="120" placeholder="Utrecht, Netherlands"></label>
    <label>Organization <span class="muted">(optional)</span><input name="organization" type="text" maxlength="160" placeholder="Business or community name"></label>
  </div>
  <label>Why are you interested in UNIGO? <span class="muted">(optional)</span><textarea name="message" maxlength="2000" rows="4" placeholder="Tell us what you would like to explore or contribute."></textarea></label>
  <label class="consent-row"><input name="consent" type="checkbox" required><span>I agree that UNIGO may store my details and contact me about the platform. See our <a href="privacy.html">Privacy Policy</a>.</span></label>
  <button class="btn primary" type="submit">Join UNIGO</button>
  <p class="form-status" role="status" aria-live="polite"></p>
</form>`;

const homeLead=document.querySelector('.lead-form');
if(homeLead&&!homeLead.querySelector('[data-beta-form]')) homeLead.innerHTML=travelerFormMarkup();

document.querySelectorAll('[data-beta-form]').forEach(form=>{
  if(!form.querySelector('[name="website"]')){
    const honeypot=document.createElement('input');
    honeypot.type='text';honeypot.name='website';honeypot.tabIndex=-1;honeypot.autocomplete='off';
    honeypot.setAttribute('aria-hidden','true');
    honeypot.style.cssText='position:absolute;left:-9999px;height:1px;width:1px;opacity:0';
    form.prepend(honeypot);
  }

  const consentText=form.querySelector('.consent-row span');
  if(consentText) consentText.innerHTML='I agree that UNIGO may store my details and contact me about the platform. See our <a href="privacy.html">Privacy Policy</a>.';

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const status=form.querySelector('.form-status');
    const button=form.querySelector('button[type="submit"]');
    const originalText=button.textContent;
    status.className='form-status';
    status.textContent='Submitting your request…';
    button.textContent='Submitting…';
    button.disabled=true;

    const payload=Object.fromEntries(new FormData(form).entries());
    payload.consent=Boolean(form.elements.consent?.checked);
    payload.source=location.pathname.includes('apply')?'partner_application':'website_join';

    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);

    try{
      const response=await fetch('/api/beta-signup',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload),
        signal:controller.signal
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.error||'Unable to submit your request');
      sessionStorage.setItem('unigo_submission_type',location.pathname.includes('apply')?'partner':'traveler');
      status.classList.add('success');
      status.textContent='Your request was received. Redirecting…';
      window.location.href='thank-you.html';
    }catch(error){
      status.classList.add('error');
      status.textContent=error.name==='AbortError'?'The request took too long. Please try again.':(error.message||'Something went wrong. Please try again.');
      button.disabled=false;
      button.textContent=originalText;
    }finally{
      clearTimeout(timeout);
    }
  });
});

const heroPassport=document.querySelector('.hero .phone-card');
if(heroPassport&&!heroPassport.matches('a')){
  heroPassport.style.cursor='pointer';
  heroPassport.setAttribute('role','link');
  heroPassport.setAttribute('tabindex','0');
  const go=()=>window.location.href='impact-passport.html';
  heroPassport.addEventListener('click',go);
  heroPassport.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
}

const addFaqLink=(container,beforeSelector)=>{
  if(!container||container.querySelector('a[href="faq.html"]')) return;
  const link=document.createElement('a');link.href='faq.html';link.textContent='FAQ';
  const before=beforeSelector?container.querySelector(beforeSelector):null;
  if(before) container.insertBefore(link,before); else container.appendChild(link);
};
addFaqLink(document.querySelector('.nav'),'.nav-cta');
addFaqLink(document.querySelector('.footer-links'),'a[href="privacy.html"]');

const mobileStyle=document.createElement('style');
mobileStyle.textContent=`.reveal{opacity:1;transform:none}.menu-btn{min-width:44px;min-height:44px}.btn,a,button{-webkit-tap-highlight-color:transparent}.beta-form input,.beta-form select,.beta-form textarea{font-size:16px}@media(max-width:900px){.nav.open{max-height:calc(100dvh - 72px);overflow-y:auto}.nav.open a{min-height:48px;display:flex;align-items:center}}@media(max-width:700px){.hero-actions .btn{width:100%}.footer-links{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.section{padding-left:max(5%,env(safe-area-inset-left));padding-right:max(5%,env(safe-area-inset-right))}}`;
document.head.appendChild(mobileStyle);

const revealItems=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  revealItems.forEach(item=>{item.style.opacity='0';item.style.transform='translateY(20px)';});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.opacity='1';entry.target.style.transform='none';observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -20px'});
  revealItems.forEach(item=>observer.observe(item));
}else revealItems.forEach(item=>item.classList.add('visible'));

const firstForm=document.querySelector('[data-beta-form]');
if(firstForm&&!document.querySelector('.trust-rail')){
  const trust=document.createElement('div');
  trust.className='trust-rail';
  trust.innerHTML='<span>Privacy-conscious</span><span>Transparent scoring</span><span>Netherlands launch</span><span>No greenwashing claims</span>';
  firstForm.closest('.lead-form')?.insertAdjacentElement('beforebegin',trust);
  const trustStyle=document.createElement('style');
  trustStyle.textContent=`.trust-rail{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:22px 0}.trust-rail span{border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:9px 12px;color:#d8d5cb;background:rgba(255,255,255,.035);font-size:12px;font-weight:700;text-align:center}@media(max-width:700px){.trust-rail{grid-template-columns:1fr}.trust-rail span{text-align:left}}`;
  document.head.appendChild(trustStyle);
}
