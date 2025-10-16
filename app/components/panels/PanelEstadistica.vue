<template>
    <div class="flex flex-col items-center justify-center h-full p-4 relative">
        <!-- Botón de configuración -->
        <UButton
            icon="i-heroicons-cog-6-tooth"
            size="xs"
            color="neutral"
            variant="ghost"
            class="absolute top-2 right-2"
            @click="$emit('open-config')"
        />

        <!-- Icono (si existe) -->
        <UIcon
            v-if="data.icono"
            :name="data.icono"
            class="w-16 h-16 mb-4"
            :class="getColorClass()"
        />

        <!-- Valor principal -->
        <div
            class="text-5xl font-bold mb-3 text-center"
            :class="getGradientClass()"
        >
            {{ data.valor }}
        </div>

        <!-- Subtítulo -->
        <UBadge
            :label="data.subtitulo"
            size="md"
            color="neutral"
        />

        <!-- Indicador de datos vinculados -->
        <div v-if="data.conjuntoDatosId" class="mt-3 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
            <UIcon name="i-heroicons-link" class="w-3 h-3" />
            <span>Vinculado a datos</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface EstadisticaData {
    valor: string | number
    subtitulo: string
    icono?: string
    color?: string
    formato?: string
    conjuntoDatosId?: string
    campoNumerico?: string
    tipoEstadistica?: string
}

interface Props {
    data: EstadisticaData
}

const props = defineProps<Props>()

defineEmits<{
    'open-config': []
}>()

const getColorClass = () => {
    const colorMap: Record<string, string> = {
        blue: 'text-blue-500',
        green: 'text-green-500',
        red: 'text-red-500',
        yellow: 'text-yellow-500',
        purple: 'text-purple-500',
        pink: 'text-pink-500',
        orange: 'text-orange-500',
        gray: 'text-gray-500'
    }
    return colorMap[props.data.color || 'blue']
}

const getGradientClass = () => {
    const gradientMap: Record<string, string> = {
        blue: 'bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent',
        green: 'bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent',
        red: 'bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent',
        yellow: 'bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent',
        purple: 'bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent',
        pink: 'bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent',
        orange: 'bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent',
        gray: 'bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent'
    }
    return gradientMap[props.data.color || 'blue']
}
</script>