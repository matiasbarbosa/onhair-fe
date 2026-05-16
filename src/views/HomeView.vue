<script setup lang="ts">
import logo from '@/assets/logo.png'
</script>

<template>
  <div class="landing-page">

    <!-- Header -->
    <header class="header">
      <div class="container header-content">
        <img :src="logo" alt="OnHair Studio" class="brand-logo" />
        <nav class="nav-menu">
          <a href="#home">Home</a>
          <a href="#sobre">Sobre</a>
          <a href="#servicos">Serviços</a>
          <a href="#depoimentos">Depoimentos</a>
        </nav>
        <a href="#agendar" class="btn-primary btn-sm">Agendar</a>
      </div>
    </header>

    <!-- Hero -->
    <section id="home" class="hero">
      <div class="hero-glow"></div>
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <h1>Onde a beleza encontra a técnica.</h1>
        <p class="hero-subtitle">
          Transforme seu visual com os melhores profissionais e técnicas exclusivas no OnHair Studio.
        </p>
        <a href="#agendar" class="btn-primary btn-lg">
          Agende Seu Horário
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </section>

    <!-- Sobre -->
    <section id="sobre" class="section">
      <div class="container sobre-grid">
        <div class="sobre-text">
          <h2 class="section-title">Nossa <span class="text-gold">História</span></h2>
          <p>No OnHair Studio, acreditamos que cada cliente é único. Com anos de experiência no mercado de beleza,
            nosso foco é proporcionar mais do que um serviço — uma verdadeira experiência de transformação.</p>
          <p>Nossa equipe está em constante atualização para oferecer as tendências mais recentes em cortes,
            colorações e tratamentos, sempre com produtos de altíssima qualidade.</p>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-number">+10</span>
              <span class="stat-label">Anos de Experiência</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">+5k</span>
              <span class="stat-label">Clientes Satisfeitos</span>
            </div>
          </div>
        </div>
        <div class="image-placeholder glass-panel">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24"
            fill="none" stroke="#c9a84c" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <p>Foto da Equipe / Salão</p>
        </div>
      </div>
    </section>

    <!-- Serviços -->
    <section id="servicos" class="section bg-secondary">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Nossos <span class="text-gold">Serviços</span></h2>
          <p class="section-subtitle">Tratamentos exclusivos e personalizados para realçar a sua beleza natural.</p>
        </div>
        <div class="services-grid">
          <div class="service-card glass-panel">
            <div class="service-icon">✂️</div>
            <h3>Corte & Estilo</h3>
            <p>Visagismo e cortes modernos adaptados ao seu formato de rosto e estilo de vida.</p>
          </div>
          <div class="service-card glass-panel">
            <div class="service-icon">🎨</div>
            <h3>Coloração & Mechas</h3>
            <p>Técnicas avançadas de iluminação, balayage e colorimetria com produtos premium.</p>
          </div>
          <div class="service-card glass-panel">
            <div class="service-icon">✨</div>
            <h3>Tratamentos</h3>
            <p>Cronograma capilar, reconstrução, hidratação profunda e terapias do couro cabeludo.</p>
          </div>
          <div class="service-card glass-panel">
            <div class="service-icon">💅</div>
            <h3>Manicure & Pedicure</h3>
            <p>Cuidados completos para unhas, incluindo spa dos pés e mãos, e alongamentos.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Depoimentos -->
    <section id="depoimentos" class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">O que dizem <span class="text-gold">Nossos Clientes</span></h2>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card glass-panel">
            <div class="stars">★★★★★</div>
            <p>"Experiência incrível! O atendimento é impecável e o resultado do meu cabelo superou todas as expectativas."</p>
            <span class="author">— Simone D.</span>
          </div>
          <div class="testimonial-card glass-panel">
            <div class="stars">★★★★★</div>
            <p>"Profissionais extremamente capacitados. Fizeram exatamente a cor que eu queria, preservando a saúde dos fios."</p>
            <span class="author">— Bárbara L.</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section id="agendar" class="section cta-section">
      <div class="container cta-content">
        <h2>Pronta para a sua transformação?</h2>
        <p>Agende agora e garanta um momento exclusivo de cuidado e beleza.</p>
        <a href="https://wa.me/5511999999999" target="_blank" class="btn-outline btn-lg">
          💬 Falar no WhatsApp
        </a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <img :src="logo" alt="OnHair Studio" class="footer-logo" />
          <p>Onde a beleza encontra a técnica. Seu espaço de luxo e cuidado.</p>
        </div>
        <div class="footer-col">
          <h4>Links Rápidos</h4>
          <a href="#home">Home</a>
          <a href="#sobre">Sobre Nós</a>
          <a href="#servicos">Serviços</a>
        </div>
        <div class="footer-col">
          <h4>Contato</h4>
          <p>📍 R. Exemplo, 123 - Centro</p>
          <p>📱 (11) 99999-9999</p>
          <p>✉️ contato@onhair.com.br</p>
        </div>
        <div class="footer-col">
          <h4>Funcionamento</h4>
          <p>Ter a Sex: 09h às 19h</p>
          <p>Sábado: 08h às 18h</p>
          <p>Dom e Seg: Fechado</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 OnHair Studio. Todos os direitos reservados.</p>
      </div>
    </footer>

  </div>
