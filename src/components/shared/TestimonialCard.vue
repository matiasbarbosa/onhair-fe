<script setup lang="ts">
interface Props {
  texto: string
  autor: string
  estrelas?: number
}

withDefaults(defineProps<Props>(), {
  estrelas: 5,
})
</script>

<template>
  <GlassCard class="testimonial-card">
    <div class="stars">{{ '★'.repeat(estrelas) }}</div>
    <p>"{{ texto }}"</p>
    <span class="author">— {{ autor }}</span>
  </GlassCard>
</template>

<style scoped>
.testimonial-card {
  padding: var(--space-10);
}

.stars {
  color: var(--color-gold-500);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-4);
}

.testimonial-card p {
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
  font-style: italic;
  margin-bottom: var(--space-5);
}

.author {
  color: var(--color-gold-500);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}
</style>