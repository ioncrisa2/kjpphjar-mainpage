<template>
    <div>
        <section class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-center bg-no-repeat pt-[82px] text-white lg:pt-[106px]">
            <div class="container">
                <div class="flex flex-col gap-7 pt-6 md:flex-row md:gap-0">
                    <div class="space-y-5 pt-24 pb-10 text-center ltr:md:text-left rtl:md:text-right">
                        <h5 class="text-xl font-bold">We are professionals for</h5>
                        <h2 class="text-4xl font-black uppercase sm:text-6xl sm:leading-tight">Grow Your <span class="text-secondary">Business!</span></h2>
                        <p class="text-lg font-semibold">
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                        </p>
                        <div class="flex items-center justify-center gap-5 md:justify-start">
                            <div class="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-primary/50 duration-200 hover:bg-black">
                                <img src="/assets/images/consulting/banner-icon1.svg" alt="" />
                            </div>
                            <div class="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-primary/50 duration-200 hover:bg-black">
                                <img src="/assets/images/consulting/banner-icon2.svg" alt="" />
                            </div>
                            <a
                                href="javascript:"
                                class="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-primary/50 duration-200 hover:bg-black"
                            >
                                <img src="/assets/images/consulting/banner-icon3.svg" alt="" />
                            </a>
                        </div>
                        <router-link to="/contact-us" class="btn rounded-md bg-white">Contact us</router-link>
                    </div>
                    <div class="mx-auto w-full max-w-[435px]">
                        <img src="/assets/images/consulting/banner-img.png" data-aos="fade-up" data-aos-duration="1000" alt="" />
                    </div>
                </div>
            </div>
        </section>

        <section class="border-b border-gray/30 py-[50px] dark:bg-black">
            <LogoSlider></LogoSlider>
        </section>

        <section class="py-12 dark:bg-black lg:py-24">
            <div class="container">
                <div class="flex flex-col items-center gap-5 lg:flex-row" data-aos="fade-up" data-aos-duration="1000">
                    <div class="flex-none lg:max-w-[130px]">
                        <div class="grid grid-cols-3 gap-3 sm:gap-5 lg:grid-cols-1">
                            <div class="rounded-[10px] bg-white py-4 px-6 text-center shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:bg-white/10 sm:py-[19px]">
                                <span>
                                    <img src="/assets/images/consulting/about-icon1.svg" class="mx-auto" alt="" />
                                </span>
                                <p class="text-b mt-2 font-semibold text-black dark:text-white sm:text-xl">Vision</p>
                            </div>
                            <div class="rounded-[10px] bg-white py-4 px-6 text-center shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:bg-white/10 sm:py-[19px]">
                                <span>
                                    <img src="/assets/images/consulting/about-icon2.svg" class="mx-auto" alt="" />
                                </span>
                                <p class="mt-2 font-semibold text-black dark:text-white sm:text-xl">Missions</p>
                            </div>
                            <div class="rounded-[10px] bg-white py-4 px-6 text-center shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:bg-white/10 sm:py-[19px]">
                                <span>
                                    <img src="/assets/images/consulting/about-icon3.svg" class="mx-auto" alt="" />
                                </span>
                                <p class="mt-2 font-semibold text-black dark:text-white sm:text-xl">Goals</p>
                            </div>
                        </div>
                    </div>
                    <div class="grid flex-1 grid-cols-1 items-center gap-10 md:grid-cols-2">
                        <div>
                            <img src="/assets/images/consulting/about-img.png" class="mx-auto" alt="" />
                        </div>
                        <div class="space-y-4 text-center ltr:md:text-left rtl:md:text-right">
                            <h3 class="text-3xl font-black uppercase text-black dark:text-white sm:text-[40px] sm:leading-[60px]">
                                Benefits of <span class="text-secondary">wellbein</span> and positive <span class="text-primary">employee</span>
                            </h3>
                            <p class="text-lg font-medium">
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                            </p>
                            <button type="button" class="btn rounded-md text-white shadow-[10px_15px_30px_rgba(119,128,161,0.2)]">Register</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="relative bg-black py-12 dark:bg-white/5 lg:py-24">
            <div class="absolute bottom-0 ltr:right-0 rtl:left-0">
                <img src="/assets/images/consulting/bg-icon.svg" class="rtl:rotate-y-180" alt="" />
            </div>
            <div class="container relative z-[1]">
                <div class="heading text-center text-white">
                    <h4 class="mb-2 !font-black uppercase !text-white">What <span class="text-secondary">we do</span></h4>
                    <p class="text-lg">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
                <div class="mt-10 grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-3" data-aos="flip-left" data-aos-duration="1000">
                    <div class="group">
                        <div class="overflow-hidden">
                            <img src="/assets/images/consulting/services1.jpg" class="w-full duration-200 group-hover:rotate-2 group-hover:scale-110" alt="" />
                        </div>
                        <div class="relative mx-4 -mt-10 space-y-2.5 bg-gray-dark px-4 pt-[22px] text-center dark:bg-black md:px-[26px]">
                            <h5 class="text-2xl font-bold text-primary group-hover:text-secondary">Tax Planning</h5>
                            <div class="mx-auto h-1 w-[50px] bg-secondary duration-200 group-hover:bg-primary"></div>
                            <p class="pb-[60px] text-lg font-semibold">
                                It is a long established fact that a reader will be distracted by the readable content.
                            </p>
                            <span class="absolute bottom-0 opacity-20 ltr:right-0 rtl:left-0">
                                <img src="/assets/images/consulting/services-icon1.svg" alt="" />
                            </span>
                        </div>
                    </div>
                    <div class="group">
                        <div class="overflow-hidden">
                            <img src="/assets/images/consulting/services2.jpg" class="w-full duration-200 group-hover:rotate-2 group-hover:scale-110" alt="" />
                        </div>
                        <div class="relative mx-4 -mt-10 space-y-2.5 bg-gray-dark px-4 pt-[22px] text-center dark:bg-black md:px-[26px]">
                            <h5 class="text-2xl font-bold text-primary group-hover:text-secondary">Business Planning</h5>
                            <div class="mx-auto h-1 w-[50px] bg-secondary duration-200 group-hover:bg-primary"></div>
                            <p class="pb-[60px] text-lg font-semibold">
                                It is a long established fact that a reader will be distracted by the readable content.
                            </p>
                            <span class="absolute bottom-0 opacity-20 ltr:right-0 rtl:left-0">
                                <img src="/assets/images/consulting/services-icon2.svg" alt="" />
                            </span>
                        </div>
                    </div>
                    <div class="group">
                        <div class="overflow-hidden">
                            <img src="/assets/images/consulting/services3.jpg" class="w-full duration-200 group-hover:rotate-2 group-hover:scale-110" alt="" />
                        </div>
                        <div class="relative mx-4 -mt-10 space-y-2.5 bg-gray-dark px-4 pt-[22px] text-center dark:bg-black md:px-[26px]">
                            <h5 class="text-2xl font-bold text-primary group-hover:text-secondary">Insutance & Family</h5>
                            <div class="mx-auto h-1 w-[50px] bg-secondary duration-200 group-hover:bg-primary"></div>
                            <p class="pb-[60px] text-lg font-semibold">
                                It is a long established fact that a reader will be distracted by the readable content.
                            </p>
                            <span class="absolute bottom-0 opacity-20 ltr:right-0 rtl:left-0">
                                <img src="/assets/images/consulting/services-icon3.svg" alt="" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="overflow-hidden py-12 lg:py-24">
            <div class="container">
                <div class="heading mb-8 text-center lg:mb-12">
                    <h4 class="!font-black uppercase">Pricing <span class="text-primary">Plan</span></h4>
                    <p class="mt-2 !text-lg !font-medium">Innovative solutions satisfied clients for tax consulting</p>
                </div>
                <div class="mb-5 flex justify-center space-x-4 text-center text-base font-semibold rtl:space-x-reverse md:mb-16">
                    <span>Monthly</span>
                    <label class="relative h-6 w-12">
                        <input
                            id="custom_switch_checkbox1"
                            type="checkbox"
                            class="custom_switch peer absolute top-0 z-10 h-full w-full cursor-pointer opacity-0 ltr:left-0 rtl:right-0"
                            x-model="yearlyPrice"
                        />
                        <span
                            for="custom_switch_checkbox1"
                            class="outline_checkbox bg-icon dark:border-white-dark dark:before:bg-white-dark block h-full rounded-full border-2 border-gray before:absolute before:bottom-1 before:h-4 before:w-4 before:rounded-full before:bg-gray before:bg-[url(/assets/images/consulting/close.svg)] before:bg-center before:bg-no-repeat before:transition-all before:duration-300 peer-checked:border-primary peer-checked:before:bg-primary peer-checked:before:bg-[url(/assets/images/consulting/checked.svg)] ltr:before:left-1 ltr:peer-checked:before:left-7 rtl:before:right-1 rtl:peer-checked:before:right-7"
                        ></span>
                    </label>
                    <span>Yearly</span>
                </div>
                <div class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-0 lg:mt-16 lg:grid-cols-3">
                    <div
                        class="flex flex-col rounded-l-[4px] border border-gray/30 bg-white p-8 dark:bg-white/[0.05]"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                    >
                        <h5 class="text-xl font-semibold text-black dark:text-white">Premium</h5>
                        <p class="mt-6 text-sm font-normal">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        <h3 class="mt-[38px] text-center text-3xl font-bold text-black dark:text-white">
                            $25 <span class="text-lg font-normal">/ monthly</span>
                        </h3>
                        <p class="mt-[38px] text-[15px] font-bold text-black dark:text-white">Cloud Hosting Features</p>
                        <ul class="mt-2.5 mb-5 space-y-2.5">
                            <li>Single Domain</li>
                            <li>50 GB SSD</li>
                            <li>1 TB Premium Bandwidth</li>
                        </ul>
                        <button type="button" class="mt-auto w-full rounded-md bg-gray py-4 uppercase text-white duration-200 hover:bg-primary">
                            Get a Free Consulting
                        </button>
                    </div>
                    <div
                        class="relative mt-5 flex flex-col border border-gray/30 bg-white p-8 dark:bg-white/[0.05] sm:mt-0 lg:border-x-0 lg:border-y"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                    >
                        <p class="absolute inset-x-0 -top-6 w-full rounded-t-[6px] bg-secondary py-2.5 text-center font-bold text-white">Most Popular</p>
                        <h5 class="text-xl font-semibold text-black dark:text-white">Plus</h5>
                        <p class="mt-6 text-sm font-normal">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        <h3 class="mt-[38px] text-center text-3xl font-bold text-secondary">
                            $70 <span class="text-lg font-normal text-black dark:text-white">/ monthly</span>
                        </h3>
                        <p class="mt-[38px] text-[15px] font-bold text-black dark:text-white">VPS Hosting Features</p>
                        <ul class="mt-2.5 mb-5 space-y-2.5">
                            <li>5 Domains</li>
                            <li>100 GB SSD</li>
                            <li>2 TB Premium Bandwidth</li>
                        </ul>
                        <button type="button" class="mt-auto w-full rounded-md bg-secondary py-4 uppercase text-white duration-200 hover:bg-primary">
                            Get a Free Consulting
                        </button>
                    </div>
                    <div
                        class="flex flex-col rounded-r-[4px] border border-gray/30 bg-white p-8 dark:bg-white/[0.05]"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                    >
                        <h5 class="text-xl font-semibold text-black dark:text-white">Business</h5>
                        <p class="mt-6 text-sm font-normal">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        <h3 class="mt-[38px] text-center text-3xl font-bold text-black dark:text-white">
                            $115 <span class="text-lg font-normal">/ monthly</span>
                        </h3>
                        <p class="mt-[38px] text-[15px] font-bold text-black dark:text-white">Business Hosting Features</p>
                        <ul class="mt-2.5 mb-5 space-y-2.5">
                            <li>Unlimited Domains</li>
                            <li>1 TB SSD</li>
                            <li>5 TB Premium Bandwidth</li>
                        </ul>
                        <button type="button" class="mt-auto w-full rounded-md bg-gray py-4 uppercase text-white duration-200 hover:bg-primary">
                            Get a Free Consulting
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section class="relative bg-black py-14 dark:bg-gray-dark lg:py-[100px]">
            <div class="absolute bottom-0 ltr:left-0 rtl:right-0">
                <img src="/assets/images/consulting/bg-icon.svg" class="rotate-y-180 rtl:rotate-0" alt="" />
            </div>
            <div class="container">
                <div class="heading text-center ltr:lg:text-left rtl:lg:text-right">
                    <h6>Testimonial</h6>
                    <h4 class="!text-white">Feedback from our clients</h4>
                </div>
                <div class="relative mx-auto lg:w-11/12">
                    <swiper
                        :loop="true"
                        :slidesPerView="1"
                        :spaceBetween="30"
                        :speed="1000"
                        :autoplay="{
                            delay: 3000,
                            disableOnInteraction: false,
                        }"
                        :navigation="{
                            nextEl: '.testimonial-swiper-button-next',
                            prevEl: '.testimonial-swiper-button-prev',
                        }"
                        :modules="[Navigation, Autoplay]"
                        :dir="store.direction === 'rtl' ? 'rtl' : 'ltr'"
                        :key="store.direction === 'rtl' ? 'true' : 'false'"
                        class="sm:py-12 md:py-0"
                    >
                        <swiper-slide>
                            <div class="items-center gap-4 sm:grid sm:grid-cols-3">
                                <div class="col-span-2">
                                    <div class="relative rounded-3xl bg-gray-dark p-6 dark:bg-black">
                                        <img
                                            src="/assets/images/blue-quote.png"
                                            alt="blue-quote"
                                            class="absolute top-0 ltr:right-0 rtl:left-0 sm:-top-6 ltr:sm:-right-6 rtl:sm:-left-6"
                                        />
                                        <div class="pb-8">
                                            <svg width="96" height="16" viewBox="0 0 96 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M86.2864 2.84744C87.0637 1.5558 88.9363 1.5558 89.7136 2.84744L90.1964 3.64962C90.4756 4.11365 90.9311 4.44459 91.4587 4.56678L92.3708 4.77803C93.8395 5.11816 94.4181 6.8991 93.4299 8.03752L92.8162 8.74454C92.4612 9.15352 92.2872 9.68898 92.334 10.2285L92.4149 11.1613C92.5453 12.6631 91.0303 13.7638 89.6423 13.1757L88.7802 12.8105C88.2815 12.5993 87.7185 12.5993 87.2198 12.8105L86.3577 13.1757C84.9697 13.7638 83.4547 12.6631 83.5851 11.1613L83.666 10.2285C83.7128 9.68899 83.5388 9.15352 83.1838 8.74454L82.5701 8.03752C81.5819 6.89911 82.1605 5.11816 83.6292 4.77803L84.5413 4.56678C85.0689 4.44459 85.5244 4.11365 85.8036 3.64962L86.2864 2.84744Z"
                                                    fill="#7780A1"
                                                />
                                                <path
                                                    d="M66.2864 2.84744C67.0637 1.5558 68.9363 1.5558 69.7136 2.84744L70.1964 3.64962C70.4756 4.11365 70.9311 4.44459 71.4587 4.56678L72.3708 4.77803C73.8395 5.11816 74.4181 6.8991 73.4299 8.03752L72.8162 8.74454C72.4612 9.15352 72.2872 9.68898 72.334 10.2285L72.4149 11.1613C72.5453 12.6631 71.0303 13.7638 69.6423 13.1757L68.7802 12.8105C68.2815 12.5993 67.7185 12.5993 67.2198 12.8105L66.3577 13.1757C64.9697 13.7638 63.4547 12.6631 63.5851 11.1613L63.666 10.2285C63.7128 9.68899 63.5388 9.15352 63.1838 8.74454L62.5701 8.03752C61.5819 6.89911 62.1605 5.11816 63.6292 4.77803L64.5413 4.56678C65.0689 4.44459 65.5244 4.11365 65.8036 3.64962L66.2864 2.84744Z"
                                                    fill="#FFBD11"
                                                />
                                                <path
                                                    d="M46.2864 2.84744C47.0637 1.5558 48.9363 1.5558 49.7136 2.84744L50.1964 3.64962C50.4756 4.11365 50.9311 4.44459 51.4587 4.56678L52.3708 4.77803C53.8395 5.11816 54.4181 6.8991 53.4299 8.03752L52.8162 8.74454C52.4612 9.15352 52.2872 9.68898 52.334 10.2285L52.4149 11.1613C52.5453 12.6631 51.0303 13.7638 49.6423 13.1757L48.7802 12.8105C48.2815 12.5993 47.7185 12.5993 47.2198 12.8105L46.3577 13.1757C44.9697 13.7638 43.4547 12.6631 43.5851 11.1613L43.666 10.2285C43.7128 9.68899 43.5388 9.15352 43.1838 8.74454L42.5701 8.03752C41.5819 6.89911 42.1605 5.11816 43.6292 4.77803L44.5413 4.56678C45.0689 4.44459 45.5244 4.11365 45.8036 3.64962L46.2864 2.84744Z"
                                                    fill="#FFBD11"
                                                />
                                                <path
                                                    d="M26.2864 2.84744C27.0637 1.5558 28.9363 1.5558 29.7136 2.84744L30.1964 3.64962C30.4756 4.11365 30.9311 4.44459 31.4587 4.56678L32.3708 4.77803C33.8395 5.11816 34.4181 6.8991 33.4299 8.03752L32.8162 8.74454C32.4612 9.15352 32.2872 9.68898 32.334 10.2285L32.4149 11.1613C32.5453 12.6631 31.0303 13.7638 29.6423 13.1757L28.7802 12.8105C28.2815 12.5993 27.7185 12.5993 27.2198 12.8105L26.3577 13.1757C24.9697 13.7638 23.4547 12.6631 23.5851 11.1613L23.666 10.2285C23.7128 9.68899 23.5388 9.15352 23.1838 8.74454L22.5701 8.03752C21.5819 6.89911 22.1605 5.11816 23.6292 4.77803L24.5413 4.56678C25.0689 4.44459 25.5244 4.11365 25.8036 3.64962L26.2864 2.84744Z"
                                                    fill="#FFBD11"
                                                />
                                                <path
                                                    d="M6.28638 2.84744C7.0637 1.5558 8.9363 1.5558 9.71362 2.84744L10.1964 3.64962C10.4756 4.11365 10.9311 4.44459 11.4587 4.56678L12.3708 4.77803C13.8395 5.11816 14.4181 6.8991 13.4299 8.03752L12.8162 8.74454C12.4612 9.15352 12.2872 9.68898 12.334 10.2285L12.4149 11.1613C12.5453 12.6631 11.0303 13.7638 9.64225 13.1757L8.78018 12.8105C8.28151 12.5993 7.71849 12.5993 7.21982 12.8105L6.35775 13.1757C4.96968 13.7638 3.45472 12.6631 3.58506 11.1613L3.66601 10.2285C3.71283 9.68899 3.53885 9.15352 3.18383 8.74454L2.57009 8.03752C1.58187 6.89911 2.16054 5.11816 3.62916 4.77803L4.54126 4.56678C5.06887 4.44459 5.52437 4.11365 5.80362 3.64962L6.28638 2.84744Z"
                                                    fill="#FFBD11"
                                                />
                                            </svg>
                                        </div>
                                        <p class="relative font-medium italic text-white">
                                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some
                                            form, by injected humour, or randomised words which don't look even slightly believable.
                                            <span class="absolute -left-2 -top-2">
                                                <svg width="100" height="73" viewBox="0 0 100 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g opacity="0.05">
                                                        <path
                                                            d="M79.5222 0C85.1084 0 89.8948 2.12795 93.8833 6.1167C98.1392 10.1054 100 14.8935 100 20.2128C100 25.2666 98.4045 29.7875 94.9462 33.7764C91.4881 38.0323 85.9039 38.8302 81.3825 39.0952C82.1803 45.7443 85.9037 52.6589 89.3619 57.4472C89.8944 58.245 90.425 59.0427 91.2246 59.5752C92.2876 60.6382 92.2876 62.2356 91.2246 63.2986L83.5126 71.543C82.4495 72.8732 80.3216 72.606 79.2567 71.543C76.0657 68.0849 72.8731 63.831 70.2144 59.5751C62.7675 47.6072 59.044 35.6393 59.044 23.669C59.044 16.7544 61.1719 10.9032 65.1606 6.64734C69.1493 2.39334 74.2029 0.000144939 79.5217 0.000144939L79.5222 0Z"
                                                            fill="#93A2B2"
                                                        />
                                                        <path
                                                            d="M20.4783 0C26.0645 0 30.8509 2.12795 34.8394 6.1167C39.0952 10.1054 40.9561 14.8935 40.9561 20.2128C40.9561 25.2666 39.3606 29.7875 35.9023 33.7764C32.4442 38.0323 26.86 38.8302 22.3386 39.0952C23.1363 45.7443 26.8597 52.6589 30.318 57.4472C30.8504 58.245 31.381 59.0427 32.1806 59.5752C33.2437 60.6382 33.2437 62.2356 32.1806 63.2986L24.4686 71.543C23.4056 72.8732 21.2776 72.606 20.2128 71.543C17.0218 68.0849 13.8292 63.831 11.1705 59.5751C3.72351 47.6072 7.62939e-06 35.6393 7.62939e-06 23.669C7.62939e-06 16.7544 2.12797 10.9032 6.11671 6.64734C10.1054 2.39334 14.8921 0.000144939 20.4778 0.000144939L20.4783 0Z"
                                                            fill="#93A2B2"
                                                        />
                                                    </g>
                                                </svg>
                                            </span>
                                        </p>
                                        <div class="mt-12">
                                            <h5 class="font-extrabold text-primary">Allan Branch</h5>
                                            <h6 class="text-sm font-bold italic">CEO of Lifted</h6>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="mx-auto mt-4 h-20 w-20 max-w-[255px] overflow-hidden rounded-full bg-white ltr:ml-auto rtl:mr-auto dark:bg-gray-dark sm:mt-0 sm:h-auto sm:w-auto sm:rounded-[150px] ltr:sm:mr-0 rtl:sm:ml-0"
                                >
                                    <img src="/assets/images/testimonial.png" alt="testimonial" class="h-full w-full object-cover object-top" />
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper>
                    <div class="bottom-0 z-[1] mt-5 flex items-center justify-center gap-4 ltr:right-1/3 rtl:left-1/3 sm:absolute sm:mt-0 sm:justify-end">
                        <a href="javascript:" class="text-sm font-extrabold text-white transition hover:text-secondary dark:hover:text-secondary">View All</a>
                        <button
                            type="button"
                            class="testimonial-swiper-button-prev static mt-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] transition after:text-[0px] hover:bg-secondary rtl:rotate-180"
                        >
                            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5.95007 1.2002L1.48924 5.3424C1.06317 5.73803 1.06317 6.41236 1.48924 6.80799L5.95007 10.9502"
                                    stroke="white"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            class="testimonial-swiper-button-next static mt-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] transition after:text-[0px] hover:bg-secondary rtl:rotate-180"
                        >
                            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1.05005 10.7998L5.51089 6.6576C5.93695 6.26197 5.93695 5.58764 5.51089 5.19201L1.05005 1.0498"
                                    stroke="white"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-12 lg:py-24">
            <div class="container">
                <div class="heading text-center">
                    <h4 class="!font-black uppercase">Most Asked <span class="text-secondary">Questions</span></h4>
                    <h6 class="mx-auto mt-2 max-w-[520px] !font-medium !text-gray">
                        Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Sunt, Architecto Cupiditate Odio Rerum Est
                    </h6>
                </div>
                <div class="flex flex-col items-center gap-5 sm:gap-10 lg:flex-row">
                    <div class="w-full max-w-[552px] flex-none">
                        <img src="/assets/images/consulting/question-img.png" class="rtl:rotate-y-180" alt="" />
                    </div>
                    <div class="accordion-container flex-1">
                        <div v-for="(faq, i) in queries" :key="faq.id" class="mt-5">
                            <h2 class="" @click="accordians === i ? (accordians = null) : (accordians = i)">
                                <button
                                    type="button"
                                    class="relative flex w-full items-center justify-between gap-2 !bg-gray/30 px-5 py-2.5 !font-mulish text-lg font-bold text-black ltr:text-left rtl:text-right dark:!text-white sm:text-xl"
                                >
                                    <div>{{ faq.question }}</div>
                                    <div
                                        class="trigger-icon grid h-6 w-6 place-content-center rounded-full border-2 border-gray text-black transition dark:text-white"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M6.09961 0.500977C6.65189 0.500977 7.09961 0.948692 7.09961 1.50098L7.09961 10.501C7.09961 11.0533 6.65189 11.501 6.09961 11.501H5.89961C5.34732 11.501 4.89961 11.0533 4.89961 10.501L4.89961 1.50098C4.89961 0.948692 5.34732 0.500977 5.89961 0.500977H6.09961Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M0.5 5.90039C0.5 5.34811 0.947715 4.90039 1.5 4.90039H10.5C11.0523 4.90039 11.5 5.34811 11.5 5.90039V6.10039C11.5 6.65268 11.0523 7.10039 10.5 7.10039H1.5C0.947715 7.10039 0.5 6.65268 0.5 6.10039V5.90039Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            </h2>
                            <vue-collapsible :isOpen="accordians === i">
                                <div class="bg-white p-5 font-mulish text-base font-medium text-gray dark:bg-white/5">
                                    <p>{{ faq.answer }}</p>
                                </div>
                            </vue-collapsible>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-black bg-[url(/assets/images/consulting/business-img.png)] bg-cover bg-center bg-no-repeat py-12 lg:py-24">
            <div class="container">
                <div class="grid grid-cols-1 gap-12 text-center lg:grid-cols-2 lg:gap-20 ltr:lg:text-left rtl:lg:text-right">
                    <div>
                        <h3 class="text-3xl font-black uppercase text-white sm:text-[40px] sm:leading-[50px]">
                            We Help <span class="text-primary">Growing Business</span>
                        </h3>
                        <p class="mt-[18px] text-lg">
                            We help managing asset, provide financial advise. leave money issue with us and focus on your core business.
                        </p>
                        <div class="mt-[18px] flex justify-center gap-6 lg:justify-start">
                            <div>
                                <router-link
                                    to="/contact-us"
                                    class="btn rounded-md bg-secondary text-white shadow-[10px_15px_30px_rgba(199,128,161,0.2)] hover:bg-primary"
                                    >Contact us</router-link
                                >
                            </div>
                            <button type="button" class="group flex items-center gap-2.5" @click="dialog.open()">
                                <span>
                                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 27.5C21.9036 27.5 27.5 21.9036 27.5 15C27.5 8.09644 21.9036 2.5 15 2.5"
                                            stroke="#47BDFF"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />
                                        <path
                                            d="M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5"
                                            stroke="#47BDFF"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-dasharray="4 3"
                                        />
                                        <path
                                            d="M17.3595 12.4185C18.7032 13.5146 19.375 14.0626 19.375 15C19.375 15.9374 18.7032 16.4854 17.3595 17.5815C16.9886 17.8841 16.6207 18.169 16.2826 18.4064C15.9861 18.6146 15.6502 18.83 15.3024 19.0415C13.9619 19.8567 13.2917 20.2643 12.6905 19.813C12.0894 19.3617 12.0347 18.4171 11.9255 16.5277C11.8946 15.9934 11.875 15.4696 11.875 15C11.875 14.5304 11.8946 14.0066 11.9255 13.4723C12.0347 11.5829 12.0894 10.6383 12.6905 10.187C13.2917 9.73574 13.9619 10.1433 15.3024 10.9585C15.6502 11.17 15.9861 11.3854 16.2826 11.5936C16.6207 11.831 16.9886 12.1159 17.3595 12.4185Z"
                                            stroke="#47BDFF"
                                            stroke-width="2"
                                        />
                                    </svg>
                                </span>
                                <span class="uppercase text-white duration-200 group-hover:text-primary">Watch Videos</span>
                            </button>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 items-center gap-3 sm:gap-7" data-aos="flip-left" data-aos-duration="1000">
                        <div class="border border-transparent bg-gray/20 py-10 px-5 text-center duration-200 hover:border-secondary sm:py-[52px]">
                            <count-up
                                class="text-[34px] font-black text-white"
                                :startVal="0"
                                :end-val="100"
                                :duration="10"
                                :options="{ suffix: '+' }"
                            ></count-up>
                            <p class="mt-2.5 font-bold">Satisfied customers</p>
                        </div>
                        <div class="border border-transparent bg-gray/20 py-10 px-5 text-center duration-200 hover:border-secondary sm:py-[52px]">
                            <count-up
                                class="text-[34px] font-black text-white"
                                :startVal="0"
                                :end-val="12"
                                :duration="10"
                                :options="{ suffix: '+' }"
                            ></count-up>
                            <p class="mt-2.5 font-bold">Years project experince</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <modal
            ref="dialog"
            width="960"
            :close_by_overlay="true"
            :close-btn="true"
            close_style="floating"
            content-class="pt-8 px-0 pb-0 !bg-transparent"
            close-btn-class="!top-0 ltr:!right-0 rtl:!right-auto rtl:!left-0 !text-white !text-3xl"
        >
            <div class="bg-black !p-4 dark:bg-gray-dark">
                <div class="relative">
                    <div class="aspect-video">
                        <iframe
                            class="absolute top-0 left-0 h-full w-full"
                            src="https://www.youtube.com/embed/D0UnqGm_miA"
                            frameborder="0"
                            allowfullscreen
                            allow="autoplay"
                        ></iframe>
                    </div>
                </div>
            </div>
        </modal>

        <section class="overflow-hidden py-12 dark:bg-black lg:py-24">
            <div class="container">
                <div class="heading mb-10 text-center">
                    <h4 class="!font-black uppercase">Knowledge <span class="text-secondary">Center</span></h4>
                    <h6 class="mt-2 !font-medium !text-gray">Lorem ipsum dolor amet consectetur adipisicing elit eiusm tempor incididunt...</h6>
                </div>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div class="group rounded-xl border-2 border-transparent duration-200 hover:border-secondary" data-aos="fade-up" data-aos-duration="1000">
                        <div class="overflow-hidden rounded-t-xl">
                            <img src="/assets/images/consulting/knowledge1.jpg" class="rtl:rotate-y-180" alt="" />
                        </div>
                        <div class="overflow-hidden rounded-b-xl bg-white px-5 group-hover:bg-secondary/20 dark:bg-white/10">
                            <h5 class="pt-[14px] text-lg font-extrabold text-black dark:text-white">
                                Shifting Toward Innovation: How CIOs Can Accelerate Enterprise Success
                            </h5>
                            <p class="mt-[14px] pb-5 text-base">
                                The CIO has always played an important role in businesses successes. Today, with a digital transformation
                            </p>
                        </div>
                    </div>
                    <div class="group rounded-xl border-2 border-transparent duration-200 hover:border-secondary" data-aos="fade-up" data-aos-duration="1000">
                        <div class="overflow-hidden rounded-t-xl">
                            <img src="/assets/images/consulting/knowledge2.jpg" class="rtl:rotate-y-180" alt="" />
                        </div>
                        <div class="overflow-hidden rounded-b-xl bg-white px-5 group-hover:bg-secondary/20 dark:bg-white/10">
                            <h5 class="pt-[14px] text-lg font-extrabold text-black dark:text-white">Digital Transformation Success: 3 Things to Consider</h5>
                            <p class="mt-10 pb-5 text-base">
                                New innovations are emerging each day and challenging businesses in industries across the globe to adopt
                            </p>
                        </div>
                    </div>
                    <div class="group rounded-xl border-2 border-transparent duration-200 hover:border-secondary" data-aos="fade-up" data-aos-duration="1000">
                        <div class="overflow-hidden rounded-t-xl">
                            <img src="/assets/images/consulting/knowledge3.jpg" class="rtl:rotate-y-180" alt="" />
                        </div>
                        <div class="overflow-hidden rounded-b-xl bg-white px-5 group-hover:bg-secondary/20 dark:bg-white/10">
                            <h5 class="pt-[14px] text-lg font-extrabold text-black dark:text-white">Top IT Predictions for CIOs in the New Decade</h5>
                            <p class="mt-10 pb-5 text-base">As we just stepped into a new decade, many enterprises are taking time to look back</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-gradient-to-t from-transparent to-white py-14 dark:bg-gray-dark dark:to-transparent lg:py-[100px]">
            <div class="container">
                <div class="relative z-10 lg:flex">
                    <div class="heading text-center lg:mb-0 lg:w-1/3 ltr:lg:pr-10 ltr:lg:text-left rtl:lg:pl-10 rtl:lg:text-right">
                        <h6>Get In Touch.</h6>
                        <h4 class="mb-6 sm:!leading-[50px]">Ready to Get Started?</h4>
                        <img
                            src="/assets/images/form-light-img.svg"
                            alt="form-img"
                            class="mx-auto block dark:hidden"
                            data-aos="fade-right"
                            data-aos-duration="1000"
                        />
                        <img
                            src="/assets/images/form-dark-img.svg"
                            alt="form-img"
                            class="mx-auto hidden dark:block"
                            data-aos="fade-right"
                            data-aos-duration="1000"
                        />
                    </div>
                    <form action="" class="rounded-3xl bg-white px-4 py-12 dark:bg-[#101626] lg:w-2/3 lg:px-8">
                        <div class="grid gap-10 sm:grid-cols-2">
                            <div class="relative">
                                <input
                                    type="text"
                                    name="name"
                                    class="w-full rounded-2xl border-2 border-gray/20 bg-transparent p-4 font-bold outline-none transition focus:border-secondary ltr:pr-12 rtl:pl-12"
                                />
                                <label for="" class="absolute -top-3 bg-white px-2 font-bold ltr:left-6 rtl:right-6 dark:bg-[#101626] dark:text-white"
                                    >Full Name</label
                                >
                                <svg
                                    width="20"
                                    height="22"
                                    viewBox="0 0 20 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 dark:text-white"
                                >
                                    <path
                                        d="M5.42855 5.57875C5.42855 8.10348 7.47525 10.1502 9.99998 10.1502C12.5247 10.1502 14.5714 8.10348 14.5714 5.57875C14.5714 3.05402 12.5247 1.00732 9.99998 1.00732"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                    />
                                    <path
                                        d="M2 16.9328C2 15.9495 2.61812 15.0724 3.5441 14.7417V14.7417C7.71891 13.2507 12.2811 13.2507 16.4559 14.7417V14.7417C17.3819 15.0724 18 15.9495 18 16.9328V18.7014C18 19.9185 16.922 20.8535 15.7172 20.6813L13.8184 20.4101C11.2856 20.0483 8.71435 20.0483 6.18162 20.4101L4.28284 20.6813C3.07798 20.8535 2 19.9185 2 18.7014V16.9328Z"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                    />
                                </svg>
                            </div>
                            <div class="relative">
                                <input
                                    type="email"
                                    name="email"
                                    class="w-full rounded-2xl border-2 border-gray/20 bg-transparent p-4 font-bold outline-none transition focus:border-secondary ltr:pr-12 rtl:pl-12"
                                />
                                <label for="" class="absolute -top-3 bg-white px-2 font-bold ltr:left-6 rtl:right-6 dark:bg-[#101626] dark:text-white"
                                    >Email Address</label
                                >
                                <svg
                                    width="22"
                                    height="21"
                                    viewBox="0 0 22 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 dark:text-white"
                                >
                                    <path
                                        d="M1 8.00732V7.00732C1 4.2459 3.23858 2.00732 6 2.00732H16C18.7614 2.00732 21 4.2459 21 7.00732V13.0073C21 15.7687 18.7614 18.0073 16 18.0073H6C3.23858 18.0073 1 15.7687 1 13.0073V12.0073"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                    />
                                    <path
                                        d="M5 7.00732L9.8 10.6073C10.5111 11.1407 11.4889 11.1407 12.2 10.6073L17 7.00732"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                            <div class="relative">
                                <input
                                    type="text"
                                    name="mobile"
                                    class="w-full rounded-2xl border-2 border-gray/20 bg-transparent p-4 font-bold outline-none transition focus:border-secondary ltr:pr-12 rtl:pl-12"
                                />
                                <label for="" class="absolute -top-3 bg-white px-2 font-bold ltr:left-6 rtl:right-6 dark:bg-[#101626] dark:text-white"
                                    >Mobile Number</label
                                >
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 dark:text-white"
                                >
                                    <path
                                        d="M6.45241 1.40806C5.45292 0.783702 4.14202 0.887138 3.2983 1.73086L1.86856 3.1606C-0.302899 5.33207 1.73747 10.8931 6.42586 15.5815C11.1142 20.2699 16.6753 22.3102 18.8467 20.1388L20.2765 18.709C21.2635 17.722 21.2374 16.0956 20.2182 15.0764L18.0036 12.8619C16.9844 11.8426 15.358 11.8165 14.371 12.8036L14.0639 13.1107C13.531 13.6436 12.6713 13.6957 12.0713 13.2005C11.4925 12.7229 10.9159 12.208 10.3576 11.6497C9.79933 11.0914 9.28441 10.5149 8.80678 9.93607C8.31161 9.33601 8.36374 8.47631 8.89666 7.9434L9.20375 7.63631C9.98187 6.85819 10.1303 5.68271 9.65898 4.72062"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                    />
                                </svg>
                            </div>
                            <div class="relative">
                                <input
                                    type="text"
                                    name="city"
                                    class="w-full rounded-2xl border-2 border-gray/20 bg-transparent p-4 font-bold outline-none transition focus:border-secondary ltr:pr-12 rtl:pl-12"
                                />
                                <label for="" class="absolute -top-3 bg-white px-2 font-bold ltr:left-6 rtl:right-6 dark:bg-[#101626] dark:text-white"
                                    >City</label
                                >
                                <svg
                                    width="20"
                                    height="22"
                                    viewBox="0 0 20 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 dark:text-white"
                                >
                                    <path
                                        d="M5.89416 2.31259C7.20149 1.48625 8.75475 1.00732 10.4211 1.00732C15.0719 1.00732 18.8421 4.73828 18.8421 9.34066C18.8421 15.0541 12.1053 21.0073 10.4211 21.0073C8.73684 21.0073 2 15.0541 2 9.34066C2 7.87581 2.38193 6.49924 3.05263 5.30315"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                    />
                                    <path
                                        d="M13.4571 9.77392C13.5365 9.49702 13.579 9.20456 13.579 8.90216C13.579 7.15811 12.1651 5.74427 10.4211 5.74427C8.67702 5.74427 7.26318 7.15811 7.26318 8.90216C7.26318 10.6462 8.67702 12.0601 10.4211 12.0601C10.6633 12.0601 10.8991 12.0328 11.1256 11.9812"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="relative mt-10">
                            <input
                                type="text"
                                name="message"
                                class="w-full rounded-2xl border-2 border-gray/20 bg-transparent p-4 font-bold outline-none transition focus:border-secondary ltr:pr-12 rtl:pl-12"
                            />
                            <label for="" class="absolute -top-3 bg-white px-2 font-bold ltr:left-6 rtl:right-6 dark:bg-[#101626] dark:text-white"
                                >Message</label
                            >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                class="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 dark:text-white"
                            >
                                <path
                                    d="M1 11.467V18.9267C1 19.7652 1.96993 20.2314 2.6247 19.7076L5.45217 17.4456C5.8068 17.1619 6.24742 17.0073 6.70156 17.0073H16C18.7614 17.0073 21 14.7687 21 12.0073V6.00732C21 3.2459 18.7614 1.00732 16 1.00732H6C3.23858 1.00732 1 3.2459 1 6.00732V7.62225"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    stroke-linecap="round"
                                />
                                <circle cx="6.05005" cy="9.05713" r="1.25" fill="currentColor" />
                                <circle cx="11.05" cy="9.05713" r="1.25" fill="currentColor" />
                                <circle cx="16.05" cy="9.05713" r="1.25" fill="currentColor" />
                            </svg>
                        </div>
                        <div class="mt-10 text-center ltr:lg:text-right rtl:lg:text-left">
                            <button type="button" class="btn bg-gray px-12 capitalize text-white dark:bg-white dark:text-black dark:hover:bg-secondary">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import LogoSlider from '@/components/LogoSlider.vue';
    import CountUp from 'vue-countup-v3';
    import Modal from '@/components/Modal.vue';
    import VueCollapsible from 'vue-height-collapsible/vue3';
    import { useAppStore } from '@/stores/index';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Navigation, Autoplay } from 'swiper';
    import 'swiper/css';
    import 'swiper/css/navigation';
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
