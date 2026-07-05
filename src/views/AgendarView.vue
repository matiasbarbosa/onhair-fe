<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import DatePicker from 'primevue/datepicker'
import { usePrimeVue } from 'primevue/config'
import { useAuthStore } from '@/stores/auth.store'
import { useAgendaStore } from '@/stores/agenda.store'
import WizardProgress from '@/components/wizard/WizardProgress.vue'
import TimeSlotGrid from '@/components/wizard/TimeSlotGrid.vue'
import ProfessionalCard from '@/components/wizard/ProfessionalCard.vue'
import BookingSummary from '@/components/wizard/BookingSummary.vue'
import AppButton from '@/components/shared/AppButton.vue'

interface Servico { id: string; nome: string; duracao: string; preco: string }
interface Profissional { id: string; nome: string; especialidades: string[]; avatar: string }
interface SlotInfo { time: string; available: boolean }

const STEPS = { SERVICO: 1, DATA: 2, PROFISSIONAL: 3, HORARIO: 4, DADOS: 5, CONFIRMADO: 6 } as const
type Step = typeof STEPS[keyof typeof STEPS]

const SERVICOS: Servico[] = [
  { id: 'corte',      nome: 'Corte',                duracao: '1h',   preco: 'R$ 80'  },
  { id: 'coloracao',  nome: 'Coloração e Mechas',   duracao: '2h',   preco: 'R$ 150' },
  { id: 'tratamento', nome: 'Tratamento Capilar',   duracao: '1.5h', preco: 'R$ 120' },
  { id: 'manicure',   nome: 'Manicure e Pedicure',  duracao: '1h',   preco: 'R$ 60'  },
]

const PROFISSIONAIS: Profissional[] = [
  { id: 'ana',    nome: 'Ana Lima',    especialidades: ['corte','coloracao','tratamento'], avatar: 'AL' },
  { id: 'bruna',  nome: 'Bruna Souza', especialidades: ['corte','coloracao'],             avatar: 'BS' },
  { id: 'camila', nome: 'Camila Reis', especialidades: ['manicure','tratamento'],         avatar: 'CR' },
]

const HORARIOS = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00']
const fluxo = ['Serviço','Data','Profissional','Horário','Dados']

// ─── Locale pt-BR ──────────────────────────────────────────────────────
const primevue = usePrimeVue()
onMounted(() => {
  primevue.config.locale = {
    firstDayOfWeek: 1,
    dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
    dayNamesMin: ['D','S','T','Q','Q','S','S'],
    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
    today: 'Hoje', clear: 'Limpar',
    fileSizeTypes: ['B'],
  }
})

// ─── Estado ────────────────────────────────────────────────────────────
const auth = useAuthStore()
const agenda = useAgendaStore()

const step = ref<Step>(STEPS.SERVICO)
const selecao = ref({
  servicoId: null as string | null, data: null as Date | null,
  profissionalId: null as string | null, horario: null as string | null,
})
const slots = ref<SlotInfo[]>([])
const loadingSlots = ref(false)
const confirmando = ref(false)
const erroConfirmacao = ref<string | null>(null)

const servicoSelecionado = computed(() => SERVICOS.find(s => s.id === selecao.value.servicoId) ?? null)
const profissionalSelecionado = computed(() => PROFISSIONAIS.find(p => p.id === selecao.value.profissionalId) ?? null)

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

const progressoPct = computed(() => Math.round(((step.value - 1) / STEPS.DADOS) * 100))
const podeConfirmar = computed(() =>
  !!selecao.value.horario && !confirmando.value
)

// ─── Navegação ─────────────────────────────────────────────────────────
function irParaStep(novoStep: number) { step.value = novoStep as Step }

function resetarApartirDe(etapa: Step) {
  if (etapa <= STEPS.DATA)         selecao.value.data = null
  if (etapa <= STEPS.PROFISSIONAL) selecao.value.profissionalId = null
  if (etapa <= STEPS.HORARIO)    { selecao.value.horario = null; slots.value = [] }
}

function selecionarServico(id: string) {
  selecao.value.servicoId = id
  resetarApartirDe(STEPS.DATA)
  irParaStep(STEPS.DATA)
}

function selecionarData(data: Date) {
  selecao.value.data = data
  resetarApartirDe(STEPS.PROFISSIONAL)
  irParaStep(STEPS.PROFISSIONAL)
}

