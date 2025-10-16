<template>
    <USlideover v-model:open="isOpen" :ui="{ width: 'max-w-2xl' }" title="Configurar Gráfico"
                description="Personaliza tu gráfico de área">
        <template #body>
            <div class="space-y-6 p-4">
                <!-- Configuración General -->
                <div>
                    <h4 class="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                        <UIcon name="i-heroicons-cog-6-tooth" class="w-4 h-4"/>
                        Configuración General
                    </h4>

                    <div class="space-y-4">
                        <!-- Título del gráfico -->
                        <UFormField  label="Título del Gráfico" name="titulo">
                            <UInput
                                v-model="formData.titulo"
                                placeholder="Ej: Ventas Mensuales"
                            />
                        </UFormField >

                        <!-- Tipo de curva -->
                        <UFormField  label="Tipo de Curva" name="curveType">
                            <USelect
                                v-model="formData.curveType"
                                :items="curveTypeOptions"
                            />
                        </UFormField >

                        <!-- Posición de leyenda -->
                        <UFormField  label="Posición de Leyenda" name="legendPosition">
                            <USelect
                                v-model="formData.legendPosition"
                                :items="legendPositionOptions"
                            />
                        </UFormField >
                    </div>
                </div>

                <!-- Series -->
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                            <UIcon name="i-heroicons-rectangle-stack" class="w-4 h-4"/>
                            Series de Datos
                        </h4>
                        <UButton
                            icon="i-heroicons-plus"
                            size="xs"
                            color="primary"
                            @click="agregarSerie"
                        >
                            Agregar Serie
                        </UButton>
                    </div>

                    <div class="space-y-3">
                        <UCard
                            v-for="(serie, index) in formData.series"
                            :key="index"
                            :ui="{ body: { padding: 'p-3' } }"
                        >
                            <div class="flex items-start gap-3">
                                <div class="flex-1 space-y-3">
                                    <div class="grid grid-cols-2 gap-3">
                                        <UFormField  label="Clave" size="xs">
                                            <UInput
                                                v-model="serie.key"
                                                placeholder="Ej: ventas"
                                                size="sm"
                                            />
                                        </UFormField >
                                        <UFormField  label="Nombre" size="xs">
                                            <UInput
                                                v-model="serie.name"
                                                placeholder="Ej: Ventas"
                                                size="sm"
                                            />
                                        </UFormField >
                                    </div>

                                    <UFormField  label="Color" size="xs">
                                        <div class="flex gap-2">
                                            <UPopover>
                                                <UButton label="Color" color="neutral" variant="outline">
                                                    <template #leading>
                                                        <span :style="{ backgroundColor: serie.color }" class="size-3 rounded-full" />
                                                    </template>
                                                </UButton>

                                                <template #content>
                                                    <UColorPicker v-model="serie.color" class="p-2" />
                                                </template>
                                            </UPopover>
                                            <UInput
                                                v-model="serie.color"
                                                placeholder="#3b82f6"
                                                size="sm"
                                                class="flex-1"
                                            />
                                        </div>
                                    </UFormField >
                                </div>

                                <UButton
                                    icon="i-heroicons-trash"
                                    color="error"
                                    variant="ghost"
                                    size="xs"
                                    @click="eliminarSerie(index)"
                                />
                            </div>
                        </UCard>

                        <div
                            v-if="formData.series.length === 0"
                            class="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm"
                        >
                            No hay series. Agrega al menos una serie para comenzar.
                        </div>
                    </div>
                </div>

                <!-- Datos -->
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                            <UIcon name="i-heroicons-table-cells" class="w-4 h-4"/>
                            Datos del Gráfico
                        </h4>
                        <UButton
                            icon="i-heroicons-plus"
                            size="xs"
                            color="primary"
                            @click="agregarDato"
                        >
                            Agregar Dato
                        </UButton>
                    </div>

                    <div class="space-y-3">
                        <UCard
                            v-for="(dato, index) in formData.datos"
                            :key="index"
                            :ui="{ body: { padding: 'p-3' } }"
                        >
                            <div class="flex items-start gap-3">
                                <div class="flex-1 space-y-3">
                                    <!-- Fecha -->
                                    <UFormField  label="Fecha" size="xs">
                                        <UInput
                                            v-model="dato.date"
                                            type="date"
                                            size="sm"
                                        />
                                    </UFormField >

                                    <!-- Valores para cada serie -->
                                    <div class="grid grid-cols-2 gap-3">
                                        <UFormField
                                            v-for="serie in formData.series"
                                            :key="serie.key"
                                            :label="serie.name"
                                            size="xs"
                                        >
                                            <UInput
                                                v-model.number="dato[serie.key]"
                                                type="number"
                                                :placeholder="`Valor para ${serie.name}`"
                                                size="sm"
                                            />
                                        </UFormField >
                                    </div>
                                </div>

                                <UButton
                                    icon="i-heroicons-trash"
                                    color="error"
                                    variant="ghost"
                                    size="xs"
                                    @click="eliminarDato(index)"
                                />
                            </div>
                        </UCard>

                        <div
                            v-if="formData.datos.length === 0"
                            class="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm"
                        >
                            No hay datos. Agrega puntos de datos para visualizar el gráfico.
                        </div>
                    </div>
                </div>

                <!-- Vista previa -->
                <div v-if="formData.datos.length > 0 && formData.series.length > 0">
                    <h4 class="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                        <UIcon name="i-heroicons-eye" class="w-4 h-4"/>
                        Vista Previa
                    </h4>

                    <div class="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                        <client-only>
                            <AreaChart
                                :data="formData.datos"
                                :height="200"
                                :categories="previewCategories"
                                :y-grid-line="true"
                                :curve-type="getCurveType(formData.curveType)"
                                :legend-position="getLegendPosition(formData.legendPosition)"
                            />
                        </client-only>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex items-center justify-between gap-3">
                <UButton
                    color="error"
                    variant="ghost"
                    @click="cerrar"
                >
                    Cancelar
                </UButton>

                <div class="flex gap-2">
                    <UButton
                        color="warning"
                        variant="outline"
                        @click="resetear"
                    >
                        Resetear
                    </UButton>
                    <UButton
                        color="primary"
                        :disabled="!puedeGuardar"
                        @click="guardar"
                    >
                        Guardar Cambios
                    </UButton>
                </div>
            </div>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import {computed, type ComputedRef, ref, watch} from 'vue'
