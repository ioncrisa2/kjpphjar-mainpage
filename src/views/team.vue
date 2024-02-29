<script setup lang="ts">
import { useAppStore } from '@/stores/index';
const store = useAppStore();

interface Rekan {
    gambar: string;
    nama: string;
}

const rekanan: Array<Rekan> = [
    // rekanan bank
    { gambar: '/assets/images/rekanan/BNI-v2.png', nama: 'Bank BNI' },
    { gambar: '/assets/images/rekanan/BTN.png', nama: 'Bank BTN' },
    { gambar: '/assets/images/rekanan/BSI.png', nama: 'Bank BSI' },
    { gambar: '/assets/images/rekanan/Bank-Sumsel-Babel.png', nama: 'Bank Sumsel Babel' },
    { gambar: '/assets/images/rekanan/Bank-Sumsel-Babel-Syariah-v.png', nama: 'Bank Sumsel Babel Syariah' },
    { gambar: '/assets/images/rekanan/bank-indonesia.png', nama: 'Bank Indonesia' },
    { gambar: '/assets/images/rekanan/Bank-Panin-v2.png', nama: 'Bank Panin' },
    { gambar: '/assets/images/rekanan/OCBC-NISP.png', nama: 'OCBC NISP' },
    { gambar: '/assets/images/rekanan/Bank-Maspion.png', nama: 'Bank Maspion' },
    { gambar: '/assets/images/rekanan/Bank-Sahabat-Sampoerna.png', nama: 'Bank Sahabat Sampoerna' },
    { gambar: '/assets/images/rekanan/Bank-Nobu.png', nama: 'Bank Nobu' },
    { gambar: '/assets/images/rekanan/Bank-Index.png', nama: 'Bank Index' },
    { gambar: '/assets/images/rekanan/bank-mandiri.png', nama: 'Bank Mandiri' },
    { gambar: '/assets/images/rekanan/hana-bank.png', nama: 'Bank Hana' },
    { gambar: '/assets/images/rekanan/bank-danamon.png', nama: 'Bank Danamon' },
    { gambar: '/assets/images/rekanan/jtrust-bank.png', nama: 'J Trust Bank' },
    { gambar: '/assets/images/rekanan/bank-woori-saudara.png', nama: 'Bank Woori Saudara' },
    // pemerintahan
    { gambar: '/assets/images/rekanan/Pemkot-Pekanbaru.png', nama: 'Pemerintah Kota Pekanbaru' },
    { gambar: '/assets/images/rekanan/Pemkab-Tangerang.png', nama: 'Pemerintah Kabupaten Tanggerang' },
    { gambar: '/assets/images/rekanan/Pemprov-Sumatera-Selatan-150x150.png', nama: 'Pemerintahan Provinsi Sumatera Selatan' },
    { gambar: '/assets/images/rekanan/Pemkab-Sumbawa-150x150.png', nama: 'Pemerintahan Kabupaten Sumbawa' },
    { gambar: '/assets/images/rekanan/Pemkab-Sumbawa-Barat-v.2.png', nama: 'Pemerintahan Kabupaten Sumbawa Barat' },
    { gambar: '/assets/images/rekanan/Pemkot-Cilegon.png', nama: 'Pemerintahan Kota Cilegon' },
    { gambar: '/assets/images/rekanan/Pemkot-Pagaralam-150x150.png', nama: 'Pemerintahan Kota Pagaralam' },
    { gambar: '/assets/images/rekanan/Pemprov-Sulawesi-Utara.png', nama: 'Pemerintahan Provinsi Sulawesi Utara' },
    { gambar: '/assets/images/rekanan/pemkab-surabaya.png', nama: 'Pemerintahan Kota Surabaya' },
    { gambar: '/assets/images/rekanan/PDPDE-v.2.png', nama: 'PDPDE' },
    // lain-lain
    { gambar: '/assets/images/rekanan/Social-Market-Palembang-150x150.png', nama: 'Social Market Palembang' },
    { gambar: '/assets/images/rekanan/PT.-Semen-Baturaja-Tbk-150x148.png', nama: 'PT. Semen Baturaja. Tbk' },
    { gambar: '/assets/images/rekanan/PLN.png', nama: 'PT. PLN (Persero)' },
    { gambar: '/assets/images/rekanan/PT-Pupuk-Sriwidjaja-Palembang.png', nama: 'PT. Pupuk Sriwidjaja Palembang' },
    { gambar: '/assets/images/rekanan/PT.-Angkasa-Pura-II-150x150.png', nama: 'PT. Angkasa Pura II' },
    { gambar: '/assets/images/rekanan/sucofindo.png', nama: 'PT. Sucofindo' },
    { gambar: '/assets/images/rekanan/pt-astra-internasional-tbk.png', nama: 'PT. Astra Internasional, Tbk' },
    { gambar: '/assets/images/rekanan/PNM-ventura-syariah.png', nama: 'PT. PNM Ventura Syariah' },
    { gambar: '/assets/images/rekanan/bpr-batari.png', nama: 'PT. BPR Buana Artha Lestari' },
    { gambar: '/assets/images/rekanan/BPR-TGS.png', nama: 'PT. BPR Tri Gunung Selatan' },
    { gambar: '/assets/images/rekanan/grand-inna-daira-palembang.png', nama: 'Grand Inna Daira Palembang' },
    { gambar: '/assets/images/rekanan/pt-bukit-asam.png', nama: 'PT. Bukit Asam' },
]
</script>


<template>
    <div>
        <div
            class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
            <div class="relative">
                <div class="container">
                    <div class="items-center justify-between py-10 md:flex md:h-[400px] md:py-0">
                        <div class="heading relative mb-0 text-center ltr:md:text-left rtl:md:text-right">
                            <h4 class="!text-white">Rekan dan Client</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="bg-white/50 py-14 dark:bg-transparent lg:py-[50px]">
            <div class="container">
                <div class="heading text-center">
                    <h4>Rekan dan Client yang pernah menggunakan Jasa KJPP Henricus Judi Adrianto dan Rekan</h4>
                </div>
                <div class="grid grid-cols-2 gap-1 xs:grid-cols-1 sm:grid-cols-3 sm:gap-2 md:grid-cols-3 lg:grid-cols-5 bg-gray/5 rounded-[32px]">
                    <div data-aos="fade-up" data-aos-duration="1000" v-for="rekan in rekanan" :key="rekan.gambar">
                        <div
                            class="group flex flex-col items-center justify-center py-[50px] px-[50px] transition duration-500 rounded-[32px] hover:bg-gray/10 hover:drop-shadow-[0_5px_13px_rgba(60,72,88,0.20)]">
                            <img :src="rekan.gambar" alt="Company Logo" class="mb-2" />
                            <span class="text-center text-sm font-semibold text-gray-600">{{rekan.nama}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>