function selecionarProfissional(id: string) {
  selecao.value.profissionalId = id
  irParaStep(STEPS.HORARIO)
  carregarSlots()
}

function selecionarHorario(horario: string) {
  selecao.value.horario = horario
  irParaStep(STEPS.DADOS)
}

async function confirmar() {
  erroConfirmacao.value = null
  confirmando.value = true
  try {
    await agenda.confirmarAgendamento({
      nome: auth.usuario?.nome ?? '',
      telefone: auth.usuario?.telefone ?? '',
      clienteId: auth.usuario?.id ?? '1',
    })
    irParaStep(STEPS.CONFIRMADO)
  } catch {
    erroConfirmacao.value = 'Erro ao confirmar agendamento. Tente novamente.'
  } finally {
    confirmando.value = false
  }
}

async function carregarSlots() {
  const { data, profissionalId, servicoId } = selecao.value
  if (!data || !profissionalId || !servicoId) return
  loadingSlots.value = true; slots.value = []
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
          <WizardProgress
            :steps="fluxo"
            :current-step="step"
            :progress-pct="progressoPct"
            @go-to="irParaStep"
          />

          <transition name="step-slide" mode="out-in">
            <div :key="step" class="step-panel">

              <!-- Passo 1: Serviço -->
              <template v-if="step === STEPS.SERVICO">
                <h2 class="step-title">Escolha o serviço</h2>
                <div class="servicos-grid">
                  <button
                    v-for="servico in SERVICOS" :key="servico.id"
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
                    v-model="selecao.data" inline
                    :min-date="minDate" :disabled-days="[0]"
                    :show-time="false" :show-button-bar="false" :show-other-months="false"
                    date-format="dd/mm/yy"
                    @date-select="selecionarData"
                  />
                </div>
              </template>

              <!-- Passo 3: Profissional -->
              <template v-else-if="step === STEPS.PROFISSIONAL">
                <h2 class="step-title">Escolha o profissional</h2>
                <div class="profs-list">
                  <ProfessionalCard
                    v-for="prof in profissionaisDisponiveis" :key="prof.id"
                    :profissional="prof"
                    :selected="prof.id === selecao.profissionalId"
                    :specialties-label="SERVICOS.filter(s => prof.especialidades.includes(s.id)).map(s => s.nome).join(' · ')"
                    @select="selecionarProfissional"
                  />
                </div>
              </template>

              <!-- Passo 4: Horário -->
              <template v-else-if="step === STEPS.HORARIO">
                <h2 class="step-title">Escolha o horário</h2>
                <TimeSlotGrid
                  :slots="slots"
                  :selected="selecao.horario"
                  :loading="loadingSlots"
                  @select="selecionarHorario"
                />
              </template>

<!-- Passo 5: Revisão e confirmação -->
              <template v-else-if="step === STEPS.DADOS">
                <h2 class="step-title">Revisar e Confirmar</h2>

                <BookingSummary
                  :servico="servicoSelecionado?.nome ?? ''"
                  :profissional="profissionalSelecionado?.nome ?? ''"
                  :data="dataFormatada"
                  :horario="selecao.horario ?? ''"
                  :valor="servicoSelecionado?.preco ?? ''"
                />

                <div class="auth-user-info">
                  <span class="auth-label">Agendando como</span>
                  <span class="auth-name">{{ auth.usuario?.nome }}</span>
                  <span class="auth-email">{{ auth.usuario?.email }}</span>
                </div>

                <p v-if="erroConfirmacao" class="error">{{ erroConfirmacao }}</p>

                <div class="step-actions">
                  <AppButton variant="ghost" @click="irParaStep(STEPS.HORARIO)">Voltar</AppButton>
                  <AppButton :disabled="!podeConfirmar" @click="confirmar">
                    {{ confirmando ? 'Confirmando...' : 'Confirmar Agendamento' }}
                  </AppButton>
                </div>
              </template>

            </div>
          </transition>
        </div>

        <!-- Confirmação -->
        <div v-else class="done-wrap">
          <div class="done-panel glass-panel">
            <div class="done-icon">✓</div>
            <h2>Agendamento Confirmado!</h2>
            <p>{{ servicoSelecionado?.nome }} com {{ profissionalSelecionado?.nome }}</p>
            <p class="done-sub">{{ dataFormatada }} às {{ selecao.horario }}</p>
            <AppButton tag="RouterLink" to="/" variant="outline" size="lg" style="margin-top: 1.5rem; width: 100%">
              Voltar ao início
            </AppButton>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<style scoped>
.agendar-page {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-family);
  min-height: 100vh;
}

