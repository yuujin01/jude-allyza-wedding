(function(){
  const envelopeScreen=document.getElementById('envelope-screen');
  const openEnvelope=document.getElementById('open-envelope');
  if(openEnvelope&&envelopeScreen){
    openEnvelope.addEventListener('click',()=>{
      if(openEnvelope.disabled)return;
      openEnvelope.disabled=true;
      envelopeScreen.classList.add('opening');
      window.setTimeout(()=>{
        envelopeScreen.classList.add('dismissed');
        document.body.classList.remove('envelope-locked');
        window.setTimeout(()=>envelopeScreen.remove(),900);
      },1350);
    });
  }


  const heart=document.getElementById('heart');
  heart.addEventListener('click',()=>{const saved=heart.getAttribute('aria-pressed')!=='true';heart.setAttribute('aria-pressed',String(saved));heart.classList.toggle('saved',saved);heart.setAttribute('aria-label',saved?'Invitation saved in this page':'Save this invitation')});

  const form=document.getElementById('rsvp');
  const message=document.getElementById('rsvp-message');
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const guest=document.getElementById('guest-name').value.trim();
    const choice=form.querySelector('input[name="attendance"]:checked');
    if(!guest||!choice){message.textContent='Please enter your name and choose an attendance response.';return;}
    message.textContent='Thank you, '+guest+'. Your response is selected, but online RSVP submission is not connected yet. Please contact the couple to confirm.';
  });
})();
