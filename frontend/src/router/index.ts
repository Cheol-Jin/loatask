import { createRouter, createWebHistory } from 'vue-router'
import CharacterListView from '@/views/CharacterListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'characters',
      component: CharacterListView,
    },
  ],
})

export default router
