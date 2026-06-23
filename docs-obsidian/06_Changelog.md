# 06 — Changelog

> Última atualização: 2026-06-16
> Relacionado: [[03_Decisions]] | [[04_Errors]] | [[02_Architecture]]

---

## Formato de Entrada

```
## [AAAA-MM-DD] Título da mudança

**Fase**: FASE X
**Tipo**: feat | fix | refactor | docs | chore | style
**Arquivos modificados**:
- caminho/arquivo.ts

**O que mudou**:
Descrição clara da mudança.

**Por que**:
Motivação ou decisão técnica.

**Impacto**:
O que isso afeta.
```

---

## Histórico

---

### [2026-06-23] UI transversal - sistema visual aplicado ao produto

**Fase**: FASE 2 / FASE 3 / FASE 5
**Tipo**: feat
**Arquivos criados/modificados**:
- `components/ui/`
- `components/public-menu/category-nav.tsx`
- `app/admin/produtos/page.tsx`
- `app/admin/categorias/page.tsx`
- `app/admin/aparencia/page.tsx`
- `app/admin/restaurante/page.tsx`
- `app/admin/page.tsx`
- `components/public-menu/public-menu-page.tsx`
- `components/public-menu/product-card.tsx`
- `components/public-menu/cart-drawer.tsx`
- `app/globals.css`
- `lib/i18n.ts`

**O que mudou**:
O guia visual foi transformado em componentes e fluxos reais. O painel ganhou
primitivas reutilizáveis, categorias em modal, informações em três etapas,
uploads com preview e remoção, feedback consistente e modais acessíveis. O menu
público agora destaca a categoria visível, mostra placeholder sem foto e fecha
o carrinho também por Escape.

**Por que**:
Usuários pouco habituados a sistemas administrativos precisam ver uma tarefa por
vez, receber feedback imediato e encontrar controles previsíveis em todas as telas.

**Impacto**:
- Menos formulários longos e menos ruído visual no painel
- Comportamento consistente de loading, foco, erro e fechamento
- Melhor navegação e tolerância a dados incompletos no cardápio público
- Nenhuma dependência nova e nenhuma alteração no modelo Firebase

---

### [2026-06-23] Documentação - guia de UI, componentes e estilo

**Fase**: Transversal
**Tipo**: docs
**Arquivos criados/modificados**:
- `docs-obsidian/10_UI_Style.md`
- `docs-obsidian/00_Index.md`
- `docs-obsidian/06_Changelog.md`

**O que mudou**:
Foi criada uma referência única para a interface atual do Menulix. O documento
registra identidade visual, layout responsivo, navegação, componentes, formulários
guiados, cardápio público, estados obrigatórios e pendências do sistema de UI.

**Por que**:
Os padrões visuais estavam distribuídos entre Tailwind, componentes e notas de
arquitetura. A guia reduz inconsistências e ajuda futuras mudanças a preservar a
simplicidade do painel e a personalização do cardápio.

**Impacto**:
- Novas telas passam a ter uma referência concreta de medidas e comportamento
- Diferencia padrões implementados de melhorias ainda pendentes
- Mantém a regra obrigatória de textos PT-BR e espanhol

---

### [2026-06-22] UX admin — aparência guiada com prévia em tempo real

**Fase**: FASE 3
**Tipo**: feat
**Arquivos modificados**:
- `app/admin/aparencia/page.tsx`
- `lib/i18n.ts`
- `docs-obsidian/05_Ideas.md`
- `docs-obsidian/06_Changelog.md`

**O que mudou**:
A tela de Aparência foi reorganizada em 3 etapas: tipo de restaurante, cores e
logo/banner. A prévia do perfil fica sempre visível ao lado e muda em tempo real
conforme o usuário escolhe template, edita cores ou seleciona imagens.

**Por que**:
Personalização visual precisa ser guiada e visual. O usuário deve entender o impacto
de cada escolha sem precisar salvar ou alternar entre telas.

**Impacto**:
- Fase 3 fica mais amigável para usuários não técnicos
- Preview vivo ajuda a decidir cores, logo e banner com menos tentativa e erro
- Mantém o padrão de fluxos guiados iniciado em Produtos

---

### [2026-06-22] Fix UX — evitar salvamento automático no modal de produtos

**Fase**: FASE 2 / UX transversal
**Tipo**: fix
**Arquivos modificados**:
- `app/admin/produtos/page.tsx`
- `docs-obsidian/04_Errors.md`
- `docs-obsidian/06_Changelog.md`

