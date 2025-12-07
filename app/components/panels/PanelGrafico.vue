<template>
    <div v-if="data" class="h-full flex flex-col group">
        <div
            class="flex items-center justify-between mb-2 pb-2 border-b border-neutral-200 dark:border-neutral-700"
        >
            <div class="flex flex-col items-start gap-1">
                <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 text-primary" />
                    <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {{ data.titulo || "Gráfico" }}
                    </span>
                </div>
                <UBadge
                    v-if="data.datasetId"
                    :label="labelFuente"
                    size="xs"
                    :color="globalDataset ? 'primary' : 'error'"
                    :variant="globalDataset ? 'subtle' : 'solid'"
                />
            </div>

            <div class="flex items-center gap-1">
                <UTooltip text="Filtrar rango de fechas">
                    <UButton
                        :icon="showFilter ? 'i-heroicons-funnel-solid' : 'i-heroicons-funnel'"
                        size="xs"
                        :color="showFilter ? 'primary' : 'neutral'"
                        variant="ghost"
                        @click="showFilter = !showFilter"
                    />
                </UTooltip>

            </div>
        </div>

        <div
            v-if="showFilter && finalChartData.length > 1"
            class="mb-4 px-2 py-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 animate-in slide-in-from-top-2 duration-200"
        >
            <div class="flex justify-between text-xs text-neutral-500 mb-2 font-mono">
                <span>{{ formatDateLabel(rangeValue[0]) }}</span>
                <span class="font-medium text-primary">Zoom: {{ rangePercentage }}%</span>
                <span>{{ formatDateLabel(rangeValue[1]) }}</span>
            </div>

            <USlider
                v-model="rangeValue"
                :min="0"
                :max="finalChartData.length - 1"
                size="sm"
                color="primary"
                :step="1"
            />
        </div>

        <div class="flex-1 min-h-0 relative">
            <client-only>
                <AreaChart
                    v-if="filteredData.length > 0"
                    :data="filteredData"
                    :height="chartHeight"
                    :categories="finalCategories"
                    :y-grid-line="true"
                    :x-formatter="xFormatter"
                    :curve-type="curveType"
                    :legend-position="legendPosition"
                    :hide-legend="false"
                />

                <div
                    v-else
                    class="h-full flex flex-col items-center justify-center text-center p-4 absolute inset-0"
                >
                    <UIcon
                        name="i-heroicons-chart-bar-square"
                        class="w-12 h-12 text-neutral-400 dark:text-neutral-600 mb-3"
                    />
                    <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {{ data.datasetId && !globalDataset ? 'Dataset no encontrado (ID inválido)' : 'No hay datos para mostrar' }}
                    </p>
                    <UButton
                        icon="i-heroicons-plus"
                        size="sm"
                        color="primary"
                        @click="$emit('open-config')"
                    >
                        {{ data.datasetId ? 'Revisar Dataset' : 'Agregar Datos' }}
                    </UButton>
                </div>
            </client-only>
        </div>
    </div>
    <div v-else>
        <p class="text-sm text-neutral-600 dark:text-neutral-400 p-4">
            No hay datos para mostrar
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { ComputedRef } from "vue";
import { useGlobalDataStore } from '~/composables/useGlobalDataStore';
import type { GraficoData, GraficoDataPoint } from "~/types/panel";
// import { useDebounceFn } from '@vueuse/core'; // Opcional para optimización extrema

interface Props {
    data: GraficoData;
}

const props = defineProps<Props>();

defineEmits<{
    "open-config": [];
}>();

const { datasets } = useGlobalDataStore();

// --- LÓGICA DE DATOS EXISTENTE ---

const globalDataset = computed(() => {
    if (!props.data.datasetId) return undefined;
    return datasets.value.find(d => d.id === props.data.datasetId);
});

const labelFuente = computed(() => {
    if (!props.data.datasetId) return '';
    if (globalDataset.value) {
        return `Fuente: ${globalDataset.value.nombre}`;
    }
    return `Error: Dataset no hallado`;
});

const finalChartData = computed<GraficoDataPoint[]>(() => {
    if (globalDataset.value) {
        return (globalDataset.value.datos as GraficoDataPoint[]) || [];
    }
    return props.data.datos || [];
});

