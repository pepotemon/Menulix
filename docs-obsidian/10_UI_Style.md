# 10 - UI, Componentes e Estilo

> Referencia visual do Menulix baseada no codigo atual.
> Ultima atualizacao: 2026-06-23
> Relacionado: [[02_Architecture]] | [[03_Decisions]] | [[05_Ideas]]

---

## Principios

- O painel deve ser simples para pessoas com pouca familiaridade com software.
- Cada tela prioriza uma acao principal clara.
- Formularios complexos usam etapas e salvamento explicito.
- A interface administrativa usa portugues do Brasil e espanhol via `lib/i18n.ts`.
- O cardapio publico e mobile-first, rapido e personalizavel por restaurante.
- IDs e outros conceitos tecnicos nunca aparecem para o usuario.

---

## Identidade Visual

### Paleta base do painel

| Token | Hex | Uso |
|---|---|---|
| `leaf` | `#1F8A70` | Acao principal, item ativo, foco e sucesso |
| `tomato` | `#D94E35` | Erros, exclusao, restaurante fechado |
| `cream` | `#FFF7EC` | Fundo geral e fundo suave de campos |
| `white` | `#FFFFFF` | Superficies, paineis e modais |
| `line` | `#E7E2D8` | Bordas e divisores |
| `ink` | `#1E2528` | Texto principal e hover escuro |
| `ink/68` | opacidade 68% | Texto secundario |
| `ink/50` | opacidade 50% | Metadados e texto auxiliar |

O cardapio publico recebe quatro cores por restaurante:
`--restaurant-primary`, `--restaurant-secondary`, `--restaurant-bg` e
`--restaurant-text`. Os tokens fixos continuam sendo usados em superficies,
bordas e textos neutros.

### Tipografia

- Familia: Inter, `ui-sans-serif`, `system-ui`, `-apple-system`, Segoe UI.
- Escala usada: 12, 14, 16, 18, 20, 24, 30 e 48 px.
- Pesos: 400, 500, 600, 700 e 900.
- Titulos administrativos: 24 px no mobile e 30 px a partir de `sm`.
- Titulos internos de paineis: 18 px.
- Corpo principal: 14 px com `line-height` de 24 px quando ha descricao.
- Nao usar letter spacing negativo.

### Formas e sombras

- Radius padrao do painel: `rounded-md` (6 px).
- Cards publicos e CTAs de destaque: `rounded-lg` (8 px).
- Pills, badges e controles circulares: `rounded-full`.
- Sombra principal: `shadow-soft`, `0 18px 50px rgba(30, 37, 40, 0.12)`.
- Cards leves do cardapio publico podem usar `shadow-sm`.

---

## Layout do Painel

### Desktop

- Container central com largura maxima `max-w-7xl`.
- Sidebar dentro do layout com 256 px (`md:w-64`).
- Conteudo principal flexivel com padding de 16, 24 ou 32 px conforme viewport.
- Nao existe topbar independente. Cada rota usa `AdminPageHeader`.

### Mobile

- Sidebar vira cabecalho superior.
- Navegacao fica horizontal, com scroll quando necessario.
- Sair fica como botao de icone no cabecalho.
- O seletor PT/ES entra na mesma faixa da navegacao.

### Navegacao atual

1. Meu cardapio
2. Produtos
3. Categorias
4. Aparencia
5. Estatisticas
6. Informacoes

Estados:

- Normal: texto `ink/68`, fundo transparente.
- Ativo: fundo `leaf`, texto branco.
- Hover: fundo branco e texto `ink`.
- Todos os itens usam icones Lucide de 18 px e altura minima de 44 px.

### Cabecalho de pagina

`AdminPageHeader` mostra:

- eyebrow traduzido em 12 px, uppercase e cor `leaf`;
- titulo da rota;
- descricao curta com largura maxima de 672 px.

---

## Componentes Base

As primitivas reutilizaveis vivem em `components/ui/`: `Button`, `Panel`,
`Feedback`, `Modal` e `ImageUpload`.

