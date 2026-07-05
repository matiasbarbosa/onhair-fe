<script setup lang="ts">
import GlassCard from '@/components/shared/GlassCard.vue'

interface Profissional {
  id: string
  nome: string
  especialidades: string[]
  avatar: string
}

interface Props {
  profissional: Profissional
  selected?: boolean
  specialtiesLabel?: string
}

withDefaults(defineProps<Props>(), {
  selected: false,
  specialtiesLabel: '',
})

const emit = defineEmits<{
  'select': [id: string]
}>()
</script>

<template>
  <GlassCard
    class="prof-card"
    :class="{ active: selected }"
    tag="button"
    @click="emit('select', profissional.id)"
  >
    <div class="prof-avatar">{{ profissional.avatar }}</div>
    <div class="prof-info">
      <span class="prof-nome">{{ profissional.nome }}</span>
      <span class="prof-esp">{{ specialtiesLabel }}</span>
    </div>
    <span class="arrow-icon">→</span>
  </GlassCard>
</template>

<style scoped>
.prof-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  cursor: pointer;
  border: none;
  width: 100%;
  text-align: left;
  font-family: var(--font-family);
  color: var(--color-text-primary);
}

.prof-card.clickable:hover {
  border-color: rgba(201, 168, 76, 0.4);
}

.prof-card.active {
  border-color: var(--color-gold-500);
  background: var(--color-gold-100);
}

.prof-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-gold-500), var(--color-gold-300));
  color: var(--color-bg-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.prof-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
}

.prof-nome {
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.prof-esp {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
}

.arrow-icon {
  color: var(--color-gold-500);
  font-size: var(--font-size-base);
  margin-left: auto;
  opacity: 0.6;
}
</style>