<script setup lang="ts">
/**
 * ClientLayout — Layout base para área do cliente.
 * Header simples + conteúdo.
 */
import { RouterView } from 'vue-router'
import logo from '@/assets/logo.png'
</script>

<template>
  <div class="client-layout">
    <header class="client-header">
      <div class="client-header-inner">
        <RouterLink to="/">
          <img :src="logo" alt="OnHair Studio" class="client-logo" />
        </RouterLink>
      </div>
    </header>
    <main class="client-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.client-layout {
  min-height: 100vh;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-family);
}

.client-header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  background: var(--color-bg-overlay);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border-subtle);
}

.client-header-inner {
  max-width: var(--max-width-container);
  margin: 0 auto;
  padding: var(--space-4) var(--space-8);
  display: flex;
  align-items: center;
}

.client-logo {
  width: 140px;
  opacity: 0.9;
}

.client-content {
  max-width: var(--max-width-container);
  margin: 0 auto;
  padding: var(--space-8);
}
</style>