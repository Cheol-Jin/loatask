<script setup lang="ts">
import neriaCard from '@/assets/tarot/neria-card.jpg'
</script>

<template>
  <article class="home-tarot" aria-labelledby="home-tarot-title">
    <div class="section-heading">
      <h2 id="home-tarot-title">네리아의 고민 상담실</h2>
      <span>마음을 들여다보는 시간</span>
    </div>
    <div class="tarot-preview">
      <img
        :src="neriaCard"
        alt="달과 별로 장식한 네리아 타로 카드"
        width="1024"
        height="1536"
        loading="lazy"
      />
      <p>마음에 닿는 카드를 골라<br />지금의 이야기를 함께 읽어 보세요.</p>
    </div>
    <p class="tarot-note">고민의 실마리와 오늘의 작은 행동을 찾아보세요.</p>
    <RouterLink class="tarot-link" to="/tarot">네리아 만나러 가기 →</RouterLink>
  </article>
</template>

<style scoped>
.home-tarot {
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  container-type: inline-size;
}
.tarot-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  min-block-size: 120px;
}
.tarot-preview img {
  display: block;
  inline-size: 80px;
  block-size: 120px;
  object-fit: contain;
  flex-shrink: 0;
}
p {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.8;
}
.tarot-note {
  font-size: 11px;
  margin-block: 16px;
}
.tarot-link {
  min-block-size: 48px;
  display: block;
  margin-block-start: auto;
  border: 1px solid var(--line);
  color: var(--text);
  padding: 12px 16px;
  font-size: 13px;
  text-align: center;
  text-decoration: none;
}
.tarot-link:hover {
  border-color: var(--accent);
}
@container (max-width: 330px) {
  .section-heading {
    align-items: start;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
