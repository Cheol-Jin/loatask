<script setup lang="ts">
withDefaults(defineProps<{ suit?: string; number?: string; back?: boolean }>(), {
  suit: 'major',
  number: '0',
  back: false,
})
const majorSymbols = [
  'M44 63L60 37l16 26z M60 37v-12 M51 72h18',
  'M42 43h36 M60 28v48 M48 29l24 44 M72 29L48 73',
  'M45 28v49 M75 28v49 M45 35q15-13 30 0 M53 54h14',
  'M39 48l8-16 13 9 13-9 8 16z M44 54h32 M49 66h22',
  'M42 35h36v33H42z M49 28v7 M71 28v7 M60 42v20',
  'M46 71V31h28v40 M53 43h14 M60 35v20 M51 63h18',
  'M60 72C21 49 48 25 60 43C72 25 99 49 60 72z',
  'M38 62l7-26h30l7 26z M45 62v9 M75 62v9 M60 27v27',
  'M38 52c0-23 22-23 22 0s22 23 22 0-22-23-22 0-22 23-22 0z',
  'M45 31h30v40H45z M53 31v-8h14v8 M60 43v16 M52 51h16',
  'M60 28v48 M36 52h48 M43 35l34 34 M77 35L43 69',
  'M60 26v49 M43 75h34 M41 39h38 M45 39L35 58h20z M75 39L65 58h20z',
  'M38 28h44 M60 28v32 M48 45l24 20 M60 60l-9 15 M60 60l9 15',
  'M43 74V30h34v44 M52 51h22 M63 40l11 11-11 11',
  'M40 34h18l-4 18H44z M64 54h18l-4 18H68z M54 52l14 2',
  'M46 71c-22-27 14-35 14-9s36 18 14-9 M46 42v-12 M74 42v-12',
  'M45 73V39h30v34 M48 39l12-14 12 14 M52 52l16 9 M52 61l16-9',
  'M60 24l8 20 21 2-17 13 5 21-17-12-17 12 5-21-17-13 21-2z',
  'M70 27c-37-5-46 47-9 50-14-13-13-34 9-50z',
  'M60 25v8 M60 71v8 M33 52h8 M79 52h8 M41 33l6 7 M73 65l6 7 M79 33l-6 7 M47 65l-6 7',
  'M41 70l19-36 19 36 M48 57h24 M53 29h14 M60 21v14',
  'M60 25c-32 0-32 54 0 54s32-54 0-54z M44 38l32 28 M76 38L44 66',
]
</script>
<template>
  <svg
    viewBox="0 0 120 156"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="5" y="5" width="110" height="146" stroke="currentColor" opacity=".6" />
    <path d="M12 30V12h18 M90 12h18v18 M12 126v18h18 M90 144h18v-18" stroke="currentColor" />
    <path d="M60 15v8 M56 19h8 M60 133v8 M56 137h8" stroke="currentColor" opacity=".65" />
    <g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <template v-if="back">
        <path d="M28 112V60c0-43 64-43 64 0v52z" opacity=".5" />
        <path d="M71 39c-29-4-36 33-7 37-12-11-10-24 7-37z" />
        <path d="M44 87h32l-5 18H49z M60 105v14 M49 119h22" />
        <path d="M34 68v8 M30 72h8 M87 83v8 M83 87h8" />
      </template>
      <template v-else>
        <circle cx="60" cy="65" r="36" opacity=".25" />
        <g transform="translate(0 13)">
          <path
            v-if="suit === 'cups'"
            d="M40 35h40l-5 26q-15 14-30 0z M60 68v14 M46 82h28 M80 39q21 0 7 19H77"
          />
          <path
            v-else-if="suit === 'swords'"
            d="M60 21l7 12-3 33h-8l-3-33z M44 67h32 M60 67v18 M54 85h12"
          />
          <path
            v-else-if="suit === 'wands'"
            d="M53 85l14-62 M64 39q-20-15-18 4 10 8 18-4 M58 62q25-14 24 1-14 10-24-1"
          />
          <g v-else-if="suit === 'pentacles'">
            <circle cx="60" cy="53" r="29" />
            <path d="M60 27l16 47-41-29h50L44 74z" />
          </g>
          <path v-else :d="majorSymbols[Number(number) % majorSymbols.length]" />
        </g>
        <path d="M32 119h56 M44 125h32" opacity=".5" />
      </template>
    </g>
  </svg>
</template>
