# 02 — Arquitetura Técnica

> Última atualização: 2026-06-18
> Relacionado: [[00_Index]] | [[03_Decisions]] | [[01_Project]]

---

## Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router) | 14.2.5 |
| Linguagem | TypeScript (strict) | 5.5.3 |
| Estilização | Tailwind CSS | 3.4.4 |
| Ícones | Lucide React | 0.468.0 |
| Runtime | React | 18.3.1 |
| Auth | Firebase Auth | Fase 2 |
| Database | Firestore | ✅ conectado (projeto: menulix-77e45) |
| Storage | Firebase Storage | upload de imagens de produto |
| QR Code | qrcode | geração client-side |
| i18n | Dicionário local | PT-BR + ES |
| Deploy (futuro) | Vercel ou Firebase Hosting | — |
| CLI | Firebase Tools | 15.20.0 |

---

## Estrutura de Arquivos

```
Menulix/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (HTML, metadata, CSS)
│   ├── globals.css              # CSS global + design base
│   ├── not-found.tsx            # Página 404 global
│   ├── admin/
│   │   ├── layout.tsx           # AuthProvider + AdminShell
│   │   ├── login/page.tsx       # Login Firebase Auth
│   │   ├── page.tsx             # Meu cardápio: ações, status, link e QR
│   │   ├── aparencia/page.tsx   # Fase 3: cores, template, logo e banner
│   │   ├── estatisticas/page.tsx # Fase 6: métricas simples do cardápio
│   │   ├── restaurante/page.tsx # CRUD de informações do restaurante
│   │   ├── categorias/page.tsx  # CRUD de categorias
│   │   └── produtos/page.tsx    # CRUD de produtos + upload de imagem
│   └── [slug]/
│       └── page.tsx             # Rota pública do restaurante
│
├── components/
│   ├── language-provider.tsx     # Estado global de idioma
│   ├── language-switcher.tsx     # Botão PT/ES fixo
│   ├── admin/                   # Componentes da fase 2
│   │   ├── auth-provider.tsx    # Sessão Firebase Auth no cliente
│   │   ├── admin-data-provider.tsx # Dados do restaurante autenticado
│   │   ├── admin-shell.tsx      # Layout protegido + navegação
│   │   ├── admin-page-header.tsx
│   │   └── public-link-panel.tsx # Copiar link + QR Code
│   └── public-menu/             # Componentes da fase 1 + fase 5
│       ├── public-menu-page.tsx     # Layout principal (wraps CartProvider)
│       ├── restaurant-header.tsx    # Hero + info
│       ├── category-section.tsx     # Grid de categorias
│       ├── product-card.tsx         # Card de produto + controles de carrinho
│       ├── opening-hours.tsx        # Horários (sidebar)
│       ├── status-pill.tsx          # Badge aberto/fechado
│       ├── whatsapp-button.tsx      # CTA WhatsApp simples
│       ├── inactive-restaurant.tsx  # Estado inativo
│       ├── cart-provider.tsx        # Contexto do carrinho (localStorage)
│       ├── cart-button.tsx          # Botão flutuante com total e contagem
│       └── cart-drawer.tsx          # Painel lateral com itens e pedido WA
│
├── lib/
│   ├── admin-firestore.ts       # CRUD admin + upload Storage
│   ├── firebase.ts              # Firebase app, Auth, Firestore e Storage
│   ├── analytics.ts             # Eventos e agregações de estatísticas
│   ├── firestore.ts             # Queries públicas do cardápio
│   ├── i18n.ts                  # Dicionário PT/ES e tipos de tradução
│   ├── menu-data.ts             # Dados mockados de referência
│   └── menu-utils.ts            # Utilitários: moeda, horários, WhatsApp
│
├── types/
│   └── menu.ts                  # Interfaces TypeScript
│
└── docs-obsidian/               # Second Brain (este sistema)
```

---

## TypeScript

TypeScript está configurado com `strict: true`. Path aliases:
- `@/*` → raiz do projeto

Todos os tipos estão centralizados em `types/menu.ts`.

