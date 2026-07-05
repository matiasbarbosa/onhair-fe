# Fase 1 — Arquitetura Base

**Data:** 2026-07-05
**Status:** Em execução

## Situação Atual

Projeto Vue 3 SPA com apenas 2 views (landing page + wizard de agendamento mockado). Sem Pinia, services, composables, types compartilhados ou design system.

## Problemas Identificados

1. **Arquitetura inexistente** — Sem stores, services ou types. Estado 100% local nos componentes.
2. **Dados mockados hardcoded** — Backend Go em desenvolvimento. Mock atual não permite troca fácil para API real.
3. **Estilos duplicados** — Cores, glass-panel, header repetidos entre HomeView e AgendarView.
4. **Ausência de design system** — Sem tokens CSS, tipografia inconsistente.
5. **Sem rotas lazy** — Ambas as views carregadas no bundle inicial.

## Solução Proposta

### 1. Types Globais (`src/types/`)
- `index.ts` — interfaces de domínio: Cliente, Servico, Profissional, Agendamento, Produto, LacamentoFinanceiro, etc.
- Tipos de API: ApiResponse<T>, ApiError, Paginacao

### 2. Service Layer (`src/services/`)
- `api.ts` — wrapper HTTP com JWT (`fetch` nativo, sem dependência extra)
- `auth.service.ts` — login/registro/sessão com mock e comentários da API Go
- `agenda.service.ts` — serviços, profissionais, slots, agendamentos
- `estoque.service.ts` — produtos, código de barras, movimentações
- `financeiro.service.ts` — lançamentos e relatórios

### 3. Pinia Stores (`src/stores/`)
- `auth.store.ts` — sessão JWT, perfil (cliente/admin)
- `agenda.store.ts` — wizard de agendamento com estado centralizado
- `admin.store.ts` — produtos, estoque, financeiro, código de barras

### 4. CSS Design Tokens (`src/assets/tokens.css`)
- Variáveis CSS: cores, tipografia, espaçamento, shadows, transições, z-index

### 5. Layouts (`src/layouts/`)
- `AdminLayout.vue` — sidebar + header + content
- `ClientLayout.vue` — header simples + content

### 6. Rotas com Lazy Loading
- `/` → HomeView (lazy)
- `/agendar` → AgendarView (lazy)
- `/admin/*` → AdminLayout com nested routes (lazy)
- `/cliente/*` → ClientLayout com nested routes (lazy)

### 7. Testes
- Vitest + @vue/test-utils + jsdom instalados
- Teste exemplo para o service de API

## Riscos e Mitigação

| Risco | Mitigação |
|-------|-----------|
| PrimeVue + design tokens causarem conflito de estilos | Tokens são variáveis CSS customizadas (prefixo `--color-`, `--space-`), não conflitam com PrimeVue |
| Mudanças no router quebrarem links existentes | Rotas `/` e `/agendar` mantidas inalteradas |
| Mock data ficar obsoleto quando backend Go estiver pronto | Services usam função `delay()` mock; trocar para `apiGet/apiPost` reais é trivial |

## Critérios de Sucesso

- [x] Pinia instalado e configurado no main.ts
- [x] Types globais criados e importáveis via `@/types`
- [x] Service layer com mocks e comentários das rotas Go
- [x] 3 stores criadas (auth, agenda, admin)
- [x] CSS tokens funcionando
- [x] Layouts admin e cliente criados
- [x] Router atualizado com lazy loading
- [x] Vitest configurado e teste exemplo passando
- [ ] Type-check passa sem erros
- [ ] Build funciona

## Próximos Passos (Fase 2)

- Extrair componentes reutilizáveis (Header, Footer, GlassCard, Button)
- Refatorar HomeView.vue para usar tokens CSS
- Reduzir ruído visual (mapa SVG, cards)
- Aplicar estética MoodUI/GolemUI (espaçamento, hierarquia)
- Melhorar responsividade mobile