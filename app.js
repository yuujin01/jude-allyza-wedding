// Wedding countdown: December 3, 2026 at 11:00 AM Philippine time.
const weddingAt = new Date('2026-12-03T11:00:00+08:00').getTime();
function updateCountdown(){
 const diff=Math.max(0,weddingAt-Date.now());
 const v={days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),minutes:Math.floor(diff%3600000/60000),seconds:Math.floor(diff%60000/1000)};
 Object.entries(v).forEach(([id,n])=>{const el=document.getElementById(id);if(el)el.textContent=id==='days'?String(n):String(n).padStart(2,'0')});
}
updateCountdown();setInterval(updateCountdown,1000);

// Envelope intro
const screen=document.getElementById('envelope-screen'), envelope=document.getElementById('envelope');
function openInvitation(){if(!screen||screen.classList.contains('opening'))return;screen.classList.add('opening');setTimeout(()=>{screen.classList.add('closed');document.body.classList.remove('locked')},1450);setTimeout(()=>screen.remove(),2100)}
document.body.classList.add('locked');
document.getElementById('open-envelope')?.addEventListener('click',openInvitation);
envelope?.addEventListener('click',openInvitation);
envelope?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openInvitation()}});

// Guest directory: a companion name resolves to the same household/group record.
const guests = window.GUEST_DATA || [];
const input=document.getElementById('guest-name'), list=document.getElementById('guest-options');
const hint=document.getElementById('guest-hint'), seatCount=document.getElementById('seat-count');
const preview=document.getElementById('guest-preview'), previewMain=document.getElementById('preview-main');
const previewSeats=document.getElementById('preview-seats'), companionList=document.getElementById('companion-list');
const seatNote=document.getElementById('seat-note'), message=document.getElementById('rsvp-message');
let selectedGuest=null, searchedMember='';
function norm(s){return String(s||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ')}
// Every registered person is searchable: the main guest AND every companion.
// A companion match always opens the same shared group record.
function allNames(g){return [...new Set([g.name,...(g.companions||[])].filter(Boolean))]}
function findMatches(q){
 if(!q)return [];
 return guests.flatMap(g=>allNames(g).filter(n=>norm(n).includes(q)).map(n=>({group:g,matched:n})));
}
function updateSeatNote(){
 if(!selectedGuest)return;
 const used=[...companionList.querySelectorAll('.companion-row')].filter(r=>r.querySelector('.companion-check').checked&&r.querySelector('.companion-name').value.trim()).length+1;
 const vacant=selectedGuest.seats-used;
 seatNote.textContent=`${used} of ${selectedGuest.seats} allocated seats filled. ${vacant} seat(s) remaining. Vacant seats may be left unused.`;
}
function renderGuest(g,matched){
 selectedGuest=g;searchedMember=matched;preview.hidden=false;previewMain.textContent=g.name;
 previewSeats.textContent=g.seats;seatCount.textContent=g.seats;companionList.innerHTML='';
 const foundAs=document.getElementById('matched-as');
 if(foundAs)foundAs.textContent=matched.toLocaleLowerCase()===g.name.toLocaleLowerCase()?'You searched the main guest name.':'You searched a companion name; this is the same guest group.';
 for(let i=0;i<g.seats-1;i++){
  const value=g.companions[i]||'';const row=document.createElement('div');row.className='companion-row';
  const check=document.createElement('input');check.type='checkbox';check.className='companion-check';check.checked=Boolean(value);check.setAttribute('aria-label',`Include companion ${i+1}`);
  const name=document.createElement('input');name.type='text';name.className='companion-name';name.value=value;name.placeholder='Companion name (optional)';name.disabled=!check.checked;name.setAttribute('aria-label',`Companion name ${i+1}`);
  check.addEventListener('change',()=>{name.disabled=!check.checked;if(!check.checked)name.value='';updateSeatNote()});
  name.addEventListener('input',updateSeatNote);row.append(check,name);companionList.append(row);
 }
 updateSeatNote();hint.textContent=`Found ${matched}. This name belongs to ${g.name}'s group. Any member of this group may complete the shared RSVP.`;
}
function resetPreview(){selectedGuest=null;preview.hidden=true;seatCount.textContent='—';if(message)message.textContent='';}
input?.addEventListener('input',()=>{
 const q=norm(input.value);list.innerHTML='';resetPreview();
 if(!q){hint.textContent='Search using any registered name — main guest or companion.';return;}
 const matches=findMatches(q);const seen=new Set();
 matches.forEach(m=>{if(!seen.has(m.matched)){seen.add(m.matched);const opt=document.createElement('option');opt.value=m.matched;list.append(opt)}});
 const exact=matches.find(m=>norm(m.matched)===q);
 if(exact)renderGuest(exact.group,exact.matched);
 else hint.textContent=matches.length?`${matches.length} matching name(s). Choose or type the exact full name — companions are searchable too.`:'Name not found. Check the spelling or try another registered name.';
});
input?.addEventListener('change',()=>{const q=norm(input.value);const m=findMatches(q).find(x=>norm(x.matched)===q);if(m)renderGuest(m.group,m.matched)});

document.getElementById('rsvp-form')?.addEventListener('submit',e=>{
 e.preventDefault();if(!selectedGuest){message.textContent='Please enter the exact full name of any registered group member first.';return;}
 const attendance=document.querySelector('input[name="attendance"]:checked');if(!attendance){message.textContent='Please select Joyfully accepts or Regretfully declines.';return;}
 const companions=[...companionList.querySelectorAll('.companion-row')].filter(r=>r.querySelector('.companion-check').checked).map(r=>r.querySelector('.companion-name').value.trim()).filter(Boolean);
 const total=attendance.value==='Joyfully accepts'?1+companions.length:0;
 const payload={groupId:selectedGuest.id,mainGuest:selectedGuest.name,searchedName:searchedMember,allocatedSeats:selectedGuest.seats,attendance:attendance.value,companions,attendingCount:total};
 // Backend connection is deliberately not simulated. This preview confirms the exact data before Sheets setup.
 message.textContent=`RSVP preview: ${payload.mainGuest} — ${payload.attendance}. ${payload.attendingCount} attending out of ${payload.allocatedSeats} allocated seats. Google Sheets saving still needs to be connected.`;
});
