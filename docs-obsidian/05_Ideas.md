# 05 — Ideias e Backlog

> Última atualização: 2026-06-18
> Relacionado: [[01_Project]] | [[06_Changelog]] | [[03_Decisions]]

---

## Legenda de Status

| Símbolo | Status |
|---------|--------|
| 💡 | Ideia nova, não avaliada |
| 🔍 | Em análise |
| ✅ | Aprovada, vai para backlog |
| ❌ | Descartada |
| 🚧 | Em desenvolvimento |
| ✔️ | Implementada |

---

## Fase 2 — Painel Administrativo

✅ **Login com Firebase Auth**
✅ **CRUD de restaurantes** (criar, editar, ativar/desativar)
✅ **CRUD de categorias**
✅ **CRUD de produtos** com upload de imagem
✅ **Preview do cardápio** antes de publicar
✅ **Copiar link público**
✅ **Gerar QR Code para download**

---

## Fase 3 — Personalização Visual

🚧 **Cores customizadas** por restaurante (primária, secundária, fundo)
🚧 **Templates por tipo de negócio**:
- Pizzaria, Hamburgueria, Açaí, Marmitaria, Cafeteria, Sushi, Doceria
💡 **Modo claro/escuro** opcional
🚧 **Upload de banner e logo** diretamente no painel

---

## Fase 5 — Carrinho e Pedidos WhatsApp ✔️ Implementada

✔️ **Carrinho simples**: adicionar/remover produtos, quantidade
✔️ **Mensagem formatada no WhatsApp**:
```
Olá! Gostaria de fazer o seguinte pedido:

1x X-Burger — R$ 18,00
2x Coca-Cola — R$ 12,00

Total: R$ 30,00

Nome:
Endereço:
Forma de pagamento:
```

---

## Fase 6 — Estatísticas 🚧 Em desenvolvimento

🚧 **Eventos públicos simples**:
- Visita ao cardápio
- Clique em categoria
- Produto adicionado ao carrinho
- Clique no WhatsApp
- Pedido enviado pelo carrinho

🚧 **Painel de estatísticas no admin**:
- Visitas ao cardápio
- Produtos mais clicados
- Cliques no WhatsApp
- Pedidos enviados
- Total estimado dos pedidos enviados
- Atividade recente

---

## Ideias Futuras (Não Planejadas)

### 💡 Cardápio em múltiplos idiomas
Permitir que o restaurante cadastre nome/descrição em PT + EN + ES.

### 💡 Busca de produtos no cardápio
Campo de busca em tempo real no cardápio público — útil para cardápios grandes.

### 💡 Integração com iFood / Rappi
Importar produtos de outros sistemas via API ou CSV.

### 💡 Modo kiosk (tablet no balcão)
Layout específico para uso em tablet no próprio estabelecimento.

### 💡 Avaliações de produtos
Cliente avalia produto com emoji (👍 👎) — sem login necessário.

### 💡 Cardápio por período
Café da manhã, almoço, jantar — mostra só o menu relevante no horário atual.

### 💡 Domínio personalizado
`cardapio.alexpizzaria.com.br` aponta para Menulix.

### 💡 Integração com Google Business
Adicionar link do cardápio digital direto no perfil do Google Maps.

### 💡 Notificações de pedido via webhook
Quando cliente envia pedido por WhatsApp, registrar no sistema via webhook.

### 💡 Programa de fidelidade simples
Rastrea quantas vezes o mesmo número de WhatsApp fez pedidos.

### 🔍 Progressive Web App (PWA)
Permitir que clientes salvem o cardápio na tela inicial do celular.

---

## Melhorias Técnicas

### 💡 Migração para Turborepo
Se o projeto crescer com múltiplos apps (admin, public, functions), Turborepo pode ajudar.

### 💡 Testes automatizados
Vitest para utilitários (`menu-utils.ts`) e Playwright para E2E dos cardápios.

### 💡 Storybook para componentes
Documentar visualmente os componentes da `public-menu/`.

### ✅ ISR (Incremental Static Regeneration)
Regenerar páginas de restaurante automaticamente quando dados mudam no Firestore.
