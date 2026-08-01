<script setup lang="ts">
/**
 * RegistroView — Cadastro de novo cliente.
 */

import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { AsYouType } from 'libphonenumber-js'
import { useAuthStore } from '@/stores/auth.store'
import { registrar } from '@/services/auth.service'
import AppButton from '@/components/shared/AppButton.vue'
import logo from '@/assets/logo.png'

const router = useRouter()
const auth = useAuthStore()

const nome = ref('')
const email = ref('')
const telefone = ref('')
const senha = ref('')
const erro = ref<string | null>(null)
const carregando = ref(false)

const formatter = new AsYouType('BR')

function onTelefoneInput(e: Event) {
  formatter.reset()
  telefone.value = formatter.input((e.target as HTMLInputElement).value)
}

async function handleRegistro() {
  erro.value = null
  carregando.value = true
  try {
    await registrar({
      nome: nome.value,
      email: email.value,
      telefone: telefone.value,
      senha: senha.value,
    })
    await auth.login({ email: email.value, senha: senha.value })
    router.push('/cliente')
  } catch {
    erro.value = 'Erro ao criar conta. Tente novamente.'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <header class="header">
      <div class="header-container">
        <RouterLink to="/" class="brand-link" title="Ir para início">
          <img :src="logo" alt="OnHair Studio" class="brand-logo" />
        </RouterLink>
        <RouterLink to="/" class="nav-back">
          ← Voltar para o Início
        </RouterLink>
      </div>
    </header>

    <div class="hero-glow" />
    <main class="login-container">
      <div class="login-card">
        <h1>Crie sua Conta</h1>
        <p class="subtitle">Cadastre-se para agendar seus serviços de beleza online.</p>

        <form @submit.prevent="handleRegistro" class="login-form">
          <div class="field">
            <label>Nome Completo</label>
            <input v-model="nome" type="text" placeholder="Seu nome completo" required />
          </div>

          <div class="field">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="seu@email.com" autocomplete="email" required />
          </div>

          <div class="field">
            <label>Telefone / WhatsApp</label>
            <input
              :value="telefone"
              type="tel"
              inputmode="tel"
              placeholder="(21) 99999-9999"
              required
              @input="onTelefoneInput"
            />
          </div>

          <div class="field">
            <label>Senha</label>
            <input v-model="senha" type="password" placeholder="Mínimo 6 caracteres" autocomplete="new-password" required />
          </div>

          <p v-if="erro" class="error">{{ erro }}</p>

          <AppButton type="submit" :disabled="carregando" size="lg" style="width: 100%">
            {{ carregando ? 'Cadastrando...' : 'Criar Conta' }}
          </AppButton>
        </form>

        <div class="card-footer">
          <p class="footer-text">
            Já possui uma conta?
            <RouterLink to="/cliente/login">Acessar Conta</RouterLink>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at 50% 30%, rgba(201, 168, 76, 0.08) 0%, transparent 65%), var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-family);
  position: relative;
  overflow: hidden;
}

/* Header */
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-header);
  background: var(--color-bg-overlay);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border-subtle);
  padding: var(--space-4) 0;
}

.header-container {
  max-width: var(--max-width-container);
  margin: 0 auto;
  padding: 0 var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo {
  height: 38px;
  width: auto;
  display: block;
}

.nav-back {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-sm);
  letter-spacing: var(--letter-spacing-wide);
  transition: color var(--transition-base);
}

.nav-back:hover {
  color: var(--color-gold-500);
}

/* Hero pulse glow idêntico ao da HomeView */
.hero-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 168, 76, 0.09) 0%, transparent 70%);
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 6s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 1;
  }
}

/* Card centralizado */
.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--header-height) + var(--space-12)) var(--space-6) var(--space-12);
  position: relative;
  z-index: 1;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-md), var(--shadow-gold);
  position: relative;
  text-align: center;
}

/* Badge do salão */
.salon-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-gold-100);
  border: 1px solid var(--color-border-subtle);
  color: var(--color-gold-500);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--space-4);
}

h1 {
  font-size: 2.2rem;
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-2);
  background: linear-gradient(135deg, var(--color-text-secondary) 40%, var(--color-gold-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  margin-bottom: var(--space-8);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  text-align: left;
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
  font-weight: var(--font-weight-medium);
}

input {
  width: 100%;
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  outline: none;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

input:focus {
  border-color: var(--color-gold-500);
  box-shadow: 0 0 10px rgba(201, 168, 76, 0.15);
}

.error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  padding: var(--space-3);
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: var(--radius-md);
}

.card-footer {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border-subtle);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  text-align: center;
}

.footer-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.footer-text a {
  color: var(--color-gold-500);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  transition: color var(--transition-fast);
}

.footer-text a:hover {
  color: var(--color-gold-400);
  text-decoration: underline;
}

@media (max-width: 600px) {
  .header-container {
    padding: 0 var(--space-4);
  }

  .login-card {
    padding: var(--space-8) var(--space-5);
  }
}
</style>
