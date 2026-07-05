<script setup lang="ts">
import logo from '@/assets/logo.png'
import { RouterLink } from 'vue-router'
import AppButton from '@/components/shared/AppButton.vue'
import GlassCard from '@/components/shared/GlassCard.vue'
import SectionHeader from '@/components/shared/SectionHeader.vue'
import StatsDisplay from '@/components/shared/StatsDisplay.vue'
import ServiceCard from '@/components/shared/ServiceCard.vue'
import TestimonialCard from '@/components/shared/TestimonialCard.vue'
import BrazilMap from '@/components/shared/BrazilMap.vue'
import ContactCard from '@/components/shared/ContactCard.vue'
import SocialLinks from '@/components/shared/SocialLinks.vue'
import AppFooter from '@/components/shared/AppFooter.vue'

interface Servico { icone: string; titulo: string; descricao: string }
interface Depoimento { texto: string; autor: string }
interface LinkSocial { href: string; label: string; svgViewBox: string; svgPath: string }
interface LinkNav { href: string; label: string }

const SERVICOS: Servico[] = [
  { icone: '✂️', titulo: 'Corte & Estilo', descricao: 'Visagismo e cortes modernos adaptados ao seu formato de rosto e estilo de vida.' },
  { icone: '🎨', titulo: 'Coloração & Mechas', descricao: 'Técnicas avançadas de iluminação, balayage e colorimetria com produtos premium.' },
  { icone: '✨', titulo: 'Tratamentos', descricao: 'Cronograma capilar, reconstrução, hidratação profunda e terapias do couro cabeludo.' },
  { icone: '💅', titulo: 'Manicure & Pedicure', descricao: 'Cuidados completos para unhas, incluindo spa dos pés e mãos, e alongamentos.' },
]

const DEPOIMENTOS: Depoimento[] = [
  { texto: 'Experiência incrível! O atendimento é impecável e o resultado do meu cabelo superou todas as expectativas.', autor: 'Simone D.' },
  { texto: 'Profissionais extremamente capacitados. Fizeram exatamente a cor que eu queria, preservando a saúde dos fios.', autor: 'Bárbara L.' },
]

const CONTATO = {
  cidade: 'Rio de Janeiro', uf: 'RJ',
  endereco: 'Av. das Américas, 700 – Bloco 8 Loja 111o – Barra da Tijuca',
  local: 'Localizado em: Città Office Mall',
  mapaUrl: 'https://maps.app.goo.gl/UgUJL4DCF7ZjkXqv5',
  telefone: '+5521979695143', telefoneFormatado: '(21) 97969-5143',
  whatsapp: 'https://wa.me/5521979695143?text=Oi%20gostaria%20de%20marcar%20um%20horario',
  email: 'contato@onhair.com.br',
  horarios: ['Ter a Sex: 09h às 19h', 'Sábado: 08h às 18h'],
} as const

const LINKS_SOCIAIS: LinkSocial[] = [
  {
    href: 'https://www.instagram.com/studioonhair/?hl=pt-br', label: 'Instagram',
    svgViewBox: '0 0 448 512',
    svgPath: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z',
  },
  {
    href: CONTATO.whatsapp, label: 'WhatsApp',
    svgViewBox: '0 0 448 512',
    svgPath: 'M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z',
  },
]

const NAV_LINKS: LinkNav[] = [
  { href: '#home', label: 'Home' }, { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' }, { href: '#depoimentos', label: 'Feedbacks' },
  { href: '#locais', label: 'Local' },
]

const LINKS_MAPA_SITE: LinkNav[] = [
  { href: '#home', label: 'Home' }, { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' }, { href: '#locais', label: 'Locais' },
]

const LINKS_CONTATO: LinkNav[] = [
  { href: CONTATO.mapaUrl, label: 'Città Office Mall, Bloco 8 Loja 111o' },
  { href: `tel:${CONTATO.telefone}`, label: CONTATO.telefoneFormatado },
  { href: `mailto:${CONTATO.email}`, label: CONTATO.email },
]

const stats = [
  { value: '+10', label: 'Anos de Experiência' },
  { value: '+5k', label: 'Clientes Satisfeitos' },
]
</script>

<template>
  <div class="landing-page">

    <!-- ── Header ─────────────────────────────────────────────────────── -->
    <header class="header">
      <div class="container header-content">
        <nav class="nav-menu">
          <a v-for="link in NAV_LINKS" :key="link.href" :href="link.href">{{ link.label }}</a>
        </nav>
        <RouterLink to="/agendar" class="btn-primary btn-sm">Agendar</RouterLink>
      </div>
    </header>

    <!-- ── Hero ───────────────────────────────────────────────────────── -->
    <section id="home" class="hero">
      <div class="hero-glow" />
      <div class="hero-overlay" />
      <div class="container hero-content">
        <h1>onHair Studio</h1>
        <p class="hero-subtitle">Onde a beleza encontra técnica</p>
      </div>
    </section>

    <!-- ── Sobre ──────────────────────────────────────────────────────── -->
    <section id="sobre" class="section">
      <div class="container sobre-grid">
        <div class="sobre-text">
          <SectionHeader title="Nossa " highlight="História" />
          <p>No OnHair Studio, acreditamos que cada cliente é único. Com anos de experiência no mercado de beleza, nosso
            foco é proporcionar mais do que um serviço — uma verdadeira experiência de transformação.</p>
          <p>Nossa equipe está em constante atualização para oferecer as tendências mais recentes em cortes, colorações
            e tratamentos, sempre com produtos de altíssima qualidade.</p>
          <StatsDisplay :stats="stats" />
        </div>
        <GlassCard class="image-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-gold-500)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p>Foto da Equipe / Salão</p>
        </GlassCard>
      </div>
    </section>

    <!-- ── Serviços ───────────────────────────────────────────────────── -->
    <section id="servicos" class="section bg-secondary">
      <div class="container">
        <SectionHeader title="Nossos " highlight="Serviços"
          subtitle="Tratamentos exclusivos e personalizados para realçar a sua beleza natural." />
        <div class="services-grid">
          <ServiceCard v-for="servico in SERVICOS" :key="servico.titulo" v-bind="servico" />
        </div>
      </div>
    </section>

    <!-- ── Depoimentos ────────────────────────────────────────────────── -->
    <section id="depoimentos" class="section">
      <div class="container">
        <SectionHeader title="O que dizem " highlight="Nossos Clientes" />
        <div class="testimonials-grid">
          <TestimonialCard v-for="dep in DEPOIMENTOS" :key="dep.autor" v-bind="dep" />
        </div>
      </div>
    </section>

    <!-- ── Local e Contato ────────────────────────────────────────────── -->
    <section id="locais" class="section bg-secondary">
      <div class="container">
        <SectionHeader title="Local e " highlight="Contato" />
        <div class="locais-grid">
          <BrazilMap />
          <ContactCard :contato="CONTATO" />
        </div>
      </div>
    </section>

    <!-- ── CTA Final ──────────────────────────────────────────────────── -->
    <section id="agendar" class="section cta-section">
      <div class="container cta-content">
        <h2>Pronta para a sua transformação?</h2>
        <p>Agende agora e garanta um momento exclusivo de cuidado e beleza.</p>
        <a :href="CONTATO.whatsapp" target="_blank" class="btn-outline btn-lg">
          Falar no WhatsApp
        </a>
      </div>
    </section>

    <!-- ── Footer ─────────────────────────────────────────────────────── -->
    <AppFooter :logo="logo" :mapa-links="LINKS_MAPA_SITE" :contato-links="LINKS_CONTATO" :horarios="CONTATO.horarios">
      <template #social>
        <SocialLinks :socials="LINKS_SOCIAIS" />
      </template>
    </AppFooter>

  </div>
</template>

<style scoped>
.landing-page {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-family);
}

.container {
  max-width: var(--max-width-container);
  margin: 0 auto;
  padding: 0 var(--space-8);
}

/* ── Header ──────────────────────────────────────────────────────────── */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-header);
  background: var(--color-bg-overlay);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border-subtle);
  padding: var(--space-4) 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-menu {
  display: flex;
  gap: var(--space-10);
}

