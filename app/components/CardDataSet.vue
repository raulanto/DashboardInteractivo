<script setup lang="ts">
interface Dataset {
    id: string;
    nombre: string;
    tipo: string;
    columnas: string[];
    datos: any[];
}

const props = defineProps({
    datasets: {
        type: Array as () => Dataset[],
        required: true,
    },
});
// Helpers
import getIconForType from "~/utils/getIconForType";
</script>

<template>
    <NuxtLink v-for="dataset in props.datasets" :key="dataset.id"
        :to="{ name: 'globaldata-id', params: { id: dataset.id } }" class="block group">
        <UPageCard class="h-full bg-accented" :icon="getIconForType(dataset.tipo)" spotlight spotlight-color="primary">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div>
                        <h3 class="font-semibold line-clamp-1" :title="dataset.nombre">
                            {{ dataset.nombre }}
                        </h3>
                        <p class="text-xs capitalize flex items-center gap-1 text-dimed">
                            {{ dataset.tipo }} <span class="w-1 h-1 rounded-full"></span> ID:
                            {{ dataset.id.substring(0, 8) }}...
                        </p>
                    </div>
                </div>
            </div>
            <USeparator/>
            <div class="flex items-center justify-between pt-2">
                <div class="flex gap-4 text-xs">
                    <span class="flex items-center gap-1 text-default">
                        <UIcon name="i-heroicons-table-cells" class="w-4 h-4" />
                        {{ dataset.columnas.length }} cols
                    </span>
                    <span class="flex items-center gap-1 text-default">
                        <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
                        {{ dataset.datos.length }} filas
                    </span>
                </div>
                <UButton icon="i-heroicons-arrow-right" variant="ghost" />

            </div>
        </UPageCard>
    </NuxtLink>
</template>

<style scoped></style>
