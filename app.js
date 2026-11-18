// Wedding time: December 3, 2026 at 11:00 AM Philippine time (UTC+8)
const weddingAt = new Date('2026-12-03T11:00:00+08:00').getTime();
function updateCountdown(){
  const diff = Math.max(0, weddingAt - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  document.getElementById('days').textContent = String(days);
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown,1000);
// Demo guest list and seat lookup. Replace/add entries to match the final guest spreadsheet.
const guests = [
 ['Anthony Jones Tyndall',2],['Fritzie Lourd Manlapat',3],['Norverto Santos',6],['Francis Jarque',5],['Riza Dela Cruz',2],['Gretchen Peña',2],['Alex Hernandez',1],['Jocelyn Manlapat',2],['Czarina Tyndall',2],['Nelson Manlapat',2]
];
const input=document.getElementById('guest-name'), list=document.getElementById('guest-options'), hint=document.getElementById('guest-hint'), seats=document.getElementById('seat-count');
function normalize(s){return s.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
function matchGuest(){const q=normalize(input.value);list.innerHTML='';const matches=q?guests.filter(g=>normalize(g[0]).includes(q)):[];matches.forEach(g=>{const o=document.createElement('option');o.value=g[0];list.appendChild(o)});const exact=guests.find(g=>normalize(g[0])===q);if(exact){seats.textContent=exact[1];hint.textContent='Guest found: '+exact[0]+'.';}else{seats.textContent='—';hint.textContent=q?(matches.length?matches.length+' matching name(s). Select your full name.':'Name not found in the current guest list.'):'Enter your name to continue.';}}
input.addEventListener('input',matchGuest);
document.getElementById('rsvp-form').addEventListener('submit',e=>{e.preventDefault();const exact=guests.find(g=>normalize(g[0])===normalize(input.value));const attendance=document.querySelector('input[name="attendance"]:checked');const msg=document.getElementById('rsvp-message');if(!exact){msg.textContent='Please select the exact name registered on the guest list.';return;}if(!attendance){msg.textContent='Please select your attendance.';return;}msg.textContent='Thank you, '+exact[0]+'. Your response is ready, but online saving is not connected yet.';});