### Button

| Variante | Aparencia |
|---|---|
| Primary | `bg-leaf text-white`, hover `bg-ink` |
| Secondary/outline | branco, borda `line`, hover em `leaf` |
| Ghost | fundo transparente, hover suave |
| Danger | texto/borda mudam para `tomato` no hover |
| Restaurant CTA | usa `--restaurant-primary` |

- Alturas: 40 px para acoes compactas, 44 px padrao, 48 px em formularios/CTAs.
- Radius: 6 px no painel, 8 px no cardapio, pill apenas quando comunica estado.
- Icones: Lucide, normalmente 17-20 px.
- Durante envio: botao desabilitado, opacidade 60% e texto de carregamento.
- Nunca permitir duplo submit.

### Input, Textarea e Select

- Label sempre visivel acima do campo.
- Altura minima: 48 px.
- Fundo: `cream` no painel; branco dentro de superficies `cream`.
- Borda: 1 px `line`; foco muda para `leaf`.
- Radius: 6 px.
- Texto: 14 px semibold.
- Placeholder e texto auxiliar: `ink/50`.
- Erro: mensagem `tomato` abaixo ou bloco de feedback com borda `tomato`.
- Preco e ordem iniciam vazios; o valor padrao aparece como placeholder.

### Card e Painel

- Fundo branco, borda `line`, radius 6 px e `shadow-soft`.
- Padding padrao: 20 px.
- Itens repetidos usam fundo `cream`, borda `line` e padding de 12-16 px.
- Evitar card dentro de card sem necessidade funcional.

### Modal

O formulario de produto e a referencia atual:

- overlay `ink/40` com blur;
- largura maxima 672 px;
- altura maxima 92vh e conteudo interno com scroll;
- centrado no desktop e alinhado ao fundo no mobile;
- cabecalho, progresso, conteudo e rodape separados por bordas;
- fechar por botao `X`, clique externo ou tecla Escape;
- fluxo de tres etapas e salvamento somente no botao final.

### Drawer

O carrinho publico usa um painel lateral:

- abre pela direita, ocupa toda a largura ate `max-w-sm` (384 px);
- altura total da viewport;
- overlay clicavel para fechar;
- cabecalho e rodape fixos, lista central com scroll;
- fecha por `X` ou clique no overlay;
- fecha por Escape e usa animacao curta de entrada.

### Feedback

- Confirmacoes e erros aparecem como blocos inline proximos da acao.
- A confirmacao de link copiado dura 1,8 segundo e muda o label do botao.
- Exclusoes usam `window.confirm`.
- Toast reutilizavel e uma melhoria futura, nao um padrao implementado.

### Badge e Pill

- Aberto/fechado: pill branca sobre o banner, com cores do restaurante.
- Destaque de produto: pill circular com cor secundaria do restaurante.
- Indisponivel: fundo `ink/10`, texto `ink/60`.
- Idioma: controle segmentado em pill; opcao ativa em `leaf`.

### Upload de Imagem

- Aceita `image/*`.
- Produto: arquivo ou URL, com nome do arquivo selecionado.
- Aparencia: logo e banner aceitam arquivo ou URL e atualizam a previa local.
- Logo publico: quadrado, 80 px no mobile e 96 px no desktop.
- Banner publico: largura total, `object-cover`, hero minimo de 360/430 px.
- A selecao pode ser removida diretamente sobre a imagem.
- Drag and drop e crop ainda nao estao implementados.

---

## Fluxos Guiados do Painel

### Produto

1. Nome e descricao.
2. Preco, categoria e ordem.
3. Foto, disponibilidade e destaque.

O botao Avancar valida apenas os dados necessarios da etapa. O produto nunca e
salvo ao trocar de etapa; salvar e uma acao explicita no ultimo passo.

### Aparencia

1. Tipo de restaurante e preset.
2. Cores.
3. Logo e banner.

A previa permanece visivel no desktop e reage em tempo real. Presets podem ser
ajustados manualmente antes de salvar.

