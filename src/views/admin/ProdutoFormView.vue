<script setup lang="ts">
/**
 * ProdutoFormView — Cadastro/edição de produto com lookup por código de barras.
 *
 * Fluxo do código de barras:
 *   1. Usuário digita/scaneia código no campo
 *   2. Ao perder foco (blur) ou pressionar Enter, dispara busca
 *   3. Admin store chama buscarMetadadosCodigoBarras()
 *   4. Se encontrado, preenche automaticamente nome, marca, categoria, etc.
 *   5. Se não encontrado, mostra mensagem e usuário preenche manualmente
 *   6. Cache em localStorage evita chamadas repetidas para mesmo código
 */

import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin.store'
import AppButton from '@/components/shared/AppButton.vue'
import GlassCard from '@/components/shared/GlassCard.vue'
import { useToast } from '@/composables/useToast'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Produto } from '@/types'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()
const toast = useToast()

const editId = route.params.id as string | undefined
const isEdit = !!editId

const form = ref({
  codigoBarras: '',
  nome: '',
  marca: '',
  categoria: '',
  unidade: 'un',
  gramatura: '',
  fabricante: '',
  precoCusto: 0,
  precoVenda: 0,
  estoque: 0,
  estoqueMinimo: 5,
})

const barcodeTouched = ref(false)
const salvando = ref(false)
const erro = ref<string | null>(null)

onMounted(async () => {
  if (isEdit) {
    await admin.carregarProdutos(1, 100)
    const p = admin.produtos.find(p => p.id === editId)
    if (p) {
      form.value = {
        codigoBarras: p.codigoBarras,
        nome: p.nome,
        marca: p.marca,
        categoria: p.categoria,
        unidade: p.unidade,
        gramatura: p.gramatura,
        fabricante: p.fabricante,
        precoCusto: p.precoCusto,
        precoVenda: p.precoVenda,
        estoque: p.estoque,
        estoqueMinimo: p.estoqueMinimo,
      }
    }
  }
})

async function handleBarcodeBlur() {
  const codigo = form.value.codigoBarras.trim()
  if (!codigo || codigo.length < 8) return

  barcodeTouched.value = true
  await admin.buscarPorCodigoBarras(codigo)

  if (admin.metadadosBarcode && admin.metadadosBarcode.origem !== 'manual') {
    preencherMetadados(admin.metadadosBarcode)
  }
}

function preencherMetadados(meta: typeof admin.metadadosBarcode) {
  if (!meta) return
  if (meta.nome && !form.value.nome) form.value.nome = meta.nome
  if (meta.marca && !form.value.marca) form.value.marca = meta.marca
  if (meta.categoria && !form.value.categoria) form.value.categoria = meta.categoria
  if (meta.gramatura && !form.value.gramatura) form.value.gramatura = meta.gramatura
  if (meta.unidade && form.value.unidade === 'un') form.value.unidade = meta.unidade
  if (meta.fabricante && !form.value.fabricante) form.value.fabricante = meta.fabricante
}

function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

function parsePrice(val: string): number {
  return Math.round(parseFloat(val.replace(/[^0-9,.-]/g, '').replace(',', '.')) * 100) || 0
}

