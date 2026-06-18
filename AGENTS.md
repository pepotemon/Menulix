# AGENTS.md — Instruções para Claude Code

> Lido automaticamente pelo Claude Code em cada sessão.
> Versão: 2.0 | Última revisão: 2026-06-16

---

## O Projeto

**Menulix** — plataforma SaaS multi-tenant para cardápios digitais de restaurantes no Brasil.
Stack: Next.js 14 App Router · TypeScript strict · Tailwind CSS · Firebase
Fase atual: **FASE 3 em desenvolvimento** | Próxima: **FASE 4 — Planos e monetização**

---

## PROTOCOLO DE INÍCIO DE SESSÃO

> Executar SEMPRE antes de qualquer tarefa que modifique código.

```
PASSO 1 — Estado geral
  Ler: docs-obsidian/00_Index.md

PASSO 2 — Contexto técnico (obrigatório)
  Ler: docs-obsidian/02_Architecture.md

PASSO 3 — Histórico recente (obrigatório)
  Ler: docs-obsidian/06_Changelog.md  (últimas 3 entradas)

PASSO 4 — Condicional por tipo de tarefa
  Bug/erro     → ler docs-obsidian/04_Errors.md
  Nova feature → ler docs-obsidian/03_Decisions.md + 05_Ideas.md
  Nova fase    → ler docs-obsidian/05_Ideas.md (seção da fase)
  Refactor     → ler docs-obsidian/03_Decisions.md
```

**Regra:** Nunca implementar código sem completar os passos 1-3.

---

## SISTEMA DE GATILHOS — Atualização Automática de Docs

Esta seção define exatamente QUANDO e O QUE atualizar. Cada gatilho é obrigatório.

---

### GATILHO 1 — Novo arquivo criado em `components/`, `lib/`, `app/`, `types/`

**Ação obrigatória:**
1. Atualizar `docs-obsidian/02_Architecture.md` → seção "Estrutura de Arquivos"
2. Adicionar entrada em `docs-obsidian/06_Changelog.md`

---

### GATILHO 2 — Modificação em `types/menu.ts`

**Ação obrigatória:**
1. Atualizar `docs-obsidian/02_Architecture.md` → seção "Data Model"
2. Verificar e atualizar `docs-obsidian/09_Glossary.md` se novo termo foi criado
3. Adicionar entrada em `docs-obsidian/06_Changelog.md`

---

### GATILHO 3 — Modificação em `lib/menu-data.ts` ou `lib/menu-utils.ts`

**Ação obrigatória:**
1. Atualizar `docs-obsidian/02_Architecture.md` → seção "Utilitários Principais"
2. Adicionar entrada em `docs-obsidian/06_Changelog.md`

---

### GATILHO 4 — Modificação em `tailwind.config.ts`

**Ação obrigatória:**
1. Atualizar `docs-obsidian/02_Architecture.md` → seção "Design System"
2. Adicionar entrada em `docs-obsidian/06_Changelog.md`

---

### GATILHO 5 — Nova integração ou nova dependência adicionada

**Ação obrigatória:**
1. Atualizar `docs-obsidian/02_Architecture.md` → seção "Stack"
2. Registrar decisão em `docs-obsidian/03_Decisions.md` (formato DEC-XXX)
3. Adicionar entrada em `docs-obsidian/06_Changelog.md`

---

### GATILHO 6 — Bug identificado e resolvido

**Ação obrigatória:**
1. Registrar em `docs-obsidian/04_Errors.md` (formato ERR-XXX)
   - Sintoma, causa raiz, solução, prevenção
2. Adicionar entrada em `docs-obsidian/06_Changelog.md` (tipo: fix)

---

### GATILHO 7 — Decisão técnica relevante tomada

**Decisão relevante** = escolha entre 2+ opções com consequências futuras.

**Ação obrigatória:**
1. Registrar em `docs-obsidian/03_Decisions.md` (formato DEC-XXX)
   - Contexto, decisão, alternativas, consequências
2. Nenhuma entrada no changelog necessária (a decisão já documenta o porquê)

---

### GATILHO 8 — Início ou conclusão de uma Fase

**Ação obrigatória ao INICIAR:**
1. Atualizar tabela de fases em `AGENTS.md` → mudar status para "🚧 Em desenvolvimento"
2. Criar nota em `docs-obsidian/Daily/AAAA-MM-DD.md` com plano da fase

**Ação obrigatória ao CONCLUIR:**
1. Atualizar tabela de fases em `AGENTS.md` → mudar status para "✅ Completa"
2. Atualizar `docs-obsidian/00_Index.md` → marcar fase como concluída
3. Adicionar entrada abrangente em `docs-obsidian/06_Changelog.md`
4. Criar nota em `docs-obsidian/Daily/AAAA-MM-DD.md` com resumo da fase

