<script setup lang="ts">
/**
 * ProdutosView — Catálogo de produtos com busca e ações (editar/excluir).
 */

import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin.store'
import AppButton from '@/components/shared/AppButton.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const admin = useAdminStore()
const toast = useToast()
const busca = ref('')
const confirmOpen = ref(false)
const produtoParaExcluir = ref<{ id: string; nome: string } | null>(null)

onMounted(() => {
  admin.carregarProdutos(1, 100)
})

const produtosFiltrados = computed(() =>
  busca.value
    ? admin.produtos.filter(p =>
        p.nome.toLowerCase().includes(busca.value.toLowerCase()) ||
        p.marca.toLowerCase().includes(busca.value.toLowerCase()) ||
        p.codigoBarras.includes(busca.value)
      )
    : admin.produtos
)

function formatPrice(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

function abrirConfirmExcluir(produto: { id: string; nome: string }) {
  produtoParaExcluir.value = produto
  confirmOpen.value = true
}

async function confirmarExcluir() {
  if (!produtoParaExcluir.value) return
  await admin.excluirProduto(produtoParaExcluir.value.id)
  toast.success('Produto removido com sucesso')
  confirmOpen.value = false
}

function handleEditar(id: string) {
  router.push(`/admin/produtos/${id}/editar`)
}
</script>

<template>
  <div class="produtos">
    <header class="page-header">
      <div>
        <h1>Produtos</h1>
        <p class="muted">{{ admin.totalProdutos }} produtos no catálogo</p>
      </div>
      <AppButton tag="RouterLink" to="/admin/produtos/novo">
        Novo Produto
      </AppButton>
    </header>

    <div class="search-bar">
      <input v-model="busca" type="text" placeholder="Buscar por nome, marca ou código de barras..." class="search-input" />
    </div>

    <div v-if="admin.carregandoProdutos" class="loading">Carregando...</div>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Código</th>
            <th>Marca</th>
            <th>Categoria</th>
            <th class="col-num">Estoque</th>
            <th class="col-num">Venda</th>
            <th class="col-actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in produtosFiltrados" :key="p.id">
            <td class="prod-name">{{ p.nome }}</td>
            <td class="muted-cell mono">{{ p.codigoBarras }}</td>
            <td>{{ p.marca }}</td>
            <td class="muted-cell">{{ p.categoria }}</td>
            <td class="col-num">
              <span class="estoque-badge" :class="p.estoque <= p.estoqueMinimo ? 'low' : 'ok'">
                {{ p.estoque }}
              </span>
            </td>
            <td class="col-num">{{ formatPrice(p.precoVenda) }}</td>
            <td class="col-actions">
              <button class="action-btn" @click="handleEditar(p.id)">Editar</button>
              <button class="action-btn danger" @click="abrirConfirmExcluir({ id: p.id, nome: p.nome })">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Dialog v-model:open="confirmOpen">
      <DialogContent class="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Remover produto</DialogTitle>
          <DialogDescription v-if="produtoParaExcluir">
            Tem certeza que deseja remover <strong>"{{ produtoParaExcluir.nome }}"</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <AppButton variant="ghost" @click="confirmOpen = false">Cancelar</AppButton>
          <AppButton @click="confirmarExcluir" :disabled="admin.carregandoProdutos">Remover</AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.produtos { max-width: 1100px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
}

h1 { font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); }
.muted { color: var(--color-text-muted); margin-top: var(--space-1); }

.search-bar { margin-bottom: var(--space-6); }

.search-input {
  width: 100%;
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  outline: none;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  transition: border-color var(--transition-fast);
}

.search-input:focus { border-color: var(--color-gold-500); }
.search-input::placeholder { color: var(--color-text-dimmed); }

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

thead { border-bottom: 1px solid var(--color-border-subtle); }

th {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid rgba(255,255,255,0.03);
}

tr:hover td { background: rgba(255,255,255,0.02); }

.prod-name { font-weight: var(--font-weight-medium); }
.mono { font-family: monospace; font-size: var(--font-size-xs); }
.muted-cell { color: var(--color-text-muted); }
.col-num { text-align: right; }
.col-actions { text-align: right; white-space: nowrap; }

.estoque-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xs);
}

.estoque-badge.ok  { background: rgba(74,222,128,0.1);  color: var(--color-success); }
.estoque-badge.low { background: rgba(248,113,113,0.12); color: var(--color-error); }

.action-btn {
  background: none;
  border: 1px solid var(--color-border-subtle);
  color: var(--color-text-muted);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-family: var(--font-family);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-left: var(--space-2);
}

.action-btn:hover { border-color: var(--color-gold-500); color: var(--color-gold-500); }
.action-btn.danger:hover { border-color: var(--color-error); color: var(--color-error); }

.loading { color: var(--color-text-muted); padding: var(--space-8) 0; }
</style>