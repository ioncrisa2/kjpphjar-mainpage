import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAppStore } from '@/stores/index';
import HomeView from '../views/index.vue';
import { nextTick } from 'vue';

const routes: RouteRecordRaw[] = [
    // dashboard
    { path: '/', name: 'home', component: HomeView, meta: { title: "Homepage | KJPP HJA'R" } },
    {
        path: '/rekan-klien',
        name: 'rekan-klien',
        component: () => import(/* webpackChunkName: "team" */ '../views/client.vue'),
        meta: { title: "Rekan dan Klien | KJPP HJA'R" },
    },
    {
        path: '/about-us',
        name: 'about-us',
        component: () => import(/* webpackChunkName: "about-us" */ '../views/about-us.vue'),
        meta: { title: "About Us | KJPP HJA'R" },
    },
    {
        path: '/gallery',
        name: 'gallery',
        component: () => import(/* webpackChunkName: "career" */ '../views/gallery.vue'),
        meta: { title: "Gallery | KJPP HJA'R" },
    },
    {
        path: '/contact-us',
        name: 'contact-us',
        component: () => import(/* webpackChunkName: "contact-us" */ '../views/contact-us.vue'),
        meta: { title: "Contact Us | KJPP HJA'R" },
    },
    {
        path: '/faq',
        name: 'FAQs',
        component: () => import(/* webpackChunkName: "FAQs" */ '../views/faq.vue'),
        meta: { title: "FAQs | KJPP HJA'R" },
    },
    {
        path: '/:catchAll(.*)',
        name: "404 | KJPP HJA'R",
        component: () => import(/* webpackChunkName: "404" */ '../layouts/error.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    linkExactActiveClass: 'active',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return { el: to.hash };
        }

        if (savedPosition) {
            return savedPosition;
        } else {
            return { left: 0, top: 0 };
        }
    },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.afterEach((to, from, next) => {
    const store = useAppStore();
    nextTick(() => {
        document.title = (to.meta.title || "KJPP HJA'R") as never;
    });
    store.toggleMainLoader(false);
});

export default router;
