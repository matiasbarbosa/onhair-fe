<script setup lang="ts">
/**
 * DashboardView — Visão geral admin: KPIs, resumo financeiro, alertas de estoque.
 */

import { onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import GlassCard from '@/components/shared/GlassCard.vue'

const admin = useAdminStore()

onMounted(() => {
  admin.carregarProdutos(1, 100)
  admin.carregarFinanceiro()
})

const baixoEstoque = computed(() =>
  admin.produtos.filter(p => p.estoque <= p.estoqueMinimo)
)

const receitaTotal = computed(() =>
  admin.lancamentos
    .filter(l => l.tipo === 'receita')
    .reduce((sum, l) => sum + l.valor, 0)
)

const despesaTotal = computed(() =>
  admin.lancamentos
    .filter(l => l.tipo === 'despesa')
    .reduce((sum, l) => sum + l.valor, 0)
)

const saldo = computed(() => receitaTotal.value - despesaTotal.value)

function formatPrice(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p class="muted">Visão geral do salão</p>

    <!-- KPIs -->
    <div class="kpi-grid">
      <GlassCard class="kpi-card">
        <span class="kpi-label">Receitas (mês)</span>
        <span class="kpi-value green">{{ formatPrice(receitaTotal) }}</span>
      </GlassCard>

      <GlassCard class="kpi-card">
        <span class="kpi-label">Despesas (mês)</span>
        <span class="kpi-value red">{{ formatPrice(despesaTotal) }}</span>
      </GlassCard>

      <GlassCard class="kpi-card">
        <span class="kpi-label">Saldo</span>
        <span class="kpi-value" :class="saldo >= 0 ? 'green' : 'red'">
          {{ formatPrice(saldo) }}
        </span>
      </GlassCard>

      <GlassCard class="kpi-card">
        <span class="kpi-label">Produtos</span>
        <span class="kpi-value">{{ admin.totalProdutos }}</span>
      </GlassCard>
    </div>

    <div class="two-col">
      <!-- Últimas transações -->
      <section>
        <h2>Últimos Lançamentos</h2>
        <div class="tx-list">
          <div v-for="l in admin.lancamentos.slice(0, 5)" :key="l.id" class="tx-row">
            <span class="tx-desc">{{ l.descricao }}</span>
            <span class="tx-cat">{{ l.categoria }}</span>
            <span class="tx-val" :class="l.tipo">
              {{ l.tipo === 'receita' ? '+' : '-' }}{{ formatPrice(l.valor) }}
            </span>
          </div>
        </div>
      </section>

      <!-- Alertas de estoque -->
      <section>
        <h2>Estoque Baixo</h2>
        <div v-if="baixoEstoque.length" class="alert-list">
          <div v-for="p in baixoEstoque" :key="p.id" class="alert-row">
            <span class="alert-name">{{ p.nome }}</span>
            <span class="alert-qty">{{ p.estoque }}/{{ p.estoqueMinimo }}</span>
            <span class="alert-status">Repor</span>
          </div>
        </div>
        <p v-else class="muted-sm">Nenhum produto com estoque baixo</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard { max-width: 960px; }

h1 { font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); }
.muted { color: var(--color-text-muted); margin-top: var(--space-1); margin-bottom: var(--space-8); }

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-10);
}

.kpi-card {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.kpi-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.kpi-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.green { color: var(--color-success); }
.red   { color: var(--color-error); }

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
}

h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-4);
}

.tx-list { display: flex; flex-direction: column; gap: var(--space-2); }

.tx-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.tx-desc { flex: 1; font-size: var(--font-size-sm); }
.tx-cat  { font-size: var(--font-size-xs); color: var(--color-text-muted); }
.tx-val  { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); }
.tx-val.receita { color: var(--color-success); }
.tx-val.despesa { color: var(--color-error); }

.alert-list { display: flex; flex-direction: column; gap: var(--space-2); }

.alert-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: rgba(248, 113, 113, 0.08);
  border-radius: var(--radius-md);
}

.alert-name { flex: 1; font-size: var(--font-size-sm); }
.alert-qty  { font-size: var(--font-size-xs); color: var(--color-error); font-weight: var(--font-weight-semibold); }
.alert-status {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-error);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.muted-sm { color: var(--color-text-dimmed); font-size: var(--font-size-sm); padding: var(--space-6) 0; }

@media (max-width: 768px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .two-col  { grid-template-columns: 1fr; }
}
</style>