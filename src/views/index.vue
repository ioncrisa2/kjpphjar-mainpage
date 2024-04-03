<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import CountUp from "vue-countup-v3";
import Modal from "@/components/Modal.vue";
import VueCollapsible from "vue-height-collapsible/vue3";
import { useAppStore } from "@/stores/index";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import ConsultingIcon from "@/components/icons/ConsultingIcon.vue";
import FeasibilityStudyIcon from "@/components/icons/FeasibilityStudyIcon.vue";
import ProjectSupervisionIcon from "@/components/icons/ProjectSupervisionIcon.vue";
import AsetValuationIcon from "@/components/icons/AssetValuation.vue";
import ProjectValuationIcon from "@/components/icons/ProjectValuationIcon.vue";
import MonitoringIcon from "@/components/icons/MonitoringIcon.vue";
import ServiceItem from "@/components/ServiceItem.vue";

const dialog: any = ref(null);
const store = useAppStore();

interface ChooseUs {
    title:string;
    desc:string;
    image:string;
}

const chooseUs : Array<ChooseUs> = [
    {title:"Team",desc:"Didukung tim manajemen yang solid dan berkualitas",image:"/assets/images/team.jpg"},
    {title:"Scala",desc:"Siap menjadi pilihan dari perusahaan berskala kecil, menengah hingga besar.",image:"/assets/images/scale.jpg"},
    {title:"Efektif & Efisien",desc:"Menggunakan schedule kerja yang jelas, terukur dan dilakukan secara efektif dan efisien",image:"/assets/images/efektif&efisien.jpg"},
    {title:"Kerahasiaan",desc:"Kami menjamin bahwa konsultan kami akan menjaga kerahasiaan data anda sesuai dengan pakta integritas.",image:"/assets/images/rahasia.jpg"},
]

</script>

<template>
    <div class="overflow-x-hidden">
        <section
            class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-center bg-no-repeat pt-[82px] text-white lg:pt-[106px]">
            <div class="container">
                <div class="flex flex-col gap-7 pt-6 md:flex-row md:gap-0">
                    <div class="space-y-5 pt-24 pb-10 text-center ltr:md:text-left rtl:md:text-right">
                        <h5 class="text-xl font-bold">Selamat Datang</h5>
                        <h2 class="text-4xl font-black uppercase sm:text-3xl sm:leading-tight">
                            KJPP Henricus Judi Adrianto dan Rekan
                        </h2>
                        <p class="text-xl font-semibold">
                            KJPP Henricus Judi Adrianto dan Rekan (KJPP HJA'R) merupakan perusahaan jasa
                            penilai publik dan konsultan independen yang menawarkan berbagai layanan
                        </p>
                        <RouterLink to="#service" class="btn rounded-md bg-white">
                            <div class="flex items-center justify-between">
                                <svg width="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M20.3873 7.1575L11.9999 12L3.60913 7.14978" stroke="#000000"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M12 12V21" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                        <path
                                            d="M11 2.57735C11.6188 2.22008 12.3812 2.22008 13 2.57735L19.6603 6.42265C20.2791 6.77992 20.6603 7.44017 20.6603 8.1547V15.8453C20.6603 16.5598 20.2791 17.2201 19.6603 17.5774L13 21.4226C12.3812 21.7799 11.6188 21.7799 11 21.4226L4.33975 17.5774C3.72094 17.2201 3.33975 16.5598 3.33975 15.8453V8.1547C3.33975 7.44017 3.72094 6.77992 4.33975 6.42265L11 2.57735Z"
                                            stroke="#000000" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                        <path d="M8.5 4.5L16 9" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                    </g>
                                </svg>
                                <span class="m-2 text-lg">Layanan Kami</span>
                            </div>
                        </RouterLink>
                    </div>
                    <div class="mx-auto w-full max-w-[386px] hidden lg:block">
                        <img src="@public\assets\images\pak-henricus.png" alt="" />
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
                       <ConsultingIcon />
                    </ServiceItem>
                    <ServiceItem service-title="Studi Kelayakan" service-title-sub="(Feasibility Study)"
                        service-desc="Optimalkan keberhasilan bisnis Anda dengan Studi Kelayakan Profesional kami!">
                        <FeasibilityStudyIcon />
                    </ServiceItem>
                    <ServiceItem service-title="Pengawasan Proyek" service-title-sub="(Project Supervision)"
                        service-desc="Pastikan keberhasilan proyek Anda dengan pengawasan profesional yang terpercaya!">
                        <ProjectSupervisionIcon/>
                    </ServiceItem>
                    <ServiceItem service-title="Penilaian Harta Berwujud Maupun Tidak Berwujud"
                        service-title-sub="(Asset Valuation)"
                        service-desc="Nilai aset Anda dengan akurat melalui penilaian profesional kami!">
                        <AsetValuationIcon />
                    </ServiceItem>
                    <ServiceItem service-title="Penilaian Proyek" service-title-sub="(Project Valuation)"
                        service-desc="Optimalkan nilai proyek Anda melalui penilaian komprehensif dan akurat!">
                        <ProjectValuationIcon />
                    </ServiceItem>
                    <ServiceItem service-title="Monitoring dan Evaluasi Pembiayaan Proyek"
                        service-desc="Jamin keberhasilan proyek dengan monitoring dan evaluasi pembiayaan yang teliti.">
                        <MonitoringIcon />
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
                    <h4 class="mb-2 !font-black uppercase !text-white">
                        Kenapa <span class="text-primary">Memilih kami</span> ?
                    </h4>
                </div>
                <div class="mt-10 grid grid-cols-1 gap-[30px] sm:grid-cols-1 lg:grid-cols-2" data-aos="zoom-in"
                    data-aos-duration="1000">
                    <div class="group" v-for="(item, index) in chooseUs" :key="index">
                        <div class="overflow-hidden">
                            <img :src="item.image"
                                class="w-full duration-200 group-hover:rotate-2 group-hover:scale-110" alt="" />
                        </div>
                        <div
                            class="relative mx-4 -mt-10 space-y-2.5 bg-gray-dark px-4 pt-[22px] text-center dark:bg-black md:px-[26px]">
                            <h5 class="text-2xl font-bold text-primary group-hover:text-secondary">
                                {{ item.title }}
                            </h5>
                            <div class="mx-auto h-1 w-[50px] bg-secondary duration-200 group-hover:bg-primary"></div>
                            <p class="pb-[60px] text-lg font-semibold">
                                {{ item.desc }}
                            </p>
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
                        Dengan pengalaman lebih dari 10 tahun dan ribuan pelanggan puas, kami
                        menjadi mitra terpercaya dalam memenuhi kebutuhan anda.
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
                            :options="{ suffix: ' lebih' }"></count-up>
                        <p class="mt-2.5 font-bold">Pelanggan Puas</p>
                    </div>
                    <div
                        class="border border-transparent bg-gray/20 py-10 px-5 text-center duration-200 hover:border-secondary sm:py-[52px]">
                        <count-up class="text-[34px] font-black text-white" :startVal="0" :end-val="10" :duration="3"
                            :options="{ suffix: ' Tahun' }"></count-up>
                        <p class="mt-2.5 font-bold">Pengalaman</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div></template>
