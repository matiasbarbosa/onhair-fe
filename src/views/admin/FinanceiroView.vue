<script setup lang="ts">
/**
 * FinanceiroView — Lançamentos financeiros, filtro por mês, totais.
 */

import { onMounted, ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import GlassCard from '@/components/shared/GlassCard.vue'

const admin = useAdminStore()

const mesAtual = new Date().getMonth() + 1
const anoAtual = new Date().getFullYear()
const mesFiltro = ref(mesAtual)
const anoFiltro = ref(anoAtual)

onMounted(() => {
  admin.carregarFinanceiro(mesFiltro.value, anoFiltro.value)
})

const meses = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
]

async function aplicarFiltro() {
  await admin.carregarFinanceiro(mesFiltro.value, anoFiltro.value)
}

const receitas = computed(() =>
  admin.lancamentos.filter(l => l.tipo === 'receita')
)

const despesas = computed(() =>
  admin.lancamentos.filter(l => l.tipo === 'despesa')
)

const totalReceitas = computed(() =>
  receitas.value.reduce((s, l) => s + l.valor, 0)
)

const totalDespesas = computed(() =>
  despesas.value.reduce((s, l) => s + l.valor, 0)
)

const saldo = computed(() => totalReceitas.value - totalDespesas.value)

function formatPrice(cents: number) {
  const signal = cents < 0 ? '-' : ''
  return `${signal}R$ ${(Math.abs(cents) / 100).toFixed(2).replace('.', ',')}`
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
</script>

<template>
  <div class="financeiro">
    <header class="page-header">
      <h1>Financeiro</h1>
    </header>

    <!-- Filtro de período -->
    <div class="filtro-bar">
      <select v-model.number="mesFiltro" class="filtro-select">
        <option v-for="(m, i) in meses" :key="m" :value="i + 1">{{ m }}</option>
      </select>
      <input v-model.number="anoFiltro" type="number" class="filtro-ano" />
      <button class="filtro-btn" @click="aplicarFiltro">Filtrar</button>
    </div>

    <!-- Resumo -->
    <div class="summary-row">
      <GlassCard class="sum-card">
        <span class="sum-label">Receitas</span>
        <span class="sum-val green">{{ formatPrice(totalReceitas) }}</span>
      </GlassCard>
      <GlassCard class="sum-card">
        <span class="sum-label">Despesas</span>
        <span class="sum-val red">{{ formatPrice(totalDespesas) }}</span>
      </GlassCard>
      <GlassCard class="sum-card">
        <span class="sum-label">Saldo</span>
        <span class="sum-val" :class="saldo >= 0 ? 'green' : 'red'">{{ formatPrice(saldo) }}</span>
      </GlassCard>
    </div>

    <div v-if="admin.carregandoFinanceiro" class="loading">Carregando...</div>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th class="col-num">Valor</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in admin.lancamentos" :key="l.id">
            <td>{{ formatDate(l.data) }}</td>
            <td>{{ l.descricao }}</td>
            <td class="muted-cell">{{ l.categoria }}</td>
            <td class="col-num" :class="l.tipo === 'receita' ? 'green' : 'red'">
              {{ l.tipo === 'receita' ? '+' : '-' }}{{ formatPrice(l.valor).replace(/^-?\s*R\$\s*/, '') }}
            </td>
            <td>
              <span class="tipo-badge" :class="l.tipo">
                {{ l.tipo === 'receita' ? 'Receita' : 'Despesa' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.financeiro { max-width: 960px; }

.page-header { margin-bottom: var(--space-8); }

h1 { font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); }

.filtro-bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.filtro-select {
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  color: var(--color-text-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-family: var(--font-family);
  cursor: pointer;
}
.filtro-select:focus { border-color: var(--color-gold-500); }
.filtro-select option { background: var(--color-bg-primary); }

.filtro-ano {
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  color: var(--color-text-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-family: var(--font-family);
  width: 80px;
}
.filtro-ano:focus { border-color: var(--color-gold-500); }

.filtro-btn {
  background: var(--color-gold-500);
  color: var(--color-bg-primary);
  border: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}
.filtro-btn:hover { opacity: 0.85; }

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

.sum-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.sum-val {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin-top: var(--space-2);
}

.green { color: var(--color-success); }
.red   { color: var(--color-error); }

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

.muted-cell { color: var(--color-text-muted); }
.col-num { text-align: right; font-variant-numeric: tabular-nums; }

.tipo-badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tipo-badge.receita { background: rgba(74,222,128,0.1);  color: var(--color-success); }
.tipo-badge.despesa { background: rgba(248,113,113,0.12); color: var(--color-error); }

.loading { color: var(--color-text-muted); padding: var(--space-8) 0; }
</style>