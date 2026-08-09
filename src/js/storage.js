const ENTRIES_KEY = 'diario-energia-entries';
const MUSICA_KEY = 'diario-energia-musica-perfil';

export async function loadEntries() {
  try {
    const res = await window.storage?.get(ENTRIES_KEY, false);
    return res && res.value ? JSON.parse(res.value) : [];
  } catch (e) {
    // Fallback para localStorage padrão
    try {
      const raw = localStorage.getItem(ENTRIES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
}

export async function saveEntries(entries) {
  try {
    if (window.storage) {
      await window.storage.set(ENTRIES_KEY, JSON.stringify(entries), false);
    } else {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    }
  } catch (e) { console.error('Falha ao salvar entradas', e); }
}

export async function loadMusica() {
  try {
    const res = await window.storage?.get(MUSICA_KEY, false);
    return res && res.value ? JSON.parse(res.value) : [];
  } catch (e) {
    try {
      const raw = localStorage.getItem(MUSICA_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
}

export async function saveMusica(musicaPerfil) {
  try {
    if (window.storage) {
      await window.storage.set(MUSICA_KEY, JSON.stringify(musicaPerfil), false);
    } else {
      localStorage.setItem(MUSICA_KEY, JSON.stringify(musicaPerfil));
    }
  } catch (e) { console.error('Falha ao salvar perfil musical', e); }
}
