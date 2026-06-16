# 03 — Decisões Técnicas

> Última atualização: 2026-06-16
> Relacionado: [[02_Architecture]] | [[04_Errors]] | [[06_Changelog]]

---

## Formato das Decisões

Cada decisão usa o formato:
- **Contexto**: Situação que gerou a decisão
- **Decisão**: O que foi escolhido
- **Alternativas**: O que foi descartado
- **Consequências**: Impacto da decisão

---

## [DEC-001] Next.js App Router vs Pages Router

**Data**: Fase 1
**Contexto**: Escolha da versão e sistema de roteamento do Next.js.
**Decisão**: App Router (Next.js 14) com estrutura `app/`.
**Alternativas descartadas**: Pages Router (Next.js 13 ou anterior).
**Consequências**:
- Server Components por padrão → melhor performance
- Layout aninhados nativos
- Metadata API nativa
- `generateStaticParams` substitui `getStaticPaths`
- Requer `"use client"` explícito para componentes interativos

---

## [DEC-002] Dados mockados vs Firebase desde o início

**Data**: Fase 1
**Contexto**: Precisávamos de dados para desenvolver a UI sem esperar por backend.
**Decisão**: Dados mockados em `lib/menu-data.ts` para a Fase 1.
**Alternativas descartadas**: Firebase Firestore desde o início.
**Consequências**:
- Desenvolvimento de UI 100% independente do backend
- SSG funciona sem nenhuma chamada de rede
- Modelos TypeScript já espelham a estrutura futura do Firestore
- Migração para Firebase: substituir funções em `lib/menu-data.ts` sem tocar nos componentes

---

## [DEC-003] Slugs como identificadores públicos de restaurante

**Data**: Fase 1
**Contexto**: Como identificar cada restaurante na URL de forma amigável?
**Decisão**: Slugs únicos como `alexpizzaria`, `marmitariadadona`.
**Alternativas descartadas**: IDs numéricos ou UUIDs na URL.
**Consequências**:
- URLs memoráveis e adequadas para QR Code
- Slugs devem ser únicos no sistema — validação necessária no painel admin (Fase 2)
- Slugs imutáveis após criação (ou redirecionar o slug antigo)

---

## [DEC-004] Geração estática (SSG) vs Server-Side Rendering (SSR)

**Data**: Fase 1
**Contexto**: Como renderizar as páginas dos restaurantes?
**Decisão**: SSG com `generateStaticParams()`.
**Alternativas descartadas**: SSR em runtime, ISR (Incremental Static Regeneration).
**Consequências**:
- Performance máxima: páginas servidas como HTML estático
- Sem custo de computação por request
- Limitação: novos restaurantes requerem rebuild. **Solução futura**: ISR com `revalidate` ao migrar para Firestore

---

## [DEC-005] Tailwind CSS com design tokens customizados

**Data**: Fase 1
**Contexto**: Sistema de cores e estilos para o projeto.
**Decisão**: Tailwind com tokens: `leaf`, `tomato`, `ink`, `cream`, `line`.
**Alternativas descartadas**: CSS Modules, Styled Components, MUI, Chakra UI.
**Consequências**:
- Consistência visual em todos os componentes
- Fácil de manter e escalar
- Tokens semânticos facilitam personalização por tema (Fase 3)
- Bundle pequeno (Tailwind purge automático)

---

## [DEC-006] Lucide React como biblioteca de ícones

**Data**: Fase 1
**Contexto**: Precisávamos de ícones consistentes e leves.
**Decisão**: Lucide React (tree-shakeable, SVG inline).
**Alternativas descartadas**: FontAwesome, Heroicons, Material Icons.
**Consequências**:
- Apenas os ícones usados são incluídos no bundle
- SVG inline: controle total via CSS
- Ícones usados: `Clock`, `MapPin`, `MessageCircle`, `BadgePercent`, `CircleSlash2`, `SearchX`, `Calendar`

---

## [DEC-007] Separação de dados, utilitários e tipos

**Data**: Fase 1
**Contexto**: Como organizar o código de suporte?
**Decisão**:
- `types/menu.ts` → interfaces TypeScript
- `lib/menu-data.ts` → dados + funções de query
- `lib/menu-utils.ts` → formatadores e utilitários puros
**Consequências**:
- Clara separação de responsabilidades
- Testes unitários possíveis em utils sem depender de UI
- Migração para Firebase: apenas `menu-data.ts` muda

---

## [DEC-008] Mobile-first como princípio de design

**Data**: Fase 1
**Contexto**: O principal caso de uso é scanning de QR Code no celular.
**Decisão**: Todos os componentes projetados para mobile primeiro, expandidos para desktop.
**Consequências**:
- Layout de 1 coluna em mobile, 2+ em desktop
- Navegação de categorias com overflow-x horizontal em mobile
- Touch targets mínimos de 48px
- Sidebar de horários visível apenas em `lg:` (desktop)

---

## [DEC-009] WhatsApp como canal principal de pedidos

**Data**: Fase 1 (arquitetura)
**Contexto**: Como os clientes fazem pedidos no MVP?
**Decisão**: Botão WhatsApp com mensagem pré-formatada. Sem carrinho nativo na Fase 1.
**Consequências**:
- Implementação simples, adoção imediata
- Sem necessidade de backend de pedidos
- Fase 5 adicionará carrinho real com mensagem formatada detalhada

---

## [DEC-010] Formato de preço em centavos vs float

**Data**: Fase 1
**Contexto**: Como armazenar preços no modelo de dados?
**Decisão**: Float (ex: `29.90`) nos dados mockados. Formatação via `formatCurrencyBRL()`.
**Nota importante**: Ao migrar para Firestore, considerar armazenar em **centavos inteiros** (ex: `2990`) para evitar problemas de ponto flutuante. [[03_Decisions#Pendentes]]

---

## Decisões Pendentes

- [ ] Armazenamento de preços: float vs centavos inteiros no Firestore
- [ ] ISR vs SSR para cardápios após migração para Firebase
- [ ] Estratégia de slugs: geração automática ou manual pelo dono?
- [ ] Domínio personalizado: subdomínio (`burgerprime.menulix.com`) ou path (`menulix.com/burgerprime`)?
- [ ] Provedor de pagamento: Stripe, Hotmart, Pagar.me, ou outro?
