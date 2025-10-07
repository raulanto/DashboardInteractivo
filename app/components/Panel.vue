<template>
    <div
        :style="panelStyle"
        class="panel-flotante absolute"
        :class="[
      panel.arrastrando ? 'cursor-grabbing' : '',
      panel.redimensionando ? 'select-none' : ''
    ]"
    >
        <UCard :ui="{

                root: 'rounded-lg overflow-hidden',
                header: 'p-2 sm:px-3',
                body: 'p-0 sm:p-0',


        }"
        >
            <template #header>
                <div
                    class="flex justify-between items-start select-none transition-opacity"
                    :class="[
            dragEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-default opacity-60',
          ]"
                    @mousedown="handleDragStart"
                >
                    <div class="flex-1 pointer-events-none">
                        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                            {{ panel.titulo }}
                        </h3>
                        <div class="flex items-center gap-2 mt-1">
                            <UBadge
                                :label="obtenerEtiquetaTipo(panel.tipo)"
                                size="xs"
                                color="primary"
                                variant="subtle"
                            />
                            <!-- Indicador de drag deshabilitado -->
                            <UBadge
                                v-if="!dragEnabled"
                                label="Drag OFF"
                                size="xs"
                                color="neutral"
                                variant="subtle"
                            />
                        </div>
                    </div>
                    <div class="flex gap-1 pointer-events-auto">
                        <UTooltip text="Duplicar panel">
                            <UButton
                                icon="i-heroicons-document-duplicate"
                                size="xs"
                                color="neutral"
                                :disabled="!dragEnabled"
                                variant="ghost"
                                @click.stop="$emit('duplicate')"
                            />
                        </UTooltip>
                        <UTooltip text="Eliminar panel">
                            <UButton
                                icon="i-heroicons-trash"
                                size="xs"
                                color="error"
                                :disabled="!dragEnabled"
                                variant="ghost"
                                @click.stop="$emit('delete')"
                            />
                        </UTooltip>
                    </div>
                </div>

            </template>

            <div
                class="p-3 overflow-auto"
                :style="{ height: `calc(${panel.tamaño.height}px - 80px)` }"
            >
                <!-- Renderizado dinámico de componentes -->
                <component
                    :is="componentePanel"
                    :data="panel.data"
                    @update:contenido="actualizarContenido"
                />
            </div>

            <UButton
                class="resize-handle absolute bottom-2 right-2 w-5 h-5 cursor-nwse-resize flex items-center justify-center"
                @mousedown.stop="$emit('resize-start', $event)"
                :disabled="!dragEnabled"
                variant="ghost"
                icon="i-heroicons-arrows-pointing-out"
            />
        </UCard>


    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import type {Panel} from '~/types/panel'
import PanelEstadistica from '~/components/panels/PanelEstadistica.vue'
import PanelGrafico from '~/components/panels/PanelGrafico.vue'
import PanelLista from '~/components/panels/PanelLista.vue'
import PanelTabla from '~/components/panels/PanelTabla.vue'
import PanelCalendario from '~/components/panels/PanelCalendario.vue'
import PanelMapa from '~/components/panels/PanelMapa.vue'
import PanelNotas from '~/components/panels/PanelNotas.vue'

interface Props {
    panel: Panel
    dragEnabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    dragEnabled: false
})

const emit = defineEmits<{
    'drag-start': [event: MouseEvent]
    'resize-start': [event: MouseEvent]
    'delete': []
    'duplicate': []
    'update:data': [data: any]
}>()

// Mapeo de tipos a componentes
const componentesMap: Record<string, any> = {
    estadistica: PanelEstadistica,
    grafico: PanelGrafico,
    lista: PanelLista,
    tabla: PanelTabla,
    calendario: PanelCalendario,
    mapa: PanelMapa,
    notas: PanelNotas
}

// Componente por defecto
const ComponenteDefault = {
    template: `
        <div class="h-full flex flex-col items-center justify-center text-center">
            <UIcon name="i-heroicons-document-chart-bar" class="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4"/>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Panel de información</h4>
            <UBadge :label="'Tipo: ' + tipo" size="sm" color="gray" variant="subtle"/>
        </div>
    `,
    props: ['data', 'tipo']
}

const componentePanel = computed(() => {
    return componentesMap[props.panel.tipo] || ComponenteDefault
})

const panelStyle = computed(() => ({
    left: `${props.panel.posicion.x}px`,
    top: `${props.panel.posicion.y}px`,
    width: `${props.panel.tamaño.width}px`,
    height: `${props.panel.tamaño.height}px`,
    zIndex: props.panel.zIndex
}))

const obtenerEtiquetaTipo = (tipo: string): string => {
    const etiquetas: Record<string, string> = {
        estadistica: 'Estadística',
        grafico: 'Gráfico',
        lista: 'Lista',
        tabla: 'Tabla',
        mapa: 'Mapa',
        calendario: 'Calendario',
        notas: 'Notas'
    }
    return etiquetas[tipo] || tipo
}

const actualizarContenido = (contenido: string) => {
    emit('update:data', {...props.panel.data, contenido})
}

// Handler que respeta el estado de dragEnabled
const handleDragStart = (event: MouseEvent) => {
    if (!props.dragEnabled) {
        event.preventDefault()
        event.stopPropagation()
        return
    }
    emit('drag-start', event)
}
</script>

<style scoped>
.panel-flotante {
    user-select: none;
    will-change: transform;
}
</style>