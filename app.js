// Jude & Allyza wedding website — Google Apps Script RSVP connection.
const API_URL = 'https://script.google.com/macros/s/AKfycbwxMw3fwZRYtWOPfX8RvD-ge6stoVIC6l8VvGlq5u_w3984aO9ib4jC2iYRddHFxQ2wqA/exec';

// Wedding countdown: December 3, 2026 at 11:00 AM Philippine time.
const weddingAt = new Date('2026-12-03T11:00:00+08:00').getTime();
function updateCountdown(){
 const diff=Math.max(0,weddingAt-Date.now());
 const v={days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),minutes:Math.floor(diff%3600000/60000),seconds:Math.floor(diff%60000/1000)};
 Object.entries(v).forEach(([id,n])=>{const el=document.getElementById(id);if(el)el.textContent=id==='days'?String(n):String(n).padStart(2,'0')});
}
updateCountdown();setInterval(updateCountdown,1000);

// Background music: attempt autoplay on page load. Browsers may block audible autoplay;
// retry immediately on the visitor's first interaction (including opening the envelope).
const musicFrame=document.getElementById('music-player');
let musicStartedByInteraction=false;
function startWeddingMusic(){
 if(!musicFrame||musicStartedByInteraction)return;
 musicStartedByInteraction=true;
 try{
  musicFrame.contentWindow.postMessage(JSON.stringify({event:'command',func:'playVideo',args:[]}), '*');
 }catch(_err){}
}
window.addEventListener('pointerdown',startWeddingMusic,{once:true});
window.addEventListener('keydown',startWeddingMusic,{once:true});

// Envelope intro
const screen=document.getElementById('envelope-screen'), envelope=document.getElementById('envelope');
function openInvitation(){startWeddingMusic();if(!screen||screen.classList.contains('opening'))return;screen.classList.add('opening');setTimeout(()=>{screen.classList.add('closed');document.body.classList.remove('locked')},1450);setTimeout(()=>screen.remove(),2100)}
document.body.classList.add('locked');
document.getElementById('open-envelope')?.addEventListener('click',openInvitation);
envelope?.addEventListener('click',openInvitation);
envelope?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openInvitation()}});

