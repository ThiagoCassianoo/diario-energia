import { loadEntries, saveEntries, loadMusica, saveMusica } from './storage.js';
import { initConstellation, updateConstellation } from './particles.js';
import { renderCuradoria, renderMusicaChips, renderInsights, renderList, showResult } from './ui.js';
import gsap from 'gsap';
let entries=[],musicaPerfil=[];
const $=id=>document.getElementById(id);
const sFisica=$('s-fisica'),sMental=$('s-mental'),sHumor=$('s-humor');
function animateEntrance(){
  gsap.to('.hero-title',{opacity:1,y:0,duration:1.2,ease:'power3.out',delay:0.2});
  gsap.to('.hero-sub',{opacity:1,y:0,duration:1,ease:'power3.out',delay:0.5});
  gsap.to('.eyebrow',{opacity:1,y:0,duration:0.8,ease:'power3.out',delay:0.1});
  gsap.to('.card',{opacity:1,y:0,duration:0.9,ease:'power3.out',stagger:0.12,delay:0.6});
}
[['s-fisica','v-fisica'],['s-mental','v-mental'],['s-humor','v-humor']].forEach(([s,v])=>{
  $(s).addEventListener('input',()=>{$(v).textContent=$(s).value;gsap.to($(v),{scale:1.2,duration:0.15,yoyo:true,repeat:1,ease:'power2.out'})});
});
async function init(){
  entries=await loadEntries();musicaPerfil=await loadMusica();
  initConstellation('constellation-container');updateConstellation(entries);
  renderAll();animateEntrance();
}
function renderAll(){renderInsights(entries);renderList(entries);renderMusicaChips(musicaPerfil);renderCuradoria();updateConstellation(entries)}
function registrar(modo){
  const fisica=Number(sFisica.value),mental=Number(sMental.value),humor=Number(sHumor.value);
  const texto=$('texto').value.trim();
  const entry={id:Date.now(),ts:new Date().toISOString(),fisica,mental,humor,texto};
  entries.push(entry);saveEntries(entries);
  showResult(modo,fisica,mental,humor,musicaPerfil);$('texto').value='';renderAll();
  gsap.from('.entry:first-child',{x:-20,opacity:0,duration:0.5,ease:'power2.out'});
}
$('btn-registrar').addEventListener('click',()=>registrar('registrar'));
$('btn-sugerir').addEventListener('click',()=>registrar('sugestao'));
$('btn-musica').addEventListener('click',()=>registrar('musica'));
$('btn-add-musica').addEventListener('click',()=>{
  const nome=$('musica-nome').value.trim();if(!nome)return;
  const tagSel=$('musica-tag').value;
  musicaPerfil.push({id:Date.now(),nome,tag:tagSel,ts:new Date().toISOString()});
  saveMusica(musicaPerfil);$('musica-nome').value='';renderMusicaChips(musicaPerfil);
  gsap.from('#musica-chips .chip:first-child',{scale:0.8,opacity:0,duration:0.4,ease:'back.out(1.7)'});
});
window.addEventListener('remove-musica',(e)=>{musicaPerfil=musicaPerfil.filter(m=>m.id!==e.detail);saveMusica(musicaPerfil);renderMusicaChips(musicaPerfil)});
init();
