<template>
    <div>
        <section class="relative">
            <div class="h-[450px] w-full md:h-[550px] lg:h-[728px]">
                <img src="/assets/images/portfolio-2/portfolio-banner-min.jpg" class="h-full w-full object-cover" alt="" />
            </div>
            <div class="absolute inset-0 z-[1] bg-black/90"></div>
            <div class="absolute inset-x-0 top-1/2 z-[1] -translate-y-1/2">
                <div class="container">
                    <div class="text-center text-white md:max-w-[675px] ltr:md:text-left rtl:md:text-right">
                        <h2 class="text-3xl font-black sm:text-4xl md:text-6xl md:leading-[75px]">
                            We are happy to <span class="text-secondary">build</span> Your Best <span class="text-primary">Business</span>
                        </h2>
                        <p class="mt-5 text-base font-semibold sm:text-lg">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, magni iure nostrum voluptate dolore iste.
                        </p>
                        <router-link to="/contact-us" class="btn mt-5 py-[19px] px-8 text-white shadow-[10px_15px_30px_rgba(119,128,161,0.2)]"
                            >Contact us</router-link
                        >
                    </div>
                </div>
            </div>
        </section>

        <section class="relative mt-12 pb-12 lg:mt-24 lg:pb-24">
            <div class="absolute inset-y-0 right-0 h-full xl:w-3/5">
                <img src="/assets/images/portfolio-2/beautiful-brands.png" class="h-full w-full object-cover" alt="" />
            </div>
            <div class="container">
                <div class="relative z-[1]">
                    <h2 class="text-[64px] font-extrabold leading-[60px] ltr:text-right rtl:text-left sm:text-8xl lg:text-[180px] lg:leading-[225px]">
                        We create
                    </h2>
                    <h2 class="text-[64px] font-extrabold leading-[60px] text-primary sm:text-8xl lg:text-[180px] lg:leading-[225px]">Beautiful</h2>
                    <div class="flex flex-col justify-between md:flex-row">
                        <div class="order-2 mt-5 md:order-1 md:mt-0">
                            <p class="text-center text-lg font-normal sm:text-left">
                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
                                injected humour, or randomised words which don't look even slightly believable.
                            </p>
                            <div class="text-center md:text-left">
                                <router-link to="/about-us" class="btn mt-6 bg-secondary text-white shadow-[10px_15px_30px_rgba(119,128,161,0.2)] hover:bg-primary"
                                    >About us</router-link
                                >
                            </div>
                        </div>
                        <div class="order-1 md:order-2">
                            <h2 class="text-[64px] font-extrabold leading-[60px] ltr:text-right rtl:text-left sm:text-8xl lg:text-[180px] lg:leading-[225px]">
                                Brands
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-gradient-to-t from-transparent to-white/60 py-12 dark:to-white/10 lg:py-24">
            <div class="container">
                <div class="heading text-center">
                    <h4>OUR <span class="text-secondary">PORTFOLIO</span></h4>
                    <p class="mx-auto mt-2 xl:max-w-xl">
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                    </p>
                </div>
                <ul class="filters realestate-filter mb-14 flex gap-5 overflow-x-auto whitespace-nowrap pb-2.5 sm:gap-[30px] md:justify-center">
                    <li class="filter" :class="{ active: activeTab === 'all' }">
                        <button
                            type="button"
                            class="bg-gray/[0.08] py-[15px] px-5 text-base font-bold text-gray duration-200 dark:bg-white dark:hover:bg-primary"
                            @click="activeTab = 'all'"
                        >
                            All
                        </button>
                    </li>
                    <li class="filter" :class="{ active: activeTab === 'branding' }">
                        <button
                            type="button"
                            class="bg-gray/[0.08] py-[15px] px-5 text-base font-bold text-gray duration-200 hover:bg-primary hover:text-white dark:bg-white dark:hover:bg-primary"
                            @click="activeTab = 'branding'"
                        >
                            Branding
                        </button>
                    </li>
                    <li class="filter" :class="{ active: activeTab === 'designing' }">
                        <button
                            type="button"
                            class="bg-gray/[0.08] py-[15px] px-5 text-base font-bold text-gray duration-200 hover:bg-primary hover:text-white dark:bg-white dark:hover:bg-primary"
                            @click="activeTab = 'designing'"
                        >
                            Designing
                        </button>
                    </li>
                    <li class="filter" :class="{ active: activeTab === 'photography' }">
                        <button
                            type="button"
                            class="bg-gray/[0.08] py-[15px] px-5 text-base font-bold text-gray duration-200 hover:bg-primary hover:text-white dark:bg-white dark:hover:bg-primary"
                            @click="activeTab = 'photography'"
                        >
                            Photography
                        </button>
                    </li>
                    <li class="filter" :class="{ active: activeTab === 'development' }">
                        <button
                            type="button"
                            class="bg-gray/[0.08] py-[15px] px-5 text-base font-bold text-gray duration-200 hover:bg-primary hover:text-white dark:bg-white dark:hover:bg-primary"
                            @click="activeTab = 'development'"
                        >
                            Development
                        </button>
                    </li>
                </ul>
            </div>
            <div class="projects grid grid-cols-3 gap-x-2 gap-y-1.5 md:grid-cols-5">
                <div class="project space-y-2" :class="activeTab === 'all' || activeTab === 'branding' ? 'block' : 'hidden'">
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio1.jpg" alt="" />
                    </a>
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio6.jpg" alt="" />
                    </a>
                </div>
                <div class="project space-y-2" :class="activeTab === 'all' || activeTab === 'designing' ? 'block' : 'hidden'">
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio2.jpg" alt="" />
                    </a>
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio7.jpg" alt="" />
                    </a>
                </div>
                <div class="project space-y-2" :class="activeTab === 'all' || activeTab === 'photography' ? 'block' : 'hidden'">
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio3.jpg" alt="" />
                    </a>
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio8.jpg" alt="" />
                    </a>
                </div>
                <div class="project space-y-2" :class="activeTab === 'all' || activeTab === 'development' ? 'block' : 'hidden'">
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio4.jpg" alt="" />
                    </a>
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio9.jpg" alt="" />
                    </a>
                </div>
                <div class="project space-y-2" :class="activeTab === 'all' || activeTab === 'branding' ? 'block' : 'hidden'">
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio5.jpg" alt="" />
                    </a>
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio10.jpg" alt="" />
                    </a>
                </div>
                <div class="project space-y-2" :class="activeTab === 'all' || activeTab === 'designing' ? 'block' : 'hidden'">
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio11.jpg" alt="" />
                    </a>
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio16.jpg" alt="" />
                    </a>
                </div>
                <div class="project space-y-2" :class="activeTab === 'all' || activeTab === 'photography' ? 'block' : 'hidden'">
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio12.jpg" alt="" />
                    </a>
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio17.jpg" alt="" />
                    </a>
                </div>
                <div class="project space-y-2" :class="activeTab === 'all' || activeTab === 'development' ? 'block' : 'hidden'">
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio13.jpg" alt="" />
                    </a>
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio18.jpg" alt="" />
                    </a>
                </div>
                <div class="project space-y-2" :class="activeTab === 'all' || activeTab === 'branding' ? 'block' : 'hidden'">
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio14.jpg" alt="" />
                    </a>
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio19.jpg" alt="" />
                    </a>
                </div>
                <div class="project space-y-2" :class="activeTab === 'all' || activeTab === 'designing' ? 'block' : 'hidden'">
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio15.jpg" alt="" />
                    </a>
                    <a href="javascript:" class="flex">
                        <img class="h-full w-full object-cover" src="/assets/images/portfolio-2/portfolio20.jpg" alt="" />
                    </a>
                </div>
            </div>
            <div class="pt-6 text-center lg:pt-12">
                <a href="javascript:" class="btn py-[19px] px-8 text-white shadow-[10px_15px_30px_rgba(119,128,161,0.2)]">SEE MORE</a>
            </div>
        </section>

        <section class="relative overflow-hidden bg-black py-12 lg:py-24">
            <div class="absolute top-0 ltr:right-0 rtl:left-0 rtl:-rotate-180">
                <svg width="758" height="741" viewBox="0 0 758 741" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.03">
                        <ellipse
                            opacity="0.1"
                            cx="752"
                            cy="370.646"
                            rx="750"
                            ry="749.646"
                            stroke="white"
                            stroke-width="3"
                            stroke-miterlimit="4.62023"
                            stroke-linecap="round"
                            stroke-dasharray="35 50 15 15"
                        />
                        <path
                            opacity="0.1"
                            d="M1443.13 370.646C1443.13 752.153 1133.7 1061.43 752 1061.43C370.296 1061.43 60.8655 752.153 60.8655 370.646C60.8655 -10.8606 370.296 -320.134 752 -320.134C1133.7 -320.134 1443.13 -10.8606 1443.13 370.646Z"
                            stroke="white"
                            stroke-width="3"
                        />
                        <ellipse
                            opacity="0.2"
                            cx="752"
                            cy="370.646"
                            rx="634.561"
                            ry="634.207"
                            stroke="white"
                            stroke-width="3"
                            stroke-miterlimit="4.62023"
                            stroke-linecap="round"
                            stroke-dasharray="35 50 15 15"
                        />
                        <path
                            opacity="0.3"
                            d="M1328.4 370.646C1328.4 688.789 1070.34 946.696 752 946.696C433.66 946.696 175.596 688.789 175.596 370.646C175.596 52.5037 433.66 -205.403 752 -205.403C1070.34 -205.403 1328.4 52.5037 1328.4 370.646Z"
                            stroke="white"
                            stroke-width="3"
                        />
                        <ellipse
                            opacity="0.4"
                            cx="752"
                            cy="370.646"
                            rx="519.83"
                            ry="519.476"
                            stroke="white"
                            stroke-width="3"
                            stroke-miterlimit="4.62023"
                            stroke-linecap="round"
                            stroke-dasharray="35 50 15 15"
                        />
                        <path
                            opacity="0.5"
                            d="M1211.55 370.646C1211.55 624.251 1005.8 829.84 752 829.84C498.197 829.84 292.452 624.251 292.452 370.646C292.452 117.041 498.197 -88.5479 752 -88.5479C1005.8 -88.5479 1211.55 117.041 1211.55 370.646Z"
                            stroke="white"
                            stroke-width="3"
                        />
                        <path
                            opacity="0.6"
                            d="M1155.6 370.646C1155.6 593.351 974.903 773.891 752 773.891C529.097 773.891 348.401 593.351 348.401 370.646C348.401 147.942 529.097 -32.5986 752 -32.5986C974.903 -32.5986 1155.6 147.942 1155.6 370.646Z"
                            stroke="white"
                            stroke-width="3"
                        />
                        <ellipse
                            opacity="0.7"
                            cx="752"
                            cy="370.646"
                            rx="350.567"
                            ry="350.212"
                            stroke="white"
                            stroke-width="3"
                            stroke-miterlimit="4.62023"
                            stroke-linecap="round"
                            stroke-dasharray="35 50 15 15"
                        />
                        <path
                            opacity="0.8"
                            d="M1040.16 370.647C1040.16 529.596 911.148 658.453 752 658.453C592.852 658.453 463.84 529.596 463.84 370.647C463.84 211.698 592.852 82.8408 752 82.8408C911.148 82.8408 1040.16 211.698 1040.16 370.647Z"
                            stroke="white"
                            stroke-width="3"
                        />
                        <ellipse
                            opacity="0.9"
                            cx="752"
                            cy="370.646"
                            rx="223.088"
                            ry="222.734"
                            stroke="white"
                            stroke-width="3"
                            stroke-miterlimit="4.62023"
                            stroke-linecap="round"
                            stroke-dasharray="35 50 15 15"
                        />
                        <path
                            d="M909.848 370.646C909.848 457.624 839.18 528.14 752 528.14C664.82 528.14 594.152 457.624 594.152 370.646C594.152 283.667 664.82 213.151 752 213.151C839.18 213.151 909.848 283.667 909.848 370.646Z"
                            stroke="white"
                            stroke-width="3"
                        />
                        <ellipse
                            cx="752"
                            cy="370.646"
                            rx="106.941"
                            ry="106.586"
                            stroke="white"
                            stroke-width="3"
                            stroke-miterlimit="4.62023"
                            stroke-linecap="round"
                            stroke-dasharray="35 50 15 15"
                        />
                    </g>
                </svg>
            </div>
            <div class="container relative">
                <div class="heading overflow-hidden !pb-0 text-center">
                    <h6>Testimonial</h6>
                    <h4 class="!text-white">Feedback from our clients</h4>
                </div>
                <testimonial type="marketing" :feedbacks="feedbacks"></testimonial>
            </div>
        </section>

        <section class="py-12 dark:bg-black lg:py-24">
            <div class="swiper industry-slider px-5">
                <div class="container">
                    <div class="heading text-center">
                        <h4 class="mb-3">OUR <span class="text-primary">BEST PARTNERS</span></h4>
                        <p class="mx-auto xl:max-w-xl">
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                        </p>
                    </div>
                </div>
                <LogoSlider></LogoSlider>
            </div>
        </section>

        <section class="bg-gradient-to-t from-transparent to-white py-14 dark:bg-gray-dark dark:to-transparent lg:py-[100px]">
            <div class="container">
                <div class="relative z-10 lg:flex">
                    <div class="heading text-center lg:mb-0 lg:w-1/3 ltr:lg:pr-10 ltr:lg:text-left rtl:lg:pl-10 rtl:lg:text-right">
                        <h6>Get In Touch.</h6>
                        <h4 class="sm:!leading-[50px]">Ready to Get Started?</h4>
                        <img src="/assets/images/form-img.png" alt="form-img" class="mx-auto" data-aos="fade-right" data-aos-duration="1000" />
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
    import Testimonial from '@/components/Testimonial.vue';
    const activeTab = ref('all');
    const feedbacks = ref([
        {
            id: 1,
            name: 'Allan Branch',
            role: 'CEO of Lifted',
            thumbnail: '/assets/images/testimonial2.png',
            message:
                'An amazing services. We have a great business relationship with this agency, They help bring our vision to life in a way that makes sense. SEO work execute really well. great & phenomenal experience.',
        },
    ]);
</script>