// RSVP lookup is performed by the private Apps Script backend; no guest directory is shipped in the website.
const input=document.getElementById('guest-name'), list=document.getElementById('guest-options');
const hint=document.getElementById('guest-hint'), seatCount=document.getElementById('seat-count');
const preview=document.getElementById('guest-preview'), previewMain=document.getElementById('preview-main');
const previewSeats=document.getElementById('preview-seats'), companionList=document.getElementById('companion-list');
const seatNote=document.getElementById('seat-note'), message=document.getElementById('rsvp-message');
let selectedGuest=null, searchedMember='', lookupToken=0, suggestionTimer=null, suggestionToken=0;
function norm(s){return String(s||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ')}
function updateSeatNote(){
 if(!selectedGuest)return;
 const used=[...companionList.querySelectorAll('.companion-row')].filter(r=>r.querySelector('.companion-check').checked&&r.querySelector('.companion-name').value.trim()).length+1;
 const vacant=selectedGuest.seats-used;
 seatNote.textContent=`${used} of ${selectedGuest.seats} allocated seats filled. ${vacant} seat(s) remaining. Vacant seats may be left unused.`;
}
function resetPreview(){selectedGuest=null;preview.hidden=true;seatCount.textContent='—';if(message)message.textContent='';}
function renderGuest(data,matched){
 // The person who searched becomes the Main Guest for this RSVP.
 // Everyone else already registered in the same group becomes a companion.
 const registeredNames=Array.isArray(data.names)&&data.names.length?data.names:[data.mainGuest,...(data.companions||[])];
 const matchedName=registeredNames.find(name=>norm(name)===norm(matched))||matched;
 const otherNames=registeredNames.filter(name=>norm(name)!==norm(matchedName));
 const g={id:Number(data.groupId),name:matchedName,seats:Number(data.seats),companions:otherNames};
 selectedGuest=g;searchedMember=matchedName;preview.hidden=false;previewMain.textContent=g.name;
 previewSeats.textContent=g.seats;seatCount.textContent=g.seats;companionList.innerHTML='';
 const foundAs=document.getElementById('matched-as');
 if(foundAs)foundAs.textContent='You are the Main Guest for this RSVP. Other registered members in your group are listed as companions.';
 // The selected Main Guest occupies one allocated seat; remaining seats are companions.
 for(let i=0;i<g.seats-1;i++){
  const value=g.companions[i]||'';const row=document.createElement('div');row.className='companion-row';
  const check=document.createElement('input');check.type='checkbox';check.className='companion-check';check.checked=Boolean(value);check.setAttribute('aria-label',`Include companion ${i+1}`);
  const name=document.createElement('input');name.type='text';name.className='companion-name';name.value=value;name.placeholder='Companion name (optional)';name.disabled=!check.checked;name.setAttribute('aria-label',`Companion name ${i+1}`);
  check.addEventListener('change',()=>{name.disabled=!check.checked;if(!check.checked)name.value='';updateSeatNote()});
  name.addEventListener('input',updateSeatNote);row.append(check,name);companionList.append(row);
 }
 updateSeatNote();hint.textContent=`Welcome, ${g.name}. You are the Main Guest for this RSVP. Your group has ${g.seats} allocated seat(s).`;
}
function jsonpSearch(query){
 return new Promise((resolve,reject)=>{
  const callback='jaGuestLookup_'+Date.now()+'_'+Math.floor(Math.random()*100000);
  const script=document.createElement('script');
  const timeout=setTimeout(()=>{cleanup();reject(new Error('Search timed out. Please try again.'));},12000);
  function cleanup(){clearTimeout(timeout);delete window[callback];script.remove();}
  window[callback]=(result)=>{cleanup();resolve(result);};
  script.onerror=()=>{cleanup();reject(new Error('Unable to connect to the guest list. Please try again.'));};
  script.src=API_URL+'?action=search&q='+encodeURIComponent(query)+'&callback='+callback;
  document.body.appendChild(script);
 });
}
function jsonpSuggest(query){
 return new Promise((resolve,reject)=>{
  const callback='jaGuestSuggest_'+Date.now()+'_'+Math.floor(Math.random()*100000);
  const script=document.createElement('script');
  const timeout=setTimeout(()=>{cleanup();reject(new Error('Suggestions timed out.'));},9000);
  function cleanup(){clearTimeout(timeout);delete window[callback];script.remove();}
  window[callback]=(result)=>{cleanup();resolve(result);};
  script.onerror=()=>{cleanup();reject(new Error('Unable to load name suggestions.'));};
  script.src=API_URL+'?action=suggest&q='+encodeURIComponent(query)+'&callback='+callback;
  document.body.appendChild(script);
 });
}
async function updateSuggestions(query){
 const token=++suggestionToken;
 if(!list)return;
 list.innerHTML='';
 if(query.trim().length<2)return;
 try{
  const result=await jsonpSuggest(query.trim());
  if(token!==suggestionToken)return;
  if(result&&result.ok&&Array.isArray(result.suggestions)){
   result.suggestions.forEach(name=>{const option=document.createElement('option');option.value=name;list.appendChild(option);});
  }
 }catch(_err){/* Exact-name search remains available if suggestions fail. */}
}
async function lookupGuest(){
 const q=input.value.trim();const token=++lookupToken;resetPreview();
 if(!q){hint.textContent='Search using your registered full name — main guest or companion.';return;}
 hint.textContent='Searching guest list…';
 try{
  const result=await jsonpSearch(q);
  if(token!==lookupToken)return;
  if(result&&result.ok){renderGuest(result,q);}
  else{hint.textContent=(result&&result.message)||'Guest not found. Please check the spelling and try the full name.';}
 }catch(err){if(token===lookupToken)hint.textContent=err.message;}
}
input?.addEventListener('change',lookupGuest);
input?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();lookupGuest();}});
input?.addEventListener('input',()=>{
 lookupToken++;resetPreview();hint.textContent='Searching matching names… select a suggestion when it appears, or finish typing the full name.';
 clearTimeout(suggestionTimer);suggestionTimer=setTimeout(()=>updateSuggestions(input.value),250);
});

// Submit URL-encoded form data. no-cors avoids a browser preflight; the endpoint response is opaque,
// so the page reports that the request was sent, not that Google confirmed it.
document.getElementById('rsvp-form')?.addEventListener('submit',async e=>{
 e.preventDefault();
 if(!selectedGuest){message.textContent='Please search and select the exact full name of a registered group member first.';return;}
 const attendance=document.querySelector('input[name="attendance"]:checked');
 if(!attendance){message.textContent='Please select Joyfully accepts or Regretfully declines.';return;}
 const companions=[...companionList.querySelectorAll('.companion-row')]
  .filter(r=>r.querySelector('.companion-check').checked)
  .map(r=>r.querySelector('.companion-name').value.trim()).filter(Boolean);
 if(companions.length+1>selectedGuest.seats){message.textContent='The number of attendees exceeds your allocated seats.';return;}
 const status=attendance.value==='Joyfully accepts'?'Attending':'Declined';
 const names=status==='Attending'?[selectedGuest.name,...companions]:[];
 const payload=new URLSearchParams({groupId:String(selectedGuest.id),submittedBy:searchedMember,status,names:JSON.stringify(names)});
 const button=e.currentTarget.querySelector('button[type="submit"]');
 if(button)button.disabled=true;
 message.textContent='Sending your RSVP…';
 try{
  await fetch(API_URL,{method:'POST',mode:'no-cors',body:payload});
  message.textContent='Your RSVP request has been sent. Thank you! If you need to change your response, you may submit again using the same name.';
 }catch(err){
  message.textContent='We could not send your RSVP. Please check your internet connection and try again.';
 }finally{if(button)button.disabled=false;}
});
