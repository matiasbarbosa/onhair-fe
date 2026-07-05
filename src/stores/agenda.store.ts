/**
 * Agenda Store — Gerencia fluxo de agendamento.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Servico, Profissional, Agendamento, SlotHorario } from '@/types'
import {
  listarServicos,
  listarProfissionais,
  listarSlots,
  criarAgendamento,
  listarAgendamentos,
  cancelarAgendamento,
} from '@/services/agenda.service'

export const useAgendaStore = defineStore('agenda', () => {
  const servicos = ref<Servico[]>([])
  const profissionais = ref<Profissional[]>([])
  const agendamentos = ref<Agendamento[]>([])
  const slots = ref<SlotHorario[]>([])
  const loadingSlots = ref(false)
  const carregando = ref(false)

  const profissionaisDisponiveis = computed(() => {
    const servicoAtual = selecao.value.servicoId
    if (!servicoAtual) return profissionais.value
    return profissionais.value.filter(p =>
      p.especialidades.includes(servicoAtual as never)
    )
  })

  // ── Wizard state ──────────────────────────────────────────────────────

  const step = ref(1)
  const selecao = ref({
    servicoId: null as string | null,
    data: null as string | null,
    profissionalId: null as string | null,
    horario: null as string | null,
  })

  const servicoSelecionado = computed(() =>
    servicos.value.find(s => s.id === selecao.value.servicoId) ?? null
  )

  const profissionalSelecionado = computed(() =>
    profissionais.value.find(p => p.id === selecao.value.profissionalId) ?? null
  )

  const progressoPct = computed(() => Math.round(((step.value - 1) / 5) * 100))

  async function carregarServicos() {
    servicos.value = await listarServicos()
  }

  async function carregarProfissionais(servicoId?: string) {
    profissionais.value = await listarProfissionais(servicoId)
  }

  async function carregarSlots(profissionalId: string, data: string) {
    loadingSlots.value = true
    slots.value = []
    try {
      slots.value = await listarSlots(profissionalId, data)
    } finally {
      loadingSlots.value = false
    }
  }

  async function confirmarAgendamento(dados: {
    nome: string
    telefone: string
    clienteId: string
  }): Promise<Agendamento | null> {
    const { servicoId, profissionalId, data, horario } = selecao.value
    if (!servicoId || !profissionalId || !data || !horario) return null

    carregando.value = true
    try {
      const agendamento = await criarAgendamento({
        servicoId,
        profissionalId,
        data,
        horario,
        clienteId: dados.clienteId,
      })
      return agendamento
    } finally {
      carregando.value = false
    }
  }

  async function carregarAgendamentos(clienteId: string) {
    carregando.value = true
    try {
      agendamentos.value = await listarAgendamentos(clienteId)
    } finally {
      carregando.value = false
    }
  }

  async function cancelar(id: string) {
    await cancelarAgendamento(id)
    agendamentos.value = agendamentos.value.map(a =>
      a.id === id ? { ...a, status: 'cancelado' as const } : a
    )
  }

  function resetarWizard() {
    step.value = 1
    selecao.value = { servicoId: null, data: null, profissionalId: null, horario: null }
    slots.value = []
  }

  return {
    servicos,
    profissionais,
    profissionaisDisponiveis,
    agendamentos,
    slots,
    loadingSlots,
    carregando,
    step,
    selecao,
    servicoSelecionado,
    profissionalSelecionado,
    progressoPct,
    carregarServicos,
    carregarProfissionais,
    carregarSlots,
    confirmarAgendamento,
    carregarAgendamentos,
    cancelar,
    resetarWizard,
  }
})