import { useDataStore } from '~/composables/useDataStore'

const color = ref('#00C16A')

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
    modelValue: boolean
    data: GraficoData
    panelId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'save': [data: GraficoData]
}>()

const { agregarConjuntoDatos, actualizarConjuntoDatos, conjuntosDatos } = useDataStore()

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const formData = ref<GraficoData>({
    titulo: '',
    datos: [],
    series: [],
    curveType: 'monotoneX',
    legendPosition: 'top'
})

const curveTypeOptions = [
    {label: 'Monotone X', value: 'monotoneX'},
    {label: 'Linear', value: 'linear'},
    {label: 'Natural', value: 'natural'},
    {label: 'Step', value: 'step'}
]

const legendPositionOptions = [
    {label: 'Superior', value: 'top'},
    {label: 'Inferior', value: 'bottom'},
    {label: 'Derecha', value: 'right'},
    {label: 'Izquierda', value: 'left'}
]

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        cargarDatos()
    }
})

const cargarDatos = () => {
    formData.value = {
        titulo: props.data.titulo || '',
        datos: JSON.parse(JSON.stringify(props.data.datos || [])),
        series: JSON.parse(JSON.stringify(props.data.series || [])),
        curveType: props.data.curveType || 'monotoneX',
        legendPosition: props.data.legendPosition || 'top'
    }
}

const agregarSerie = () => {
    const colores = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899']
    const color = colores[formData.value.series.length % colores.length]

    formData.value.series.push({
        key: `serie${formData.value.series.length + 1}`,
        name: `Serie ${formData.value.series.length + 1}`,
        color
    })
}

const eliminarSerie = (index: number) => {
    const serieKey = formData.value.series[index].key
    formData.value.series.splice(index, 1)

    formData.value.datos.forEach(dato => {
        delete dato[serieKey]
    })
}

const agregarDato = () => {
    const nuevoDato: GraficoDataPoint = {
        date: new Date().toISOString().split('T')[0]
    }

    formData.value.series.forEach(serie => {
        nuevoDato[serie.key] = 0
    })

    formData.value.datos.push(nuevoDato)
}

const eliminarDato = (index: number) => {
    formData.value.datos.splice(index, 1)
}

const previewCategories: ComputedRef<Record<string, BulletLegendItemInterface>> = computed(() => {
    const cats: Record<string, BulletLegendItemInterface> = {}

    formData.value.series.forEach(serie => {
        cats[serie.key] = {
            name: serie.name,
            color: serie.color
        }
    })

    return cats
})

const getCurveType = (type: string) => {
    return CurveType[type as keyof typeof CurveType] || CurveType.MonotoneX
}

const getLegendPosition = (position: string) => {
    return LegendPosition[position as keyof typeof LegendPosition] || LegendPosition.Top
}

const puedeGuardar = computed(() => {
    return formData.value.series.length > 0 && formData.value.datos.length > 0
})

const guardar = () => {
    if (!puedeGuardar.value) return

    const datosGrafico = JSON.parse(JSON.stringify(formData.value))

    // Guardar en el Data Store
    if (props.panelId) {
        const conjuntoExistente = conjuntosDatos.value.find(c => c.panelOrigenId === props.panelId)

        if (conjuntoExistente) {
            actualizarConjuntoDatos(conjuntoExistente.id, datosGrafico, {
                descripcion: `Gráfico: ${formData.value.titulo}`,
                etiquetas: ['grafico', formData.value.curveType]
            })
        } else {
            agregarConjuntoDatos(
                formData.value.titulo || 'Gráfico sin título',
                'grafico',
                datosGrafico,
                {
                    descripcion: `Gráfico: ${formData.value.titulo}`,
                    etiquetas: ['grafico', formData.value.curveType]
                },
                props.panelId
            )
        }
    }

    emit('save', datosGrafico)
    cerrar()
}

const cerrar = () => {
    emit('update:modelValue', false)
}

const resetear = () => {
    formData.value = {
        titulo: '',
        datos: [],
        series: [],
        curveType: 'monotoneX',
        legendPosition: 'top'
    }
}

if (props.modelValue) {
    cargarDatos()
}
</script>