# Landing page: Meta Escola Técnica

Site estático em HTML, CSS e JavaScript puros (sem etapa de build), pronto para o Firebase Hosting.

## Estrutura

```
meta-landing/
├── firebase.json         Configuração do Firebase Hosting (pasta pública, cache, cabeçalhos)
├── .firebaserc           ID do projeto Firebase
├── .gitignore
├── README.md
└── public/               Tudo o que vai para o ar
    ├── index.html        Conteúdo e estrutura (sem estilo nem script embutido)
    ├── 404.html          Página de "não encontrada"
    ├── css/
    │   ├── base.css          Variáveis de marca, reset e tipografia global
    │   ├── layout.css        Contêiner, seções e grades
    │   ├── components.css    Botões, cartões, etiquetas, passos, FAQ
    │   └── sections.css      Cabeçalho, hero, números, chamada final, rodapé, 404
    ├── js/
    │   ├── config.js         Número do WhatsApp e textos das mensagens
    │   ├── whatsapp.js       Monta os links wa.me a partir dos data-* do HTML
    │   ├── tracking.js       Evento de conversão no clique (GTM/GA4 e Meta Pixel)
    │   ├── floating-cta.js   Esconde o botão flutuante quando outro botão principal está na tela
    │   ├── header.js         Reforça o efeito de vidro do cabeçalho fixo ao rolar
    │   └── main.js           Inicialização
    └── assets/img/       Logo, fotos e ícones do site
        └── professores/  Fotos do corpo docente
```

Ícones: Font Awesome Free 6.5.2, carregado pelo cdnjs (`fa-brands fa-whatsapp` e `fa-solid fa-check`).

## Publicar no Firebase

Pré-requisitos: Node.js instalado e um projeto criado em https://console.firebase.google.com.

```bash
npm install -g firebase-tools     # uma vez
firebase login                    # uma vez
```

1. Em `.firebaserc`, troque `SEU-PROJETO-FIREBASE` pelo ID do seu projeto
   (ou rode `firebase use --add` e escolha o projeto).
2. Teste localmente:
   ```bash
   firebase emulators:start --only hosting     # abre em http://localhost:5000
   ```
3. Publique:
   ```bash
   firebase deploy --only hosting
   ```
   O site fica em `https://SEU-PROJETO.web.app`. Para usar um domínio próprio,
   vá em Console → Hosting → Adicionar domínio personalizado.

Para mostrar uma versão a alguém antes de publicar:
```bash
firebase hosting:channel:deploy previa --expires 7d
```

### Cache configurado em `firebase.json`

| Arquivos | Cache |
| --- | --- |
| HTML | sempre revalida (alterações aparecem na hora) |
| CSS e JS | 1 hora |
| Imagens | 7 dias (ao trocar uma foto, troque também o nome do arquivo) |

## Como alterar

| O que | Onde |
| --- | --- |
| Número do WhatsApp ou mensagens | `public/js/config.js` (e o `href` de reserva no `index.html`) |
| Textos, cursos, perguntas | `public/index.html` |
| Cores, fontes, espaçamentos | variáveis no topo de `public/css/base.css` |
| Fotos | `public/assets/img/` |

## Botões de WhatsApp

Qualquer link com `data-whatsapp` recebe a mensagem pré-preenchida:

```html
<a href="https://wa.me/5531936184286" data-whatsapp data-message="vaga" data-origin="hero">
  <i class="fa-brands fa-whatsapp icon" aria-hidden="true"></i> Quero minha vaga
</a>
<a href="https://wa.me/5531936184286" data-whatsapp data-course="Técnico em Enfermagem">…</a>
```

`data-origin` identifica o botão no evento de conversão.

## Pendências antes de publicar

- Substituir `[ENDEREÇO DA UNIDADE]` (duas ocorrências no `index.html`).
- Seção de professores: trocar os textos entre colchetes (nome, titulação, formação, experiência, registro) pelos dados reais e as fotos em `assets/img/professores/` (formato retrato 4:5, ex.: 800×1000). Preencher também os três números do corpo docente.
- Confirmar o selo "Matrículas abertas" no topo.
- Trocar o ID do projeto em `.firebaserc`.
- Instalar o Meta Pixel e/ou Google Tag Manager no `<head>`; o `tracking.js` passa a enviar os cliques automaticamente.
- Depois de publicar, trocar `og:image` no `index.html` pelo endereço completo (ex.: `https://seudominio.com.br/assets/img/fachada.jpg`), para a prévia do link aparecer no WhatsApp e nas redes.
