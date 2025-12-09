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
    <UPageCard v-for="dataset in props.datasets" :key="dataset.id"
        class="group bg-accented cursor-pointer hover:ring-2 hover:ring-primary-500/50 transition-all duration-200 hover:-translate-y-1"
        :icon="getIconForType(dataset.tipo)" :to="{ name: 'globaldata-id', params: { id: dataset.id } }" spotlight
        spotlight-color="primary">
        <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
                <div>
                    <h3 class="font-semibold text-highlighted group-hover:text-primary transition-colors">
                        {{ dataset.nombre }}
                    </h3>
                    <p class="text-xs capitalize flex items-center gap-1 text-dimed">
                        {{ dataset.tipo }} <span class="w-1 h-1 rounded-full"></span> ID:
                        {{ dataset.id.substring(0, 8) }}...
                    </p>
                </div>
            </div>
        </div>
        <div class="flex items-center justify-between pt-2">
            <div class="flex gap-2 text-xs">

                <UBadge :label="dataset.columnas.length + ' columnas'" variant="subtle"
                    icon="i-heroicons-table-cells" />
                <UBadge :label="dataset.datos.length + ' filas'" variant="subtle" icon="i-heroicons-list-bullet" />
            </div>

        </div>
    </UPageCard>

</template>

<style scoped></style>
