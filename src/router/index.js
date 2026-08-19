import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Popüler Filmler' },
  },
  {
    path: '/kategori/:type',
    name: 'category',
    component: () => import('../views/CategoryView.vue'),
    meta: { title: 'Kategori' },
  },
  {
    path: '/arama',
    name: 'search',
    component: () => import('../views/SearchView.vue'),
    meta: { title: 'Film Ara' },
  },
  {
    path: '/film/:id',
    name: 'movie-detail',
    component: () => import('../views/MovieDetailView.vue'),
    meta: { title: 'Film Detayı' },
  },
  {
    path: '/favoriler',
    name: 'favorites',
    component: () => import('../views/FavoritesView.vue'),
    meta: { title: 'Favoriler' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | CineRota` : 'CineRota'
})

export default router
