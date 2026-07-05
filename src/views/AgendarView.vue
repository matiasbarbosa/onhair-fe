<script setup lang="ts">
/**
 * Refatorações aplicadas (Martin Fowler – Refatoração, 2ª ed.):
 *
 * 1. Substituir Primitivo por Objeto (Replace Primitive with Object)
 *    → STEPS enum nomeado no lugar de números mágicos (1, 2, 3...)
 *
 * 2. Introduzir Objeto de Parâmetros (Introduce Parameter Object)
 *    → `selecao` agrupa as 4 refs soltas que sempre andavam juntas
 *
 * 3. Extrair Função (Extract Function)
 *    → `resetarApartirDe()` extrai lógica de reset duplicada em cada avancar*
 *
 * 4. Separar Consulta de Modificador (Separate Query from Modifier)
 *    → `carregarSlots()` separado de `selecionarProfissional()`
 *    → computeds são consultas puras, sem efeitos colaterais
 *
 * 5. Encapsular Variável (Encapsulate Variable)
 *    → `podeConfirmar` computed no lugar da expressão inline no template
 *
 * 6. Renomear Variável (Rename Variable)
 *    → `form` → `dadosCliente`, `servicoAtual` → `servicoSelecionado`, etc.
 *
 * 7. Substituir Variável Temporária por Consulta (Replace Temp with Query)
 *    → todo estado derivado vira computed, não variável temporária
 */

import { ref, computed, onMounted } from 'vue'
import DatePicker from 'primevue/datepicker'
import { usePrimeVue } from 'primevue/config'

// ─── Locale pt-BR ────────────────────────────────────────────────────────────

const primevue = usePrimeVue()
onMounted(() => {
  primevue.config.locale = {
    firstDayOfWeek: 1,
    dayNames:      ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
    dayNamesMin:   ['D','S','T','Q','Q','S','S'],
    monthNames:    ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
    today: 'Hoje',
    clear: 'Limpar',
    fileSizeTypes: ['B'],
  }
})

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Servico {
  id: string
  nome: string
  duracao: string
  preco: string
}

interface Profissional {
  id: string
  nome: string
  especialidades: string[]
  avatar: string
}

interface SlotInfo {
  time: string
  available: boolean
}

// ─── Refatoração 1: Substituir Primitivo por Objeto ──────────────────────────
// Antes: step = ref(1), step.value === 3 → não diz nada sobre o que é "3"
// Depois: step.value === STEPS.PROFISSIONAL → intenção explícita

const STEPS = {
  SERVICO:     1,
  DATA:        2,
  PROFISSIONAL:3,
  HORARIO:     4,
  DADOS:       5,
  CONFIRMADO:  6,
} as const
type Step = typeof STEPS[keyof typeof STEPS]

// ─── Dados ───────────────────────────────────────────────────────────────────

const SERVICOS: Servico[] = [
  { id: 'corte',     nome: 'Corte',                duracao: '1h',   preco: 'R$ 80'  },
  { id: 'coloracao', nome: 'Coloração e Mechas',   duracao: '2h',   preco: 'R$ 150' },
  { id: 'tratamento',nome: 'Tratamento Capilar',   duracao: '1.5h', preco: 'R$ 120' },
  { id: 'manicure',  nome: 'Manicure e Pedicure',  duracao: '1h',   preco: 'R$ 60'  },
]

const PROFISSIONAIS: Profissional[] = [
  { id: 'ana',    nome: 'Ana Lima',    especialidades: ['corte','coloracao','tratamento'], avatar: 'AL' },
  { id: 'bruna',  nome: 'Bruna Souza', especialidades: ['corte','coloracao'],             avatar: 'BS' },
  { id: 'camila', nome: 'Camila Reis', especialidades: ['manicure','tratamento'],         avatar: 'CR' },
]

const HORARIOS = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00']

const fluxo = ['Serviço','Data','Profissional','Horário','Dados']

// ─── Estado ───────────────────────────────────────────────────────────────────

const step = ref<Step>(STEPS.SERVICO)

// ─── Refatoração 2: Introduzir Objeto de Parâmetros ──────────────────────────
// Antes: 4 refs soltas que sempre andavam juntas e eram resetadas em conjunto
//   selectedServId, selectedDate, selectedProfId, selectedTime
// Depois: um único objeto `selecao` que comunica que esses dados formam um todo

const selecao = ref({
  servicoId:     null as string | null,
  data:          null as Date   | null,
  profissionalId:null as string | null,
  horario:       null as string | null,
})

// ─── Refatoração 6: Renomear Variável ────────────────────────────────────────
// Antes: `form` (genérico) → Depois: `dadosCliente` (revela intenção)

const dadosCliente = ref({ nome: '', telefone: '' })

const slots        = ref<SlotInfo[]>([])
const loadingSlots = ref(false)

