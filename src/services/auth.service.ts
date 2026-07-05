/**
 * Auth Service — Autenticação JWT.
 *
 * Backend Go (em desenvolvimento):
 *   POST   /api/v1/auth/login        → body: {email, senha} → response: {token, expiraEm, usuario}
 *   POST   /api/v1/auth/registro     → body: {nome, email, telefone, senha}
 *   POST   /api/v1/auth/refresh      → header: Authorization: Bearer <refresh_token>
 *   GET    /api/v1/auth/me           → usuário logado
 */

import { apiPost, apiGet, setToken, getToken } from './api'
import type { Credenciais, Sessao, Cliente } from '@/types'

export async function login(credenciais: Credenciais): Promise<Sessao> {
  // const sessao = await apiPost<Sessao>('/auth/login', credenciais)

  // ── Mock até backend Go ficar pronto ──
  await delay(600)
  if (!credenciais.email || !credenciais.senha) {
    throw { codigo: 'CREDENCIAIS_INVALIDAS', mensagem: 'Email e senha são obrigatórios' }
  }
  const sessao: Sessao = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock',
    expiraEm: new Date(Date.now() + 24 * 3600_000).toISOString(),
    tipo: credenciais.email.includes('admin') ? 'admin' : 'cliente',
    cliente: {
      id: '1',
      nome: 'Cliente Mock',
      email: credenciais.email,
      telefone: '(21) 99999-9999',
      criadoEm: new Date().toISOString(),
    },
  }
  // ── Fim mock ──

  setToken(sessao.token)
  return sessao
}

export async function registrar(dados: { nome: string; email: string; telefone: string; senha: string }): Promise<void> {
  // await apiPost('/auth/registro', dados)
  await delay(400)
}

export async function obterSessao(): Promise<Cliente | null> {
  const t = getToken()
  if (!t) return null

  // return apiGet<Cliente>('/auth/me')

  // ── Mock ──
  await delay(200)
  return {
    id: '1',
    nome: 'Cliente Mock',
    email: 'cliente@onhair.com.br',
    telefone: '(21) 99999-9999',
    criadoEm: new Date().toISOString(),
  }
  // ── Fim mock ──
}

export function logout(): void {
  setToken(null)
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}