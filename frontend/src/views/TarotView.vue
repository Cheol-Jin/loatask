<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import TarotArtwork from '@/components/TarotArtwork.vue'
import TarotChoiceArtwork from '@/components/TarotChoiceArtwork.vue'
import {
  createTarotDeck,
  readTarotCard,
  tarotCards,
  tarotGroups,
  tarotSpreads,
  tarotTopics,
  type DrawnTarotCard,
  type TarotReading,
} from '@/data/tarot'
import { useTarotStore } from '@/stores/tarotStore'
const pageTitle = '네리아의 고민 상담실 | LoaTask'
onMounted(() => {
  document.title = pageTitle
})
onBeforeRouteLeave(() => {
  if (document.title === pageTitle) document.title = 'LoaTask'
})
const store = useTarotStore()
const uid = useId()
const topicId = ref(store.lastReading?.topicId ?? 'crush')
const spreadId = ref(store.lastReading?.spreadId ?? 'mind')
const topic = computed(() => tarotTopics.find((item) => item.id === topicId.value)!)
const spread = computed(() => tarotSpreads.find((item) => item.id === spreadId.value)!)
const stage = ref<'setup' | 'draw' | 'result'>('setup')
const pool = ref<DrawnTarotCard[]>([])
const picks = ref<DrawnTarotCard[]>([])
const activeTopic = ref(topicId.value)
const activeSpread = ref(spreadId.value)
const reading = ref<TarotReading | null>(null)
const picking = ref(false)
const resultHeading = ref<HTMLHeadingElement | null>(null)
const drawHeading = ref<HTMLHeadingElement | null>(null)
const setupHeading = ref<HTMLHeadingElement | null>(null)
const drawButtons = ref<(HTMLButtonElement | null)[]>([])
const status = ref('')
const error = ref('')
const activeLayout = computed(() => tarotSpreads.find((item) => item.id === activeSpread.value)!)
const readingTopic = computed(() => tarotTopics.find((item) => item.id === reading.value?.topicId))
const readingSpread = computed(() =>
  tarotSpreads.find((item) => item.id === reading.value?.spreadId),
)
const readings = computed(() =>
  reading.value ? reading.value.cards.map((_, index) => readTarotCard(reading.value!, index)) : [],
)
const isPicked = (cardId: string) => picks.value.some((item) => item.cardId === cardId)
const cardName = (cardId: string) => tarotCards.find((item) => item.id === cardId)?.name ?? ''

async function start() {
  error.value = ''
  try {
    pool.value = createTarotDeck().slice(0, 12)
    picks.value = []
    activeTopic.value = topicId.value
    activeSpread.value = spreadId.value
    stage.value = 'draw'
    status.value = ''
    await nextTick()
    drawHeading.value?.focus()
  } catch {
    error.value = '카드를 펼치지 못했습니다. 다시 시도해 주세요.'
  }
}
async function pick(card: DrawnTarotCard) {
  if (stage.value !== 'draw' || picking.value || isPicked(card.cardId)) return
  picking.value = true
  try {
    picks.value.push({ ...card })
    if (picks.value.length === activeLayout.value.positions.length) {
      const result: TarotReading = {
        version: 1,
        topicId: activeTopic.value,
        spreadId: activeSpread.value,
        createdAt: new Date().toISOString(),
        cards: picks.value.map((item) => ({ ...item })),
      }
      store.save(result)
      reading.value = result
      stage.value = 'result'
      status.value = ''
      await nextTick()
      resultHeading.value?.focus()
    } else {
      status.value = `${picks.value.length}장 선택했습니다. ${activeLayout.value.positions.length - picks.value.length}장 더 골라 주세요.`
    }
  } finally {
    picking.value = false
    await nextTick()
    if (stage.value === 'draw')
      drawButtons.value.find((button) => button && !button.disabled)?.focus({ preventScroll: true })
  }
}
async function autoPick() {
  // 이미 고른 카드는 유지하고, 섞어 둔 덱에서 나머지를 채웁니다.
  for (const card of pool.value.filter((item) => !isPicked(item.cardId))) {
    if (stage.value !== 'draw') break
    await pick(card)
  }
}
async function edit() {
  stage.value = 'setup'
  status.value = ''
  await nextTick()
  setupHeading.value?.focus()
}
async function restore() {
  if (!store.lastReading) return
  reading.value = store.lastReading
  stage.value = 'result'
  status.value = ''
  await nextTick()
  resultHeading.value?.focus()
}
</script>

