<script setup lang="ts">
interface Props {
  title: string
  highlight?: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="section-header">
    <h2 class="section-title">
      {{ title }}
      <span v-if="highlight" class="text-gold">{{ highlight }}</span>
    </h2>
    <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-3);
}

.text-gold {
  color: var(--color-gold-500);
}

.section-subtitle {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  max-width: 480px;
  margin: var(--space-2) auto 0;
  line-height: var(--line-height-relaxed);
}
</style>