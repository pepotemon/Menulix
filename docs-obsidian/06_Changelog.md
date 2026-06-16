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
