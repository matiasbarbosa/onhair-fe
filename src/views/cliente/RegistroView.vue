<script setup lang="ts">
/**
 * RegistroView — Cadastro de novo cliente.
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { registrar } from '@/services/auth.service'
import AppButton from '@/components/shared/AppButton.vue'

const router = useRouter()
const auth = useAuthStore()

const nome = ref('')
const email = ref('')
const telefone = ref('')
const senha = ref('')
const erro = ref<string | null>(null)
const sucesso = ref(false)

async function handleRegistro() {
  erro.value = null
  try {
    await registrar({
      nome: nome.value,
      email: email.value,
      telefone: telefone.value,
      senha: senha.value,
    })
    sucesso.value = true
    await auth.login({ email: email.value, senha: senha.value })
    router.push('/cliente')
  } catch {
    erro.value = 'Erro ao criar conta'
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Criar Conta</h1>
      <p class="subtitle">Cadastre-se para agendar online</p>

      <form @submit.prevent="handleRegistro" class="login-form">
        <div class="field">
          <label>Nome</label>
          <input v-model="nome" type="text" placeholder="Seu nome completo" required />
        </div>

        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="seu@email.com" autocomplete="email" required />
        </div>

        <div class="field">
          <label>Telefone</label>
          <input v-model="telefone" type="tel" placeholder="(21) 9XXXX-XXXX" required />
        </div>

        <div class="field">
          <label>Senha</label>
          <input v-model="senha" type="password" placeholder="Mínimo 6 caracteres" autocomplete="new-password" required />
        </div>

        <p v-if="erro" class="error">{{ erro }}</p>

        <AppButton type="submit" size="lg" style="width: 100%">
          Criar conta
        </AppButton>
      </form>

      <p class="footer-text">
        Já tem conta?
        <RouterLink to="/cliente/login">Entrar</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-primary);
  padding: var(--space-8);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-12);
}

h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-2);
}

.subtitle {
  color: var(--color-text-muted);
  margin-bottom: var(--space-8);
  font-size: var(--font-size-base);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

label {
  color: var(--color-gold-500);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

input {
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  outline: none;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  transition: border-color var(--transition-fast);
}

input:focus { border-color: var(--color-gold-500); }

.error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  padding: var(--space-3);
  background: rgba(248, 113, 113, 0.1);
  border-radius: var(--radius-md);
}

.footer-text {
  text-align: center;
  margin-top: var(--space-6);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.footer-text a {
  color: var(--color-gold-500);
  text-decoration: none;
}

.footer-text a:hover { text-decoration: underline; }
</style>