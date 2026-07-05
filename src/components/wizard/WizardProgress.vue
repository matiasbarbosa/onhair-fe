<script setup lang="ts">
interface Props {
  steps: string[]
  currentStep: number
  progressPct: number
}

defineProps<Props>()

const emit = defineEmits<{
  'go-to': [step: number]
}>()
</script>

<template>
  <div class="wizard-progress">
    <div class="progress-bar-wrap">
      <div class="progress-fill" :style="{ width: `${progressPct}%` }" />
    </div>

    <div class="steps-nav">
      <button
        v-for="(label, index) in steps"
        :key="label"
        class="step-pill"
        :class="{
          active:   currentStep === index + 1,
          done:     currentStep >  index + 1,
          disabled: currentStep <  index + 1,
        }"
        :disabled="currentStep < index + 1"
        @click="emit('go-to', index + 1)"
      >
        <span class="pill-num">{{ index + 1 }}</span>
        <span class="pill-label">{{ label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.wizard-progress {
  display: flex;
  flex-direction: column;
}

.progress-bar-wrap {
  height: 2px;
  background: var(--color-gold-100);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-8);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold-500), var(--color-gold-300));
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

.steps-nav {
  display: flex;
  gap: 0.4rem;
  margin-bottom: var(--space-10);
  flex-wrap: wrap;
}

.step-pill {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: transparent;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-full);
  padding: 0.35rem 0.85rem 0.35rem 0.45rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-muted);
  font-family: var(--font-family);
}

.step-pill.active {
  border-color: var(--color-gold-500);
  color: var(--color-gold-500);
  background: var(--color-gold-100);
}

.step-pill.done {
  border-color: rgba(201, 168, 76, 0.35);
  color: rgba(201, 168, 76, 0.6);
}

.step-pill.disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pill-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: currentColor;
  color: var(--color-bg-primary);
  font-size: 0.7rem;
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-pill.active .pill-num   { background: var(--color-gold-500); }
.step-pill.done .pill-num     { background: rgba(201, 168, 76, 0.5); }

.pill-label {
  font-size: 0.78rem;
  letter-spacing: var(--letter-spacing-normal);
  text-transform: uppercase;
}

@media (max-width: 560px) {
  .steps-nav { gap: 0.3rem; }
  .pill-label { display: none; }
  .step-pill { padding: 0.35rem 0.45rem; }
}
</style>