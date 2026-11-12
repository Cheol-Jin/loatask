<script setup lang="ts">
import { computed } from 'vue'
import { fortuneCards } from '@/data/fortune'
const props = defineProps<{ cardId?: string; back?: boolean }>()
const index = computed(() =>
  Math.max(
    0,
    fortuneCards.findIndex((card) => card.id === props.cardId),
  ),
)
const motif = computed(() => index.value % 9)
const leaf = computed(
  () => ['#8dba7e', '#a6b88a', '#76ada0', '#b8b579'][Math.floor(index.value / 9)],
)
</script>

<template>
  <svg
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M90 7 163 48V132L90 173 17 132V48Z" stroke="#766745" stroke-width="1" />
    <path d="M90 18 153 54V126L90 162 27 126V54Z" stroke="#4c4535" stroke-width=".7" />
    <path d="m39 42 4 7-4 7-4-7Zm102 0 4 7-4 7-4-7Z" fill="#a99563" />
    <path d="M43 139h94M57 146h66" stroke="#877653" stroke-linecap="round" />
    <g v-if="!back" stroke="#d5bf84" stroke-width="2" stroke-linejoin="round">
      <g v-if="motif === 0">
        <path d="m122 40 15-17 17 17-17 23Z" fill="#739f91" />
        <path d="m137 23-5 17 5 23 5-23ZM122 40h32" />
      </g>
      <g v-else-if="motif === 1">
        <path d="M119 66V35q0-17 17-17t17 17v31" />
        <path d="M124 65V36q0-12 12-12t12 12v29" stroke="#83aa9c" />
        <path d="M115 68h42" />
      </g>
      <g v-else-if="motif === 2">
        <path d="M114 53h44l-9 12h-25Z" fill="#6a6455" />
        <path d="M136 22v31m-2-29-17 23h17m6-20 14 20h-14" />
      </g>
      <g v-else-if="motif === 3">
        <path d="m126 20 21 24-12 13-21-24Z" fill="#a7aaa1" />
        <path d="m116 53 27-26m-23 34 21-21m-27 15 11 11" />
      </g>
      <g v-else-if="motif === 4">
        <path d="M110 27q15-8 26 1 11-9 26-1v33q-15-6-26 1-11-7-26-1Z" fill="#77785b" />
        <path d="M136 28v33m-19-25 11 1m-11 8 11 1m16-9 11-1m-11 10 11-1" />
      </g>
      <g v-else-if="motif === 5">
        <path d="M117 62q-2-39 36-44 10 25-22 35Z" fill="#c1c7a8" />
        <path d="m117 62 32-38m-23 18-1-10m13 0 11 1" />
      </g>
      <g v-else-if="motif === 6">
        <path d="M113 38q0-14 22-14t22 14v25h-44Z" fill="#81704e" />
        <path d="M113 40h44m-27-16v39m11-39v39" />
        <path d="M130 43h12v11h-12Z" fill="#c8b16b" />
      </g>
      <g v-else-if="motif === 7">
        <path d="M138 64V39m-7 25h14" />
        <path d="M138 20q-28 7-22 25 12 7 22-6 10 13 22 6 6-18-22-25Z" :fill="leaf" />
      </g>
      <g v-else>
        <path d="m118 62 38-6m-35-1 32 8" />
        <path d="M136 19q-4 16-13 24-5 16 13 16 22-2 13-19-4 7-7 8 3-12-6-29Z" fill="#bb8d60" />
      </g>
    </g>
    <!-- 공식 이미지를 복사하지 않은 창작 씨앗 캐릭터입니다. -->
    <g :transform="back ? 'translate(0,-10)' : 'translate(-13,10)'">
      <path
        d="M89 74Q65 37 45 52q2 25 43 27M89 74q-2-43 29-44 10 29-29 44Z"
        :fill="back ? '#829775' : leaf"
        stroke="#c3cd9b"
        stroke-width="2"
      />
      <path d="m87 75-27-17m29 13 20-28" stroke="#617953" stroke-width="2" />
      <path
        d="M91 70c-20 9-40 34-39 51 1 17 18 24 38 21 21 0 35-10 31-26-3-17-16-37-30-46Z"
        fill="#d1bc87"
        stroke="#ead8a8"
        stroke-width="2"
      />
      <path
        d="M68 100q-9 17-3 26M106 91q13 19 9 31"
        stroke="#b59864"
        stroke-width="3"
        stroke-linecap="round"
      />
      <ellipse cx="79" cy="112" rx="3" ry="4" fill="#3e4235" />
      <ellipse cx="100" cy="109" rx="3" ry="4" fill="#3e4235" />
      <path d="M86 122q6 4 10-2" stroke="#60573d" stroke-width="2" stroke-linecap="round" />
      <path d="m57 142-10 4m65-6 11 4" stroke="#a6b88a" stroke-width="3" stroke-linecap="round" />
    </g>
    <path d="m36 91 3 5-3 5-3-5Zm107 27 3 5-3 5-3-5Z" :fill="leaf" />
  </svg>
</template>
