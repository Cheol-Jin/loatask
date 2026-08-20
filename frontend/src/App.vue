<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path: string) => {
  return route.path === path
}
</script>

<template>
  <v-app>
    <v-app-bar flat height="72" class="app-bar">
      <v-container class="d-flex align-center">
        <RouterLink to="/" class="logo"> LoaTask </RouterLink>

        <v-spacer />

        <div class="nav-menu">
          <v-btn
            to="/"
            variant="text"
            rounded="lg"
            prepend-icon="mdi-magnify"
            :class="{ 'nav-active': isActive('/') }"
          >
            캐릭터 검색
          </v-btn>

          <v-btn
            to="/community"
            variant="text"
            rounded="lg"
            prepend-icon="mdi-forum-outline"
            :class="{ 'nav-active': isActive('/community') }"
          >
            커뮤니티
          </v-btn>

          <v-btn
            to="/chatbot"
            variant="text"
            rounded="lg"
            prepend-icon="mdi-robot-outline"
            :class="{ 'nav-active': isActive('/chatbot') }"
          >
            챗봇
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <RouterView />
  </v-app>
</template>

<style scoped>
.app-bar {
  background: rgba(13, 17, 23, 0.92) !important;
  border-bottom: 1px solid #263246;
  backdrop-filter: blur(18px);
}

.logo {
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-menu :deep(.v-btn) {
  color: #9ca3af;
  transition: 0.2s ease;
}

.nav-menu :deep(.v-btn:hover) {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
}

.nav-menu :deep(.nav-active) {
  color: #90caf9 !important;
  background: rgba(66, 165, 245, 0.12) !important;
}

@media (max-width: 600px) {
  .nav-menu :deep(.v-btn__prepend) {
    display: none;
  }

  .nav-menu :deep(.v-btn) {
    padding: 0 10px;
    font-size: 13px;
  }
}
</style>