**O que mudou**:
O modal de produtos deixou de usar submit automático do formulário. Agora o avanço
até o passo 3 apenas muda de etapa, e o produto só é criado ou atualizado quando
o usuário toca explicitamente em "Salvar".

**Por que**:
Ao chegar no último passo, o formulário podia salvar antes que o usuário escolhesse
foto, disponibilidade ou destaque.

**Impacto**:
- Fluxo de cadastro por etapas fica previsível
- O passo de foto/visibilidade pode ser preenchido antes de salvar
- Menos risco de produtos incompletos criados por engano

---

### [2026-06-22] UX admin — formulário guiado de produtos

**Fase**: FASE 2 / UX transversal
**Tipo**: feat
**Arquivos modificados**:
- `app/admin/produtos/page.tsx`
- `lib/i18n.ts`
- `docs-obsidian/05_Ideas.md`
- `docs-obsidian/06_Changelog.md`

**O que mudou**:
A tela de produtos deixou de mostrar o formulário de criação sempre aberto. Agora
há um botão "Novo produto" que abre um modal guiado em 3 etapas: nome/descrição,
preço/categoria/ordem e foto/visibilidade. A edição de produto usa o mesmo modal.

**Por que**:
O painel precisa ser mais amigável para donos de restaurante pouco acostumados com
sistemas administrativos. Um fluxo guiado reduz ruído visual e deixa a tarefa de
cadastrar produto mais clara.

**Impacto**:
- Página de produtos fica mais limpa
- Cadastro e edição ficam mais direcionados
- Base visual pronta para repetir o padrão em categorias e outras telas

---

### [2026-06-19] Fix UX — polimento da aparência

**Fase**: FASE 3
**Tipo**: fix
**Arquivos modificados**:
- `app/admin/aparencia/page.tsx`
- `components/public-menu/restaurant-header.tsx`
- `docs-obsidian/04_Errors.md`
- `docs-obsidian/06_Changelog.md`

**O que mudou**:
A tela de aparência agora mostra preview instantânea do logo e banner selecionados,
mesmo antes do upload/salvamento. Após salvar, o formulário recebe as URLs finais.
A preview do perfil no admin foi redesenhada com proporções melhores, e o header
público foi ajustado para ficar mais equilibrado em mobile e desktop.

**Por que**:
O usuário precisava ver imediatamente as imagens carregadas e a visualização do
perfil estava pouco otimizada.

**Impacto**:
- Fase 3 fica mais confiável e visualmente polida
- Dono do restaurante tem feedback imediato ao escolher imagens
- Header público reduz risco de layout pesado ou mal encaixado em telas pequenas

---

### [2026-06-19] Fase 6 — estatísticas iniciais

**Fase**: FASE 6
**Tipo**: feat
**Arquivos criados/modificados**:
- `app/admin/estatisticas/page.tsx` — nova tela de estatísticas do restaurante
- `lib/analytics.ts` — registro e agregação de eventos de uso
- `types/menu.ts` — tipos `AnalyticsEvent`, `AnalyticsEventType` e `AnalyticsSummary`
- `components/admin/admin-shell.tsx` — item "Estatísticas" na navegação
- `app/admin/page.tsx` — atalho para estatísticas no dashboard
- `components/public-menu/public-menu-page.tsx` — evento de visita e clique em categoria
- `components/public-menu/product-card.tsx` — evento de produto adicionado
- `components/public-menu/whatsapp-button.tsx` — evento de clique no WhatsApp
- `components/public-menu/cart-drawer.tsx` — evento de pedido enviado
- `lib/i18n.ts` — chaves PT/ES da nova tela
- `firestore.rules` — regras para `analyticsEvents`
- `docs-obsidian/02_Architecture.md` — arquitetura da Fase 6
- `docs-obsidian/03_Decisions.md` — DEC-016
- `docs-obsidian/05_Ideas.md` — backlog da Fase 6
- `docs-obsidian/09_Glossary.md` — termos de analytics
- `docs-obsidian/Daily/2026-06-19.md` — plano da fase
- `AGENTS.md` e `docs-obsidian/00_Index.md` — status da fase

**O que mudou**:
Criada a primeira versão da Fase 6. O cardápio público passa a registrar eventos
simples em Firestore e o painel admin ganhou a rota `/admin/estatisticas` com
visitas, produtos clicados, cliques no WhatsApp, pedidos enviados, total estimado
e atividade recente.