<template>
  <v-main lang="ko">
    <v-container class="page-shell tarot-shell">
      <header class="salon-heading">
        <div>
          <p class="eyebrow">NERIA'S TAROT ROOM</p>
          <h1>네리아의<br />고민 상담실<span aria-hidden="true">.</span></h1>
          <p class="welcome">
            말로 다 꺼내지 않아도 괜찮아요.<br />카드에 비친 장면을 따라, 지금의 마음을 천천히
            정리해 보세요.
          </p>
        </div>
        <div class="salon-sign" aria-hidden="true">
          <TarotArtwork back /><span>마음이 쉬어 가는 한 자리</span>
        </div>
      </header>
      <div class="salon-note">
        <span>78장의 카드</span><span>24가지 이야기</span><span>6가지 읽는 방법</span
        ><RouterLink to="/fortune">욤의 운세도 만나기 ↗</RouterLink>
      </div>
      <p class="live-status" role="status">{{ status }}</p>
      <p v-if="store.storageMessage" :id="`${uid}-storage`" class="storage-note">
        {{ store.storageMessage }}
      </p>

      <section v-if="stage === 'setup'" class="consultation">
        <div class="section-intro">
          <span class="step-number">01</span>
          <div>
            <h2 ref="setupHeading" tabindex="-1">어떤 이야기를 나눠 볼까요?</h2>
            <p>
              상담 주제와 카드 배열을 골라 주세요. 입력한 고민을 분석하는 방식 대신, 준비된 해석을
              조합해 읽어 드립니다.
            </p>
          </div>
        </div>
        <form action="/tarot" method="get" @submit.prevent="start">
          <nav class="choice-jumps" aria-label="상담 선택 영역">
            <a :href="`#${uid}-topics`">01 상담 주제 24가지</a>
            <a :href="`#${uid}-spreads`">02 읽는 방법 6가지</a>
          </nav>
          <fieldset
            :id="`${uid}-topics`"
            class="choice-fieldset topic-picker"
            :aria-describedby="`${uid}-topic-help`"
          >
            <legend>상담 주제 · 마음에 닿는 카드 한 장</legend>
            <p :id="`${uid}-topic-help`" class="choice-help">
              24개의 이야기 중 하나를 골라 주세요. 카드를 눌러 선택하고, 다른 카드로 언제든 바꿀 수
              있습니다.
            </p>
            <div
              v-for="group in tarotGroups"
              :key="group.id"
              class="topic-group"
              :class="`group-${group.id}`"
            >
              <h3>{{ group.label }}</h3>
              <div class="topic-choice-grid">
                <label
                  v-for="item in tarotTopics.filter((candidate) => candidate.group === group.id)"
                  :key="item.id"
                  class="choice-card topic-choice"
                  :for="`${uid}-topic-${item.id}`"
                >
                  <input
                    :id="`${uid}-topic-${item.id}`"
                    v-model="topicId"
                    type="radio"
                    name="topic"
                    :value="item.id"
                    :aria-labelledby="`${uid}-topic-name-${item.id}`"
                    :aria-describedby="`${uid}-topic-note-${item.id}`"
                  />
                  <TarotChoiceArtwork kind="topic" :choice-id="item.id" />
                  <span :id="`${uid}-topic-name-${item.id}`" class="choice-name">{{
                    item.label
                  }}</span>
                  <span :id="`${uid}-topic-note-${item.id}`" class="choice-description">{{
                    item.angle
                  }}</span>
                </label>
              </div>
            </div>
          </fieldset>
          <fieldset
            :id="`${uid}-spreads`"
            class="choice-fieldset spread-picker"
            :aria-describedby="`${uid}-spread-help`"
          >
            <legend>카드를 읽는 방법 · 펼쳐진 모양을 골라 주세요</legend>
            <p :id="`${uid}-spread-help`" class="choice-help">
              숫자는 카드를 읽는 순서입니다. 짧은 한 장부터 열 장의 이야기까지, 오늘의 마음에 맞게
              선택해 주세요.
            </p>
            <div class="spread-choice-grid">
              <label
                v-for="item in tarotSpreads"
                :key="item.id"
                class="choice-card spread-choice"
                :for="`${uid}-spread-${item.id}`"
              >
                <input
                  :id="`${uid}-spread-${item.id}`"
                  v-model="spreadId"
                  type="radio"
                  name="spread"
                  :value="item.id"
                  :aria-labelledby="`${uid}-spread-name-${item.id}`"
                  :aria-describedby="`${uid}-spread-note-${item.id}`"
                />
                <TarotChoiceArtwork kind="spread" :choice-id="item.id" />
                <span :id="`${uid}-spread-name-${item.id}`" class="choice-name"
                  >{{ item.label }} · {{ item.positions.length }}장</span
                >
                <span :id="`${uid}-spread-note-${item.id}`" class="choice-description">{{
                  item.description
                }}</span>
              </label>
            </div>
          </fieldset>
          <div class="selected-consultation">
            <span>고른 이야기</span><strong>{{ topic.label }}</strong
            ><span aria-hidden="true">/</span
            ><strong>{{ spread.label }} · {{ spread.positions.length }}장</strong>
          </div>
          <ol class="position-preview">
            <li v-for="(position, index) in spread.positions" :key="position">
              <span>{{ String(index + 1).padStart(2, '0') }}</span
              >{{ position }}
            </li>
          </ol>
          <p v-if="error" role="alert" class="storage-note">{{ error }}</p>
          <div class="actions">
            <button type="submit" class="primary-action">
              카드 펼치기 <span aria-hidden="true">↗</span></button
            ><button v-if="store.lastReading" type="button" class="text-action" @click="restore">
              지난 상담 다시 보기
            </button>
          </div>
        </form>
      </section>

      <section v-else-if="stage === 'draw'" class="draw-section">
        <div class="section-intro">
          <span class="step-number">02</span>
          <div>
            <h2 ref="drawHeading" tabindex="-1">
              마음이 가는 {{ activeLayout.positions.length }}장을 골라 주세요
            </h2>
            <p>
              {{ tarotTopics.find((item) => item.id === activeTopic)?.label }} ·
              {{ activeLayout.label }} · {{ picks.length }}/{{ activeLayout.positions.length }}장
              선택
            </p>
          </div>
        </div>
        <div class="draw-grid">
          <button
            v-for="(card, index) in pool"
            :key="card.cardId"
            :ref="
              (el) => {
                drawButtons[index] = el as HTMLButtonElement | null
              }
            "
            type="button"
            class="draw-card"
            :class="{ picked: isPicked(card.cardId) }"
            :disabled="isPicked(card.cardId) || picking"
            :aria-label="
              isPicked(card.cardId)
                ? `${index + 1}번 카드: ${cardName(card.cardId)}`
                : `${index + 1}번 카드 고르기`
            "
            @click="pick(card)"
          >
            <span class="draw-number">{{ String(index + 1).padStart(2, '0') }}</span
            ><TarotArtwork
              :back="!isPicked(card.cardId)"
              :suit="tarotCards.find((item) => item.id === card.cardId)?.suit"
              :number="tarotCards.find((item) => item.id === card.cardId)?.number"
            /><span class="draw-caption">{{
              isPicked(card.cardId) ? cardName(card.cardId) : 'NERIA'
            }}</span>
          </button>
        </div>
        <div class="actions">
          <button type="button" class="primary-action" :disabled="picking" @click="autoPick">
            남은 카드 한 번에 고르기</button
          ><button type="button" class="text-action" @click="edit">주제와 배열 바꾸기</button>
        </div>
      </section>

      <section v-else-if="reading && readingTopic && readingSpread" class="reading-section">
        <div class="reading-heading">
          <p class="eyebrow">{{ readingTopic.label }} · {{ readingSpread.label }}</p>
          <h2
            ref="resultHeading"
            tabindex="-1"
            :aria-describedby="store.storageMessage ? `${uid}-storage` : undefined"
          >
            지금의 나에게 남기는 이야기
          </h2>
          <p>{{ readingTopic.reflection }}</p>
        </div>
        <ol class="reading-grid" role="list">
          <li v-for="(item, index) in readings" :key="item.card.id">
            <article class="reading-card">
              <TarotArtwork
                :suit="item.card.suit"
                :number="item.card.number"
                :class="{ reversed: item.reversed }"
              />
              <header>
                <p class="position-label">
                  {{ String(index + 1).padStart(2, '0') }} · {{ item.position }}
                </p>
                <h3>{{ item.card.name }}</h3>
                <p class="card-subtitle">
                  {{ item.card.subtitle }} <span>{{ item.reversed ? '역방향' : '정방향' }}</span>
                </p>
              </header>
              <div class="card-reading">
                <p>{{ item.message }}</p>
                <p class="reflection">{{ item.reflection }}</p>
              </div>
              <footer>
                <span>작게 해 볼 일</span>
                <p>{{ item.action }}</p>
              </footer>
            </article>
          </li>
        </ol>
        <aside class="closing-note">
          <p class="eyebrow">네리아가 건네는 마지막 질문</p>
          <h3>이 중에서, 오늘 해 볼 수 있는 것은 무엇인가요?</h3>
          <p>{{ readingTopic.action }}</p>
        </aside>
        <div class="actions">
          <button type="button" class="primary-action" @click="edit">새로운 상담 시작하기</button
          ><RouterLink class="text-action" to="/fortune">욤의 운세 보러 가기</RouterLink>
        </div>
      </section>
      <footer class="tarot-footer">
        <p>
          전통 타로의 78장 구성을 참고한 창작 해석입니다. 카드·방향·상담 주제·배열의 위치를 함께
          살펴보는 마음 정리의 시간으로 즐겨 주세요.
        </p>
        <p>
          최근 상담 한 건은 이 브라우저에 저장됩니다. 다른 기기와 공유되지 않으며, 저장소를 지우면
          사라집니다. 타로는 횟수 제한 없이 이용할 수 있고 욤의 운세 사용 횟수와는 별개입니다.
        </p>
      </footer>
    </v-container>
  </v-main>
