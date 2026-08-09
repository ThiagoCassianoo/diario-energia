# 🌌 Diário de Energia

> App pessoal para registrar como você está se sentindo — com o tempo, o painel revela padrões, sugere atividades e indica o som que combina com cada momento.

---

## ✨ O que já funciona (nível 1)

- [x] Registro de energia física, mental e humor via sliders
- [x] Texto livre opcional
- [x] Sugestão de atividade baseada no estado atual
- [x] Sugestão musical personalizada
- [x] Perfil musical próprio (adicionar estilos/artistas)
- [x] Rede visual dos últimos registros
- [x] Insights automáticos (tendências por horário e dia)
- [x] Histórico de registros
- [x] Dados salvos localmente no navegador

---

## 🚀 Roadmap

| Nível | Nome | Descrição | Status |
|-------|------|-----------|--------|
| 1 | Espelho Básico | Sliders, cards, música | ✅ Pronto |
| 2 | Campo de Partículas | Canvas 2D/3D que reage aos sliders em tempo real | 🔨 Em breve |
| 3 | Constelação Emocional | Histórico como céu 3D navegável | 📋 Planejado |
| 4 | Fluido Emocional | Shader de fluido que acumula registros como gotas de cor | 📋 Planejado |

---

## 🛠️ Como rodar localmente

### Opção 1: Apenas HTML (mais simples)
Abra o arquivo `index.html` diretamente no navegador. Funciona 100% offline.

### Opção 2: Com servidor local (recomendado para desenvolvimento)
```bash
# Usando Node.js + Vite
npm install
npm run dev

# Ou com Python
python -m http.server 8080
# Acesse http://localhost:8080
```

---

## 📁 Estrutura do projeto

```
diario-energia/
├── index.html              # Página principal
├── package.json            # Dependências (opcional)
├── .gitignore              # Arquivos ignorados pelo Git
├── README.md               # Este arquivo
├── src/
│   ├── css/
│   │   └── style.css       # Estilos globais
│   ├── js/
│   │   ├── main.js         # Ponto de entrada
│   │   ├── storage.js      # Gerenciamento de dados locais
│   │   ├── ui.js           # Renderização da interface
│   │   ├── particles.js    # Canvas de partículas (nível 2)
│   │   └── music.js        # Lógica musical e curadoria
│   └── assets/
│       └── (ícones, fontes, imagens)
```

---

## 🎨 Stack planejada

- **HTML5 + CSS3** — base sólida
- **Vanilla JavaScript** — sem frameworks pesados
- **Canvas 2D / WebGL** — partículas e visualizações
- **Three.js** — constelação 3D (nível 3)
- **GSAP** — animações suaves (scroll, transições)
- **Vite** — dev server rápido (opcional)

---

## 🔒 Privacidade

Todos os dados ficam **apenas no seu navegador** (localStorage). Nada é enviado pra nuvem. Seu diário é seu.

---

## 📝 Notas pessoais

Este é um projeto **pessoal e terapêutico**. A ideia nasceu da necessidade de organizar a cabeça e transformar sentimentos em algo visual e bonito. Cada linha de código é também um ato de cuidado comigo mesmo.

---

*Feito com calma, para usar com calma.*
