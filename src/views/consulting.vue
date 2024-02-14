<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import LogoSlider from '@/components/LogoSlider.vue';
import CountUp from 'vue-countup-v3';
import Modal from '@/components/Modal.vue';
import VueCollapsible from 'vue-height-collapsible/vue3';
import { useAppStore } from '@/stores/index';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import ServiceItem from '@/components/ServiceItem.vue';

const dialog: any = ref(null);
const store = useAppStore();
const feedbacks = ref([
    {
        id: 1,
        name: 'Allan Branch',
        role: 'CEO of Lifted',
        thumbnail: '/assets/images/testimonial.png',
        message:
            "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
    },
]);

const queries = ref([
    {
        id: 1,
        question: 'Are your service easy to use?',
        answer: 'mhmd, Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table.',
    },
    {
        id: 2,
        question: 'Will i receive future updates?',
        answer: 'mhmd, Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.',
    },
    {
        id: 3,
        question: 'Is this services work in my country?',
        answer: ' mhmd, Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.',
    },
    {
        id: 4,
        question: 'How much I will pay?',
        answer: 'mhmd, Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod',
    },
]);
const accordians: any = ref(0);
</script>

<style>
[data-height-collapsible] {
    transition: height 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

<template>
    <div>
        <section
            class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-center bg-no-repeat pt-[82px] text-white lg:pt-[106px]">
            <div class="container">
                <div class="flex flex-col gap-7 pt-6 md:flex-row md:gap-0">
                    <div class="space-y-5 pt-24 pb-10 text-center ltr:md:text-left rtl:md:text-right">
                        <h5 class="text-xl font-bold">Selamat Datang</h5>
                        <h2 class="text-4xl font-black uppercase sm:text-3xl sm:leading-tight">KJPP Henricus Judi Adrianto
                            dan Rekan</h2>
                        <p class="text-lg font-semibold">
                            KJPP Henricus Judi Adrianto dan Rekan (KJPP HJA'R) merupakan perusahaan jasa penilai publik dan
                            konsultan independen yang menawarkan berbagai layanan
                        </p>
                        <RouterLink to="#service" class="btn rounded-md bg-white">Layanan Kami</RouterLink>
                    </div>
                    <div class="mx-auto w-full max-w-[435px] hidden lg:block">
                        <img src="\assets\images\pak henricus.png" alt="" />
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-gradient-to-b from-white/[55%] to-transparent py-14 dark:bg-none lg:py-20" id="service">
            <div class="container">
                <div class="heading mb-5 text-center ltr:lg:text-center rtl:lg:text-center">
                    <h4>Layanan Kami</h4>
                </div>
                <div class="mt-16 grid gap-x-7 gap-y-12 text-lg font-semibold sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-20">
                    <ServiceItem service-title="Konsultasi Pengembangan Properti"
                        service-title-sub="(Property Development Consulting)"
                        service-desc="Maksimalkan potensi properti Anda dengan konsultasi pengembangan profesional dan inovatif!">
                        <svg width="40" height="40" fill="#000000" viewBox="0 0 24 24" id="home-3" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" class="icon flat-color"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary" d="M21.41,8l-3.7-3.71A1,1,0,0,0,17,4H7a1,1,0,0,0-.92.62,1,1,0,0,0,.21,1.09L10,9.41V19a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V9.41A2,2,0,0,0,21.41,8Z" style="fill: #000000;"></path><path id="secondary" d="M11.71,8.29l-4-4a1,1,0,0,0-1.42,0L2.59,8A2,2,0,0,0,2,9.41V19a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V9A1,1,0,0,0,11.71,8.29Z" style="fill: #47bdff;"></path></g></svg>
                        </ServiceItem>
                    <ServiceItem service-title="Studi Kelayakan" service-title-sub="(Feasibility Study)"
                        service-desc="Optimalkan keberhasilan bisnis Anda dengan Studi Kelayakan Profesional kami!">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.25175 22.8926H2.67813C1.58662 22.8926 0.701782 23.7774 0.701782 24.8689V36.8477C0.701782 37.9392 1.58662 38.8241 2.67813 38.8241H9.25175C10.3433 38.8241 11.2281 37.9392 11.2281 36.8477V24.8689C11.2281 23.7774 10.3433 22.8926 9.25175 22.8926Z"
                                fill="#47BDFF" />
                            <path
                                d="M22.936 12.0098H16.3623C15.2708 12.0098 14.386 12.8946 14.386 13.9861V36.8482C14.386 37.9397 15.2708 38.8245 16.3623 38.8245H22.936C24.0275 38.8245 24.9123 37.9397 24.9123 36.8482V13.9861C24.9123 12.8946 24.0275 12.0098 22.936 12.0098Z"
                                fill="currentColor" />
                            <path
                                d="M36.6202 0.929688H30.0465C28.955 0.929688 28.0702 1.81453 28.0702 2.90604V36.8481C28.0702 37.9396 28.955 38.8244 30.0465 38.8244H36.6202C37.7117 38.8244 38.5965 37.9396 38.5965 36.8481V2.90604C38.5965 1.81453 37.7117 0.929688 36.6202 0.929688Z"
                                fill="#B476E5" />
                        </svg>
                    </ServiceItem>
                    <ServiceItem service-title="Pengawasan Proyek" service-title-sub="(Project Supervision)"
                        service-desc="Pastikan keberhasilan proyek Anda dengan pengawasan profesional yang terpercaya!">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.25175 22.8926H2.67813C1.58662 22.8926 0.701782 23.7774 0.701782 24.8689V36.8477C0.701782 37.9392 1.58662 38.8241 2.67813 38.8241H9.25175C10.3433 38.8241 11.2281 37.9392 11.2281 36.8477V24.8689C11.2281 23.7774 10.3433 22.8926 9.25175 22.8926Z"
                                fill="#47BDFF" />
                            <path
                                d="M22.936 12.0098H16.3623C15.2708 12.0098 14.386 12.8946 14.386 13.9861V36.8482C14.386 37.9397 15.2708 38.8245 16.3623 38.8245H22.936C24.0275 38.8245 24.9123 37.9397 24.9123 36.8482V13.9861C24.9123 12.8946 24.0275 12.0098 22.936 12.0098Z"
                                fill="currentColor" />
                            <path
                                d="M36.6202 0.929688H30.0465C28.955 0.929688 28.0702 1.81453 28.0702 2.90604V36.8481C28.0702 37.9396 28.955 38.8244 30.0465 38.8244H36.6202C37.7117 38.8244 38.5965 37.9396 38.5965 36.8481V2.90604C38.5965 1.81453 37.7117 0.929688 36.6202 0.929688Z"
                                fill="#B476E5" />
                        </svg>
                    </ServiceItem>
                    <ServiceItem service-title="Penilaian Harta Berwujud Maupun Tidak Berwujud"
                        service-title-sub="(Asset Valuation)"
                        service-desc="Nilai aset Anda dengan akurat melalui penilaian profesional kami!">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.25175 22.8926H2.67813C1.58662 22.8926 0.701782 23.7774 0.701782 24.8689V36.8477C0.701782 37.9392 1.58662 38.8241 2.67813 38.8241H9.25175C10.3433 38.8241 11.2281 37.9392 11.2281 36.8477V24.8689C11.2281 23.7774 10.3433 22.8926 9.25175 22.8926Z"
                                fill="#47BDFF" />
                            <path
                                d="M22.936 12.0098H16.3623C15.2708 12.0098 14.386 12.8946 14.386 13.9861V36.8482C14.386 37.9397 15.2708 38.8245 16.3623 38.8245H22.936C24.0275 38.8245 24.9123 37.9397 24.9123 36.8482V13.9861C24.9123 12.8946 24.0275 12.0098 22.936 12.0098Z"
                                fill="currentColor" />
                            <path
                                d="M36.6202 0.929688H30.0465C28.955 0.929688 28.0702 1.81453 28.0702 2.90604V36.8481C28.0702 37.9396 28.955 38.8244 30.0465 38.8244H36.6202C37.7117 38.8244 38.5965 37.9396 38.5965 36.8481V2.90604C38.5965 1.81453 37.7117 0.929688 36.6202 0.929688Z"
                                fill="#B476E5" />
                        </svg>
                    </ServiceItem>
                    <ServiceItem service-title="Penilaian Proyek" service-title-sub="(Project Valuation)"
                        service-desc="Optimalkan nilai proyek Anda melalui penilaian komprehensif dan akurat!">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.25175 22.8926H2.67813C1.58662 22.8926 0.701782 23.7774 0.701782 24.8689V36.8477C0.701782 37.9392 1.58662 38.8241 2.67813 38.8241H9.25175C10.3433 38.8241 11.2281 37.9392 11.2281 36.8477V24.8689C11.2281 23.7774 10.3433 22.8926 9.25175 22.8926Z"
                                fill="#47BDFF" />
                            <path
                                d="M22.936 12.0098H16.3623C15.2708 12.0098 14.386 12.8946 14.386 13.9861V36.8482C14.386 37.9397 15.2708 38.8245 16.3623 38.8245H22.936C24.0275 38.8245 24.9123 37.9397 24.9123 36.8482V13.9861C24.9123 12.8946 24.0275 12.0098 22.936 12.0098Z"
                                fill="currentColor" />
                            <path
                                d="M36.6202 0.929688H30.0465C28.955 0.929688 28.0702 1.81453 28.0702 2.90604V36.8481C28.0702 37.9396 28.955 38.8244 30.0465 38.8244H36.6202C37.7117 38.8244 38.5965 37.9396 38.5965 36.8481V2.90604C38.5965 1.81453 37.7117 0.929688 36.6202 0.929688Z"
                                fill="#B476E5" />
                        </svg>
                    </ServiceItem>
                    <ServiceItem service-title="Monitoring dan Evaluasi Pembiayaan Proyek"
                        service-desc="Jamin keberhasilan proyek dengan monitoring dan evaluasi pembiayaan yang teliti.">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.25175 22.8926H2.67813C1.58662 22.8926 0.701782 23.7774 0.701782 24.8689V36.8477C0.701782 37.9392 1.58662 38.8241 2.67813 38.8241H9.25175C10.3433 38.8241 11.2281 37.9392 11.2281 36.8477V24.8689C11.2281 23.7774 10.3433 22.8926 9.25175 22.8926Z"
                                fill="#47BDFF" />
                            <path
                                d="M22.936 12.0098H16.3623C15.2708 12.0098 14.386 12.8946 14.386 13.9861V36.8482C14.386 37.9397 15.2708 38.8245 16.3623 38.8245H22.936C24.0275 38.8245 24.9123 37.9397 24.9123 36.8482V13.9861C24.9123 12.8946 24.0275 12.0098 22.936 12.0098Z"
                                fill="currentColor" />
                            <path
                                d="M36.6202 0.929688H30.0465C28.955 0.929688 28.0702 1.81453 28.0702 2.90604V36.8481C28.0702 37.9396 28.955 38.8244 30.0465 38.8244H36.6202C37.7117 38.8244 38.5965 37.9396 38.5965 36.8481V2.90604C38.5965 1.81453 37.7117 0.929688 36.6202 0.929688Z"
                                fill="#B476E5" />
                        </svg>
                    </ServiceItem>
                </div>
            </div>
        </section>


        <section class="relative bg-black py-12 dark:bg-white/5 lg:py-24">
            <div class="absolute bottom-0 ltr:right-0 rtl:left-0">
                <img src="/assets/images/consulting/bg-icon.svg" class="rtl:rotate-y-180" alt="" />
            </div>
            <div class="container relative z-[1]">
                <div class="heading text-center text-white">
                    <h4 class="mb-2 !font-black uppercase !text-white">Kenapa <span class="text-primary">Memilih kami</span> ?</h4>
                </div>
                <div class="mt-10 grid grid-cols-1 gap-[30px] sm:grid-cols-1 lg:grid-cols-2" data-aos="zoom-in"
                    data-aos-duration="1000">
                    <div class="group">
                        <div class="overflow-hidden">
                            <img src="/assets/images/team.jpg"
                                class="w-full duration-200 group-hover:rotate-2 group-hover:scale-110" alt="" />
                        </div>
                        <div
                            class="relative mx-4 -mt-10 space-y-2.5 bg-gray-dark px-4 pt-[22px] text-center dark:bg-black md:px-[26px]">
                            <h5 class="text-2xl font-bold text-primary group-hover:text-secondary">Team</h5>
                            <div class="mx-auto h-1 w-[50px] bg-secondary duration-200 group-hover:bg-primary"></div>
                            <p class="pb-[60px] text-lg font-semibold">
                                Didukung tim manajemen yang solid dan berkualitas
                            </p>
                            <span class="absolute bottom-0 opacity-20 ltr:right-0 rtl:left-0">
                                <img src="/assets/images/consulting/services-icon1.svg" alt="" />
                            </span>
                        </div>
                    </div>
                    <div class="group">
                        <div class="overflow-hidden">
                            <img src="/assets/images/scale.jpg"
                                class="w-full duration-200 group-hover:rotate-2 group-hover:scale-110" alt="" />
                        </div>
                        <div
                            class="relative mx-4 -mt-10 space-y-2.5 bg-gray-dark px-4 pt-[22px] text-center dark:bg-black md:px-[26px]">
                            <h5 class="text-2xl font-bold text-primary group-hover:text-secondary">Scala</h5>
                            <div class="mx-auto h-1 w-[50px] bg-secondary duration-200 group-hover:bg-primary"></div>
                            <p class="pb-[60px] text-lg font-semibold">
                                Siap menjadi pilihan dari perusahaan berskala kecil, menengah hingga besar.
                            </p>
                            <span class="absolute bottom-0 opacity-20 ltr:right-0 rtl:left-0">
                                <img src="/assets/images/consulting/services-icon2.svg" alt="" />
                            </span>
                        </div>
                    </div>
                    <div class="group">
                        <div class="overflow-hidden">
                            <img src="/assets/images/efektif&efisien.jpg"
                                class="w-full duration-200 group-hover:rotate-2 group-hover:scale-110" alt="" />
                        </div>
                        <div
                            class="relative mx-4 -mt-10 space-y-2.5 bg-gray-dark px-4 pt-[22px] text-center dark:bg-black md:px-[26px]">
                            <h5 class="text-2xl font-bold text-primary group-hover:text-secondary">Efektif & Efisien</h5>
                            <div class="mx-auto h-1 w-[50px] bg-secondary duration-200 group-hover:bg-primary"></div>
                            <p class="pb-[60px] text-lg font-semibold">
                                Menggunakan schedule kerja yang jelas, terukur dan dilakukan secara efektif dan efisien
                            </p>
                            <span class="absolute bottom-0 opacity-20 ltr:right-0 rtl:left-0">
                                <img src="/assets/images/consulting/services-icon3.svg" alt="" />
                            </span>
                        </div>
                    </div>
                    <div class="group">
                        <div class="overflow-hidden">
                            <img src="/assets/images/rahasia.jpg"
                                class="w-full duration-200 group-hover:rotate-2 group-hover:scale-110" alt="" />
                        </div>
                        <div
                            class="relative mx-4 -mt-10 space-y-2.5 bg-gray-dark px-4 pt-[22px] text-center dark:bg-black md:px-[26px]">
                            <h5 class="text-2xl font-bold text-primary group-hover:text-secondary">Kerahasiaan</h5>
                            <div class="mx-auto h-1 w-[50px] bg-secondary duration-200 group-hover:bg-primary"></div>
                            <p class="pb-[60px] text-lg font-semibold">
                                Kami menjamin bahwa konsultan kami akan menjaga kerahasiaan data anda sesuai dengan pakta integritas.
                            </p>
                            <span class="absolute bottom-0 opacity-20 ltr:right-0 rtl:left-0">
                                <img src="/assets/images/consulting/services-icon3.svg" alt="" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="bg-black bg-[url(/assets/images/consulting/business-img.png)] bg-cover bg-center bg-no-repeat py-12 lg:py-24">
            <div class="container">
                <div
                    class="grid grid-cols-1 gap-12 text-center lg:grid-cols-2 lg:gap-20 ltr:lg:text-left rtl:lg:text-right">
                    <div>
                        <h3 class="text-1xl font-black uppercase text-white sm:text-[40px] sm:leading-[50px]">
                           Pengalaman <span class="text-primary">Kami</span>
                        </h3>
                        <p class="mt-[18px] text-lg">
                            Dengan pengalaman lebih dari 10 tahun dan ribuan pelanggan puas, kami menjadi mitra terpercaya dalam memenuhi kebutuhan anda.
                        </p>
                        <div class="mt-[18px] flex justify-center gap-6 lg:justify-start">
                            <div>
                                <router-link to="/contact-us"
                                    class="btn rounded-md bg-secondary text-white shadow-[10px_15px_30px_rgba(199,128,161,0.2)] hover:bg-primary">Contact
                                    us
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 items-center gap-3 sm:gap-7" data-aos="zoom-in" data-aos-duration="1000">
                        <div
                            class="border border-transparent bg-gray/20 py-10 px-5 text-center duration-200 hover:border-secondary sm:py-[52px]">
                            <count-up class="text-[34px] font-black text-white" :startVal="0" :end-val="5000" :duration="15"
                                :options="{ suffix: '+' }"></count-up>
                            <p class="mt-2.5 font-bold">Pelanggan Puas</p>
                        </div>
                        <div
                            class="border border-transparent bg-gray/20 py-10 px-5 text-center duration-200 hover:border-secondary sm:py-[52px]">
                            <count-up class="text-[34px] font-black text-white" :startVal="0" :end-val="10" :duration="15"
                                :options="{ suffix: '+' }"></count-up>
                            <p class="mt-2.5 font-bold">Pengalaman</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

