/**
 * Camada de serviço HTTP.
 *
 * Gerencia token JWT, refresh automático e tratamento de erros.
 * Todas as chamadas ao backend Go passam por aqui.
 */

import type { ApiError, ApiResponse } from '@/types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

let _token: string | null = null

function initToken(): string | null {
  if (_token !== undefined && _token !== null) return _token
  try { _token = localStorage.getItem('token') } catch { _token = null }
  return _token
}

export function setToken(t: string | null) {
  _token = t
  try { if (t) localStorage.setItem('token', t); else localStorage.removeItem('token') } catch { /* ssr/env */ }
}

export function getToken(): string | null {
  return _token ?? initToken()
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body: ApiError = await res.json().catch(() => ({
      codigo: 'ERRO_DESCONHECIDO',
      mensagem: res.statusText,
    }))
    throw body
  }
  return res.json()
}

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
  })
  return handleResponse<T>(res)
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}

export async function apiDelete<T = void>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
  })
  return handleResponse<T>(res)
}