<template>
    <USlideover v-model:open="isOpen" :ui="{ width: 'max-w-2xl' }" title="Configurar Estadística"
                description="Configura tu panel de estadística">
        <template #body>
            <div class="space-y-6 p-4">
                <!-- Tabs: Manual vs Datos Existentes -->
                <UTabs v-model="tabActiva" :items="tabs" class="w-full">
                    <!-- Tab: Manual -->
                    <template #manual>
                        <div class="space-y-4 pt-4">
                            <UFormField label="Valor Principal" name="valor">
                                <UInput
                                    v-model="formData.valor"
                                    placeholder="12,345"
                                    size="lg"
                                />
                            </UFormField>

                            <UFormField label="Subtítulo" name="subtitulo">
                                <UInput
                                    v-model="formData.subtitulo"
                                    placeholder="Total de usuarios"
                                />
                            </UFormField>
                        </div>
                    </template>

                    <!-- Tab: Datos Existentes -->
                    <template #existente>
                        <div class="space-y-4 pt-4">
                            <!-- Selector de conjunto de datos -->
                            <UFormField label="Conjunto de datos">
                                <USelect
                                    v-model="conjuntoSeleccionado"
                                    :items="opcionesConjuntos"
                                    placeholder="Selecciona un conjunto"
                                    @change="handleSeleccionConjunto"
                                />
                            </UFormField>

                            <UAlert
                                v-if="totalConjuntos === 0"
                                icon="i-heroicons-exclamation-triangle"
                                color="warning"
                                title="No hay datos disponibles"
                                description="Crea primero un panel de Gráfico con datos."
                            />

                            <!-- Info del conjunto -->
                            <UCard v-if="conjuntoActual" :ui="{ body: { padding: 'p-3' } }">
                                <div class="flex items-start gap-2">
                                    <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-500" />
                                    <div class="text-sm">
                                        <p class="font-medium">{{ conjuntoActual.nombre }}</p>
                                        <p class="text-xs text-neutral-500 mt-1">
                                            Tipo: {{ conjuntoActual.tipo }} • Creado: {{ formatearFecha(conjuntoActual.fechaCreacion) }}
                                        </p>
                                    </div>
                                </div>
                            </UCard>

                            <!-- Selector de campo -->
                            <UFormField v-if="camposNumericos.length > 0" label="Campo a calcular">
                                <USelect
                                    v-model="campoSeleccionado"
                                    :items="opcionesCampos"
                                    placeholder="Selecciona un campo"
                                    @change="calcularEstadisticas"
                                />
                            </UFormField>

                            <!-- Selector de estadística -->
                            <UFormField v-if="estadisticas" label="Estadística a mostrar">
                                <USelect
                                    v-model="estadisticaSeleccionada"
                                    :items="opcionesEstadisticas"
                                    placeholder="Selecciona una estadística"
                                    @change="actualizarValorDesdeEstadistica"
                                />
                            </UFormField>

                            <!-- Vista de estadísticas calculadas -->
                            <div v-if="estadisticas" class="grid grid-cols-2 gap-2">
                                <UCard
                                    v-for="(valor, key) in estadisticas"
                                    :key="key"
                                    :ui="{ body: { padding: 'p-3' } }"
                                >
                                    <div class="text-xs text-neutral-500 capitalize">{{ getNombreEstadistica(key) }}</div>
                                    <div class="text-sm font-semibold">
                                        {{ formatearValor(valor, formData.formato) }}
                                    </div>
                                </UCard>
                            </div>

                            <!-- Subtítulo personalizado -->
                            <UFormField v-if="conjuntoSeleccionado" label="Subtítulo personalizado (opcional)">
                                <UInput
                                    v-model="formData.subtitulo"
                                    :placeholder="subtituloPorDefecto"
                                />
                            </UFormField>
                        </div>
                    </template>
                </UTabs>

                <!-- Opciones de visualización -->
                <div class="space-y-4 pt-4 border-t">
                    <h4 class="text-sm font-semibold text-neutral-900 dark:text-white">
                        Opciones de Visualización
                    </h4>

                    <!-- Icono -->
                    <UFormField label="Icono (opcional)">
                        <USelect
                            v-model="formData.icono"
                            :items="iconosDisponibles"
                        />
                    </UFormField>

                    <!-- Color -->
                    <UFormField label="Color del valor">
                        <USelect
                            v-model="formData.color"
                            :items="coloresDisponibles"
                        />
                    </UFormField>

                    <!-- Formato -->
                    <UFormField label="Formato de número">
                        <USelect
                            v-model="formData.formato"
                            :items="formatosNumero"
                            @change="actualizarValorFormateado"
                        />
                    </UFormField>
                </div>

                <!-- Vista previa -->
                <div>
                    <h4 class="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                        Vista Previa
                    </h4>
                    <UCard :ui="{ body: { padding: 'p-6' } }">
                        <div class="flex flex-col items-center justify-center">
                            <UIcon
                                v-if="formData.icono"
                                :name="formData.icono"
                                class="w-12 h-12 mb-3"
                                :class="getColorClass()"
                            />

                            <div
                                class="text-5xl font-bold mb-3"
                                :class="getGradientClass()"
                            >
                                {{ valorMostrado }}
                            </div>

                            <UBadge
                                :label="formData.subtitulo || subtituloPorDefecto || 'Subtítulo'"
                                size="md"
                                color="neutral"
                            />

                            <!-- Indicador de vinculación -->
                            <div v-if="conjuntoSeleccionado" class="mt-3 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                <UIcon name="i-heroicons-link" class="w-3 h-3" />
                                <span>Vinculado a datos</span>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex items-center justify-between gap-3">
                <UButton color="error" variant="ghost" @click="cerrar">
                    Cancelar
                </UButton>

                <UButton
                    color="primary"
                    :disabled="!esValido"
                    @click="guardar"
                >
                    Guardar Cambios
                </UButton>
            </div>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDataStore } from '~/composables/useDataStore'
