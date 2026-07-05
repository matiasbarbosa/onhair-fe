<script setup lang="ts">
/**
 * ProdutoFormView — Formulário de cadastro/edição de produto.
 * (Será implementado na Fase 4 — inclui leitor de código de barras)
 */

interface Props {
  id?: string
}
defineProps<Props>()
</script>

<template>
  <div>
    <h1>{{ id ? 'Editar Produto' : 'Novo Produto' }}</h1>
    <p class="muted">Formulário de cadastro de produto. Em breve.</p>
  </div>
</template>

<style scoped>
.muted { color: var(--color-text-muted); margin-top: var(--space-2); }
</style>