---

## Internacionalização (PT/ES)

- Dicionário central: `lib/i18n.ts`
- Provider global: `components/language-provider.tsx`
- Seletor visual: `components/language-switcher.tsx` — **visível apenas no painel admin** (sidebar)
- Idioma padrão: `pt`
- Idioma escolhido fica salvo em `localStorage`
- No cardápio público: idioma detectado automaticamente pelo `navigator.language` do browser
- Todo texto fixo novo de UI deve ser cadastrado nas chaves `pt` e `es`
- Dados de restaurante, categorias e produtos não são traduzidos automaticamente

---

## Data Model

### `Restaurant`
```typescript
{
  id: string
  ownerId?: string       // uid do Firebase Auth que administra o restaurante
  slug: string           // único, usado na URL
  name: string
  description: string
  logoUrl: string
  bannerUrl: string
  whatsapp: string       // com DDI: +55 11 99999-0000
  instagram?: string
  address: string
  city: string
  state: string
  isActive: boolean
  template?: RestaurantTemplate
  theme: RestaurantTheme
  openingHours: OpeningHours
  createdAt: Date
  updatedAt: Date
}
```

### `Category`
```typescript
{
  id: string
  restaurantId: string   // multi-tenant FK
  name: string
  order: number
  isActive: boolean
}
```

### `Product`
```typescript
{
  id: string
  restaurantId: string   // multi-tenant FK
  categoryId: string
  name: string
  description: string
  price: number          // em centavos ou float (ex: 29.90)
  imageUrl: string
  isAvailable: boolean
  isFeatured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}
```

### `OpeningHours`
```typescript
// Chaves: "monday" | "tuesday" | ... | "sunday"
// Valor: array de períodos { opens: "HH:MM", closes: "HH:MM" }
type OpeningHours = Partial<Record<Weekday, OpeningPeriod[]>>
```

### `RestaurantTheme`
```typescript
{
  primaryColor: string    // ex: "#1F8A70"
  secondaryColor: string
  backgroundColor: string
  textColor: string
}
```

### `RestaurantTemplate`
```typescript
"pizzaria" | "hamburgueria" | "acai" | "marmitaria" | "cafeteria" | "sushi" | "doceria"
```

### `CartItem` (Fase 5 — client-side only)
```typescript
{
  product: Product
  quantity: number
}
```

### `AnalyticsEvent` (Fase 6)
```typescript
{
  id: string
  restaurantId: string
  type: "menu_view" | "category_click" | "product_click" | "whatsapp_click" | "cart_order_sent"
  productId?: string
  productName?: string
  categoryId?: string
  categoryName?: string
  total?: number
  itemCount?: number
  language?: string
  createdAt: string
}
```

### `AnalyticsSummary` (Fase 6)
```typescript
{
  menuViews: number
  categoryClicks: number
  productClicks: number
  whatsappClicks: number
  cartOrdersSent: number
  estimatedRevenue: number
  topProducts: Array<{ productId: string; productName: string; clicks: number }>
  recentEvents: AnalyticsEvent[]
}
```

---

## Design System

### Cores (Tailwind)
| Token | Hex | Uso |
|-------|-----|-----|
| `leaf` | #1F8A70 | Cor primária, CTAs, WhatsApp |
| `tomato` | #D94E35 | Destaque, erros, fechado |
| `ink` | #1E2528 | Texto principal |
| `cream` | #FFF7EC | Background, cards |
| `line` | #E7E2D8 | Bordas, divisores |

### Sombra customizada
```
shadow-soft: 0 18px 50px rgba(0,0,0,0.12)
```

### Tipografia
- Sistema operacional (system-ui, -apple-system, sans-serif)
- Pesos: 400, 500, 600, 700, 900

### Breakpoints
- Mobile-first (base → sm → md → lg)
- sm: 640px / md: 768px / lg: 1024px

---

## Fluxo de Dados (Fase 1 — com Firestore)

