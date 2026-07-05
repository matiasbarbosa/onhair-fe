<script setup lang="ts">
interface Props {
  icone: string
  titulo: string
  descricao: string
}

defineProps<Props>()
</script>

<template>
  <GlassCard class="service-card">
    <div class="service-icon">{{ icone }}</div>
    <h3>{{ titulo }}</h3>
    <p>{{ descricao }}</p>
  </GlassCard>
</template>

<style scoped>
.service-card {
  padding: var(--space-10) var(--space-6);
  text-align: center;
}

.service-icon {
  font-size: 2.25rem;
  margin-bottom: var(--space-4);
}

.service-card h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-3);
  color: var(--color-text-secondary);
}

.service-card p {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}
</style>