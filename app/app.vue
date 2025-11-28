
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
const appConfig = useAppConfig()

</script>


<template>
    <UApp :toaster="appConfig.toaster">
        <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
    <Analytics/>
</template>
