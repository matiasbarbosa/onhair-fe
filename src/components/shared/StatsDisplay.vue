<script setup lang="ts">
interface Stat {
  value: string
  label: string
}

interface Props {
  stats: Stat[]
}

defineProps<Props>()
</script>

<template>
  <div class="stats-row">
    <div v-for="stat in stats" :key="stat.label" class="stat-item">
      <span class="stat-value">{{ stat.value }}</span>
      <span class="stat-label">{{ stat.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.stats-row {
  display: flex;
  gap: var(--space-12);
  margin-top: var(--space-10);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gold-500);
  line-height: 1;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

@media (max-width: 600px) {
  .stats-row {
    flex-direction: column;
    gap: var(--space-6);
  }
}
</style>