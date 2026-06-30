const measurementId='G-SBVSM639PC';
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
window.gtag('js',new Date());
window.gtag('config',measurementId,{send_page_view:true});
if(!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)){
  const tag=document.createElement('script');
  tag.async=true;
  tag.src=`https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(tag);
}

document.addEventListener('submit',event=>{
  const form=event.target;
  if(!(form instanceof HTMLFormElement)) return;
  if(form.matches('[data-beta-form], .beta-form')) window.gtag('event','beta_signup_submit');
  if(location.pathname.includes('apply')) window.gtag('event','partner_application_submit');
});
