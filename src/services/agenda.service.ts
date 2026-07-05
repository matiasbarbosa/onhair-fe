/**
 * Agenda Service — Agendamentos.
 *
 * Backend Go (em desenvolvimento):
 *   GET    /api/v1/servicos                          → Servico[]
 *   GET    /api/v1/profissionais                     → Profissional[]
 *   GET    /api/v1/profissionais/:id/slots?data=X    → SlotHorario[]
 *   POST   /api/v1/agendamentos                      → body: AgendamentoInput
 *   GET    /api/v1/agendamentos?clienteId=X          → Agendamento[]
 *   GET    /api/v1/agendamentos/:id                  → Agendamento
 *   PATCH  /api/v1/agendamentos/:id/cancelar         → cancela agendamento
 */

import type { Servico, Profissional, Agendamento, SlotHorario } from '@/types'
import { apiGet, apiPost, apiPatch } from './api'

export async function listarServicos(): Promise<Servico[]> {
  // return apiGet<Servico[]>('/servicos')

  // ── Mock ──
  await delay(200)
  return [
    { id: 'corte',     nome: 'Corte',                descricao: 'Corte personalizado',       duracao: 60,  preco: 8000,  categoria: 'corte',       ativo: true },
    { id: 'coloracao', nome: 'Coloração e Mechas',   descricao: 'Coloração com técnicas avançadas', duracao: 120, preco: 15000, categoria: 'coloracao',   ativo: true },
    { id: 'tratamento',nome: 'Tratamento Capilar',   descricao: 'Reconstrução e hidratação', duracao: 90,  preco: 12000, categoria: 'tratamento',  ativo: true },
    { id: 'manicure',  nome: 'Manicure e Pedicure',  descricao: 'Cuidados completos',        duracao: 60,  preco: 6000,  categoria: 'manicure',    ativo: true },
  ]
  // ── Fim mock ──
}

export async function listarProfissionais(servicoId?: string): Promise<Profissional[]> {
  // return apiGet<Profissional[]>('/profissionais', servicoId ? { servicoId } : undefined)

  // ── Mock ──
  await delay(200)
  const todos: Profissional[] = [
    { id: 'ana',    nome: 'Ana Lima',    email: 'ana@onhair.com.br',    especialidades: ['corte','coloracao','tratamento'], avatar: 'AL', ativo: true },
    { id: 'bruna',  nome: 'Bruna Souza', email: 'bruna@onhair.com.br',  especialidades: ['corte','coloracao'],             avatar: 'BS', ativo: true },
    { id: 'camila', nome: 'Camila Reis', email: 'camila@onhair.com.br', especialidades: ['manicure','tratamento'],         avatar: 'CR', ativo: true },
  ]
  return servicoId
    ? todos.filter(p => p.especialidades.includes(servicoId as never))
    : todos
  // ── Fim mock ──
}

export async function listarSlots(profissionalId: string, data: string): Promise<SlotHorario[]> {
  // return apiGet<SlotHorario[]>(`/profissionais/${profissionalId}/slots`, { data })

  // ── Mock ──
  await delay(380)
  const horaBase = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00']
  const d = new Date(data)
  const seed = d.getDate() + d.getMonth() * 31
  return horaBase.map((hora, i) => ({
    hora,
    disponivel: (seed + i * 7 + profissionalId.charCodeAt(0)) % 10 > 3,
  }))
  // ── Fim mock ──
}

export async function criarAgendamento(input: {
  servicoId: string
  profissionalId: string
  data: string
  horario: string
  clienteId: string
}): Promise<Agendamento> {
  // return apiPost<Agendamento>('/agendamentos', input)

  // ── Mock ──
  await delay(500)
  return {
    id: crypto.randomUUID(),
    clienteId: input.clienteId,
    servicoId: input.servicoId,
    profissionalId: input.profissionalId,
    data: input.data,
    horario: input.horario,
    status: 'confirmado',
    preco: 8000,
    criadoEm: new Date().toISOString(),
  }
  // ── Fim mock ──
}

export async function listarAgendamentos(clienteId: string): Promise<Agendamento[]> {
  // return apiGet<Agendamento[]>('/agendamentos', { clienteId })

  // ── Mock ──
  await delay(350)
  return [
    { id: '1', clienteId, servicoId: 'corte', profissionalId: 'ana', data: '2026-07-10', horario: '10:00', status: 'confirmado', preco: 8000, criadoEm: new Date().toISOString() },
    { id: '2', clienteId, servicoId: 'coloracao', profissionalId: 'bruna', data: '2026-06-28', horario: '15:00', status: 'concluido', preco: 15000, criadoEm: new Date().toISOString() },
  ]
  // ── Fim mock ──
}

export async function cancelarAgendamento(id: string): Promise<void> {
  // await apiPatch(`/agendamentos/${id}/cancelar`)
  await delay(300)
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}