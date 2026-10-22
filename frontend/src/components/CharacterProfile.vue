<script setup lang="ts">
import type { LostArkProfile } from '@/types/lostark'
defineProps<{ profile: LostArkProfile; detail?: boolean }>()
</script>

<template>
  <article class="character-profile">
    <header class="profile-header">
      <p>{{ profile.serverName }} <span>/</span> {{ profile.characterClassName }}</p>
      <component :is="detail ? 'h1' : 'h2'">{{ profile.characterName }}</component>
    </header>
    <div class="profile-body">
      <div class="portrait">
        <v-img
          v-if="profile.characterImage"
          :src="profile.characterImage"
          :alt="`${profile.characterName} 캐릭터`"
          height="380"
          contain
        />
        <p v-else class="portrait-placeholder">캐릭터 이미지가 없습니다.</p>
      </div>
      <div class="profile-info">
        <div class="item-level">
          <span>아이템 레벨</span><strong>{{ profile.itemAvgLevel || '—' }}</strong>
        </div>
        <dl class="stats">
          <div>
            <dt>최대 아이템 레벨</dt>
            <dd>{{ profile.itemMaxLevel || '—' }}</dd>
          </div>
          <div>
            <dt>캐릭터 레벨</dt>
            <dd>{{ profile.characterLevel ?? '—' }}</dd>
          </div>
          <div>
            <dt>원정대 레벨</dt>
            <dd>{{ profile.expeditionLevel ?? '—' }}</dd>
          </div>
          <div>
            <dt>길드</dt>
            <dd>{{ profile.guildName || '—' }}</dd>
          </div>
          <div>
            <dt>영지</dt>
            <dd>{{ profile.townName || '—' }}</dd>
          </div>
        </dl>
        <div class="profile-actions"><slot /></div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.character-profile {
  border: 1px solid var(--line);
  background: var(--surface);
}
.profile-header {
  padding: 24px 28px;
  border-bottom: 1px solid var(--line);
}
.profile-header p {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 6px;
}
.profile-header p span {
  margin: 0 10px;
  color: #666;
}
.profile-header h1,
.profile-header h2 {
  font-size: 28px;
  letter-spacing: -0.8px;
  overflow-wrap: anywhere;
}
.profile-body {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
}
.portrait {
  background: #121212;
  display: grid;
  align-content: center;
  border-right: 1px solid var(--line);
  min-height: 380px;
}
.portrait-placeholder {
  text-align: center;
  color: var(--muted);
  font-size: 12px;
  padding: 24px;
}
.profile-info {
  padding: 24px;
  min-width: 0;
}
.item-level span {
  color: var(--muted);
  font-size: 12px;
}
.item-level strong {
  display: block;
  font-size: 36px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.3;
  margin: 6px 0 24px;
}
.stats > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--line);
  padding: 10px 0;
  font-size: 13px;
}
.stats dt {
  color: var(--muted);
  flex-shrink: 0;
}
.stats dd {
  text-align: right;
  overflow-wrap: anywhere;
}
@media (max-width: 600px) {
  .profile-body {
    grid-template-columns: 1fr;
  }
  .profile-header {
    padding: 20px;
  }
  .profile-header h1,
  .profile-header h2 {
    font-size: 24px;
  }
  .portrait {
    border-right: 0;
    border-bottom: 1px solid var(--line);
    min-height: 260px;
  }
  .portrait :deep(.v-img) {
    height: 280px !important;
  }
  .profile-info {
    padding: 20px;
  }
}
</style>
