# onhair-fe

Vue 3 SPA para OnHair Studio — landing page + agendamento + área admin.

## Setup

```sh
pnpm install
pnpm dev           # Vite dev server
pnpm build         # type-check + build-only
pnpm type-check    # vue-tsc --build
pnpm build-only    # vite build
pnpm preview       # vite preview
pnpm vitest        # testes
```

## Stack

- Vue 3.5 + Composition API (`<script setup lang="ts">`)
- vue-router 5.0 (lazy loading)
- Pinia 3.0 (stores)
- shadcn-vue (Reka UI) + Tailwind CSS 3 (Dialog, Toast, Select)
- libphonenumber-js (validação de telefone)
- TypeScript ~6.0
- Vite 8

## Arquitetura

```
src/
├── main.ts                     # bootstrap: Pinia + router + PrimeVue
├── App.vue                     # <RouterView />
├── style.css                   # reset global
├── assets/
│   ├── tokens.css              # design tokens (cores, espaço, tipo, etc.)
│   ├── logo.png
│   └── brazilLow.svg
├── types/
│   └── index.ts                # interfaces globais (Cliente, Servico, Produto, etc.)
├── services/
│   ├── api.ts                  # HTTP wrapper com JWT (fetch nativo)
│   ├── auth.service.ts         # login/registro (mock + Go API comments)
│   ├── agenda.service.ts       # agendamentos, slots, profissionais
│   ├── estoque.service.ts      # produtos, barcode lookup, movimentações
│   └── financeiro.service.ts   # lançamentos financeiros
│   └── __tests__/api.spec.ts
├── stores/
│   ├── auth.store.ts           # sessão JWT, perfil admin/cliente
│   ├── agenda.store.ts         # wizard de agendamento
│   └── admin.store.ts          # produtos, estoque, financeiro, barcode
├── components/
│   ├── shared/
│   │   ├── GlassCard.vue       # card com efeito glass
│   │   ├── SectionHeader.vue   # título + subtítulo centralizado
│   │   ├── AppButton.vue       # primary/outline/ghost com sizes
│   │   ├── StatsDisplay.vue    # display de estatísticas
│   │   ├── ServiceCard.vue     # card de serviço
│   │   ├── TestimonialCard.vue # card de depoimento
│   │   ├── BrazilMap.vue       # mapa SVG do Brasil com pin
│   │   ├── ContactCard.vue     # card de informações de contato
│   │   ├── SocialLinks.vue     # barra de links sociais
│   │   └── AppFooter.vue       # footer com logo, links, horários
│   └── wizard/
│       ├── WizardProgress.vue   # barra de progresso + pills
│       ├── TimeSlotGrid.vue     # grid de horários
│       ├── ProfessionalCard.vue # card de profissional
│       └── BookingSummary.vue   # resumo do agendamento
├── layouts/
│   ├── AdminLayout.vue         # sidebar + header + slot
│   └── ClientLayout.vue        # header simples + slot
├── router/
│   └── index.ts                # /, /agendar, /admin/*, /cliente/*
└── views/
    ├── HomeView.vue            # landing page (usa componentes shared)
    ├── AgendarView.vue         # wizard de agendamento (usa componentes wizard)
    ├── admin/                  # stubs (Dashboard, Estoque, Produtos, Financeiro)
    └── cliente/                # stubs (Home, Agendamentos, Histórico)
```

## Convenções

- Package manager: `pnpm`
- `"type": "module"` — ESM imports
- Path alias `@` → `./src`
- `<script setup lang="ts">` (Composition API)
- CSS tokens via `var()` referenciando `src/assets/tokens.css`
- CSS scoped nos componentes, non-scoped nos layouts e tokens
- Testes com vitest + @vue/test-utils + jsdom
- Sem linter configurado

## Design System

Tokens CSS centralizados em `src/assets/tokens.css`:

- **Cores:** `--color-bg-*`, `--color-gold-*`, `--color-text-*`, `--color-border-*`, `--color-input-*`
- **Tipografia:** `--font-family: 'Derona'`, `--font-size-*`, `--font-weight-*`, `--line-height-*`
- **Espaçamento:** `--space-1` a `--space-24` (escala 4px)
- **Layout:** `--max-width-container: 1200px`, `--sidebar-width: 260px`
- **Outros:** `--radius-*`, `--shadow-*`, `--transition-*`, `--z-*`

## Fluxo de Estados (Pinia)

```
auth.store      → autenticado, isAdmin, isCliente, login(), logout()
agenda.store    → step, selecao, servicos, slots, resetarWizard()
admin.store     → produtos, metadadosBarcode, lancamentos, buscarPorCodigoBarras()
```

## Rotas (lazy loading)

| Path | Component | Layout |
|------|-----------|--------|
| `/` | HomeView | — |
| `/agendar` | AgendarView | — |
| `/admin` | DashboardView | AdminLayout |
| `/admin/estoque` | EstoqueView | AdminLayout |
| `/admin/produtos` | ProdutosView | AdminLayout |
| `/admin/produtos/novo` | ProdutoFormView | AdminLayout |
| `/admin/produtos/:id/editar` | ProdutoFormView | AdminLayout |
| `/admin/financeiro` | FinanceiroView | AdminLayout |
| `/cliente` | ClienteHomeView | ClientLayout |
| `/cliente/agendamentos` | AgendamentosView | ClientLayout |
| `/cliente/historico` | HistoricoView | ClientLayout |

## Chamadas de API

Serviços usam `fetch()` nativo (sem axios). Wrapper em `src/services/api.ts` gerencia token JWT automaticamente.

Cada service tem:
1. Comentário com as rotas Go correspondentes
2. Implementação mock (remove quando backend estiver pronto)

Para ativar API real: descomentar `apiGet/apiPost/...` e remover blocos `── Mock ──`.

URL base: `import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'`

## Fluxo para novas telas

1. Criar view em `src/views/<modulo>/NomeView.vue`
2. Adicionar rota em `src/router/index.ts` com lazy loading
3. Se área admin: usar `AdminLayout`, se cliente: `ClientLayout`
4. Usar Pinia store correspondente para estado
5. Usar componentes shared quando possível
6. Referenciar tokens CSS (`var(--color-*, --space-*, etc)`)
7. Escrever testes em `__tests__/` próximo ao arquivo

## Fluxo para novos componentes

1. Avaliar se é shared (genérico) ou específico de um módulo
2. Colocar em `src/components/<categoria>/` 
3. Usar `<script setup lang="ts">` com interfaces tipadas
4. CSS scoped referenciando tokens
5. Slots quando apropriado para composição
6. Testes em `__tests__/` ou `*.spec.ts`

## Boas práticas

- Favoreça composição sobre herança
- State global → Pinia store. State local → ref/computed
- Serviços são funções puras, sem acoplamento com Vue
- Tokens CSS sempre — nunca hardcode cores ou espaçamento
- Mocks são temporários; todo service tem comentários da API Go
- Lazy loading em todas as rotas