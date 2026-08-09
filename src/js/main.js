import { loadEntries, saveEntries, loadMusica, saveMusica } from './storage.js';
import { initConstellation, updateConstellation } from './particles.js';
import { renderCuradoria, renderMusicaChips, renderInsights, renderList, showResult } from './ui.js';
import gsap from 'gsap';
let entries=[],musicaPerfil=[];
const $=id=>document.getElementById(id);
const sFisica=$('s-fisica'),sMental=$('s-mental'),sHumor=$('s-humor');

function animateEntrance(){
  gsap.to('.hero-title',{opacity:1,y:0,duration:1.4,ease:'power3.out',delay:0.2});
  gsap.to('.hero-sub',{opacity:1,y:0,duration:1.1,ease:'power3.out',delay:0.6});
  gsap.to('.eyebrow',{opacity:1,y:0,duration:0.9,ease:'power3.out',delay:0.1});
  gsap.to('.card',{opacity:1,y:0,rotateX:0,duration:1,ease:'power3.out',stagger:0.15,delay:0.8});
}

[['s-fisica','v-fisica'],['s-mental','v-mental'],['s-humor','v-humor']].forEach(([s,v])=>{
  $(s).addEventListener('input',()=>{$(v).textContent=$(s).value;gsap.to($(v),{scale:1.2,duration:0.15,yoyo:true,repeat:1,ease:'power2.out'})});
});

// Card 3D tilt on mouse
document.querySelectorAll('.card-3d').forEach(card=>{
  card.addEventListener('mousemove',(e)=>{
    const rect=card.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width-0.5;
    const y=(e.clientY-rect.top)/rect.height-0.5;
    gsap.to(card,{rotateY:x*6,rotateX:-y*6,duration:0.4,ease:'power2.out'});
  });
  card.addEventListener('mouseleave',()=>{
    gsap.to(card,{rotateY:0,rotateX:0,duration:0.6,ease:'power2.out'});
  });
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
  gsap.from('.entry:first-child',{x:-30,opacity:0,duration:0.6,ease:'power3.out'});
}
$('btn-registrar').addEventListener('click',()=>registrar('registrar'));
$('btn-sugerir').addEventListener('click',()=>registrar('sugestao'));
$('btn-musica').addEventListener('click',()=>registrar('musica'));
$('btn-add-musica').addEventListener('click',()=>{
  const nome=$('musica-nome').value.trim();if(!nome)return;
  const tagSel=$('musica-tag').value;
  musicaPerfil.push({id:Date.now(),nome,tag:tagSel,ts:new Date().toISOString()});
  saveMusica(musicaPerfil);$('musica-nome').value='';renderMusicaChips(musicaPerfil);
  gsap.from('#musica-chips .chip:first-child',{scale:0.7,opacity:0,duration:0.5,ease:'back.out(1.7)'});
});
window.addEventListener('remove-musica',(e)=>{musicaPerfil=musicaPerfil.filter(m=>m.id!==e.detail);saveMusica(musicaPerfil);renderMusicaChips(musicaPerfil)});
init();
