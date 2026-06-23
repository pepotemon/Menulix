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

## [DEC-011] Proteção inicial do admin com Firebase Auth no cliente

**Data**: 2026-06-17
**Contexto**: A Fase 2 precisa iniciar o painel administrativo sem ainda introduzir sessões server-side ou cookies customizados.
**Decisão**: Usar Firebase Auth no cliente com `onAuthStateChanged`, `signInWithEmailAndPassword` e redirecionamento client-side para proteger a navegação inicial de `/admin`.
**Alternativas descartadas**: Middleware server-side com session cookie do Firebase Admin; rota separada fora de `/admin` para login; painel temporariamente sem proteção.
**Consequências**:
- Entrega inicial mais simples e alinhada ao Firebase client SDK já instalado
- Base suficiente para construir as telas de CRUD da Fase 2
- Firestore Rules continuam sendo a proteção real de escrita
- Se houver necessidade de SSR autenticado, a arquitetura pode evoluir para session cookies com Firebase Admin

---

## [DEC-012] Ownership por `ownerId` no restaurante

**Data**: 2026-06-17
**Contexto**: O painel admin precisa isolar dados por restaurante sem expor conceitos técnicos para o usuário.
**Decisão**: Cada documento em `restaurants` passa a ter `ownerId`, preenchido com o `uid` do Firebase Auth. Categorias e produtos continuam vinculados por `restaurantId`.
**Alternativas descartadas**: Usar `restaurant.id == auth.uid`; criar coleção intermediária de permissões; permitir escrita autenticada sem ownership.
**Consequências**:
- Um usuário autenticado administra apenas restaurantes onde `ownerId == uid`
- Firestore Rules conseguem validar escrita de restaurantes, categorias e produtos
- Mantém liberdade para ter IDs de restaurante independentes do usuário
- Futuramente permite múltiplos usuários por restaurante com uma coleção de permissões

---

## [DEC-013] QR Code client-side com `qrcode`

**Data**: 2026-06-17
**Contexto**: A Fase 2 precisa gerar QR Code para o link público do cardápio.
**Decisão**: Usar a dependência `qrcode` no cliente para gerar Data URL baixável.
**Alternativas descartadas**: API externa de QR Code; implementar algoritmo QR manualmente; gerar QR no servidor.
**Consequências**:
- QR Code funciona sem serviço externo
- Download é simples no navegador
- Adiciona uma dependência pequena ao bundle do admin

---

## [DEC-014] Dicionário local obrigatório para UI PT/ES

**Data**: 2026-06-17
**Contexto**: Antes da Fase 3, o produto precisa suportar português e espanhol tanto no painel admin quanto no cardápio público.
**Decisão**: Criar um dicionário local em `lib/i18n.ts`, usar `LanguageProvider` no layout raiz e expor um seletor PT/ES fixo. Todo texto fixo novo de UI deve ser cadastrado no dicionário em português e espanhol.
**Alternativas descartadas**: Manter textos hardcoded; adotar biblioteca externa de i18n agora; criar rotas separadas por idioma.
**Consequências**:
- O idioma pode ser trocado rapidamente sem mudar URL
- A base fica preparada para usuários em PT/ES antes da personalização visual
- Novas features precisam atualizar o dicionário na mesma mudança
- Dados cadastrados pelo restaurante não são traduzidos automaticamente

---

## [DEC-015] Tema visual por restaurante com CSS variables

**Data**: 2026-06-18
**Contexto**: A Fase 3 precisa permitir cores customizadas por restaurante sem gerar classes Tailwind dinâmicas inválidas.
**Decisão**: Salvar cores em `restaurant.theme` e aplicá-las no cardápio público via CSS variables (`--restaurant-primary`, `--restaurant-secondary`, `--restaurant-bg`, `--restaurant-text`).
**Alternativas descartadas**: Gerar classes Tailwind em runtime; criar CSS separado por restaurante; limitar personalização apenas a presets fixos.
**Consequências**:
- O cardápio público reflete cores salvas no Firestore sem rebuild manual de CSS
- Presets continuam simples para usuários não técnicos
- Componentes públicos usam tokens fixos para estrutura e CSS variables para identidade do restaurante
- Valores de cor continuam controlados pelo admin, não hardcoded nos componentes

---

## [DEC-016] Estatísticas próprias em Firestore antes de ferramenta externa

**Data**: 2026-06-19
**Contexto**: A Fase 6 precisa entregar estatísticas úteis para donos de restaurante sem adicionar complexidade de configuração, consentimento ou dashboards externos.
**Decisão**: Criar a coleção `analyticsEvents` no Firestore e registrar eventos simples do cardápio público: visita, clique em categoria, produto adicionado, clique no WhatsApp e pedido enviado pelo carrinho. O admin lê os eventos do próprio restaurante e calcula um resumo inicial no cliente.
**Alternativas descartadas**: Google Analytics/GA4, Plausible, logs em Cloud Functions, agregações server-side imediatas.
**Consequências**:
- Entrega rápida, integrada ao Firebase já usado no projeto
- Regras do Firestore conseguem isolar leitura por `restaurantId`
- A primeira versão não depende de cookies externos nem scripts de terceiros
- Futuramente pode evoluir para agregações diárias ou Cloud Functions se o volume crescer

---

## [DEC-017] Primitivas locais de UI antes de uma biblioteca externa

**Data**: 2026-06-23
**Contexto**: Botões, painéis, feedbacks, uploads e modais repetiam classes e
comportamentos em várias telas do admin.
**Decisão**: Criar primitivas pequenas em `components/ui/`, mantendo Tailwind,
Lucide e os tokens existentes. Formulários longos passam a usar modais ou etapas
quando isso reduz carga cognitiva.
**Alternativas descartadas**: Adicionar uma biblioteca completa de componentes;
continuar copiando classes em cada rota; fazer uma refatoração visual sem componentes.
**Consequências**:
- Estados de loading, foco, erro e fechamento ficam consistentes
- Nenhuma dependência adicional entra no bundle
- Produtos, categorias, aparência e informações seguem o mesmo padrão guiado
- Novas abstrações só devem ser criadas quando houver repetição real

---

## Decisões Pendentes

- [ ] Armazenamento de preços: float vs centavos inteiros no Firestore
- [ ] ISR vs SSR para cardápios após migração para Firebase
- [ ] Estratégia de slugs: geração automática ou manual pelo dono?
- [ ] Domínio personalizado: subdomínio (`burgerprime.menulix.com`) ou path (`menulix.com/burgerprime`)?
- [ ] Provedor de pagamento: Stripe, Hotmart, Pagar.me, ou outro?
