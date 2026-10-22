<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <v-app>
    <v-app-bar flat height="64" class="app-bar">
      <v-container class="header-inner">
        <RouterLink to="/" class="logo" aria-label="LoaTask 홈">LOA<span>TASK</span></RouterLink>
        <nav class="nav-menu" aria-label="주 메뉴">
          <RouterLink
            to="/"
            :class="{ active: route.path === '/' || route.name === 'characterDetail' }"
            >캐릭터 검색</RouterLink
          >
          <RouterLink to="/community" active-class="active">커뮤니티</RouterLink>
          <RouterLink to="/chatbot" active-class="active">챗봇</RouterLink>
        </nav>
      </v-container>
    </v-app-bar>
    <RouterView />
    <footer class="site-footer">
      <v-container
        >LoaTask <span>로스트아크 캐릭터 정보 · 데이터 제공 Lost Ark Open API</span></v-container
      >
    </footer>
  </v-app>
</template>

<style scoped>
.app-bar {
  background: #101010 !important;
  border-bottom: 1px solid var(--line);
}
.header-inner {
  display: flex;
  align-items: center;
  gap: 64px;
  height: 100%;
  padding-top: 0;
  padding-bottom: 0;
}
.logo {
  flex-shrink: 0;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.8px;
}
.logo span {
  color: var(--accent);
}
.nav-menu {
  display: flex;
  gap: 30px;
  height: 100%;
}
.nav-menu a {
  display: flex;
  align-items: center;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  color: var(--muted);
}
.nav-menu a:hover {
  color: var(--text);
}
.nav-menu a.active {
  border-bottom-color: var(--accent);
  color: var(--text);
}
.site-footer {
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 12px;
  padding: 12px 0;
}
.site-footer span {
  margin-left: 24px;
}
@media (max-width: 600px) {
  .header-inner {
    gap: 24px;
  }
  .logo {
    font-size: 18px;
  }
  .nav-menu {
    gap: 18px;
  }
  .nav-menu a {
    font-size: 12px;
    white-space: nowrap;
  }
  .site-footer span {
    display: block;
    margin: 4px 0 0;
  }
}
</style>
