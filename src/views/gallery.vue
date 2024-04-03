<template>
    <div>
        <div
            class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
            <div class="relative">
                <div class="container">
                    <div class="items-center justify-between py-10 md:flex md:h-[400px] md:py-0">
                        <div class="heading relative mb-0 text-center ltr:md:text-left rtl:md:text-right">
                            <h4 class="!text-white">Gallery</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="bg-gradient-to-t from-white/[54%] to-transparent py-14 dark:bg-none lg:py-[100px]">
            <div class="container">
                <div class="heading text-center">
                    <h6>Emphasizes the importance of accurate appraisals</h6>
                    <h4>Valuing What Matters</h4>
                </div>
                <div class="grid gap-4 md:gap-6">
                    <div class="flex flex-col gap-4 sm:flex-row md:gap-6">
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 0;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-1.jpg"
                                alt="gallery-1"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 1;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-2.jpg"
                                alt="gallery-2"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 2;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-3.jpg"
                                alt="gallery-3"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 sm:flex-row md:gap-6">
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 3;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-4.jpg"
                                alt="gallery-1"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 4;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-5.jpg"
                                alt="gallery-2"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 5;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-6.jpg"
                                alt="gallery-3"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 sm:flex-row md:gap-6">
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 6;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-7.jpg"
                                alt="gallery-1"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 7;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-8.jpg"
                                alt="gallery-2"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 8;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-9.jpg"
                                alt="gallery-3"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 sm:flex-row md:gap-6">
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 9;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-10.jpg"
                                alt="gallery-1"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 10;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-11.png"
                                alt="gallery-2"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[33%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 11;
                            "
                        >
                            <img
                                src="/assets/images/galeri/galeri-12.png"
                                alt="gallery-3"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:scale-125"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <vue-easy-lightbox
                :visible="visible"
                :imgs="items"
                :index="index"
                moveDisabled
                loop
                @hide="
                    index = null;
                    visible = false;
                "
            ></vue-easy-lightbox>
        </section>

    </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    import VueEasyLightbox from 'vue-easy-lightbox';

    import { useAppStore } from '@/stores/index';
    const store = useAppStore();

    const visible = ref(false);
    const index: any = ref(null);
    const items = ref([
        { src: '/assets/images/galeri/galeri-1.jpg' },
        { src: '/assets/images/galeri/galeri-2.jpg' },
        { src: '/assets/images/galeri/galeri-3.jpg' },
        { src: '/assets/images/galeri/galeri-4.jpg' },
        { src: '/assets/images/galeri/galeri-5.jpg' },
        { src: '/assets/images/galeri/galeri-6.jpg' },
        { src: '/assets/images/galeri/galeri-7.jpg' },
        { src: '/assets/images/galeri/galeri-8.jpg' },
        { src: '/assets/images/galeri/galeri-9.jpg' },
        { src: '/assets/images/galeri/galeri-10.jpg' },
        { src: '/assets/images/galeri/galeri-11.png' },
        { src: '/assets/images/galeri/galeri-12.png' },
    ]);
    const activeTab = ref('all');
</script>
