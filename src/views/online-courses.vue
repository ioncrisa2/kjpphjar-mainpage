<template>
    <div>
        <div class="overflow-hidden bg-black pt-[82px] sm:-mx-[250px] sm:rounded-b-[50%] lg:-mx-[150px] lg:pt-[106px]">
            <div class="relative">
                <img src="/assets/images/banner-lefticon.png" alt="banner-lefticon" class="absolute left-0 top-20 sm:left-[250px] lg:left-[150px]" />
                <img src="/assets/images/banner-rightIcon.png" alt="banner-rightIcon" class="absolute right-0 -top-4 sm:right-[250px] lg:right-[150px]" />
                <div class="container">
                    <div class="relative">
                        <img
                            src="/assets/images/online-courses/ABC.svg"
                            alt=""
                            class="absolute top-56 ltr:-left-24 rtl:-right-24"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                        />
                        <img
                            src="/assets/images/online-courses/books.svg"
                            alt=""
                            class="absolute top-20 ltr:-right-24 rtl:-left-24 sm:ltr:-right-14 sm:rtl:-left-14"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                        />
                        <div class="bg-[url(/assets/images/online-courses/banner-bg-icon.png)] bg-cover bg-center bg-no-repeat">
                            <div class="relative bg-[url(/assets/images/world-map.png)] bg-cover bg-top bg-no-repeat py-14 lg:pt-20 lg:pb-60 xl:pt-32">
                                <div class="relative z-[1] mx-auto text-center text-white sm:w-3/4">
                                    <h2 class="text-4xl font-extrabold leading-normal sm:text-5xl lg:text-[70px] lg:leading-[90px]">
                                        Invest your
                                        <span
                                            class="relative text-secondary after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded after:bg-gradient-to-r after:from-secondary after:to-transparent"
                                            >time</span
                                        >
                                        to get
                                        <span
                                            class="relative text-primary after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded after:bg-gradient-to-r after:from-primary after:to-transparent"
                                            >knowledge</span
                                        >
                                    </h2>
                                    <p class="my-8 mx-auto text-lg lg:w-3/4">
                                        Our mission is to help people to find the best course online and learn with expert anytime, anywhere.
                                    </p>
                                    <router-link to="/about-us" class="btn mx-auto mt-2 block w-fit bg-white">Know More</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-[url(/assets/images/online-courses/line-bg.png)] bg-[length:1052px] bg-center bg-repeat-y">
            <div class="lg:-mt-60">
                <div class="container">
                    <div class="relative pt-14 pb-10 lg:pt-20 lg:pb-5">
                        <div class="bottom-0 grid w-full grid-cols-2 justify-between gap-5 md:flex">
                            <div class="h-80 lg:-mt-24 lg:w-52" data-aos="fade-up" data-aos-duration="1000">
                                <div class="h-full overflow-hidden rounded-3xl md:rounded-[110px]">
                                    <img src="/assets/images/online-courses/person-1.jpg" alt="" class="h-full w-full object-cover object-top" />
                                </div>
                            </div>
                            <div class="relative h-80 lg:w-52" data-aos="fade-up" data-aos-duration="1000">
                                <img src="/assets/images/online-courses/pink-arrow.svg" alt="" class="absolute -top-5 hidden ltr:left-5 rtl:right-6 md:block" />
                                <div class="h-full overflow-hidden rounded-3xl md:rounded-[110px]">
                                    <img src="/assets/images/online-courses/person-2.jpg" alt="" class="h-full w-full object-cover object-top" />
                                </div>
                            </div>
                            <div class="relative h-80 lg:w-52" data-aos="fade-up" data-aos-duration="1000">
                                <img
                                    src="/assets/images/online-courses/yellow-arrow.svg"
                                    alt=""
                                    class="absolute -top-5 hidden ltr:right-5 rtl:left-5 md:block"
                                />
                                <div class="h-full overflow-hidden rounded-3xl md:rounded-[110px]">
                                    <img src="/assets/images/online-courses/person-3.jpg" alt="" class="h-full w-full object-cover object-top" />
                                </div>
                            </div>
                            <div class="relative h-80 lg:-mt-24 lg:w-52" data-aos="fade-up" data-aos-duration="1000">
                                <img
                                    src="/assets/images/online-courses/graduate-icon.svg"
                                    alt=""
                                    class="absolute -top-[100px] left-1/2 hidden -translate-x-1/2 md:block"
                                />
                                <div class="h-full overflow-hidden rounded-3xl md:rounded-[110px]">
                                    <img src="/assets/images/online-courses/person-4.jpg" alt="" class="h-full w-full object-cover object-top" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section class="bg-gradient-to-t from-white/5 to-transparent py-14 dark:from-white/[0.02] lg:py-20">
                <div class="container">
                    <div class="heading text-center">
                        <h6 class="!text-secondary">Team. Students. Support</h6>
                        <h4>
                            As featured with
                            <span class="relative text-primary">
                                educational
                                <img
                                    src="/assets/images/online-courses/star-heading-icon.svg"
                                    alt=""
                                    class="absolute right-1 top-1/2 hidden -translate-y-1/2 md:block"
                                />
                            </span>
                            partner
                        </h4>
                    </div>
                    <swiper
                        class="py-4"
                        :loop="true"
                        slidesPerView="auto"
                        :spaceBetween="30"
                        :speed="2500"
                        :autoplay="{
                            delay: 3000,
                            disableOnInteraction: false,
                        }"
                        :modules="[Autoplay]"
                        :breakpoints="{
                            320: {
                                slidesPerView: 1.7,
                            },
                            600: {
                                slidesPerView: 3,
                            },
                            1000: {
                                slidesPerView: 4,
                            },
                            1600: {
                                slidesPerView: 6,
                            },
                        }"
                        :dir="store.direction === 'rtl' ? 'rtl' : 'ltr'"
                        :key="store.direction === 'rtl' ? 'true' : 'false'"
                    >
                        <swiper-slide>
                            <div class="flex h-20 w-20 items-center justify-center rounded-[32px] bg-transparent p-5 dark:bg-black md:h-40 md:w-40">
                                <a href="javascript:" class="flex items-center gap-3">
                                    <div>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_298_1769)">
                                                <mask
                                                    id="mask0_298_1769"
                                                    style="mask-type: alpha"
                                                    maskUnits="userSpaceOnUse"
                                                    x="0"
                                                    y="0"
                                                    width="30"
                                                    height="30"
                                                >
                                                    <circle cx="15" cy="15" r="15" fill="#C4C4C4" />
                                                </mask>
                                                <g mask="url(#mask0_298_1769)">
                                                    <circle cx="7.86398" cy="-2.66231" r="12.4449" transform="rotate(-22 7.86398 -2.66231)" fill="#47BDFF" />
                                                    <circle cx="22.1375" cy="32.6639" r="12.4449" transform="rotate(-22 22.1375 32.6639)" fill="#47BDFF" />
                                                    <circle cx="-2.6629" cy="22.1365" r="12.4449" transform="rotate(-22 -2.6629 22.1365)" fill="#B476E5" />
                                                    <circle cx="32.337" cy="7.05449" r="12.4449" transform="rotate(-22 32.337 7.05449)" fill="#B476E5" />
                                                </g>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_298_1769">
                                                    <rect width="30" height="30" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <span class="text-xl font-bold text-black dark:text-white">Camera</span>
                                </a>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="flex h-20 w-20 items-center justify-center rounded-[32px] bg-transparent p-5 dark:bg-black md:h-40 md:w-40">
                                <a href="javascript:" class="flex items-center gap-3">
                                    <div>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M2 12.7576C2 6.26406 7.26406 1 13.7576 1V17.2417C13.7576 23.7352 8.49355 28.9993 2 28.9993V12.7576Z"
                                                fill="#FFBD11"
                                            />
                                            <path
                                                d="M15.4633 7.38899C15.4633 3.86045 18.3237 1 21.8522 1C25.3808 1 28.2412 3.86045 28.2412 7.38899V7.75786C28.2412 11.2864 25.3808 14.1469 21.8522 14.1469C18.3237 14.1469 15.4633 11.2864 15.4633 7.75786V7.38899Z"
                                                fill="#47BDFF"
                                            />
                                            <path
                                                d="M15.4633 22.2425C15.4633 18.714 18.3237 15.8535 21.8522 15.8535C25.3808 15.8535 28.2412 18.714 28.2412 22.2425V22.6114C28.2412 26.1399 25.3808 29.0004 21.8522 29.0004C18.3237 29.0004 15.4633 26.1399 15.4633 22.6114V22.2425Z"
                                                fill="#B476E5"
                                            />
                                        </svg>
                                    </div>
                                    <span class="text-xl font-bold text-black dark:text-white">Startup</span>
                                </a>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="flex h-20 w-20 items-center justify-center rounded-[32px] bg-transparent p-5 dark:bg-black md:h-40 md:w-40">
                                <a href="javascript:" class="flex items-center gap-3">
                                    <div>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_301_1299)">
                                                <rect x="5.55554" y="5.55469" width="18.8889" height="18.8889" rx="8" fill="#47BDFF" />
                                                <rect x="9.42285" width="2.88247" height="4.44444" rx="1.44123" fill="#B476E5" />
                                                <rect x="13.559" width="2.88247" height="4.44444" rx="1.44123" fill="#B476E5" />
                                                <rect x="17.696" width="2.88247" height="4.44444" rx="1.44123" fill="#B476E5" />
                                                <rect
                                                    y="20.5762"
                                                    width="2.88247"
                                                    height="4.44444"
                                                    rx="1.44123"
                                                    transform="rotate(-90 0 20.5762)"
                                                    fill="#B476E5"
                                                />
                                                <rect
                                                    y="16.4395"
                                                    width="2.88247"
                                                    height="4.44444"
                                                    rx="1.44123"
                                                    transform="rotate(-90 0 16.4395)"
                                                    fill="#B476E5"
                                                />
                                                <rect
                                                    y="12.3047"
                                                    width="2.88247"
                                                    height="4.44444"
                                                    rx="1.44123"
                                                    transform="rotate(-90 0 12.3047)"
                                                    fill="#B476E5"
                                                />
                                                <rect
                                                    x="25.5558"
                                                    y="20.5762"
                                                    width="2.88247"
                                                    height="4.44444"
                                                    rx="1.44123"
                                                    transform="rotate(-90 25.5558 20.5762)"
                                                    fill="#B476E5"
                                                />
                                                <rect
                                                    x="25.5558"
                                                    y="16.4395"
                                                    width="2.88247"
                                                    height="4.44444"
                                                    rx="1.44123"
                                                    transform="rotate(-90 25.5558 16.4395)"
                                                    fill="#B476E5"
                                                />
                                                <rect
                                                    x="25.5558"
                                                    y="12.3047"
                                                    width="2.88247"
                                                    height="4.44444"
                                                    rx="1.44123"
                                                    transform="rotate(-90 25.5558 12.3047)"
                                                    fill="#B476E5"
                                                />
                                                <rect x="9.42285" y="25.5547" width="2.88247" height="4.44444" rx="1.44123" fill="#B476E5" />
                                                <rect x="13.559" y="25.5547" width="2.88247" height="4.44444" rx="1.44123" fill="#B476E5" />
                                                <rect x="17.696" y="25.5547" width="2.88247" height="4.44444" rx="1.44123" fill="#B476E5" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_301_1299">
                                                    <rect width="30" height="30" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <span class="text-xl font-bold text-black dark:text-white">Software</span>
                                </a>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="flex h-20 w-20 items-center justify-center rounded-[32px] bg-transparent p-5 dark:bg-black md:h-40 md:w-40">
                                <a href="javascript:" class="flex items-center gap-3">
                                    <div>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M16.7705 5.24752C16.7705 3.4509 18.9554 2.56542 20.2062 3.85514L29.1466 13.0738C29.5085 13.4469 29.7109 13.9463 29.7109 14.4661V25.0644C29.7109 26.861 27.526 27.7465 26.2752 26.4568L17.3348 17.2381C16.9729 16.865 16.7705 16.3656 16.7705 15.8457V5.24752Z"
                                                fill="#47BDFF"
                                            />
                                            <path
                                                d="M8.75098 4.93502C8.75098 3.1384 10.9359 2.25292 12.1867 3.54264L21.1271 12.7613C21.489 13.1344 21.6914 13.6338 21.6914 14.1536V24.7519C21.6914 26.5485 19.5064 27.434 18.2556 26.1443L9.31526 16.9256C8.95337 16.5525 8.75098 16.0531 8.75098 15.5332V4.93502Z"
                                                fill="#FFBD11"
                                            />
                                            <path
                                                d="M1 5.24752C1 3.4509 3.18492 2.56542 4.43571 3.85514L13.3761 13.0738C13.738 13.4469 13.9404 13.9463 13.9404 14.4661V25.0644C13.9404 26.861 11.7555 27.7465 10.5047 26.4568L1.56429 17.2381C1.20239 16.865 1 16.3656 1 15.8457V5.24752Z"
                                                fill="#B476E5"
                                            />
                                        </svg>
                                    </div>
                                    <span class="text-xl font-bold text-black dark:text-white">Techlify</span>
                                </a>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="flex h-20 w-20 items-center justify-center rounded-[32px] bg-transparent p-5 dark:bg-black md:h-40 md:w-40">
                                <a href="javascript:" class="flex items-center gap-3">
                                    <div>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <mask id="mask0_301_1325" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="1" y="0" width="28" height="30">
                                                <path
                                                    d="M12.0903 0.695468C13.6964 -0.231822 15.6753 -0.231823 17.2814 0.695467L25.7762 5.59995C27.3823 6.52724 28.3717 8.24094 28.3717 10.0955V19.9045C28.3717 21.7591 27.3823 23.4728 25.7762 24.4001L17.2814 29.3045C15.6753 30.2318 13.6964 30.2318 12.0903 29.3045L3.59552 24.4001C1.98941 23.4728 1 21.7591 1 19.9045V10.0955C1 8.24094 1.98941 6.52724 3.59552 5.59995L12.0903 0.695468Z"
                                                    fill="#C4C4C4"
                                                />
                                            </mask>
                                            <g mask="url(#mask0_301_1325)">
                                                <rect
                                                    width="17.3224"
                                                    height="17.3224"
                                                    transform="matrix(0.866025 0.5 -0.866025 0.5 14.686 -1.06055)"
                                                    fill="#B476E5"
                                                />
                                                <rect
                                                    width="15.939"
                                                    height="15.939"
                                                    transform="matrix(0.866025 0.5 -2.20305e-08 1 0.881958 7.72656)"
                                                    fill="#47BDFF"
                                                />
                                                <rect
                                                    width="15.939"
                                                    height="15.939"
                                                    transform="matrix(0.866025 -0.5 2.20305e-08 1 14.686 15.6973)"
                                                    fill="#FFBD11"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                    <span class="text-xl font-bold text-black dark:text-white">Blockly</span>
                                </a>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="flex h-20 w-20 items-center justify-center rounded-[32px] bg-transparent p-5 dark:bg-black md:h-40 md:w-40">
                                <a href="javascript:" class="flex items-center gap-3">
                                    <div>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12.7673 26.3704C12.5926 26.3704 12.4091 26.3529 12.2256 26.3005C11.0285 26.0034 10.2946 24.7888 10.5916 23.5918L15.0653 5.69711C15.3711 4.50006 16.5857 3.77484 17.7827 4.06318C18.9798 4.36899 19.705 5.58353 19.4079 6.78058L14.9342 24.6753C14.6809 25.6888 13.7721 26.3704 12.7673 26.3704Z"
                                                fill="#47BDFF"
                                            />
                                            <path
                                                d="M23.2896 21.8976C22.7129 21.8976 22.1449 21.6791 21.7081 21.2422C20.8343 20.3685 20.8343 18.953 21.7081 18.0792L24.6002 15.1871L21.7081 12.2949C20.8343 11.4211 20.8343 10.0056 21.7081 9.13189C22.5818 8.25812 23.9973 8.25812 24.8711 9.13189L29.3448 13.6056C30.2185 14.4793 30.2185 15.8948 29.3448 16.7686L24.8711 21.2422C24.4342 21.6791 23.8663 21.8976 23.2896 21.8976Z"
                                                fill="#B476E5"
                                            />
                                            <path
                                                d="M6.7105 21.8976C6.13382 21.8976 5.56587 21.6791 5.12899 21.2422L0.655323 16.7686C-0.218441 15.8948 -0.218441 14.4793 0.655323 13.6056L5.12899 9.13189C6.00275 8.25812 7.41825 8.25812 8.29201 9.13189C9.16578 10.0056 9.16578 11.4211 8.29201 12.2949L5.39986 15.1871L8.29201 18.0792C9.16578 18.953 9.16578 20.3685 8.29201 21.2422C7.85513 21.6791 7.28718 21.8976 6.7105 21.8976Z"
                                                fill="#B476E5"
                                            />
                                        </svg>
                                    </div>
                                    <span class="text-xl font-bold text-black dark:text-white">Codelify</span>
                                </a>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="flex h-20 w-20 items-center justify-center rounded-[32px] bg-transparent p-5 dark:bg-black md:h-40 md:w-40">
                                <a href="javascript:" class="flex items-center gap-3">
                                    <div>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect y="3" width="28.5828" height="24.7945" rx="2" fill="#47BDFF" />
                                            <path
                                                d="M28.0001 10.8555H15.9614C14.8569 10.8555 13.9614 11.7509 13.9614 12.8555V17.9394C13.9614 19.044 14.8569 19.9394 15.9614 19.9394H28.0001C29.1046 19.9394 30.0001 19.044 30.0001 17.9394V12.8555C30.0001 11.7509 29.1046 10.8555 28.0001 10.8555Z"
                                                fill="#B476E5"
                                            />
                                            <circle cx="18.3508" cy="15.3979" r="2.27099" fill="white" />
                                        </svg>
                                    </div>
                                    <span class="text-xl font-bold text-black dark:text-white">Financely</span>
                                </a>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="flex h-20 w-20 items-center justify-center rounded-[32px] bg-transparent p-5 dark:bg-black md:h-40 md:w-40">
                                <a href="javascript:" class="flex items-center gap-3">
                                    <div>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M14.4159 6.37499C14.4159 3.95781 12.8496 2 10.9159 2C8.98433 2 7.41589 3.95781 7.41589 6.37499C7.41589 8.78998 8.98433 10.75 10.9159 10.75C12.8496 10.75 14.4159 8.78998 14.4159 6.37499Z"
                                                fill="#B476E5"
                                            />
                                            <path
                                                d="M7.99998 12.791C7.99998 10.3738 6.43373 8.41602 4.49999 8.41602C2.56625 8.41602 1 10.3738 1 12.791C1 15.2082 2.56625 17.166 4.49999 17.166C6.43373 17.166 7.99998 15.2082 7.99998 12.791Z"
                                                fill="#B476E5"
                                            />
                                            <path
                                                d="M29 12.791C29 10.3738 27.4337 8.41602 25.5 8.41602C23.5662 8.41602 22 10.3738 22 12.791C22 15.2082 23.5662 17.166 25.5 17.166C27.4337 17.166 29 15.2082 29 12.791Z"
                                                fill="#B476E5"
                                            />
                                            <path
                                                d="M22.5841 6.37499C22.5841 3.95781 21.0157 2 19.0841 2C17.1504 2 15.5841 3.95781 15.5841 6.37499C15.5841 8.78998 17.1504 10.75 19.0841 10.75C21.0157 10.75 22.5841 8.78998 22.5841 6.37499Z"
                                                fill="#B476E5"
                                            />
                                            <path
                                                d="M24.8808 23.0331C24.7561 21.8825 24.3864 20.7712 23.7958 19.7759C23.5267 19.3362 23.2708 18.9009 23.017 18.4787C20.928 14.9569 19.1255 11.9141 14.9999 11.9141C10.8743 11.9141 9.08052 14.9569 6.99147 18.4787C6.73991 18.9031 6.48178 19.3362 6.21272 19.7781C5.6221 20.7712 5.25022 21.8825 5.12772 23.0331C4.9571 24.4922 5.41866 25.9556 6.39647 27.0537C7.40709 28.1846 8.85303 28.8321 10.3711 28.83H19.6374C21.1555 28.8321 22.6014 28.1846 23.612 27.0537C24.5877 25.9556 25.0492 24.4922 24.8808 23.0331Z"
                                                fill="#47BDFF"
                                            />
                                        </svg>
                                    </div>
                                    <span class="text-xl font-bold text-black dark:text-white">Veterinary</span>
                                </a>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
            </section>

            <section class="-mb-12 bg-white/5 dark:bg-white/[0.02]">
                <div class="container">
                    <div class="relative z-[1] lg:-mx-8">
                        <div class="mx-4 grid gap-14 rounded-b-[20px] bg-white py-14 px-4 dark:bg-black md:gap-24 lg:grid-cols-2 lg:py-28">
                            <div class="relative" data-aos="fade-up" data-aos-duration="1000">
                                <div class="bottom-0 h-full overflow-hidden ltr:right-0 rtl:left-0 lg:absolute lg:w-[640px]">
                                    <img src="/assets/images/online-courses/features-img.png" alt="" class="h-full w-full object-cover" />
                                </div>
                                <img src="/assets/images/online-courses/pink-top-arrow.svg" alt="" class="absolute -bottom-8 rtl:-left-14 lg:ltr:-right-14" />
                            </div>
                            <div>
                                <div class="text-center ltr:lg:text-left rtl:lg:text-right">
                                    <div class="heading mb-5 text-center ltr:lg:text-left rtl:lg:text-right xl:w-[95%]">
                                        <h6>Our features</h6>
                                        <h4>Access to learning anytime & anywhere</h4>
                                    </div>
                                    <p class="pb-10 font-semibold leading-[30px] sm:text-lg">
                                        This very extraordinary feature, can make learning activities more efficient. make it easier for all student to do
                                        learning through digital media with existing media and online platforms.
                                    </p>
                                    <a href="javascript:" class="btn bg-secondary capitalize text-white hover:bg-primary sm:px-14 sm:py-5">Know more</a>
                                </div>
                            </div>
                        </div>
                        <div class="absolute inset-x-0 -bottom-4 -z-[1] h-full w-full rounded-[20px] bg-white/20 dark:bg-white/[0.02]"></div>
                    </div>
                </div>
            </section>

            <section class="relative bg-black bg-[url(/assets/images/overlay-noise.png)] bg-cover bg-no-repeat">
                <img src="/assets/images/online-courses/student-attraction-icon.svg" alt="" class="absolute top-5 ltr:right-5 rtl:left-5 rtl:rotate-y-180" />
                <div class="container">
                    <div class="relative pt-40 pb-48">
                        <img
                            src="/assets/images/online-courses/man_123_icon.png"
                            alt=""
                            class="absolute bottom-0 -left-96 hidden w-80 xl:block"
                            data-aos="fade-right"
                            data-aos-duration="1000"
                        />
                        <div class="heading text-center">
                            <h6 class="!text-secondary">Students attraction</h6>
                            <h4 class="!text-white">Our Impact on Online learning</h4>
                        </div>
                        <div class="grid gap-[30px] sm:grid-cols-2 md:grid-cols-3 md:pt-12">
                            <div data-aos="fade-up" data-aos-duration="1000">
                                <div class="group flex cursor-pointer items-baseline justify-center rounded-3xl">
                                    <div>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-secondary">
                                            <g clip-path="url(#clip0_311_20117)">
                                                <path
                                                    opacity="0.3"
                                                    d="M10.5642 26.565C10.1817 25.962 10.6585 25.2347 11.3726 25.2347H17.8992C18.6133 25.2347 19.0901 25.962 18.7076 26.565C17.8143 27.9734 16.5375 29.1085 15.0177 29.8297C14.776 29.9444 14.4957 29.9444 14.2541 29.8297C12.7343 29.1085 11.4575 27.9734 10.5642 26.565Z"
                                                    fill="#B476E5"
                                                />
                                                <path
                                                    d="M22.8002 17.7878C22.8002 18.0314 22.8891 18.2665 23.0502 18.4492L25.2717 20.9684C25.4328 21.1511 25.5217 21.3863 25.5217 21.6298V22.874C25.5217 23.4263 25.074 23.874 24.5217 23.874H4.75C4.19772 23.874 3.75 23.4263 3.75 22.874V21.6298C3.75 21.3863 3.83888 21.1511 3.99997 20.9684L6.22149 18.4492C6.38258 18.2665 6.47146 18.0314 6.47146 17.7878V10.2667C6.47146 5.62712 9.73668 1.66432 14.337 0.0977857C14.5306 0.0318785 14.7411 0.0318782 14.9347 0.0977854C19.535 1.66432 22.8002 5.62712 22.8002 10.2667V17.7878ZM14.6358 12.9882C15.3576 12.9882 16.0498 12.7014 16.5602 12.1911C17.0706 11.6807 17.3573 10.9885 17.3573 10.2667C17.3573 9.54493 17.0706 8.85271 16.5602 8.34234C16.0498 7.83197 15.3576 7.54524 14.6358 7.54524C13.9141 7.54524 13.2218 7.83197 12.7115 8.34234C12.2011 8.85271 11.9144 9.54493 11.9144 10.2667C11.9144 10.9885 12.2011 11.6807 12.7115 12.1911C13.2218 12.7014 13.9141 12.9882 14.6358 12.9882Z"
                                                    fill="#B476E5"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_311_20117">
                                                    <rect width="30" height="30" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div class="ltr:pl-4 rtl:pr-4">
                                        <count-up
                                            class="pb-3.5 text-4xl font-black leading-none text-white transition sm:text-[46px]"
                                            :startVal="0"
                                            :end-val="10"
                                            :duration="10"
                                            :options="{ suffix: '+' }"
                                        ></count-up>
                                        <span class="text-lg font-bold">Year in Business</span>
                                    </div>
                                </div>
                            </div>
                            <div data-aos="fade-up" data-aos-duration="1000">
                                <div class="group flex cursor-pointer items-baseline justify-center rounded-3xl">
                                    <div>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-primary">
                                            <g clip-path="url(#clip0_311_20125)">
                                                <path
                                                    opacity="0.3"
                                                    d="M4.9335 18.009C4.93261 18.009 4.93183 18.0096 4.93157 18.0104C4.69312 18.8152 4.55225 19.6456 4.512 20.484L4.5 21V29C4.5 29.5523 4.05228 30 3.5 30H1C0.447715 30 1.36975e-07 29.5523 1.36975e-07 29V23.25C-0.000295211 21.9564 0.477042 20.7082 1.34045 19.7448C2.20386 18.7815 3.39255 18.1708 4.6785 18.03L4.9335 18.009ZM25.3797 19.403C25.2751 18.7164 25.8093 18.0608 26.4657 18.2879C27.2615 18.5633 27.9862 19.0284 28.5729 19.6519C29.4894 20.6258 29.9998 21.9127 30 23.25V29C30 29.5523 29.5523 30 29 30H26.5C25.9477 30 25.5 29.5523 25.5 29V21C25.5 20.4569 25.4591 19.9237 25.3797 19.403ZM5.25 9C6.24456 9 7.19839 9.39509 7.90165 10.0983C8.60491 10.8016 9 11.7554 9 12.75C9 13.7446 8.60491 14.6984 7.90165 15.4017C7.19839 16.1049 6.24456 16.5 5.25 16.5C4.25544 16.5 3.30161 16.1049 2.59835 15.4017C1.89509 14.6984 1.5 13.7446 1.5 12.75C1.5 11.7554 1.89509 10.8016 2.59835 10.0983C3.30161 9.39509 4.25544 9 5.25 9ZM24.75 9C25.7446 9 26.6984 9.39509 27.4016 10.0983C28.1049 10.8016 28.5 11.7554 28.5 12.75C28.5 13.7446 28.1049 14.6984 27.4016 15.4017C26.6984 16.1049 25.7446 16.5 24.75 16.5C23.7554 16.5 22.8016 16.1049 22.0984 15.4017C21.3951 14.6984 21 13.7446 21 12.75C21 11.7554 21.3951 10.8016 22.0984 10.0983C22.8016 9.39509 23.7554 9 24.75 9Z"
                                                    fill="#47BDFF"
                                                />
                                                <path
                                                    d="M15 13.5C16.9891 13.5 18.8968 14.2902 20.3033 15.6967C21.7098 17.1032 22.5 19.0109 22.5 21V29C22.5 29.5523 22.0523 30 21.5 30H8.5C7.94772 30 7.5 29.5523 7.5 29V21C7.5 19.0109 8.29018 17.1032 9.6967 15.6967C11.1032 14.2902 13.0109 13.5 15 13.5ZM15 0C16.5913 0 18.1174 0.632141 19.2426 1.75736C20.3679 2.88258 21 4.4087 21 6C21 7.5913 20.3679 9.11742 19.2426 10.2426C18.1174 11.3679 16.5913 12 15 12C13.4087 12 11.8826 11.3679 10.7574 10.2426C9.63214 9.11742 9 7.5913 9 6C9 4.4087 9.63214 2.88258 10.7574 1.75736C11.8826 0.632141 13.4087 0 15 0Z"
                                                    fill="#47BDFF"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_311_20125">
                                                    <rect width="30" height="30" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div class="ltr:pl-4 rtl:pr-4">
                                        <count-up
                                            class="pb-3.5 text-4xl font-black leading-none text-white transition sm:text-[46px]"
                                            :startVal="0"
                                            :end-val="1200"
                                            :duration="10"
                                            :options="{ suffix: '+' }"
                                        ></count-up>
                                        <span class="text-lg font-bold">Students strength</span>
                                    </div>
                                </div>
                            </div>
                            <div data-aos="fade-up" data-aos-duration="1000">
                                <div class="group flex cursor-pointer items-baseline justify-center rounded-3xl">
                                    <div>
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_311_20160)">
                                                <path
                                                    d="M15 16.5C17.4855 16.5 19.5 18.5145 19.5 21C19.5 22.275 18.9705 23.424 18.12 24.243L17.043 25.2794C16.3943 25.9036 16.8362 27 17.7364 27H18.5C19.0523 27 19.5 27.4477 19.5 28V29C19.5 29.5523 19.0523 30 18.5 30H11.5C10.9477 30 10.5 29.5523 10.5 29V27.8394C10.5 27.5676 10.6107 27.3075 10.8065 27.119L16.0395 22.0815C16.3245 21.807 16.5 21.4245 16.5 21C16.5 20.172 15.828 19.5 15 19.5C14.522 19.5 14.096 19.7239 13.8213 20.0725C13.4794 20.5063 13.0523 21 12.5 21H11.5C10.9477 21 10.4885 20.5466 10.6097 20.0078C11.0615 17.9998 12.8554 16.5 15 16.5ZM23 16.5C23.5523 16.5 24 16.9477 24 17.5V21.5C24 22.0523 24.4477 22.5 25 22.5H26C26.5523 22.5 27 22.0523 27 21.5V17.5C27 16.9477 27.4477 16.5 28 16.5H29C29.5523 16.5 30 16.9477 30 17.5V29C30 29.5523 29.5523 30 29 30H28C27.4477 30 27 29.5523 27 29V26.5C27 25.9477 26.5523 25.5 26 25.5H22C21.4477 25.5 21 25.0523 21 24.5V17.5C21 16.9477 21.4477 16.5 22 16.5H23Z"
                                                    fill="#B476E5"
                                                />
                                                <path
                                                    opacity="0.3"
                                                    d="M2 15C2.55228 15 2.99563 15.4486 3.04097 15.999C3.30566 19.2121 4.83558 22.066 7.13148 24.0614C7.36052 24.2604 7.5 24.5456 7.5 24.8491V26.2593C7.5 27.0295 6.67041 27.5 6.05258 27.0402C2.6295 24.4925 0.330059 20.52 0.0327588 15.9994C-0.00348466 15.4483 0.447715 15 1 15H2ZM15 0C22.399 0 28.5476 5.35821 29.7757 12.4056C29.8772 12.9881 29.4122 13.5 28.8209 13.5H27.7901C27.2856 13.5 26.8646 13.1226 26.7655 12.628C25.6646 7.13707 20.8159 3 15 3C11.6334 3 8.59031 4.38645 6.41161 6.6186C6.04964 6.98945 6.07852 7.57852 6.44495 7.94495L7.29289 8.79289C7.92286 9.42286 7.47669 10.5 6.58579 10.5H1C0.447715 10.5 0 10.0523 0 9.5V3.91352C0 3.02271 1.07694 2.5765 1.70696 3.20626L2.91197 4.41079C3.32204 4.82068 3.99169 4.79459 4.40205 4.38499C7.11531 1.67672 10.8619 0 15 0Z"
                                                    fill="#B476E5"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_311_20160">
                                                    <rect width="30" height="30" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div class="ltr:pl-4 rtl:pr-4">
                                        <h4 class="pb-3.5 text-4xl font-black leading-none text-white transition sm:text-[46px]">24/7</h4>
                                        <span class="text-lg font-bold">Support Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="-mt-12">
                <div class="container">
                    <div class="relative z-[1] lg:-mx-8">
                        <div class="mx-4 rounded-[20px] bg-white py-14 px-4 dark:bg-black lg:px-10 lg:py-24">
                            <img
                                src="/assets/images/online-courses/cloud_girl.png"
                                alt=""
                                class="absolute -top-32 w-64 ltr:-right-32 rtl:-left-32 rtl:rotate-y-180"
                            />
                            <div class="flex flex-col items-center justify-center lg:flex-row lg:justify-between">
                                <div class="heading flex-1 text-center ltr:lg:text-left rtl:lg:text-right">
                                    <h6>Our courses</h6>
                                    <h4>Most popular courses to learning</h4>
                                </div>
                                <div class="mb-4 flex flex-none items-center justify-end gap-4 lg:mb-0">
                                    <router-link
                                        to="/blog"
                                        class="text-sm font-extrabold text-black transition hover:text-secondary dark:text-white dark:hover:text-secondary"
                                        >View All</router-link
                                    >
                                    <button
                                        type="button"
                                        class="course-slider-button-prev flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black transition hover:bg-secondary hover:text-white rtl:rotate-180 dark:bg-white/5 dark:text-white dark:hover:bg-secondary"
                                    >
                                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M5.95007 1.2002L1.48924 5.3424C1.06317 5.73803 1.06317 6.41236 1.48924 6.80799L5.95007 10.9502"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                            ></path>
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        class="course-slider-button-next text-p flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black transition hover:bg-secondary hover:text-white rtl:rotate-180 dark:bg-white/5 dark:text-white dark:hover:bg-secondary"
                                    >
                                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M1.05005 10.7998L5.51089 6.6576C5.93695 6.26197 5.93695 5.58764 5.51089 5.19201L1.05005 1.0498"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="grid-cols-4 gap-5 lg:grid xl:pr-16">
                                <ul
                                    class="filters home-filter flex justify-between gap-5 overflow-x-auto whitespace-nowrap px-4 py-4 font-extrabold lg:flex-col lg:px-0"
                                >
                                    <li class="active filter" data-filter="all">
                                        <button type="button" class="transition hover:text-secondary">All Courses</button>
                                    </li>
                                    <li class="filter" data-filter="design">
                                        <button type="button" class="transition hover:text-secondary">Design</button>
                                    </li>
                                    <li class="filter" data-filter="finance">
                                        <button type="button" class="transition hover:text-secondary">Finance</button>
                                    </li>
                                    <li class="filter" data-filter="business">
                                        <button type="button" class="transition hover:text-secondary">Business</button>
                                    </li>
                                    <li class="filter" data-filter="info">
                                        <button type="button" class="transition hover:text-secondary">Information tech.</button>
                                    </li>
                                    <li class="filter" data-filter="service">
                                        <button type="button" class="transition hover:text-secondary">Computer service</button>
                                    </li>
                                </ul>
                                <div class="col-span-3">
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
                                            nextEl: '.course-slider-button-next',
                                            prevEl: '.course-slider-button-prev',
                                        }"
                                        :breakpoints="{
                                            320: {
                                                slidesPerView: 1,
                                            },
                                            600: {
                                                slidesPerView: 1,
                                            },
                                            1000: {
                                                slidesPerView: 2,
                                            },
                                            1600: {
                                                slidesPerView: 2,
                                            },
                                        }"
                                        :modules="[Navigation, Autoplay]"
                                        :dir="store.direction === 'rtl' ? 'rtl' : 'ltr'"
                                        :key="store.direction === 'rtl' ? 'true' : 'false'"
                                    >
                                        <swiper-slide>
                                            <div class="rounded-xl bg-white drop-shadow-[0_0_10px_rgba(0,0,0,0.09)] dark:bg-gray-dark">
                                                <div class="h-44">
                                                    <img src="/assets/images/online-courses/course1.jpg" alt="" class="h-full w-full rounded-xl object-cover" />
                                                </div>
                                                <div class="p-5">
                                                    <a
                                                        href="javascript:"
                                                        class="mb-2 text-lg font-extrabold text-black transition line-clamp-1 hover:text-secondary dark:text-white"
                                                        >Service</a
                                                    >
                                                    <p class="text-sm font-bold line-clamp-1">UI/UX design, Component, layouts</p>
                                                    <div class="mt-5 flex flex-col gap-6 text-sm font-bold sm:flex-row">
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M16.0715 26.685C18.7637 24.4056 22.0602 22.9577 25.5601 22.5171C25.9725 22.4628 26.3511 22.2603 26.6254 21.9475C26.8996 21.6347 27.0506 21.2328 27.0505 20.8168V8.79642C27.0512 8.54905 26.9987 8.30442 26.8966 8.0791C26.7945 7.85378 26.6452 7.65303 26.4588 7.49046C26.2723 7.3279 26.0531 7.2073 25.816 7.13685C25.5789 7.0664 25.3294 7.04774 25.0844 7.08214C21.7596 7.59558 18.6409 9.01627 16.0715 11.1879C15.7641 11.4264 15.386 11.5559 14.9969 11.5559C14.6078 11.5559 14.2297 11.4264 13.9222 11.1879C11.3534 9.01796 8.2359 7.59844 4.91261 7.08535C4.66791 7.05099 4.41869 7.06957 4.18179 7.13984C3.94489 7.2101 3.72584 7.33041 3.53945 7.49263C3.35306 7.65484 3.20366 7.85519 3.10137 8.08012C2.99908 8.30505 2.94628 8.54932 2.94653 8.79642V20.8168C2.94635 21.2328 3.09744 21.6347 3.37164 21.9475C3.64585 22.2603 4.02445 22.4628 4.43689 22.5171C7.93791 22.9571 11.2356 24.4051 13.9287 26.685C14.2353 26.9225 14.6122 27.0514 15.0001 27.0514C15.388 27.0514 15.7649 26.9225 16.0715 26.685V26.685Z"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M23.5928 2.94641C20.8304 3.63806 18.2595 4.94365 16.0714 6.76605C15.7639 7.00463 15.3859 7.13412 14.9967 7.13412C14.6076 7.13412 14.2295 7.00463 13.9221 6.76605C11.7372 4.94512 9.17003 3.63993 6.41138 2.94748"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 11.5543V27.0503"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>15 lectures</span>
                                                        </div>
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M2.88452 15C2.88452 18.2132 4.16096 21.2948 6.43304 23.5669C8.70511 25.839 11.7867 27.1154 14.9999 27.1154C18.2131 27.1154 21.2947 25.839 23.5668 23.5669C25.8389 21.2948 27.1153 18.2132 27.1153 15C27.1153 11.7868 25.8389 8.70523 23.5668 6.43316C21.2947 4.16108 18.2131 2.88464 14.9999 2.88464C11.7867 2.88464 8.70511 4.16108 6.43304 6.43316C4.16096 8.70523 2.88452 11.7868 2.88452 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M13.2693 15C13.2693 15.459 13.4516 15.8993 13.7762 16.2238C14.1008 16.5484 14.541 16.7308 15.0001 16.7308C15.4591 16.7308 15.8993 16.5484 16.2239 16.2238C16.5485 15.8993 16.7308 15.459 16.7308 15C16.7308 14.541 16.5485 14.1007 16.2239 13.7762C15.8993 13.4516 15.4591 13.2692 15.0001 13.2692C14.541 13.2692 14.1008 13.4516 13.7762 13.7762C13.4516 14.1007 13.2693 14.541 13.2693 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 13.2692V7.21155"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M16.2244 16.2242L19.3271 19.3269"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>2 h 35 min</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </swiper-slide>
                                        <swiper-slide>
                                            <div class="rounded-xl bg-white drop-shadow-[0_0_10px_rgba(0,0,0,0.09)] dark:bg-gray-dark">
                                                <div class="h-44">
                                                    <img src="/assets/images/online-courses/blog1.jpg" alt="" class="h-full w-full rounded-xl object-cover" />
                                                </div>
                                                <div class="p-5">
                                                    <a
                                                        href="javascript:"
                                                        class="mb-2 text-lg font-extrabold text-black transition line-clamp-1 hover:text-secondary dark:text-white"
                                                        >Information technology</a
                                                    >
                                                    <p class="text-sm font-bold line-clamp-1">UI/UX design, Component, layouts</p>
                                                    <div class="mt-5 flex flex-col gap-6 text-sm font-bold sm:flex-row">
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M16.0715 26.685C18.7637 24.4056 22.0602 22.9577 25.5601 22.5171C25.9725 22.4628 26.3511 22.2603 26.6254 21.9475C26.8996 21.6347 27.0506 21.2328 27.0505 20.8168V8.79642C27.0512 8.54905 26.9987 8.30442 26.8966 8.0791C26.7945 7.85378 26.6452 7.65303 26.4588 7.49046C26.2723 7.3279 26.0531 7.2073 25.816 7.13685C25.5789 7.0664 25.3294 7.04774 25.0844 7.08214C21.7596 7.59558 18.6409 9.01627 16.0715 11.1879C15.7641 11.4264 15.386 11.5559 14.9969 11.5559C14.6078 11.5559 14.2297 11.4264 13.9222 11.1879C11.3534 9.01796 8.2359 7.59844 4.91261 7.08535C4.66791 7.05099 4.41869 7.06957 4.18179 7.13984C3.94489 7.2101 3.72584 7.33041 3.53945 7.49263C3.35306 7.65484 3.20366 7.85519 3.10137 8.08012C2.99908 8.30505 2.94628 8.54932 2.94653 8.79642V20.8168C2.94635 21.2328 3.09744 21.6347 3.37164 21.9475C3.64585 22.2603 4.02445 22.4628 4.43689 22.5171C7.93791 22.9571 11.2356 24.4051 13.9287 26.685C14.2353 26.9225 14.6122 27.0514 15.0001 27.0514C15.388 27.0514 15.7649 26.9225 16.0715 26.685V26.685Z"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M23.5928 2.94641C20.8304 3.63806 18.2595 4.94365 16.0714 6.76605C15.7639 7.00463 15.3859 7.13412 14.9967 7.13412C14.6076 7.13412 14.2295 7.00463 13.9221 6.76605C11.7372 4.94512 9.17003 3.63993 6.41138 2.94748"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 11.5543V27.0503"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>15 lectures</span>
                                                        </div>
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M2.88452 15C2.88452 18.2132 4.16096 21.2948 6.43304 23.5669C8.70511 25.839 11.7867 27.1154 14.9999 27.1154C18.2131 27.1154 21.2947 25.839 23.5668 23.5669C25.8389 21.2948 27.1153 18.2132 27.1153 15C27.1153 11.7868 25.8389 8.70523 23.5668 6.43316C21.2947 4.16108 18.2131 2.88464 14.9999 2.88464C11.7867 2.88464 8.70511 4.16108 6.43304 6.43316C4.16096 8.70523 2.88452 11.7868 2.88452 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M13.2693 15C13.2693 15.459 13.4516 15.8993 13.7762 16.2238C14.1008 16.5484 14.541 16.7308 15.0001 16.7308C15.4591 16.7308 15.8993 16.5484 16.2239 16.2238C16.5485 15.8993 16.7308 15.459 16.7308 15C16.7308 14.541 16.5485 14.1007 16.2239 13.7762C15.8993 13.4516 15.4591 13.2692 15.0001 13.2692C14.541 13.2692 14.1008 13.4516 13.7762 13.7762C13.4516 14.1007 13.2693 14.541 13.2693 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 13.2692V7.21155"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M16.2244 16.2242L19.3271 19.3269"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>2 h 35 min</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </swiper-slide>
                                        <swiper-slide>
                                            <div class="rounded-xl bg-white drop-shadow-[0_0_10px_rgba(0,0,0,0.09)] dark:bg-gray-dark">
                                                <div class="h-44">
                                                    <img src="/assets/images/online-courses/course1.jpg" alt="" class="h-full w-full rounded-xl object-cover" />
                                                </div>
                                                <div class="p-5">
                                                    <a
                                                        href="javascript:"
                                                        class="mb-2 text-lg font-extrabold text-black transition line-clamp-1 hover:text-secondary dark:text-white"
                                                        >Business</a
                                                    >
                                                    <p class="text-sm font-bold line-clamp-1">HTML, CSS, JavaScript's, Vue js, Tailwind css</p>
                                                    <div class="mt-5 flex flex-col gap-6 text-sm font-bold sm:flex-row">
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M16.0715 26.685C18.7637 24.4056 22.0602 22.9577 25.5601 22.5171C25.9725 22.4628 26.3511 22.2603 26.6254 21.9475C26.8996 21.6347 27.0506 21.2328 27.0505 20.8168V8.79642C27.0512 8.54905 26.9987 8.30442 26.8966 8.0791C26.7945 7.85378 26.6452 7.65303 26.4588 7.49046C26.2723 7.3279 26.0531 7.2073 25.816 7.13685C25.5789 7.0664 25.3294 7.04774 25.0844 7.08214C21.7596 7.59558 18.6409 9.01627 16.0715 11.1879C15.7641 11.4264 15.386 11.5559 14.9969 11.5559C14.6078 11.5559 14.2297 11.4264 13.9222 11.1879C11.3534 9.01796 8.2359 7.59844 4.91261 7.08535C4.66791 7.05099 4.41869 7.06957 4.18179 7.13984C3.94489 7.2101 3.72584 7.33041 3.53945 7.49263C3.35306 7.65484 3.20366 7.85519 3.10137 8.08012C2.99908 8.30505 2.94628 8.54932 2.94653 8.79642V20.8168C2.94635 21.2328 3.09744 21.6347 3.37164 21.9475C3.64585 22.2603 4.02445 22.4628 4.43689 22.5171C7.93791 22.9571 11.2356 24.4051 13.9287 26.685C14.2353 26.9225 14.6122 27.0514 15.0001 27.0514C15.388 27.0514 15.7649 26.9225 16.0715 26.685V26.685Z"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M23.5928 2.94641C20.8304 3.63806 18.2595 4.94365 16.0714 6.76605C15.7639 7.00463 15.3859 7.13412 14.9967 7.13412C14.6076 7.13412 14.2295 7.00463 13.9221 6.76605C11.7372 4.94512 9.17003 3.63993 6.41138 2.94748"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 11.5543V27.0503"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>15 lectures</span>
                                                        </div>
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M2.88452 15C2.88452 18.2132 4.16096 21.2948 6.43304 23.5669C8.70511 25.839 11.7867 27.1154 14.9999 27.1154C18.2131 27.1154 21.2947 25.839 23.5668 23.5669C25.8389 21.2948 27.1153 18.2132 27.1153 15C27.1153 11.7868 25.8389 8.70523 23.5668 6.43316C21.2947 4.16108 18.2131 2.88464 14.9999 2.88464C11.7867 2.88464 8.70511 4.16108 6.43304 6.43316C4.16096 8.70523 2.88452 11.7868 2.88452 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M13.2693 15C13.2693 15.459 13.4516 15.8993 13.7762 16.2238C14.1008 16.5484 14.541 16.7308 15.0001 16.7308C15.4591 16.7308 15.8993 16.5484 16.2239 16.2238C16.5485 15.8993 16.7308 15.459 16.7308 15C16.7308 14.541 16.5485 14.1007 16.2239 13.7762C15.8993 13.4516 15.4591 13.2692 15.0001 13.2692C14.541 13.2692 14.1008 13.4516 13.7762 13.7762C13.4516 14.1007 13.2693 14.541 13.2693 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 13.2692V7.21155"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M16.2244 16.2242L19.3271 19.3269"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>2 h 35 min</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </swiper-slide>
                                        <swiper-slide>
                                            <div class="rounded-xl bg-white drop-shadow-[0_0_10px_rgba(0,0,0,0.09)] dark:bg-gray-dark">
                                                <div class="h-44">
                                                    <img src="/assets/images/online-courses/blog1.jpg" alt="" class="h-full w-full rounded-xl object-cover" />
                                                </div>
                                                <div class="p-5">
                                                    <a
                                                        href="javascript:"
                                                        class="mb-2 text-lg font-extrabold text-black transition line-clamp-1 hover:text-secondary dark:text-white"
                                                        >Finance</a
                                                    >
                                                    <p class="text-sm font-bold line-clamp-1">HTML, CSS, JavaScript's, Vue js, Tailwind css</p>
                                                    <div class="mt-5 flex flex-col gap-6 text-sm font-bold sm:flex-row">
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M16.0715 26.685C18.7637 24.4056 22.0602 22.9577 25.5601 22.5171C25.9725 22.4628 26.3511 22.2603 26.6254 21.9475C26.8996 21.6347 27.0506 21.2328 27.0505 20.8168V8.79642C27.0512 8.54905 26.9987 8.30442 26.8966 8.0791C26.7945 7.85378 26.6452 7.65303 26.4588 7.49046C26.2723 7.3279 26.0531 7.2073 25.816 7.13685C25.5789 7.0664 25.3294 7.04774 25.0844 7.08214C21.7596 7.59558 18.6409 9.01627 16.0715 11.1879C15.7641 11.4264 15.386 11.5559 14.9969 11.5559C14.6078 11.5559 14.2297 11.4264 13.9222 11.1879C11.3534 9.01796 8.2359 7.59844 4.91261 7.08535C4.66791 7.05099 4.41869 7.06957 4.18179 7.13984C3.94489 7.2101 3.72584 7.33041 3.53945 7.49263C3.35306 7.65484 3.20366 7.85519 3.10137 8.08012C2.99908 8.30505 2.94628 8.54932 2.94653 8.79642V20.8168C2.94635 21.2328 3.09744 21.6347 3.37164 21.9475C3.64585 22.2603 4.02445 22.4628 4.43689 22.5171C7.93791 22.9571 11.2356 24.4051 13.9287 26.685C14.2353 26.9225 14.6122 27.0514 15.0001 27.0514C15.388 27.0514 15.7649 26.9225 16.0715 26.685V26.685Z"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M23.5928 2.94641C20.8304 3.63806 18.2595 4.94365 16.0714 6.76605C15.7639 7.00463 15.3859 7.13412 14.9967 7.13412C14.6076 7.13412 14.2295 7.00463 13.9221 6.76605C11.7372 4.94512 9.17003 3.63993 6.41138 2.94748"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 11.5543V27.0503"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>15 lectures</span>
                                                        </div>
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M2.88452 15C2.88452 18.2132 4.16096 21.2948 6.43304 23.5669C8.70511 25.839 11.7867 27.1154 14.9999 27.1154C18.2131 27.1154 21.2947 25.839 23.5668 23.5669C25.8389 21.2948 27.1153 18.2132 27.1153 15C27.1153 11.7868 25.8389 8.70523 23.5668 6.43316C21.2947 4.16108 18.2131 2.88464 14.9999 2.88464C11.7867 2.88464 8.70511 4.16108 6.43304 6.43316C4.16096 8.70523 2.88452 11.7868 2.88452 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M13.2693 15C13.2693 15.459 13.4516 15.8993 13.7762 16.2238C14.1008 16.5484 14.541 16.7308 15.0001 16.7308C15.4591 16.7308 15.8993 16.5484 16.2239 16.2238C16.5485 15.8993 16.7308 15.459 16.7308 15C16.7308 14.541 16.5485 14.1007 16.2239 13.7762C15.8993 13.4516 15.4591 13.2692 15.0001 13.2692C14.541 13.2692 14.1008 13.4516 13.7762 13.7762C13.4516 14.1007 13.2693 14.541 13.2693 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 13.2692V7.21155"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M16.2244 16.2242L19.3271 19.3269"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>2 h 35 min</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </swiper-slide>
                                        <swiper-slide>
                                            <div class="rounded-xl bg-white drop-shadow-[0_0_10px_rgba(0,0,0,0.09)] dark:bg-gray-dark">
                                                <div class="h-44">
                                                    <img src="/assets/images/online-courses/course1.jpg" alt="" class="h-full w-full rounded-xl object-cover" />
                                                </div>
                                                <div class="p-5">
                                                    <a
                                                        href="javascript:"
                                                        class="mb-2 text-lg font-extrabold text-black transition line-clamp-1 hover:text-secondary dark:text-white"
                                                        >Design</a
                                                    >
                                                    <p class="text-sm font-bold line-clamp-1">HTML, CSS, JavaScript's, Vue js, Tailwind css</p>
                                                    <div class="mt-5 flex flex-col gap-6 text-sm font-bold sm:flex-row">
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M16.0715 26.685C18.7637 24.4056 22.0602 22.9577 25.5601 22.5171C25.9725 22.4628 26.3511 22.2603 26.6254 21.9475C26.8996 21.6347 27.0506 21.2328 27.0505 20.8168V8.79642C27.0512 8.54905 26.9987 8.30442 26.8966 8.0791C26.7945 7.85378 26.6452 7.65303 26.4588 7.49046C26.2723 7.3279 26.0531 7.2073 25.816 7.13685C25.5789 7.0664 25.3294 7.04774 25.0844 7.08214C21.7596 7.59558 18.6409 9.01627 16.0715 11.1879C15.7641 11.4264 15.386 11.5559 14.9969 11.5559C14.6078 11.5559 14.2297 11.4264 13.9222 11.1879C11.3534 9.01796 8.2359 7.59844 4.91261 7.08535C4.66791 7.05099 4.41869 7.06957 4.18179 7.13984C3.94489 7.2101 3.72584 7.33041 3.53945 7.49263C3.35306 7.65484 3.20366 7.85519 3.10137 8.08012C2.99908 8.30505 2.94628 8.54932 2.94653 8.79642V20.8168C2.94635 21.2328 3.09744 21.6347 3.37164 21.9475C3.64585 22.2603 4.02445 22.4628 4.43689 22.5171C7.93791 22.9571 11.2356 24.4051 13.9287 26.685C14.2353 26.9225 14.6122 27.0514 15.0001 27.0514C15.388 27.0514 15.7649 26.9225 16.0715 26.685V26.685Z"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M23.5928 2.94641C20.8304 3.63806 18.2595 4.94365 16.0714 6.76605C15.7639 7.00463 15.3859 7.13412 14.9967 7.13412C14.6076 7.13412 14.2295 7.00463 13.9221 6.76605C11.7372 4.94512 9.17003 3.63993 6.41138 2.94748"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 11.5543V27.0503"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>15 lectures</span>
                                                        </div>
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M2.88452 15C2.88452 18.2132 4.16096 21.2948 6.43304 23.5669C8.70511 25.839 11.7867 27.1154 14.9999 27.1154C18.2131 27.1154 21.2947 25.839 23.5668 23.5669C25.8389 21.2948 27.1153 18.2132 27.1153 15C27.1153 11.7868 25.8389 8.70523 23.5668 6.43316C21.2947 4.16108 18.2131 2.88464 14.9999 2.88464C11.7867 2.88464 8.70511 4.16108 6.43304 6.43316C4.16096 8.70523 2.88452 11.7868 2.88452 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M13.2693 15C13.2693 15.459 13.4516 15.8993 13.7762 16.2238C14.1008 16.5484 14.541 16.7308 15.0001 16.7308C15.4591 16.7308 15.8993 16.5484 16.2239 16.2238C16.5485 15.8993 16.7308 15.459 16.7308 15C16.7308 14.541 16.5485 14.1007 16.2239 13.7762C15.8993 13.4516 15.4591 13.2692 15.0001 13.2692C14.541 13.2692 14.1008 13.4516 13.7762 13.7762C13.4516 14.1007 13.2693 14.541 13.2693 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 13.2692V7.21155"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M16.2244 16.2242L19.3271 19.3269"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>2 h 35 min</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </swiper-slide>
                                        <swiper-slide>
                                            <div class="rounded-xl bg-white drop-shadow-[0_0_10px_rgba(0,0,0,0.09)] dark:bg-gray-dark">
                                                <div class="h-44">
                                                    <img src="/assets/images/online-courses/blog1.jpg" alt="" class="h-full w-full rounded-xl object-cover" />
                                                </div>
                                                <div class="p-5">
                                                    <a
                                                        href="javascript:"
                                                        class="mb-2 text-lg font-extrabold text-black transition line-clamp-1 hover:text-secondary dark:text-white"
                                                        >Information technology</a
                                                    >
                                                    <p class="text-sm font-bold line-clamp-1">UI/UX design, Component, layouts</p>
                                                    <div class="mt-5 flex flex-col gap-6 text-sm font-bold sm:flex-row">
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M16.0715 26.685C18.7637 24.4056 22.0602 22.9577 25.5601 22.5171C25.9725 22.4628 26.3511 22.2603 26.6254 21.9475C26.8996 21.6347 27.0506 21.2328 27.0505 20.8168V8.79642C27.0512 8.54905 26.9987 8.30442 26.8966 8.0791C26.7945 7.85378 26.6452 7.65303 26.4588 7.49046C26.2723 7.3279 26.0531 7.2073 25.816 7.13685C25.5789 7.0664 25.3294 7.04774 25.0844 7.08214C21.7596 7.59558 18.6409 9.01627 16.0715 11.1879C15.7641 11.4264 15.386 11.5559 14.9969 11.5559C14.6078 11.5559 14.2297 11.4264 13.9222 11.1879C11.3534 9.01796 8.2359 7.59844 4.91261 7.08535C4.66791 7.05099 4.41869 7.06957 4.18179 7.13984C3.94489 7.2101 3.72584 7.33041 3.53945 7.49263C3.35306 7.65484 3.20366 7.85519 3.10137 8.08012C2.99908 8.30505 2.94628 8.54932 2.94653 8.79642V20.8168C2.94635 21.2328 3.09744 21.6347 3.37164 21.9475C3.64585 22.2603 4.02445 22.4628 4.43689 22.5171C7.93791 22.9571 11.2356 24.4051 13.9287 26.685C14.2353 26.9225 14.6122 27.0514 15.0001 27.0514C15.388 27.0514 15.7649 26.9225 16.0715 26.685V26.685Z"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M23.5928 2.94641C20.8304 3.63806 18.2595 4.94365 16.0714 6.76605C15.7639 7.00463 15.3859 7.13412 14.9967 7.13412C14.6076 7.13412 14.2295 7.00463 13.9221 6.76605C11.7372 4.94512 9.17003 3.63993 6.41138 2.94748"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 11.5543V27.0503"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>15 lectures</span>
                                                        </div>
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M2.88452 15C2.88452 18.2132 4.16096 21.2948 6.43304 23.5669C8.70511 25.839 11.7867 27.1154 14.9999 27.1154C18.2131 27.1154 21.2947 25.839 23.5668 23.5669C25.8389 21.2948 27.1153 18.2132 27.1153 15C27.1153 11.7868 25.8389 8.70523 23.5668 6.43316C21.2947 4.16108 18.2131 2.88464 14.9999 2.88464C11.7867 2.88464 8.70511 4.16108 6.43304 6.43316C4.16096 8.70523 2.88452 11.7868 2.88452 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M13.2693 15C13.2693 15.459 13.4516 15.8993 13.7762 16.2238C14.1008 16.5484 14.541 16.7308 15.0001 16.7308C15.4591 16.7308 15.8993 16.5484 16.2239 16.2238C16.5485 15.8993 16.7308 15.459 16.7308 15C16.7308 14.541 16.5485 14.1007 16.2239 13.7762C15.8993 13.4516 15.4591 13.2692 15.0001 13.2692C14.541 13.2692 14.1008 13.4516 13.7762 13.7762C13.4516 14.1007 13.2693 14.541 13.2693 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 13.2692V7.21155"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M16.2244 16.2242L19.3271 19.3269"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>2 h 35 min</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </swiper-slide>
                                        <swiper-slide>
                                            <div class="rounded-xl bg-white drop-shadow-[0_0_10px_rgba(0,0,0,0.09)] dark:bg-gray-dark">
                                                <div class="h-44">
                                                    <img src="/assets/images/online-courses/course1.jpg" alt="" class="h-full w-full rounded-xl object-cover" />
                                                </div>
                                                <div class="p-5">
                                                    <a
                                                        href="javascript:"
                                                        class="mb-2 text-lg font-extrabold text-black transition line-clamp-1 hover:text-secondary dark:text-white"
                                                        >Finance</a
                                                    >
                                                    <p class="text-sm font-bold line-clamp-1">HTML, CSS, JavaScript's, Vue js, Tailwind css</p>
                                                    <div class="mt-5 flex flex-col gap-6 text-sm font-bold sm:flex-row">
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M16.0715 26.685C18.7637 24.4056 22.0602 22.9577 25.5601 22.5171C25.9725 22.4628 26.3511 22.2603 26.6254 21.9475C26.8996 21.6347 27.0506 21.2328 27.0505 20.8168V8.79642C27.0512 8.54905 26.9987 8.30442 26.8966 8.0791C26.7945 7.85378 26.6452 7.65303 26.4588 7.49046C26.2723 7.3279 26.0531 7.2073 25.816 7.13685C25.5789 7.0664 25.3294 7.04774 25.0844 7.08214C21.7596 7.59558 18.6409 9.01627 16.0715 11.1879C15.7641 11.4264 15.386 11.5559 14.9969 11.5559C14.6078 11.5559 14.2297 11.4264 13.9222 11.1879C11.3534 9.01796 8.2359 7.59844 4.91261 7.08535C4.66791 7.05099 4.41869 7.06957 4.18179 7.13984C3.94489 7.2101 3.72584 7.33041 3.53945 7.49263C3.35306 7.65484 3.20366 7.85519 3.10137 8.08012C2.99908 8.30505 2.94628 8.54932 2.94653 8.79642V20.8168C2.94635 21.2328 3.09744 21.6347 3.37164 21.9475C3.64585 22.2603 4.02445 22.4628 4.43689 22.5171C7.93791 22.9571 11.2356 24.4051 13.9287 26.685C14.2353 26.9225 14.6122 27.0514 15.0001 27.0514C15.388 27.0514 15.7649 26.9225 16.0715 26.685V26.685Z"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M23.5928 2.94641C20.8304 3.63806 18.2595 4.94365 16.0714 6.76605C15.7639 7.00463 15.3859 7.13412 14.9967 7.13412C14.6076 7.13412 14.2295 7.00463 13.9221 6.76605C11.7372 4.94512 9.17003 3.63993 6.41138 2.94748"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 11.5543V27.0503"
                                                                        stroke="#47BDFF"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>15 lectures</span>
                                                        </div>
                                                        <div class="flex items-center gap-2">
                                                            <div>
                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M2.88452 15C2.88452 18.2132 4.16096 21.2948 6.43304 23.5669C8.70511 25.839 11.7867 27.1154 14.9999 27.1154C18.2131 27.1154 21.2947 25.839 23.5668 23.5669C25.8389 21.2948 27.1153 18.2132 27.1153 15C27.1153 11.7868 25.8389 8.70523 23.5668 6.43316C21.2947 4.16108 18.2131 2.88464 14.9999 2.88464C11.7867 2.88464 8.70511 4.16108 6.43304 6.43316C4.16096 8.70523 2.88452 11.7868 2.88452 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M13.2693 15C13.2693 15.459 13.4516 15.8993 13.7762 16.2238C14.1008 16.5484 14.541 16.7308 15.0001 16.7308C15.4591 16.7308 15.8993 16.5484 16.2239 16.2238C16.5485 15.8993 16.7308 15.459 16.7308 15C16.7308 14.541 16.5485 14.1007 16.2239 13.7762C15.8993 13.4516 15.4591 13.2692 15.0001 13.2692C14.541 13.2692 14.1008 13.4516 13.7762 13.7762C13.4516 14.1007 13.2693 14.541 13.2693 15V15Z"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M15 13.2692V7.21155"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M16.2244 16.2242L19.3271 19.3269"
                                                                        stroke="#B476E5"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span>2 h 35 min</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </swiper-slide>
                                    </swiper>
                                </div>
                            </div>
                        </div>
                        <div class="absolute inset-x-0 -top-4 -z-[1] h-full w-full rounded-[20px] bg-white/20 dark:bg-white/[0.02]"></div>
                    </div>
                </div>
            </section>

            <section class="overflow-hidden py-14 md:py-20">
                <div class="container">
                    <div class="grid-cols-3 lg:grid">
                        <div class="col-span-2">
                            <div class="heading mb-0 text-center ltr:lg:text-left rtl:lg:text-right xl:w-3/4">
                                <h6>Learning Methods</h6>
                                <h4>Making your learning enjoyable</h4>
                                <p class="pt-5 text-lg font-semibold">
                                    Make it easier for all students to do learning through digital media with existing media making it easier for student to
                                    learn anywhere and anytime.
                                </p>
                            </div>
                            <ul class="my-10 grid list-inside list-disc gap-5 text-lg font-semibold text-primary sm:grid-cols-2 lg:gap-10 xl:w-1/2">
                                <li>Flexible</li>
                                <li>Easy learning</li>
                                <li>High priority</li>
                                <li>Affordable</li>
                            </ul>
                            <div class="text-center ltr:lg:text-left rtl:lg:text-right">
                                <a href="javascript:" class="btn bg-secondary capitalize text-white hover:bg-primary sm:px-14 sm:py-5">Know more</a>
                            </div>
                        </div>
                        <div class="relative" data-aos="fade-up" data-aos-duration="1000">
                            <div class="relative z-[1] h-full overflow-hidden rounded-2xl rtl:rotate-y-180">
                                <img src="/assets/images/online-courses/learning-method-girl.png" alt="" class="mx-auto h-full w-full object-cover lg:mx-0" />
                            </div>
                            <div class="absolute top-12 hidden ltr:-left-6 rtl:-right-6 rtl:rotate-y-180 xl:block">
                                <svg width="113" height="116" viewBox="0 0 113 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M109.999 114.082C109.771 114.879 108.94 115.34 108.144 115.112C107.347 114.884 106.886 114.054 107.114 113.257L109.999 114.082ZM104.948 80.6183L103.835 81.6233L104.948 80.6183ZM74.4645 59.8268L75.0048 58.4275L74.4645 59.8268ZM63.4072 58.2054L62.3018 57.1914L63.4072 58.2054ZM65.1305 61.5691L64.2729 62.7997L65.1305 61.5691ZM95.332 61.6018L96.7102 62.1938L95.332 61.6018ZM77.4295 38.1504L76.6908 39.4559L77.4295 38.1504ZM0.531457 9.24108C0.137802 8.51216 0.409588 7.60213 1.13851 7.20847L13.017 0.793489C13.7459 0.399834 14.6559 0.671619 15.0496 1.40054C15.4432 2.12947 15.1715 3.03949 14.4425 3.43315L3.88389 9.13535L9.5861 19.694C9.97976 20.4229 9.70797 21.3329 8.97905 21.7266C8.25012 22.1203 7.3401 21.8485 6.94644 21.1195L0.531457 9.24108ZM107.114 113.257C110.256 102.275 111.577 90.2024 103.835 81.6233L106.062 79.6134C114.964 89.4771 113.158 103.039 109.999 114.082L107.114 113.257ZM103.835 81.6233C96.1067 73.0598 84.7268 65.3976 73.9241 61.2261L75.0048 58.4275C86.2241 62.7599 98.0033 70.6836 106.062 79.6134L103.835 81.6233ZM73.9241 61.2261C73.1384 60.9227 70.8791 60.0784 68.6301 59.5402C67.4983 59.2693 66.4426 59.0943 65.6106 59.0811C64.6656 59.066 64.4684 59.2676 64.5126 59.2193L62.3018 57.1914C63.2054 56.2064 64.6196 56.0649 65.6585 56.0814C66.8104 56.0998 68.111 56.3312 69.3283 56.6226C71.7776 57.2087 74.1876 58.112 75.0048 58.4275L73.9241 61.2261ZM64.5126 59.2193C64.5805 59.1453 64.6181 58.9967 64.6039 58.907C64.6021 58.8959 64.6237 59.002 64.7888 59.2249C65.1149 59.665 65.6585 60.1087 65.9882 60.3384L64.2729 62.7997C63.8317 62.4922 62.9853 61.8301 62.3783 61.0107C62.0768 60.6038 61.7461 60.0417 61.6407 59.3759C61.5229 58.6313 61.7056 57.8414 62.3018 57.1914L64.5126 59.2193ZM65.9882 60.3384C70.2185 63.2867 76.1275 66.4558 81.5637 67.3158C84.2643 67.743 86.7374 67.5828 88.8133 66.6532C90.8535 65.7395 92.6626 64.0155 93.9537 61.0097L96.7102 62.1938C95.1597 65.8032 92.8492 68.1329 90.0394 69.3912C87.2652 70.6335 84.1578 70.7635 81.0949 70.279C75.0041 69.3154 68.6539 65.853 64.2729 62.7997L65.9882 60.3384ZM93.9537 61.0097C95.9406 56.3843 93.8829 52.2226 89.9045 48.4124C85.9307 44.6067 80.4561 41.5866 76.6908 39.4559L78.1683 36.8449C81.8407 38.9231 87.6801 42.1283 91.9795 46.2458C96.2742 50.3588 99.4488 55.8184 96.7102 62.1938L93.9537 61.0097ZM76.6908 39.4559C53.1643 26.1425 27.3634 17.7132 1.42204 9.96557L2.28054 7.09103C28.2366 14.843 54.3227 23.351 78.1683 36.8449L76.6908 39.4559Z"
                                        fill="#B476E5"
                                    />
                                </svg>
                            </div>
                            <div class="absolute -bottom-6 hidden ltr:-left-6 rtl:-right-6 rtl:rotate-y-180 xl:block">
                                <svg width="88" height="62" viewBox="0 0 88 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M2.43604 1.802C2.43604 8.6056 3.98597 16.0902 5.5386 22.6889C6.54902 26.9832 8.10692 34.1247 10.4141 37.9247C25.0817 62.0831 61.0953 62.2326 86.2053 58.6455"
                                        stroke="#47BDFF"
                                        stroke-width="3"
                                        stroke-linecap="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="py-14 md:py-20">
                <div class="container">
                    <div class="grid-cols-3 lg:grid">
                        <div class="relative mb-8 flex justify-center gap-5 lg:mb-0 lg:block">
                            <img
                                src="/assets/images/online-courses/pink-top-arrow.svg"
                                alt=""
                                class="absolute top-32 ltr:right-0 ltr:rotate-180 rtl:left-0 rtl:rotate-90"
                            />
                            <img
                                src="/assets/images/online-courses/inner-box.svg"
                                alt=""
                                class="absolute -top-5 z-[2] ltr:-left-5 rtl:-right-5 rtl:rotate-y-180"
                            />
                            <div class="relative z-[1] sm:h-[300px] sm:w-[270px]" data-aos="fade-up" data-aos-duration="1000">
                                <button
                                    type="button"
                                    class="absolute left-1/2 top-1/2 z-[1] flex h-14 w-14 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full bg-black/50"
                                    data-fancybox
                                    data-src="#benifit-video"
                                    @click="dialogbox.open()"
                                >
                                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M0.333252 2.86666V17.1333C0.333252 18.2 0.799918 18.9778 1.73325 19.4667C2.66658 19.9556 3.5777 19.9111 4.46659 19.3333L15.5333 12.2667C16.3777 11.7778 16.7999 11.0222 16.7999 10C16.7999 8.97778 16.3777 8.22222 15.5333 7.73333L4.46659 0.666664C3.5777 0.0888864 2.66658 0.0444421 1.73325 0.533331C0.799918 1.02222 0.333252 1.8 0.333252 2.86666Z"
                                            fill="white"
                                        />
                                    </svg>
                                </button>
                                <div class="h-full overflow-hidden rounded-2xl rtl:rotate-y-180">
                                    <img src="/assets/images/online-courses/benifit-person-1.jpg" alt="" class="h-full w-full object-cover" />
                                </div>
                            </div>
                            <div
                                class="relative z-[1] sm:h-[300px] sm:w-[270px] lg:-mt-14 lg:ltr:ml-auto lg:rtl:mr-auto"
                                data-aos="fade-up"
                                data-aos-duration="1000"
                            >
                                <div class="h-full overflow-hidden rounded-2xl rtl:rotate-y-180">
                                    <img src="/assets/images/online-courses/benifit-person-2.jpg" alt="" class="h-full w-full object-cover" />
                                </div>
                            </div>
                            <img
                                src="/assets/images/online-courses/bg-benifits.png"
                                alt=""
                                class="absolute top-20 hidden ltr:left-8 rtl:right-8 rtl:rotate-y-180 lg:block"
                            />
                        </div>
                        <div class="col-span-2 lg:ltr:pl-20 lg:rtl:pr-20">
                            <div class="heading mb-0 text-center ltr:lg:text-right rtl:lg:text-left">
                                <h6>Our benefits</h6>
                                <h4>Our Learning platform has reached 1m+ students.</h4>
                            </div>
                            <div class="my-10 grid gap-10 text-lg font-semibold ltr:text-right rtl:text-left sm:grid-cols-2 md:my-14">
                                <div class="flex gap-6">
                                    <div class="flex-1">
                                        <h4 class="mb-5 text-[22px] font-bold text-primary">Expert mentors</h4>
                                        <p>You can easily contact with Higley experienced mentors.</p>
                                    </div>
                                    <div class="h-14 w-14 flex-none">
                                        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/[0.06]">
                                            <img
                                                src="/assets/images/online-courses/team-work.svg"
                                                alt=""
                                                class="drop-shadow-[0_2px_6px_rgba(71,189,255,0.32)]"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="flex gap-6">
                                    <div class="flex-1">
                                        <h4 class="mb-5 text-[22px] font-bold text-secondary">Course certificate</h4>
                                        <p>You can get a course certificate after completing course.</p>
                                    </div>
                                    <div class="h-14 w-14 flex-none">
                                        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/[0.06]">
                                            <img
                                                src="/assets/images/online-courses/accountability.svg"
                                                alt=""
                                                class="drop-shadow-[0_5px_14px_rgba(180,118,229,0.29)]"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="flex gap-6">
                                    <div class="flex-1">
                                        <h4 class="mb-5 text-[22px] font-bold text-secondary">Learning videos</h4>
                                        <p>you can get all access to learning course videos.</p>
                                    </div>
                                    <div class="h-14 w-14 flex-none">
                                        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/[0.06]">
                                            <img
                                                src="/assets/images/online-courses/video-icon.svg"
                                                class="drop-shadow-[0_5px_14px_rgba(180,118,229,0.29)]"
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="flex gap-6">
                                    <div class="flex-1">
                                        <h4 class="mb-5 text-[22px] font-bold text-primary">Live sessions</h4>
                                        <p>1 weekly live session with our course mentor.</p>
                                    </div>
                                    <div class="h-14 w-14 flex-none">
                                        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/[0.06]">
                                            <img
                                                src="/assets/images/online-courses/hotspot-icon.svg"
                                                alt=""
                                                class="drop-shadow-[0_2px_6px_rgba(71,189,255,0.32)]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center ltr:lg:text-right rtl:lg:text-left">
                                <a href="javascript:" class="btn bg-secondary capitalize text-white hover:bg-primary sm:px-14 sm:py-5">Get started</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <modal
                ref="dialogbox"
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

            <section class="relative bg-black py-14 dark:bg-transparent lg:py-20">
                <div class="absolute top-0 ltr:right-0 rtl:left-0 rtl:rotate-y-180">
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
                <div class="container">
                    <div class="heading text-center">
                        <h6>Testimonial</h6>
                        <h4 class="!text-white">Feedback from our Students</h4>
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
                        :navigation="{
                            nextEl: '.testimonial-swiper-button-next',
                            prevEl: '.testimonial-swiper-button-prev',
                        }"
                        :modules="[Navigation, Autoplay]"
                        :dir="store.direction === 'rtl' ? 'rtl' : 'ltr'"
                        :key="store.direction === 'rtl' ? 'true' : 'false'"
                    >
                        <swiper-slide class="lg:p-32 lg:pb-20">
                            <div class="relative mx-auto grid-cols-3 gap-5 rounded-[32px] border-4 border-gray-dark p-10 lg:grid">
                                <div class="relative mx-auto w-1/2 lg:-mt-36 lg:h-80 lg:w-80 lg:ltr:-ml-36 lg:rtl:-mr-36">
                                    <div class="h-full overflow-hidden rounded-2xl sm:rounded-tr-[120px]">
                                        <img src="/assets/images/online-courses/student-1.jpg" alt="" class="h-full w-full object-cover" />
                                    </div>
                                    <img src="/assets/images/blue-quote.png" alt="blue-quote" class="absolute -top-3 -right-6" />
                                </div>
                                <div class="col-span-2 mt-8 text-center lg:mt-0 lg:ltr:text-left lg:rtl:text-right">
                                    <div class="pb-8">
                                        <svg width="96" height="16" viewBox="0 0 96 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mx-auto lg:mx-0">
                                            <path
                                                d="M86.2864 2.84744C87.0637 1.5558 88.9363 1.5558 89.7136 2.84744L90.1964 3.64962C90.4756 4.11365 90.9311 4.44459 91.4587 4.56678L92.3708 4.77803C93.8395 5.11816 94.4181 6.8991 93.4299 8.03752L92.8162 8.74454C92.4612 9.15352 92.2872 9.68898 92.334 10.2285L92.4149 11.1613C92.5453 12.6631 91.0303 13.7638 89.6423 13.1757L88.7802 12.8105C88.2815 12.5993 87.7185 12.5993 87.2198 12.8105L86.3577 13.1757C84.9697 13.7638 83.4547 12.6631 83.5851 11.1613L83.666 10.2285C83.7128 9.68899 83.5388 9.15352 83.1838 8.74454L82.5701 8.03752C81.5819 6.89911 82.1605 5.11816 83.6292 4.77803L84.5413 4.56678C85.0689 4.44459 85.5244 4.11365 85.8036 3.64962L86.2864 2.84744Z"
                                                fill="#7780A1"
                                            ></path>
                                            <path
                                                d="M66.2864 2.84744C67.0637 1.5558 68.9363 1.5558 69.7136 2.84744L70.1964 3.64962C70.4756 4.11365 70.9311 4.44459 71.4587 4.56678L72.3708 4.77803C73.8395 5.11816 74.4181 6.8991 73.4299 8.03752L72.8162 8.74454C72.4612 9.15352 72.2872 9.68898 72.334 10.2285L72.4149 11.1613C72.5453 12.6631 71.0303 13.7638 69.6423 13.1757L68.7802 12.8105C68.2815 12.5993 67.7185 12.5993 67.2198 12.8105L66.3577 13.1757C64.9697 13.7638 63.4547 12.6631 63.5851 11.1613L63.666 10.2285C63.7128 9.68899 63.5388 9.15352 63.1838 8.74454L62.5701 8.03752C61.5819 6.89911 62.1605 5.11816 63.6292 4.77803L64.5413 4.56678C65.0689 4.44459 65.5244 4.11365 65.8036 3.64962L66.2864 2.84744Z"
                                                fill="#FFBD11"
                                            ></path>
                                            <path
                                                d="M46.2864 2.84744C47.0637 1.5558 48.9363 1.5558 49.7136 2.84744L50.1964 3.64962C50.4756 4.11365 50.9311 4.44459 51.4587 4.56678L52.3708 4.77803C53.8395 5.11816 54.4181 6.8991 53.4299 8.03752L52.8162 8.74454C52.4612 9.15352 52.2872 9.68898 52.334 10.2285L52.4149 11.1613C52.5453 12.6631 51.0303 13.7638 49.6423 13.1757L48.7802 12.8105C48.2815 12.5993 47.7185 12.5993 47.2198 12.8105L46.3577 13.1757C44.9697 13.7638 43.4547 12.6631 43.5851 11.1613L43.666 10.2285C43.7128 9.68899 43.5388 9.15352 43.1838 8.74454L42.5701 8.03752C41.5819 6.89911 42.1605 5.11816 43.6292 4.77803L44.5413 4.56678C45.0689 4.44459 45.5244 4.11365 45.8036 3.64962L46.2864 2.84744Z"
                                                fill="#FFBD11"
                                            ></path>
                                            <path
                                                d="M26.2864 2.84744C27.0637 1.5558 28.9363 1.5558 29.7136 2.84744L30.1964 3.64962C30.4756 4.11365 30.9311 4.44459 31.4587 4.56678L32.3708 4.77803C33.8395 5.11816 34.4181 6.8991 33.4299 8.03752L32.8162 8.74454C32.4612 9.15352 32.2872 9.68898 32.334 10.2285L32.4149 11.1613C32.5453 12.6631 31.0303 13.7638 29.6423 13.1757L28.7802 12.8105C28.2815 12.5993 27.7185 12.5993 27.2198 12.8105L26.3577 13.1757C24.9697 13.7638 23.4547 12.6631 23.5851 11.1613L23.666 10.2285C23.7128 9.68899 23.5388 9.15352 23.1838 8.74454L22.5701 8.03752C21.5819 6.89911 22.1605 5.11816 23.6292 4.77803L24.5413 4.56678C25.0689 4.44459 25.5244 4.11365 25.8036 3.64962L26.2864 2.84744Z"
                                                fill="#FFBD11"
                                            ></path>
                                            <path
                                                d="M6.28638 2.84744C7.0637 1.5558 8.9363 1.5558 9.71362 2.84744L10.1964 3.64962C10.4756 4.11365 10.9311 4.44459 11.4587 4.56678L12.3708 4.77803C13.8395 5.11816 14.4181 6.8991 13.4299 8.03752L12.8162 8.74454C12.4612 9.15352 12.2872 9.68898 12.334 10.2285L12.4149 11.1613C12.5453 12.6631 11.0303 13.7638 9.64225 13.1757L8.78018 12.8105C8.28151 12.5993 7.71849 12.5993 7.21982 12.8105L6.35775 13.1757C4.96968 13.7638 3.45472 12.6631 3.58506 11.1613L3.66601 10.2285C3.71283 9.68899 3.53885 9.15352 3.18383 8.74454L2.57009 8.03752C1.58187 6.89911 2.16054 5.11816 3.62916 4.77803L4.54126 4.56678C5.06887 4.44459 5.52437 4.11365 5.80362 3.64962L6.28638 2.84744Z"
                                                fill="#FFBD11"
                                            ></path>
                                        </svg>
                                    </div>
                                    <p class="font-medium italic text-white">
                                        I love their online course. every point is perfect and personally i recommended to watch their course and learn
                                        something. great experience.
                                    </p>
                                    <div class="mt-12">
                                        <h5 class="font-extrabold text-secondary">Paul Abraham</h5>
                                        <h6 class="text-sm font-bold italic">Finance student</h6>
                                    </div>
                                    <span class="absolute right-5 bottom-5">
                                        <svg width="100" height="73" viewBox="0 0 100 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g opacity="0.05">
                                                <path
                                                    d="M79.5222 0C85.1084 0 89.8948 2.12795 93.8833 6.1167C98.1392 10.1054 100 14.8935 100 20.2128C100 25.2666 98.4045 29.7875 94.9462 33.7764C91.4881 38.0323 85.9039 38.8302 81.3825 39.0952C82.1803 45.7443 85.9037 52.6589 89.3619 57.4472C89.8944 58.245 90.425 59.0427 91.2246 59.5752C92.2876 60.6382 92.2876 62.2356 91.2246 63.2986L83.5126 71.543C82.4495 72.8732 80.3216 72.606 79.2567 71.543C76.0657 68.0849 72.8731 63.831 70.2144 59.5751C62.7675 47.6072 59.044 35.6393 59.044 23.669C59.044 16.7544 61.1719 10.9032 65.1606 6.64734C69.1493 2.39334 74.2029 0.000144939 79.5217 0.000144939L79.5222 0Z"
                                                    fill="#93A2B2"
                                                ></path>
                                                <path
                                                    d="M20.4783 0C26.0645 0 30.8509 2.12795 34.8394 6.1167C39.0952 10.1054 40.9561 14.8935 40.9561 20.2128C40.9561 25.2666 39.3606 29.7875 35.9023 33.7764C32.4442 38.0323 26.86 38.8302 22.3386 39.0952C23.1363 45.7443 26.8597 52.6589 30.318 57.4472C30.8504 58.245 31.381 59.0427 32.1806 59.5752C33.2437 60.6382 33.2437 62.2356 32.1806 63.2986L24.4686 71.543C23.4056 72.8732 21.2776 72.606 20.2128 71.543C17.0218 68.0849 13.8292 63.831 11.1705 59.5751C3.72351 47.6072 7.62939e-06 35.6393 7.62939e-06 23.669C7.62939e-06 16.7544 2.12797 10.9032 6.11671 6.64734C10.1054 2.39334 14.8921 0.000144939 20.4778 0.000144939L20.4783 0Z"
                                                    fill="#93A2B2"
                                                ></path>
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </swiper-slide>
                        <div class="bottom-0 z-[1] mt-5 flex items-center justify-center gap-4 ltr:right-32 rtl:left-32 lg:absolute">
                            <a href="javascript:" class="text-sm font-extrabold text-white transition hover:text-secondary dark:hover:text-secondary"
                                >View All</a
                            >
                            <button
                                type="button"
                                class="testimonial-swiper-button-prev static mt-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition after:text-[0px] hover:bg-secondary rtl:rotate-180"
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
                                class="testimonial-swiper-button-next static mt-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition after:text-[0px] hover:bg-secondary rtl:rotate-180"
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
                    </swiper>
                </div>
            </section>

            <section class="bg-gradient-to-t from-white/[55%] to-transparent py-14 dark:bg-white/[0.02] dark:from-transparent lg:py-[100px]">
                <faq></faq>
            </section>

            <section class="bg-gradient-to-t from-white/[55%] to-transparent dark:bg-none">
                <blog-slider title="Blog" sub-title="Unlock the latest trends/news"></blog-slider>
            </section>

            <section class="py-14 dark:bg-gray-dark lg:py-[100px]">
                <div class="container">
                    <div class="relative z-10 flex flex-col gap-10 lg:flex-row lg:gap-20">
                        <div class="lg:w-1/4">
                            <div class="heading text-center lg:mb-0 ltr:lg:text-left rtl:lg:text-right">
                                <h6>Get In Touch.</h6>
                                <h4 class="sm:!leading-[50px]">Ready to Get Started?</h4>
                            </div>
                            <div class="relative h-72 lg:pt-8">
                                <div class="absolute top-0 right-4 hidden lg:block">
                                    <svg width="27" height="25" viewBox="0 0 27 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M25 4C16.682 8.68701 9.4252 16.0229 2 22" stroke="#B476E5" stroke-width="3" stroke-linecap="round" />
                                        <path d="M2 23C2 16.1327 2 8.88665 2 2" stroke="#B476E5" stroke-width="3" stroke-linecap="round" />
                                    </svg>
                                </div>
                                <div class="h-full overflow-hidden rounded-full rounded-tr-2xl">
                                    <img
                                        src="/assets/images/online-courses/girl-books.png"
                                        alt="form-img"
                                        class="mx-auto h-full w-full object-cover"
                                        data-aos="fade-right"
                                        data-aos-duration="1000"
                                    />
                                </div>
                            </div>
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
    </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    import BlogSlider from '@/components/BlogSlider.vue';
    import Faq from '@/components/Faq.vue';
    import CountUp from 'vue-countup-v3';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Navigation, Autoplay } from 'swiper';
    import 'swiper/css';
    import 'swiper/css/navigation';
    import { useAppStore } from '@/stores/index';
    import Modal from '@/components/Modal.vue';
    const store = useAppStore();
    const dialogbox: any = ref(null);
</script>