</template>

<style scoped>
.tarot-shell {
  --salon-accent: #d9c398;
  --salon-wine: #291b22;
  max-width: 1120px;
}
.salon-heading {
  display: grid;
  grid-template-columns: 1fr 220px;
  align-items: center;
  gap: 48px;
  padding-block: 12px 36px;
}
.eyebrow {
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  color: var(--salon-accent);
  margin-block-end: 18px;
}
h1 {
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 1.17;
}
h1 span {
  color: #ba8699;
}
.welcome {
  color: var(--muted);
  margin-block-start: 24px;
  line-height: 1.9;
  font-size: 0.9375rem;
}
.salon-sign {
  padding: 20px 36px;
  border: 1px solid #65515b;
  background: var(--salon-wine);
  color: var(--salon-accent);
}
.salon-sign svg {
  display: block;
  width: 100%;
}
.salon-sign > span {
  display: block;
  text-align: center;
  font-size: 0.625rem;
  margin-block-start: 16px;
  white-space: nowrap;
}
.salon-note {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
  border-block: 1px solid var(--line);
  padding-block: 17px;
  color: var(--muted);
  font-size: 0.75rem;
}
.salon-note a {
  display: inline-flex;
  align-items: center;
  min-block-size: 24px;
  margin-inline-start: auto;
  color: var(--salon-accent);
}
.live-status {
  min-height: 1.75rem;
  padding-block-start: 8px;
  font-size: 0.8125rem;
  color: var(--salon-accent);
}
.storage-note {
  font-size: 0.8125rem;
  line-height: 1.8;
  color: var(--salon-accent);
  margin-block: 12px;
}
.section-intro {
  display: flex;
  gap: 20px;
  margin-block: 24px 28px;
}
.step-number {
  color: var(--salon-accent);
  font-family: Georgia, serif;
  font-size: 1.75rem;
  line-height: 1.3;
}
h2 {
  font-size: clamp(1.25rem, 3vw, 1.625rem);
  font-weight: 500;
  letter-spacing: -0.035em;
}
.section-intro p {
  color: var(--muted);
  font-size: 0.8125rem;
  margin-block-start: 8px;
  line-height: 1.8;
}
.position-preview {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  gap: 8px 20px;
  padding: 18px 0;
  border-block: 1px solid var(--line);
  margin-block: 18px 26px;
}
.position-preview li {
  font-size: 0.75rem;
  color: var(--muted);
}
.position-preview span {
  color: var(--salon-accent);
  margin-inline-end: 8px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 28px;
  margin-block: 28px;
}
.primary-action {
  min-block-size: 48px;
  padding: 12px 26px;
  border: 1px solid var(--salon-accent) !important;
  background: var(--salon-accent) !important;
  color: #201a16 !important;
  font-size: 0.875rem;
}
.primary-action span {
  margin-inline-start: 24px;
}
.text-action {
  display: inline-flex;
  align-items: center;
  min-block-size: 48px;
  font-size: 0.8125rem;
  color: var(--muted);
  text-decoration: underline;
  text-underline-offset: 5px;
}
.draw-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
}
.draw-card {
  position: relative;
  border: 1px solid #806b77 !important;
  padding: 12px 10px;
  background: #21191e !important;
  color: var(--salon-accent) !important;
  min-inline-size: 0;
}
.draw-card:hover:not(:disabled) {
  border-color: var(--salon-accent) !important;
}
.draw-number {
  display: block;
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-align: start;
}
.draw-card svg {
  display: block;
  width: 100%;
}
.draw-caption {
  display: block;
  font-size: 0.6875rem;
  min-block-size: 2.5em;
  overflow-wrap: anywhere;
}
.draw-card.picked {
  background: #39312b !important;
  border-color: var(--salon-accent) !important;
}
.reading-heading {
  padding-block: 30px 32px;
}
.reading-heading .eyebrow {
  margin-block-end: 10px;
}
.reading-heading > p:last-child {
  margin-block-start: 14px;
  color: var(--muted);
  font-size: 0.875rem;
  line-height: 1.9;
  max-inline-size: 52rem;
}
.reading-grid {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.reading-grid > li {
  min-inline-size: 0;
}
.reading-card {
  height: 100%;
  container-type: inline-size;
  padding: 24px;
  background: #191619;
  border-block-start: 1px solid #806b77;
}
.reading-card > svg {
  display: block;
  width: 88px;
  height: 114px;
  color: var(--salon-accent);
  margin-block-end: 20px;
}
.reading-card > svg.reversed {
  transform: rotate(180deg);
}
.position-label {
  color: #d6b5c3;
  font-size: 0.75rem;
  margin-block-end: 8px;
}
.reading-card h3 {
  font-size: 1.5rem;
  letter-spacing: -0.04em;
  font-weight: 500;
}
.card-subtitle {
  font-size: 0.75rem;
  color: var(--muted);
  margin-block-start: 7px;
  line-height: 1.8;
}
.card-subtitle span {
  display: inline-block;
  border: 1px solid #796a73;
  padding-inline: 7px;
  margin-inline-start: 8px;
  font-size: 0.625rem;
}
.card-reading {
  padding-block: 22px;
  font-size: 0.875rem;
  line-height: 1.9;
}
.card-reading .reflection {
  color: var(--muted);
  margin-block-start: 12px;
}
.reading-card footer {
  border-block-start: 1px solid #453a42;
  padding-block-start: 16px;
}
.reading-card footer span {
  font-size: 0.6875rem;
  color: #d6b5c3;
}
.reading-card footer p {
  font-size: 0.8125rem;
  line-height: 1.8;
  margin-block-start: 8px;
}
@container (min-width: 28rem) {
  .reading-card > svg {
    width: 112px;
    height: 146px;
  }
  .card-reading {
    font-size: 0.9375rem;
  }
}
.closing-note {
  border-inline-start: 2px solid #b58b9c;
  padding: 10px 0 10px 24px;
  margin-block: 36px;
}
.closing-note .eyebrow {
  margin-block-end: 10px;
}
.closing-note h3 {
  font-size: 1.125rem;
  font-weight: 500;
}
.closing-note > p:last-child {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.9;
  margin-block-start: 12px;
}
.tarot-footer {
  border-block-start: 1px solid var(--line);
  margin-block-start: 40px;
  padding-block-start: 22px;
}
.tarot-footer p {
  color: var(--muted);
  font-size: 0.75rem;
  line-height: 1.9;
  margin-block-end: 8px;
}
:where(button, select, summary, a):focus-visible {
  outline: 2px solid var(--salon-accent);
  outline-offset: 4px;
}
button:disabled {
  cursor: default;
}
h2[tabindex] {
  scroll-margin-block-start: 90px;
}
@media (pointer: coarse) {
  .salon-note a {
    min-block-size: 48px;
  }
}
@media (max-width: 700px) {
  .salon-heading {
    grid-template-columns: 1fr 120px;
    gap: 16px;
  }
  .salon-sign {
    padding: 12px;
  }
  .salon-sign > span {
    white-space: normal;
    font-size: 0.5625rem;
  }
  .reading-grid {
    grid-template-columns: 1fr;
  }
  .draw-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .salon-note {
    gap: 10px 16px;
  }
  .salon-note a {
    display: inline-flex;
    align-items: center;
    min-block-size: 24px;
    margin-inline-start: 0;
  }
}
@media (max-width: 380px) {
  .salon-heading {
    grid-template-columns: 1fr;
  }
  .salon-sign {
    display: none;
  }
}
@media (prefers-reduced-motion: no-preference) {
  .draw-card {
    transition:
      transform 0.18s ease-out,
      border-color 0.18s;
  }
  .draw-card:hover:not(:disabled) {
    transform: translateY(-4px);
  }
  .reading-card {
    animation: settle-in 0.24s ease-out;
  }
  @keyframes settle-in {
    from {
      opacity: 0.25;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
}

.choice-jumps {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
  border-block-end: 1px solid var(--line);
  margin-block-end: 28px;
}
.choice-jumps a {
  display: inline-flex;
  align-items: center;
  min-block-size: 48px;
  font-size: 0.8125rem;
  color: var(--salon-accent);
}
.choice-fieldset {
  border: 0;
  padding: 0;
  margin: 0;
  min-inline-size: 0;
  scroll-margin-block-start: 90px;
}
.choice-fieldset legend {
  padding: 0;
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: -0.025em;
}
.choice-help {
  color: var(--muted);
  font-size: 0.8125rem;
  line-height: 1.8;
  margin-block: 10px 24px;
}
.topic-group {
  --scene-color: #c7baa0;
  margin-block-end: 28px;
}
.group-love {
  --scene-color: #d4a7b9;
}
.group-people {
  --scene-color: #d0b699;
}
.group-work {
  --scene-color: #b7bfd8;
}
.group-change {
  --scene-color: #b7c6b0;
}
.group-self {
  --scene-color: #c1b1cf;
}
.group-game {
  --scene-color: #a7c6c3;
}
.topic-group h3 {
  color: var(--scene-color);
  font-size: 0.8125rem;
  font-weight: 500;
  margin-block-end: 12px;
}
.topic-choice-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.choice-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-inline-size: 0;
  padding: 14px 14px 18px;
  border: 1px solid #675862;
  background: #1c171c;
  cursor: pointer;
  container-type: inline-size;
}
.choice-card > input {
  position: absolute;
  inset-block-start: 12px;
  inset-inline-end: 12px;
  inline-size: 18px;
  block-size: 18px;
  margin: 0;
  accent-color: var(--salon-accent);
}
.choice-card > svg {
  inline-size: 100%;
  block-size: 160px;
  color: var(--scene-color, var(--salon-accent));
  margin-block: 4px 12px;
}
.choice-name {
  display: block;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text);
}
.choice-description {
  display: block;
  font-size: 0.75rem;
  line-height: 1.8;
  color: var(--muted);
  margin-block-start: 6px;
}
.choice-card:has(> input:checked) {
  border-color: var(--salon-accent);
  background: #2a2225;
  box-shadow: inset 0 0 0 1px var(--salon-accent);
}
.choice-card:has(> input:focus-visible) {
  outline: 2px solid var(--salon-accent);
  outline-offset: 4px;
}
.choice-card:hover {
  border-color: var(--salon-accent);
}
.spread-picker {
  border-block-start: 1px solid var(--line);
  padding-block-start: 24px;
  margin-block: 36px 28px;
}
.spread-choice-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.spread-choice > svg {
  block-size: 180px;
}
.selected-consultation {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  align-items: baseline;
  padding-block: 16px 0;
  font-size: 0.8125rem;
}
.selected-consultation > span {
  color: var(--muted);
}
.selected-consultation strong {
  font-weight: 500;
  color: var(--salon-accent);
}
@container (min-width: 15rem) {
  .choice-name {
    font-size: 1rem;
  }
}
@media (max-width: 700px) {
  .topic-choice-grid,
  .spread-choice-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .choice-card {
    padding: 12px 12px 16px;
  }
  .choice-card > svg {
    block-size: 140px;
  }
  .choice-fieldset legend {
    font-size: 1rem;
  }
  .choice-name {
    font-size: 0.875rem;
  }
  .choice-description {
    font-size: 0.75rem;
  }
}
@media (max-width: 360px) {
  .spread-choice-grid {
    grid-template-columns: 1fr;
  }
}
</style>
