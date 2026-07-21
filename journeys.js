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

const applyForm=document.querySelector('body:not(.home-page) [data-beta-form]');
if(applyForm&&!document.querySelector('.partner-reward-card')){
  const card=document.createElement('aside');
  card.className='partner-reward-card';
  card.innerHTML='<span class="reward-badge">Partner Application</span><strong>Apply to join UNIGO</strong><p>Share your business profile for review and make your impact visible to travelers.</p>';
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
style.textContent=`.partner-reward-card,.referral-share-card{padding:26px;border:1px solid rgba(255,255,255,.12);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.025));box-shadow:0 26px 80px rgba(0,0,0,.32)}.reward-badge{display:inline-flex;padding:7px 10px;border-radius:999px;border:1px solid rgba(215,189,117,.28);background:rgba(215,189,117,.1);color:#ead79f;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px}.partner-reward-card{margin-bottom:18px}.partner-reward-card strong{display:block;color:#fff;font-size:20px;margin-bottom:6px}.partner-reward-card p{margin:0}.referral-share-card{max-width:620px;margin:28px auto}.referral-share-card small{display:block;margin-top:14px;color:#aaa9a4;overflow-wrap:anywhere}.referral-share-card .btn{margin-top:8px}@media(max-width:700px){.partner-reward-card,.referral-share-card{padding:21px}}`;
document.head.appendChild(style);

if(!/privacy|terms/i.test(location.pathname)){
  const replacements=[
    [/Join Beta/gi,'Get Early Access'],
    [/Join the Beta/gi,'Get Early Access'],
    [/Request beta access/gi,'Request Access'],
    [/Traveler beta/gi,'Early Access'],
    [/Private beta access/gi,'Private Early Access'],
    [/Early beta/gi,'Early Access'],
    [/beta members/gi,'early members'],
    [/beta member/gi,'early member'],
    [/beta businesses/gi,'featured partners'],
    [/beta community/gi,'founding community'],
    [/beta platform/gi,'UNIGO platform'],
    [/beta rewards/gi,'founding rewards'],
    [/beta access/gi,'early access'],
    [/the beta/gi,'Early Access'],
    [/ beta /gi,' early-access '],
    [/Beta/g,'Early Access'],
    [/beta/g,'early access']
  ];
  const swap=value=>replacements.reduce((text,[pattern,next])=>text.replace(pattern,next),value);
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.parentElement&& !['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement.tagName)&&node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{node.nodeValue=swap(node.nodeValue);});
  document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{
    ['placeholder','aria-label','title'].forEach(attr=>{if(el.hasAttribute(attr))el.setAttribute(attr,swap(el.getAttribute(attr)));});
  });
}
