import { MUSICA_MAP, TAG_COLOR, gerarSugestao, gerarSugestaoMusical } from './music.js';

const DIAS = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];

function periodo(date){
  const h = date.getHours();
  if(h < 12) return 'manhã';
  if(h < 18) return 'tarde';
  return 'noite';
}

function lerp(a,b,t){ return a + (b-a)*t; }
function humorColor(h){
  const t = (h-1)/4;
  const c1 = [184,97,90], c2 = [212,162,78];
  const r = Math.round(lerp(c1[0],c2[0],t));
  const g = Math.round(lerp(c1[1],c2[1],t));
  const b = Math.round(lerp(c1[2],c2[2],t));
  return `rgb(${r},${g},${b})`;
}

export function renderCuradoria(){
  const box = document.getElementById('curadoria');
  const ordem = ['baixa_baixa','media','alta_baixa','alta_alta','baixa_alta','comfort'];
  const labels = {
    baixa_baixa:'Esgotado física e mentalmente',
    media:'Energia mediana, neutro',
    alta_baixa:'Mente afiada, corpo cansado',
    alta_alta:'Energia alta nos dois',
    baixa_alta:'Mente cansada, corpo disposto',
    comfort:'Humor pesado, precisa de colo'
  };
  box.innerHTML = ordem.map(k=>{
    const m = MUSICA_MAP[k];
    return `<div class="curadoria-item"><span class="nome">${labels[k]}</span><span class="ex">${m.exemplos.join(', ')}</span></div>`;
  }).join('');
}

export function renderMusicaChips(musicaPerfil){
  const box = document.getElementById('musica-chips');
  if(musicaPerfil.length === 0){
    box.innerHTML = '';
    return;
  }
  box.innerHTML = musicaPerfil.slice().reverse().map(m=>
    `<span class="chip"><span class="chip-dot" style="background:${TAG_COLOR[m.tag]||TAG_COLOR.outro}"></span>${m.nome}<span class="rm" data-id="${m.id}">×</span></span>`
  ).join('');
  box.querySelectorAll('.rm').forEach(el=>{
    el.addEventListener('click', ()=>{
      const id = Number(el.dataset.id);
      window.dispatchEvent(new CustomEvent('remove-musica', { detail: id }));
    });
  });
}

export function renderRede(entries){
  const container = document.getElementById('rede-container');
  if(entries.length < 2){
    container.innerHTML = entries.length === 0
      ? '<p class="empty">Ainda sem registros. A linha aparece aqui conforme você for descarregando — sobe quando sua energia sobe, afunda quando você está mais esgotado.</p>'
      : '<p class="empty">Mais um registro e a rede começa a tomar forma.</p>';
    return;
  }
  const last = entries.slice(-14);
  const w = 440, h = 130, padX = 16, padY = 22;
  const n = last.length;
  const pts = last.map((e,i)=>{
    const x = padX + (i/(n-1)) * (w - padX*2);
    const score = (e.fisica + e.mental) / 2;
    const y = padY + (1 - (score-1)/4) * (h - padY*2);
    return {x, y, humor: e.humor};
  });
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for(let i=1;i<pts.length;i++){
    const p0 = pts[i-1], p1 = pts[i];
    const mx = (p0.x+p1.x)/2;
    d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  const dots = pts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${humorColor(p.humor)}" stroke="#1B2233" stroke-width="1.5"/>`).join('');
  container.innerHTML = `<svg class="rede-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <path d="${d}" fill="none" stroke="var(--rope)" stroke-width="2" stroke-linecap="round"/>
    ${dots}
  </svg>`;
}

export function renderInsights(entries){
  const box = document.getElementById('insights');
  if(entries.length < 5){
    box.innerHTML = '<p class="empty">Com uns 5 registros já dá pra começar a ver tendência de horário e dia da semana.</p>';
    return;
  }
  const porPeriodo = {}, porDia = {};
  entries.forEach(e=>{
    const d = new Date(e.ts);
    const p = periodo(d), dia = DIAS[d.getDay()];
    (porPeriodo[p] = porPeriodo[p]||[]).push(e);
    (porDia[dia] = porDia[dia]||[]).push(e);
  });
  const avg = (arr, key) => arr.reduce((s,e)=>s+e[key],0)/arr.length;
  const insights = [];
  const periodos = Object.keys(porPeriodo).filter(p=>porPeriodo[p].length>=2);
  if(periodos.length){
    let pior = periodos[0];
    periodos.forEach(p=>{ if(avg(porPeriodo[p],'mental') < avg(porPeriodo[pior],'mental')) pior = p; });
    insights.push(`Sua energia mental costuma estar mais baixa à ${pior} (média ${avg(porPeriodo[pior],'mental').toFixed(1)}/5).`);
  }
  const dias = Object.keys(porDia).filter(d=>porDia[d].length>=2);
  if(dias.length){
    let piorDia = dias[0];
    dias.forEach(d=>{ if(avg(porDia[d],'humor') < avg(porDia[piorDia],'humor')) piorDia = d; });
    insights.push(`${piorDia.charAt(0).toUpperCase()+piorDia.slice(1)} costuma ter o humor mais baixo entre os dias registrados.`);
  }
  insights.push(`Humor médio geral até agora: ${avg(entries,'humor').toFixed(1)}/5, com base em ${entries.length} registros.`);
  box.innerHTML = insights.map(t=>`<p class="insight">${t}</p>`).join('');
}

export function renderList(entries){
  const list = document.getElementById('entry-list');
  if(entries.length === 0){
    list.innerHTML = '<p class="empty">Nada por aqui ainda.</p>';
    return;
  }
  const last = entries.slice(-6).reverse();
  list.innerHTML = last.map(e=>{
    const d = new Date(e.ts);
    const dataStr = `${DIAS[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')} · ${periodo(d)}`;
    return `<div class="entry">
      <div class="meta">
        <span>${dataStr}</span>
        <span class="dots">
          <span class="dot" style="background:var(--accent-fisica)" title="física ${e.fisica}"></span>
          <span class="dot" style="background:var(--accent-mental)" title="mental ${e.mental}"></span>
          <span class="dot" style="background:${humorColor(e.humor)}" title="humor ${e.humor}"></span>
        </span>
      </div>
      ${e.texto ? `<div class="txt">${e.texto.replace(/</g,'&lt;')}</div>` : ''}
    </div>`;
  }).join('');
}

export function showResult(modo, fisica, mental, humor, musicaPerfil){
  const resultado = document.getElementById('resultado');
  const tag = document.getElementById('resultado-tag');
  const rtexto = document.getElementById('resultado-texto');
  const musicaLinha = document.getElementById('musica-linha');
  const musicaTexto = document.getElementById('musica-texto');

  if(modo === 'sugestao'){
    tag.textContent = 'sugestão';
    rtexto.textContent = gerarSugestao(fisica, mental, humor);
    musicaLinha.style.display = 'none';
  } else if(modo === 'musica'){
    tag.textContent = 'registrado';
    rtexto.textContent = 'Guardado.';
    musicaTexto.textContent = gerarSugestaoMusical(fisica, mental, humor, musicaPerfil);
    musicaLinha.style.display = 'block';
  } else {
    tag.textContent = 'registrado';
    rtexto.textContent = 'Guardado. Sem pressa pra decidir nada agora — quando quiser uma sugestão, é só pedir.';
    musicaLinha.style.display = 'none';
  }
  resultado.classList.add('show');
}
