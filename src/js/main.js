import { loadEntries, saveEntries, loadMusica, saveMusica } from './storage.js';
import { startParticles, updateState, stopParticles } from './particles.js';
import { renderCuradoria, renderMusicaChips, renderRede, renderInsights, renderList, showResult } from './ui.js';

let entries = [];
let musicaPerfil = [];

const $ = id => document.getElementById(id);
const sFisica = $('s-fisica'), sMental = $('s-mental'), sHumor = $('s-humor');

// Atualiza valores dos sliders na tela
[['s-fisica','v-fisica'],['s-mental','v-mental'],['s-humor','v-humor']].forEach(([s,v])=>{
  $(s).addEventListener('input', ()=> {
    $(v).textContent = $(s).value;
    updateParticlesFromSliders();
  });
});

function updateParticlesFromSliders(){
  const fisica = Number(sFisica.value);
  const mental = Number(sMental.value);
  const humor = Number(sHumor.value);
  updateState(fisica, mental, humor);
}

async function init(){
  entries = await loadEntries();
  musicaPerfil = await loadMusica();
  renderAll();
  startParticles();
  updateParticlesFromSliders();
}

function renderAll(){
  renderRede(entries);
  renderInsights(entries);
  renderList(entries);
  renderMusicaChips(musicaPerfil);
  renderCuradoria();
}

function registrar(modo){
  const fisica = Number(sFisica.value), mental = Number(sMental.value), humor = Number(sHumor.value);
  const texto = $('texto').value.trim();
  const entry = { id: Date.now(), ts: new Date().toISOString(), fisica, mental, humor, texto };
  entries.push(entry);
  saveEntries(entries);

  showResult(modo, fisica, mental, humor, musicaPerfil);
  $('texto').value = '';
  renderAll();
}

$('btn-registrar').addEventListener('click', ()=>registrar('registrar'));
$('btn-sugerir').addEventListener('click', ()=>registrar('sugestao'));
$('btn-musica').addEventListener('click', ()=>registrar('musica'));

$('btn-add-musica').addEventListener('click', ()=>{
  const nome = $('musica-nome').value.trim();
  if(!nome) return;
  const tagSel = $('musica-tag').value;
  musicaPerfil.push({id: Date.now(), nome, tag: tagSel, ts: new Date().toISOString()});
  saveMusica(musicaPerfil);
  $('musica-nome').value = '';
  renderMusicaChips(musicaPerfil);
});

window.addEventListener('remove-musica', (e)=>{
  musicaPerfil = musicaPerfil.filter(m=>m.id!==e.detail);
  saveMusica(musicaPerfil);
  renderMusicaChips(musicaPerfil);
});

init();