</template>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.landing-page {
  background: #0d0d0d;
  color: #f5f0e8;
  font-family: 'Georgia', serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ── Header ── */
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: rgba(13,13,13,0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(201,168,76,0.15);
  padding: 1rem 0;
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand-logo { height: 46px; width: auto; }
.nav-menu { display: flex; gap: 2.5rem; }
.nav-menu a {
  color: #a89a80;
  text-decoration: none;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.3s;
}
.nav-menu a:hover { color: #c9a84c; }

/* ── Buttons ── */
.btn-primary {
  background: linear-gradient(135deg, #c9a84c, #e2c27d);
  color: #0d0d0d;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 2px;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.3s, transform 0.2s;
}
.btn-primary:hover { opacity: 0.85; transform: translateY(-2px); }
.btn-sm { padding: 0.5rem 1.25rem; font-size: 0.78rem; }
.btn-lg { padding: 1rem 2.5rem; font-size: 0.95rem; }

.btn-outline {
  background: transparent;
  color: #c9a84c;
  border: 1.5px solid #c9a84c;
  padding: 1rem 2.5rem;
  border-radius: 2px;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  display: inline-block;
  transition: background 0.3s, color 0.3s;
}
.btn-outline:hover { background: #c9a84c; color: #0d0d0d; }

/* ── Hero ── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.1) 0%, transparent 65%), #0d0d0d;
}
.hero-glow {
  position: absolute;
  width: 700px; height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 5s ease-in-out infinite;
  pointer-events: none;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 55%, #0d0d0d);
  pointer-events: none;
}
@keyframes pulse {
  0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%,-50%) scale(1.2); opacity: 1; }
}
.hero-content {
  position: relative; z-index: 2;
  text-align: center;
  padding-top: 5rem;
}
.hero-content h1 {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 400;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #f5f0e8 40%, #c9a84c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeUp 0.9s ease both;
}
.hero-subtitle {
  font-size: 1.1rem;
  color: #a89a80;
  max-width: 520px;
  margin: 0 auto 2.5rem;
  line-height: 1.8;
  animation: fadeUp 0.9s 0.2s ease both;
}
.hero-content .btn-primary { animation: fadeUp 0.9s 0.4s ease both; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Sections ── */
.section { padding: 6rem 0; }
.bg-secondary { background: #111; }

.section-title {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 400;
  margin-bottom: 0.75rem;
}
.text-gold { color: #c9a84c; }
.section-header { text-align: center; margin-bottom: 3.5rem; }
.section-subtitle { color: #a89a80; font-size: 1rem; max-width: 480px; margin: 0.5rem auto 0; line-height: 1.7; }

/* ── Glass ── */
.glass-panel {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(201,168,76,0.18);
  border-radius: 4px;
  transition: border-color 0.3s, transform 0.3s;
}
.glass-panel:hover { border-color: rgba(201,168,76,0.45); transform: translateY(-4px); }

/* ── Sobre ── */
.sobre-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
.sobre-text p { color: #a89a80; line-height: 1.85; margin-bottom: 1.1rem; }
.stats-row { display: flex; gap: 3rem; margin-top: 2.5rem; }
.stat-item { display: flex; flex-direction: column; gap: 0.2rem; }
.stat-number { font-size: 2.5rem; font-weight: 700; color: #c9a84c; line-height: 1; }
.stat-label { font-size: 0.8rem; color: #a89a80; text-transform: uppercase; letter-spacing: 0.06em; }
.image-placeholder {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 1rem;
  padding: 5rem 2rem;
  color: #a89a80; font-size: 0.9rem; min-height: 320px;
}

/* ── Services ── */
.services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.service-card { padding: 2.5rem 1.5rem; text-align: center; }
.service-icon { font-size: 2.25rem; margin-bottom: 1rem; }
.service-card h3 { font-size: 1.05rem; font-weight: 600; margin-bottom: 0.75rem; color: #f5f0e8; }
.service-card p { color: #a89a80; font-size: 0.88rem; line-height: 1.75; }

/* ── Testimonials ── */
.testimonials-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.testimonial-card { padding: 2.5rem; }
.stars { color: #c9a84c; font-size: 1.1rem; margin-bottom: 1rem; }
.testimonial-card p { color: #a89a80; line-height: 1.85; font-style: italic; margin-bottom: 1.25rem; }
.author { color: #c9a84c; font-size: 0.88rem; font-weight: 600; }

/* ── CTA ── */
.cta-section {
  background: linear-gradient(135deg, #130f00, #0d0d0d);
  border-top: 1px solid rgba(201,168,76,0.15);
  border-bottom: 1px solid rgba(201,168,76,0.15);
}
.cta-content { text-align: center; }
.cta-content h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 400; margin-bottom: 1rem; }
.cta-content p { color: #a89a80; margin-bottom: 2.5rem; font-size: 1rem; }

/* ── Footer ── */
.footer { background: #080808; padding: 4rem 0 0; border-top: 1px solid rgba(201,168,76,0.08); }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; padding-bottom: 3rem; }
.footer-logo { height: 52px; width: auto; margin-bottom: 1rem; display: block; }
.footer-brand p { color: #a89a80; font-size: 0.88rem; line-height: 1.75; }
.footer-col h4 { color: #c9a84c; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 1rem; }
.footer-col a { display: block; color: #a89a80; text-decoration: none; font-size: 0.88rem; margin-bottom: 0.5rem; transition: color 0.3s; }
.footer-col a:hover { color: #c9a84c; }
.footer-col p { color: #a89a80; font-size: 0.88rem; margin-bottom: 0.4rem; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding: 1.5rem 2rem; text-align: center; }
.footer-bottom p { color: #3a3a3a; font-size: 0.82rem; }

/* ── Responsivo ── */
@media (max-width: 960px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .sobre-grid { grid-template-columns: 1fr; gap: 3rem; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .nav-menu { display: none; }
  .services-grid { grid-template-columns: 1fr; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; }
  .stats-row { flex-direction: column; gap: 1.5rem; }
}
</style>
