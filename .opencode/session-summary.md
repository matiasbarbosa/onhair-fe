# Resumo da sessão — 01/08/2026

## O que foi feito

### 1. Login & Registro — redesign temático
- **LoginView.vue** e **RegistroView.vue** refeitos espelhando a Landing Page:
  - Header com logo OnHair + link "← Voltar para o Início"
  - Background com radial-gradient dourado + hero-glow pulsante (igual HomeView)
  - Card com tema dark (`--color-bg-secondary`), borda gold, shadow-gold
  - Badge temática (`✨ Área Exclusiva do Cliente`)
  - Título com gradiente gold-text (`linear-gradient(135deg, text-secondary 40%, gold-500)`)
  - Inputs com focus gold + box-shadow
  - Botão "Acessar Conta" / "Criar Conta" (substituiu o "Entrar" esquisito)

### 2. Telefone — InputMask removido, libphonenumber-js no lugar
- Removeu `InputMask` do PrimeVue do `RegistroView.vue`
- Substituído por `AsYouType` do `libphonenumber-js`:
  ```ts
  import { AsYouType } from 'libphonenumber-js'
  const formatter = new AsYouType('BR')
  ```
  Formatação em tempo real com `@input`. Basta trocar `'BR'` por `'US'`, `'PT'`, etc.
- Lib adicionada em `package.json`

### 3. shadcn-vue — instalado + 3 componentes integrados
- **Tailwind CSS 3** + PostCSS configurado
- **tailwind.config.js** — tokens OnHair mapeados (gold, bg, text, border, input)
- **components.json** — config do shadcn CLI
- **src/lib/utils.ts** — `cn()` com clsx + tailwind-merge
- **src/composables/useToast.ts** — wrapper `toast.success()` / `toast.error()`

**Componentes adicionados** (via `npx shadcn-vue@latest add`):
| Componente | Uso atual |
|---|---|
| Dialog | Confirmar exclusão no `ProdutosView.vue` (substituiu `window.confirm()`) |
| Sonner (Toast) | `<Toaster>` global no `App.vue`, usado em `ProdutosView` e `ProdutoFormView` |
| Select | Filtro de mês no `FinanceiroView.vue` + unidade no `ProdutoFormView.vue` |

### 4. Toasts ativos
- **App.vue** → `<Toaster rich-colors position="bottom-right" />`
- **ProdutosView** → `toast.success('Produto removido com sucesso')` ao excluir
- **ProdutoFormView** → `toast.success('Produto cadastrado/atualizado')` ao salvar

### 5. AGENTS.md — atualizado
- Stack: shadcn-vue + Tailwind CSS 3 + libphonenumber-js
- date-fns removido (nunca foi instalado)
- `@primeuix/themes` removido do `package.json` (nunca usado)

## Estado atual das dependências
```
shadcn-vue 2.8 + Reka UI (Dialog, Sonner, Select)
PrimeVue 4.5 (APENAS DatePicker no AgendarView.vue)
libphonenumber-js (telefone no RegistroView.vue)
Tailwind CSS 3 + PostCSS
```

## Próximos passos (pendentes)
```bash
npx shadcn-vue@latest add table        # DataTable com TanStack (admin tables)
npx shadcn-vue@latest add dropdown-menu # menus de ação
```

- [ ] Substituir `<table>` cru por DataTable no EstoqueView, FinanceiroView, ProdutosView
- [ ] Adicionar DropdownMenu para ações do admin
- [ ] Melhorar acessibilidade geral (hoje nota 2/10, shadcn resolve sozinho)
- [ ] Testar fluxo completo: login → agendar → admin CRUD