<script setup lang="ts">
/**
 * BrazilMap — Mapa SVG do Brasil com destaque em um estado e pin animado.
 * Carrega o SVG do asset e aplica estilos dinamicamente.
 */

import { computed } from 'vue'
import rawSvg from '@/assets/brazilLow.svg?raw'

interface Props {
  highlightState?: string
  highlightLabel?: string
  highlightX?: number
  highlightY?: number
  pinColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  highlightState: 'BR-RJ',
  highlightLabel: 'Rio de Janeiro',
  highlightX: 744,
  highlightY: 650,
  pinColor: '#c9a84c',
})

const styledSvg = computed(() => {
  let svg = rawSvg
    .replace(/fill="#dadada"/g, 'fill="rgba(201,168,76,0.06)"')
    .replace(/stroke="#fff"/g, 'stroke="rgba(201,168,76,0.3)"')
    .replace(/stroke-width="0\.5"/g, 'stroke-width="0.7"')

  svg = svg.replace(
    new RegExp(`id="${props.highlightState}"[^>]*fill="[^"]*"`, 'g'),
    (match) => match.replace(/fill="[^"]*"/, 'fill="rgba(201,168,76,0.4)"')
  )
  svg = svg.replace(
    new RegExp(`id="${props.highlightState}"[^>]*stroke="[^"]*"`, 'g'),
    (match) => match.replace(/stroke="[^"]*"/, 'stroke="rgba(201,168,76,0.9)"')
  )
  svg = svg.replace(
    new RegExp(`id="${props.highlightState}"[^>]*stroke-width="[^"]*"`, 'g'),
    (match) => match.replace(/stroke-width="[^"]*"/, 'stroke-width="1.5"')
  )

  const pinSvg = `
    <g class="map-pin" transform="translate(${props.highlightX}, ${props.highlightY})">
      <ellipse cx="0" cy="20" rx="8" ry="4" fill="rgba(201,168,76,0.25)" />
      <path d="M0,-22 C-11,-22 -18,-13 -18,-5 C-18,9 0,24 0,24 C0,24 18,9 18,-5 C18,-13 11,-22 0,-22 Z" fill="${props.pinColor}" />
      <circle cx="0" cy="-5" r="7" fill="#0d0d0d" />
      <circle cx="0" cy="-5" r="3" fill="${props.pinColor}" />
      <circle cx="0" cy="-5" r="22" fill="none" stroke="${props.pinColor}" stroke-width="1.5" opacity="0.35" class="pin-pulse" />
    </g>
    <text x="${props.highlightX + 24}" y="${props.highlightY - 5}" class="map-label">${props.highlightLabel}</text>
  `

  return svg.replace('</svg>', `${pinSvg}</svg>`)
})
</script>

<template>
  <div class="map-wrapper">
    <div class="brazil-map" v-html="styledSvg" />
  </div>
</template>

<style>
.map-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.brazil-map {
  width: 100%;
  max-width: 460px;
}

.brazil-map svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 30px rgba(201, 168, 76, 0.07));
}

.map-pin {
  filter: drop-shadow(0 4px 14px rgba(201, 168, 76, 0.55));
}

.pin-pulse {
  animation: pinPulse 2.4s ease-out infinite;
  transform-origin: 0px -5px;
}

@keyframes pinPulse {
  0%   { r: 16; opacity: 0.5; }
  100% { r: 42; opacity: 0;   }
}

.map-label {
  fill: var(--color-gold-500);
  font-size: 14px;
  font-family: var(--font-family);
  letter-spacing: 0.06em;
  font-weight: 600;
}
</style>