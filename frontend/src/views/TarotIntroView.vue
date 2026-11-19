<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import neriaPortrait from '@/assets/tarot/neria-card.jpg'
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
        <div class="neria-card">
          <img
            :src="neriaPortrait"
            alt="레온하트 네리아를 모티프로 그린 달과 별의 타로 일러스트"
            width="1024"
            height="1536"
            fetchpriority="high"
          />
        </div>
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
.neria-card {
  inline-size: 100%;
  max-inline-size: 340px;
  justify-self: end;
}
.neria-card img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  box-shadow: 0 20px 70px #03051066;
}
@media (max-width: 760px) {
  .intro-shell {
    padding-block: 40px;
  }
  .intro-heading {
    grid-template-columns: minmax(0, 1fr) 230px;
    gap: 24px;
  }
  h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
  }
}
@media (max-width: 560px) {
  .neria-card {
    inline-size: min(100%, 260px);
    justify-self: center;
  }
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
}
</style>
