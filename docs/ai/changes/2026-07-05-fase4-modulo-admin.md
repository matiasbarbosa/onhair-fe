# Fase 4 — Módulo Admin

**Data:** 2026-07-05
**Status:** Concluída

## Mudanças Realizadas

### DashboardView (`/admin`)

- KPIs: receitas, despesas, saldo, total produtos — todos via `admin.store`
- Cards coloridos: verde (positivo), vermelho (negativo)
- Últimos 5 lançamentos financeiros com tipo e valor
- Alertas de estoque baixo (produtos ≤ estoqueMinimo)
- Responsivo: 2 colunas em desktop, 1 em mobile

### EstoqueView (`/admin/estoque`)

- Tabela completa com: nome, marca, categoria, estoque, mínimo, custo, venda
- Sorting por nível de estoque (menor primeiro)
- Badges coloridos por nível: verde (ok), amarelo (médio), vermelho (baixo), vermelho-bold (zero)
- Cards de resumo: estoque baixo, sem estoque, total produtos
- Linhas com background vermelho para produtos críticos

### ProdutosView (`/admin/produtos`)

- Tabela paginada com busca textual (nome, marca, código)
- Colunas: nome, código de barras, marca, categoria, estoque, preço
- Ações: Editar (navega para formulário), Excluir (com confirmação)
- Badge de estoque: verde/vermelho
- Botão "Novo Produto" no header

### ProdutoFormView (`/admin/produtos/novo`, `/admin/produtos/:id/editar`)

- Formulário completo em grid 2 colunas
- **Integração com código de barras:**
  1. Campo de código com feedback visual (spinner/tag)
  2. Ao perder foco/blur → `admin.buscarPorCodigoBarras()` 
  3. Metadados encontrados preenchem automaticamente: nome, marca, categoria, fabricante, gramatura, unidade
  4. Card de preview dos metadados com origem (cache/API pública/manual)
  5. Fallback com mensagem amigável se não encontrado
- Campos monetários formatados com máscara (R$ 0,00)
- Suporte a criação e edição (detecta `route.params.id`)

### FinanceiroView (`/admin/financeiro`)

- Filtro por mês/ano com botão "Filtrar"
- Resumo: receitas, despesas, saldo em cards
- Tabela de lançamentos: data, descrição, categoria, valor, tipo
- Badges: verde (receita), vermelho (despesa)
- Valores formatados com sinal (+/-)

## Impacto

- 5 views admin totalmente funcionais conectadas à `admin.store`
- Barcode lookup com multi-source (cache → API pública → manual)
- Todas as tabelas responsivas com `overflow-x: auto`
- Tokens CSS em todos os componentes
- Mocks com dados realistas (3 produtos, 4 lançamentos)

## Arquivos alterados/criados

| Arquivo | Status |
|---------|--------|
| `src/views/admin/DashboardView.vue` | Substituído (stub → completo) |
| `src/views/admin/EstoqueView.vue` | Substituído |
| `src/views/admin/ProdutosView.vue` | Substituído |
| `src/views/admin/ProdutoFormView.vue` | Substituído |
| `src/views/admin/FinanceiroView.vue` | Substituído |