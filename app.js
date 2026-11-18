(function(){
  const wedding = new Date('2026-12-03T11:00:00+08:00').getTime();
  const ids = ['days','hours','minutes','seconds'];
  function tick(){
    let remaining=Math.max(0,wedding-Date.now());
    const values=[Math.floor(remaining/86400000),Math.floor(remaining%86400000/3600000),Math.floor(remaining%3600000/60000),Math.floor(remaining%60000/1000)];
    ids.forEach((id,i)=>{const el=document.getElementById(id);if(el)el.textContent=String(values[i]).padStart(2,'0')});
  }
  tick();setInterval(tick,1000);

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
