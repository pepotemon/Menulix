# 09 — Glossário

> Última atualização: 2026-06-16
> Relacionado: [[01_Project]] | [[02_Architecture]] | [[00_Index]]

---

## Termos do Domínio

| Termo | Definição |
|-------|-----------|
| **Cardápio digital** | Menu de restaurante acessível via link ou QR Code no celular |
| **Slug** | Identificador único amigável na URL (`alexpizzaria`, `burgerprime`) |
| **Tenant** | Cada restaurante é um "tenant" isolado na plataforma multi-tenant |
| **Multi-tenant** | Arquitetura onde múltiplos clientes (restaurantes) compartilham a mesma infraestrutura mas com dados isolados |
| **QR Code** | Código bidimensional escaneável com câmera, usado para acessar o cardápio |
| **Cardápio** | Português para "cardapio" — menu de pratos e preços de um restaurante |
| **Dono** | Proprietário do restaurante — cliente pagante do Menulix |
| **Cliente final** | Consumidor que acessa o cardápio digital do restaurante |
| **Marmitaria** | Restaurante especializado em marmitas (refeições em embalagem portátil) |
| **Lanchonete** | Estabelecimento de lanches rápidos |
| **Açaíteria** | Estabelecimento especializado em açaí (fruta amazônica popular no Brasil) |

---

## Termos Técnicos do Projeto

| Termo | Definição |
|-------|-----------|
| **App Router** | Sistema de roteamento do Next.js 14 baseado na pasta `app/` |
| **SSG** | Static Site Generation — páginas geradas no build, não no runtime |
| **ISR** | Incremental Static Regeneration — atualiza páginas estáticas sob demanda |
| **SSR** | Server-Side Rendering — renderização no servidor a cada request |
| **Design token** | Variável de design (cor, espaçamento) — ex: `leaf`, `tomato`, `ink` |
| **PublicMenu** | Interface TypeScript que agrupa `restaurant + categories + products` |
| **OpeningHours** | Tipo que mapeia dias da semana a períodos de funcionamento |
| **RestaurantTheme** | Objeto com cores personalizadas por restaurante |
| **RestaurantTemplate** | Tipo de template visual usado como preset de cores por segmento |
| **Branding** | Imagens e cores que identificam visualmente o restaurante, como logo e banner |
| **`generateStaticParams`** | Função do Next.js que pré-gera rotas dinâmicas no build |
| **`isActive`** | Flag booleana que controla se um restaurante/categoria/produto está visível |
| **`isFeatured`** | Flag que marca um produto como destaque ou promoção |
| **`isAvailable`** | Flag que controla se um produto pode ser pedido |
| **Firestore** | Banco de dados NoSQL do Firebase (futuro backend do Menulix) |
| **`restaurantId`** | Chave de isolamento multi-tenant em categorias e produtos |

---

## Status de Restaurantes e Produtos

| Status | Campo | Comportamento |
|--------|-------|---------------|
| Restaurante ativo | `isActive: true` | Mostra cardápio normalmente |
| Restaurante inativo | `isActive: false` | Mostra `<InactiveRestaurant>` |
| Produto disponível | `isAvailable: true` | Mostra preço normal |
| Produto indisponível | `isAvailable: false` | Mostra badge "Indisponível" |
| Produto em destaque | `isFeatured: true` | Mostra badge "Destaque" ou "Promoção" |

---

## Termos de Negócio

| Termo | Definição |
|-------|-----------|
| **Plano Inicial** | Pagamento único R$ 49 — 30 produtos, QR Code, link público |
| **Plano Essencial** | R$ 9,90/mês — produtos ilimitados, WhatsApp, estatísticas |
| **Plano Profissional** | R$ 19,90/mês — promoções, banners, sem marca Menulix |
| **Plano Premium** | R$ 29,90/mês — design custom, domínio próprio, estatísticas avançadas |
| **B2B** | Business-to-Business — Menulix vende para restaurantes (não consumidores finais) |
| **SaaS** | Software as a Service — plataforma por assinatura |
| **wa.me** | URL do WhatsApp para abrir conversa direta: `https://wa.me/[número]` |
| **DDI** | Discagem Direta Internacional — para Brasil: +55 |

---

## Abreviações Usadas nos Docs

| Abreviação | Significado |
|------------|-------------|
| BRL | Brazilian Real (Real Brasileiro) — R$ |
| PT-BR | Português do Brasil |
| MVP | Minimum Viable Product |
| SSG | Static Site Generation |
| ISR | Incremental Static Regeneration |
| CRUD | Create, Read, Update, Delete |
| DEC | Decisão técnica (prefixo em 03_Decisions.md) |
| ERR | Erro registrado (prefixo em 04_Errors.md) |
| WARN | Aviso preventivo (prefixo em 04_Errors.md) |
