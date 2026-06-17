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
