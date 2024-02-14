import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAppStore } from '@/stores/index';
import HomeView from '../views/index.vue';
import { nextTick } from 'vue';

const routes: RouteRecordRaw[] = [
    // dashboard
    { path: '/', name: 'home', component: HomeView, meta: { title: "Homepage | KJPP HJA'R" } },
    {
        path: '/portfolio',
        name: 'portfolio',
        component: () => import(/* webpackChunkName: "portfolio" */ '../views/portfolio/index.vue'),
        meta: { title: "Portfolio | KJPP HJA'R" },
    },
    {
        path: '/portfolio-detail',
        name: 'portfolio-detail',
        component: () => import(/* webpackChunkName: "portfolio" */ '../views/portfolio/detail.vue'),
        meta: { title: "Portfolio Detail | KJPP HJA'R" },
    },
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
        path: '/privacy-policy',
        name: 'privacy-policy',
        component: () => import(/* webpackChunkName: "privacy-policy" */ '../views/privacy-policy.vue'),
        meta: { title: "Privacy Policy | KJPP HJA'R" },
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
        path: '/crypto',
        name: 'crypto',
        component: () => import(/* webpackChunkName: "crypto" */ '../views/crypto.vue'),
        meta: { title: "Crypto | KJPP HJA'R" },
    },
    {
        path: '/real-estate',
        name: 'real-estate',
        component: () => import(/* webpackChunkName: "real-estate" */ '../views/real-estate.vue'),
        meta: { title: "Real Estate | KJPP HJA'R" },
    },
    {
        path: '/modern-saas',
        name: 'modern-saas',
        component: () => import(/* webpackChunkName: "modern-saas" */ '../views/modern-saas.vue'),
        meta: { title: "Modern SAAS | KJPP HJA'R" },
    },
    {
        path: '/healthcare',
        name: 'healthcare',
        component: () => import(/* webpackChunkName: "healthcare" */ '../views/healthcare.vue'),
        meta: { title: "Health Care | KJPP HJA'R" },
    },
    {
        path: '/hotel-resort',
        name: 'hotel-resort',
        component: () => import(/* webpackChunkName: "hotel-resort" */ '../views/hotel-resort.vue'),
        meta: { title: "Hotel & Resort | KJPP HJA'R" },
    },
    {
        path: '/marketing',
        name: 'marketing',
        component: () => import(/* webpackChunkName: "marketing" */ '../views/marketing.vue'),
        meta: { title: "Marketing | KJPP HJA'R" },
    },
    {
        path: '/application',
        name: 'application',
        component: () => import(/* webpackChunkName: "application" */ '../views/application.vue'),
        meta: { title: "Application | KJPP HJA'R" },
    },
    {
        path: '/nft',
        name: 'nft',
        component: () => import(/* webpackChunkName: "nft" */ '../views/nft.vue'),
        meta: { title: "NFT | KJPP HJA'R" },
    },
    {
        path: '/blog-landing',
        name: 'blog-landing',
        component: () => import(/* webpackChunkName: "blog-landing" */ '../views/blog-landing.vue'),
        meta: { title: "Blog | KJPP HJA'R" },
    },
    {
        path: '/construction',
        name: 'construction',
        component: () => import(/* webpackChunkName: "construction" */ '../views/construction.vue'),
        meta: { title: "Construction | KJPP HJA'R" },
    },
    {
        path: '/consulting',
        name: 'consulting',
        component: () => import(/* webpackChunkName: "consulting" */ '../views/consulting.vue'),
        meta: { title: "Consulting | KJPP HJA'R" },
    },
    {
        path: '/creative-agency',
        name: 'creative-agency',
        component: () => import(/* webpackChunkName: "creative-agency" */ '../views/creative-agency.vue'),
        meta: { title: "Creative Agency | KJPP HJA'R" },
    },
    {
        path: '/gym',
        name: 'gym',
        component: () => import(/* webpackChunkName: "gym" */ '../views/gym.vue'),
        meta: { title: "Gym | KJPP HJA'R" },
    },
    {
        path: '/insurance',
        name: 'insurance',
        component: () => import(/* webpackChunkName: "insurance" */ '../views/insurance.vue'),
        meta: { title: "Insurance | KJPP HJA'R" },
    },
    {
        path: '/job-placement',
        name: 'job-placement',
        component: () => import(/* webpackChunkName: "job-placement" */ '../views/job-placement.vue'),
        meta: { title: "Job Placement | KJPP HJA'R" },
    },
    {
        path: '/restaurant',
        name: 'restaurant',
        component: () => import(/* webpackChunkName: "restaurant" */ '../views/restaurant.vue'),
        meta: { title: "Restaurant | KJPP HJA'R" },
    },
    {
        path: '/portfolio-landing',
        name: 'portfolio-landing',
        component: () => import(/* webpackChunkName: "restaurent" */ '../views/portfolio-landing.vue'),
        meta: { title: "Portfolio Landing | KJPP HJA'R" },
    },
    {
        path: '/event-concert',
        name: 'event-concert',
        component: () => import(/* webpackChunkName: "event-concert" */ '../views/event-concert.vue'),
        meta: { title: "Event Concert | KJPP HJA'R" },
    },
    {
        path: '/online-courses',
        name: 'online-courses',
        component: () => import(/* webpackChunkName: "online-courses" */ '../views/online-courses.vue'),
        meta: { title: "Online Courses | KJPP HJA'R" },
    },
    {
        path: '/online-payments',
        name: 'online-payments',
        component: () => import(/* webpackChunkName: "online-payments" */ '../views/online-payments.vue'),
        meta: { title: "Online Payments | KJPP HJA'R" },
    },
    {
        path: '/personal-portfolio',
        name: 'personal-portfolio',
        component: () => import(/* webpackChunkName: "personal-portfolio" */ '../views/personal-portfolio.vue'),
        meta: { title: "Personal Portfolio | KJPP HJA'R" },
    },
    {
        path: '/photography',
        name: 'photography',
        component: () => import(/* webpackChunkName: "photography" */ '../views/photography.vue'),
        meta: { title: "Photography | KJPP HJA'R" },
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
