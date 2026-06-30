const key='unigo_analytics_consent';
const measurementId='G-SBVSM639PC';

function loadAnalytics(){
  if(window.__unigoAnalyticsLoaded)return;
  window.__unigoAnalyticsLoaded=true;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config',measurementId,{send_page_view:true,anonymize_ip:true});
  const tag=document.createElement('script');
  tag.async=true;
  tag.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;
  document.head.appendChild(tag);
}

function save(choice){
  localStorage.setItem(key,choice);
  document.querySelector('.cookie-banner')?.remove();
  if(choice==='granted')loadAnalytics();
}

const choice=localStorage.getItem(key);
if(choice==='granted')loadAnalytics();
if(!choice){
  const banner=document.createElement('aside');
  banner.className='cookie-banner';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-label','Cookie preferences');
  banner.innerHTML='<p><strong>Optional analytics</strong><br>UNIGO uses Google Analytics only with your permission. Essential website functions work without it. <a href="cookie-policy.html">Learn more</a>.</p><div><button type="button" class="btn secondary" data-choice="denied">Reject</button><button type="button" class="btn primary" data-choice="granted">Accept analytics</button></div>';
  banner.addEventListener('click',event=>{const value=event.target?.dataset?.choice;if(value)save(value);});
  document.body.appendChild(banner);
  const style=document.createElement('style');
  style.textContent='.cookie-banner{position:fixed;z-index:9999;left:16px;right:16px;bottom:16px;max-width:900px;margin:auto;padding:18px;display:flex;gap:20px;align-items:center;justify-content:space-between;border:1px solid rgba(255,255,255,.18);border-radius:18px;background:#111;color:#fff;box-shadow:0 24px 70px rgba(0,0,0,.55)}.cookie-banner p{margin:0;line-height:1.5}.cookie-banner a{color:#ead79f;text-decoration:underline}.cookie-banner div{display:flex;gap:10px;flex-shrink:0}@media(max-width:700px){.cookie-banner{display:block}.cookie-banner div{margin-top:14px}.cookie-banner .btn{flex:1}}';
  document.head.appendChild(style);
}

export function track(name){
  if(localStorage.getItem(key)==='granted'&&typeof window.gtag==='function')window.gtag('event',name);
}
