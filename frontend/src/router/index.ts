import { createRouter, createWebHistory } from 'vue-router'

import CharacterListView from '@/views/CharacterListView.vue'
import CommunityView from '@/views/CommunityView.vue'
import ChatbotView from '@/views/ChatbotView.vue'
import CharacterDetailView from '@/views/CharacterDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/tarot',
      name: 'tarot',
      meta: { title: '네리아의 고민 상담실' },
      component: () => import('@/views/TarotIntroView.vue'),
    },
    {
      path: '/tarot/reading',
      name: 'tarotReading',
      meta: { title: '네리아의 타로 상담' },
      component: () => import('@/views/TarotView.vue'),
    },
    {
      path: '/fortune',
      name: 'fortune',
      component: () => import('@/views/FortuneView.vue'),
    },
    {
      path: '/',
      name: 'characterSearch',
      component: CharacterListView,
    },
    {
      path: '/community',
      name: 'community',
      component: CommunityView,
    },
    {
      path: '/chatbot',
      name: 'chatbot',
      component: ChatbotView,
    },
    {
      path: '/character/:name',
      name: 'characterDetail',
      component: CharacterDetailView,
    },
  ],
})

export default router
