<script setup lang="ts">
/**
 * AgendamentosView — Lista completa de agendamentos do cliente.
 * Permite visualizar e cancelar agendamentos.
 */

import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useAgendaStore } from '@/stores/agenda.store'
import AppButton from '@/components/shared/AppButton.vue'
import GlassCard from '@/components/shared/GlassCard.vue'
import type { AgendamentoStatus } from '@/types'

const auth = useAuthStore()
const agenda = useAgendaStore()

onMounted(() => {
  agenda.carregarAgendamentos(auth.usuario?.id ?? '1')
})

const filtro = computed(() => {
  const confirmados = agenda.agendamentos.filter(a => a.status === 'confirmado')
  const passados = agenda.agendamentos.filter(a => a.status !== 'confirmado')
  return { confirmados, passados }
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function statusLabel(status: AgendamentoStatus) {
  const map: Record<AgendamentoStatus, string> = {
    confirmado: 'Confirmado',
    cancelado: 'Cancelado',
    concluido: 'Concluído',
    pendente: 'Pendente',
  }
  return map[status]
}

async function handleCancelar(id: string) {
  await agenda.cancelar(id)
}
</script>

<template>
  <div class="agendamentos">
    <header class="page-header">
      <h1>Meus Agendamentos</h1>
      <AppButton tag="RouterLink" to="/agendar" size="sm">
        Novo
      </AppButton>
    </header>

    <div v-if="agenda.carregando" class="loading">Carregando...</div>

    <template v-else>
      <section v-if="filtro.confirmados.length" class="section">
        <h2 class="section-title">Confirmados</h2>
        <div class="list">
          <GlassCard v-for="appt in filtro.confirmados" :key="appt.id" class="appt-card">
            <div class="appt-main">
              <div class="appt-date">{{ formatDate(appt.data) }}</div>
              <div class="appt-time">{{ appt.horario }}</div>
              <div class="appt-service">{{ appt.servicoId }}</div>
              <span class="status confirmed">{{ statusLabel(appt.status) }}</span>
            </div>
            <AppButton variant="ghost" size="sm" @click="handleCancelar(appt.id)">
              Cancelar
            </AppButton>
          </GlassCard>
        </div>
      </section>

      <section v-if="filtro.passados.length" class="section">
        <h2 class="section-title">Histórico</h2>
        <div class="list">
          <GlassCard v-for="appt in filtro.passados" :key="appt.id" class="appt-card past">
            <div class="appt-main">
              <div class="appt-date">{{ formatDate(appt.data) }}</div>
              <div class="appt-time">{{ appt.horario }}</div>
              <div class="appt-service">{{ appt.servicoId }}</div>
              <span class="status" :class="appt.status">{{ statusLabel(appt.status) }}</span>
            </div>
          </GlassCard>
        </div>
      </section>

      <div v-if="!agenda.agendamentos.length" class="empty">
        <p>Nenhum agendamento encontrado</p>
        <AppButton tag="RouterLink" to="/agendar" variant="ghost" size="sm">
          Agendar agora
        </AppButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
.agendamentos { max-width: 720px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

h1 { font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); }

.section { margin-bottom: var(--space-10); }

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-4);
  color: var(--color-text-secondary);
}

.list { display: flex; flex-direction: column; gap: var(--space-3); }

.appt-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  gap: var(--space-4);
}

.appt-card.past { opacity: 0.7; }

.appt-main {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  flex: 1;
}

.appt-date {
  font-weight: var(--font-weight-medium);
  min-width: 100px;
}

.appt-time {
  color: var(--color-gold-500);
  font-weight: var(--font-weight-semibold);
  min-width: 60px;
}

.appt-service {
  color: var(--color-text-muted);
  text-transform: capitalize;
  flex: 1;
}

.status {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.confirmed  { background: rgba(74, 222, 128, 0.12); color: var(--color-success); }
.concluido, .cancelado { background: rgba(255,255,255,0.05); color: var(--color-text-dimmed); }
.pendente   { background: rgba(251, 191, 36, 0.12); color: var(--color-warning); }

.loading { color: var(--color-text-muted); padding: var(--space-8) 0; }

.empty {
  text-align: center;
  padding: var(--space-12);
  color: var(--color-text-muted);
}
</style>