<script setup lang="ts">
interface Social {
  href: string
  label: string
  svgViewBox: string
  svgPath: string
}

interface Props {
  socials: Social[]
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Acompanhe nossos canais',
})
</script>

<template>
  <div class="social-bar">
    <span class="social-title">{{ title }}</span>
    <div class="social-icons">
      <a
        v-for="social in socials"
        :key="social.label"
        :href="social.href"
        :aria-label="social.label"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg aria-hidden="true" :viewBox="social.svgViewBox" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" :d="social.svgPath" />
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
.social-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-8) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.social-title {
  color: var(--color-text-primary);
  font-size: 1.23rem;
  font-weight: var(--font-weight-semibold);
}

.social-icons {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.social-icons a {
  color: var(--color-text-secondary);
  width: 42px;
  height: 42px;
  transition: all var(--transition-base);
}

.social-icons a svg {
  width: 100%;
  height: 100%;
}

.social-icons a:hover {
  color: var(--color-gold-500);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .social-bar {
    flex-direction: column;
    gap: var(--space-6);
    text-align: center;
  }
}
</style>