.nav-menu a {
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: var(--font-size-base);
  letter-spacing: var(--letter-spacing-wide);
  transition: color var(--transition-base);
}

.nav-menu a:hover {
  color: var(--color-gold-500);
}

/* ── Buttons ─────────────────────────────────────────────────────────── */
.btn-primary {
  background: linear-gradient(135deg, var(--color-gold-500), var(--color-gold-300));
  color: var(--color-bg-primary);
  border: none;
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  transition: opacity var(--transition-base), transform var(--transition-fast);
}

.btn-primary:hover {
  opacity: 0.85;
  transform: translateY(-2px);
}

.btn-lg {
  padding: var(--space-4) var(--space-10);
  font-size: var(--font-size-base);
}

.btn-outline {
  background: transparent;
  color: var(--color-gold-500);
  border: 1.5px solid var(--color-gold-500);
  padding: var(--space-4) var(--space-10);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  text-decoration: none;
  display: inline-block;
  transition: background var(--transition-base), color var(--transition-base);
}

.btn-outline:hover {
  background: var(--color-gold-500);
  color: var(--color-bg-primary);
}

/* ── Hero ────────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 40%, rgba(201, 168, 76, 0.1) 0%, transparent 65%), var(--color-bg-primary);
}

.hero-glow {
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 168, 76, 0.1) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 5s ease-in-out infinite;
  pointer-events: none;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 55%, var(--color-bg-primary));
  pointer-events: none;
}

@keyframes pulse {

  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }

  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding-top: var(--space-20);
}

.hero-content h1 {
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-6);
  background: linear-gradient(135deg, var(--color-text-secondary) 40%, var(--color-gold-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeUp 0.9s ease both;
}

.hero-subtitle {
  font-size: 2.1rem;
  color: var(--color-text-muted);
  max-width: 520px;
  margin: 0 auto var(--space-10);
  line-height: 1.8;
  animation: fadeUp 0.9s 0.2s ease both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Sections ────────────────────────────────────────────────────────── */
.section {
  padding: var(--space-24) 0;
}

.bg-secondary {
  background: var(--color-bg-secondary);
}

.sobre-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-20);
  align-items: center;
}

.sobre-text p {
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-5);
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-20) var(--space-8);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  min-height: 320px;
}

/* ── Services Grid ───────────────────────────────────────────────────── */
.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

/* ── Testimonials Grid ───────────────────────────────────────────────── */
.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
}

/* ── Locais Grid ─────────────────────────────────────────────────────── */
.locais-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

/* ── CTA ─────────────────────────────────────────────────────────────── */
.cta-section {
  background: linear-gradient(135deg, #130f00, var(--color-bg-primary));
  border-top: 1px solid var(--color-border-subtle);
  border-bottom: 1px solid var(--color-border-subtle);
}

.cta-content {
  text-align: center;
}

.cta-content h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-4);
}

.cta-content p {
  color: var(--color-text-muted);
  margin-bottom: var(--space-10);
  font-size: var(--font-size-base);
}

/* ── Responsive ──────────────────────────────────────────────────────── */
@media (max-width: 960px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .sobre-grid {
    grid-template-columns: 1fr;
    gap: var(--space-12);
  }

  .locais-grid {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }
}

@media (max-width: 600px) {
  .nav-menu {
    display: none;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 var(--space-4);
  }
}
</style>
