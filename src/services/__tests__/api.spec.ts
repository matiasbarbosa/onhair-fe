import { describe, it, expect } from 'vitest'
import { setToken, getToken } from '@/services/api'

describe('api service', () => {
  it('gerencia token JWT via localStorage', () => {
    setToken('test-token')
    expect(getToken()).toBe('test-token')

    setToken(null)
    expect(getToken()).toBeNull()
  })
})