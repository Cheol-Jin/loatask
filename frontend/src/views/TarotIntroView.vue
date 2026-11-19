<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import neriaPortrait from '@/assets/tarot/neria.webp'
import '@/assets/tarot/night.css'
const heading = ref<HTMLHeadingElement | null>(null)
const pageTitle = '네리아의 고민 상담실 | LoaTask'
onMounted(async () => {
  document.title = pageTitle
  await nextTick()
  heading.value?.focus()
})
onBeforeRouteLeave(() => {
  if (document.title === pageTitle) document.title = 'LoaTask'
})
</script>

<template>
  <v-main lang="ko" class="tarot-night">
    <v-container class="intro-shell">
      <header class="intro-heading">
        <div class="intro-copy">
          <p class="eyebrow">NERIA'S TAROT ROOM</p>
          <h1 ref="heading" tabindex="-1">
            네리아의<br />고민 상담실<span aria-hidden="true">.</span>
          </h1>
          <p class="welcome">
            말로 다 꺼내지 않아도 괜찮아요.<br />카드에 비친 장면을 따라, 지금의 마음을 천천히
            정리해 보세요.
          </p>
          <RouterLink to="/tarot/reading" class="enter-room"
            >상담 시작하기 <span aria-hidden="true">↗</span></RouterLink
          >
        </div>
        <figure class="neria-portrait">
          <span class="portrait-star" aria-hidden="true">✦</span>
          <img
            :src="neriaPortrait"
            alt="부채를 든 로스트아크 네리아"
            width="142"
            height="142"
            fetchpriority="high"
          />
          <figcaption>
            <span>마음이 쉬어 가는 한 자리</span><small>네리아 · © Smilegate</small>
          </figcaption>
        </figure>
      </header>
    </v-container>
  </v-main>
</template>

<style scoped>
.intro-shell {
  max-inline-size: 1180px;
  display: grid;
  align-items: center;
  min-block-size: calc(100svh - 64px);
  padding-block: 64px;
}
.intro-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: center;
  gap: 64px;
}
.eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--salon-accent);
  margin-block-end: 24px;
}
h1 {
  font-size: clamp(2.8rem, 7vw, 5.25rem);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -0.055em;
  scroll-margin-block-start: 90px;
}
h1 span {
  color: #b69aae;
}
h1:focus {
  outline: none;
}
.welcome {
  margin-block-start: 32px;
  color: var(--muted);
  font-size: 0.9375rem;
  line-height: 2;
}
.enter-room {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 64px;
  min-block-size: 52px;
  margin-block-start: 36px;
  padding: 14px 24px;
  background: var(--salon-accent);
  color: #161523;
  font-size: 0.875rem;
}
.enter-room:hover {
  background: #e5d2ac;
}
.neria-portrait {
  position: relative;
  margin: 0;
  min-block-size: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #72647c;
  background: #17172cbb;
  padding: 32px 24px;
  box-shadow: 0 18px 80px #05081955;
}
.neria-portrait::before {
  content: '';
  position: absolute;
  inset: 12px;
  border: 1px solid #ad9c764d;
  pointer-events: none;
}
.portrait-star {
  color: var(--salon-accent);
  margin-block-end: 20px;
}
.neria-portrait img {
  display: block;
  inline-size: 200px;
  block-size: 200px;
  object-fit: contain;
}
figcaption {
  text-align: center;
  margin-block-start: 24px;
  color: var(--salon-accent);
  font-size: 0.8125rem;
}
figcaption small {
  display: block;
  font-size: 0.625rem;
  color: var(--muted);
  margin-block-start: 12px;
}
@media (max-width: 760px) {
  .intro-shell {
    padding-block: 40px;
  }
  .intro-heading {
    grid-template-columns: minmax(0, 1fr) 230px;
    gap: 24px;
  }
  .neria-portrait {
    min-block-size: 330px;
    padding-inline: 16px;
  }
  .neria-portrait img {
    inline-size: 170px;
    block-size: 170px;
  }
  h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
  }
}
@media (max-width: 560px) {
  .intro-heading {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .intro-copy {
    text-align: center;
  }
  .eyebrow {
    font-size: 0.625rem;
  }
  .welcome {
    font-size: 0.8125rem;
    margin-block-start: 24px;
  }
  .enter-room {
    margin-block-start: 28px;
  }
  .neria-portrait {
    inline-size: min(100%, 290px);
    min-block-size: 300px;
    justify-self: center;
  }
  .neria-portrait img {
    inline-size: 160px;
    block-size: 160px;
  }
}
</style>
