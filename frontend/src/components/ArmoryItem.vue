<script setup lang="ts">
import { computed } from 'vue'
import type { ArmoryItem } from '@/types/lostark'
import { equipmentQuality, gradeClass, plainText, tooltipLines } from '@/utils/armory'
const props = defineProps<{ item: ArmoryItem; label?: string }>()
const lines = computed(() => tooltipLines(props.item.tooltip))
const quality = computed(() => equipmentQuality(props.item.tooltip))
</script>

<template>
  <details class="armory-item">
    <summary>
      <img v-if="item.icon" :src="item.icon" alt="" loading="lazy" width="48" height="48" />
      <span class="item-copy">
        <span class="item-label">{{ label || item.grade || '장착 아이템' }}</span>
        <strong :class="gradeClass(item.grade)">{{ plainText(item.name) }}</strong>
        <span v-if="quality !== null" class="quality"
          >품질 {{ quality
          }}<meter :value="quality" min="0" max="100" :aria-label="`품질 ${quality}`"
        /></span>
      </span>
      <span class="expand" aria-hidden="true">＋</span>
    </summary>
    <div class="item-description">
      <p v-for="(line, index) in lines" :key="index">{{ line }}</p>
      <p v-if="!lines.length">상세 설명이 제공되지 않았습니다.</p>
      <slot />
    </div>
  </details>
</template>

<style scoped>
.armory-item {
  border-top: 1px solid var(--line);
  min-width: 0;
}
summary {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0;
  cursor: pointer;
  list-style: none;
}
summary::-webkit-details-marker {
  display: none;
}
summary:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
img {
  background: #202020;
  border: 1px solid var(--line);
  flex-shrink: 0;
  object-fit: contain;
}
.item-copy {
  min-width: 0;
  flex: 1;
}
.item-label {
  display: block;
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 4px;
}
strong {
  font-size: 13px;
  font-weight: 500;
  overflow-wrap: anywhere;
}
.expand {
  color: var(--muted);
  font-size: 16px;
}
[open] .expand {
  transform: rotate(45deg);
}
.quality {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: var(--muted);
  margin-top: 5px;
}
meter {
  width: 70px;
  height: 6px;
  accent-color: #b0b69c;
}
.item-description {
  border-left: 2px solid var(--line);
  margin: 0 0 18px 62px;
  padding-left: 14px;
  font-size: 12px;
  line-height: 1.8;
  color: var(--muted);
  overflow-wrap: anywhere;
}
.ancient {
  color: #d9cba6;
}
.relic {
  color: #d6a278;
}
.legendary {
  color: #cfb273;
}
.epic {
  color: #b49ac6;
}
.rare {
  color: #93b3cf;
}
</style>
