import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue' // import your components
// import AboutPage from '../components/AboutPage.vue'

const routes = [
    { path: '/', component: Main },
    // { path: '/about', component: AboutPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router