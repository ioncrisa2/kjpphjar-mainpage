import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAppStore } from '@/stores/index';
import HomeView from '../views/index.vue';
import { nextTick } from 'vue';

const routes: RouteRecordRaw[] = [
    // dashboard
    { path: '/', name: 'home', component: HomeView, meta: { title: "Homepage | KJPP HJA'R" } },
    {
        path: '/services',
        name: 'services',
        component: () => import(/* webpackChunkName: "services" */ '../views/services/index.vue'),
        meta: { title: "Services | KJPP HJA'R" },
    },
    {
        path: '/services-detail',
        name: 'services-detail',
        component: () => import(/* webpackChunkName: "services" */ '../views/services/detail.vue'),
        meta: { title: "Services Detail | KJPP HJA'R" },
    },
    {
        path: '/team',
        name: 'team',
        component: () => import(/* webpackChunkName: "team" */ '../views/team.vue'),
        meta: { title: "Team | KJPP HJA'R" },
    },
    {
        path: '/about-us',
        name: 'about-us',
        component: () => import(/* webpackChunkName: "about-us" */ '../views/about-us.vue'),
        meta: { title: "About Us | KJPP HJA'R" },
    },
    {
        path: '/career',
        name: 'career',
        component: () => import(/* webpackChunkName: "career" */ '../views/career.vue'),
        meta: { title: "Career | KJPP HJA'R" },
    },
    {
        path: '/contact-us',
        name: 'contact-us',
        component: () => import(/* webpackChunkName: "contact-us" */ '../views/contact-us.vue'),
        meta: { title: "Contact Us | KJPP HJA'R" },
    },
    {
        path: '/terms-conditions',
        name: 'terms-conditions',
        component: () => import(/* webpackChunkName: "terms-conditions" */ '../views/terms-conditions.vue'),
        meta: { title: "Terms Conditions | KJPP HJA'R" },
    },
    {
        path: '/faq',
        name: 'FAQs',
        component: () => import(/* webpackChunkName: "FAQs" */ '../views/faq.vue'),
        meta: { title: "FAQs | KJPP HJA'R" },
    },
    {
        path: '/blog',
        name: 'blog',
        component: () => import(/* webpackChunkName: "blog" */ '../views/blog/index.vue'),
        meta: { title: "Blog | KJPP HJA'R" },
    },
    {
        path: '/blog-details',
        name: 'blog-details',
        component: () => import(/* webpackChunkName: "blog" */ '../views/blog/details.vue'),
        meta: { title: "Blog Details | KJPP HJA'R" },
    },
    {
        path: '/nft',
        name: 'nft',
        component: () => import(/* webpackChunkName: "nft" */ '../views/nft.vue'),
        meta: { title: "NFT | KJPP HJA'R" },
    },
    {
        path: '/creative-agency',
        name: 'creative-agency',
        component: () => import(/* webpackChunkName: "creative-agency" */ '../views/creative-agency.vue'),
        meta: { title: "Creative Agency | KJPP HJA'R" },
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