```
1. URL: /alexpizzaria
2. [slug]/page.tsx (async) → getPublicMenuBySlug("alexpizzaria")
3. lib/firestore.ts → query Firestore: restaurants where slug == "alexpizzaria"
4. Promise.all → busca categories + products em paralelo
5. Se null → renderiza not-found
6. Se isActive=false → renderiza <InactiveRestaurant>
7. Se ativo → renderiza <PublicMenuPage>
8. PublicMenuPage → distribui dados para sub-componentes
```

**ISR**: `export const revalidate = 60` — página cacheada, regenerada a cada 60s.

---

## Fluxo de Admin (Fase 2)

```
1. URL: /admin/login
2. app/admin/layout.tsx → AuthProvider + AdminShell
3. components/admin/auth-provider.tsx → onAuthStateChanged(Firebase Auth)
4. Login com e-mail/senha → signInWithEmailAndPassword
5. Rotas /admin/* sem usuário → redirect client-side para /admin/login
6. AdminDataProvider → busca/cria restaurante por ownerId
7. Usuário autenticado → "Meu cardápio", CRUD e QR Code
```

O painel usa linguagem simples para o restaurante: "Meu cardápio", "Produtos",
"Categorias" e "Informações". O isolamento técnico é feito por `ownerId`.

---

## Geração Estática (SSG)

A página `/[slug]` usa `generateStaticParams()` para pré-renderizar todas as rotas no build:

```typescript
export async function generateStaticParams() {
  return getKnownRestaurantSlugs().map(slug => ({ slug }))
}
```

Isso garante performance máxima e funcionamento sem banco de dados em tempo de execução.

---

## Arquivos de Consulta ao Firestore (`lib/firestore.ts`)

| Função | Propósito |
|--------|-----------|
| `getPublicMenuBySlug(slug)` | Busca restaurante + categorias + produtos |
| `getKnownRestaurantSlugs()` | Lista slugs ativos para `generateStaticParams` |

Queries usam apenas filtros simples (`where`) sem índices compostos.
Ordenação feita client-side para evitar criação de índices no Firestore.

## Arquivos Admin (`lib/admin-firestore.ts`)

| Função | Propósito |
|--------|-----------|
| `getAdminMenuData(ownerId)` | Busca/cria restaurante e carrega categorias + produtos |
| `saveRestaurant(id, input)` | Atualiza dados públicos do restaurante |
| `createCategory/updateCategory/deleteCategory` | CRUD de categorias |
| `createProduct/updateProduct/deleteProduct` | CRUD de produtos |
| `uploadProductImage(restaurantId, file)` | Upload para Firebase Storage |
| `saveAppearance(id, input)` | Atualiza template, tema, logo e banner |
| `uploadRestaurantAsset(id, kind, file)` | Upload de logo/banner para Storage |
| `slugifyRestaurantName(value)` | Normaliza slug editável |

## Arquivos de Estatísticas (`lib/analytics.ts`)

| Função | Propósito |
|--------|-----------|
| `trackAnalyticsEvent(input)` | Registra eventos públicos do cardápio em `analyticsEvents` |
| `getRestaurantAnalytics(restaurantId)` | Lê eventos do restaurante e calcula o resumo do admin |

## Coleções no Firestore

| Coleção | Documentos | Isolamento |
|---------|-----------|-----------|
| `restaurants` | Um por restaurante | `ownerId` |
| `categories` | Todas as categorias | Por `restaurantId` |
| `products` | Todos os produtos | Por `restaurantId` |
| `analyticsEvents` | Eventos de uso do cardápio | Por `restaurantId` |

## Regras de Segurança (`firestore.rules`)

- Leitura pública em todas as coleções
- Escrita de `restaurants` apenas quando `ownerId == request.auth.uid`
- Escrita de `categories` e `products` apenas quando o restaurante pertence ao usuário
- Criação pública de `analyticsEvents` com tipos permitidos
- Leitura de `analyticsEvents` apenas quando o restaurante pertence ao usuário
- Delete de restaurante bloqueado
- Deploy pendente de reautenticação do Firebase CLI

## Regras de Storage (`storage.rules`)

