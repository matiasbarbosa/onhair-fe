<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  tag?: 'button' | 'a' | 'RouterLink'
  href?: string
  to?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  tag: 'button',
})
</script>

<template>
  <component
    :is="tag"
    :href="tag === 'a' ? href : undefined"
    :to="tag === 'RouterLink' ? to : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
  >
    <slot />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  border: none;
  border-radius: var(--radius-sm);
  transition: opacity var(--transition-base), transform var(--transition-fast), background var(--transition-base), color var(--transition-base);
  font-family: var(--font-family);
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-gold-500), var(--color-gold-300));
  color: var(--color-bg-primary);
}
.btn--primary:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }

.btn--outline {
  background: transparent;
  color: var(--color-gold-500);
  border: 1.5px solid var(--color-gold-500);
}
.btn--outline:hover { background: var(--color-gold-500); color: var(--color-bg-primary); }

.btn--ghost {
  background: transparent;
  border: 1px solid var(--color-gold-200);
  color: var(--color-gold-500);
}
.btn--ghost:hover { background: var(--color-gold-100); }

.btn--sm  { padding: var(--space-3) var(--space-6); font-size: var(--font-size-sm); }
.btn--md  { padding: var(--space-3) var(--space-8); font-size: var(--font-size-sm); }
.btn--lg  { padding: var(--space-4) var(--space-10); font-size: var(--font-size-base); }

.btn:disabled { opacity: 0.35; cursor: not-allowed; }
</style>