.container {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* ── Header ────────────────────────────────────────────────────────── */
.header {
  position: fixed; top: 0; left: 0; right: 0; z-index: var(--z-header);
  background: var(--color-bg-overlay);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border-subtle);
  height: var(--header-height);
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: var(--max-width-container);
  margin: 0 auto;
  padding: 0 var(--space-8);
}

.logo {
  color: var(--color-gold-500);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  letter-spacing: 0.1em;
}

/* ── Hero ──────────────────────────────────────────────────────────── */
.hero {
  min-height: 28vh;
  display: flex;
  align-items: flex-end;
  background: radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 65%), var(--color-bg-primary);
  padding-top: var(--header-height);
  padding-bottom: var(--space-8);
}

.hero-content { text-align: center; width: 100%; }

.hero-content h1 {
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-2);
  background: linear-gradient(135deg, var(--color-text-secondary) 40%, var(--color-gold-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle { color: var(--color-text-muted); font-size: var(--font-size-base); }

.section { padding: var(--space-10) 0 var(--space-20); }

/* ── Wizard ─────────────────────────────────────────────────────────── */
.wizard-wrap { display: flex; flex-direction: column; }

.step-panel {
  width: 100%;
  min-height: 500px;
}

.step-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-6);
  color: var(--color-text-secondary);
}

/* ── Step Transitions ───────────────────────────────────────────────── */
.step-slide-enter-active,
.step-slide-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}
.step-slide-enter-from { opacity: 0; transform: translateX(24px); }
.step-slide-leave-to   { opacity: 0; transform: translateX(-24px); }

/* ── Serviços Grid ──────────────────────────────────────────────────── */
.servicos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }

.servico-card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-family: var(--font-family);
  color: var(--color-text-primary);
}

.servico-card:hover  { background: var(--color-gold-100); border-color: rgba(201,168,76,0.35); }
.servico-card.active { background: rgba(201,168,76,0.13); border-color: var(--color-gold-500); }
.serv-nome { font-size: var(--font-size-base); font-weight: var(--font-weight-medium); }
.serv-meta { color: var(--color-text-muted); font-size: var(--font-size-xs); }

/* ── Profissionais List ─────────────────────────────────────────────── */
.profs-list { display: flex; flex-direction: column; gap: var(--space-3); }

/* ── Calendário ─────────────────────────────────────────────────────── */
.cal-wrap { display: flex; justify-content: center; }

/* ── Auth User Info ────────────────────────────────────────────────── */
.auth-user-info {
  background: var(--color-gold-100);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  margin-bottom: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.auth-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.auth-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.auth-email {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  padding: var(--space-3);
  background: rgba(248, 113, 113, 0.1);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.step-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-6);
  gap: var(--space-4);
}

/* ── Confirmação ────────────────────────────────────────────────────── */
.done-wrap  { max-width: 480px; margin: 0 auto; }
.done-panel { text-align: center; padding: var(--space-12) var(--space-8); border-radius: var(--radius-xl); }
.done-icon  { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--color-gold-500), var(--color-gold-300)); color: var(--color-bg-primary); font-size: 1.8rem; font-weight: var(--font-weight-bold); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-6); }
.done-panel h2 { font-size: 1.6rem; color: var(--color-text-secondary); margin-bottom: var(--space-2); }
.done-panel p  { color: var(--color-text-muted); font-size: var(--font-size-base); margin: var(--space-1) 0; }
.done-sub      { color: var(--color-gold-500) !important; font-weight: var(--font-weight-semibold); }
.glass-panel   { background: var(--color-bg-elevated); border: 1px solid var(--color-border-default); }

/* ── PrimeVue Calendar Theming ──────────────────────────────────────── */
:deep(.p-datepicker) {
  background: transparent !important;
  border: none !important;
  font-family: var(--font-family);
  color: var(--color-text-primary);
  width: 100%;
  box-shadow: none !important;
}

:deep(.p-datepicker-header) {
  background: transparent !important;
  border-bottom: 1px solid var(--color-border-subtle) !important;
  padding: var(--space-2) var(--space-1) var(--space-3) !important;
}

