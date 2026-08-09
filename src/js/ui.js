import{MUSICA_MAP,TAG_COLOR,gerarSugestao,gerarSugestaoMusical}from'./music.js';
const DIAS=['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
function periodo(d){const h=d.getHours();if(h<12)return'manhã';if(h<18)return'tarde';return'noite'}
function lerp(a,b,t){return a+(b-a)*t}
function humorColor(h){const t=(h-1)/4,c1=[184,97,90],c2=[212,162,78];return`rgb(${Math.round(lerp(c1[0],c2[0],t))},${Math.round(lerp(c1[1],c2[1],t))},${Math.round(lerp(c1[2],c2[2],t))})`}
export function renderCuradoria(){
  const box=document.getElementById('curadoria');
  const ordem=['baixa_baixa','media','alta_baixa','alta_alta','baixa_alta','comfort'];
  const labels={baixa_baixa:'Esgotado física e mentalmente',media:'Energia mediana, neutro',alta_baixa:'Mente afiada, corpo cansado',alta_alta:'Energia alta nos dois',baixa_alta:'Mente cansada, corpo disposto',comfort:'Humor pesado, precisa de colo'};
  box.innerHTML=ordem.map(k=>{const m=MUSICA_MAP[k];return`<div class="curadoria-item"><span class="nome">${labels[k]}</span><span class="ex">${m.exemplos.join(', ')}</span></div>`}).join('');
}
export function renderMusicaChips(mp){
  const box=document.getElementById('musica-chips');
  if(!mp.length){box.innerHTML='';return}
  box.innerHTML=mp.slice().reverse().map(m=>`<span class="chip"><span class="chip-dot" style="background:${TAG_COLOR[m.tag]||TAG_COLOR.outro}"></span>${m.nome}<span class="rm" data-id="${m.id}">×</span></span>`).join('');
  box.querySelectorAll('.rm').forEach(el=>el.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('remove-musica',{detail:Number(el.dataset.id)}))));
}
export function renderInsights(entries){
  const box=document.getElementById('insights');
  if(entries.length<5){box.innerHTML='<p class="empty">Com uns 5 registros já dá pra começar a ver tendências.</p>';return}
  const pp={},pd={};entries.forEach(e=>{const d=new Date(e.ts),p=periodo(d),dia=DIAS[d.getDay()];(pp[p]=pp[p]||[]).push(e);(pd[dia]=pd[dia]||[]).push(e)});
  const avg=(a,k)=>a.reduce((s,e)=>s+e[k],0)/a.length;
  const ins=[];
  const pers=Object.keys(pp).filter(p=>pp[p].length>=2);
  if(pers.length){let pior=pers[0];pers.forEach(p=>{if(avg(pp[p],'mental')<avg(pp[pior],'mental'))pior=p});ins.push(`Sua energia mental costuma estar mais baixa à ${pior} (média ${avg(pp[pior],'mental').toFixed(1)}/5).`)}
  const dias=Object.keys(pd).filter(d=>pd[d].length>=2);
  if(dias.length){let piorDia=dias[0];dias.forEach(d=>{if(avg(pd[d],'humor')<avg(pd[piorDia],'humor'))piorDia=d});ins.push(`${piorDia.charAt(0).toUpperCase()+piorDia.slice(1)} costuma ter o humor mais baixo.`)}
  ins.push(`Humor médio geral: ${avg(entries,'humor').toFixed(1)}/5, com ${entries.length} registros.`);
  box.innerHTML=ins.map(t=>`<p class="insight">${t}</p>`).join('');
}
export function renderList(entries){
  const list=document.getElementById('entry-list');
  if(!entries.length){list.innerHTML='<p class="empty">Nada por aqui ainda.</p>';return}
  list.innerHTML=entries.slice(-6).reverse().map(e=>{
    const d=new Date(e.ts);
    return`<div class="entry"><div class="meta"><span>${DIAS[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')} · ${periodo(d)}</span><span class="dots"><span class="dot" style="background:var(--accent-fisica)" title="física ${e.fisica}"></span><span class="dot" style="background:var(--accent-mental)" title="mental ${e.mental}"></span><span class="dot" style="background:${humorColor(e.humor)}" title="humor ${e.humor}"></span></span></div>${e.texto?`<div class="txt">${e.texto.replace(/</g,'&lt;')}</div>`:''}</div>`
  }).join('');
}
export function showResult(modo,f,m,h,mp){
  const res=document.getElementById('resultado'),tag=document.getElementById('resultado-tag'),rt=document.getElementById('resultado-texto'),ml=document.getElementById('musica-linha'),mt=document.getElementById('musica-texto');
  res.classList.remove('show');void res.offsetWidth;
  if(modo==='sugestao'){tag.textContent='sugestão';rt.textContent=gerarSugestao(f,m,h);ml.style.display='none'}
  else if(modo==='musica'){tag.textContent='registrado';rt.textContent='Guardado.';mt.textContent=gerarSugestaoMusical(f,m,h,mp);ml.style.display='block'}
  else{tag.textContent='registrado';rt.textContent='Guardado. Sem pressa pra decidir nada agora.';ml.style.display='none'}
  res.classList.add('show');
}
