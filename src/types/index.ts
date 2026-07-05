// ─── Domínio: Cliente ───────────────────────────────────────────────────

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  criadoEm: string
}

// ─── Domínio: Agendamento ───────────────────────────────────────────────

export interface Servico {
  id: string
  nome: string
  descricao: string
  duracao: number // minutos
  preco: number   // centavos
  categoria: ServicoCategoria
  ativo: boolean
}

export type ServicoCategoria = 'corte' | 'coloracao' | 'tratamento' | 'manicure' | 'outro'

export interface Profissional {
  id: string
  nome: string
  email: string
  especialidades: ServicoCategoria[]
  avatar: string
  ativo: boolean
}

export interface Agendamento {
  id: string
  clienteId: string
  servicoId: string
  profissionalId: string
  data: string        // ISO 8601
  horario: string     // HH:mm
  status: AgendamentoStatus
  preco: number
  criadoEm: string
}

export type AgendamentoStatus = 'confirmado' | 'cancelado' | 'concluido' | 'pendente'

export interface SlotHorario {
  hora: string
  disponivel: boolean
}

// ─── Domínio: Administrativo ────────────────────────────────────────────

export interface Produto {
  id: string
  codigoBarras: string
  nome: string
  marca: string
  categoria: string
  unidade: string
  gramatura: string
  fabricante: string
  imagemUrl: string | null
  precoCusto: number
  precoVenda: number
  estoque: number
  estoqueMinimo: number
  ativo: boolean
}

export interface MovimentacaoEstoque {
  id: string
  produtoId: string
  tipo: 'entrada' | 'saida'
  quantidade: number
  motivo: string
  criadoEm: string
  criadoPor: string
}

export interface LancamentoFinanceiro {
  id: string
  tipo: 'receita' | 'despesa'
  categoria: string
  descricao: string
  valor: number
  data: string
  agendamentoId?: string
}

// ─── Domínio: Código de Barras ──────────────────────────────────────────

export interface MetadadosProduto {
  codigoBarras: string
  nome: string | null
  marca: string | null
  categoria: string | null
  gramatura: string | null
  unidade: string | null
  fabricante: string | null
  imagemUrl: string | null
  origem: 'cache' | 'api_publica' | 'api_privada' | 'manual'
}

// ─── API ─────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    pagina: number
    porPagina: number
  }
}

export interface ApiError {
  codigo: string
  mensagem: string
  detalhes?: Record<string, string[]>
}

export interface Paginacao {
  pagina: number
  porPagina: number
}

// ─── Auth ────────────────────────────────────────────────────────────────

export interface Credenciais {
  email: string
  senha: string
}

export interface Sessao {
  token: string
  expiraEm: string
  cliente: Cliente | null
  tipo: 'cliente' | 'admin'
}