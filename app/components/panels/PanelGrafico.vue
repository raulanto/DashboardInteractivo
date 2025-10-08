<template>
    <div class="h-full flex flex-col">
        <!-- Encabezado con botón de configuración -->
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 text-primary" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ data.titulo || 'Gráfico' }}
        </span>
            </div>
            <UButton
                icon="i-heroicons-cog-6-tooth"
                size="xs"
                color="neutral"
                variant="ghost"
                @click="$emit('open-config')"
            >
                Configurar
            </UButton>
        </div>

        <!-- Gráfico -->
        <div class="flex-1 min-h-0">
            <client-only>
                <AreaChart
                    v-if="chartData.length > 0"
                    :data="chartData"
                    :height="chartHeight"
                    :categories="categories"
                    :y-grid-line="true"
                    :x-formatter="xFormatter"
                    :curve-type="curveType"
                    :legend-position="legendPosition"
                    :hide-legend="false"
                />
                <div
                    v-else
                    class="h-full flex flex-col items-center justify-center text-center p-4"
                >
                    <UIcon name="i-heroicons-chart-bar-square" class="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        No hay datos para mostrar
                    </p>
                    <UButton
                        icon="i-heroicons-plus"
                        size="sm"
                        color="primary"
                        @click="$emit('open-config')"
                    >
                        Agregar Datos
                    </UButton>
                </div>
            </client-only>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComputedRef } from 'vue'


interface GraficoDataPoint {
    date: string
    [key: string]: string | number
}

interface GraficoSerie {
    key: string
    name: string
    color: string
}

interface GraficoData {
    titulo?: string
    datos: GraficoDataPoint[]
    series: GraficoSerie[]
    curveType?: string
    legendPosition?: string
}

interface Props {
    data: GraficoData
}

const props = defineProps<Props>()

defineEmits<{
    'open-config': []
}>()

// Datos del gráfico
const chartData = computed(() => props.data.datos || [])

// Altura dinámica basada en el contenedor
const chartHeight = computed(() => {
    // Ajustar según el espacio disponible
    return 250
})

// Categorías/Series del gráfico
const categories: ComputedRef<Record<string, BulletLegendItemInterface>> = computed(() => {
    const cats: Record<string, BulletLegendItemInterface> = {}

    if (props.data.series && props.data.series.length > 0) {
        props.data.series.forEach(serie => {
            cats[serie.key] = {
                name: serie.name,
                color: serie.color
            }
        })
    }

    return cats
})

// Tipo de curva
const curveType = computed(() => {
    const type = props.data.curveType || 'monotoneX'
    return CurveType[type as keyof typeof CurveType] || CurveType.MonotoneX
})

// Posición de la leyenda
const legendPosition = computed(() => {
    const position = props.data.legendPosition || 'top'
    return LegendPosition[position as keyof typeof LegendPosition] || LegendPosition.Top
})

// Formateador del eje X
const xFormatter = (tick: number): string => {
    const item = chartData.value[tick]
    if (!item) return ''

    // Formatear fecha si es una fecha válida
    try {
        const date = new Date(item.date)
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric'
            })
        }
    } catch (e) {
        // Si no es fecha, retornar como está
    }

    return item.date
}
</script>