:deep(.p-datepicker-select-month) { color: var(--color-text-secondary) !important; font-weight: var(--font-weight-semibold); font-size: var(--font-size-base); background: transparent !important; border: none !important; padding: var(--space-1) var(--space-2); cursor: pointer; border-radius: var(--radius-md); }
:deep(.p-datepicker-select-year)  { color: var(--color-text-secondary) !important; font-weight: var(--font-weight-semibold); font-size: var(--font-size-base); background: transparent !important; border: none !important; padding: var(--space-1) var(--space-2); cursor: pointer; border-radius: var(--radius-md); }

:deep(.p-datepicker-select-month:hover) { color: var(--color-gold-500) !important; background: var(--color-gold-100) !important; }
:deep(.p-datepicker-select-year:hover)  { color: var(--color-gold-500) !important; background: var(--color-gold-100) !important; }

:deep(.p-datepicker-prev-button) { color: var(--color-text-muted) !important; width: 2rem !important; height: 2rem !important; border-radius: 50% !important; background: transparent !important; border: none !important; }
:deep(.p-datepicker-next-button) { color: var(--color-text-muted) !important; width: 2rem !important; height: 2rem !important; border-radius: 50% !important; background: transparent !important; border: none !important; }

:deep(.p-datepicker-prev-button:hover) { background: rgba(201,168,76,0.12) !important; color: var(--color-gold-500) !important; }
:deep(.p-datepicker-next-button:hover) { background: rgba(201,168,76,0.12) !important; color: var(--color-gold-500) !important; }

:deep(.p-datepicker-weekday-cell) { color: var(--color-text-muted) !important; font-weight: var(--font-weight-medium); font-size: var(--font-size-sm); padding: var(--space-2) 0; text-align: center; }
:deep(.p-datepicker-day-view th)  { color: var(--color-text-muted) !important; font-weight: var(--font-weight-medium); font-size: var(--font-size-sm); padding: var(--space-2) 0; text-align: center; }

:deep(.p-datepicker-day-cell) { padding: 0.15rem; }
:deep(.p-datepicker-day) { width: 2.4rem !important; height: 2.4rem !important; border-radius: var(--radius-lg) !important; color: var(--color-text-primary) !important; background: transparent !important; border: none !important; font-size: var(--font-size-base); }
:deep(.p-datepicker-day:not(.p-disabled):not(.p-datepicker-day-selected):hover) { background: rgba(201,168,76,0.12) !important; }
:deep(.p-datepicker-day-selected) { background: var(--color-gold-500) !important; color: var(--color-bg-primary) !important; font-weight: var(--font-weight-bold); }
:deep(.p-datepicker-day-today:not(.p-datepicker-day-selected)) { background: rgba(201,168,76,0.1) !important; border: 1px solid rgba(201,168,76,0.35) !important; color: var(--color-gold-500) !important; }
:deep(.p-datepicker-day.p-disabled) { color: rgba(255,255,255,0.18) !important; cursor: not-allowed !important; }

:deep(.p-datepicker-month-view .p-datepicker-month) { color: var(--color-text-primary); border-radius: var(--radius-lg); padding: 0.6rem; background: transparent; border: none; cursor: pointer; }
:deep(.p-datepicker-year-view .p-datepicker-year)   { color: var(--color-text-primary); border-radius: var(--radius-lg); padding: 0.6rem; background: transparent; border: none; cursor: pointer; }

:deep(.p-datepicker-month:not(.p-disabled):hover)  { background: rgba(201,168,76,0.12) !important; color: var(--color-gold-500) !important; }
:deep(.p-datepicker-year:not(.p-disabled):hover)   { background: rgba(201,168,76,0.12) !important; color: var(--color-gold-500) !important; }
:deep(.p-datepicker-month.p-datepicker-month-selected) { background: var(--color-gold-500) !important; color: var(--color-bg-primary) !important; font-weight: var(--font-weight-bold); }
:deep(.p-datepicker-year.p-datepicker-year-selected)   { background: var(--color-gold-500) !important; color: var(--color-bg-primary) !important; font-weight: var(--font-weight-bold); }

/* ── Responsive ─────────────────────────────────────────────────────── */
@media (max-width: 560px) {
  .step-panel    { padding: var(--space-6); }
  .servicos-grid { grid-template-columns: 1fr; }
}
</style>