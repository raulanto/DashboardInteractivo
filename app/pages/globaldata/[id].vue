<template>
    <UDashboardPanel id="dataset-view" :ui="{ body: 'gap-0 sm:p-0 p-0 overflow-hidden flex flex-col h-full' }">
        <!-- Navbar de Navegación -->
        <UDashboardNavbar :title="dataset?.nombre || 'Cargando...'" :ui="{ right: 'gap-3' }">
            <template #leading>
                <UButton
                    to="/board/analytics"
                    icon="i-heroicons-arrow-left"
                    variant="ghost"

                    label="Atrás"
                />
            </template>

            <template #right>
                <UButton
                    icon="i-heroicons-arrow-path"
                    variant="ghost"
                    @click="recargarDatos"
                    tooltip="Actualizar Datos"
                />
            </template>
        </UDashboardNavbar>

        <div class="flex flex-1 overflow-hidden">
            <!-- Columna Principal (Izquierda) -->
            <div class="flex-1 flex flex-col min-w-0 bg-neutral-50/50 dark:bg-neutral-950">


                <!-- Área de Contenido (Tabla) -->
                <div class="flex-1 overflow-hidden relative p-4 sm:p-6">

                    <!-- Estado de Carga -->
                    <div v-if="isLoading && !dataset" class="absolute inset-0 flex items-center justify-center">
                        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-primary-500 animate-spin" />
                    </div>

                    <!-- Estado de Error -->
                    <div v-else-if="!dataset" class="h-full flex flex-col items-center justify-center text-neutral-500 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <UIcon name="i-heroicons-exclamation-circle" class="w-12 h-12 mb-2 text-neutral-400" />
                        <h3 class="text-lg font-medium text-neutral-900 dark:text-white">Dataset no encontrado</h3>
                        <p>No se pudo cargar la información solicitada.</p>
                    </div>

                    <!-- Tabla con UTable -->
                    <UCard
                        v-else
                        class="h-full shadow-sm"
                    >
                        <template #header>
                            <div class="flex items-center justify-between gap-4">
                                <h3 class="text-base font-semibold leading-6 text-neutral-900 dark:text-white shrink-0">
                                    Registros de Datos
                                </h3>
                                <div class="flex items-center gap-2 flex-1 justify-end max-w-md">
                                    <UInput
                                        v-model="globalFilter"
                                        icon="i-heroicons-magnifying-glass"
                                        placeholder="Buscar en registros..."
                                        size="md"
                                        class="w-full"
                                    />
                                    <UButton icon="i-heroicons-arrow-down-tray" size="xs" color="neutral" variant="ghost" label="Exportar" />
                                </div>
                            </div>
                        </template>

                        <!-- Contenedor scrollable para la tabla -->
                        <div class=" inset-0 overflow-auto">
                            <UTable
                                :columns="dataset.columns"
                                :data="dataset.datos"
                                v-model:pagination="pagination"
                                sticky
                                class="w-full"
                                :ui="{
                                th: { base: 'sticky top-0 bg-gray-50 dark:bg-gray-800/50 backdrop-blur z-10' },
                                td: { base: 'max-w-[200px] truncate' }
                                                            }"
                                ref="table" v-model:global-filter="globalFilter"
                            >
                                <div class="flex justify-end border-t border-default pt-4 px-4">
                                    <UPagination
                                        :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                                        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                                        :total="table?.tableApi?.getFilteredRowModel().rows.length"
                                        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
                                    />
                                </div>
                            </UTable>
                        </div>
                    </UCard>
                </div>
            </div>

            <!-- Columna Derecha (Sidebar de Información) -->
            <div class="w-80 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-y-auto hidden xl:block p-6">

                <div class="space-y-6">
                    <!-- Tarjeta de Intro / Resumen -->
                    <UCard class="bg-primary-50 dark:bg-primary-900/10 ring-1 ring-primary-200 dark:ring-primary-800">
                        <div class="flex items-start gap-3">
                            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                            <div>
                                <h3 class="text-sm font-medium text-primary-800 dark:text-primary-200">Acerca de este Dataset</h3>
                                <p class="text-xs text-primary-700 dark:text-primary-300 mt-1 leading-relaxed">
                                    Este panel proporciona una vista detallada de los datos brutos. Utiliza esta vista para auditoría, limpieza de datos o análisis granular que no es posible en los gráficos agregados.
                                </p>
                            </div>
                        </div>
                    </UCard>

                    <!-- Metadatos -->
                    <div>
                        <h4 class="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
                            Metadatos
                        </h4>
                        <dl class="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
                            <div class="py-2 flex justify-between">
                                <dt class="text-neutral-500">ID del Sistema</dt>
                                <dd class="font-mono text-xs text-neutral-900 dark:text-white truncate max-w-[120px]" :title="dataset?.id">{{ dataset?.id }}</dd>
                            </div>
                            <div class="py-2 flex justify-between">
                                <dt class="text-neutral-500">Total Registros</dt>
                                <dd class="font-semibold text-neutral-900 dark:text-white">{{ dataset?.datos.length || 0 }}</dd>
                            </div>
                            <div class="py-2 flex justify-between">
                                <dt class="text-neutral-500">Columnas</dt>
                                <dd class="text-neutral-900 dark:text-white">{{ dataset?.columnas.length || 0 }}</dd>
                            </div>
                            <div class="py-2 flex justify-between">
                                <dt class="text-neutral-500">Última Act.</dt>
                                <dd class="text-neutral-900 dark:text-white">Hace 2 horas</dd>
                            </div>
                        </dl>
                    </div>

                    <!-- Lista de Campos -->
                    <div>
                        <h4 class="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
                            Campos Disponibles
                        </h4>
                        <div class="flex flex-wrap gap-1.5">
                            <UBadge
                                v-for="col in dataset?.columnas"
                                :key="col"
                                color="neutral"
                                variant="soft"
                                size="xs"
                            >
                                {{ col }}
                            </UBadge>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </UDashboardPanel>

</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalDataStore } from '~/composables/useGlobalDataStore'
const table = useTemplateRef('table')

// Layout
definePageMeta({
    layout: 'board'
})

// Hooks
const route = useRoute()
const store = useGlobalDataStore()
const { datasets, isLoading, recargarDatos } = store


// Obtener ID de la URL
const datasetId = computed(() => route.params.id as string)

// Buscar el dataset reactivamente
const dataset = computed(() => {
    return datasets.value.find(d => d.id === datasetId.value)
})

const globalFilter = ref()
const pagination = ref({
    pageIndex: 0,
    pageSize: 5
})

onMounted(() => {
    if (datasets.value.length === 0) {
        recargarDatos()
    }
})
</script>

<style scoped>
#dataset-view {
    height: calc(100vh - 4rem);
}
</style>