---

### GATILHO 9 — Nova ideia ou sugestão identificada durante o trabalho

**Ação obrigatória:**
1. Adicionar em `docs-obsidian/05_Ideas.md` com status 💡
2. NÃO implementar sem aprovação do usuário

---

### GATILHO 10 — Modificação em `next.config.mjs` ou configurações raiz

**Ação obrigatória:**
1. Atualizar `docs-obsidian/02_Architecture.md` → seção relevante
2. Se for decisão arquitetural → registrar em `docs-obsidian/03_Decisions.md`
3. Adicionar entrada em `docs-obsidian/06_Changelog.md`

---

## FLUXO IDEAL: Claude Code ↔ Git ↔ docs-obsidian

```
┌─────────────────────────────────────────────────────────────────┐
│                    CICLO DE DESENVOLVIMENTO                      │
└─────────────────────────────────────────────────────────────────┘

  ANTES DA TAREFA
  ───────────────
  [Usuário solicita tarefa]
         ↓
  [Claude executa Protocolo de Início de Sessão]
  → Lê AGENTS.md + docs-obsidian relevantes
         ↓
  [Claude analisa código atual]
  → Verifica estado real dos arquivos
         ↓
  [Claude propõe plano detalhado]
  → Lista arquivos a criar/modificar
  → Identifica gatilhos de docs que serão ativados
         ↓
  [Usuário aprova plano]

  DURANTE A TAREFA
  ────────────────
         ↓
  [Claude implementa incrementalmente]
  → Cada mudança significativa = atualização docs imediata
  → Não acumular docs para o final
         ↓
  [Claude verifica Gatilhos ativados]
  → Para cada arquivo modificado: qual gatilho se aplica?
  → Atualiza docs correspondentes

  APÓS A TAREFA
  ─────────────
         ↓
  [Claude atualiza docs-obsidian/]
  → 06_Changelog.md (sempre)
  → Outros docs conforme gatilhos ativados
         ↓
  [Claude sugere mensagem de commit]
  → Formato: tipo(escopo): descrição em português
  → Exemplos:
     feat(menu): adicionar filtro por categoria
     fix(whatsapp): corrigir encoding da mensagem pré-formatada
     docs(second-brain): atualizar arquitetura após integração Firebase
     refactor(menu-data): migrar dados mockados para Firestore
         ↓
  [Usuário revisa, testa e commita]
  → git add -p  (revisar cada mudança)
  → git commit -m "..."
         ↓
  [Ciclo reinicia para próxima tarefa]
```

---

## REGRA DE OURO: O QUE É UMA MUDANÇA SIGNIFICATIVA?

Mudanças que **sempre** ativam gatilhos de documentação:

| Mudança | Significativa? |
|---------|---------------|
| Novo arquivo em `components/`, `lib/`, `app/`, `types/` | ✅ Sim |
| Modificação de interface/tipo em `types/menu.ts` | ✅ Sim |
| Nova dependência em `package.json` | ✅ Sim |
| Nova rota criada em `app/` | ✅ Sim |
| Modificação de config (tailwind, next, tsconfig) | ✅ Sim |
| Bug corrigido que afetou usuário | ✅ Sim |
| Decisão entre 2+ abordagens técnicas | ✅ Sim |
| Correção de typo em texto | ❌ Não |
| Ajuste de espaçamento/padding | ❌ Não |
| Renomear variável local | ❌ Não |
| Adicionar comentário de código | ❌ Não |

---

## REGRAS DE DESENVOLVIMENTO

### TypeScript
- Strict: sempre ativo. Nenhum `any` sem comentário justificando.
- Tipos de retorno explícitos em todas as funções públicas.
- Interfaces novas → sempre em `types/menu.ts`.

### Componentes
- `components/public-menu/` para componentes da fase 1 pública.
- `components/admin/` para componentes do painel (fase 2+).
- Props: interface separada, nunca inline `{ prop: type }`.
- Lógica fora do JSX → `lib/` ou hooks dedicados.
- Mobile-first: `className="base sm:small md:medium lg:large"`.

### Design System — Tokens Obrigatórios
```
Cores:     text-ink  bg-cream  border-line  bg-leaf  bg-tomato
Opacidade: text-ink/68  text-ink/50  (para hierarquia de texto)
Sombras:   shadow-soft
```
Nunca usar valores HEX ou RGB inline — sempre tokens.

### Idiomas
- UI (texto visível): **português do Brasil e espanhol**
- Todo texto fixo novo de UI deve entrar em `lib/i18n.ts` nas chaves `pt` e `es`
- Não escrever texto fixo diretamente em componentes quando ele puder vir do dicionário
- Ao criar/alterar telas, revisar o dicionário PT/ES na mesma mudança
- Código (vars, funções, arquivos, tipos): **inglês**

