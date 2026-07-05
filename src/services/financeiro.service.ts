/**
 * Financeiro Service — Lançamentos e resumo financeiro.
 *
 * Backend Go (em desenvolvimento):
 *   GET    /api/v1/financeiro/lancamentos?mes=&ano=&categoria=   → ApiResponse<LancamentoFinanceiro[]>
 *   POST   /api/v1/financeiro/lancamentos                        → body: LancamentoInput
 *   GET    /api/v1/financeiro/resumo?mes=&ano=                   → { receitas, despesas, saldo }
 *   GET    /api/v1/financeiro/relatorio?inicio=&fim=             → CSV / PDF
 */

import type { LancamentoFinanceiro, ApiResponse } from '@/types'

export async function listarLancamentos(mes?: number, ano?: number): Promise<ApiResponse<LancamentoFinanceiro[]>> {
  // return apiGet<ApiResponse<LancamentoFinanceiro[]>>('/financeiro/lancamentos', {
  //   mes: mes ? String(mes) : '',
  //   ano: ano ? String(ano) : '',
  // })

  // ── Mock ──
  await delay(300)
  return {
    data: [
      { id: '1', tipo: 'receita', categoria: 'Serviço', descricao: 'Corte - Cliente A',      valor: 8000,  data: '2026-07-03', agendamentoId: '1' },
      { id: '2', tipo: 'receita', categoria: 'Serviço', descricao: 'Coloração - Cliente B',  valor: 15000, data: '2026-07-03', agendamentoId: '2' },
      { id: '3', tipo: 'despesa', categoria: 'Estoque',  descricao: 'Compra Shampoo',         valor: 3500,  data: '2026-07-01' },
      { id: '4', tipo: 'despesa', categoria: 'Fixo',     descricao: 'Aluguel',                valor: 50000, data: '2026-07-01' },
    ],
    meta: { total: 4, pagina: 1, porPagina: 50 },
  }
  // ── Fim mock ──
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}