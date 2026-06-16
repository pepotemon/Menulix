# 07 — Prompts para Claude Code

> Última atualização: 2026-06-16
> Relacionado: [[08_Workflows]] | [[00_Index]] | [[02_Architecture]]

---

## Como usar estes prompts

Estes prompts são otimizados para Claude Code. Use-os no início de uma sessão de trabalho ou quando precisar de tarefas específicas.

---

## Prompts de Contexto (Início de Sessão)

### Carregar contexto completo
```
Leia AGENTS.md e os arquivos em docs-obsidian/ (especialmente 00_Index.md, 
02_Architecture.md e 06_Changelog.md) para entender o estado atual do projeto 
Menulix antes de qualquer tarefa.
```

### Carregar contexto de fase específica
```
Leia AGENTS.md, docs-obsidian/02_Architecture.md e docs-obsidian/03_Decisions.md. 
Vamos trabalhar na [FASE X] do Menulix. Antes de programar, analise a estrutura 
atual do projeto e confirme o que já existe.
```

---

## Prompts de Desenvolvimento por Fase

### Iniciar Fase 2 — Painel Admin
```
Analise o projeto Menulix atual (leia AGENTS.md e docs-obsidian/ primeiro).
Vamos implementar a FASE 2 — Painel Administrativo.

Antes de programar:
1. Revise a estrutura atual em app/ e components/
2. Identifique o que já existe vs o que precisa ser criado
3. Proponha a estrutura de arquivos para /app (painel admin)
4. Liste os componentes necessários
5. Confirme comigo antes de começar a implementar

Não avance sem minha aprovação do plano.
```

### Integrar Firebase
```
Analise o projeto Menulix (leia AGENTS.md e docs-obsidian/02_Architecture.md).
Vamos integrar Firebase ao projeto.

Stack alvo: Firebase Auth + Firestore + Storage
Modelo de dados: ver docs-obsidian/02_Architecture.md#Data Model

Antes de tocar em código:
1. Revise o modelo de dados atual em types/menu.ts
2. Identifique todas as funções em lib/menu-data.ts que precisam de migração
3. Proponha a estrutura das collections no Firestore
4. Proponha as security rules básicas
5. Confirme o plano comigo antes de implementar
```

---

## Prompts de Manutenção do Second Brain

### Atualizar após mudanças
```
Analise as mudanças recentes no projeto Menulix e atualize a documentação:

1. Verifique quais arquivos foram modificados
2. Atualize docs-obsidian/06_Changelog.md com as mudanças
3. Se houver novas decisões técnicas, adicione em docs-obsidian/03_Decisions.md
4. Se houver erros resolvidos, registre em docs-obsidian/04_Errors.md
5. Se a arquitetura mudou, atualize docs-obsidian/02_Architecture.md
6. Crie uma nota diária em docs-obsidian/Daily/AAAA-MM-DD.md

Não modifique código. Apenas documentação.
```

### Criar nota diária
```
Crie uma nota diária em docs-obsidian/Daily/ com a data de hoje.
Documente: o que foi feito, decisões tomadas, problemas encontrados e próximos passos.
Use links internos para outros documentos do Second Brain quando relevante.
```

### Revisar estado do projeto
```
Faça uma análise do estado atual do projeto Menulix:
1. Leia todos os arquivos em docs-obsidian/
2. Leia os arquivos principais de código (types/, lib/, app/, components/)
3. Compare o estado documentado com o estado real do código
4. Liste discrepâncias entre documentação e código
5. Sugira atualizações na documentação
```

---

## Prompts de Debug

### Investigar erro
```
Analise o seguinte erro no projeto Menulix:
[COLE O ERRO AQUI]

1. Leia o arquivo relevante
2. Identifique a causa raiz
3. Proponha a solução
4. Após resolver, registre em docs-obsidian/04_Errors.md
```

### Code review de componente
```
Faça um code review do componente [NOME] em [CAMINHO].
Verifique:
- TypeScript correto (sem any, tipos completos)
- Acessibilidade (aria-*, alt, role)
- Mobile-first responsividade
- Uso correto dos design tokens (leaf, tomato, ink, cream, line)
- Separação de lógica e UI
- Loading states e empty states
```

---

## Prompts de Qualidade

### Auditoria de TypeScript
```
Audite o uso de TypeScript em todo o projeto Menulix.
Procure por: uso de 'any', tipos incompletos, interfaces sem usar, 
funções sem retorno tipado.
Liste problemas encontrados e proponha correções.
```

### Auditoria de acessibilidade
```
Audite a acessibilidade dos componentes em components/public-menu/.
Verifique: alt nas imagens, aria-labels, contraste de cores, 
navegação por teclado, roles semânticos.
```

### Auditoria de performance
```
Analise a performance da Fase 1 do Menulix:
- Imagens: estão usando <Image> do Next.js corretamente?
- Bundle size: há imports desnecessários?
- Fonts: estão otimizadas?
- SSG: todas as páginas públicas estão sendo pré-renderizadas?
```
