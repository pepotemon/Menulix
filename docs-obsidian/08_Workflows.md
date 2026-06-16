# 08 — Fluxos de Trabalho

> Última atualização: 2026-06-16
> Relacionado: [[07_Prompts]] | [[02_Architecture]] | [[06_Changelog]]

---

## Workflow de Desenvolvimento

### 1. Iniciar uma sessão de trabalho

```bash
# 1. Ver estado do projeto
git status
git log --oneline -10

# 2. Rodar localmente
npm run dev
# Abre em http://localhost:3000
# Testar: http://localhost:3000/alexpizzaria
```

**Antes de codar**: Ler `AGENTS.md` e `docs-obsidian/00_Index.md`

---

### 2. Adicionar um novo restaurante (dados mockados)

1. Abrir `lib/menu-data.ts`
2. Adicionar objeto `Restaurant` ao array `restaurants`
3. Adicionar `Category[]` para o restaurante
4. Adicionar `Product[]` para cada categoria
5. O slug já aparece automaticamente em `getKnownRestaurantSlugs()`
6. Testar em `localhost:3000/[novo-slug]`

---

### 3. Adicionar um novo componente

```
1. Criar arquivo em components/public-menu/[nome].tsx
2. Exportar como default function
3. Tipar props com interface (nunca `any`)
4. Usar design tokens: text-ink, bg-cream, border-line, etc.
5. Mobile-first: base → sm → md → lg
6. Adicionar aria-* onde necessário
7. Importar e usar no componente pai
```

---

### 4. Modificar estilos globais

- **Design tokens**: editar `tailwind.config.ts` → `theme.extend.colors`
- **CSS base**: editar `app/globals.css`
- **Por componente**: editar as classes Tailwind no próprio arquivo

---

### 5. Fluxo de deploy (futuro)

```bash
# Vercel (recomendado)
vercel --prod

# Firebase Hosting
firebase deploy --only hosting
```

---

## Workflow de Manutenção do Second Brain

### Após qualquer mudança significativa

```
1. Identificar o tipo de mudança:
   - Nova feature → 06_Changelog.md + possivelmente 02_Architecture.md
   - Decisão técnica → 03_Decisions.md
   - Bug resolvido → 04_Errors.md
   - Nova ideia → 05_Ideas.md

2. Atualizar 06_Changelog.md com entrada datada

3. Se a arquitetura mudou → atualizar 02_Architecture.md

4. Se necessário → criar nota em Daily/AAAA-MM-DD.md

5. Atualizar 00_Index.md se novos documentos foram criados
```

### Ao iniciar nova fase

```
1. Ler 00_Index.md para verificar estado atual
2. Marcar fase anterior como ✅ em 00_Index.md
3. Criar seção para nova fase em 05_Ideas.md
4. Documentar decisões de arquitetura em 03_Decisions.md
5. Após conclusão, atualizar 06_Changelog.md
```

---

## Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Servidor de desenvolvimento (porta 3000)
npm run build        # Build de produção
npm run start        # Servidor de produção local
npm run lint         # ESLint
```

### Testar cardápios de exemplo
```
http://localhost:3000/alexpizzaria         # Restaurante ativo
http://localhost:3000/restaurante-inativo  # Restaurante inativo (quando existir)
http://localhost:3000/qualquer-coisa       # 404 amigável
```

---

## Estrutura de Componentes — Padrão

```typescript
// components/public-menu/exemplo.tsx
interface ExemploProps {
  titulo: string
  opcional?: string
}

export default function Exemplo({ titulo, opcional }: ExemploProps) {
  return (
    <div className="...">
      {/* conteúdo */}
    </div>
  )
}
```

---

## Regras de Ouro

1. **Não quebrar funcionalidades existentes** — testar `/alexpizzaria` após cada mudança
2. **TypeScript estrito** — nenhum `any`, todos os tipos explícitos
3. **Mobile first** — sempre testar em largura 375px antes de 1280px
4. **Componentes reutilizáveis** — separar lógica de UI
5. **Sem dados sensíveis no código** — chaves de API sempre em `.env.local`
6. **Atualizar docs-obsidian** após mudanças significativas
7. **Commit com mensagem clara** — feat/fix/refactor/docs: descrição em português