// ─── Refatoração 7: Substituir Variável Temporária por Consulta ──────────────
// Antes: variáveis derivadas calculadas no momento do uso, com nomes opacos
//   servicoAtual, profAtual, profissionaisDoServico, dateStr, progressPct
// Depois: computeds nomeados, com intenção clara

const servicoSelecionado = computed(() =>
  SERVICOS.find(s => s.id === selecao.value.servicoId) ?? null
)

const profissionalSelecionado = computed(() =>
  PROFISSIONAIS.find(p => p.id === selecao.value.profissionalId) ?? null
)

// ─── Refatoração 4: Separar Consulta de Modificador ──────────────────────────
// Computeds são consultas puras — não mudam estado, só lêem

const profissionaisDisponiveis = computed(() =>
  selecao.value.servicoId
    ? PROFISSIONAIS.filter(p => p.especialidades.includes(selecao.value.servicoId!))
    : []
)

const dataFormatada = computed(() =>
  selecao.value.data
    ? selecao.value.data.toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long' })
    : ''
)

const progressoPct = computed(() =>
  Math.round(((step.value - 1) / STEPS.DADOS) * 100)
)

// ─── Refatoração 5: Encapsular Variável ──────────────────────────────────────
// Antes: !form.nome || !form.telefone espalhado no template
// Depois: computed nomeado que revela o conceito "pode confirmar"

const podeConfirmar = computed(() =>
  Boolean(dadosCliente.value.nome && dadosCliente.value.telefone)
)

// ─── Refatoração 3: Extrair Função ───────────────────────────────────────────
// Antes: cada `avancar*` repetia a mesma lógica de reset:
//   selectedProfId.value = null; selectedTime.value = null; slots.value = []
// Depois: uma única função extrai e nomeia essa responsabilidade

function resetarApartirDe(etapa: Step) {
  if (etapa <= STEPS.DATA)         selecao.value.data = null
  if (etapa <= STEPS.PROFISSIONAL) selecao.value.profissionalId = null
  if (etapa <= STEPS.HORARIO)    { selecao.value.horario = null; slots.value = [] }
}

// ─── Navegação ────────────────────────────────────────────────────────────────

function irParaStep(novoStep: Step) {
  step.value = novoStep
}

function selecionarServico(id: string) {
  selecao.value.servicoId = id
  resetarApartirDe(STEPS.DATA)   // limpa tudo que depende do serviço
  irParaStep(STEPS.DATA)
}

function selecionarData(data: Date) {
  selecao.value.data = data
  resetarApartirDe(STEPS.PROFISSIONAL) // limpa tudo que depende da data
  irParaStep(STEPS.PROFISSIONAL)
}

// ─── Refatoração 4: Separar Consulta de Modificador ──────────────────────────
// Antes: `avancarProfissional` navegava E carregava slots num só lugar —
//   mistura de "mudar estado de navegação" com "buscar dados externos"
// Depois: selecionarProfissional() navega; carregarSlots() busca dados

function selecionarProfissional(id: string) {
  selecao.value.profissionalId = id
  irParaStep(STEPS.HORARIO)
  carregarSlots()                // chamada explícita e separada
}

function selecionarHorario(horario: string) {
  selecao.value.horario = horario
  irParaStep(STEPS.DADOS)
}

function confirmar() {
  irParaStep(STEPS.CONFIRMADO)
}

// ─── Carregamento de slots ────────────────────────────────────────────────────
// Responsabilidade única: só busca dados, não navega

async function carregarSlots() {
  const { data, profissionalId, servicoId } = selecao.value
  if (!data || !profissionalId || !servicoId) return

  loadingSlots.value = true
  slots.value = []

  await new Promise(r => setTimeout(r, 380))

  const seed = data.getDate() + data.getMonth() * 31
  slots.value = HORARIOS.map((time, i) => {
    const hash = (seed + i * 7 + profissionalId.charCodeAt(0)) % 10
    return { time, available: hash > 3 }
  })

  loadingSlots.value = false
}

const minDate = new Date()
minDate.setHours(0, 0, 0, 0)
</script>

