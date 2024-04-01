<template>
    <footer class="mt-auto bg-white dark:bg-transparent dark:bg-gradient-to-b dark:from-white/[0.03] dark:to-transparent">
        <div class="container">
            <div class="grid gap-y-10 gap-x-4 py-14 xm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:py-[100px]">
                <div class="relative">
                    <div class="flex flex-row gap-2">
                        <img src="/assets/images/h-logo.png" alt="plurk" width="70"/>
                        <span class="text-lg font-semibold text-black">KJPP Henricus Judi Adrianto dan Rekan</span>
                    </div>

                    <ul class="mt-12 flex items-center">
                        <li>
                        <p class="gap-1">Catch us on our social media platforms!</p>
                            <a href="https://www.instagram.com/kjpphenricusdanrekan/" target="_blank">
                                <svg
                                    width="23"
                                    height="22"
                                    viewBox="0 0 23 22"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="transition hover:scale-110 hover:text-secondary"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M7.75995 0H16.0099C19.8063 0 22.8849 3.07862 22.8849 6.875V15.125C22.8849 18.9214 19.8063 22 16.0099 22H7.75995C3.96357 22 0.884949 18.9214 0.884949 15.125V6.875C0.884949 3.07862 3.96357 0 7.75995 0ZM16.0099 19.9375C18.6637 19.9375 20.8224 17.7787 20.8224 15.125V6.875C20.8224 4.22125 18.6637 2.0625 16.0099 2.0625H7.75995C5.1062 2.0625 2.94745 4.22125 2.94745 6.875V15.125C2.94745 17.7787 5.1062 19.9375 7.75995 19.9375H16.0099Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M6.38495 11C6.38495 7.96263 8.84757 5.5 11.8849 5.5C14.9223 5.5 17.3849 7.96263 17.3849 11C17.3849 14.0374 14.9223 16.5 11.8849 16.5C8.84757 16.5 6.38495 14.0374 6.38495 11ZM8.44745 11C8.44745 12.8948 9.9902 14.4375 11.8849 14.4375C13.7797 14.4375 15.3224 12.8948 15.3224 11C15.3224 9.10388 13.7797 7.5625 11.8849 7.5625C9.9902 7.5625 8.44745 9.10388 8.44745 11Z"
                                        fill="currentColor"
                                    />
                                    <circle cx="17.7975" cy="5.08737" r="0.732875" fill="currentColor" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
                 <div>
                    <ul class="flex flex-col gap-3 font-bold">
                        <li class="mb-3 text-lg font-extrabold text-black dark:text-white">Addresses</li>
                        <li>(Kantor Pusat) <br> Ruko Terminal, Jl. Sako Raya Jl. Siaran No.18, Sialang, Kec. Sako, Kota Palembang, Sumatera Selatan 30163</li>
                    </ul>
                </div>
                <div>
                    <ul class="flex flex-col gap-1 font-bold">
                        <li class="mb-3 text-lg font-extrabold text-black dark:text-white">Kontak</li>
                        <li>
                            <a href="tel:+(62811) 7101066" class="inline-block transition hover:scale-110 hover:text-secondary">0811-7101-066 (Henricus Judi Adrianto)</a>
                        </li>
                        <li>
                            <a href="tel:+(62811) 7101610" class="inline-block transition hover:scale-110 hover:text-secondary">0811-7101-610 (Marleen Erna Dien)</a>
                        </li>
                        <li>
                            <a href="tel:+(62821) 75187742" class="inline-block transition hover:scale-110 hover:text-secondary">0821-7518-7742 (Maria Saputri)</a>
                        </li>
                        <li>
                            <a href="tel:+(62899) 5829576" class="inline-block transition hover:scale-110 hover:text-secondary">0899-5829-576 (Dhoratia Rossa)</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="bg-gradient-to-r from-[#FCF1F4] to-[#EDFBF9] py-5 dark:border-t-2 dark:border-white/5 dark:bg-none">
            <div class="container">
                <div class="flex flex-col items-center justify-between text-center font-bold dark:text-white md:flex-row">
                    <div>
                        Copyright© {{ new Date().getFullYear() }}
                        <a href="javascript:" class="text-primary transition hover:text-secondary">KJPP Henricus Judi Adrianto dan Rekan</a>
                    </div>
                    <div>
                        Need help? Visit the
                        <router-link to="/contact-us" class="text-secondary transition hover:text-primary">Contact Us</router-link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>