**Por que**:
Donos de restaurante precisam entender se o cardápio está sendo usado sem lidar
com ferramentas externas de analytics.

**Impacto**:
- Nova coleção Firestore `analyticsEvents`
- Requer deploy atualizado de `firestore.rules`
- Métricas aparecem conforme clientes acessam o cardápio público

---

### [2026-06-18] Fix UX — seletor de idioma movido para o admin

**Fase**: FASE 3 / transversal
**Tipo**: fix
**Arquivos modificados**:
- `components/language-switcher.tsx` — removido posicionamento fixed
- `app/layout.tsx` — removido LanguageSwitcher do layout global
- `components/admin/admin-shell.tsx` — LanguageSwitcher adicionado ao sidebar
- `components/language-provider.tsx` — detecção de idioma pelo navigator.language

**O que mudou**:
O seletor PT/ES foi removido do cardápio público (onde não havia contexto de uso)
e movido para dentro do painel admin. No admin desktop fica abaixo do botão "Sair";
no mobile aparece no final do scroll horizontal da nav. No cardápio público, o idioma
é detectado automaticamente pelo browser via `navigator.language`.

**Por que**:
O toggle fixo aparecia em cima da barra sticky de categorias no mobile, causando
conflito visual. O cliente do restaurante não precisa de um toggle manual de idioma.

**Impacto**:
- Cardápio público limpo, sem elementos sobrepostos
- Admin mantém controle explícito de idioma

---

### [2026-06-18] Fix UX — scroll de categorias e posição do seletor

**Fase**: FASE 5 / FASE 3
**Tipo**: fix
**Arquivos modificados**:
- `components/public-menu/category-section.tsx`

**O que mudou**:
O atributo `id` foi movido do `<h2>` para o `<section>`, corrigindo o `scroll-mt-20`
que estava no elemento errado. Os links da nav de categorias agora scrollam para a
section correta sem esconder o título atrás da barra sticky.

**Por que**:
`scroll-margin-top` só funciona no elemento que é alvo do anchor (`href="#id"`).
O `id` estava no `<h2>` filho mas o `scroll-mt` estava no `<section>` pai.

**Impacto**:
Navegação por categorias funciona corretamente em todos os dispositivos.

---

### [2026-06-18] Fase 5 completa — carrinho de pedidos com WhatsApp

**Fase**: FASE 5
**Tipo**: feat
**Arquivos criados**:
- `components/public-menu/cart-provider.tsx` — contexto do carrinho + localStorage
- `components/public-menu/cart-button.tsx` — botão flutuante com total e contagem
- `components/public-menu/cart-drawer.tsx` — painel lateral com itens e pedido WA

**Arquivos modificados**:
- `components/public-menu/product-card.tsx` — botão + e controles +/- por item
- `components/public-menu/public-menu-page.tsx` — wraps CartProvider, CartButton, CartDrawer
- `lib/menu-utils.ts` — adiciona `buildWhatsappOrderUrl()`
- `lib/i18n.ts` — chaves PT/ES do carrinho (cart.title, cart.order, cart.whatsappIntro…)
- `types/menu.ts` — tipo `CartItem`

**O que mudou**:
Clientes do restaurante podem adicionar produtos ao carrinho diretamente do cardápio
público. O painel lateral mostra os itens, quantidades e total. Ao clicar em "Fazer pedido",
abre o WhatsApp com uma mensagem formatada contendo todos os itens e o total.
O carrinho é persistido em localStorage por restaurante.

**Por que**:
Feature central do produto para gerar valor real para os restaurantes: pedidos
chegam pelo WhatsApp já com os itens e valores, reduzindo erros e tempo de atendimento.

**Impacto**:
- Fase 5 encerrada
- Cardápio público passa a ter fluxo de pedido completo
- Nenhuma mudança no backend ou Firebase necessária

---

### [2026-06-18] Perf — cache offline do Firestore com IndexedDB

**Fase**: transversal
**Tipo**: perf
**Arquivos modificados**:
- `lib/firebase.ts`

**O que mudou**:
Firestore inicializado com `persistentLocalCache` + `persistentMultipleTabManager`
no browser. Na segunda visita ao admin, os dados são servidos instantaneamente
do IndexedDB e atualizados em segundo plano.

**Por que**:
O admin tinha um waterfall de 3 requests sequenciais ao abrir (auth → restaurant → categories+products),
causando lentidão perceptível no sidebar. O cache offline resolve o problema para
visitas repetidas sem alterar a lógica de dados.