<template>
  <div class="agendar-page">
    <header class="header">
      <div class="container header-content">
        <RouterLink to="/" class="logo">onHair Studio</RouterLink>
      </div>
    </header>

    <section class="hero">
      <div class="container hero-content">
        <h1>Agende Online</h1>
        <p class="hero-subtitle">Agendamento rápido em poucos passos</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div v-if="step < STEPS.CONFIRMADO" class="wizard-wrap">
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" :style="{ width: `${progressoPct}%` }" />
          </div>

          <div class="steps-nav">
            <button
              v-for="(label, index) in fluxo"
              :key="label"
              class="step-pill"
              :class="{
                active:   step === index + 1,
                done:     step >  index + 1,
                disabled: step <  index + 1,
              }"
              :disabled="step < index + 1"
              @click="irParaStep((index + 1) as Step)"
            >
              <span class="pill-num">{{ index + 1 }}</span>
              <span class="pill-label">{{ label }}</span>
            </button>
          </div>

          <transition name="step-slide" mode="out-in">
            <div :key="step" class="step-panel">

              <!-- Passo 1: Serviço -->
              <template v-if="step === STEPS.SERVICO">
                <h2 class="step-title">Escolha o serviço</h2>
                <div class="servicos-grid">
                  <button
                    v-for="servico in SERVICOS"
                    :key="servico.id"
                    class="servico-card"
                    :class="{ active: servico.id === selecao.servicoId }"
                    @click="selecionarServico(servico.id)"
                  >
                    <span class="serv-nome">{{ servico.nome }}</span>
                    <span class="serv-meta">{{ servico.duracao }} · {{ servico.preco }}</span>
                  </button>
                </div>
              </template>

              <!-- Passo 2: Data -->
              <template v-else-if="step === STEPS.DATA">
                <h2 class="step-title">Escolha a data</h2>
                <div class="cal-wrap">
                  <DatePicker
                    v-model="selecao.data"
                    inline
                    :min-date="minDate"
                    :disabled-days="[0]"
                    :show-time="false"
                    :show-button-bar="false"
                    :show-other-months="false"
                    date-format="dd/mm/yy"
                    @date-select="selecionarData"
                  />
                </div>
              </template>

              <!-- Passo 3: Profissional -->
              <template v-else-if="step === STEPS.PROFISSIONAL">
                <h2 class="step-title">Escolha o profissional</h2>
                <div class="profs-list">
                  <button
                    v-for="prof in profissionaisDisponiveis"
                    :key="prof.id"
                    class="prof-card"
                    :class="{ active: prof.id === selecao.profissionalId }"
                    @click="selecionarProfissional(prof.id)"
                  >
                    <div class="prof-avatar">{{ prof.avatar }}</div>
                    <div class="prof-info">
                      <span class="prof-nome">{{ prof.nome }}</span>
                      <span class="prof-esp">
                        {{ SERVICOS.filter(s => prof.especialidades.includes(s.id)).map(s => s.nome).join(' · ') }}
                      </span>
                    </div>
                    <span class="arrow-icon">→</span>
                  </button>
                </div>
              </template>

              <!-- Passo 4: Horário -->
              <template v-else-if="step === STEPS.HORARIO">
                <h2 class="step-title">Escolha o horário</h2>
                <div v-if="loadingSlots" class="loading">
                  <span class="spinner" />
                  Verificando disponibilidade...
                </div>
                <div v-else class="slots-grid">
                  <button
                    v-for="slot in slots"
                    :key="slot.time"
                    class="slot-btn"
                    :class="{
                      selected:    slot.time === selecao.horario,
                      unavailable: !slot.available,
                    }"
                    :disabled="!slot.available"
                    @click="selecionarHorario(slot.time)"
                  >
                    <span class="slot-time">{{ slot.time }}</span>
                    <span class="slot-status">{{ slot.available ? 'livre' : 'ocupado' }}</span>
                  </button>
                </div>
              </template>

              <!-- Passo 5: Dados do cliente -->
              <template v-else-if="step === STEPS.DADOS">
                <h2 class="step-title">Seus dados</h2>

                <div class="booking-summary">
                  <div class="sum-row">
                    <span>Serviço</span>      <strong>{{ servicoSelecionado?.nome }}</strong>
                  </div>
                  <div class="sum-row">
                    <span>Profissional</span> <strong>{{ profissionalSelecionado?.nome }}</strong>
                  </div>
                  <div class="sum-row">
                    <span>Data</span>         <strong>{{ dataFormatada }}</strong>
                  </div>
                  <div class="sum-row">
                    <span>Horário</span>      <strong>{{ selecao.horario }}</strong>
                  </div>
                  <div class="sum-row">
                    <span>Valor</span>        <strong>{{ servicoSelecionado?.preco }}</strong>
                  </div>
                </div>

                <div class="form-group">
                  <label>Nome</label>
                  <input v-model="dadosCliente.nome" type="text" placeholder="Seu nome" />
                </div>

                <div class="form-group">
                  <label>Telefone</label>
                  <input v-model="dadosCliente.telefone" type="tel" placeholder="(21) 9XXXX-XXXX" />
                </div>

                <div class="step-actions">
                  <button class="btn-ghost" @click="irParaStep(STEPS.HORARIO)">Voltar</button>
                  <!-- podeConfirmar encapsula a regra de negócio, não a lógica crua -->
                  <button class="btn-primary" :disabled="!podeConfirmar" @click="confirmar">
                    Confirmar
                  </button>
                </div>
              </template>

            </div>
          </transition>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped src="./agendar/style.css"></style>
