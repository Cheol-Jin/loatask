<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getHomeNotices, getHomeEvents } from '@/api/lostarkApi'
import {
  latestNotices,
  ongoingEvents,
  officialLink,
  officialThumbnail,
  newsDate,
  type HomeNotice,
  type HomeEvent,
} from '@/utils/homeNews'
const notices = ref<HomeNotice[]>([])
const events = ref<HomeEvent[]>([])
const noticesLoading = ref(true)
const eventsLoading = ref(true)
const noticesError = ref(false)
const eventsError = ref(false)
const now = ref(Date.now())
const visibleNotices = computed(() => latestNotices(notices.value))
const visibleEvents = computed(() => ongoingEvents(events.value, now.value))
let alive = true
let timer: ReturnType<typeof setInterval> | undefined
async function loadNotices() {
  noticesLoading.value = true
  noticesError.value = false
  try {
    const data = await getHomeNotices()
    if (alive) notices.value = data
  } catch {
    if (alive) noticesError.value = true
  } finally {
    if (alive) noticesLoading.value = false
  }
}
async function loadEvents() {
  eventsLoading.value = true
  eventsError.value = false
  try {
    const data = await getHomeEvents()
    if (alive) events.value = data
  } catch {
    if (alive) eventsError.value = true
  } finally {
    if (alive) eventsLoading.value = false
  }
}
onMounted(() => {
  void loadNotices()
  void loadEvents()
  timer = setInterval(() => {
    now.value = Date.now()
  }, 30_000)
})
onBeforeUnmount(() => {
  alive = false
  clearInterval(timer)
})
</script>

<template>
  <div class="home-news">
    <section aria-labelledby="notices-title">
      <header>
        <h2 id="notices-title">로스트아크 소식</h2>
        <a
          href="https://lostark.game.onstove.com/News/Notice/List"
          target="_blank"
          rel="noopener noreferrer"
          >전체 공지 ↗</a
        >
      </header>
      <p v-if="noticesLoading" class="status" role="status">공식 공지를 불러오는 중입니다.</p>
      <p v-else-if="noticesError" class="status" role="alert">
        공지를 불러오지 못했습니다. <button @click="loadNotices">다시 시도</button>
      </p>
      <ul v-else-if="visibleNotices.length" class="notices">
        <li v-for="notice in visibleNotices" :key="notice.link">
          <a :href="officialLink(notice.link)!" target="_blank" rel="noopener noreferrer">
            <span class="notice-type">{{ notice.type || '소식' }}</span
            ><span class="notice-title">{{ notice.title }}</span
            ><time :datetime="notice.date">{{ newsDate(notice.date) }}</time>
          </a>
        </li>
      </ul>
      <p v-else class="status">표시할 공지가 없습니다. 전체 공지에서 확인해 주세요.</p>
    </section>
    <section aria-labelledby="events-title">
      <header>
        <h2 id="events-title">진행 중인 이벤트</h2>
        <a
          href="https://lostark.game.onstove.com/News/Event/Now"
          target="_blank"
          rel="noopener noreferrer"
          >전체 이벤트 ↗</a
        >
      </header>
      <p v-if="eventsLoading" class="status" role="status">이벤트를 불러오는 중입니다.</p>
      <p v-else-if="eventsError" class="status" role="alert">
        이벤트를 불러오지 못했습니다. <button @click="loadEvents">다시 시도</button>
      </p>
      <ul v-else-if="visibleEvents.length" class="events">
        <li v-for="event in visibleEvents" :key="event.link">
          <a :href="officialLink(event.link)!" target="_blank" rel="noopener noreferrer">
            <img
              v-if="officialThumbnail(event.thumbnail)"
              :src="officialThumbnail(event.thumbnail)!"
              alt=""
              loading="lazy"
              @error="($event.target as HTMLImageElement).style.display = 'none'"
            />
            <div>
              <strong>{{ event.title }}</strong
              ><span
                >{{ newsDate(event.startDate) }} ~ {{ newsDate(event.endDate) }} · 한국 시간</span
              >
            </div>
          </a>
        </li>
      </ul>
      <p v-else class="status">표시할 진행 중인 이벤트가 없습니다.</p>
    </section>
  </div>
  <p class="news-note">
    공식 소식은 일정 시간 간격으로 갱신됩니다. 점검·이벤트 일정의 최종 내용은 공식 페이지에서 확인해
    주세요.
  </p>
</template>

<style scoped>
.home-news {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 32px;
}
section {
  min-width: 0;
  border-top: 1px solid var(--line);
  padding-top: 20px;
}
header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: baseline;
  margin-bottom: 18px;
}
h2 {
  font-size: 17px;
  font-weight: 600;
}
header a {
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
}
ul {
  list-style: none;
  padding: 0;
}
.notices a {
  display: flex;
  gap: 12px;
  align-items: baseline;
  padding: 13px 0;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
  color: var(--text);
  text-decoration: none;
}
.notice-type,
time {
  color: var(--muted);
  font-size: 11px;
  white-space: nowrap;
}
.notice-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.events {
  display: grid;
  gap: 14px;
}
.events a {
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--line);
  color: var(--text);
  text-decoration: none;
  min-height: 100px;
  padding: 12px;
}
.events img {
  width: 130px;
  height: 74px;
  object-fit: cover;
}
.events strong {
  display: block;
  font-size: 13px;
  font-weight: 500;
  overflow-wrap: anywhere;
}
.events span {
  display: block;
  font-size: 11px;
  color: var(--muted);
  margin-top: 10px;
}
.status {
  color: var(--muted);
  padding: 26px 0;
  font-size: 13px;
  line-height: 1.8;
  min-height: 100px;
}
button {
  text-decoration: underline;
  color: var(--text);
}
.news-note {
  color: var(--muted);
  font-size: 11px;
  margin: 16px 0 36px;
  line-height: 1.8;
}
a:hover {
  color: var(--accent);
}
@media (max-width: 760px) {
  .home-news {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .events img {
    width: 104px;
    height: 68px;
  }
}
</style>
