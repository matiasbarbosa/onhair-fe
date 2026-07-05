<script setup lang="ts">
interface Props {
  tag?: string
}

withDefaults(defineProps<Props>(), {
  tag: 'div',
})
</script>

<template>
  <component :is="tag" class="glass-card" :class="{ clickable: !!$attrs.onClick }">
    <slot />
  </component>
</template>

<style scoped>
.glass-card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-base), transform var(--transition-base);
}

.glass-card.clickable:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}
</style>