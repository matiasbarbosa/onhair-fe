<script setup lang="ts">
interface Props {
  logo?: string
  mapaLinks?: { href: string; label: string }[]
  contatoLinks?: { href: string; label: string }[]
  horarios?: readonly string[]
  copyright?: string
}

withDefaults(defineProps<Props>(), {
  copyright: '© 2026 OnHair Studio. Todos os direitos reservados.',
})
</script>

<template>
  <footer class="footer">
    <div class="container">
      <slot name="social" />

      <div class="footer-grid">
        <div class="footer-brand">
          <img v-if="logo" :src="logo" alt="OnHair Studio" class="footer-logo" />
          <slot name="brand" />
        </div>

        <div v-if="mapaLinks?.length" class="footer-col">
          <h4>Mapa do Site</h4>
          <a v-for="link in mapaLinks" :key="link.href" :href="link.href">
            {{ link.label }}
          </a>
        </div>

      </div>

      <div class="footer-bottom">
        <p>{{ copyright }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.container {
  max-width: var(--max-width-container);
  margin: 0 auto;
  padding: 0 var(--space-8);
}

.footer {
  background: linear-gradient(to bottom, #0a0a0a, #050505);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: var(--space-8);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--space-16);
  padding: var(--space-16) 0;
}

.footer-logo {
  width: 180px;
  opacity: 0.9;
}

.footer-col h4 {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-5);
  font-weight: var(--font-weight-semibold);
}

.footer-col a,
.footer-col p {
  display: block;
  color: var(--color-text-primary);
  text-decoration: none;
  margin-bottom: var(--space-4);
  font-size: var(--font-size-base);
  transition: color var(--transition-base);
  font-weight: var(--font-weight-light);
}

.footer-col a:hover {
  color: var(--color-gold-500);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: var(--space-6) 0;
  text-align: center;
}

.footer-bottom p {
  color: var(--color-text-dimmed);
  font-size: var(--font-size-sm);
}

@media (max-width: 960px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}
</style>