const finalCategories: ComputedRef<Record<string, BulletLegendItemInterface>> = computed(() => {
    if (globalDataset.value) {
        const categories: Record<string, BulletLegendItemInterface> = {};
        const seriesKeys = globalDataset.value.columnas.filter(c => c.toLowerCase() !== 'date' && c.toLowerCase() !== 'fecha');
        const coloresBase = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

        seriesKeys.forEach((key, index) => {
            const localSerieConfig = props.data.series?.find(s => s.key === key);
            categories[key] = {
                name: localSerieConfig?.name || key,
                color: localSerieConfig?.color || coloresBase[index % coloresBase.length]
            };
        });
        return categories;
    }

    const cats: Record<string, BulletLegendItemInterface> = {};
    if (props.data.series && props.data.series.length > 0) {
        props.data.series.forEach((serie) => {
            cats[serie.key] = {
                name: serie.name,
                color: serie.color,
            };
        });
    }
    return cats;
});

// --- NUEVA LÓGICA DE FILTRADO (UI/UX) ---

const showFilter = ref(false);
// Usamos índices (0 a N) en lugar de fechas para el slider, es más performante.
const rangeValue = ref<[number, number]>([0, 0]);

// Watcher inteligente: Si los datos cambian (carga inicial o cambio de dataset),
// reseteamos el filtro para mostrar todo.
watch(finalChartData, (newData) => {
    if (newData && newData.length > 0) {
        rangeValue.value = [0, newData.length - 1];
    } else {
        rangeValue.value = [0, 0];
    }
}, { immediate: true });

// Computed principal para el gráfico: Corta el array basado en el slider
const filteredData = computed(() => {
    const data = finalChartData.value;
    if (!data.length) return [];

    // Validaciones de seguridad
    const start = Math.max(0, rangeValue.value[0]);
    const end = Math.min(data.length - 1, rangeValue.value[1]);

    // Slice es eficiente, pero recuerda que el segundo argumento es exclusivo, por eso +1
    // Si start > end (usuario cruza los sliders), slice devuelve array vacío automáticamente o podemos invertirlo
    if (start > end) return data.slice(end, start + 1);

    return data.slice(start, end + 1);
});

// Porcentaje visual de datos mostrados (UX)
const rangePercentage = computed(() => {
    const total = finalChartData.value.length;
    if (!total) return 0;
    const current = filteredData.value.length;
    return Math.round((current / total) * 100);
});

// Helper para obtener fecha formateada basada en índice
const formatDateLabel = (index: number): string => {
    const item = finalChartData.value[index];
    if (!item) return '';

    const dateKey = Object.keys(item).find(k => k.toLowerCase() === 'date' || k.toLowerCase() === 'fecha') || 'date';
    const val = item[dateKey];

    if (val) {
        try {
            const date = new Date(val as string);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: '2-digit' });
            }
        } catch (e) {}
    }
    return String(index);
}


// --- LÓGICA DE CONFIGURACIÓN DE GRÁFICO (LEGACY) ---

const chartHeight = computed(() => 250);

const curveType = computed(() => {
    const type = props.data.curveType || "monotoneX";
    return CurveType[type as keyof typeof CurveType] || CurveType.MonotoneX;
});

const legendPosition = computed(() => {
    const position = props.data.legendPosition || "top";
    return (
        LegendPosition[position as keyof typeof LegendPosition] ||
        LegendPosition.Top
    );
});

// Formateador X (ligeramente ajustado para usar filteredData si fuera necesario, pero el índice se mantiene)
// Nota: Unovis/Charts suelen usar el índice del array pasado.
const xFormatter = (tickIndex: number): string => {
    // IMPORTANTE: El tickIndex aquí viene del array YA FILTRADO (filteredData),
    // así que accedemos a filteredData, no a finalChartData global.
    const dataArray = filteredData.value;

    if (!dataArray || dataArray.length === 0) return "";
    const item = dataArray[tickIndex];
    if (!item) return "";

    const dateKey = Object.keys(item).find(k => k.toLowerCase() === 'date' || k.toLowerCase() === 'fecha') || 'date';
    const val = item[dateKey];

    if (val) {
        try {
            const date = new Date(val as string);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                });
            }
        } catch (e) {}
        return String(val);
    }
    return "";
};
</script>