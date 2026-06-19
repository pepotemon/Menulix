# Menulix — Second Brain Index

> Este é o mapa central de todo o conhecimento do projeto Menulix.
> Criado em: 2026-06-16
> Última atualização: 2026-06-18

---

## Navegação Rápida

| # | Documento | Descrição |
|---|-----------|-----------|
| [[01_Project]] | Visão Geral do Projeto | O que é, para quem, proposta de valor |
| [[02_Architecture]] | Arquitetura Técnica | Stack, estrutura, fluxo de dados |
| [[03_Decisions]] | Decisões Técnicas | Por que escolhemos X em vez de Y |
| [[04_Errors]] | Erros e Soluções | Bugs encontrados e como foram resolvidos |
| [[05_Ideas]] | Ideias e Backlog | Ideias futuras, features pendentes |
| [[06_Changelog]] | Histórico de Mudanças | O que mudou, quando e por quê |
| [[07_Prompts]] | Prompts para IA | Prompts úteis para Claude Code |
| [[08_Workflows]] | Fluxos de Trabalho | Como executar tarefas comuns |
| [[09_Glossary]] | Glossário | Termos e conceitos do domínio |

---

## Estado Atual do Projeto

```
Fase atual:    FASE 3 — Personalização visual 🚧 (em pausa para polimento)
               FASE 5 — Carrinho + WhatsApp ✅ implementada
               FASE 6 — Estatísticas 🚧 em desenvolvimento
Próxima fase:  FASE 4 — Planos e monetização (adiada) | FASE 7 — Admin interno
Firebase:      Firestore + Auth + Storage conectados + cache offline IndexedDB ativo
Deploy:        Vercel (variáveis de ambiente pendentes de configuração)
```

---

## Fases do Projeto

- [x] **FASE 1** — MVP público do cardápio digital
- [x] **FASE 2** — Painel administrativo básico
- [ ] **FASE 3** — Personalização visual 🚧 (em pausa para polimento)
- [ ] **FASE 4** — Planos e monetização ⏳ (adiada)
- [x] **FASE 5** — Carrinho + pedidos por WhatsApp ✅
- [ ] **FASE 6** — Estatísticas 🚧
- [ ] **FASE 7** — Admin interno Menulix

---

## Links Rápidos por Tema

### Stack
- Next.js 14 App Router → [[02_Architecture#Stack]]
- TypeScript Strict → [[02_Architecture#TypeScript]]
- Tailwind CSS + Design Tokens → [[02_Architecture#Design System]]

### Domínio
- Modelo de dados → [[02_Architecture#Data Model]]
- Restaurantes de exemplo → [[01_Project#Dados de Exemplo]]
- Slugs únicos → [[03_Decisions#Slugs]]

### Daily Notes
- [[Daily/]] — Notas diárias de desenvolvimento

---

## Como usar este Second Brain

1. **Antes de uma tarefa importante** → Leia [[02_Architecture]] e [[03_Decisions]]
2. **Após resolver um bug** → Atualize [[04_Errors]]
3. **Após uma mudança significativa** → Atualize [[06_Changelog]]
4. **Nova ideia** → Adicione em [[05_Ideas]]
5. **Decisão técnica nova** → Registre em [[03_Decisions]]