import type { EstadisticasCalculadas } from '~/composables/useDataStore'

interface EstadisticaData {
    valor: string | number
    subtitulo: string
    icono?: string
    color?: string
    formato?: string
    conjuntoDatosId?: string
    campoNumerico?: string
    tipoEstadistica?: keyof EstadisticasCalculadas
}

interface Props {
    modelValue: boolean
    data?: EstadisticaData
    panelId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'save': [data: EstadisticaData]
}>()

const {
    conjuntosDatos,
    totalConjuntos,
    obtenerConjuntoDatos,
    calcularEstadisticas: calcularEstadisticasStore,
    obtenerCamposNumericos,
    formatearValor
} = useDataStore()

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const tabActiva = ref(0)
const conjuntoSeleccionado = ref<string>('')
const campoSeleccionado = ref<string>('')
const estadisticaSeleccionada = ref<keyof EstadisticasCalculadas>('promedio')
const estadisticas = ref<EstadisticasCalculadas | null>(null)

const tabs = [
    { key: 'manual', label: 'Manual', icon: 'i-heroicons-pencil' },
    { key: 'existente', label: `Datos existentes (${totalConjuntos.value})`, icon: 'i-heroicons-chart-bar' }
]

const iconosDisponibles = [
    { value: '', label: 'Sin icono' },
    { value: 'i-heroicons-users', label: 'Usuarios' },
    { value: 'i-heroicons-chart-bar', label: 'Gráfico' },
    { value: 'i-heroicons-currency-dollar', label: 'Dinero' },
    { value: 'i-heroicons-shopping-cart', label: 'Carrito' },
    { value: 'i-heroicons-heart', label: 'Corazón' },
    { value: 'i-heroicons-star', label: 'Estrella' },
    { value: 'i-heroicons-fire', label: 'Fuego' },
    { value: 'i-heroicons-bolt', label: 'Rayo' },
    { value: 'i-heroicons-arrow-trending-up', label: 'Tendencia' }
]

const coloresDisponibles = [
    { value: 'blue', label: 'Azul' },
    { value: 'green', label: 'Verde' },
    { value: 'red', label: 'Rojo' },
    { value: 'yellow', label: 'Amarillo' },
    { value: 'purple', label: 'Púrpura' },
    { value: 'pink', label: 'Rosa' },
    { value: 'orange', label: 'Naranja' }
]

const formatosNumero = [
    { value: 'number', label: 'Con separadores (1,234)' },
    { value: 'currency', label: 'Moneda ($1,234)' },
    { value: 'percent', label: 'Porcentaje (12.34%)' },
    { value: 'compact', label: 'Compacto (1.2K)' }
]

const formData = ref<EstadisticaData>({
    valor: '',
    subtitulo: '',
    icono: '',
    color: 'blue',
    formato: 'number'
})

const opcionesConjuntos = computed(() => {
    return conjuntosDatos.value.map(c => ({
        value: c.id,
        label: c.nombre
    }))
})

const conjuntoActual = computed(() => {
    if (!conjuntoSeleccionado.value) return null
    return obtenerConjuntoDatos(conjuntoSeleccionado.value)
})

const camposNumericos = computed(() => {
    if (!conjuntoSeleccionado.value) return []
    return obtenerCamposNumericos(conjuntoSeleccionado.value)
})

const opcionesCampos = computed(() => {
    return camposNumericos.value.map(campo => ({
        value: campo,
        label: campo.charAt(0).toUpperCase() + campo.slice(1)
    }))
})

const opcionesEstadisticas = computed(() => {
    if (!estadisticas.value) return []

    return Object.keys(estadisticas.value).map(key => ({
        value: key,
        label: getNombreEstadistica(key)
    }))
})

const subtituloPorDefecto = computed(() => {
    if (!conjuntoActual.value || !estadisticaSeleccionada.value || !campoSeleccionado.value) return ''

    const estadistica = getNombreEstadistica(estadisticaSeleccionada.value)
    const campo = campoSeleccionado.value.charAt(0).toUpperCase() + campoSeleccionado.value.slice(1)
    return `${estadistica} de ${campo} - ${conjuntoActual.value.nombre}`
})

