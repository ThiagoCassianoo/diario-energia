const ENTRIES_KEY='diario-energia-entries', MUSICA_KEY='diario-energia-musica-perfil';
export async function loadEntries(){
  try{const r=await window.storage?.get(ENTRIES_KEY,false);return r&&r.value?JSON.parse(r.value):[]}
  catch(e){try{const r=localStorage.getItem(ENTRIES_KEY);return r?JSON.parse(r):[]}catch{return[]}}
}
export async function saveEntries(entries){
  try{if(window.storage)await window.storage.set(ENTRIES_KEY,JSON.stringify(entries),false);else localStorage.setItem(ENTRIES_KEY,JSON.stringify(entries))}
  catch(e){console.error(e)}
}
export async function loadMusica(){
  try{const r=await window.storage?.get(MUSICA_KEY,false);return r&&r.value?JSON.parse(r.value):[]}
  catch(e){try{const r=localStorage.getItem(MUSICA_KEY);return r?JSON.parse(r):[]}catch{return[]}}
}
export async function saveMusica(mp){
  try{if(window.storage)await window.storage.set(MUSICA_KEY,JSON.stringify(mp),false);else localStorage.setItem(MUSICA_KEY,JSON.stringify(mp))}
  catch(e){console.error(e)}
}
