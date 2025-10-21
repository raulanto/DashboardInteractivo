<script setup lang="ts">

import type {DropdownMenuItem} from '@nuxt/ui'
import NewBoard from "~/components/Dashboard/NewBoard.vue";


const items = [[{
    label: 'New mail',
    icon: 'i-lucide-send',
    to: '/inbox'
}, {
    label: 'New customer',
    icon: 'i-lucide-user-plus',
    to: '/customers'
}]] satisfies DropdownMenuItem[][]
definePageMeta({
    layout: 'board'

})

</script>

<template>
    <UDashboardPanel id="home">
        <template #header>
            <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>

                <template #right>

                </template>
            </UDashboardNavbar>

            <UDashboardToolbar>
                <template #left>
                    Desarrolla y crea pnales de control impresionantes y personalizados de forma rápida y sencilla
                </template>
            </UDashboardToolbar>
        </template>

        <template #body>
        <new-board/>

        </template>
    </UDashboardPanel>
</template>