### Segurança
- `.env.local` nunca no git (já em `.gitignore`)
- Futuras Firestore Rules: `allow read, write: if request.auth != null && resource.data.restaurantId == request.auth.uid`

---

## REGRAS DE NÃO FAZER

```
❌ any no TypeScript
❌ Features além do escopo da fase atual
❌ Avançar de fase sem aprovação explícita do usuário
❌ Quebrar funcionalidade existente (/alexpizzaria deve sempre funcionar)
❌ Credenciais ou chaves de API no código
❌ Componentes sem interface de props
❌ Modificar types/menu.ts sem verificar todos os usos existentes
❌ Ignorar gatilhos de documentação após mudanças
❌ Commitar sem sugerir mensagem de commit formatada
❌ Implementar antes de propor plano ao usuário
```

---

## FASES DO PROJETO

| Fase | Status | Descrição |
|------|--------|-----------|
| FASE 1 | ✅ Completa | MVP público — cardápios por slug |
| FASE 2 | ✅ Completa | Painel admin — Firebase Auth + CRUD |
| FASE 3 | 🚧 Em desenvolvimento | Personalização visual por restaurante |
| FASE 4 | ⏳ Pendente | Planos e monetização |
| FASE 5 | ⏳ Pendente | Carrinho + pedidos por WhatsApp |
| FASE 6 | ⏳ Pendente | Estatísticas e analytics |
| FASE 7 | ⏳ Pendente | Admin interno Menulix |

---

## ESTRUTURA DE ARQUIVOS — REFERÊNCIA

```
app/
  layout.tsx              → Root layout, metadata pt-BR
  globals.css             → CSS global, tokens base
  not-found.tsx           → 404 em português
  [slug]/page.tsx         → Rota pública SSG dos cardápios

components/public-menu/   → 8 componentes da fase 1
lib/
  menu-data.ts            → Dados mockados + queries (→ Firebase na F2)
  menu-utils.ts           → Formatadores puros (BRL, WhatsApp, horários)
types/
  menu.ts                 → Todas as interfaces TypeScript

docs-obsidian/            → Second Brain do projeto
AGENTS.md                 → Este arquivo (instruções para Claude Code)
```

---

## RESTAURANTES DE TESTE

| Slug | Estado | URL dev |
|------|--------|---------|
| `alexpizzaria` | ✅ Ativo | `localhost:3000/alexpizzaria` |
| `qualquer-coisa` | 🚫 404 | `localhost:3000/qualquer-coisa` |

**Invariante crítica:** `/alexpizzaria` deve sempre renderizar corretamente após qualquer mudança.

---

## SEGUNDA BRAIN — MAPA DE DOCUMENTOS

| Arquivo | Quando atualizar |
|---------|-----------------|
| `00_Index.md` | Mudança de fase, novo documento criado |
| `01_Project.md` | Mudança no modelo de negócio ou público-alvo |
| `02_Architecture.md` | Qualquer mudança técnica significativa |
| `03_Decisions.md` | Toda decisão entre 2+ opções técnicas |
| `04_Errors.md` | Todo bug encontrado e resolvido |
| `05_Ideas.md` | Toda nova ideia surgida durante o trabalho |
| `06_Changelog.md` | Após TODA mudança significativa |
| `07_Prompts.md` | Quando novo prompt útil for descoberto |
| `08_Workflows.md` | Quando processo de trabalho mudar |
| `09_Glossary.md` | Novo termo de domínio ou técnico |
| `Daily/AAAA-MM-DD.md` | Sessões longas ou início/fim de fases |

---

## FORMATOS DE COMMIT RECOMENDADOS

```bash
# Nova feature
feat(escopo): descrição curta em português

# Correção de bug
fix(escopo): o que foi corrigido

# Refatoração
refactor(escopo): o que foi reorganizado

# Documentação
docs(second-brain): o que foi documentado

# Configuração/chore
chore(deps): atualizar dependências

# Estilos/design
style(componente): ajuste visual sem mudança de lógica
```

**Escopos comuns:** `menu`, `admin`, `firebase`, `whatsapp`, `types`, `config`, `second-brain`

---

## REFERÊNCIAS RÁPIDAS

- Contexto completo: `docs-obsidian/00_Index.md`
- Prompts prontos: `docs-obsidian/07_Prompts.md`
- Fluxos de trabalho: `docs-obsidian/08_Workflows.md`
- Erros conhecidos: `docs-obsidian/04_Errors.md`
- Decisões técnicas: `docs-obsidian/03_Decisions.md`
