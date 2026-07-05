<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppButton from '@/components/shared/AppButton.vue'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="client-layout">
    <header class="header">
      <div class="header-content">
        <RouterLink to="/" class="brand">onHair Studio</RouterLink>

        <nav class="nav-links">
          <RouterLink to="/cliente">Início</RouterLink>
          <RouterLink to="/cliente/agendamentos">Agendamentos</RouterLink>
          <RouterLink to="/cliente/historico">Histórico</RouterLink>
        </nav>

        <div class="header-right">
          <span class="user-name">{{ auth.usuario?.nome }}</span>
          <AppButton variant="ghost" size="sm" @click="handleLogout">
            Sair
          </AppButton>
        </div>
      </div>
    </header>

    <main class="content">
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

/* ── Header (estilo landing page) ────────────────────────────────── */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-header);
  background: var(--color-bg-overlay);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border-subtle);
  height: var(--header-height);
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: var(--max-width-container);
  margin: 0 auto;
  padding: 0 var(--space-8);
  gap: var(--space-8);
}

.brand {
  color: var(--color-gold-500);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  letter-spacing: 0.1em;
}

.nav-links {
  display: flex;
  gap: var(--space-10);
}

.nav-links a {
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: var(--font-size-base);
  letter-spacing: var(--letter-spacing-wide);
  transition: color var(--transition-base);
}

.nav-links a:hover {
  color: var(--color-gold-500);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.user-name {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
}

/* ── Content ─────────────────────────────────────────────────────── */
.content {
  max-width: var(--max-width-container);
  margin: 0 auto;
  padding: calc(var(--header-height) + var(--space-8)) var(--space-8) var(--space-8);
}

@media (max-width: 640px) {
  .nav-links {
    display: none;
  }
}
</style>
