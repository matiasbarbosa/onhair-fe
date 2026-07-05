/**
 * Auth Store — Gerencia sessão JWT e perfil do usuário.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Cliente, Credenciais } from '@/types'
import { login as apiLogin, logout as apiLogout, obterSessao } from '@/services/auth.service'
import { getToken } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Cliente | null>(null)
  const tipo = ref<'cliente' | 'admin' | null>(null)
  const carregando = ref(false)
  const erro = ref<string | null>(null)

  const autenticado = computed(() => !!getToken() && !!usuario.value)
  const isAdmin = computed(() => tipo.value === 'admin')
  const isCliente = computed(() => tipo.value === 'cliente')

  async function login(credenciais: Credenciais) {
    carregando.value = true
    erro.value = null
    try {
      const sessao = await apiLogin(credenciais)
      usuario.value = sessao.cliente
      tipo.value = sessao.tipo
    } catch (e: unknown) {
      const err = e as { mensagem?: string }
      erro.value = err?.mensagem ?? 'Erro ao autenticar'
      throw e
    } finally {
      carregando.value = false
    }
  }

  async function verificarSessao() {
    if (!getToken()) return
    carregando.value = true
    try {
      const cliente = await obterSessao()
      usuario.value = cliente
      tipo.value = 'cliente'
    } catch {
      apiLogout()
    } finally {
      carregando.value = false
    }
  }

  function logout() {
    apiLogout()
    usuario.value = null
    tipo.value = null
    erro.value = null
  }

  return {
    usuario,
    tipo,
    carregando,
    erro,
    autenticado,
    isAdmin,
    isCliente,
    login,
    logout,
    verificarSessao,
  }
})