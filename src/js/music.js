export const MUSICA_MAP = {
  baixa_baixa: {tag:'calmo', estilo:'orquestral suave, ambient ou piano solo', exemplos:['trilhas orquestrais calmas','ambient minimalista','piano solo']},
  baixa_alta:  {tag:'animado', estilo:'ritmado mas leve, sem exigir atenção', exemplos:['indie pop instrumental','funk suave','lo-fi com batida']},
  alta_baixa:  {tag:'foco', estilo:'instrumental de foco, sem letra pesada', exemplos:['lo-fi beats','clássico leve','jazz instrumental']},
  alta_alta:   {tag:'animado', estilo:'energético, bom pra trabalho profundo', exemplos:['eletrônica leve','indie rock','synthwave']},
  media:       {tag:'calmo', estilo:'neutro, indie/pop calmo', exemplos:['indie pop','soft rock','acústico']},
  comfort:     {tag:'triste', estilo:'dream pop / sad girl indie / orquestra emocional', exemplos:['Lana Del Rey','Beach House','Cigarettes After Sex']}
};

export const TAG_COLOR = {calmo:'#8FA9C7', triste:'#B79FD1', foco:'#7FA88F', animado:'#D4A24E', orquestral:'#B8615A', outro:'#9AA3BD'};

export function combo(fisica, mental){
  if(mental<=2 && fisica<=2) return 'baixa_baixa';
  if(mental<=2 && fisica>=4) return 'baixa_alta';
  if(mental>=4 && fisica<=2) return 'alta_baixa';
  if(mental>=4 && fisica>=4) return 'alta_alta';
  return 'media';
}

export function gerarSugestao(fisica, mental, humor){
  let base = '';
  if(mental <= 2 && fisica <= 2){
    base = 'Corpo e mente pedindo pausa de verdade. Nada de tela exigente agora — rede, música baixa ou dormir é a decisão mais produtiva que existe.';
  } else if(mental <= 2 && fisica >= 4){
    base = 'Mente cansada mas corpo com energia sobrando — bom momento pra algo físico e mecânico (organizar algo, caminhar, tarefa manual), não pra decisão ou código.';
  } else if(mental >= 4 && fisica <= 2){
    base = 'Cabeça afiada mas corpo pedindo repouso — aproveite sentado: leitura, planejamento, um jogo mais estratégico e calmo.';
  } else if(mental >= 4 && fisica >= 4){
    base = 'Energia alta nos dois — janela boa pra trabalho profundo: código, estudo, o que exige mais de você agora.';
  } else {
    base = 'Energia mediana nos dois — dá pra tarefa leve/rotineira, sem forçar nada mais pesado.';
  }
  if(humor <= 2){
    base += ' O humor está pesado hoje — se o corpo aguentar, algo que aconchegue mais que resolva (chamar alguém, igreja, um jogo sem pressão) pode pesar mais que qualquer tarefa da lista.';
  }
  return base;
}

export function gerarSugestaoMusical(fisica, mental, humor, musicaPerfil){
  const key = humor <= 2 ? 'comfort' : combo(fisica, mental);
  const base = MUSICA_MAP[key];
  const doPerfil = musicaPerfil.filter(m => m.tag === base.tag);
  let texto = `Clima pra agora: ${base.estilo}.`;
  if(doPerfil.length){
    const nomes = doPerfil.slice(-3).map(m=>m.nome).join(', ');
    texto += ` Do seu perfil, combina: ${nomes}.`;
  } else {
    texto += ` Pra explorar: ${base.exemplos.join(', ')}.`;
  }
  return texto;
}
