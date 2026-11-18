<script setup lang="ts">
import { spreadLayouts, topicScenes } from '@/data/tarotChoiceArt'
defineProps<{ kind: 'topic' | 'spread'; choiceId: string }>()
</script>
<template>
  <svg
    viewBox="0 0 180 190"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="8" y="7" width="164" height="176" stroke="currentColor" opacity=".35" />
    <path
      d="M15 30V14h18 M147 14h18v16 M15 160v16h18 M147 176h18v-16"
      stroke="currentColor"
      opacity=".75"
    />
    <template v-if="kind === 'topic'">
      <path d="M27 151V78a63 63 0 0 1 126 0v73z" fill="currentColor" opacity=".055" />
      <path d="M27 151V78a63 63 0 0 1 126 0v73 M25 158h130" stroke="currentColor" opacity=".22" />
      <circle cx="115" cy="47" r="21" fill="currentColor" opacity=".07" />
      <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(path, index) in topicScenes[choiceId]" :key="index" :d="path" />
      </g>
      <path
        d="M40 36v7 M36.5 39.5h7 M146 123v7 M142.5 126.5h7 M83 170h14"
        stroke="currentColor"
        opacity=".6"
      />
    </template>
    <template v-else>
      <circle cx="90" cy="95" r="66" stroke="currentColor" opacity=".1" />
      <g v-for="(card, index) in spreadLayouts[choiceId]" :key="index">
        <rect
          :x="card.x - 12"
          :y="card.y - 18"
          width="24"
          height="36"
          fill="#221d22"
          stroke="currentColor"
          :transform="card.rotate ? `rotate(${card.rotate} ${card.x} ${card.y})` : undefined"
        />
        <text
          :x="card.x + (card.rotate ? 10 : 0)"
          :y="card.y + (choiceId === 'cross' && index === 0 ? -7 : 4)"
          fill="currentColor"
          text-anchor="middle"
          font-family="Georgia, serif"
          font-size="10"
        >
          {{ index + 1 }}
        </text>
      </g>
    </template>
  </svg>
</template>
