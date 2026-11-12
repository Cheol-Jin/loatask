<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { fortuneCards, fortuneTopics, shuffleFortuneCards, type FortuneTopic } from '@/data/fortune'
import { useFortuneStore } from '@/stores/fortuneStore'
import FortuneArtwork from '@/components/FortuneArtwork.vue'

const usage = useFortuneStore()
const topic = ref<FortuneTopic>('adventure')
const deck = ref(shuffleFortuneCards())
const choosingAgain = ref(false)
const drawing = ref(false)
const resultHeading = ref<HTMLElement | null>(null)
const firstCard = ref<HTMLButtonElement | null>(null)
const selectedCard = computed(() =>
  choosingAgain.value
    ? null
    : (fortuneCards.find((card) => card.id === usage.lastCardId(topic.value)) ?? null),
)
const currentTopic = computed(() => fortuneTopics.find((item) => item.id === topic.value)!)
const remaining = computed(() => usage.remaining(topic.value))
const blocked = computed(() => remaining.value === 0 || !!usage.storageMessage || drawing.value)

function resetForTopic() {
  choosingAgain.value = false
  const last = fortuneCards.find((card) => card.id === usage.lastCardId(topic.value))
  const shuffled = shuffleFortuneCards(Math.random, usage.history(topic.value))
  deck.value = last ? [last, ...shuffled] : shuffled
}
watch([topic, () => usage.record.day], resetForTopic)
resetForTopic()

function syncUsage() {
  const before = usage.lastCardId(topic.value)
  const day = usage.record.day
  usage.sync()
  if (day !== usage.record.day || before !== usage.lastCardId(topic.value)) resetForTopic()
}
function onStorage(event: StorageEvent) {
  if (event.key === null || event.key === 'loatask.fortune.v1') syncUsage()
}
function onVisibility() {
  if (document.visibilityState === 'visible') syncUsage()
}
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  syncUsage()
  timer = setInterval(syncUsage, 30_000)
  window.addEventListener('focus', syncUsage)
  window.addEventListener('storage', onStorage)
  document.addEventListener('visibilitychange', onVisibility)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  window.removeEventListener('focus', syncUsage)
  window.removeEventListener('storage', onStorage)
  document.removeEventListener('visibilitychange', onVisibility)
})

async function drawCard(index: number) {
  const card = deck.value[index]
  if (selectedCard.value || blocked.value || !card) return
  drawing.value = true
  try {
    if (!(await usage.consume(topic.value, card.id))) {
      resetForTopic()
      return
    }
    choosingAgain.value = false
    await nextTick()
    resultHeading.value?.focus({ preventScroll: true })
  } finally {
    drawing.value = false
  }
}

async function drawAgain() {
  syncUsage()
  if (blocked.value) return
  choosingAgain.value = true
  deck.value = shuffleFortuneCards(Math.random, usage.history(topic.value))
  await nextTick()
  firstCard.value?.focus({ preventScroll: true })
}
</script>

