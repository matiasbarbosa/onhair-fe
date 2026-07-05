<script setup lang="ts">
/**
 * EstoqueView — Gestão de estoque: tabela de produtos, níveis, alertas.
 */

import { onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import GlassCard from '@/components/shared/GlassCard.vue'

const admin = useAdminStore()

onMounted(() => {
  admin.carregarProdutos(1, 100)
})

const produtosFiltrados = computed(() =>
  [...admin.produtos].sort((a, b) => a.estoque - b.estoque)
)

function estoqueNivel(prod: { estoque: number; estoqueMinimo: number }) {
  if (prod.estoque === 0) return 'zero'
  if (prod.estoque <= prod.estoqueMinimo) return 'baixo'
  if (prod.estoque <= prod.estoqueMinimo * 2) return 'medio'
  return 'ok'
}

function formatPrice(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}
</script>

<template>
  <div class="estoque">
    <header class="page-header">
      <div>
        <h1>Estoque</h1>
        <p class="muted">{{ admin.totalProdutos }} produtos cadastrados</p>
      </div>
    </header>

    <div class="summary-row">
      <GlassCard class="sum-card">
        <span class="sum-num">{{ admin.produtos.filter(p => p.estoque <= p.estoqueMinimo).length }}</span>
        <span class="sum-label">Estoque Baixo</span>
      </GlassCard>
      <GlassCard class="sum-card">
        <span class="sum-num">{{ admin.produtos.filter(p => p.estoque === 0).length }}</span>
        <span class="sum-label">Sem Estoque</span>
      </GlassCard>
      <GlassCard class="sum-card">
        <span class="sum-num">{{ admin.produtos.length }}</span>
        <span class="sum-label">Total Produtos</span>
      </GlassCard>
    </div>

    <div v-if="admin.carregandoProdutos" class="loading">Carregando...</div>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Marca</th>
            <th>Categoria</th>
            <th class="col-num">Estoque</th>
            <th class="col-num">Mínimo</th>
            <th class="col-num">Custo</th>
            <th class="col-num">Venda</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in produtosFiltrados" :key="p.id" :class="`nivel-${estoqueNivel(p)}`">
            <td class="prod-name">{{ p.nome }}</td>
            <td>{{ p.marca }}</td>
            <td class="muted-cell">{{ p.categoria }}</td>
            <td class="col-num">
              <span class="estoque-badge" :class="estoqueNivel(p)">{{ p.estoque }}</span>
            </td>
            <td class="col-num muted-cell">{{ p.estoqueMinimo }}</td>
            <td class="col-num muted-cell">{{ formatPrice(p.precoCusto) }}</td>
            <td class="col-num">{{ formatPrice(p.precoVenda) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.estoque { max-width: 1100px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-8);
}

h1 { font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); }
.muted { color: var(--color-text-muted); margin-top: var(--space-1); }

.summary-row {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.sum-card {
  flex: 1;
  padding: var(--space-5);
  text-align: center;
}

.sum-num {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gold-500);
  display: block;
}

.sum-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: var(--space-1);
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

thead { border-bottom: 1px solid var(--color-border-subtle); }

th {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid rgba(255,255,255,0.03);
}

tr:hover td { background: rgba(255,255,255,0.02); }

.prod-name { font-weight: var(--font-weight-medium); }

.col-num { text-align: right; }
.muted-cell { color: var(--color-text-muted); }

.estoque-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xs);
  min-width: 28px;
  text-align: center;
}

.estoque-badge.ok    { background: rgba(74,222,128,0.1);  color: var(--color-success); }
.estoque-badge.medio { background: rgba(251,191,36,0.1);  color: var(--color-warning); }
.estoque-badge.baixo { background: rgba(248,113,113,0.12); color: var(--color-error); }
.estoque-badge.zero  { background: rgba(248,113,113,0.18); color: var(--color-error); font-weight: var(--font-weight-bold); }

.nivel-baixo td { background: rgba(248,113,113,0.04); }
.nivel-zero td  { background: rgba(248,113,113,0.06); }

.loading { color: var(--color-text-muted); padding: var(--space-8) 0; }
</style>