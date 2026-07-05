<script setup lang="ts">
interface Props {
  servico: string
  profissional: string
  data: string
  horario: string
  valor: string
}

defineProps<Props>()
</script>

<template>
  <div class="booking-summary">
    <div class="sum-row">
      <span>Serviço</span>      <strong>{{ servico }}</strong>
    </div>
    <div class="sum-row">
      <span>Profissional</span> <strong>{{ profissional }}</strong>
    </div>
    <div class="sum-row">
      <span>Data</span>         <strong>{{ data }}</strong>
    </div>
    <div class="sum-row">
      <span>Horário</span>      <strong>{{ horario }}</strong>
    </div>
    <div class="sum-row">
      <span>Valor</span>        <strong>{{ valor }}</strong>
    </div>
  </div>
</template>

<style scoped>
.booking-summary {
  background: var(--color-gold-100);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.sum-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
}

.sum-row span { color: var(--color-text-muted); }
.sum-row strong { color: var(--color-text-primary); }
</style>