<script setup lang="ts">

import type { SavedBoard } from '~/types/saveBoard'

definePageMeta({
    layout: 'board'
})

const { data: savedBoards, pending, error ,refresh} = await useFetch<SavedBoard[]>('/api/myBoards')


const q = ref('')
const links = ref([
    {
        label: 'Crear Tablero',
        color: 'primary',
        variant: 'soft',
        to: "/board/CreateBoard",
        trailingIcon: 'i-lucide-arrow-right'
    }
])

const filteredBoards = computed(() => {
    if (!savedBoards.value) return []
    if (!q.value) return savedBoards.value
    return savedBoards.value.filter((board) => {
        return board.title.toLowerCase().includes(q.value.toLowerCase())
    })
})
</script>

<template>
    <UDashboardPanel id="home">
        <template #header>
            <UDashboardNavbar title="Inicio" :ui="{ right: 'gap-3' }">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>

            <UDashboardToolbar>
                <template #left>
                    <div class="flex flex-col">
                        <h1 class="text-xl font-semibold text-neutral-900 dark:text-white">Bienvenido de nuevo</h1>

                    </div>
                </template>
            </UDashboardToolbar>
        </template>

        <template #body>
            <StarBg />

            <div class="p-6 space-y-8">
                <UPageCTA variant="naked" class="overflow-hidden" title="Crea y administra tus tableros de control"
                    description="Organiza tus datos visualmente con nuestros tableros personalizables. ¡Comienza ahora!"
                    :links="links" />

                <USeparator />

                <!-- Sección 2: Mis Tableros -->
                <section>
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5 text-neutral-500" />
                            <h2 class="text-lg font-medium text-neutral-900 dark:text-white">Mis Tableros Guardados</h2>
                            <!-- Usamos filteredBoards.length para que el contador se actualice al buscar -->
                            <UBadge v-if="savedBoards" :label="filteredBoards.length" variant="subtle" />
                        </div>

                        <!-- 4. Conectamos el v-model aquí -->
                        <UInput v-model="q" icon="i-heroicons-magnifying-glass" placeholder="Buscar tablero..."
                            size="sm" />
                    </div>

                    <!-- Estado de carga -->
                    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <USkeleton class="h-40 w-full" v-for="i in 3" :key="i" />
                    </div>

                    <!-- Estado de error -->
                    <UAlert v-else-if="error" title="Error al cargar tableros"
                        description="No se pudieron recuperar tus tableros guardados." color="error" variant="subtle"
                        icon="i-heroicons-exclamation-triangle" />

                    <!-- Lista de Tableros (Grid) -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                        <!-- 5. Pasamos filteredBoards en lugar de savedBoards -->
                        <Tableros :saved-boards="filteredBoards" />

                        <!-- Card para crear nuevo -->
                        <UEmpty color="neutral" icon="i-heroicons-plus" title="Crear tablero"
                            class="h-full border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center gap-2 p-6 hover:border-primary-500 hover:text-primary-500 transition-colors group"
                            :actions="[
                                {
                                    icon: 'i-lucide-plus',
                                    label: 'Create new',
                                    to: '/board/CreateBoard',
                                    color: 'primary',
                                    variant: 'soft'
                                },
                            ]">


                        </UEmpty>

                    </div>

                    <!-- Opcional: Mensaje si no hay resultados en la búsqueda -->
                    <div v-if="!pending && !error && filteredBoards.length === 0 && q"
                        class="text-center py-8 text-neutral-500">
                        No se encontraron tableros con el nombre "{{ q }}"
                    </div>
                </section>
            </div>
        </template>
    </UDashboardPanel>
</template>