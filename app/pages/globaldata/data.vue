<template>
    <UDashboardPanel id="analytics-view" :ui="{ body: 'gap-0 sm:p-0 p-0 overflow-hidden flex flex-col h-full' }">
        <!-- Navbar Superior -->
        <UDashboardNavbar title="Explorador de Datos" :ui="{ right: 'gap-3' }">
            <template #leading>
                <UDashboardSidebarCollapse />
            </template>

            <template #right>
                <UButton
                    icon="i-heroicons-arrow-path"
                    color="gray"
                    variant="ghost"
                    :loading="isLoading"
                    @click="recargarDatos"
                    tooltip="Recargar Datos"
                />
            </template>
        </UDashboardNavbar>

        <!-- Contenido Principal -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-950">

            <!-- Estado de Carga -->
            <div v-if="isLoading && datasets.length === 0" class="space-y-4">
                <USkeleton class="h-20 w-full" v-for="i in 5" :key="i" />
            </div>

            <!-- LISTA DE DATASETS (Catálogo) -->
            <div v-else class="max-w-7xl mx-auto">

                <div v-if="datasets.length === 0" class="text-center py-12 flex flex-col items-center">
                    <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                        <UIcon name="i-heroicons-circle-stack" class="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">No hay datasets disponibles</h3>
                    <p class="text-gray-500 mt-1">No se encontraron datos globales para mostrar.</p>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- NuxtLink envuelve la tarjeta para navegación nativa -->
                    <NuxtLink
                        v-for="dataset in datasets"
                        :key="dataset.id"
                        :to="{ name: 'globaldata-id', params: { id: dataset.id } }"
                        class="block group"
                    >
                        <UCard
                            class="h-full hover:ring-2 hover:ring-primary-500/50 cursor-pointer transition-all"
                            :ui="{ body: { padding: 'p-4' } }"
                        >
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex items-center gap-3">
                                    <div class="p-2.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                                        <UIcon :name="getIconForType(dataset.tipo)" class="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-1" :title="dataset.nombre">
                                            {{ dataset.nombre }}
                                        </h3>
                                        <p class="text-xs text-gray-500 capitalize flex items-center gap-1">
                                            {{ dataset.tipo }} <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span> ID: {{ dataset.id.substring(0,8) }}...
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                                <div class="flex gap-4 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-heroicons-table-cells" class="w-4 h-4" />
                    {{ dataset.columnas.length }} cols
                  </span>
                                    <span class="flex items-center gap-1">
                    <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
                    {{ dataset.datos.length }} filas
                  </span>
                                </div>
                                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
                            </div>
                        </UCard>
                    </NuxtLink>
                </div>
            </div>

        </div>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { useGlobalDataStore } from '~/composables/useGlobalDataStore'

// Layout
definePageMeta({
    layout: 'board'
})

// Store
const store = useGlobalDataStore()
const { datasets, isLoading, recargarDatos } = store

// Helpers
const getIconForType = (tipo: string) => {
    switch(tipo) {
        case 'tabla': return 'i-heroicons-table-cells'
        case 'grafico': return 'i-heroicons-chart-bar'
        case 'estadistica': return 'i-heroicons-calculator'
        default: return 'i-heroicons-document'
    }
}
</script>

<style scoped>
#analytics-view {
    height: calc(100vh - 4rem);
}
</style>