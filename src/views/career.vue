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
                    <h6>Our Culture</h6>
                    <h4>Be Great. Do Good. Have Fun.</h4>
                </div>
                <div class="grid gap-4 md:gap-6">
                    <div class="flex flex-col gap-4 sm:flex-row md:gap-6">
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[43%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 0;
                            "
                        >
                            <img
                                src="/assets/images/gallery-1.png"
                                alt="gallery-1"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:rotate-12 hover:scale-125"
                            />
                        </div>
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[35%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 1;
                            "
                        >
                            <img
                                src="/assets/images/gallery-2.png"
                                alt="gallery-2"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:rotate-12 hover:scale-125"
                            />
                        </div>
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-[22%]"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 2;
                            "
                        >
                            <img
                                src="/assets/images/gallery-3.png"
                                alt="gallery-3"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:rotate-12 hover:scale-125"
                            />
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 sm:flex-row md:gap-6">
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-3/5"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 3;
                            "
                        >
                            <img
                                src="/assets/images/gallery-4.png"
                                alt="gallery-4"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:rotate-12 hover:scale-125"
                            />
                        </div>
                        <div
                            class="mx-auto w-full cursor-pointer overflow-hidden rounded-[32px] sm:w-2/5"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            @click="
                                visible = true;
                                index = 4;
                            "
                        >
                            <img
                                src="/assets/images/gallery-5.png"
                                alt="gallery-5"
                                class="h-full w-full rounded-[32px] object-cover transition duration-500 hover:rotate-12 hover:scale-125"
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
        { src: '/assets/images/gallery-1.png' },
        { src: '/assets/images/gallery-2.png' },
        { src: '/assets/images/gallery-3.png' },
        { src: '/assets/images/gallery-4.png' },
        { src: '/assets/images/gallery-5.png' },
    ]);
    const activeTab = ref('all');
</script>