**Impacto**:
- Segunda visita ao admin: quase instantânea
- Funciona offline em modo leitura
- Sem mudança de API ou componentes

---

### [2026-06-18] Fase 3 iniciada — aparência visual do restaurante

**Fase**: FASE 3
**Tipo**: feat
**Arquivos criados/modificados**:
- `app/admin/aparencia/page.tsx` — tela de template, cores, logo e banner
- `components/admin/admin-shell.tsx` — navegação inclui Aparência
- `types/menu.ts` — adiciona `RestaurantTemplate` e `AppearanceFormInput`
- `lib/admin-firestore.ts` — salva aparência e faz upload de logo/banner
- `storage.rules` — libera path de branding por restaurante
- `components/public-menu/*` — aplica cores do restaurante no cardápio público
- `lib/i18n.ts` — textos PT/ES da Fase 3
- `AGENTS.md`, `00_Index.md`, `02_Architecture.md`, `03_Decisions.md`, `09_Glossary.md`

**O que mudou**:
Fase 3 foi iniciada com personalização visual simples: presets por tipo de restaurante,
cores customizadas, upload/link de logo e banner, prévia no admin e aplicação das cores
no cardápio público.

**Por que**:
Restaurantes precisam que o cardápio pareça deles, sem precisar entender design ou CSS.

**Impacto**:
- Nova rota `/admin/aparencia`
- Cardápio público usa CSS variables baseadas em `restaurant.theme`
- Será necessário redeploy de `storage.rules` para upload de logo/banner em produção

---

### [2026-06-17] Base bilíngue PT/ES para admin e cardápio público

**Fase**: FASE 2 (preparação antes da FASE 3)
**Tipo**: feat
**Arquivos criados/modificados**:
- `lib/i18n.ts` — dicionário central português/espanhol
- `components/language-provider.tsx` — estado global de idioma
- `components/language-switcher.tsx` — seletor PT/ES fixo
- `app/layout.tsx` — provider global e botão de idioma
- `components/public-menu/*` — textos públicos conectados ao dicionário
- `app/admin/*`, `components/admin/*` — textos principais do painel conectados ao dicionário
- `lib/menu-utils.ts` — labels de horário e WhatsApp recebem idioma
- `AGENTS.md`, `02_Architecture.md`, `03_Decisions.md`, `08_Workflows.md`

**O que mudou**:
A UI passa a ter base bilíngue com troca rápida entre português e espanhol.
O dicionário virou parte obrigatória do fluxo de desenvolvimento.

**Por que**:
Antes de iniciar a Fase 3, é melhor evitar textos hardcoded e preparar o produto
para restaurantes/clientes que preferem espanhol.

**Impacto**:
- Botão PT/ES disponível em todas as telas
- Textos fixos principais do admin e cardápio público ficam centralizados
- Toda nova UI deve atualizar `lib/i18n.ts` em português e espanhol

---

### [2026-06-17] Ajuste UX — inputs de preço e ordem vazios ao criar

**Fase**: FASE 2
**Tipo**: fix
**Arquivos criados/modificados**:
- `app/admin/produtos/page.tsx`
- `app/admin/categorias/page.tsx`
- `docs-obsidian/04_Errors.md`
- `docs-obsidian/06_Changelog.md`

**O que mudou**:
Campos de preço e ordem agora usam texto temporário no formulário, permitindo que
o usuário apague o conteúdo normalmente. Em novos produtos/categorias, os campos
começam vazios com placeholder, e o número é calculado ao salvar.

**Por que**:
Inputs controlados como `number` convertiam campo vazio para `0`, atrapalhando a digitação.

**Impacto**:
Melhora a experiência de cadastro para usuários não técnicos no painel admin.

---

### [2026-06-17] Fase 2 concluída — painel admin simples

**Fase**: FASE 2
**Tipo**: feat
**Arquivos criados/modificados**:
- `app/admin/*` — login, dashboard "Meu cardápio", restaurante, categorias e produtos
- `components/admin/*` — Auth, dados admin, layout, cabeçalhos e link/QR
- `lib/admin-firestore.ts` — camada de CRUD e upload
- `types/menu.ts` — ownership e tipos de formulário
- `firebase.json`, `firestore.rules`, `storage.rules` — regras de Firestore e Storage
- `package.json`, `package-lock.json` — dependência `qrcode`
- `docs-obsidian/*`, `AGENTS.md` — second brain atualizado

