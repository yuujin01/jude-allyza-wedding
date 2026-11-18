// Wedding time: December 3, 2026 at 11:00 AM Philippine time (UTC+8)
const weddingAt = new Date('2026-12-03T11:00:00+08:00').getTime();
function updateCountdown(){
  const diff=Math.max(0,weddingAt-Date.now());
  const values={days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),minutes:Math.floor(diff%3600000/60000),seconds:Math.floor(diff%60000/1000)};
  Object.entries(values).forEach(([id,n])=>{const el=document.getElementById(id);if(el)el.textContent=id==='days'?String(n):String(n).padStart(2,'0')});
}
updateCountdown();setInterval(updateCountdown,1000);

// Envelope welcome screen: opens the card before guests enter the website.
const envelopeScreen=document.getElementById('envelope-screen');
const envelope=document.getElementById('envelope');
function openInvitation(){if(envelopeScreen.classList.contains('opening'))return;envelopeScreen.classList.add('opening');setTimeout(()=>{envelopeScreen.classList.add('closed');document.body.classList.remove('locked')},1450);setTimeout(()=>envelopeScreen.remove(),2100)}
document.body.classList.add('locked');
document.getElementById('open-envelope').addEventListener('click',openInvitation);
envelope.addEventListener('click',openInvitation);
envelope.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openInvitation()}});

// Guest allocations from the supplied guest list. Companion names are editable in the preview.
const guests=[
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
const input=document.getElementById('guest-name'),list=document.getElementById('guest-options'),hint=document.getElementById('guest-hint'),seatCount=document.getElementById('seat-count'),preview=document.getElementById('guest-preview'),previewMain=document.getElementById('preview-main'),previewSeats=document.getElementById('preview-seats'),companionList=document.getElementById('companion-list'),seatNote=document.getElementById('seat-note'),message=document.getElementById('rsvp-message');
let selectedGuest=null;
function norm(s){return s.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ')}
function renderGuest(g){selectedGuest=g;preview.hidden=false;previewMain.textContent=g.name;previewSeats.textContent=g.seats;seatCount.textContent=g.seats;companionList.innerHTML='';
 const maxCompanions=Math.max(0,g.seats-1);
 for(let i=0;i<maxCompanions;i++){
   const value=g.companions[i]||'';const row=document.createElement('div');row.className='companion-row';
   const check=document.createElement('input');check.type='checkbox';check.checked=Boolean(value);check.setAttribute('aria-label','Include companion '+(i+1));
   const name=document.createElement('input');name.type='text';name.value=value;name.placeholder='Companion name (optional)';name.disabled=!check.checked;name.setAttribute('aria-label','Companion name '+(i+1));
   check.addEventListener('change',()=>{name.disabled=!check.checked;if(!check.checked)name.value='';updateSeatNote()});name.addEventListener('input',updateSeatNote);
   row.append(check,name);companionList.append(row);
 }
 updateSeatNote();hint.textContent='Guest found. Review your name and allocated companions below.';
}
function updateSeatNote(){if(!selectedGuest)return;const included=[...companionList.querySelectorAll('.companion-row')].filter(r=>r.querySelector('input[type=checkbox]').checked&&r.querySelector('input[type=text]').value.trim()).length;seatNote.textContent=`${included+1} of ${selectedGuest.seats} allocated seats currently filled (including you). You can leave seats unused.`}
input.addEventListener('input',()=>{const q=norm(input.value);list.innerHTML='';selectedGuest=null;preview.hidden=true;seatCount.textContent='—';message.textContent='';const matches=q?guests.filter(g=>norm(g.name).includes(q)):[];matches.forEach(g=>{const opt=document.createElement('option');opt.value=g.name;list.append(opt)});const exact=guests.find(g=>norm(g.name)===q);if(exact)renderGuest(exact);else hint.textContent=q?(matches.length?`${matches.length} matching guest name(s). Choose your full registered name.`:'Name not found in the current guest list.'):'Start typing your registered name.'});
input.addEventListener('change',()=>{const g=guests.find(x=>norm(x.name)===norm(input.value));if(g)renderGuest(g)});
document.getElementById('rsvp-form').addEventListener('submit',e=>{e.preventDefault();if(!selectedGuest){message.textContent='Please select your exact registered name first.';return}const attendance=document.querySelector('input[name="attendance"]:checked');if(!attendance){message.textContent='Please select Joyfully accepts or Regretfully declines.';return}const companions=[...companionList.querySelectorAll('.companion-row')].filter(r=>r.querySelector('input[type=checkbox]').checked).map(r=>r.querySelector('input[type=text]').value.trim()).filter(Boolean);message.textContent=`Preview ready for ${selectedGuest.name}: ${attendance.value}. ${companions.length+1} guest name(s) listed out of ${selectedGuest.seats} allocated seats. Online RSVP saving is not connected yet.`});
