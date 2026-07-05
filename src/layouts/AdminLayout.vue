<script setup lang="ts">
/**
 * AdminLayout — Layout base para rotas administrativas.
 * Sidebar + topbar estilo landing page + área de conteúdo.
 */
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppButton from '@/components/shared/AppButton.vue'
import logo from '@/assets/logo.png'

const auth = useAuthStore()
const sidebarOpen = ref(true)

const navItems = [
  { to: '/admin',           label: 'Dashboard',  icon: 'grid'     },
  { to: '/admin/estoque',   label: 'Estoque',    icon: 'package'  },
  { to: '/admin/produtos',  label: 'Produtos',   icon: 'tag'      },
  { to: '/admin/financeiro',label: 'Financeiro', icon: 'dollar'   },
]

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

const iconMap: Record<string, string> = {
  grid: '⊞', package: '⊟', tag: '⊡', dollar: '$',
}
</script>

<template>
  <div class="admin-layout" :class="{ collapsed: !sidebarOpen }">

    <aside class="sidebar">
      <div class="sidebar-header">
        <RouterLink to="/admin">
          <img :src="logo" alt="OnHair Studio" class="sidebar-logo" />
        </RouterLink>
      </div>

      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          active-class="nav-item--active"
          exact-active-class="nav-item--exact"
        >
          <span class="nav-icon">{{ iconMap[item.icon] }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item logout-btn" @click="auth.logout()">
          <span class="nav-icon">→</span>
          <span class="nav-label">Sair</span>
        </button>
      </div>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <button class="hamburger" @click="toggleSidebar" aria-label="Toggle menu">
          <span /><span /><span />
        </button>
        <div class="topbar-spacer" />
        <span class="topbar-user">{{ auth.usuario?.nome ?? 'Admin' }}</span>
      </header>

      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-family);
}

.sidebar {
  width: var(--sidebar-width);
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border-subtle);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: var(--z-sidebar);
  transition: transform var(--transition-base);
}

.collapsed .sidebar { transform: translateX(-100%); }

.sidebar-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border-subtle);
}

.sidebar-logo { width: 140px; opacity: 0.9; }

.sidebar-nav {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--color-border-subtle);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-family: var(--font-family);
}

.nav-item:hover { background: var(--color-gold-100); color: var(--color-gold-500); }
.nav-item--active, .nav-item--exact { background: var(--color-gold-100); color: var(--color-gold-500); font-weight: var(--font-weight-semibold); }

.nav-icon { font-size: var(--font-size-lg); width: 24px; text-align: center; }

.main-area {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  transition: margin-left var(--transition-base);
}

.collapsed .main-area { margin-left: 0; }

/* ── Topbar (estilo landing page) ──────────────────────────────────────── */
.topbar {
  height: var(--header-height);
  background: var(--color-bg-overlay);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border-subtle);
  display: flex;
  align-items: center;
  padding: 0 var(--space-8);
  position: sticky;
  top: 0;
  z-index: var(--z-header);
}

.hamburger {
  background: none; border: none; cursor: pointer;
  display: flex; flex-direction: column; gap: 4px;
  padding: var(--space-2);
}

.hamburger span {
  display: block; width: 20px; height: 2px;
  background: var(--color-text-muted); border-radius: 1px;
}

.topbar-spacer { flex: 1; }

.topbar-user {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
}

.content {
  padding: var(--space-8);
  flex: 1;
}

@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .collapsed .sidebar { transform: translateX(0); }
  .main-area { margin-left: 0; }
}
</style>