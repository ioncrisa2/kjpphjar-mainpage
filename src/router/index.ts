import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAppStore } from '@/stores/index';
import HomeView from '../views/index.vue';
import { nextTick } from 'vue';

const routes: RouteRecordRaw[] = [
    // dashboard
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Plurk – Tailwind CSS Multipurpose Landing Templates' } },
    {
        path: '/portfolio',
        name: 'portfolio',
        component: () => import(/* webpackChunkName: "portfolio" */ '../views/portfolio/index.vue'),
        meta: { title: 'Portfolio | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/portfolio-detail',
        name: 'portfolio-detail',
        component: () => import(/* webpackChunkName: "portfolio" */ '../views/portfolio/detail.vue'),
        meta: { title: 'Portfolio Detail | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/services',
        name: 'services',
        component: () => import(/* webpackChunkName: "services" */ '../views/services/index.vue'),
        meta: { title: 'Services | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/services-detail',
        name: 'services-detail',
        component: () => import(/* webpackChunkName: "services" */ '../views/services/detail.vue'),
        meta: { title: 'Services Detail | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/team',
        name: 'team',
        component: () => import(/* webpackChunkName: "team" */ '../views/team.vue'),
        meta: { title: 'Team | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/about-us',
        name: 'about-us',
        component: () => import(/* webpackChunkName: "about-us" */ '../views/about-us.vue'),
        meta: { title: 'About Us | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/career',
        name: 'career',
        component: () => import(/* webpackChunkName: "career" */ '../views/career.vue'),
        meta: { title: 'Career | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/contact-us',
        name: 'contact-us',
        component: () => import(/* webpackChunkName: "contact-us" */ '../views/contact-us.vue'),
        meta: { title: 'Contact Us | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/terms-conditions',
        name: 'terms-conditions',
        component: () => import(/* webpackChunkName: "terms-conditions" */ '../views/terms-conditions.vue'),
        meta: { title: 'Terms Conditions | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/privacy-policy',
        name: 'privacy-policy',
        component: () => import(/* webpackChunkName: "privacy-policy" */ '../views/privacy-policy.vue'),
        meta: { title: 'Privacy Policy | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/faq',
        name: 'FAQs',
        component: () => import(/* webpackChunkName: "FAQs" */ '../views/faq.vue'),
        meta: { title: 'FAQs | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/blog',
        name: 'blog',
        component: () => import(/* webpackChunkName: "blog" */ '../views/blog/index.vue'),
        meta: { title: 'Blog | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/blog-details',
        name: 'blog-details',
        component: () => import(/* webpackChunkName: "blog" */ '../views/blog/details.vue'),
        meta: { title: 'Blog Details | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/crypto',
        name: 'crypto',
        component: () => import(/* webpackChunkName: "crypto" */ '../views/crypto.vue'),
        meta: { title: 'Crypto | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/real-estate',
        name: 'real-estate',
        component: () => import(/* webpackChunkName: "real-estate" */ '../views/real-estate.vue'),
        meta: { title: 'Real Estate | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/modern-saas',
        name: 'modern-saas',
        component: () => import(/* webpackChunkName: "modern-saas" */ '../views/modern-saas.vue'),
        meta: { title: 'Modern SAAS | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/healthcare',
        name: 'healthcare',
        component: () => import(/* webpackChunkName: "healthcare" */ '../views/healthcare.vue'),
        meta: { title: 'Health Care | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/hotel-resort',
        name: 'hotel-resort',
        component: () => import(/* webpackChunkName: "hotel-resort" */ '../views/hotel-resort.vue'),
        meta: { title: 'Hotel & Resort | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/marketing',
        name: 'marketing',
        component: () => import(/* webpackChunkName: "marketing" */ '../views/marketing.vue'),
        meta: { title: 'Marketing | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/application',
        name: 'application',
        component: () => import(/* webpackChunkName: "application" */ '../views/application.vue'),
        meta: { title: 'Application | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/nft',
        name: 'nft',
        component: () => import(/* webpackChunkName: "nft" */ '../views/nft.vue'),
        meta: { title: 'NFT | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/blog-landing',
        name: 'blog-landing',
        component: () => import(/* webpackChunkName: "blog-landing" */ '../views/blog-landing.vue'),
        meta: { title: 'Blog | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/construction',
        name: 'construction',
        component: () => import(/* webpackChunkName: "construction" */ '../views/construction.vue'),
        meta: { title: 'Construction | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/consulting',
        name: 'consulting',
        component: () => import(/* webpackChunkName: "consulting" */ '../views/consulting.vue'),
        meta: { title: 'Consulting | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/creative-agency',
        name: 'creative-agency',
        component: () => import(/* webpackChunkName: "creative-agency" */ '../views/creative-agency.vue'),
        meta: { title: 'Creative Agency | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/gym',
        name: 'gym',
        component: () => import(/* webpackChunkName: "gym" */ '../views/gym.vue'),
        meta: { title: 'Gym | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/insurance',
        name: 'insurance',
        component: () => import(/* webpackChunkName: "insurance" */ '../views/insurance.vue'),
        meta: { title: 'Insurance | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/job-placement',
        name: 'job-placement',
        component: () => import(/* webpackChunkName: "job-placement" */ '../views/job-placement.vue'),
        meta: { title: 'Job Placement | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/restaurant',
        name: 'restaurant',
        component: () => import(/* webpackChunkName: "restaurant" */ '../views/restaurant.vue'),
        meta: { title: 'Restaurant | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/portfolio-landing',
        name: 'portfolio-landing',
        component: () => import(/* webpackChunkName: "restaurent" */ '../views/portfolio-landing.vue'),
        meta: { title: 'Portfolio Landing | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/event-concert',
        name: 'event-concert',
        component: () => import(/* webpackChunkName: "event-concert" */ '../views/event-concert.vue'),
        meta: { title: 'Event Concert | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/online-courses',
        name: 'online-courses',
        component: () => import(/* webpackChunkName: "online-courses" */ '../views/online-courses.vue'),
        meta: { title: 'Online Courses | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/online-payments',
        name: 'online-payments',
        component: () => import(/* webpackChunkName: "online-payments" */ '../views/online-payments.vue'),
        meta: { title: 'Online Payments | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/personal-portfolio',
        name: 'personal-portfolio',
        component: () => import(/* webpackChunkName: "personal-portfolio" */ '../views/personal-portfolio.vue'),
        meta: { title: 'Personal Portfolio | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/photography',
        name: 'photography',
        component: () => import(/* webpackChunkName: "photography" */ '../views/photography.vue'),
        meta: { title: 'Photography | Plurk – Tailwind CSS Multipurpose Landing Templates' },
    },
    {
        path: '/:catchAll(.*)',
        name: '404 | Plurk – Tailwind CSS Multipurpose Landing Templates',
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