---

## Cardapio Publico

### RestaurantHeader

- Hero com banner full-width, overlay escuro e cor primaria como fallback.
- Mostra status aberto/fechado, logo, badge Menulix, nome e descricao.
- Mostra cidade/estado e Instagram quando informado.
- CTA do WhatsApp aparece no hero.
- Altura minima: 360 px no mobile e 430 px a partir de `sm`.

### CategoryTabs

- Faixa sticky no topo.
- Navegacao horizontal com scroll.
- Categorias sao pills brancas com borda.
- Hover usa a cor secundaria do restaurante.
- A categoria ativa acompanha a secao visivel durante o scroll.

### CategorySection

- Titulo de 20 px e contador de itens.
- Grid de uma coluna no mobile e duas a partir de `md`.
- Categoria sem produtos nao e renderizada.

### ProductCard

- Card horizontal com imagem quadrada de 88 px no mobile e 120 px em `sm`.
- Nome em 16 px bold.
- Descricao em 14 px, no maximo tres linhas.
- Preco em 18 px black.
- Produto destacado recebe badge sobre a imagem.
- Produto indisponivel mostra badge e nao exibe controle de adicionar.
- Produto disponivel usa controles circulares de menos, quantidade e mais.
- Nao existe modal de detalhe do produto nesta versao.

### Sidebar Publica

- Desktop: coluna sticky de 320 px.
- Mostra horarios semanais e CTA de pedido por WhatsApp.
- Mobile: aparece depois da lista de categorias.

### Carrinho

- Botao flutuante aparece apenas quando ha itens.
- Mostra quantidade total, valor e acao de pedido.
- Drawer permite aumentar, diminuir, limpar e enviar o pedido pelo WhatsApp.
- Estado fica no `localStorage`, isolado por restaurante.

---

## Estados Obrigatorios

Toda tela de dados deve considerar:

1. **Loading**: texto ou indicador enquanto carrega. Skeleton ainda nao e padrao.
2. **Empty**: mensagem clara e, quando possivel, CTA para criar o primeiro item.
3. **Error**: explicacao simples e acao recuperavel quando aplicavel.
4. **Populated**: conteudo normal com acoes visiveis.

No painel, erros tecnicos devem ser traduzidos para linguagem comum. Analytics e
outras funcoes secundarias nunca devem bloquear o fluxo publico.

---

## Padroes Estabelecidos

- Formularios importantes usam Cancelar/Voltar e Salvar; nunca autosave.
- Uma tela deve destacar uma acao primaria.
- Precos sempre usam `R$ 29,90`.
- Ordem e um numero interno de organizacao, mas sua explicacao deve ser simples.
- Icon buttons devem ter `aria-label` e `title`.
- Acoes destrutivas usam `tomato` e pedem confirmacao.
- Todo texto fixo de UI entra no dicionario PT/ES.
- Conteudo do restaurante nao e traduzido automaticamente.
- O painel usa tokens fixos; a identidade do restaurante fica no cardapio e na previa.
- `/alexpizzaria` deve continuar funcional apos qualquer mudanca.

---

## Convencoes Tecnicas

- Framework: Next.js 14 App Router.
- Estilos: Tailwind CSS 3.4, mobile-first.
- Icones: Lucide React.
- Componentes administrativos: `components/admin/`.
- Componentes publicos: `components/public-menu/`.
- Rotas do painel: `app/admin/`.
- Rota publica: `app/[slug]/`.
- Componentes React: PascalCase; arquivos e rotas: kebab-case.
- Props sempre usam interface ou type separado.
- Textos visiveis: `lib/i18n.ts`, chaves `pt` e `es`.

---

## Pendencias de Sistema de UI

- Definir toast global somente quando os feedbacks inline deixarem de ser suficientes.
- Avaliar extracao de Field quando os formatos de campo estiverem mais estaveis.
- Avaliar ItemDetail apenas se houver conteudo adicional relevante.