<template>
  <v-main>
    <v-container class="page-shell fortune-shell">
      <header class="fortune-heading">
        <p class="fortune-eyebrow">모험가를 위한 작은 쉼표</p>
        <h1>욤의 오늘의 운세</h1>
        <p>마음이 가는 카드 한 장. 오늘의 모험에 작은 힌트를 남겨 보세요.</p>
      </header>

      <fieldset class="topic-picker">
        <legend>어떤 이야기를 들어 볼까요?</legend>
        <label v-for="item in fortuneTopics" :key="item.id" :class="{ active: topic === item.id }">
          <input v-model="topic" type="radio" name="fortune-topic" :value="item.id" />
          {{ item.label }}
        </label>
      </fieldset>

      <p class="usage-note" role="status">
        {{ currentTopic.label }} · 오늘 {{ 2 - remaining }}/2회 사용 · 남은 기회 {{ remaining }}회
        <span>항목별 하루 2회 · 한국 시간 자정 초기화</span>
      </p>
      <v-alert v-if="usage.storageMessage" type="warning" variant="tonal" class="mb-6">
        {{ usage.storageMessage }}
        <v-btn variant="text" @click="syncUsage">기록 다시 확인</v-btn>
      </v-alert>

      <section class="draw-area" aria-label="운세 카드 뽑기">
        <p class="draw-instruction">
          {{ selectedCard ? '오늘 고른 카드를 다시 볼 수 있습니다.' : currentTopic.description }}
        </p>
        <div class="card-spread">
          <button
            v-for="(card, index) in deck.slice(0, 3)"
            :key="index"
            :ref="
              (el) => {
                if (index === 0) firstCard = el as HTMLButtonElement | null
              }
            "
            class="fortune-card"
            :class="{
              revealed: selectedCard?.id === card.id,
              unselected: selectedCard !== null && selectedCard.id !== card.id,
            }"
            :disabled="selectedCard !== null || blocked"
            :aria-label="
              selectedCard?.id === card.id
                ? `뽑은 카드: ${card.name}`
                : `${index + 1}번째 카드 뽑기`
            "
            @click="drawCard(index)"
          >
            <span v-if="selectedCard?.id !== card.id" class="card-face card-back">
              <span class="card-corner">YOM</span>
              <FortuneArtwork back class="card-artwork" />
              <span class="card-caption">오늘의 한 장</span>
              <span class="card-number">0{{ index + 1 }}</span>
            </span>
            <span v-else class="card-face card-front">
              <span class="card-corner">{{ card.keyword }}</span>
              <FortuneArtwork :card-id="card.id" class="card-artwork" />
              <span class="card-name">{{ card.name }}</span>
              <span class="card-caption">욤의 오늘의 운세</span>
            </span>
          </button>
        </div>
        <p class="draw-note">
          {{ fortuneCards.length }}장의 창작 카드 중 세 장에서 하나를 골라 주세요. 다시 뽑기에서는
          첫 카드를 제외합니다.
        </p>
      </section>

      <section v-if="selectedCard" class="reading" aria-label="카드 해석">
        <div class="reading-title">
          <p>{{ currentTopic.label }} · {{ selectedCard.keyword }}</p>
          <h2 ref="resultHeading" tabindex="-1">{{ selectedCard.name }}</h2>
        </div>
        <blockquote>{{ selectedCard.message }}</blockquote>
        <p class="reading-text">{{ selectedCard.readings[topic] }}</p>
        <v-btn
          v-if="remaining > 0"
          :disabled="drawing || !!usage.storageMessage"
          variant="outlined"
          color="primary"
          @click="drawAgain"
          >다시 뽑기 · 마지막 1회</v-btn
        >
        <p v-else class="limit-message" role="status">
          이 항목은 오늘 2회 모두 사용했습니다. 한국 시간 자정 이후 다시 뽑을 수 있습니다.
        </p>
      </section>

      <section class="concern-section" aria-labelledby="concern-title">
        <div class="section-heading">
          <h2 id="concern-title">고민을 들려주세요</h2>
          <span>AI 맞춤 해석 준비 중</span>
        </div>
        <p>앞으로 고민과 뽑은 카드를 함께 읽어 드릴 예정입니다.</p>
        <label for="fortune-concern" class="concern-label">나의 고민</label>
        <textarea
          id="fortune-concern"
          disabled
          rows="3"
          placeholder="예: 새로운 레이드에 도전하고 싶은데 실수할까 걱정돼요."
          aria-describedby="concern-status"
        ></textarea>
        <p id="concern-status" class="concern-status">
          지금은 주제별로 준비된 해석을 보여드립니다. 고민 입력과 AI 해석은 아직 사용할 수 없습니다.
        </p>
      </section>
      <p class="fortune-disclaimer">
        재미로 보는 창작 운세입니다. 실제 강화·드롭 확률이나 게임 결과를 예측하지 않습니다.<br />사용
        횟수와 마지막 결과는 이 브라우저에 저장됩니다. 항목마다 하루 2회까지 이용할 수 있습니다.<br />
        다른 기기·브라우저와 공유되지 않으며, 저장 데이터를 삭제하면 기록이 사라집니다. 그림은
        씨앗과 모험을 주제로 직접 그린 창작 일러스트입니다.
      </p>
    </v-container>
  </v-main>
</template>

