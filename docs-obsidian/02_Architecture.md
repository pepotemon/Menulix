# 02 — Arquitetura Técnica

> Última atualização: 2026-06-16
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
| Auth (futuro) | Firebase Auth | — |
| Database | Firestore | ✅ conectado (projeto: menulix-77e45) |
| Storage | Firebase Storage | configurado (domínio no next.config) |
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
│   └── [slug]/
│       └── page.tsx             # Rota pública do restaurante
│
├── components/
│   └── public-menu/             # Componentes da fase 1
│       ├── public-menu-page.tsx     # Layout principal
│       ├── restaurant-header.tsx    # Hero + info
│       ├── category-section.tsx     # Grid de categorias
│       ├── product-card.tsx         # Card de produto
│       ├── opening-hours.tsx        # Horários (sidebar)
│       ├── status-pill.tsx          # Badge aberto/fechado
│       ├── whatsapp-button.tsx      # CTA WhatsApp
│       └── inactive-restaurant.tsx  # Estado inativo
│
├── lib/
│   ├── menu-data.ts             # Dados mockados + funções de query
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

## Data Model

### `Restaurant`
```typescript
{
  id: string
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

## Coleções no Firestore

| Coleção | Documentos | Isolamento |
|---------|-----------|-----------|
| `restaurants` | Um por restaurante | Por documento |
| `categories` | Todas as categorias | Por `restaurantId` |
| `products` | Todos os produtos | Por `restaurantId` |

## Regras de Segurança (`firestore.rules`)

- Leitura pública em todas as coleções
- Escrita bloqueada (será liberada por Auth na Fase 2)
- Gerenciadas via Firebase CLI: `firebase deploy --only firestore:rules`

## Utilitários Principais (`lib/menu-utils.ts`)

| Função | Propósito |
|--------|-----------|
| `formatCurrencyBRL(value)` | "R$ 29,90" |
| `isRestaurantOpen(hours)` | Boolean baseado no horário atual |
| `getTodaysOpeningLabel(hours)` | "18:00 às 23:00" ou "Fechado hoje" |
| `buildWhatsappUrl(number, name)` | URL wa.me com mensagem pré-formatada |
| `normalizeWhatsappNumber(num)` | Remove formatação, só dígitos |
| `formatWeeklyOpeningHours(hours)` | Array para exibição na sidebar |

---

## Integração WhatsApp

Mensagem padrão ao clicar no botão:
> "Olá, vim pelo cardápio digital da Menulix e gostaria de fazer um pedido."

URL gerada: `https://wa.me/[number]?text=[encoded_message]`

---

## Configurações de Imagem

`next.config.mjs` permite imagens remotas de:
- `images.unsplash.com` (usado nos dados mockados)

Para produção, adicionar domínio do Firebase Storage.

---

## Preparação Multi-Tenant

Cada `Category` e `Product` tem `restaurantId` como chave estrangeira. Isso garante isolamento de dados por tenant ao migrar para Firestore.

Regras futuras do Firestore devem verificar `restaurantId === auth.uid` ou similar.
