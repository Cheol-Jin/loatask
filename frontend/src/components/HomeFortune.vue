<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import FortuneArtwork from '@/components/FortuneArtwork.vue'
import { fortuneTopics } from '@/data/fortune'
import { useFortuneStore } from '@/stores/fortuneStore'
const usage = useFortuneStore()
const remaining = computed(() =>
  fortuneTopics.reduce((sum, topic) => sum + usage.remaining(topic.id), 0),
)
const sync = () => {
  usage.sync()
}
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  sync()
  timer = setInterval(sync, 30_000)
  window.addEventListener('focus', sync)
  window.addEventListener('storage', sync)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  window.removeEventListener('focus', sync)
  window.removeEventListener('storage', sync)
})
</script>
<template>
  <section aria-labelledby="home-fortune-title">
    <div class="section-heading">
      <h2 id="home-fortune-title">욤의 오늘의 운세</h2>
      <span>잠깐 쉬어가기</span>
    </div>
    <div class="fortune-preview">
      <FortuneArtwork back />
      <p>오늘의 모험에<br />작은 힌트를 남겨 보세요.</p>
    </div>
    <p class="fortune-status">
      {{
        usage.storageMessage
          ? '운세 페이지에서 사용 기록을 확인해 주세요.'
          : `오늘 남은 기회 ${remaining}회 · 항목별 하루 2회`
      }}
    </p>
    <RouterLink class="fortune-link" to="/fortune">운세 보러 가기 →</RouterLink>
  </section>
</template>
<style scoped>
.fortune-preview {
  display: flex;
  gap: 12px;
  align-items: center;
}
svg {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}
p {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.8;
}
.fortune-status {
  font-size: 11px;
  margin: 16px 0;
}
.fortune-link {
  display: block;
  border: 1px solid var(--line);
  color: var(--text);
  padding: 12px 16px;
  font-size: 13px;
  text-align: center;
  text-decoration: none;
}
.fortune-link:hover {
  border-color: var(--accent);
}
</style>