const valorMostrado = computed(() => {
    if (tabActiva.value === 0) {
        return formData.value.valor || '0'
    }

    if (estadisticas.value && estadisticaSeleccionada.value) {
        const valor = estadisticas.value[estadisticaSeleccionada.value]
        return valor !== undefined ? formatearValor(valor, formData.value.formato as any) : '0'
    }

    return '0'
})

const esValido = computed(() => {
    if (tabActiva.value === 0) {
        return !!formData.value.valor && !!formData.value.subtitulo
    } else {
        return !!conjuntoSeleccionado.value && !!estadisticaSeleccionada.value
    }
})

const getNombreEstadistica = (key: string) => {
    const nombres: Record<string, string> = {
        suma: 'Suma',
        promedio: 'Promedio',
        maximo: 'Máximo',
        minimo: 'Mínimo',
        conteo: 'Conteo',
        mediana: 'Mediana',
        desviacionEstandar: 'Desv. Estándar'
    }
    return nombres[key] || key
}

const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const handleSeleccionConjunto = () => {
    if (!conjuntoSeleccionado.value) return

    campoSeleccionado.value = ''
    estadisticaSeleccionada.value = 'promedio'
    estadisticas.value = null

    const campos = obtenerCamposNumericos(conjuntoSeleccionado.value)
    if (campos.length > 0) {
        campoSeleccionado.value = campos[0]
        calcularEstadisticas()
    }
}

const calcularEstadisticas = () => {
    if (!conjuntoSeleccionado.value || !campoSeleccionado.value) return

    estadisticas.value = calcularEstadisticasStore(conjuntoSeleccionado.value, campoSeleccionado.value)

    if (estadisticas.value) {
        actualizarValorDesdeEstadistica()
    }
}

const actualizarValorDesdeEstadistica = () => {
    if (!estadisticas.value || !estadisticaSeleccionada.value) return

    const valor = estadisticas.value[estadisticaSeleccionada.value]
    if (valor !== undefined) {
        formData.value.valor = valor
        if (!formData.value.subtitulo) {
            formData.value.subtitulo = subtituloPorDefecto.value
        }
    }
}

const actualizarValorFormateado = () => {
    if (typeof formData.value.valor === 'number') {
        formData.value.valor = formData.value.valor
    }
}

const getColorClass = () => {
    const colorMap: Record<string, string> = {
        blue: 'text-blue-500',
        green: 'text-green-500',
        red: 'text-red-500',
        yellow: 'text-yellow-500',
        purple: 'text-purple-500',
        pink: 'text-pink-500',
        orange: 'text-orange-500'
    }
    return colorMap[formData.value.color || 'blue']
}

const getGradientClass = () => {
    const gradientMap: Record<string, string> = {
        blue: 'bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent',
        green: 'bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent',
        red: 'bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent',
        yellow: 'bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent',
        purple: 'bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent',
        pink: 'bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent',
        orange: 'bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent'
    }
    return gradientMap[formData.value.color || 'blue']
}

const guardar = () => {
    if (!esValido.value) return

    const datosGuardar: EstadisticaData = {
        valor: formData.value.valor,
        subtitulo: formData.value.subtitulo || subtituloPorDefecto.value,
        icono: formData.value.icono || undefined,
        color: formData.value.color,
        formato: formData.value.formato
    }

    if (tabActiva.value === 1 && conjuntoSeleccionado.value) {
        datosGuardar.conjuntoDatosId = conjuntoSeleccionado.value
        datosGuardar.campoNumerico = campoSeleccionado.value
        datosGuardar.tipoEstadistica = estadisticaSeleccionada.value
    }

    emit('save', datosGuardar)
    cerrar()
}

const cerrar = () => {
    emit('update:modelValue', false)
}

const resetFormulario = () => {
    if (props.data) {
        formData.value = {
            valor: props.data.valor,
            subtitulo: props.data.subtitulo,
            icono: props.data.icono || '',
            color: props.data.color || 'blue',
            formato: props.data.formato || 'number'
        }

        if (props.data.conjuntoDatosId) {
            tabActiva.value = 1
            conjuntoSeleccionado.value = props.data.conjuntoDatosId
            campoSeleccionado.value = props.data.campoNumerico || ''
            estadisticaSeleccionada.value = props.data.tipoEstadistica || 'promedio'
            setTimeout(() => calcularEstadisticas(), 100)
        }
    } else {
        formData.value = {
            valor: '12,345',
            subtitulo: 'Total de usuarios',
            icono: 'i-heroicons-users',
            color: 'blue',
            formato: 'number'
        }
        tabActiva.value = 0
        conjuntoSeleccionado.value = ''
        campoSeleccionado.value = ''
        estadisticas.value = null
    }
}

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        resetFormulario()
    }
}, { immediate: true })
</script>