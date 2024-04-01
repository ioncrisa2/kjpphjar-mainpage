<script setup lang="ts">
import { useAppStore } from '@/stores/index';
const store = useAppStore();

interface Mission {
    id: string;
    text: string;
}

interface Leader {
    id:number,
    image:string,
    name:string,
    position:string
}

const missions : Array<Mission> = [
    {id:'01',text:'Menciptakan Brand Image dan Brand Loyalty bagi pengguna jasa.'},
    {id:'02',text:'Peningkatan Profesionalisme Personil.'},
    {id:'03',text:'Menjalankan Sistem Pengendalian Mutu, KEPI, SPI dan Peraturan lainnya dengan tertib.'},
    {id:'04',text:'Perencanaan, Pengorganisasi Pelaksanaan dan Pengawasan Terintegrasi Dengan Baik.'}
];

const leaders : Array<Leader> = [
    {
        id:1,
        image:'/assets/images/pimpinan/leader.png',
        name:'Dr. Henricus Judi Adrianto S.E., M.Ec.Dev., M.H., MAPPI(Cert.)',
        position:'Pimpinan Rekan'
    },
    {
        id:2,
        image:'/assets/images/pimpinan/cabang-surabaya.png',
        name:'Marsel Sabahtani Pah S.E.',
        position:'Pimpinan Cabang Surabaya'
    },
    {
        id:3,
        image:'/assets/images/pimpinan/cabang-banjarmasin.png',
        name:'Wasis Harjirianto S.Pd.',
        position:'Pimpinan Cabang Balikpapan'
    },
];
</script>

<template>
    <div>
        <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
            <div class="relative">
                <div class="container">
                    <div class="items-center justify-between py-10 md:flex md:h-[400px] md:py-0">
                        <div class="heading relative mb-0 text-center ltr:md:text-left rtl:md:text-right">
                            <h6 class="!text-white">About Us</h6>
                            <h4 class="!text-white">KJPP Henricus Judi Adrianto dan Rekan</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="flex items-center bg-stone-100 xl:h-screen font-poppins dark:bg-gray-800">
            <div class="justify-center flex-1 max-w-6xl mx-auto lg:py-1 lg:px-0 md:px-6 ">
                <div class="flex flex-wrap ">
                    <div class="w-full px-4 mb-10 lg:w-1/2 lg:mb-0">
                        <h2 class="mt-2 mb-6 text-2xl font-bold dark:text-gray-300">
                            Siapa <span class="text-primary">kami?</span>
                        </h2>
                        <h2 class="mt-2 mb-6 text-2xl font-bold dark:text-gray-300">
                            Kami merupakan perusahaan Jasa Penilai Publik yang berdiri dengan tujuan untuk memberikan jasa
                            layanan konsultasi penilaian publik
                        </h2>
                        <p class="mb-10 text-gray-600 dark:text-gray-400 ">
                            KJPP Henricus Judi Adrianto dan Rekan berdiri pada 28 November 2013.
                            Perusahaan kami berdiri berdasarkan Akta Notaris (Terdahulu) Linda Aprianti No. 114 Tanggal 31
                            Oktober 2013 dan
                            Akta Notaris (Perubahan Terbaru) Linta Aprianti No.01 Tanggal 3 Agustus 2019
                        </p>
                    </div>
                    <div class="w-full px-4 mb-10 lg:w-1/2">
                        <div class="relative">
                            <img src="/assets/images/aboutbg.png" alt="aboutimage"
                                class="relative z-10 object-cover w-full h-full rounded">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="relative py-14 lg:py-[100px] xl:-mt-[100px]">
            <div class="container relative">
                <div class="lg:w-full">
                    <div class="heading text-center ltr:lg:text-left rtl:lg:text-right">
                        <h6 class="!text-black !text-lg font-bold">Visi Kami </h6>
                        <h4>Menjadi Perusahaan Penilai yang terpercaya dan lebih baik di Indonesia.</h4>
                    </div>
                    <p class="pb-3 text-center text-lg font-semibold leading-[30px] ltr:lg:text-left rtl:lg:text-right">
                        Misi kami sebagai Perusahaan Penilai :
                    </p>
                </div>
                <div class="grid gap-[30px] xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" >
                    <div data-aos="fade-up" data-aos-duration="1000" v-for="mission in missions" :key="mission.id">
                        <div
                            class="flex items-center gap-[10px] rounded-[10px] border border-transparent bg-secondary/10 py-6 px-5 transition hover:border-secondary hover:bg-transparent">
                            <span class="flex h-[50px] w-[50px] min-w-[50px] items-center justify-center rounded-full bg-secondary text-lg text-white">
                                {{ mission.id }}
                            </span>
                            <div>
                                <p class="text-sm font-semibold text-black dark:text-gray">
                                    {{ mission.text }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- <section class="bg-gradient-to-t from-white/[56%] to-white/0 py-14 dark:!bg-none lg:py-[100px]">
            <counter></counter>
        </section> -->

        <section class="py-14 lg:py-[100px]">
            <div class="container">
                <div class="heading text-center">
                    <h6>Meet Our Leader</h6>
                    <h4>KJPP Henricus Judi Adrianto dan Rekan</h4>
                </div>
                <div class="grid gap-4 xs:grid-cols-2 xm:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    <div class="group cursor-pointer text-center" v-for="leader in leaders" :key="leader.id">
                        <div
                            class="relative h-[280px] rounded-3xl transition-all duration-500 group-hover:shadow-[0_0_25px_#979797]">
                            <img :src="leader.image" alt="team-member-1"
                                class="h-full w-full rounded-3xl object-cover object-top" />
                        </div>
                        <h4
                            class="pt-5 pb-2 text-xl font-extrabold text-black transition duration-500 group-hover:text-secondary dark:text-white">
                            {{ leader.name }}
                        </h4>
                        <h6 class="text-sm font-bold">{{ leader.position }}</h6>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>