**O que mudou**:
Fase 2 foi encerrada em código com painel administrativo simples para usuários não técnicos:
login, edição do restaurante, categorias, produtos, upload de imagem, link público e QR Code.

**Por que**:
O restaurante precisa conseguir administrar o cardápio sem enfrentar um painel complexo.

**Impacto**:
- Próxima fase do produto passa a ser Fase 3 — personalização visual
- Build local validado
- Deploy das rules ainda exige `firebase login --reauth` antes de publicar no Firebase

---

### [2026-06-17] Fase 2 — CRUD admin, upload, QR Code e rules por ownership

**Fase**: FASE 2
**Tipo**: feat
**Arquivos criados/modificados**:
- `types/menu.ts` — adiciona `ownerId` e tipos de formulário admin
- `lib/firebase.ts` — exporta Firebase Storage
- `lib/admin-firestore.ts` — CRUD admin, criação automática de restaurante e upload de imagem
- `components/admin/admin-data-provider.tsx` — carrega restaurante/categorias/produtos do usuário
- `components/admin/public-link-panel.tsx` — copiar link público e baixar QR Code
- `components/admin/admin-shell.tsx` — navegação simplificada para "Meu cardápio"
- `app/admin/page.tsx` — dashboard simples com ações principais, status, link e QR
- `app/admin/restaurante/page.tsx` — formulário de informações do restaurante
- `app/admin/categorias/page.tsx` — CRUD de categorias
- `app/admin/produtos/page.tsx` — CRUD de produtos com upload de imagem
- `firestore.rules` — escrita por `ownerId`
- `storage.rules` — upload público/privado de imagens por restaurante
- `firebase.json` — adiciona configuração de Storage Rules
- `package.json`, `package-lock.json` — adiciona `qrcode` e `@types/qrcode`
- `docs-obsidian/02_Architecture.md`, `03_Decisions.md`, `06_Changelog.md`

**O que mudou**:
O painel admin deixou de ser placeholder e passou a permitir administrar o cardápio
de forma simples: editar informações, categorias, produtos, imagens, link público
e QR Code. A arquitetura usa `ownerId` para isolar o restaurante do usuário logado.

**Por que**:
Usuários não técnicos precisam de uma experiência direta, com ações claras e sem
conceitos internos de SaaS, tenant ou banco de dados.

**Impacto**:
- Fase 2 está implementada localmente em código
- Escrita em Firestore e Storage depende do deploy das rules
- Deploy/dry-run das rules ficou pendente porque o Firebase CLI pediu `firebase login --reauth`

---

### [2026-06-17] Fase 2 iniciada — base do painel admin com Firebase Auth

**Fase**: FASE 2
**Tipo**: feat
**Arquivos criados/modificados**:
- `lib/firebase.ts` — exporta `auth` além de `db`
- `components/admin/auth-provider.tsx` — contexto de sessão Firebase Auth
- `components/admin/admin-shell.tsx` — layout protegido e navegação do painel
- `components/admin/admin-page-header.tsx` — cabeçalho padrão das telas admin
- `components/admin/placeholder-panel.tsx` — painel de próximas etapas
- `app/admin/layout.tsx` — provider e shell do admin
- `app/admin/login/page.tsx` — login por e-mail/senha
- `app/admin/page.tsx` — dashboard inicial
- `app/admin/restaurante/page.tsx` — base do CRUD de restaurante
- `app/admin/categorias/page.tsx` — base do CRUD de categorias
- `app/admin/produtos/page.tsx` — base do CRUD de produtos
- `AGENTS.md`, `docs-obsidian/00_Index.md`, `02_Architecture.md`, `03_Decisions.md`

**O que mudou**:
Fase 2 foi iniciada oficialmente. O projeto agora possui rotas base para o painel
administrativo, login com Firebase Auth e proteção client-side das rotas `/admin`.

**Por que**:
O CRUD da Fase 2 precisa de uma base autenticada e navegável antes das telas de
escrita em Firestore.

**Impacto**:
- `/admin/login` permite autenticação com Firebase Auth
- `/admin` e subrotas exigem usuário autenticado no cliente
- Firestore Rules seguem com escrita bloqueada até a etapa de CRUD e ownership

---

### [2026-06-16] Integração Firebase — Firestore conectado

