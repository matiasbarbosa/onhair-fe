<script setup lang="ts">
interface Slot {
  time?: string
  hora?: string
  available?: boolean
  disponivel?: boolean
}

interface Props {
  slots: Slot[]
  selected?: string | null
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'select': [time: string]
}>()

function getTime(s: Slot) { return s.hora ?? s.time ?? '' }
function isAvailable(s: Slot) { return s.disponivel ?? s.available ?? false }
</script>

<template>
  <div v-if="loading" class="loading">
    <span class="spinner" />
    Verificando disponibilidade...
  </div>

  <div v-else class="slots-grid">
    <button
      v-for="slot in slots"
      :key="getTime(slot)"
      class="slot-btn"
      :class="{
        selected:    getTime(slot) === selected,
        unavailable: !isAvailable(slot),
      }"
      :disabled="!isAvailable(slot)"
      @click="emit('select', getTime(slot))"
    >
      <span class="slot-time">{{ getTime(slot) }}</span>
      <span class="slot-status">{{ isAvailable(slot) ? 'livre' : 'ocupado' }}</span>
    </button>
  </div>
</template>

<style scoped>
.slots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.65rem;
}

.slot-btn {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-2);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  transition: all var(--transition-fast);
  font-family: var(--font-family);
}

.slot-btn:hover:not(:disabled) {
  background: var(--color-gold-100);
  border-color: var(--color-gold-500);
}

.slot-btn.selected {
  background: var(--color-gold-500);
  border-color: var(--color-gold-500);
}

.slot-btn.selected .slot-time { color: var(--color-bg-primary); }
.slot-btn.selected .slot-status { color: rgba(13, 13, 13, 0.6); }

.slot-btn.unavailable {
  opacity: 0.3;
  cursor: not-allowed;
}

.slot-time {
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.slot-status {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.loading {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  padding: var(--space-6) 0;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-gold-200);
  border-top-color: var(--color-gold-500);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 560px) {
  .slots-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>