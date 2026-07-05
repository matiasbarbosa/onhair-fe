<script setup lang="ts">
import GlassCard from './GlassCard.vue'

interface ContactInfo {
  cidade: string
  uf: string
  endereco: string
  local: string
  mapaUrl: string
  telefone: string
  telefoneFormatado: string
  email: string
  horarios: readonly string[]
}

interface Props {
  contato: ContactInfo
}

defineProps<Props>()
</script>

<template>
  <GlassCard class="contact-card">
    <div class="contact-photo">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
        stroke="var(--color-gold-500)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span>foto</span>
    </div>

    <div class="contact-info">
      <h3 class="contact-city">
        {{ contato.cidade }}<span class="contact-uf">/{{ contato.uf }}</span>
      </h3>

      <div class="contact-row">
        <span class="contact-label">Endereço</span>
        <a :href="contato.mapaUrl" target="_blank" class="contact-value contact-link">
          {{ contato.endereco }}
        </a>
        <span class="contact-value">{{ contato.local }}</span>
      </div>

      <div class="contact-row">
        <span class="contact-label">Ver no mapa</span>
        <a :href="contato.mapaUrl" target="_blank" class="contact-value contact-link map-link">
          Abrir no Google Maps ↗
        </a>
      </div>

      <div class="contact-row">
        <span class="contact-label">Telefone</span>
        <a :href="`tel:${contato.telefone}`" class="contact-value contact-link">
          {{ contato.telefoneFormatado }}
        </a>
      </div>

      <div class="contact-row">
        <span class="contact-label">E-mail</span>
        <a :href="`mailto:${contato.email}`" class="contact-value contact-link">
          {{ contato.email }}
        </a>
      </div>

      <div class="contact-row">
        <span class="contact-label">Funcionamento</span>
        <span v-for="horario in contato.horarios" :key="horario" class="contact-value">
          {{ horario }}
        </span>
      </div>
    </div>
  </GlassCard>
</template>

<style scoped>
.contact-card {
  padding: 0;
  overflow: hidden;
}

.contact-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  background: var(--color-gold-100);
  border-bottom: 1px solid var(--color-border-subtle);
  padding: var(--space-12) var(--space-8);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  min-height: 200px;
}

.contact-info {
  padding: var(--space-8) var(--space-10);
}

.contact-city {
  font-size: 1.4rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-subtle);
}

.contact-uf {
  color: var(--color-gold-500);
}

.contact-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: var(--space-5);
}

.contact-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-gold-500);
  font-weight: var(--font-weight-semibold);
}

.contact-value {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  text-decoration: none;
}

.contact-link {
  transition: color var(--transition-base);
}

.contact-link:hover {
  color: var(--color-text-primary);
}

.map-link {
  color: var(--color-gold-500);
}

.map-link:hover {
  color: var(--color-gold-300);
}
</style>