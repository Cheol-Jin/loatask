import { createRouter, createWebHistory } from 'vue-router'

import CharacterListView from '@/views/CharacterListView.vue'
import CommunityView from '@/views/CommunityView.vue'
import ChatbotView from '@/views/ChatbotView.vue'
import CharacterDetailView from '@/views/CharacterDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
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
