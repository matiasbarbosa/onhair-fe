<script setup lang="ts">
/**
 * ClienteHomeView — Dashboard do cliente com próximos agendamentos.
 */

import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useAgendaStore } from '@/stores/agenda.store'
import AppButton from '@/components/shared/AppButton.vue'
import GlassCard from '@/components/shared/GlassCard.vue'

const auth = useAuthStore()
const agenda = useAgendaStore()

onMounted(() => {
  agenda.carregarAgendamentos(auth.usuario?.id ?? '1')
})

const proximos = computed(() =>
  agenda.agendamentos.filter(a => a.status === 'confirmado').slice(0, 3)
)

const concluidos = computed(() =>
  agenda.agendamentos.filter(a => a.status === 'concluido')
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="dashboard">
    <header class="dash-header">
      <div>
        <h1>Olá, {{ auth.usuario?.nome?.split(' ')[0] ?? 'Cliente' }}</h1>
        <p class="muted">Bem-vindo(a) de volta</p>
      </div>
      <AppButton tag="RouterLink" to="/agendar">
        Novo Agendamento
      </AppButton>
    </header>

    <div class="stats-row">
      <GlassCard class="stat-card">
        <span class="stat-num">{{ proximos.length }}</span>
        <span class="stat-label">Próximos</span>
      </GlassCard>
      <GlassCard class="stat-card">
        <span class="stat-num">{{ concluidos.length }}</span>
        <span class="stat-label">Concluídos</span>
      </GlassCard>
    </div>

    <section class="section">
      <div class="section-head">
        <h2>Próximos Agendamentos</h2>
        <RouterLink v-if="agenda.agendamentos.length" to="/cliente/agendamentos" class="link">Ver todos</RouterLink>
      </div>

      <div v-if="agenda.carregando" class="loading">Carregando...</div>

      <div v-else-if="!proximos.length" class="empty">
        <p>Nenhum agendamento próximo</p>
        <AppButton tag="RouterLink" to="/agendar" variant="ghost" size="sm">
          Agendar agora
        </AppButton>
      </div>

      <div v-else class="appt-list">
        <GlassCard v-for="appt in proximos" :key="appt.id" class="appt-card">
          <div class="appt-date">{{ formatDate(appt.data) }}</div>
          <div class="appt-time">{{ appt.horario }}</div>
          <div class="appt-service">{{ appt.servicoId }}</div>
          <span class="appt-status confirmed">Confirmado</span>
        </GlassCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard { max-width: 720px; }

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-8);
}

h1 { font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); }
.muted { color: var(--color-text-muted); margin-top: var(--space-1); }

.stats-row {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-10);
}

.stat-card {
  flex: 1;
  padding: var(--space-6);
  text-align: center;
}

.stat-num {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gold-500);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.section { margin-top: var(--space-4); }

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.link {
  color: var(--color-gold-500);
  font-size: var(--font-size-sm);
  text-decoration: none;
}

.link:hover { text-decoration: underline; }

.appt-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.appt-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
}

.appt-date {
  font-weight: var(--font-weight-medium);
  min-width: 100px;
  color: var(--color-text-secondary);
}

.appt-time {
  color: var(--color-gold-500);
  font-weight: var(--font-weight-semibold);
  min-width: 60px;
}

.appt-service {
  flex: 1;
  color: var(--color-text-muted);
  text-transform: capitalize;
}

.appt-status {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.confirmed {
  background: rgba(74, 222, 128, 0.12);
  color: var(--color-success);
}

.loading { color: var(--color-text-muted); padding: var(--space-8) 0; }

.empty {
  text-align: center;
  padding: var(--space-12);
  color: var(--color-text-muted);
}
</style>