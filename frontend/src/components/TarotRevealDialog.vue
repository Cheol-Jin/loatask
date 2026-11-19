<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId } from 'vue'
import TarotArtwork from '@/components/TarotArtwork.vue'
import type { readTarotCard } from '@/data/tarot'
import { animateTarotReveal, type CardOrigin, type RevealMotion } from '@/utils/tarotReveal'
const uid = useId()
const dialog = ref<HTMLDialogElement | null>(null)
const flight = ref<HTMLElement | null>(null)
const flip = ref<HTMLElement | null>(null)
const item = ref<ReturnType<typeof readTarotCard> | null>(null)
const ready = ref(false)
const last = ref(false)
let motion: RevealMotion | null = null
let resolveClose: (() => void) | null = null
let generation = 0

async function show(
  value: ReturnType<typeof readTarotCard>,
  origin: CardOrigin | undefined,
  isLast: boolean,
  reduceMotion: boolean,
) {
  item.value = value
  ready.value = false
  last.value = isLast
  const current = ++generation
  await nextTick()
  if (!dialog.value || !flight.value || !flip.value) return
  const closed = new Promise<void>((resolve) => {
    resolveClose = resolve
  })
  dialog.value.showModal()
  const reduced =
    reduceMotion || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  motion = animateTarotReveal(flight.value, flip.value, origin, reduced)
  void motion.finished.then(() => {
    if (generation === current && dialog.value?.open) ready.value = true
  })
  await closed
}
function skipMotion(event: MouseEvent) {
  if (!ready.value) {
    // 같은 클릭에서 type이 submit으로 바뀌어도 결과 창은 닫지 않습니다.
    event.preventDefault()
    motion?.finish()
    ready.value = true
  }
}
function closed() {
  generation++
  motion?.cancel()
  motion = null
  if (dialog.value) dialog.value.returnValue = ''
  resolveClose?.()
  resolveClose = null
}
onBeforeUnmount(closed)
defineExpose({ show })
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="tarot-reveal" :aria-labelledby="`${uid}-title`" @close="closed">
      <div v-if="item" class="tarot-reveal-panel">
        <form method="dialog" class="tarot-reveal-close">
          <button type="submit" aria-label="카드 해석 닫기">×</button>
        </form>
        <h2 :id="`${uid}-title`">카드가 전하는 이야기</h2>
        <div ref="flight" class="tarot-reveal-flight" aria-hidden="true">
          <div ref="flip" class="tarot-reveal-flip">
            <div class="tarot-reveal-face tarot-reveal-back"><TarotArtwork back /></div>
            <div class="tarot-reveal-face tarot-reveal-front">
              <TarotArtwork
                :suit="item.card.suit"
                :number="item.card.number"
                :class="{ reversed: item.reversed }"
              />
            </div>
          </div>
        </div>
        <div class="tarot-reveal-copy" :class="{ 'is-ready': ready }">
          <p class="tarot-reveal-position">
            {{ item.position }} · {{ item.reversed ? '역방향' : '정방향' }}
          </p>
          <h3>{{ item.card.name }}</h3>
          <p>{{ item.message }}</p>
          <p class="tarot-reveal-reflection">{{ item.reflection }}</p>
          <p class="tarot-reveal-action"><span>작게 해 볼 일</span>{{ item.action }}</p>
        </div>
        <p class="tarot-reveal-status" role="status">
          {{
            ready
              ? `${item.card.name}, ${item.reversed ? '역방향' : '정방향'}. 해석이 공개됐습니다.`
              : '카드를 펼치고 있습니다.'
          }}
        </p>
        <form method="dialog" class="tarot-reveal-actions">
          <button :type="ready ? 'submit' : 'button'" autofocus @click="skipMotion">
            {{ ready ? (last ? '종합 결론 보기' : '다음 카드 고르기') : '연출 건너뛰기' }}
          </button>
        </form>
      </div>
    </dialog>
  </Teleport>
</template>

<style>
.tarot-reveal {
  --salon-accent: #d9c398;
  inline-size: 100%;
  block-size: 100dvh;
  max-inline-size: none;
  max-block-size: none;
  inset: 0;
  margin: 0;
  padding: 24px 16px;
  border: 0;
  background: transparent;
  color: #f0edf2;
  overflow: auto;
  font: inherit;
}
.tarot-reveal[open] {
  display: grid;
  place-items: center;
}
.tarot-reveal:modal {
  overscroll-behavior: contain;
}
.tarot-reveal::backdrop {
  background: #050817d9;
  overflow: hidden;
  overscroll-behavior: contain;
}
.tarot-reveal-panel {
  position: relative;
  inline-size: min(100%, 640px);
  padding: 28px;
  border: 1px solid #82718a;
  background: #121627;
  box-shadow: 0 24px 90px #0008;
  text-align: center;
}
.tarot-reveal h2 {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--salon-accent);
  letter-spacing: 0.08em;
  margin-block-end: 20px;
}
.tarot-reveal-flight {
  inline-size: clamp(148px, 26vh, 210px);
  aspect-ratio: 120 / 156;
  margin-inline: auto;
  perspective: 1000px;
}
.tarot-reveal-flip {
  position: relative;
  inline-size: 100%;
  block-size: 100%;
  transform-style: preserve-3d;
  transform: rotateY(180deg);
}
.tarot-reveal-face {
  position: absolute;
  inset: 0;
  background: #271b25;
  border: 1px solid #b7a078;
  backface-visibility: hidden;
}
.tarot-reveal-face svg {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  color: var(--salon-accent);
}
.tarot-reveal-front {
  transform: rotateY(180deg);
}
.tarot-reveal-front .reversed {
  transform: rotate(180deg);
}
.tarot-reveal-copy {
  visibility: hidden;
  opacity: 0;
  margin-block-start: 22px;
  text-align: start;
  font-size: 0.875rem;
  line-height: 1.8;
}
.tarot-reveal-copy.is-ready {
  visibility: visible;
  opacity: 1;
}
.tarot-reveal-position {
  color: #d9c398;
  font-size: 0.75rem;
}
.tarot-reveal h3 {
  margin-block: 4px 12px;
  font-weight: 500;
  font-size: 1.375rem;
}
.tarot-reveal-reflection {
  color: #b9b8c8;
  margin-block-start: 10px;
}
.tarot-reveal-action {
  margin-block-start: 14px;
  border-block-start: 1px solid #46465d;
  padding-block-start: 12px;
}
.tarot-reveal-action span {
  display: block;
  font-size: 0.6875rem;
  color: #d9c398;
}
.tarot-reveal-actions {
  margin-block-start: 22px;
}
.tarot-reveal-actions button {
  min-block-size: 48px;
  padding: 12px 28px;
  background: #d9c398 !important;
  color: #161523 !important;
  font-size: 0.8125rem;
}
.tarot-reveal-close {
  position: absolute;
  inset-block-start: 4px;
  inset-inline-end: 4px;
}
.tarot-reveal-close button {
  inline-size: 48px;
  block-size: 48px;
  color: #d9c398 !important;
  font-size: 1.5rem;
}
.tarot-reveal button:focus-visible {
  outline: 2px solid #d9c398;
  outline-offset: 4px;
}
.tarot-reveal-status {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
@media (prefers-reduced-motion: no-preference) {
  .tarot-reveal-copy {
    transition: opacity 0.3s ease-out;
  }
}
@media (max-width: 600px) {
  .tarot-reveal {
    padding: 12px;
  }
  .tarot-reveal-panel {
    padding: 22px 18px;
  }
  .tarot-reveal-copy {
    font-size: 0.8125rem;
  }
}
</style>
