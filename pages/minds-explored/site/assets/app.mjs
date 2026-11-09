import {escapeHTML as e,durationLabel,markdownLink} from './model.mjs';
import {search} from './search.mjs';
import {readState,saveState,toggleItem,mergeState,emptyState,validateState,STORAGE_KEY} from './state.mjs';
const appBase=new URL('../',import.meta.url).pathname;
const local=route=>appBase+route.replace(/^\//,'');
let storage;try{storage=window.localStorage;}catch{storage=null;}
let state=readState(storage),indexPromise,shown=20,lastResults=[],playlistResource=null;
const $=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)];
// Local QA observations only: no network reporting, storage, visitor tracking or public UI.
function diagnostic(name,value){if(['localhost','127.0.0.1'].includes(location.hostname))document.documentElement.dataset[name]=JSON.stringify(value);}
function notice(message){$('#notice').textContent=message;$('#notice').classList.add('visible');clearTimeout(notice.timer);notice.timer=setTimeout(()=>$('#notice').classList.remove('visible'),6500);}
function commit(next){try{state=saveState(storage,next);refreshControls();return true;}catch{notice('Browser storage is unavailable or full. Export your library before leaving this page.');state=next;refreshControls();return false;}}
async function getIndex(){if(!indexPromise){const start=performance.now();indexPromise=fetch(local('/data/index.json')).then(r=>{if(!r.ok)throw Error('The catalogue could not be loaded. Try again or browse the topic pages.');return r.json();}).then(data=>{diagnostic('atlasIndexMs',performance.now()-start);return data.records;}).catch(error=>{indexPromise=null;throw error;});}return indexPromise;}
function applyTheme(){document.documentElement.dataset.theme=state.theme;$('#theme-button').textContent=`Theme: ${state.theme}`;}
function refreshControls(){
  applyTheme();
  $$('[data-toggle]').forEach(button=>{const id=button.closest('[data-resource]')?.dataset.resource;if(id)button.setAttribute('aria-pressed',String(state[button.dataset.toggle].includes(id)));});
  $$('[data-path][data-step]').forEach(box=>box.checked=(state.pathProgress[box.dataset.path]??[]).includes(box.dataset.step));
  $$('[data-progress-summary]').forEach(el=>{const slug=el.dataset.progressSummary,total=$$('[data-path]').filter(x=>x.dataset.path===slug).length,done=(state.pathProgress[slug]??[]).length;el.textContent=`${Math.min(done,total)} of ${total} steps complete in this browser`;});
}
function download(name,content,type='application/json'){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
// Keep keyboard navigation inside either modal, including browsers that move
// focus to browser chrome after the last native dialog control.
document.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const dialog=event.target.closest('dialog[open]');if(!dialog)return;
  const controls=[...dialog.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')].filter(el=>el.tabIndex>=0&&!el.disabled&&!el.hidden&&el.getClientRects().length);
  const first=controls[0],last=controls.at(-1);if(!first)return;
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
function confirmAction(message,label='Continue'){
  return new Promise(resolve=>{const dialog=document.createElement('dialog');dialog.setAttribute('aria-labelledby','confirmation-heading');dialog.innerHTML=`<form method="dialog"><h2 id="confirmation-heading">${e(label)}</h2><p>${e(message)}</p><div class="button-row"><button value="cancel" autofocus>Cancel</button><button value="confirm" class="primary">${e(label)}</button></div></form>`;document.body.append(dialog);dialog.addEventListener('close',()=>{const accepted=dialog.returnValue==='confirm';dialog.remove();resolve(accepted);},{once:true});dialog.showModal();});
}
function resultRow(r,{library=false}={}){
  const extras=r.kind==='video'?`${e(r.provider??'')} · ${e(r.level==='unknown'?'Level unknown':r.level??'')} · ${e(durationLabel(r.durationSeconds))}`:e(r.kind);
  return `<li class="resource-row" data-id="${e(r.id)}"><div class="resource-main"><p class="eyebrow">${e(r.kind)}${r.coreChecked?' · Source-checked annotation':''}</p><h3><a href="${e(r.url)}">${e(r.title)}</a></h3><p class="meta">${extras}</p><p>${e(r.description??'')}</p>${r.matchReason?`<p class="match-reason">${e(r.matchReason)}${r.kind==='video'?` · ${r.qualified?'Access evidence checked':'Access not confirmed'}`:''}</p>`:''}${r.kind==='video'?`<div class="resource-actions" data-resource="${e(r.id)}"><button data-toggle="watchLater" aria-pressed="${state.watchLater.includes(r.id)}">Watch later</button><button data-toggle="liked" aria-pressed="${state.liked.includes(r.id)}">Like for my library</button><button data-add-playlist>Add to playlist</button>${library?`<button data-toggle="watched" aria-pressed="${state.watched.includes(r.id)}">Mark watched</button>`:''}<button data-toggle="hidden" aria-pressed="${state.hidden.includes(r.id)}">${state.hidden.includes(r.id)?'Show again':'Show less'}</button></div>`:''}</div></li>`;
}
function paintResults(){const target=$('#search-results');if(!target)return;target.innerHTML=lastResults.slice(0,shown).map(r=>resultRow(r)).join('');$('#more-results').hidden=lastResults.length<=shown;refreshControls();}
async function runSearch({updateURL=true}={}){
  const form=$('#search-form');if(!form)return;
  try{const records=await getIndex(),start=performance.now(),values=Object.fromEntries(new FormData(form)),{q='',sort='relevance',related='',...filters}=values;
    lastResults=search(records,q,{filters,sort:sort||'relevance',synonyms:related==='yes',diversify:related==='yes',communityWeight:related==='yes'?.12:0,hidden:state.hidden,likes:state.liked});shown=20;paintResults();
    diagnostic('atlasSearchMs',performance.now()-start);
    $('#search-status').textContent=lastResults.length?`${lastResults.length.toLocaleString('en-GB')} results. Showing ${Math.min(shown,lastResults.length)}. ${state.hidden.length?'Your “show less” choices are applied.':''}`:'No matching resources. Try fewer filters, a related term or browse a topic. Unknown metadata can also be selected.';
    if(updateURL){const params=new URLSearchParams(Object.entries(values).filter(([,v])=>v));history.replaceState(null,'',local('/search/')+(params.size?'?'+params.toString():''));}
  }catch(error){$('#search-status').textContent=error.message;$('#search-results').innerHTML=`<li><button id="retry-search">Try loading again</button> <a href="${local('/topics/')}">Browse topics</a></li>`;}
}
async function renderLibrary(){
  const el=$('#library-content');if(!el)return;
  try{const records=await getIndex(),map=new Map(records.map(r=>[r.id,r]));let missing=0;
    const rows=ids=>ids.map(id=>{const r=map.get(id);if(r)return resultRow(r,{library:true});missing++;return `<li class="resource-row"><div><p>Resource no longer in this catalogue: ${e(id)}</p><p class="meta">Your saved identifier is retained in exports.</p></div></li>`;}).join('');
    el.innerHTML=[['watchLater','Watch later'],['liked','Things you liked'],['watched','Marked watched'],['hidden','Shown less']].map(([key,title])=>`<section><div class="section-heading compact"><h2>${title}</h2><p>${state[key].length} saved</p></div><ol class="resource-list">${rows(state[key])||'<li class="empty-library">Nothing here yet. Use the controls on a resource page to make a collection.</li>'}</ol></section>`).join('')+`<section><h2>Your playlists</h2>${state.playlists.map(p=>`<article class="playlist"><h3>${e(p.name)}</h3><div class="button-row"><button data-export-playlist="${e(p.id)}">Export ordered list</button><button data-delete-playlist="${e(p.id)}">Remove playlist</button></div><ol class="resource-list">${rows(p.ids)}</ol></article>`).join('')||'<p>Add a resource to a playlist to begin.</p>'}</section><section><h2>Path progress</h2>${Object.entries(state.pathProgress).map(([slug,ids])=>`<p><a href="${local(`/paths/${encodeURIComponent(slug)}/`)}">${e(slug.replaceAll('-',' '))}</a>: ${ids.length} steps completed</p>`).join('')||'<p>Each path has a checkbox beside every step.</p>'}</section>`;
    $('#library-status').textContent=missing?`${missing} saved references are no longer in the current catalogue. Their identifiers are preserved.`:'';refreshControls();
  }catch(error){el.innerHTML=`<p>${e(error.message)}</p><button id="retry-library">Try again</button>`;}
}
function openPlaylist(id){playlistResource=id;const choice=$('#playlist-choice');choice.innerHTML='<option value="">Create a new playlist</option>'+state.playlists.map(p=>`<option value="${e(p.id)}">${e(p.name)}</option>`).join('');$('#playlist-name').value='';$('#playlist-dialog').showModal();}
$('#theme-button').addEventListener('click',()=>{const themes=['system','light','dark'];commit({...state,theme:themes[(themes.indexOf(state.theme)+1)%themes.length]});});
document.addEventListener('click',async event=>{
  const toggle=event.target.closest('[data-toggle]');
  if(toggle){const id=toggle.closest('[data-resource]').dataset.resource;commit(toggleItem(state,toggle.dataset.toggle,id));if(toggle.dataset.toggle==='hidden')await runSearch();await renderLibrary();return;}
  const add=event.target.closest('[data-add-playlist]');if(add){openPlaylist(add.closest('[data-resource]').dataset.resource);return;}
  if(event.target.id==='retry-search')runSearch();if(event.target.id==='retry-library')renderLibrary();
  const exp=event.target.closest('[data-export-playlist]');if(exp){const p=state.playlists.find(x=>x.id===exp.dataset.exportPlaylist),records=await getIndex(),map=new Map(records.map(r=>[r.id,r]));download('atlas-playlist.md',`# ${p.name}\n\n`+p.ids.map((id,i)=>{const r=map.get(id);return `${i+1}. ${r?markdownLink(r.title,r.sourceUrl??new URL(r.url,location.origin).href):id}`;}).join('\n'),'text/markdown');}
  const del=event.target.closest('[data-delete-playlist]');if(del&&await confirmAction('Remove this playlist from this browser? The saved videos and other playlists remain.','Remove playlist')){commit({...state,playlists:state.playlists.filter(p=>p.id!==del.dataset.deletePlaylist)});renderLibrary();}
});
$('#playlist-save').addEventListener('click',event=>{event.preventDefault();const choice=$('#playlist-choice').value,name=$('#playlist-name').value.trim(),playlists=structuredClone(state.playlists);if(choice){const p=playlists.find(x=>x.id===choice);if(!p.ids.includes(playlistResource))p.ids.push(playlistResource);}else{if(!name){$('#playlist-name').focus();$('#playlist-name').setCustomValidity('Give this playlist a name.');$('#playlist-name').reportValidity();return;}playlists.push({id:crypto.randomUUID(),name,ids:[playlistResource]});}commit({...state,playlists});$('#playlist-dialog').close();notice('Added to your browser-local playlist.');renderLibrary();});
$('#playlist-name').addEventListener('input',()=>$('#playlist-name').setCustomValidity(''));
document.addEventListener('change',event=>{const box=event.target.closest('[data-path][data-step]');if(!box)return;const ids=new Set(state.pathProgress[box.dataset.path]??[]);if(box.checked)ids.add(box.dataset.step);else ids.delete(box.dataset.step);commit({...state,pathProgress:{...state.pathProgress,[box.dataset.path]:[...ids]}});});
const form=$('#search-form');if(form){const params=new URLSearchParams(location.search);for(const [key,value] of params){const input=form.elements.namedItem(key);if(input){if(input.type==='checkbox')input.checked=value===input.value;else input.value=value;}}form.addEventListener('submit',event=>{event.preventDefault();runSearch();});form.addEventListener('change',()=>runSearch());let typing;$('#query').addEventListener('input',()=>{clearTimeout(typing);typing=setTimeout(()=>runSearch(),200);});form.addEventListener('reset',()=>setTimeout(()=>runSearch(),0));$('#more-results').addEventListener('click',()=>{shown+=20;paintResults();$('#search-status').textContent=`${lastResults.length} results. Showing ${Math.min(shown,lastResults.length)}.`;});await runSearch({updateURL:false});}
$('#export-library')?.addEventListener('click',()=>download('minds-explored-library.json',JSON.stringify(state,null,2)));
$('#import-library')?.addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>5_000_000)throw Error('This file is too large for an atlas library export.');const imported=validateState(JSON.parse(await file.text()));commit(mergeState(state,imported));$('#library-status').textContent='Library imported and merged. Existing saved items are preserved.';await renderLibrary();notice('Library imported and merged.');}catch(error){$('#library-status').textContent='Import failed: '+error.message;notice('Import failed. Your existing library has not changed.');}event.target.value='';});
$('#reset-library')?.addEventListener('click',async()=>{if(!await confirmAction('Reset all atlas saved items, playlists and path progress in this browser? Export first if you want a copy. This does not affect YouTube.','Reset library'))return;const theme=state.theme;try{storage.removeItem(STORAGE_KEY);}catch{}const saved=commit({...emptyState(),theme});renderLibrary();if(saved)notice('This browser’s atlas library has been reset.');});
if($('#library-content'))await renderLibrary();
const playerJSON=$('#player-data');if(playerJSON){
  const player=JSON.parse(playerJSON.textContent),expired=player.apiExpiresAt&&Date.parse(player.apiExpiresAt)<=Date.now();
  const rememberOpened=()=>{if(!state.opened.includes(player.id))commit({...state,opened:[...state.opened,player.id]});};
  if(expired){$$('[data-load-player],[data-load-thumbnail]').forEach(b=>b.disabled=true);notice('The YouTube metadata check needs refreshing. Use the original-source link.');}
  $('[data-load-player]')?.addEventListener('click',async()=>{
    if(expired||!player.embedUrl)return;
    if(!await confirmAction('This contacts YouTube or Vimeo and shares your IP address and browser information. By enabling this feature you agree to the provider terms linked on this page and acknowledge its privacy policy.','Load player'))return;
    const iframe=document.createElement('iframe');iframe.src=player.embedUrl;iframe.title=player.title;iframe.allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.addEventListener('error',()=>notice('The player could not load. Use Watch at source.'));$('[data-player]').replaceChildren(iframe);rememberOpened();
  });
  $('[data-load-alternative]')?.addEventListener('click',()=>{if(!player.alternativeUrl)return;const video=document.createElement('video');video.controls=true;video.preload='none';video.src=player.alternativeUrl;video.setAttribute('aria-label',player.title);video.addEventListener('error',()=>notice('The institutional player could not load this media. Use the original-source link.'));$('[data-player]').replaceChildren(video);rememberOpened();});
  $('[data-load-thumbnail]')?.addEventListener('click',async()=>{if(expired)return;if(!player.thumbnail){notice('No permitted thumbnail is established for this record.');return;}if(!await confirmAction('This loads the provider’s real thumbnail and sends your IP address and browser information to its image server.','Show thumbnail'))return;const img=document.createElement('img');img.src=player.thumbnail;img.alt=`Provider thumbnail for ${player.title}`;img.loading='lazy';img.addEventListener('error',()=>{$('[data-thumbnail]').textContent='Thumbnail unavailable. The source link remains available.';});$('[data-thumbnail]').replaceChildren(img);});
}
const correction=$('#correction-form');if(correction){correction.elements.resource.value=new URLSearchParams(location.search).get('resource')??'';correction.addEventListener('submit',event=>{event.preventDefault();const values=Object.fromEntries(new FormData(correction));download('atlas-correction.txt',`Evidence Press atlas correction\n\nResource: ${values.resource}\n\nIssue:\n${values.issue}\n\nSupporting source: ${values.source}\n`,'text/plain');notice('Correction note downloaded. No message has been sent.');});}
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY){state=readState(storage);refreshControls();renderLibrary();}});
refreshControls();
if(!storage)notice('Browser storage is unavailable. You can browse and export this session’s choices, but they will not persist.');
function recordNavigation(){requestAnimationFrame(()=>{const n=performance.getEntriesByType('navigation')[0];diagnostic('atlasNavigation',{userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight},domContentLoadedMs:n?.domContentLoadedEventEnd??null,loadMs:n?.loadEventEnd??null,resources:performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,encodedBytes:r.encodedBodySize,decodedBytes:r.decodedBodySize,transferBytes:r.transferSize,durationMs:r.duration}))});});}
if(document.readyState==='complete')recordNavigation();else window.addEventListener('load',recordNavigation,{once:true});
