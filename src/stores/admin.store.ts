/**
 * Admin Store — Gerencia estoque, produtos e financeiro.
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Produto, LancamentoFinanceiro, MovimentacaoEstoque, MetadadosProduto, ApiResponse } from '@/types'
import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  removerProduto,
  buscarMetadadosCodigoBarras,
  listarMovimentacoes,
} from '@/services/estoque.service'
import { listarLancamentos } from '@/services/financeiro.service'

export const useAdminStore = defineStore('admin', () => {
  const produtos = ref<Produto[]>([])
  const totalProdutos = ref(0)
  const carregandoProdutos = ref(false)

  const metadadosBarcode = ref<MetadadosProduto | null>(null)
  const buscandoBarcode = ref(false)
  const erroBarcode = ref<string | null>(null)

  const movimentacoes = ref<MovimentacaoEstoque[]>([])
  const carregandoMovimentacoes = ref(false)

  const lancamentos = ref<LancamentoFinanceiro[]>([])
  const carregandoFinanceiro = ref(false)

  async function carregarProdutos(pagina = 1, porPagina = 20) {
    carregandoProdutos.value = true
    try {
      const res: ApiResponse<Produto[]> = await listarProdutos({ pagina, porPagina })
      produtos.value = res.data
      totalProdutos.value = res.meta?.total ?? 0
    } finally {
      carregandoProdutos.value = false
    }
  }

  async function adicionarProduto(produto: Omit<Produto, 'id'>) {
    const novo = await criarProduto(produto)
    produtos.value.unshift(novo)
  }

  async function editarProduto(id: string, dados: Partial<Produto>) {
    await atualizarProduto(id, dados)
    const idx = produtos.value.findIndex(p => p.id === id)
    if (idx >= 0) produtos.value[idx] = { ...produtos.value[idx]!, ...dados }
  }

  async function excluirProduto(id: string) {
    await removerProduto(id)
    produtos.value = produtos.value.filter(p => p.id !== id)
    totalProdutos.value--
  }

  async function buscarPorCodigoBarras(codigo: string) {
    buscandoBarcode.value = true
    erroBarcode.value = null
    metadadosBarcode.value = null
    try {
      metadadosBarcode.value = await buscarMetadadosCodigoBarras(codigo)
    } catch (e: unknown) {
      erroBarcode.value = 'Não foi possível encontrar o produto'
    } finally {
      buscandoBarcode.value = false
    }
  }

  async function carregarMovimentacoes(produtoId: string, pagina = 1) {
    carregandoMovimentacoes.value = true
    try {
      const res = await listarMovimentacoes(produtoId, pagina)
      movimentacoes.value = res.data
    } finally {
      carregandoMovimentacoes.value = false
    }
  }

  async function carregarFinanceiro(mes?: number, ano?: number) {
    carregandoFinanceiro.value = true
    try {
      const res = await listarLancamentos(mes, ano)
      lancamentos.value = res.data
    } finally {
      carregandoFinanceiro.value = false
    }
  }

  return {
    produtos,
    totalProdutos,
    carregandoProdutos,
    metadadosBarcode,
    buscandoBarcode,
    erroBarcode,
    movimentacoes,
    carregandoMovimentacoes,
    lancamentos,
    carregandoFinanceiro,
    carregarProdutos,
    adicionarProduto,
    editarProduto,
    excluirProduto,
    buscarPorCodigoBarras,
    carregarMovimentacoes,
    carregarFinanceiro,
  }
})