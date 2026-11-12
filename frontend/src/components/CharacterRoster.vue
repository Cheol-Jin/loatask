<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { getCharacterRoster, getCharacterErrorMessage } from '@/api/lostarkApi'
import type { LostArkSibling } from '@/types/lostark'
import { rosterServers, sortedRoster } from '@/utils/roster'

const props = defineProps<{ characterName: string; serverName: string }>()
const roster = ref<LostArkSibling[]>([])
const loading = ref(false)
const errorMessage = ref('')
const selectedServer = ref(props.serverName)
const servers = computed(() => rosterServers(roster.value, props.serverName))
const visibleCharacters = computed(() => sortedRoster(roster.value, selectedServer.value))
let requestId = 0

async function loadRoster() {
  const current = ++requestId
  roster.value = []
  loading.value = true
  errorMessage.value = ''
  try {
    const result = await getCharacterRoster(props.characterName)
    if (current === requestId) roster.value = result
  } catch (error) {
    if (current === requestId) errorMessage.value = getCharacterErrorMessage(error)
  } finally {
    if (current === requestId) loading.value = false
  }
}

watch(
  () => [props.characterName, props.serverName],
  () => {
    selectedServer.value = props.serverName
    void loadRoster()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  requestId++
})
</script>

<template>
  <section id="roster" class="roster-section" aria-labelledby="roster-title">
    <header>
      <div>
        <h2 id="roster-title">원정대 캐릭터</h2>
        <p>같은 서버를 기본으로 표시합니다. 다른 서버의 보유 캐릭터도 선택해서 확인하세요.</p>
      </div>
      <span v-if="!loading && !errorMessage" class="roster-count"
        >{{ visibleCharacters.length }}명</span
      >
    </header>

    <p v-if="loading" class="roster-message" role="status">원정대 목록을 불러오는 중입니다.</p>
    <div v-else-if="errorMessage" class="roster-message" role="alert">
      <p>원정대 목록을 불러오지 못했습니다. {{ errorMessage }}</p>
      <button class="retry" type="button" @click="loadRoster">목록 다시 시도</button>
    </div>
    <template v-else>
      <div class="roster-toolbar">
        <label
          >서버
          <select v-model="selectedServer">
            <option value="">전체 서버</option>
            <option v-for="server in servers" :key="server" :value="server">{{ server }}</option>
          </select>
        </label>
        <span>아이템 레벨 높은 순 · 캐릭터를 누르면 상세정보로 이동합니다.</span>
      </div>
      <ul v-if="visibleCharacters.length" class="roster-grid">
        <li v-for="character in visibleCharacters" :key="character.characterName">
          <RouterLink
            :to="{ name: 'characterDetail', params: { name: character.characterName } }"
            :aria-current="character.characterName === characterName ? 'page' : undefined"
            :class="{ current: character.characterName === characterName }"
          >
            <div class="character-heading">
              <strong>{{ character.characterName }}</strong>
              <span v-if="character.characterName === characterName" class="current-badge"
                >현재 조회</span
              >
            </div>
            <p>
              {{ character.serverName }} · {{ character.characterClassName || '직업 정보 없음' }}
            </p>
            <div class="character-levels">
              <span>전투 Lv.{{ character.characterLevel ?? '—' }}</span>
              <span
                >아이템 <b>{{ character.itemAvgLevel || '—' }}</b></span
              >
            </div>
          </RouterLink>
        </li>
      </ul>
      <p v-else class="roster-message" role="status">선택한 서버의 캐릭터 정보가 없습니다.</p>
      <p class="roster-note">
        공식 API 기준 목록입니다. 변경 사항은 캐시 갱신 후 반영되며, 일시 오류 시 이전 목록이 표시될
        수 있습니다.
      </p>
    </template>
  </section>
</template>

<style scoped>
.roster-section {
  border: 1px solid var(--line);
  background: var(--surface);
  padding: 24px;
  margin-top: 24px;
  scroll-margin-top: 88px;
}
header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: baseline;
}
h2 {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.4px;
}
header p {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.8;
  margin-top: 8px;
}
.roster-count {
  color: var(--muted);
  font-size: 12px;
  white-space: nowrap;
}
.roster-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0 16px;
}
label {
  font-size: 12px;
  color: var(--muted);
}
select {
  margin-left: 10px;
  border: 1px solid var(--line);
  background: #1b1b1b;
  color: var(--text);
  padding: 8px 12px;
  min-width: 130px;
  appearance: auto;
  font: inherit;
}
.roster-toolbar > span {
  font-size: 11px;
  color: var(--muted);
}
.roster-grid {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.roster-grid a {
  display: block;
  height: 100%;
  border: 1px solid var(--line);
  padding: 16px;
  color: var(--text);
  background: #151515;
  text-decoration: none;
}
.roster-grid a:hover {
  background: #222;
  border-color: #6c6557;
}
.roster-grid a.current {
  border-color: #8b806b;
}
.character-heading {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: baseline;
}
.character-heading strong {
  font-weight: 500;
  font-size: 14px;
  overflow-wrap: anywhere;
}
.current-badge {
  color: #c2b497;
  font-size: 10px;
}
.roster-grid p {
  font-size: 12px;
  color: var(--muted);
  margin-top: 7px;
  overflow-wrap: anywhere;
}
.character-levels {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
  font-size: 11px;
  color: var(--muted);
}
.character-levels b {
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  margin-left: 4px;
}
.roster-message {
  margin-top: 20px;
  padding: 20px 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}
.retry {
  border: 1px solid var(--line);
  padding: 7px 12px;
  margin-top: 12px;
  color: var(--text);
  font-size: 12px;
  cursor: pointer;
}
select:focus-visible,
a:focus-visible,
.retry:focus-visible {
  outline: 2px solid #c2b497;
  outline-offset: 3px;
}
.roster-note {
  margin-top: 16px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
}
@media (max-width: 960px) {
  .roster-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .roster-grid {
    grid-template-columns: 1fr;
  }
  .roster-section {
    padding: 20px;
  }
}
</style>
