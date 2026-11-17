(() => {
  const cover=document.getElementById('envelope-screen'), openButton=document.getElementById('open-envelope');
  openButton.addEventListener('click',()=>{openButton.disabled=true;cover.classList.add('opening');window.setTimeout(()=>{cover.classList.add('hide');document.body.classList.remove('locked');},1100);});

  // Wedding date is interpreted in Philippine local time (UTC+8).
  const target = new Date('2026-12-03T11:00:00+08:00').getTime();
  const fields = ['days','hours','minutes','seconds'];
  function tick(){
    let remaining = Math.max(0, target - Date.now());
    const values = [Math.floor(remaining/86400000), Math.floor((remaining%86400000)/3600000), Math.floor((remaining%3600000)/60000), Math.floor((remaining%60000)/1000)];
    fields.forEach((id,i)=>{const el=document.getElementById(id); if(el) el.textContent=String(values[i]).padStart(2,'0');});
    if(remaining===0){const label=document.querySelector('.countdown .eyebrow');if(label)label.textContent='TODAY IS THE DAY!';}
  }
  tick(); window.setInterval(tick,1000);

  // Guest lookup and allocations from the provided guest-list details.
  const guests = [
    {name:'Anthony Jones Tyndall',seats:2,companions:['Sydney Dalisay']},
    {name:'Fritzie Lourd Manlapat',seats:3,companions:['Melvin Manlapat','Aezii Manlapat']},
    {name:'Norverto Santos',seats:6,companions:['Roma Santos','Joel Santos','Jacquiline Santos','Unyong Santos','Lea Luz Dineroz']},
    {name:'Francis Jarque',seats:5,companions:['Jenny Jarque','Gracia Amor Jarque']},
    {name:'Riza Dela Cruz',seats:2,companions:['Noel Dela Cruz']},
    {name:'Gretchen Peña',seats:2,companions:['Michael Peña']},
    {name:'Alex Hernandez',seats:1,companions:[]},
    {name:'Jocelyn Manlapat',seats:2,companions:['Generoso Manlapat']},
    {name:'Czarina Tyndall',seats:2,companions:['Ean Elivera']},
    {name:'Nelson Manlapat',seats:2,companions:['Divina Manlapat']}
  ];
  const search=document.getElementById('guest-search'), results=document.getElementById('guest-results'), seat=document.getElementById('seat-info');
  let selected=null;
  function selectGuest(g){selected=g;search.value=g.name;results.hidden=true;seat.textContent=`${g.seats} seat${g.seats===1?'':'s'} allocated, including the main guest.`;}
  search.addEventListener('input',()=>{
    selected=null;seat.textContent='';const q=search.value.trim().toLocaleLowerCase();results.replaceChildren();
    if(!q){results.hidden=true;return;}
    const matches=[];guests.forEach(g=>{if(g.name.toLocaleLowerCase().includes(q))matches.push({label:g.name,guest:g});g.companions.forEach(n=>{if(n.toLocaleLowerCase().includes(q))matches.push({label:n,guest:g});});});
    matches.slice(0,8).forEach(m=>{const b=document.createElement('button');b.type='button';b.textContent=m.label;b.addEventListener('click',()=>selectGuest(m.guest));results.append(b);});
    if(!matches.length){const p=document.createElement('p');p.textContent='Name not found in the current guest list. Please check the spelling or contact the couple.';p.style.padding='10px';p.style.margin='0';results.append(p);}results.hidden=false;
  });
  document.addEventListener('click',e=>{if(!results.contains(e.target)&&e.target!==search)results.hidden=true;});
  const form=document.getElementById('rsvp-form'), message=document.getElementById('rsvp-message');
  form.addEventListener('submit',e=>{e.preventDefault();if(!selected){message.textContent='Please select your name from the search suggestions first.';return;}const attendance=form.querySelector('input[name="attendance"]:checked');if(!attendance){message.textContent='Please choose your attendance response.';return;}message.textContent=`Thank you, ${selected.name}. Your response is ready, but online submission has not yet been connected to a shared RSVP database.`;});
})();