- Leitura pública para imagens em `restaurants/{restaurantId}/products/{fileName}`
- Leitura pública para branding em `restaurants/{restaurantId}/branding/{fileName}`
- Escrita apenas pelo dono autenticado do restaurante
- Limite de 5 MB por arquivo
- Apenas `contentType` de imagem

## Utilitários Principais (`lib/menu-utils.ts`)

| Função | Propósito |
|--------|-----------|
| `formatCurrencyBRL(value)` | "R$ 29,90" |
| `isRestaurantOpen(hours)` | Boolean baseado no horário atual |
| `getTodaysOpeningLabel(hours, date, language)` | Label traduzido de horário do dia |
| `buildWhatsappUrl(number, name, language)` | URL wa.me com mensagem simples de contato |
| `buildWhatsappOrderUrl(phone, items, language)` | URL wa.me com pedido formatado do carrinho |
| `normalizeWhatsappNumber(num)` | Remove formatação, só dígitos |
| `formatWeeklyOpeningHours(hours, language)` | Array traduzido para exibição na sidebar |

---

## Carrinho de Pedidos (Fase 5)

- Estado gerenciado por `CartProvider` (React Context + localStorage por restaurante)
- Chave de storage: `menulix-cart-{restaurantId}` — isola carrinhos entre restaurantes
- `CartButton`: botão flutuante, aparece apenas com items no carrinho
- `CartDrawer`: painel lateral com controles de quantidade e botão de pedido WhatsApp
- Mensagem formatada gerada por `buildWhatsappOrderUrl()` com itens, quantidades e total
- Sem persistência em banco de dados — carrinho é 100% client-side

---

## Estatísticas (Fase 6)

- Rota admin: `/admin/estatisticas`
- Navegação adicionada no painel admin como "Estatísticas"
- Eventos registrados no cardápio público:
  - `menu_view`: cliente abriu o cardápio
  - `category_click`: cliente tocou em uma categoria
  - `product_click`: cliente adicionou produto ao carrinho
  - `whatsapp_click`: cliente abriu o WhatsApp pelo CTA simples
  - `cart_order_sent`: cliente enviou pedido pelo carrinho
- O painel mostra visitas, produtos clicados, cliques no WhatsApp, pedidos enviados, total estimado e atividade recente
- A primeira versão calcula agregações no cliente a partir dos eventos lidos do Firestore
- Eventos não bloqueiam navegação nem pedido: falhas de analytics são ignoradas no fluxo público

---

## Integração WhatsApp

Dois fluxos:

**Contato simples** (botão na sidebar do cardápio):
> "Olá, vim pelo cardápio digital da Menulix e gostaria de fazer um pedido."

**Pedido pelo carrinho** (botão no CartDrawer):
```
Olá! Gostaria de fazer o seguinte pedido:

1x X-Burger — R$ 18,00
2x Coca-Cola — R$ 12,00

Total: R$ 30,00

Nome:
Endereço:
Forma de pagamento:
```

URL gerada: `https://wa.me/[number]?text=[encoded_message]`

---

## Configurações de Imagem

`next.config.mjs` permite imagens remotas de:
- `images.unsplash.com` (usado nos dados mockados)

Firebase Storage já está permitido em `next.config.mjs`.

## Personalização Visual (Fase 3)

- Tela admin: `/admin/aparencia`
- Presets por tipo de restaurante em `app/admin/aparencia/page.tsx`
- Cores salvas em `restaurant.theme`
- Template salvo em `restaurant.template`
- Logo e banner salvos em `restaurant.logoUrl` e `restaurant.bannerUrl`
- Cardápio público aplica cores via CSS variables:
  - `--restaurant-primary`
  - `--restaurant-secondary`
  - `--restaurant-bg`
  - `--restaurant-text`

---

## Preparação Multi-Tenant

Cada `Category` e `Product` tem `restaurantId` como chave estrangeira.
Cada `Restaurant` administrável tem `ownerId`, que aponta para o `uid` do Firebase Auth.
As regras verificam ownership antes de permitir escrita.