**Fase**: FASE 1 (complemento)
**Tipo**: feat
**Arquivos criados/modificados**:
- `lib/firebase.ts` — inicialização do app Firebase (singleton)
- `lib/firestore.ts` — queries reais no Firestore (substitui funções mockadas)
- `app/[slug]/page.tsx` — convertido para async + ISR (revalidate: 60s)
- `.env.local` — variáveis de ambiente Firebase (não commitado)
- `firebase.json` — configuração do Firebase CLI
- `firestore.rules` — regras de segurança do Firestore
- `next.config.mjs` — adicionado domínio `firebasestorage.googleapis.com`
- `package.json` — adicionado `firebase@12.15.0`

**O que mudou**:
Substituídas as funções mockadas de `lib/menu-data.ts` por queries reais ao Firestore.
O cardápio `/alexpizzaria` agora carrega dados reais do banco. Dados de exemplo
populados via rota de seed (depois apagada). Regras de segurança deployadas:
leitura pública, escrita bloqueada.

**Por que**:
Fase 1 estava completa com dados estáticos. Com Firebase conectado, o projeto
está pronto para a Fase 2 (painel admin com CRUD real).

**Impacto**:
- Cardápios agora buscam dados do Firestore em tempo real
- ISR garante performance: páginas cacheadas e regeneradas a cada 60s
- `lib/menu-data.ts` mantido apenas como referência de dados de exemplo
- Projeto: menulix-77e45 | Região: southamerica-east1

---

### [2026-06-16] Fase 1 — MVP Público Completo

**Fase**: FASE 1
**Tipo**: feat
**Arquivos criados**:
- `types/menu.ts`
- `lib/menu-data.ts`
- `lib/menu-utils.ts`
- `app/layout.tsx`
- `app/globals.css`
- `app/not-found.tsx`
- `app/[slug]/page.tsx`
- `components/public-menu/public-menu-page.tsx`
- `components/public-menu/restaurant-header.tsx`
- `components/public-menu/category-section.tsx`
- `components/public-menu/product-card.tsx`
- `components/public-menu/opening-hours.tsx`
- `components/public-menu/status-pill.tsx`
- `components/public-menu/whatsapp-button.tsx`
- `components/public-menu/inactive-restaurant.tsx`
- `next.config.mjs`
- `tailwind.config.ts`

**O que foi implementado**:
- Rota pública `/[slug]` para cardápios digitais
- Header do restaurante com banner, logo, info e status
- Grid de categorias e produtos
- Cards de produtos com preço em BRL, badge de destaque e disponibilidade
- Navegação sticky por categorias (scroll suave)
- Sidebar com horários de funcionamento
- Botão WhatsApp com mensagem pré-formatada
- Página 404 amigável em português
- Estado de restaurante inativo
- Dados mockados: Alex Pizzaria com 6 produtos em 3 categorias
- Design tokens: `leaf`, `tomato`, `ink`, `cream`, `line`
- SSG com `generateStaticParams`

**Por que**:
MVP público completo para demonstrar a plataforma e validar o conceito com restaurantes reais.

**Impacto**:
- Qualquer restaurante pode ter seu cardápio acessível via `/[slug]`
- Fundação para integração com Firebase na Fase 2

---

### [2026-06-16] Sistema Second Brain criado

**Fase**: Meta / Documentação
**Tipo**: docs
**Arquivos criados**:
- `docs-obsidian/00_Index.md`
- `docs-obsidian/01_Project.md`
- `docs-obsidian/02_Architecture.md`
- `docs-obsidian/03_Decisions.md`
- `docs-obsidian/04_Errors.md`
- `docs-obsidian/05_Ideas.md`
- `docs-obsidian/06_Changelog.md`
- `docs-obsidian/07_Prompts.md`
- `docs-obsidian/08_Workflows.md`
- `docs-obsidian/09_Glossary.md`
- `docs-obsidian/Daily/README.md`
- `AGENTS.md`

**O que mudou**:
Sistema de documentação viva criado para manter contexto de longo prazo do projeto, acessível tanto por humanos quanto por Claude Code.

**Por que**:
Projetos SaaS complexos perdem contexto entre sessões. O Second Brain garante continuidade.

**Impacto**:
Todas as futuras sessões de Claude Code devem ler `AGENTS.md` e `docs-obsidian/` antes de fazer alterações.

---

## Próximas Entradas Esperadas

- Integração Firebase Auth
- Integração Firestore (substituir dados mockados)
- Criação do painel administrativo `/app`
- Upload de imagens via Firebase Storage
- Deploy em Vercel
