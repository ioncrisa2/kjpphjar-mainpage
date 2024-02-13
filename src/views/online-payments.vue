<template>
    <div>
        <div class="relative overflow-hidden bg-black">
            <div class="absolute inset-0 hidden w-[52%] bg-secondary ltr:left-auto rtl:right-auto lg:block"></div>
            <img
                src="/assets/images/online-payments/banner_img.png"
                alt=""
                class="absolute inset-0 hidden h-full w-full object-cover rtl:rotate-y-180 lg:block"
            />
            <div class="container">
                <div class="relative pb-0 pt-20 lg:pb-36 lg:pt-44 xl:pt-48" data-aos="fade-up" data-aos-duration="1000">
                    <div class="relative z-[1] text-center lg:max-w-[710px] ltr:lg:text-left rtl:lg:text-right xl:max-w-[880px]">
                        <h2
                            class="mb-2.5 text-4xl font-extrabold leading-normal text-white sm:text-5xl lg:text-[65px] lg:leading-[80px] xl:text-[80px] xl:leading-[120px]"
                        >
                            Send, Receive, <span class="text-secondary rtl:text-white lg:text-black">Top-Up</span> Your Money Easily
                        </h2>
                        <p class="mb-7 text-lg lg:max-w-[395px]">Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
                        <router-link
                            to="/about-us"
                            class="mb-12 inline-flex items-center justify-center gap-2.5 border-2 border-white/10 bg-[url(/assets/images/online-payments/hero_btn_bg.png)] bg-cover bg-no-repeat px-4 py-2 text-lg font-bold text-white duration-300 hover:border-white"
                        >
                            <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 1L2 9.5H6L1 18.5L13 9H8.5L13 1Z" fill="#FFDF58" stroke="#FDA005" />
                            </svg>
                            Pay more</router-link
                        >

                        <p class="font-semibold text-white">
                            Support Email <br />
                            <a href="mailto:info@support-plurk.com" class="font-bold text-primary hover:text-secondary">info@support-plurk.com</a>
                        </p>
                    </div>
                    <div class="bottom-0 mx-auto w-auto ltr:right-36 rtl:left-36 md:w-[540px] lg:absolute xl:w-[650px]">
                        <img src="/assets/images/online-payments/card-img.png" alt="home-banner-icon" class="rtl:hidden" />
                        <img src="/assets/images/online-payments/dark-card-img.png" alt="home-banner-icon" class="hidden rtl:block" />
                    </div>
                </div>
            </div>
        </div>

        <section class="bg-white bg-[url(/assets/images/online-payments/number_bg.png)] bg-center bg-no-repeat py-10 dark:bg-gray-dark md:py-20">
            <div class="container">
                <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div>
                        <count-up
                            class="mb-2.5 text-2xl font-extrabold text-black dark:text-white md:text-[30px]"
                            :startVal="0"
                            :end-val="300000"
                            :duration="10"
                            :options="{ suffix: '+' }"
                        ></count-up>
                        <p class="font-semibold md:text-xl">Merchants</p>
                    </div>
                    <div>
                        <h2 class="mb-2.5 text-2xl font-extrabold text-black dark:text-white md:text-[30px]">
                            USD
                            <count-up class="inline-flex" :startVal="0" :end-val="40" :duration="10" :options="{ suffix: 'B+' }"></count-up>
                        </h2>
                        <p class="font-semibold md:text-xl">Processed annually</p>
                    </div>
                    <div>
                        <count-up
                            class="mb-2.5 text-2xl font-extrabold text-black dark:text-white md:text-[30px]"
                            :startVal="0"
                            :end-val="200"
                            :duration="10"
                            :options="{ suffix: 'M+' }"
                        ></count-up>
                        <p class="font-semibold md:text-xl">Bank accounts served</p>
                    </div>
                    <div>
                        <count-up
                            class="mb-2.5 text-2xl font-extrabold text-black dark:text-white md:text-[30px]"
                            :startVal="0"
                            :end-val="100"
                            :duration="10"
                            :options="{ suffix: '+' }"
                        ></count-up>
                        <p class="font-semibold md:text-xl">Available countries</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-gradient-to-b from-transparent to-white/50 py-10 dark:to-[rgba(255,255,255,0.02)] md:py-20">
            <div class="container">
                <div class="flex flex-col gap-[30px] md:flex-row">
                    <div class="flex-1" data-aos="fade-right" data-aos-duration="1000">
                        <div class="max-w-[520px]">
                            <h2
                                class="mb-5 inline-flex border-2 border-black bg-white px-5 py-3 font-extrabold uppercase leading-none text-black shadow-[4px_4px_0_#08111F] dark:border-white dark:bg-gray-dark dark:text-white dark:shadow-[4px_4px_0_#fff]"
                            >
                                OUR PRODUCTS
                            </h2>
                            <h3 class="mb-5 text-3xl font-extrabold text-black dark:text-white lg:text-[40px] lg:leading-[60px]">
                                Manage your transactions in one place
                            </h3>
                            <p class="lg:text-lg">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>

                            <div class="my-10 h-0.5 bg-gray/20"></div>

                            <div class="mb-10 max-w-[460px] space-y-10">
                                <div>
                                    <h4 class="mb-2.5 inline-flex items-center gap-2.5 text-lg font-bold text-black dark:text-white">
                                        <img src="/assets/images/online-payments/icon1.svg" alt="" /> Collect payments
                                    </h4>
                                    <p class="text-sm font-semibold">
                                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its
                                        layout.
                                    </p>
                                </div>

                                <div>
                                    <h4 class="mb-2.5 inline-flex items-center gap-2.5 text-lg font-bold text-black dark:text-white">
                                        <img src="/assets/images/online-payments/icon2.svg" alt="" />
                                        Recurring payments
                                    </h4>
                                    <p class="text-sm font-semibold">
                                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
                                    </p>
                                </div>

                                <div>
                                    <h4 class="mb-2.5 inline-flex items-center gap-2.5 text-lg font-bold text-black dark:text-white">
                                        <img src="/assets/images/online-payments/icon3.svg" alt="" />
                                        Make payouts
                                    </h4>
                                    <p class="text-sm font-semibold">
                                        On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the
                                        charms.
                                    </p>
                                </div>

                                <div>
                                    <h4 class="mb-2.5 inline-flex items-center gap-2.5 text-lg font-bold text-black dark:text-white">
                                        <img src="/assets/images/online-payments/icon4.svg" alt="" />
                                        Verify identity
                                    </h4>
                                    <p class="text-sm font-semibold">
                                        If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the
                                        middle of text.
                                    </p>
                                </div>
                            </div>

                            <a
                                href="javascript:"
                                class="mb-5 inline-flex items-center justify-center gap-2.5 border-2 border-black bg-white px-4 py-3 text-sm font-extrabold text-black shadow-[4px_4px_0_#08111F] duration-300 hover:!shadow-none dark:border-white dark:bg-gray-dark dark:text-white dark:shadow-[4px_4px_0_#fff]"
                            >
                                Explore Us
                                <svg class="h-[13px] w-[13px]" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 11L11.0909 1.90906" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="round" />
                                    <path d="M4.61365 1H12V8.38636" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div class="flex-none" data-aos="fade-left" data-aos-duration="1000">
                        <div
                            class="mx-auto max-w-[350px] border border-black shadow-[4px_4px_0_#08111F] dark:border-white dark:shadow-[4px_4px_0_#fff] xl:max-w-[445px]"
                        >
                            <img src="/assets/images/online-payments/phone-img.png" alt="" class="dark:hidden" />
                            <img src="/assets/images/online-payments/dark-phone-img.png" alt="" class="hidden dark:block" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-10 md:py-20">
            <div class="container">
                <div class="mx-auto mb-10 w-full max-w-[610px] space-y-5 text-center" data-aos="fade-down" data-aos-duration="1000">
                    <h2
                        class="mb-5 inline-flex border-2 border-black bg-white px-5 py-3 font-extrabold uppercase leading-none text-black shadow-[4px_4px_0_#08111F] dark:border-white dark:bg-gray-dark dark:text-white dark:shadow-[4px_4px_0_#fff]"
                    >
                        How it works?
                    </h2>
                    <h3 class="text-3xl font-extrabold text-black dark:text-white lg:text-[40px] lg:leading-[60px]">Just few steps to start</h3>
                    <p class="lg:text-lg">All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.</p>
                </div>
                <div class="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
                    <div class="grid grid-cols-1 gap-5 text-center" data-aos="fade-right" data-aos-duration="1000">
                        <div class="mx-auto grid h-20 w-20 place-content-center">
                            <img src="/assets/images/online-payments/work-icon1.svg" alt="" />
                        </div>
                        <div class="space-y-2.5">
                            <h2 class="text-lg font-bold text-black dark:text-white">Register for free</h2>
                            <p>Simply sign up online for free and verify your identity</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-5 text-center" data-aos="fade-right" data-aos-duration="1000">
                        <div class="mx-auto grid h-20 w-20 place-content-center">
                            <img src="/assets/images/online-payments/work-icon2.svg" alt="" />
                        </div>
                        <div class="space-y-2.5">
                            <h2 class="text-lg font-bold text-black dark:text-white">Set up your transfer</h2>
                            <p>Simply sign up online for free and verify your identity</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-5 text-center" data-aos="fade-left" data-aos-duration="1000">
                        <div class="mx-auto grid h-20 w-20 place-content-center">
                            <img src="/assets/images/online-payments/work-icon3.svg" alt="" />
                        </div>
                        <div class="space-y-2.5">
                            <h2 class="text-lg font-bold text-black dark:text-white">Make your payment</h2>
                            <p>Simply sign up online for free and verify your identity</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-5 text-center" data-aos="fade-left" data-aos-duration="1000">
                        <div class="mx-auto grid h-20 w-20 place-content-center">
                            <img src="/assets/images/online-payments/work-icon4.svg" alt="" />
                        </div>
                        <div class="space-y-2.5">
                            <h2 class="text-lg font-bold text-black dark:text-white">You're all done!</h2>
                            <p>Simply sign up online for free and verify your identity</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="overflow-hidden bg-black bg-[url(/assets/images/online-payments/bg-patent.png)] bg-no-repeat">
            <div class="container">
                <div class="relative z-[1] pb-0 pt-10 md:py-[42px]">
                    <img
                        src="/assets/images/online-payments/cashback-taxt.png"
                        alt=""
                        class="w-full md:max-w-[450px] lg:max-w-[640px]"
                        data-aos="flip-right"
                        data-aos-duration="1000"
                    />
                    <img
                        src="/assets/images/online-payments/cashback-img.svg"
                        alt=""
                        class="bottom-0 -z-[1] ltr:-right-60 rtl:-left-60 md:absolute ltr:lg:-right-[340px] rtl:lg:-left-[340px]"
                    />
                </div>
            </div>
        </section>

        <section class="overflow-hidden bg-gradient-to-b from-white/0 to-white/50 py-10 dark:to-[rgba(255,255,255,0.02)] md:py-20">
            <div class="container">
                <div class="grid gap-[30px] md:grid-cols-2" data-aos="fade-up" data-aos-duration="1000">
                    <div class="grid gap-4 md:gap-[30px]">
                        <div class="grid h-[415px] place-content-center bg-black/5 dark:bg-white/5">
                            <img src="/assets/images/online-payments/help_img.svg" alt="" class="" />
                        </div>

                        <div class="border-2 border-black bg-white p-5 dark:border-white dark:bg-transparent">
                            <h3 class="mb-2.5 text-lg font-bold text-black dark:text-white">
                                <a href="javascript:" class="hover:text-secondary">Unified Commerce</a>
                            </h3>
                            <p>Connect your online and in-store payment data in one system. There are many variations of passages.</p>
                        </div>
                    </div>

                    <div class="grid gap-4 md:gap-[30px]">
                        <div>
                            <div class="mb-2.5 space-y-5">
                                <h2
                                    class="inline-flex border-2 border-black bg-white px-5 py-3 font-extrabold uppercase leading-none text-black shadow-[4px_4px_0_#08111F] dark:border-white dark:bg-gray-dark dark:text-white dark:shadow-[4px_4px_0_#fff]"
                                >
                                    we help your business grow
                                </h2>
                                <h3 class="text-3xl font-extrabold text-black dark:text-white lg:text-[40px] lg:leading-[60px]">Accept Payments Everywhere</h3>
                            </div>
                            <p class="lg:text-lg">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div class="border-2 border-black bg-white p-5 dark:border-white dark:bg-transparent">
                            <h3 class="mb-2.5 text-lg font-bold text-black dark:text-white">
                                <a href="javascript:" class="hover:text-secondary">Online Payments</a>
                            </h3>
                            <p>Accept cards, mobile wallets, and more on any digital channel or device.</p>
                        </div>

                        <div class="border-2 border-black bg-white p-5 dark:border-white dark:bg-transparent">
                            <h3 class="mb-2.5 text-lg font-bold text-black dark:text-white">
                                <a href="javascript:" class="hover:text-secondary">In-person payments</a>
                            </h3>
                            <p>Enhance your point of sale setup and choose a terminal for any need.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-gradient-to-b from-secondary/10 to-primary/10 py-10 md:py-20">
            <div class="container">
                <div class="grid gap-4 md:grid-cols-3 lg:gap-[30px]">
                    <div class="border-2 border-black bg-white p-5 dark:border-white dark:bg-gray-dark" data-aos="zoom-in" data-aos-duration="1000">
                        <div class="mb-7 text-center">
                            <img src="/assets/images/online-payments/detail_img1.png" alt="" class="mx-auto dark:hidden" />
                            <img src="/assets/images/online-payments/dark-detail_img1.png" alt="" class="mx-auto hidden dark:block" />
                        </div>
                        <h3 class="mb-2.5 text-xl font-bold text-black dark:text-white">
                            <a href="javascript:" class="hover:text-primary">Trusted by millions of people, part of one part</a>
                        </h3>
                        <p class="mb-5">Connect your online and in-store payment data in one system.</p>
                        <a href="javascript:" class="text-sm font-bold text-secondary hover:text-primary">View more</a>
                    </div>

                    <div class="border-2 border-black bg-white p-5 dark:border-white dark:bg-gray-dark" data-aos="zoom-in" data-aos-duration="1000">
                        <div class="mb-7 text-center">
                            <img src="/assets/images/online-payments/detail_img2.png" alt="" class="mx-auto dark:hidden" />
                            <img src="/assets/images/online-payments/dark-detail_img2.png" alt="" class="mx-auto hidden dark:block" />
                        </div>
                        <h3 class="mb-2.5 text-xl font-bold text-black dark:text-white">
                            <a href="javascript:" class="hover:text-primary">Spend money abroad, and track your expense</a>
                        </h3>
                        <p class="mb-5">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        <a href="javascript:" class="text-sm font-bold text-secondary hover:text-primary">View more</a>
                    </div>

                    <div class="border-2 border-black bg-white p-5 dark:border-white dark:bg-gray-dark" data-aos="zoom-in" data-aos-duration="1000">
                        <div class="mb-7 text-center">
                            <img src="/assets/images/online-payments/detail_img3.png" alt="" class="mx-auto dark:hidden" />
                            <img src="/assets/images/online-payments/dark-detail_img3.png" alt="" class="mx-auto hidden dark:block" />
                        </div>
                        <h3 class="mb-2.5 text-xl font-bold text-black dark:text-white">
                            <a href="javascript:" class="hover:text-primary">Receive money from anywhere in the world</a>
                        </h3>
                        <p class="mb-5">It is a long established fact that a reader will be distracted by the readable.</p>
                        <a href="javascript:" class="text-sm font-bold text-secondary hover:text-primary">View more</a>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div class="container">
                <div class="relative py-12 lg:py-24">
                    <div class="flex flex-col items-center justify-between gap-[73px] lg:flex-row">
                        <div data-aos="fade-right" data-aos-duration="1000">
                            <div class="heading mb-0 text-center ltr:lg:text-left rtl:lg:text-right">
                                <h3
                                    class="mb-5 inline-flex border-2 border-black bg-white px-5 py-3 font-extrabold uppercase leading-none text-black shadow-[4px_4px_0_#08111F] dark:border-white dark:bg-gray-dark dark:text-white dark:shadow-[4px_4px_0_#fff]"
                                >
                                    testimonials
                                </h3>
                                <h4 class="!font-black">WHAT OUR CUSTOMERS ARE <span class="text-secondary">SAYING US?</span></h4>
                            </div>
                            <p class="mt-2.5 text-center text-lg font-medium ltr:lg:text-left rtl:lg:text-right">
                                lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius tortor nibh.
                            </p>
                            <div class="mt-7 flex justify-center gap-16 lg:justify-start">
                                <div>
                                    <h2 class="text-3xl font-black text-black dark:text-white">13M <span class="text-primary">+</span></h2>
                                    <p class="mt-1 text-sm font-bold">happy people</p>
                                </div>
                                <div>
                                    <h2 class="text-3xl font-black text-black dark:text-white">4.88</h2>
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
                            class="relative mx-auto w-full max-w-[445px] bg-white drop-shadow-[6px_6px_0px_rgba(119,128,161,0.3)] dark:bg-black"
                            data-aos="zoom-left"
                            data-aos-duration="1000"
                        >
                            <client-slider></client-slider>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="relative overflow-hidden bg-black py-10 md:py-20">
            <img src="/assets/images/online-payments/bg-patent.png" alt="" class="absolute top-0 ltr:left-0 rtl:right-0 rtl:-rotate-180" />
            <img
                src="/assets/images/online-payments/growth_img.png"
                alt=""
                class="absolute inset-y-0 m-auto w-2/3 ltr:-right-40 ltr:rotate-[30deg] rtl:-left-40 rtl:-rotate-[30deg] sm:w-1/2 ltr:sm:right-0 rtl:sm:left-0"
            />
            <div class="container relative">
                <div class="heading mb-0 max-w-[260px] sm:max-w-[470px]" data-aos="zoom-in" data-aos-duration="1000">
                    <h4 class="mb-2.5 !font-black !text-white">Make Plurk your growth partner today</h4>
                    <p class="mb-8 sm:mb-[50px]">Download Plurk App to Pay from any where.</p>

                    <div class="flex gap-5">
                        <a href="javascript:"><img src="/assets/images/online-payments/app-store.svg" alt="" /></a>
                        <a href="javascript:"><img src="/assets/images/online-payments/play-store.svg" alt="" /></a>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
    import ClientSlider from '@/components/ClientSlider.vue';
    import CountUp from 'vue-countup-v3';
</script>
