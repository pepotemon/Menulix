# 01 — Visão Geral do Projeto

> Última atualização: 2026-06-16
> Relacionado: [[00_Index]] | [[02_Architecture]] | [[09_Glossary]]

---

## O que é Menulix

Menulix é uma plataforma SaaS B2B para criação de **cardápios digitais profissionais** para pequenos negócios de alimentação no Brasil.

**Proposta de valor central:**
> "Criamos seu cardápio digital profissional com QR Code, link próprio e visual personalizado, para seus clientes acessarem pelo celular e fazerem pedidos pelo WhatsApp."

**Importante:** Não vender como "página web". Vender como **"cardápio digital inteligente"**.

---

## Público-Alvo

### Clientes (restaurantes)
- Pizzarias
- Lanchonetes
- Marmitarias
- Hamburguerias
- Cafeterias
- Açaiterias
- Padarias
- Food trucks
- Pequenos negócios de comida no Brasil

### Clientes finais (consumidores)
- Clientes do restaurante que escaneiam QR Code ou acessam link

---

## Como Funciona

Cada restaurante tem seu próprio cardápio dentro da plataforma:

```
menulix.com/alexpizzaria
menulix.com/marmitariadadona
menulix.com/burgerprime
```

O dono do restaurante acessa um painel admin para gerenciar:
- Produtos, categorias, preços, fotos
- Horários de funcionamento
- WhatsApp, Instagram
- Promoções e design visual

---

## Modelo de Negócio

| Plano | Preço | Limite |
|-------|-------|--------|
| Inicial | R$ 49 (único) | 30 produtos, QR Code, link |
| Essencial | R$ 9,90/mês | Ilimitado, WhatsApp, estatísticas básicas |
| Profissional | R$ 19,90/mês | Promoções, banners, sem marca Menulix |
| Premium | R$ 29,90/mês | Design custom, domínio próprio (futuro) |

---

## Dados de Exemplo

### Alex Pizzaria (ativa)
- **Slug**: `alexpizzaria`
- **Localização**: São Paulo, SP
- **WhatsApp**: +55 11 99999-0000
- **Instagram**: alexpizzaria
- **Horários**: Segunda a Sábado 18:00-23:00 / Domingo 12:00-22:00
- **Categorias**: Pizzas, Bebidas, Combos
- **Produtos**: 6 itens com imagens do Unsplash

### Restaurante em Ajuste (inativa)
- **Slug**: `restaurante-em-ajuste`
- **Estado**: `isActive: false`
- Usado para demonstrar o estado de restaurante inativo

---

## URLs do Produto

- **Cardápio público**: `menulix.com/[slug]`
- **Painel admin** (futuro): `menulix.com/app`
- **Admin interno** (futuro): `menulix.com/admin`

---

## Mercado Alvo

- **Foco inicial**: Brasil
- **Idioma**: Português (pt-BR)
- **Moeda**: BRL (R$)
- **WhatsApp**: Principal canal de pedidos no Brasil
- **QR Code**: Essencial para restaurantes presenciais
