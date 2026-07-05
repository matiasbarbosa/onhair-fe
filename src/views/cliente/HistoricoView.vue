<script setup lang="ts">
/**
 * HistoricoView — Histórico de serviços concluídos.
 */

import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useAgendaStore } from '@/stores/agenda.store'
import GlassCard from '@/components/shared/GlassCard.vue'

const auth = useAuthStore()
const agenda = useAgendaStore()

onMounted(() => {
  agenda.carregarAgendamentos(auth.usuario?.id ?? '1')
})

const historico = computed(() =>
  agenda.agendamentos
    .filter(a => a.status === 'concluido' || a.status === 'cancelado')
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatPrice(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}
</script>

<template>
  <div class="historico">
    <h1>Histórico</h1>
    <p class="muted">Serviços realizados anteriormente</p>

    <div v-if="agenda.carregando" class="loading">Carregando...</div>

    <div v-else-if="!historico.length" class="empty">
      <p>Nenhum serviço no histórico</p>
    </div>

    <div v-else class="list">
      <GlassCard v-for="appt in historico" :key="appt.id" class="history-card">
        <div class="hc-left">
          <div class="hc-date">{{ formatDate(appt.data) }}</div>
          <div class="hc-service">{{ appt.servicoId }}</div>
        </div>
        <div class="hc-right">
          <span class="hc-price">{{ formatPrice(appt.preco) }}</span>
          <span class="hc-status" :class="appt.status">
            {{ appt.status === 'concluido' ? 'Concluído' : 'Cancelado' }}
          </span>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<style scoped>
.historico { max-width: 720px; }

h1 { font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); }
.muted { color: var(--color-text-muted); margin-top: var(--space-1); margin-bottom: var(--space-8); }

.list { display: flex; flex-direction: column; gap: var(--space-3); }

.history-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-5);
  opacity: 0.8;
}

.hc-left { display: flex; flex-direction: column; gap: var(--space-1); }

.hc-date {
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
}

.hc-service {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  text-transform: capitalize;
}

.hc-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
}

.hc-price {
  font-weight: var(--font-weight-semibold);
  color: var(--color-gold-500);
  font-size: var(--font-size-base);
}

.hc-status {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.concluido { background: rgba(74, 222, 128, 0.1); color: var(--color-success); }
.cancelado { background: rgba(255,255,255,0.05); color: var(--color-text-dimmed); }

.loading { color: var(--color-text-muted); padding: var(--space-8) 0; }

.empty {
  text-align: center;
  padding: var(--space-12);
  color: var(--color-text-muted);
}
</style>