<style scoped>
.fortune-shell {
  max-width: 960px;
}
.fortune-heading {
  text-align: center;
  padding: 12px 0 36px;
}
.fortune-eyebrow {
  color: var(--accent);
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 12px;
}
.fortune-heading h1 {
  font-size: clamp(28px, 5vw, 38px);
  letter-spacing: -1.5px;
  margin-bottom: 12px;
}
.fortune-heading > p:last-child {
  color: var(--muted);
  font-size: 14px;
}
.topic-picker {
  border: 0;
  padding: 0;
  text-align: center;
  margin-bottom: 32px;
}
.topic-picker legend {
  width: 100%;
  font-size: 13px;
  margin-bottom: 16px;
  color: var(--muted);
}
.topic-picker label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--line);
  margin: 4px;
  font-size: 13px;
  cursor: pointer;
}
.topic-picker label.active {
  border-color: var(--accent);
  color: var(--accent);
}
.topic-picker input {
  accent-color: var(--accent);
}
.usage-note {
  text-align: center;
  font-size: 13px;
  color: var(--accent);
  margin: -8px 0 24px;
}
.usage-note span {
  display: block;
  font-size: 11px;
  color: var(--muted);
  margin-top: 8px;
}
.limit-message {
  color: var(--accent);
  font-size: 13px;
  line-height: 1.8;
}
.draw-area {
  padding: 28px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  text-align: center;
}
.draw-instruction {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 24px;
}
.card-spread {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  max-width: 660px;
  margin: 0 auto;
}
.fortune-card {
  position: relative;
  aspect-ratio: 2 / 3;
  padding: 9px;
  border: 1px solid #78694c !important;
  background: #191814 !important;
  transition:
    transform 0.2s,
    opacity 0.2s;
}
.fortune-card:not(:disabled):hover {
  transform: translateY(-6px);
  border-color: var(--accent) !important;
}
.fortune-card:disabled {
  cursor: default;
}
.card-face {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #4a4132;
  color: var(--accent);
  padding: 12px;
}
.card-corner {
  font-size: 10px;
  letter-spacing: 2px;
}
.card-caption {
  font-size: 11px;
  letter-spacing: 1px;
}
.card-number {
  font-size: 10px;
  margin-top: 16px;
  color: #9f927a;
}
.card-artwork {
  display: block;
  width: 100%;
  max-width: 168px;
  margin: 12px 0;
  flex: 0 1 auto;
}
.card-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 12px;
}
.unselected {
  opacity: 0.3;
}
.revealed {
  border-color: var(--accent) !important;
}
.card-front {
  animation: reveal 0.45s ease-out;
}
@keyframes reveal {
  from {
    opacity: 0;
    transform: rotateY(80deg);
  }
  to {
    opacity: 1;
    transform: rotateY(0);
  }
}
.draw-note {
  margin-top: 24px;
  font-size: 12px;
  color: var(--muted);
}
.reading {
  padding: 32px 0;
}
.reading-title p {
  font-size: 12px;
  color: var(--accent);
  margin-bottom: 8px;
}
.reading-title h2 {
  font-size: 26px;
  letter-spacing: -0.6px;
}
.reading blockquote {
  margin: 20px 0 12px;
  font-size: 18px;
  font-weight: 500;
}
.reading-text {
  color: var(--muted);
  line-height: 1.9;
  margin-bottom: 24px;
}
.concern-section {
  margin-top: 36px;
}
.concern-section > p {
  color: var(--muted);
  font-size: 13px;
  margin: 16px 0;
}
.concern-label {
  display: block;
  font-size: 12px;
  margin-bottom: 8px;
  color: var(--muted);
}
.concern-section textarea {
  display: block;
  width: 100%;
  resize: none;
  border: 1px solid var(--line);
  background: var(--surface);
  padding: 14px;
  font: inherit;
  font-size: 13px;
}
.concern-section textarea::placeholder {
  color: var(--muted);
  opacity: 1;
}
.fortune-disclaimer {
  border-top: 1px solid var(--line);
  margin-top: 32px;
  padding-top: 20px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}
@media (max-width: 600px) {
  .card-spread {
    gap: 8px;
  }
  .fortune-card {
    padding: 4px;
  }
  .card-face {
    padding: 6px 2px;
  }
  .card-artwork {
    margin: 8px 0;
  }
  .card-corner {
    font-size: 9px;
    letter-spacing: 0;
  }
  .card-name {
    font-size: 13px;
    margin-bottom: 6px;
  }
  .card-caption {
    font-size: 9px;
    letter-spacing: 0;
  }
  .card-number {
    margin-top: 10px;
  }
  .topic-picker label {
    padding: 10px 8px;
    font-size: 12px;
    margin: 3px;
  }
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .fortune-card {
    transition: none;
  }
  .fortune-card:not(:disabled):hover {
    transform: none;
  }
  .card-front {
    animation: none;
  }
}
</style>