async function handleSubmit() {
  erro.value = null
  salvando.value = true
  try {
    const dados: Omit<Produto, 'id'> = {
      ...form.value,
      imagemUrl: null,
      ativo: true,
    }

    if (isEdit) {
      await admin.editarProduto(editId!, dados)
      toast.success('Produto atualizado com sucesso')
    } else {
      await admin.adicionarProduto(dados)
      toast.success('Produto cadastrado com sucesso')
    }
    router.push('/admin/produtos')
  } catch {
    erro.value = 'Erro ao salvar produto'
    toast.error('Erro ao salvar produto')
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <div class="produto-form">
    <header class="page-header">
      <h1>{{ isEdit ? 'Editar Produto' : 'Novo Produto' }}</h1>
      <AppButton variant="ghost" size="sm" tag="RouterLink" to="/admin/produtos">
        Voltar
      </AppButton>
    </header>

    <form @submit.prevent="handleSubmit" class="form-grid">
      <!-- Código de Barras (com lookup) -->
      <div class="field full">
        <label>Código de Barras</label>
        <div class="barcode-field">
          <input
            v-model="form.codigoBarras"
            type="text"
            placeholder="Escaneie ou digite o código"
            class="barcode-input"
            @blur="handleBarcodeBlur"
            @keydown.enter.prevent="handleBarcodeBlur"
          />
          <span v-if="admin.buscandoBarcode" class="barcode-spinner" />
          <span v-else-if="admin.metadadosBarcode?.origem === 'cache'" class="barcode-tag cache">cache</span>
          <span v-else-if="admin.metadadosBarcode?.origem === 'api_publica'" class="barcode-tag api">encontrado</span>
        </div>
        <span v-if="admin.erroBarcode" class="field-hint error-hint">
          {{ admin.erroBarcode }} — preencha os dados manualmente
        </span>
        <span v-else-if="barcodeTouched && !admin.metadadosBarcode && !admin.buscandoBarcode" class="field-hint">
          Produto não encontrado na base. Preencha manualmente.
        </span>
        <span v-else-if="admin.metadadosBarcode?.nome" class="field-hint success-hint">
          Produto encontrado: {{ admin.metadadosBarcode.nome }}
        </span>
      </div>

      <!-- Dados do produto -->
      <div class="field">
        <label>Nome do Produto *</label>
        <input v-model="form.nome" type="text" placeholder="Nome do produto" required />
      </div>

      <div class="field">
        <label>Marca</label>
        <input v-model="form.marca" type="text" placeholder="Marca" />
      </div>

      <div class="field">
        <label>Categoria</label>
        <input v-model="form.categoria" type="text" placeholder="Categoria" />
      </div>

      <div class="field">
        <label>Fabricante</label>
        <input v-model="form.fabricante" type="text" placeholder="Fabricante" />
      </div>

      <div class="field">
        <label>Unidade</label>
        <Select v-model="form.unidade">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="un"><SelectItemText>Unidade</SelectItemText></SelectItem>
              <SelectItem value="ml"><SelectItemText>ml</SelectItemText></SelectItem>
              <SelectItem value="g"><SelectItemText>g</SelectItemText></SelectItem>
              <SelectItem value="kg"><SelectItemText>kg</SelectItemText></SelectItem>
              <SelectItem value="l"><SelectItemText>L</SelectItemText></SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="field">
        <label>Gramatura</label>
        <input v-model="form.gramatura" type="text" placeholder="200ml, 60g" />
      </div>

      <div class="field">
        <label>Preço de Custo (R$)</label>
        <input
          :value="formatPrice(form.precoCusto)"
          @input="form.precoCusto = parsePrice(($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="0,00"
        />
      </div>

      <div class="field">
        <label>Preço de Venda (R$)</label>
        <input
          :value="formatPrice(form.precoVenda)"
          @input="form.precoVenda = parsePrice(($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="0,00"
        />
      </div>

      <div class="field">
        <label>Estoque Atual</label>
        <input v-model.number="form.estoque" type="number" min="0" />
      </div>

      <div class="field">
        <label>Estoque Mínimo</label>
        <input v-model.number="form.estoqueMinimo" type="number" min="0" />
      </div>

      <!-- Preview dos metadados -->
      <GlassCard v-if="admin.metadadosBarcode?.origem !== 'manual' && isEdit === false" class="metadata-card full">
        <span class="metadata-title">Metadados do Código de Barras</span>
        <div class="metadata-grid">
          <div v-if="admin.metadadosBarcode?.nome"><span class="m-label">Nome:</span> {{ admin.metadadosBarcode.nome }}</div>
          <div v-if="admin.metadadosBarcode?.marca"><span class="m-label">Marca:</span> {{ admin.metadadosBarcode.marca }}</div>
          <div v-if="admin.metadadosBarcode?.categoria"><span class="m-label">Categoria:</span> {{ admin.metadadosBarcode.categoria }}</div>
          <div v-if="admin.metadadosBarcode?.fabricante"><span class="m-label">Fabricante:</span> {{ admin.metadadosBarcode.fabricante }}</div>
          <div v-if="admin.metadadosBarcode?.gramatura"><span class="m-label">Gramatura:</span> {{ admin.metadadosBarcode.gramatura }}</div>
          <div><span class="m-label">Origem:</span> {{ admin.metadadosBarcode?.origem === 'cache' ? 'Cache local' : admin.metadadosBarcode?.origem === 'api_publica' ? 'API pública' : 'Manual' }}</div>
        </div>
      </GlassCard>

      <p v-if="erro" class="error full">{{ erro }}</p>

      <div class="actions full">
        <AppButton variant="ghost" tag="RouterLink" to="/admin/produtos">
          Cancelar
        </AppButton>
        <AppButton type="submit" :disabled="salvando">
          {{ salvando ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar' }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.produto-form { max-width: 860px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

h1 { font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
}

.full { grid-column: 1 / -1; }

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

label {
  color: var(--color-gold-500);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

input {
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

input:focus { border-color: var(--color-gold-500); }

/* ── Barcode Field ──────────────────────────────────────────────────── */
.barcode-field {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.barcode-input {
  flex: 1;
  font-family: monospace;
  letter-spacing: 0.12em;
}

.barcode-spinner {
  width: 14px; height: 14px;
  border: 2px solid var(--color-gold-200);
  border-top-color: var(--color-gold-500);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

.barcode-tag {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.barcode-tag.cache { background: rgba(255,255,255,0.05); color: var(--color-text-dimmed); }
.barcode-tag.api   { background: rgba(74,222,128,0.1);  color: var(--color-success); }

.field-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-dimmed);
  margin-top: var(--space-1);
}

.error-hint { color: var(--color-error); }
.success-hint { color: var(--color-success); }

/* ── Metadata Card ──────────────────────────────────────────────────── */
.metadata-card {
  padding: var(--space-5);
}

.metadata-title {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-3);
}

.metadata-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
}

.m-label {
  color: var(--color-text-dimmed);
  margin-right: var(--space-1);
}

.error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  padding: var(--space-3);
  background: rgba(248,113,113,0.1);
  border-radius: var(--radius-md);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-subtle);
}

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
  .metadata-grid { grid-template-columns: 1fr; }
}
</style>