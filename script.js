(async()=>{
  await import('./analytics.js');
  await import('./base-script.js');
  await import('./journeys.js');

  const passportPreview=document.querySelector('.passport-preview');
  if(passportPreview){
    const creditChip=passportPreview.querySelector('.credit-chip');
    if(creditChip) creditChip.textContent='Demo';

    const ringValue=passportPreview.querySelector('.impact-ring strong');
    const ringLabel=passportPreview.querySelector('.impact-ring span');
    if(ringValue) ringValue.textContent='—';
    if(ringLabel) ringLabel.textContent='Credits pending';

    const metrics=[
      ['CRS','Carbon'],
      ['GES','Equality'],
      ['LGBTQIS','Inclusion'],
      ['LES','Local'],
      ['CIS','Community']
    ];
    passportPreview.querySelectorAll('.metric-grid > div').forEach((item,index)=>{
      const strong=item.querySelector('strong');
      const small=item.querySelector('small');
      if(strong) strong.textContent='—';
      if(small&&metrics[index]) small.textContent=metrics[index][0];
    });

    const heroText=passportPreview.querySelector('.phone-hero p');
    if(heroText) heroText.textContent='Five impact dimensions. Scores appear only after verified actions and an approved methodology.';

    const badges=passportPreview.querySelector('.badges');
    if(badges){
      badges.innerHTML='<span>Example badges</span><span>Verified actions only</span><span>Methodology pending</span>';
    }
  }
})();
