<template>
    <UDashboardPanel id="analytics-view" :ui="{ body: 'gap-0 sm:p-0 p-0 overflow-hidden flex flex-col h-full' }">
        <!-- Navbar Superior -->
        <UDashboardNavbar title="Explorador de Datos" :ui="{ right: 'gap-3' }">
            <template #leading>
                <UDashboardSidebarCollapse />
            </template>

            <template #right>
                <UButton icon="i-heroicons-arrow-path" variant="ghost" :loading="isLoading" @click="recargarDatos"
                    tooltip="Recargar Datos" />
            </template>
        </UDashboardNavbar>

        <!-- Contenido Principal -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 ">
            <!-- Estado de Carga -->
            <div v-if="isLoading && datasets.length === 0" class="space-y-4">
                <USkeleton class="h-20 w-full" v-for="i in 5" :key="i" />
            </div>

            <!-- LISTA DE DATASETS (Catálogo) -->
            <div v-else class="max-w-7xl mx-auto">
                <div v-if="datasets.length === 0" class="text-center py-12 flex flex-col items-center">
                    <div class="bg-elevated p-4 rounded-full mb-4">
                        <UIcon name="i-heroicons-circle-stack" class="w-8 h-8 text-default" />
                    </div>
                    <h3 class="text-lg font-medium text-default ">
                        No hay datasets disponibles
                    </h3>
                    <p class="text-default mt-1">
                        No se encontraron datos globales para mostrar.
                    </p>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- NuxtLink envuelve la tarjeta para navegación nativa -->
                    <CardDataSet :datasets="datasets" />
                </div>
            </div>
        </div>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { useGlobalDataStore } from "~/composables/useGlobalDataStore";
import getIconForType from "~/utils/getIconForType";
// Layout
definePageMeta({
    layout: "board",
});

// Store
const store = useGlobalDataStore();
const { datasets, isLoading, recargarDatos } = store;

// Helpers

</script>

<style scoped>
#analytics-view {
    height: calc(100vh - 4rem);
}
</style>
