# 04 — Erros e Soluções

> Última atualização: 2026-06-16
> Relacionado: [[03_Decisions]] | [[06_Changelog]] | [[02_Architecture]]

---

## Como registrar um erro

```
## [ERR-XXX] Título do erro

**Data**: AAAA-MM-DD
**Arquivo**: caminho/do/arquivo.ts
**Sintoma**: O que aconteceu?
**Causa raiz**: Por que aconteceu?
**Solução**: O que foi feito?
**Prevenção**: Como evitar no futuro?
```

---

## Erros Registrados

### [ERR-004] Modal de produtos salvava ao chegar na última etapa

**Data**: 2026-06-22
**Arquivo**: `app/admin/produtos/page.tsx`
**Sintoma**: Ao avançar até a última etapa do formulário guiado de produtos, o produto era salvo automaticamente e o usuário não conseguia preencher foto, disponibilidade ou destaque.
**Causa raiz**: O modal usava um `<form>` com botão final `type="submit"`. Na troca de etapa, o controle de avanço e o botão de submit ocupavam o mesmo fluxo visual, permitindo envio involuntário em alguns cenários de clique/toque.
**Solução**: Remover o submit automático do formulário e trocar o salvamento para uma ação explícita (`handleSave`) chamada apenas pelo botão "Salvar" no último passo.
**Prevenção**: Em formulários por etapas, botões de navegação e salvamento devem ser sempre `type="button"`; o formulário pode apenas prevenir submit padrão.

---

### [ERR-003] Preview de aparência não atualizava logo e banner selecionados

**Data**: 2026-06-19
**Arquivo**: `app/admin/aparencia/page.tsx`, `components/public-menu/restaurant-header.tsx`
**Sintoma**: Ao selecionar arquivo de logo ou banner no painel de aparência, a vista prévia continuava mostrando as imagens antigas. A área de perfil/header também ficava pouco otimizada em telas menores.
**Causa raiz**: A preview usava apenas `form.logoUrl` e `form.bannerUrl`, que representam URLs já salvas. Arquivos recém-selecionados ficavam apenas em estado separado (`logoFile`/`bannerFile`) e não geravam preview local. O header público tinha proporções rígidas para mobile.
**Solução**: Criada preview instantânea via `URL.createObjectURL()` para logo e banner selecionados, atualização do formulário com as URLs finais após salvar e polimento visual da preview/admin e do header público.
**Prevenção**: Quando houver upload de imagem no admin, sempre exibir preview local do arquivo selecionado antes do upload e validar o layout em mobile.

---

### [ERR-002] Inputs numéricos do admin não podiam ficar vazios

**Data**: 2026-06-17
**Arquivo**: `app/admin/produtos/page.tsx`, `app/admin/categorias/page.tsx`
**Sintoma**: Ao criar produto ou categoria, os campos numéricos de preço e ordem começavam com `0` ou outro número e era incômodo apagar o valor para digitar.
**Causa raiz**: Os inputs eram controlados diretamente por valores `number`; quando o usuário limpava o campo, o React convertia `""` para `0`.
**Solução**: Usar estado textual temporário para os inputs numéricos e converter para número apenas no submit.
**Prevenção**: Em formulários com inputs numéricos editáveis, manter o valor digitado como string até a validação/salvamento.

---

### [ERR-001] Imagens externas bloqueadas pelo Next.js

**Data**: 2026-06-16 (Fase 1)
**Arquivo**: `next.config.mjs`
**Sintoma**: Imagens do Unsplash não carregavam; erro `Invalid src prop` no console.
**Causa raiz**: Next.js bloqueia por padrão `<Image>` com domínios externos não configurados.
**Solução**:
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ]
  }
}
```
**Prevenção**: Ao adicionar novos provedores de imagem (Firebase Storage, Cloudinary), lembrar de adicionar o hostname aqui.

---

## Erros Potenciais / Prevenção

### [WARN-001] Slug não normalizado pode causar duplicatas

**Status**: Prevenção pendente (Fase 2)
**Risco**: Se o dono digitar "Alex Pizzaria" como slug, pode colidir com "alex-pizzaria" ou "alexpizzaria".
**Solução futura**: No painel admin (Fase 2), normalizar automaticamente:
```typescript
slug = nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
```

---

### [WARN-002] Preços float podem gerar inconsistências

**Status**: Prevenção pendente (Fase 4 — migração para Firestore)
**Risco**: `0.1 + 0.2 = 0.30000000000000004` em JavaScript.
**Solução futura**: Armazenar preços em centavos inteiros no Firestore:
```typescript
// Salvar: price = 2990 (centavos)
// Exibir: formatCurrencyBRL(price / 100)
```

---

### [WARN-003] `isRestaurantOpen()` depende do timezone do servidor

**Status**: Monitorar ao migrar para SSR/Firebase
**Risco**: Se a página for renderizada em servidor com timezone diferente (UTC), o status "aberto/fechado" pode ser incorreto.
**Solução futura**: Forçar timezone de Brasília (America/Sao_Paulo) no cálculo de horário, ou mover lógica para o cliente.

---

### [WARN-004] `generateStaticParams` não inclui restaurantes novos

**Status**: Limitação conhecida da Fase 1
**Risco**: Restaurantes criados após o build não têm página gerada.
**Solução futura**: Adicionar `export const dynamicParams = true` na rota `[slug]` para fallback dinâmico, ou usar ISR com `revalidate`.

---

## Template para Novo Erro

```markdown
## [ERR-XXX] Título

**Data**: 
**Arquivo**: 
**Sintoma**: 
**Causa raiz**: 
**Solução**: 
**Prevenção**: 
```
