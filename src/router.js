import { createRouter, createWebHistory } from 'vue-router'
import editingView from './views/editingView.vue'
import Myprojects from './views/myprojects.vue'


const routes = [
  { path: '/', component: Myprojects },
  { path: '/home', component: Myprojects },
  { path: '/editor', name: 'video-player',component: editingView},
  { path: '/myprojects', component: Myprojects}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router