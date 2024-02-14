<template>
    <div>
        <div class="flex gap-5" data-aos="fade-up" data-aos-duration="1000">
            <div class="h-10 w-10 flex-none text-black dark:text-white">
                <slot></slot>
            </div>
            <div class="flex-1">
                <h3 class="mb-2 text-[22px] font-extrabold text-black dark:text-white">
                    {{ serviceTitle }}
                </h3>
                <h5 class="mb-2 text-[20px] font-bold text-black dark:text-white">{{ serviceTitleSub }}</h5>
                <p class="line-clamp-4">
                    {{ serviceDesc }}
                </p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps({
    serviceTitle: {
        type: String,
        required: true
    },
    serviceTitleSub:{
        type:String,
        default:""
    },
    serviceDesc: {
        type: String,
        required: true
    }
});
</script>
<style lang=""></style>
