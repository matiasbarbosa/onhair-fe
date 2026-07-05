/**
 * Estoque Service — Produtos, código de barras e movimentações.
 *
 * Backend Go (em desenvolvimento):
 *   GET    /api/v1/produtos?pagina=&porPagina=&busca=           → ApiResponse<Produto[]>
 *   GET    /api/v1/produtos/:id                                 → Produto
 *   POST   /api/v1/produtos                                     → body: ProdutoInput
 *   PUT    /api/v1/produtos/:id                                 → body: ProdutoInput
 *   DELETE /api/v1/produtos/:id
 *   GET    /api/v1/produtos/barcode/:codigo/metadados           → MetadadosProduto
 *   POST   /api/v1/produtos/barcode/lookup                      → body: {codigo} → MetadadosProduto
 *   GET    /api/v1/estoque/movimentacoes?produtoId=&pagina=     → ApiResponse<MovimentacaoEstoque[]>
 *   POST   /api/v1/estoque/movimentacoes                        → body: MovimentacaoInput
 */

import type { Produto, MovimentacaoEstoque, MetadadosProduto, ApiResponse, Paginacao } from '@/types'
import { apiGet, apiPost, apiPut, apiDelete } from './api'

export async function listarProdutos(paginacao: Paginacao): Promise<ApiResponse<Produto[]>> {
  // return apiGet<ApiResponse<Produto[]>>('/produtos', { pagina: String(paginacao.pagina), porPagina: String(paginacao.porPagina) })

  // ── Mock ──
  await delay(300)
  return {
    data: [
      { id: '1', codigoBarras: '7891234567890', nome: 'Shampoo Profissional',    marca: 'L\'Oréal',    categoria: 'Shampoo',        unidade: 'ml', gramatura: '300ml',  fabricante: 'L\'Oréal Brasil', imagemUrl: null, precoCusto: 3500, precoVenda: 6500, estoque: 24, estoqueMinimo: 5, ativo: true },
      { id: '2', codigoBarras: '7892345678901', nome: 'Condicionador Hidratante', marca: 'Wella',       categoria: 'Condicionador',  unidade: 'ml', gramatura: '250ml',  fabricante: 'Wella Professionals', imagemUrl: null, precoCusto: 2800, precoVenda: 5200, estoque: 18, estoqueMinimo: 5, ativo: true },
      { id: '3', codigoBarras: '7893456789012', nome: 'Tinta Coloração 7.0',      marca: 'Keune',       categoria: 'Coloração',      unidade: 'g',  gramatura: '60g',    fabricante: 'Keune Haircosmetics', imagemUrl: null, precoCusto: 1800, precoVenda: 3500, estoque: 8, estoqueMinimo: 10, ativo: true },
    ],
    meta: { total: 45, pagina: 1, porPagina: 20 },
  }
  // ── Fim mock ──
}

export async function criarProduto(produto: Omit<Produto, 'id'>): Promise<Produto> {
  // return apiPost<Produto>('/produtos', produto)
  await delay(400)
  return { ...produto, id: crypto.randomUUID() }
}

export async function atualizarProduto(id: string, produto: Partial<Produto>): Promise<Produto> {
  // return apiPut<Produto>(`/produtos/${id}`, produto)
  await delay(300)
  return { ...produto, id } as Produto
}

export async function removerProduto(id: string): Promise<void> {
  // await apiDelete(`/produtos/${id}`)
  await delay(200)
}

/**
 * Busca metadados do produto pelo código de barras.
 *
 * Estratégia de fallback:
 *   1. Tenta cache local (localStorage)
 *   2. Tenta API pública (Open Food Facts / Brasil API)
 *   3. Tenta API privada (Cosmetic Index / GTIN API)
 *   4. Retorna dados mínimos extraídos do próprio código (prefixo GS1)
 */
export async function buscarMetadadosCodigoBarras(codigo: string): Promise<MetadadosProduto> {
  // return apiPost<MetadadosProduto>('/produtos/barcode/lookup', { codigo })

  // ── Mock ──
  await delay(600)

  // Simula cache: se já foi buscado antes, retorna do cache com delay menor
  const cacheKey = `barcode:${codigo}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    return { ...JSON.parse(cached), origem: 'cache' as const }
  }

  // Simula busca em API pública (ex: Open Food Facts)
  // GET https://world.openfoodfacts.org/api/v2/product/${codigo}.json
  // Resposta mockada:
  const metadados: MetadadosProduto = codigo.startsWith('789')
    ? {
        codigoBarras: codigo,
        nome: 'Produto Beauty',
        marca: 'Marca Profissional',
        categoria: 'Cosméticos',
        gramatura: '200ml',
        unidade: 'ml',
        fabricante: await inferirFabricante(codigo),
        imagemUrl: null,
        origem: 'api_publica',
      }
    : {
        codigoBarras: codigo,
        nome: null,
        marca: null,
        categoria: null,
        gramatura: null,
        unidade: null,
        fabricante: null,
        imagemUrl: null,
        origem: 'manual',
      }

  // Armazena no cache por 24h
  localStorage.setItem(cacheKey, JSON.stringify(metadados))
  // ── Fim mock ──

  return metadados
}

async function inferirFabricante(codigo: string): Promise<string> {
  const prefixo = codigo.slice(0, 6)
  /*
   * Em produção, consultaria tabela GS1 ou API Brasil:
   *
   * GET https://brasilapi.com.br/api/gtin/v1/${codigo}
   * Retorna: { gtin, nome, marca, categoria, ncm, ... }
   */
  const fabricantes: Record<string, string> = {
    '789123': 'L\'Oréal Brasil',
    '789234': 'Wella Professionals',
    '789345': 'Keune Haircosmetics',
  }
  return fabricantes[prefixo] ?? 'Fabricante não identificado'
}

export async function listarMovimentacoes(produtoId: string, pagina = 1): Promise<ApiResponse<MovimentacaoEstoque[]>> {
  // return apiGet<ApiResponse<MovimentacaoEstoque[]>>('/estoque/movimentacoes', { produtoId, pagina: String(pagina) })
  await delay(250)
  return {
    data: [
      { id: '1', produtoId, tipo: 'entrada', quantidade: 10, motivo: 'Compra fornecedor', criadoEm: '2026-07-01T10:00:00Z', criadoPor: 'Admin' },
      { id: '2', produtoId, tipo: 'saida',   quantidade: 2,  motivo: 'Uso em serviço',   criadoEm: '2026-07-03T14:00:00Z', criadoPor: 'Ana Lima' },
    ],
    meta: { total: 2, pagina: 1, porPagina: 20 },
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}