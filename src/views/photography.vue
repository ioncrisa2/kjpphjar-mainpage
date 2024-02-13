<template>
    <div>
        <div class="relative bg-black py-28 lg:py-44 xl:py-56">
            <img src="/assets/images/photography/banner-img.jpg" alt="" class="absolute inset-0 h-full w-full object-cover rtl:rotate-y-180" />
            <div class="container relative z-[1]">
                <div class="max-w-[400px] space-y-5 text-white lg:max-w-[560px]">
                    <p class="text-xl">Hello, I'm John.</p>
                    <h2 class="text-4xl font-extrabold uppercase lg:text-6xl">Designed for <br /><span class="text-secondary">Photographers</span></h2>
                    <p class="font-semibold lg:text-lg">
                        Creating a professional website with features such as events and proofing galleries, Theme can provide you those features without the
                        need to use any coding.
                    </p>
                    <router-link
                        to="about-us"
                        class="inline-flex rounded-lg bg-white px-8 py-5 text-sm font-extrabold uppercase text-black hover:bg-primary hover:text-white"
                        >Purchase</router-link
                    >
                </div>
            </div>
        </div>

        <section class="py-14 lg:py-[100px]" data-aos="fade-up" data-aos-duration="1000">
            <div class="container">
                <div class="mb-8 text-center lg:mb-[50px]">
                    <h6 class="mb-2 text-2xl font-black uppercase text-black dark:text-white md:text-3xl lg:text-[40px] lg:leading-[60px]">
                        Latest
                        <span class="text-primary">Works</span>
                    </h6>
                    <p class="lg:text-lg">Browse my most recent projects below and enjoy my handmade work with love for every detail.</p>
                </div>
                <div class="mb-7 overflow-x-auto pb-3 lg:mb-10">
                    <ul class="filters photography-filter flex gap-5 whitespace-nowrap font-bold md:justify-center lg:gap-10">
                        <li class="filter" :class="{ active: activeTab === 'all' }">
                            <button type="button" class="px-5 py-4" @click="activeTab = 'all'">All</button>
                        </li>
                        <li class="filter" :class="{ active: activeTab === 'studio' }">
                            <button type="button" class="px-5 py-4" @click="activeTab = 'studio'">Studio</button>
                        </li>
                        <li class="filter" :class="{ active: activeTab === 'wedding' }">
                            <button type="button" class="px-5 py-4" @click="activeTab = 'wedding'">Wedding</button>
                        </li>
                        <li class="filter" :class="{ active: activeTab === 'travel-wedding' }">
                            <button type="button" class="px-5 py-4" @click="activeTab = 'travel-wedding'">Travel wedding</button>
                        </li>
                        <li class="filter" :class="{ active: activeTab === 'events' }">
                            <button type="button" class="px-5 py-4" @click="activeTab = 'events'">Events</button>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="projects grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div class="project" :class="activeTab === 'all' || activeTab === 'studio' ? 'block' : 'hidden'">
                    <div class="group relative h-72 w-full cursor-pointer overflow-hidden bg-white xl:h-[450px]">
                        <img src="/assets/images/photography/img1.jpg" alt="project-1" class="h-full w-full object-cover" />
                        <div
                            class="absolute inset-0 m-auto flex scale-0 items-center justify-center bg-black/60 text-white transition duration-700 group-hover:scale-100"
                        >
                            <a
                                href="javascript:"
                                class="flex h-[60px] w-[60px] items-center justify-center border border-white text-white"
                                @click="
                                    visible = true;
                                    index = 0;
                                "
                            >
                                <svg class="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 6.66663V25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M6.66667 16H25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="project" :class="activeTab === 'all' || activeTab === 'wedding' ? 'block' : 'hidden'">
                    <div class="group relative h-72 w-full cursor-pointer overflow-hidden bg-white xl:h-[450px]">
                        <img src="/assets/images/photography/img2.jpg" alt="project-1" class="h-full w-full object-cover" />
                        <div
                            class="absolute inset-0 m-auto flex scale-0 items-center justify-center bg-black/60 text-white transition duration-700 group-hover:scale-100"
                        >
                            <a
                                href="javascript:"
                                data-fancybox="gallery"
                                class="flex h-[60px] w-[60px] items-center justify-center border border-white text-white"
                                @click="
                                    visible = true;
                                    index = 1;
                                "
                            >
                                <svg class="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 6.66663V25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M6.66667 16H25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="project" :class="activeTab === 'all' || activeTab === 'travel-wedding' ? 'block' : 'hidden'">
                    <div class="group relative h-72 w-full cursor-pointer overflow-hidden bg-white xl:h-[450px]">
                        <img src="/assets/images/photography/img3.jpg" alt="project-1" class="h-full w-full object-cover" />
                        <div
                            class="absolute inset-0 m-auto flex scale-0 items-center justify-center bg-black/60 text-white transition duration-700 group-hover:scale-100"
                        >
                            <a
                                href="javascript:"
                                data-fancybox="gallery"
                                class="flex h-[60px] w-[60px] items-center justify-center border border-white text-white"
                                @click="
                                    visible = true;
                                    index = 2;
                                "
                            >
                                <svg class="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 6.66663V25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M6.66667 16H25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="project" :class="activeTab === 'all' || activeTab === 'events' ? 'block' : 'hidden'">
                    <div class="group relative h-72 w-full cursor-pointer overflow-hidden bg-white xl:h-[450px]">
                        <img src="/assets/images/photography/img4.jpg" alt="project-1" class="h-full w-full object-cover" />
                        <div
                            class="absolute inset-0 m-auto flex scale-0 items-center justify-center bg-black/60 text-white transition duration-700 group-hover:scale-100"
                        >
                            <a
                                href="javascript:"
                                data-fancybox="gallery"
                                class="flex h-[60px] w-[60px] items-center justify-center border border-white text-white"
                                @click="
                                    visible = true;
                                    index = 3;
                                "
                            >
                                <svg class="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 6.66663V25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M6.66667 16H25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="project" :class="activeTab === 'all' || activeTab === 'studio' ? 'block' : 'hidden'">
                    <div class="group relative h-72 w-full cursor-pointer overflow-hidden bg-white xl:h-[450px]">
                        <img src="/assets/images/photography/img5.jpg" alt="project-1" class="h-full w-full object-cover" />
                        <div
                            class="absolute inset-0 m-auto flex scale-0 items-center justify-center bg-black/60 text-white transition duration-700 group-hover:scale-100"
                        >
                            <a
                                href="javascript:"
                                data-fancybox="gallery"
                                class="flex h-[60px] w-[60px] items-center justify-center border border-white text-white"
                                @click="
                                    visible = true;
                                    index = 4;
                                "
                            >
                                <svg class="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 6.66663V25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M6.66667 16H25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="project" :class="activeTab === 'all' || activeTab === 'wedding' ? 'block' : 'hidden'">
                    <div class="group relative h-72 w-full cursor-pointer overflow-hidden bg-white xl:h-[450px]">
                        <img src="/assets/images/photography/img6.jpg" alt="project-1" class="h-full w-full object-cover" />
                        <div
                            class="absolute inset-0 m-auto flex scale-0 items-center justify-center bg-black/60 text-white transition duration-700 group-hover:scale-100"
                        >
                            <a
                                href="javascript:"
                                data-fancybox="gallery"
                                class="flex h-[60px] w-[60px] items-center justify-center border border-white text-white"
                                @click="
                                    visible = true;
                                    index = 5;
                                "
                            >
                                <svg class="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 6.66663V25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M6.66667 16H25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="project" :class="activeTab === 'all' || activeTab === 'travel-wedding' ? 'block' : 'hidden'">
                    <div class="group relative h-72 w-full cursor-pointer overflow-hidden bg-white xl:h-[450px]">
                        <img src="/assets/images/photography/img7.jpg" alt="project-1" class="h-full w-full object-cover" />
                        <div
                            class="absolute inset-0 m-auto flex scale-0 items-center justify-center bg-black/60 text-white transition duration-700 group-hover:scale-100"
                        >
                            <a
                                href="javascript:"
                                data-fancybox="gallery"
                                class="flex h-[60px] w-[60px] items-center justify-center border border-white text-white"
                                @click="
                                    visible = true;
                                    index = 6;
                                "
                            >
                                <svg class="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 6.66663V25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M6.66667 16H25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="project" :class="activeTab === 'all' || activeTab === 'events' ? 'block' : 'hidden'">
                    <div class="group relative h-72 w-full cursor-pointer overflow-hidden bg-white xl:h-[450px]">
                        <img src="/assets/images/photography/img8.jpg" alt="project-1" class="h-full w-full object-cover" />
                        <div
                            class="absolute inset-0 m-auto flex scale-0 items-center justify-center bg-black/60 text-white transition duration-700 group-hover:scale-100"
                        >
                            <a
                                href="javascript:"
                                data-fancybox="gallery"
                                class="flex h-[60px] w-[60px] items-center justify-center border border-white text-white"
                                @click="
                                    visible = true;
                                    index = 7;
                                "
                            >
                                <svg class="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 6.66663V25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M6.66667 16H25.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
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
        <section class="bg-black bg-[url(/assets/images/photography/our_bg.png)] bg-cover bg-center bg-no-repeat py-14 lg:py-[100px]">
            <div class="container">
                <div class="text-center" data-aos="zoom-in" data-aos-duration="1000">
                    <h3 class="mb-5 text-3xl font-extrabold uppercase text-secondary">OUR PHILOSOPHY</h3>

                    <p class="mb-7 font-semibold text-white lg:mb-11 lg:text-xl">
                        We are fine-art, wedding & portrait film photographers from Oregon, with a special love for natural light,medium format film cameras &
                        redheads with freckles. With over 5 years of experience, numerous workshops and features in top wedding publications, I capture beauty
                        in the most subtle.
                    </p>

                    <a href="javascript:" class="inline-flex rounded-lg bg-primary px-8 py-5 text-sm font-extrabold uppercase text-white hover:bg-secondary"
                        >Purchase</a
                    >
                </div>
            </div>
        </section>

        <section class="relative overflow-hidden py-14 lg:py-[100px]">
            <img src="/assets/images/photography/img.png" alt="" class="absolute -top-5 left-0 max-w-[80px] md:max-w-[150px] xl:max-w-none" />
            <img src="/assets/images/photography/img.png" alt="" class="absolute -top-5 right-0 max-w-[80px] rotate-90 md:max-w-[150px] xl:max-w-none" />
            <div class="container relative z-[1]" data-aos="fade-up" data-aos-duration="1000">
                <div class="mb-[50px] text-center">
                    <h6 class="mb-2 text-2xl font-black uppercase text-black dark:text-white md:text-3xl lg:text-[40px] lg:leading-[60px]">
                        EXQUISITE <span class="text-primary">ELEGANCE</span>
                    </h6>
                    <p class="lg:text-lg">Engagements, Weddings, Elopments</p>
                </div>

                <div class="grid gap-4 md:grid-cols-3 lg:gap-7">
                    <div class="md:col-span-2">
                        <div class="mb-4 grid gap-4 sm:grid-cols-2 lg:mb-7 lg:gap-7">
                            <div class="group relative h-60 overflow-hidden lg:h-[350px]">
                                <img
                                    src="/assets/images/photography/photo1.jpg"
                                    alt=""
                                    class="h-full w-full scale-100 object-cover duration-300 group-hover:scale-110"
                                />
                                <a
                                    href="javascript:"
                                    class="absolute bottom-0 left-0 inline-flex bg-white px-6 py-3.5 font-semibold leading-none text-black duration-300 group-hover:bg-secondary group-hover:text-white lg:text-xl"
                                    >Outdoor</a
                                >
                            </div>
                            <div class="group relative h-60 overflow-hidden lg:h-[350px]">
                                <img
                                    src="/assets/images/photography/photo2.jpg"
                                    alt=""
                                    class="h-full w-full scale-100 object-cover duration-300 group-hover:scale-110"
                                />
                                <a
                                    href="javascript:"
                                    class="absolute bottom-0 left-0 inline-flex bg-white px-6 py-3.5 font-semibold leading-none text-black duration-300 group-hover:bg-secondary group-hover:text-white lg:text-xl"
                                    >Indoor</a
                                >
                            </div>
                        </div>
                        <div class="group relative h-60 overflow-hidden lg:h-[350px]">
                            <img
                                src="/assets/images/photography/photo3.jpg"
                                alt=""
                                class="h-full w-full scale-100 object-cover duration-300 group-hover:scale-110"
                            />
                            <a
                                href="javascript:"
                                class="absolute bottom-0 left-0 inline-flex bg-white px-6 py-3.5 font-semibold leading-none text-black duration-300 group-hover:bg-secondary group-hover:text-white lg:text-xl"
                                >Travel wedding</a
                            >
                        </div>
                    </div>
                    <div class="group relative h-[496px] overflow-hidden lg:h-[730px]">
                        <img
                            src="/assets/images/photography/photo4.jpg"
                            alt=""
                            class="h-full w-full scale-100 object-cover duration-300 group-hover:scale-110"
                        />
                        <a
                            href="javascript:"
                            class="absolute bottom-0 left-0 inline-flex bg-white px-6 py-3.5 font-semibold leading-none text-black duration-300 group-hover:bg-secondary group-hover:text-white lg:text-xl"
                            >Destination</a
                        >
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-black py-14 dark:bg-gray-dark lg:py-[100px]">
            <div class="container">
                <div class="relative">
                    <div class="flex flex-col items-center justify-between gap-[73px] lg:flex-row">
                        <div data-aos="fade-right" data-aos-duration="1000">
                            <div class="heading mb-0 text-center ltr:lg:text-left rtl:lg:text-right">
                                <h4 class="!font-black uppercase !text-white">What <span class="text-primary">our customers &nbsp;</span>are saying us?</h4>
                            </div>
                            <p class="mt-2.5 text-center text-lg font-medium ltr:lg:text-left rtl:lg:text-right">
                                lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius tortor nibh.
                            </p>
                            <div class="mt-7 flex justify-center gap-16 lg:justify-start">
                                <div>
                                    <h2 class="text-3xl font-black text-white">13M <span class="text-secondary">+</span></h2>
                                    <p class="mt-1 text-sm font-bold">happy people</p>
                                </div>
                                <div>
                                    <h2 class="text-3xl font-black text-white">4.88</h2>
                                    <p class="mt-1 text-sm font-bold">overall rating</p>
                                    <span class="mt-5">
                                        <svg width="85" height="12" viewBox="0 0 85 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M4.7919 2.04503C5.55189 0.681675 5.93188 0 6.5 0C7.06812 0 7.44811 0.681675 8.2081 2.04502L8.40472 2.39774C8.62069 2.78516 8.72867 2.97887 8.89703 3.10668C9.0654 3.2345 9.27509 3.28194 9.69447 3.37683L10.0763 3.46322C11.5521 3.79713 12.29 3.96409 12.4655 4.52864C12.6411 5.09319 12.1381 5.68144 11.1319 6.85795L10.8716 7.16233C10.5857 7.49666 10.4428 7.66383 10.3785 7.87063C10.3142 8.07743 10.3358 8.30047 10.379 8.74653L10.4184 9.15264C10.5705 10.7224 10.6465 11.5072 10.1869 11.8561C9.72729 12.205 9.0364 11.8869 7.6546 11.2507L7.29711 11.0861C6.90445 10.9053 6.70811 10.8149 6.5 10.8149C6.29189 10.8149 6.09556 10.9053 5.70289 11.0861L5.3454 11.2507C3.96361 11.8869 3.27271 12.205 2.81309 11.8561C2.35347 11.5072 2.42953 10.7224 2.58164 9.15264L2.62099 8.74653C2.66422 8.30047 2.68583 8.07743 2.62152 7.87063C2.55721 7.66383 2.41426 7.49666 2.12835 7.16233L1.86806 6.85796C0.861949 5.68144 0.358895 5.09319 0.534453 4.52864C0.71001 3.96409 1.44791 3.79713 2.92372 3.46322L3.30553 3.37683C3.72491 3.28194 3.9346 3.2345 4.10297 3.10668C4.27133 2.97887 4.37932 2.78516 4.59528 2.39774L4.7919 2.04503Z"
                                                fill="#F1A501"
                                            />
                                            <path
                                                d="M22.7919 2.04503C23.5519 0.681675 23.9319 0 24.5 0C25.0681 0 25.4481 0.681675 26.2081 2.04502L26.4047 2.39774C26.6207 2.78516 26.7287 2.97887 26.897 3.10668C27.0654 3.2345 27.2751 3.28194 27.6945 3.37683L28.0763 3.46322C29.5521 3.79713 30.29 3.96409 30.4655 4.52864C30.6411 5.09319 30.1381 5.68144 29.1319 6.85795L28.8716 7.16233C28.5857 7.49666 28.4428 7.66383 28.3785 7.87063C28.3142 8.07743 28.3358 8.30047 28.379 8.74653L28.4184 9.15264C28.5705 10.7224 28.6465 11.5072 28.1869 11.8561C27.7273 12.205 27.0364 11.8869 25.6546 11.2507L25.2971 11.0861C24.9044 10.9053 24.7081 10.8149 24.5 10.8149C24.2919 10.8149 24.0956 10.9053 23.7029 11.0861L23.3454 11.2507C21.9636 11.8869 21.2727 12.205 20.8131 11.8561C20.3535 11.5072 20.4295 10.7224 20.5816 9.15264L20.621 8.74653C20.6642 8.30047 20.6858 8.07743 20.6215 7.87063C20.5572 7.66383 20.4143 7.49666 20.1284 7.16233L19.8681 6.85796C18.8619 5.68144 18.3589 5.09319 18.5345 4.52864C18.71 3.96409 19.4479 3.79713 20.9237 3.46322L21.3055 3.37683C21.7249 3.28194 21.9346 3.2345 22.103 3.10668C22.2713 2.97887 22.3793 2.78516 22.5953 2.39774L22.7919 2.04503Z"
                                                fill="#F1A501"
                                            />
                                            <path
                                                d="M40.7919 2.04503C41.5519 0.681675 41.9319 0 42.5 0C43.0681 0 43.4481 0.681675 44.2081 2.04502L44.4047 2.39774C44.6207 2.78516 44.7287 2.97887 44.897 3.10668C45.0654 3.2345 45.2751 3.28194 45.6945 3.37683L46.0763 3.46322C47.5521 3.79713 48.29 3.96409 48.4655 4.52864C48.6411 5.09319 48.1381 5.68144 47.1319 6.85795L46.8716 7.16233C46.5857 7.49666 46.4428 7.66383 46.3785 7.87063C46.3142 8.07743 46.3358 8.30047 46.379 8.74653L46.4184 9.15264C46.5705 10.7224 46.6465 11.5072 46.1869 11.8561C45.7273 12.205 45.0364 11.8869 43.6546 11.2507L43.2971 11.0861C42.9044 10.9053 42.7081 10.8149 42.5 10.8149C42.2919 10.8149 42.0956 10.9053 41.7029 11.0861L41.3454 11.2507C39.9636 11.8869 39.2727 12.205 38.8131 11.8561C38.3535 11.5072 38.4295 10.7224 38.5816 9.15264L38.621 8.74653C38.6642 8.30047 38.6858 8.07743 38.6215 7.87063C38.5572 7.66383 38.4143 7.49666 38.1284 7.16233L37.8681 6.85796C36.8619 5.68144 36.3589 5.09319 36.5345 4.52864C36.71 3.96409 37.4479 3.79713 38.9237 3.46322L39.3055 3.37683C39.7249 3.28194 39.9346 3.2345 40.103 3.10668C40.2713 2.97887 40.3793 2.78516 40.5953 2.39774L40.7919 2.04503Z"
                                                fill="#F1A501"
                                            />
                                            <path
                                                d="M58.7919 2.04503C59.5519 0.681675 59.9319 0 60.5 0C61.0681 0 61.4481 0.681675 62.2081 2.04502L62.4047 2.39774C62.6207 2.78516 62.7287 2.97887 62.897 3.10668C63.0654 3.2345 63.2751 3.28194 63.6945 3.37683L64.0763 3.46322C65.5521 3.79713 66.29 3.96409 66.4655 4.52864C66.6411 5.09319 66.1381 5.68144 65.1319 6.85795L64.8716 7.16233C64.5857 7.49666 64.4428 7.66383 64.3785 7.87063C64.3142 8.07743 64.3358 8.30047 64.379 8.74653L64.4184 9.15264C64.5705 10.7224 64.6465 11.5072 64.1869 11.8561C63.7273 12.205 63.0364 11.8869 61.6546 11.2507L61.2971 11.0861C60.9044 10.9053 60.7081 10.8149 60.5 10.8149C60.2919 10.8149 60.0956 10.9053 59.7029 11.0861L59.3454 11.2507C57.9636 11.8869 57.2727 12.205 56.8131 11.8561C56.3535 11.5072 56.4295 10.7224 56.5816 9.15264L56.621 8.74653C56.6642 8.30047 56.6858 8.07743 56.6215 7.87063C56.5572 7.66383 56.4143 7.49666 56.1284 7.16233L55.8681 6.85796C54.8619 5.68144 54.3589 5.09319 54.5345 4.52864C54.71 3.96409 55.4479 3.79713 56.9237 3.46322L57.3055 3.37683C57.7249 3.28194 57.9346 3.2345 58.103 3.10668C58.2713 2.97887 58.3793 2.78516 58.5953 2.39774L58.7919 2.04503Z"
                                                fill="#F1A501"
                                            />
                                            <path
                                                opacity="0.3"
                                                d="M76.7919 2.04503C77.5519 0.681675 77.9319 0 78.5 0C79.0681 0 79.4481 0.681675 80.2081 2.04502L80.4047 2.39774C80.6207 2.78516 80.7287 2.97887 80.897 3.10668C81.0654 3.2345 81.2751 3.28194 81.6945 3.37683L82.0763 3.46322C83.5521 3.79713 84.29 3.96409 84.4655 4.52864C84.6411 5.09319 84.1381 5.68144 83.1319 6.85795L82.8716 7.16233C82.5857 7.49666 82.4428 7.66383 82.3785 7.87063C82.3142 8.07743 82.3358 8.30047 82.379 8.74653L82.4184 9.15264C82.5705 10.7224 82.6465 11.5072 82.1869 11.8561C81.7273 12.205 81.0364 11.8869 79.6546 11.2507L79.2971 11.0861C78.9044 10.9053 78.7081 10.8149 78.5 10.8149C78.2919 10.8149 78.0956 10.9053 77.7029 11.0861L77.3454 11.2507C75.9636 11.8869 75.2727 12.205 74.8131 11.8561C74.3535 11.5072 74.4295 10.7224 74.5816 9.15264L74.621 8.74653C74.6642 8.30047 74.6858 8.07743 74.6215 7.87063C74.5572 7.66383 74.4143 7.49666 74.1284 7.16233L73.8681 6.85796C72.8619 5.68144 72.3589 5.09319 72.5345 4.52864C72.71 3.96409 73.4479 3.79713 74.9237 3.46322L75.3055 3.37683C75.7249 3.28194 75.9346 3.2345 76.103 3.10668C76.2713 2.97887 76.3793 2.78516 76.5953 2.39774L76.7919 2.04503Z"
                                                fill="#7780A1"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            class="relative mx-auto w-full max-w-[445px] rounded-[10px] bg-gray-dark drop-shadow-[6px_6px_0px_rgba(119,128,161,0.3)] dark:bg-black"
                            data-aos="zoom-left"
                            data-aos-duration="1000"
                        >
                            <swiper
                                :loop="true"
                                slidesPerView="auto"
                                :spaceBetween="30"
                                :speed="1000"
                                :autoplay="{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }"
                                :navigation="{
                                    nextEl: '.feedback-slider-button-next',
                                    prevEl: '.feedback-slider-button-prev',
                                }"
                                :modules="[Navigation, Autoplay]"
                                :dir="store.direction === 'rtl' ? 'rtl' : 'ltr'"
                                :key="store.direction === 'rtl' ? 'true' : 'false'"
                            >
                                <swiper-slide>
                                    <div class="flex justify-between gap-7 p-7">
                                        <div class="flex items-center gap-2.5">
                                            <div
                                                class="flex h-14 w-14 items-end justify-center overflow-hidden rounded-full border border-[rgba(125,132,150,0.2)] bg-gradient-to-t from-[rgba(125,132,150,0.1)] to-[125,132,150] px-1 pt-2"
                                            >
                                                <img src="/assets/images/photography/customer-avatar.svg" alt="" />
                                            </div>
                                            <div>
                                                <h5 class="text-lg font-bold text-white">amelia smith</h5>
                                                <p class="text-sm font-bold italic">customer</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="border border-gray/10"></div>
                                    <div class="p-7">
                                        <h3 class="text-lg font-bold italic text-white">new bungalow house</h3>
                                        <p class="mt-4 text-base font-semibold leading-7">
                                            “It is a long established fact that a reader will be distracted by the readable content of a page when looking at
                                            its layout.”
                                        </p>
                                        <div class="text-right">
                                            <p class="mt-7 inline-flex rounded-[10px] bg-[#7780A1]/20 p-2 text-sm font-semibold text-white">
                                                San Diego, California
                                            </p>
                                        </div>
                                    </div>
                                </swiper-slide>
                            </swiper>

                            <div class="absolute top-7 z-10 flex gap-2.5 ltr:right-7 rtl:left-7">
                                <button
                                    type="button"
                                    class="feedback-slider-button-prev flex h-8 w-8 items-center justify-center bg-white/10 text-white duration-200 after:hidden hover:bg-black hover:text-white dark:bg-white/80 dark:hover:bg-secondary"
                                >
                                    <svg width="9" height="18" viewBox="0 0 9 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="rtl:rotate-180">
                                        <path
                                            d="M7 16L1 9L2.5 7.25M7 2L5 4.33333"
                                            stroke="currentcolor"
                                            stroke-width="2"
                                            stroke-linecap="square"
                                            stroke-linejoin="round"
                                        ></path>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    class="feedback-slider-button-next flex h-8 w-8 items-center justify-center bg-white/10 text-white duration-200 after:hidden hover:bg-black hover:text-white dark:bg-white/80 dark:hover:bg-secondary"
                                >
                                    <svg width="9" height="18" viewBox="0 0 9 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="rtl:rotate-180">
                                        <path
                                            d="M2 2L4 4.33333M2 16L8 9L6.5 7.25"
                                            stroke="currentcolor"
                                            stroke-width="2"
                                            stroke-linecap="square"
                                            stroke-linejoin="round"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="overflow-hidden py-14 lg:py-[100px]">
            <div class="container">
                <div class="mb-8 text-center lg:mb-[50px]">
                    <h6 class="mb-2 text-2xl font-black uppercase text-black dark:text-white md:text-3xl lg:text-[40px] lg:leading-[60px]">
                        OUR
                        <span class="text-secondary">TEAM</span>
                    </h6>
                    <p class="lg:text-lg">Browse my most recent projects below and enjoy my handmade work with love for every detail.</p>
                </div>
            </div>
            <div class="our-team px-4 md:-mx-32 md:px-0 lg:-mx-52">
                <swiper
                    :loop="true"
                    :centeredSlides="true"
                    :spaceBetween="30"
                    :breakpoints="{
                        640: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 3,
                        },
                        1024: {
                            slidesPerView: 5,
                        },
                    }"
                    :modules="[Autoplay]"
                    :dir="store.direction === 'rtl' ? 'rtl' : 'ltr'"
                    :key="store.direction === 'rtl' ? 'true' : 'false'"
                >
                    <swiper-slide class="group">
                        <div class="mb-7 h-full w-full overflow-hidden">
                            <img
                                src="/assets/images/photography/slider1.jpg"
                                alt=""
                                class="h-full w-full scale-100 object-cover duration-300 hover:scale-110"
                            />
                        </div>
                        <div class="text-center">
                            <h4 class="mb-4 text-2xl font-bold text-black group-hover:text-primary dark:text-white xl:text-3xl">Jessy Rose</h4>
                            <p>Photographar</p>
                        </div>
                    </swiper-slide>
                    <swiper-slide class="group">
                        <div class="mb-7 h-full w-full overflow-hidden">
                            <img
                                src="/assets/images/photography/slider2.jpg"
                                alt=""
                                class="h-full w-full scale-100 object-cover duration-300 hover:scale-110"
                            />
                        </div>
                        <div class="text-center">
                            <h4 class="mb-4 text-2xl font-bold text-black group-hover:text-primary dark:text-white xl:text-3xl">Mike Farrell</h4>
                            <p>Photographar</p>
                        </div>
                    </swiper-slide>
                    <swiper-slide class="group">
                        <div class="mb-7 h-full w-full overflow-hidden">
                            <img
                                src="/assets/images/photography/slider3.jpg"
                                alt=""
                                class="h-full w-full scale-100 object-cover duration-300 hover:scale-110"
                            />
                        </div>
                        <div class="text-center">
                            <h4 class="mb-4 text-2xl font-bold text-black group-hover:text-primary dark:text-white xl:text-3xl">Blanche Fields</h4>
                            <p>Photographar</p>
                        </div>
                    </swiper-slide>
                    <swiper-slide class="group">
                        <div class="mb-7 h-full w-full overflow-hidden">
                            <img
                                src="/assets/images/photography/slider4.jpg"
                                alt=""
                                class="h-full w-full scale-100 object-cover duration-300 hover:scale-110"
                            />
                        </div>
                        <div class="text-center">
                            <h4 class="mb-4 text-2xl font-bold text-black group-hover:text-primary dark:text-white xl:text-3xl">Mike Farrell</h4>
                            <p>Photographar</p>
                        </div>
                    </swiper-slide>
                    <swiper-slide class="group">
                        <div class="mb-7 h-full w-full overflow-hidden">
                            <img
                                src="/assets/images/photography/slider5.jpg"
                                alt=""
                                class="h-full w-full scale-100 object-cover duration-300 hover:scale-110"
                            />
                        </div>
                        <div class="text-center">
                            <h4 class="mb-4 text-2xl font-bold text-black group-hover:text-primary dark:text-white xl:text-3xl">Camilia Shean</h4>
                            <p>Photographar</p>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </section>

        <section class="bg-black py-14 dark:bg-gray-dark lg:py-[100px]">
            <div class="container">
                <div class="items-center gap-5 md:flex">
                    <div class="mb-10 flex-none space-y-5 md:mb-0 md:max-w-[430px]" data-aos="fade-right" data-aos-duration="1000">
                        <h2 class="text-2xl font-black uppercase text-white md:text-3xl lg:text-[40px]">
                            My Best
                            <span class="text-primary">Snaps</span>
                        </h2>

                        <p class="lg:text-lg">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet hendrerit nisl. Nam eu dolor pellentesque, tincidunt lorem
                            id.
                        </p>

                        <ul class="flex gap-5">
                            <li>
                                <a href="javascript:" class="duration-300 hover:opacity-50"><img src="/assets/images/photography/logo1.svg" alt="" /></a>
                            </li>
                            <li>
                                <a href="javascript:" class="duration-300 hover:opacity-50"><img src="/assets/images/photography/logo2.svg" alt="" /></a>
                            </li>
                            <li>
                                <a href="javascript:" class="duration-300 hover:opacity-50"><img src="/assets/images/photography/logo3.svg" alt="" /></a>
                            </li>
                        </ul>

                        <router-link
                            to="about-us"
                            class="inline-flex rounded-lg bg-secondary px-8 py-5 text-sm font-extrabold uppercase text-white hover:bg-primary"
                            >Explore More</router-link
                        >
                    </div>
                    <swiper
                        :loop="true"
                        slidesPerView="auto"
                        :spaceBetween="30"
                        :speed="1000"
                        :autoplay="{
                            delay: 3000,
                            disableOnInteraction: false,
                        }"
                        :breakpoints="{
                            0: {
                                slidesPerView: 1,
                            },
                            1024: {
                                slidesPerView: 2,
                            },
                        }"
                        :modules="[Autoplay]"
                        :dir="store.direction === 'rtl' ? 'rtl' : 'ltr'"
                        :key="store.direction === 'rtl' ? 'true' : 'false'"
                    >
                        <swiper-slide>
                            <img
                                src="/assets/images/photography/slider6.jpg"
                                alt=""
                                class="h-80 w-full scale-100 object-cover duration-300 hover:scale-110 xl:h-[445px]"
                            />
                        </swiper-slide>
                        <swiper-slide>
                            <img
                                src="/assets/images/photography/slider7.jpg"
                                alt=""
                                class="h-80 w-full scale-100 object-cover duration-300 hover:scale-110 xl:h-[445px]"
                            />
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
        </section>

        <section class="py-14 lg:py-[100px]">
            <div class="container">
                <div class="mb-12 flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                    <div class="flex-none md:w-2/3">
                        <h2 class="mb-2 text-2xl font-black uppercase leading-tight text-black dark:text-white md:text-3xl lg:text-[40px]">
                            BLOG
                            <span class="text-secondary">UPDATED</span>
                        </h2>

                        <p class="text-lg">With over 5 years of experience, numerous workshops and features in top wedding publications.</p>
                    </div>
                    <router-link
                        to="about-us"
                        class="inline-flex shrink whitespace-nowrap rounded-lg bg-primary px-8 py-5 text-sm font-extrabold uppercase text-white hover:bg-secondary"
                        >Read More blog</router-link
                    >
                </div>

                <div class="grid gap-6 md:grid-cols-3">
                    <div class="group overflow-hidden rounded-xl bg-white dark:bg-gray-dark">
                        <a href="javascript:" class="block h-60 overflow-hidden">
                            <img
                                src="/assets/images/photography/blog1.jpg"
                                alt=""
                                class="h-full w-full scale-100 object-cover duration-300 group-hover:scale-110"
                            />
                        </a>
                        <div class="space-y-3.5 p-5">
                            <p class="font-semibold text-secondary">November 28, 2022</p>

                            <h4>
                                <a href="javascript:" class="text-lg font-extrabold text-black hover:text-primary dark:text-white"
                                    >What inside you & what you see in people.</a
                                >
                            </h4>

                            <p>Lorem ipsum dolor amet consectetur adipisicing elit eiusm tempor incididunt...</p>
                        </div>
                    </div>

                    <div class="group overflow-hidden rounded-xl bg-white dark:bg-gray-dark">
                        <a href="javascript:" class="block h-60 overflow-hidden">
                            <img
                                src="/assets/images/photography/blog2.jpg"
                                alt=""
                                class="h-full w-full scale-100 object-cover duration-300 group-hover:scale-110"
                            />
                        </a>
                        <div class="space-y-3.5 p-5">
                            <p class="font-semibold text-secondary">November 28, 2022</p>

                            <h4>
                                <a href="javascript:" class="text-lg font-extrabold text-black hover:text-primary dark:text-white"
                                    >What your friends think about photographers</a
                                >
                            </h4>

                            <p>Lorem ipsum dolor amet consectetur adipisicing elit eiusm tempor incididunt...</p>
                        </div>
                    </div>

                    <div class="group overflow-hidden rounded-xl bg-white dark:bg-gray-dark">
                        <a href="javascript:" class="block h-60 overflow-hidden">
                            <img
                                src="/assets/images/photography/blog3.jpg"
                                alt=""
                                class="h-full w-full scale-100 object-cover duration-300 group-hover:scale-110"
                            />
                        </a>
                        <div class="space-y-3.5 p-5">
                            <p class="font-semibold text-secondary">November 28, 2022</p>

                            <h4><a href="javascript:" class="text-lg font-extrabold text-black hover:text-primary dark:text-white">White dreams</a></h4>

                            <p>Lorem ipsum dolor amet consectetur adipisicing elit eiusm tempor incididunt...</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    import { useAppStore } from '@/stores/index';
    import CountUp from 'vue-countup-v3';
    import VueEasyLightbox from 'vue-easy-lightbox';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Autoplay, Navigation } from 'swiper';
    import 'swiper/css/navigation';
    import 'swiper/css';
    const activeTab = ref('all');
    const visible = ref(false);
    const index: any = ref(null);
    const items = ref([
        { src: '/assets/images/photography/img1.jpg' },
        { src: '/assets/images/photography/img2.jpg' },
        { src: '/assets/images/photography/img3.jpg' },
        { src: '/assets/images/photography/img4.jpg' },
        { src: '/assets/images/photography/img5.jpg' },
        { src: '/assets/images/photography/img6.jpg' },
        { src: '/assets/images/photography/img7.jpg' },
        { src: '/assets/images/photography/img8.jpg' },
    ]);
    const store = useAppStore();
</script>
