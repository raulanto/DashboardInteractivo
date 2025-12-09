<template>
    <UDashboardPanel id="analytics-view">
        <template #header>
            <!-- Navbar Superior -->
            <UDashboardNavbar title="Explorador de Datos" :ui="{ right: 'gap-3' }">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>

                <template #right>

                </template>
            </UDashboardNavbar>
        </template>
        <template #body>

            <div class="p-6 space-y-8">
                <StarBg />
                <UPageCTA variant="naked" class="overflow-hidden" title="Explora Datos Globales"
                    description="Accede a una variedad de datasets globales para potenciar tus análisis y visualizaciones.">
                </UPageCTA>
                <USeparator />


                <section class="flex items-center justify-between mb-4 mx-container mt-8">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5 text-neutral-500" />
                        <h2 class="text-lg font-medium text-neutral-900 dark:text-white">Mis Tableros Guardados</h2>

                        <UBadge v-if="datasets" :label="filteredBoards.length" variant="subtle" />
                    </div>

                    <UInput v-model="q" icon="i-heroicons-magnifying-glass" placeholder="Buscar tablero..." size="sm" />
                </section>



                <!-- Estado de Carga -->
                <div v-if="isLoading && datasets.length === 0" class="space-y-4">
                    <USkeleton class="h-20 w-full" v-for="i in 5" :key="i" />
                </div>

                <!-- LISTA DE DATASETS (Catálogo) -->
                <div v-else class="">
                    <div v-if="datasets.length === 0" class="">

                        <UEmpty variant="naked" icon="i-heroicons-circle-stack" title="No hay datasets disponibles"
                            description="No se encontraron datos globales para mostrar." :actions="[
                                {
                                    icon: 'i-lucide-refresh-cw',
                                    label: 'Refrescar',
                                    color: 'error',
                                    variant: 'soft',
                                    onClick: () => recargarDatos()
                                }
                            ]" />

                    </div>

                    <UPageGrid class="gap-3">
                        <!-- NuxtLink envuelve la tarjeta para navegación nativa -->
                        <CardDataSet :datasets="filteredBoards" />
                    </UPageGrid>
                </div>


            </div>

        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { useGlobalDataStore } from "~/composables/useGlobalDataStore";

definePageMeta({
    layout: "board",
});

// Store
const store = useGlobalDataStore();
const { datasets, isLoading, recargarDatos } = store;
const filteredBoards = computed(() => {
    if (!datasets.value) return []
    if (!q.value) return datasets.value
    return datasets.value.filter((board) => {
        return board.nombre.toLowerCase().includes(q.value.toLowerCase())
    })
})
const q = ref('')
</script>

<style scoped>
#analytics-view {
    height: calc(100vh - 4rem);
}
</style>
