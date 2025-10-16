<template>
    <div
        ref="panelRef"
        class="absolute bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden transition-shadow hover:shadow-xl"
        :style="panelStyle"
        @mousedown.stop="iniciarDrag"
    >
        <!-- Header del panel -->
        <div class="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 cursor-move">
            <div class="flex items-center gap-2">
                <UIcon :name="getPanelIcon()" class="w-4 h-4 text-neutral-500" />
                <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {{ getPanelTitle() }}
        </span>
            </div>

            <div class="flex items-center gap-1">
                <UButton
                    icon="i-heroicons-arrows-pointing-out"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    @click.stop="maximizar"
                />
                <UButton
                    icon="i-heroicons-x-mark"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    @click.stop="eliminar"
                />
            </div>
        </div>

        <!-- Contenido del panel -->
        <div class="p-4 overflow-auto" :style="{ height: `${panel.alto - 60}px` }">
            <component
                :is="getPanelComponent()"
                :data="panel.data"
                @open-config="$emit('open-config')"
                @update-notas="(notas) => $emit('update-data', { ...panel.data, notas })"
            />
        </div>

        <!-- Resize handles -->
        <template v-if="!deshabilitarInteracciones">
            <!-- Esquinas -->
            <div
                class="absolute w-4 h-4 bg-blue-500 rounded-full -bottom-2 -right-2 cursor-nwse-resize hover:scale-125 transition-transform z-10"
                @mousedown.stop="iniciarResize('se')"
            ></div>
            <div
                class="absolute w-4 h-4 bg-blue-500 rounded-full -bottom-2 -left-2 cursor-nesw-resize hover:scale-125 transition-transform z-10"
                @mousedown.stop="iniciarResize('sw')"
            ></div>
            <div
                class="absolute w-4 h-4 bg-blue-500 rounded-full -top-2 -right-2 cursor-nesw-resize hover:scale-125 transition-transform z-10"
                @mousedown.stop="iniciarResize('ne')"
            ></div>
            <div
                class="absolute w-4 h-4 bg-blue-500 rounded-full -top-2 -left-2 cursor-nwse-resize hover:scale-125 transition-transform z-10"
                @mousedown.stop="iniciarResize('nw')"
            ></div>

            <!-- Bordes -->
            <div
                class="absolute h-2 left-0 right-0 -bottom-1 cursor-ns-resize hover:bg-blue-500/20 transition-colors z-10"
                @mousedown.stop="iniciarResize('s')"
            ></div>
            <div
                class="absolute h-2 left-0 right-0 -top-1 cursor-ns-resize hover:bg-blue-500/20 transition-colors z-10"
                @mousedown.stop="iniciarResize('n')"
            ></div>
            <div
                class="absolute w-2 top-0 bottom-0 -right-1 cursor-ew-resize hover:bg-blue-500/20 transition-colors z-10"
                @mousedown.stop="iniciarResize('e')"
            ></div>
            <div
                class="absolute w-2 top-0 bottom-0 -left-1 cursor-ew-resize hover:bg-blue-500/20 transition-colors z-10"
                @mousedown.stop="iniciarResize('w')"
            ></div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PANEL_COMPONENTS } from '~/components/panels'
import type { Panel, PanelType } from '~/types/panel'

interface Props {
    panel: Panel
    deshabilitarInteracciones?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'resize': [id: string, ancho: number, alto: number, x: number, y: number]
    'delete': [id: string]
    'drag-start': [id: string]
    'drag': [id: string, x: number, y: number]
    'drag-end': [id: string]
    'open-config': []
    'update-data': [data: any]
}>()

const panelRef = ref<HTMLElement | null>(null)
const resizing = ref(false)
const resizeDirection = ref<string>('')
const resizeStart = ref({ x: 0, y: 0, ancho: 0, alto: 0, panelX: 0, panelY: 0 })

const panelStyle = computed(() => ({
    left: `${props.panel.x}px`,
    top: `${props.panel.y}px`,
    width: `${props.panel.ancho}px`,
    height: `${props.panel.alto}px`,
    zIndex: props.panel.zIndex
}))

const getPanelComponent = () => {
    return PANEL_COMPONENTS[props.panel.tipo]
}

const getPanelIcon = () => {
    const icons: Record<PanelType, string> = {
        estadistica: 'i-heroicons-chart-bar',
        grafico: 'i-heroicons-chart-pie',
        lista: 'i-heroicons-queue-list',
        tabla: 'i-heroicons-table-cells',
        calendario: 'i-heroicons-calendar',
        mapa: 'i-heroicons-map',
        notas: 'i-heroicons-document-text'
    }
    return icons[props.panel.tipo] || 'i-heroicons-square-3-stack-3d'
}

const getPanelTitle = () => {
    const titles: Record<PanelType, string> = {
        estadistica: 'Estadística',
        grafico: 'Gráfico',
        lista: 'Lista',
        tabla: 'Tabla',
        calendario: 'Calendario',
        mapa: 'Mapa',
        notas: 'Notas'
    }
    return titles[props.panel.tipo] || 'Panel'
}

const iniciarDrag = (e: MouseEvent) => {
    if (props.deshabilitarInteracciones) return
    emit('drag-start', props.panel.id)
}

const iniciarResize = (direction: string) => {
    if (props.deshabilitarInteracciones) return

    resizing.value = true
    resizeDirection.value = direction
    resizeStart.value = {
        x: event.clientX,
        y: event.clientY,
        ancho: props.panel.ancho,
        alto: props.panel.alto,
        panelX: props.panel.x,
        panelY: props.panel.y
    }

    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', finalizarResize)
}

const handleResize = (e: MouseEvent) => {
    if (!resizing.value) return

    const deltaX = e.clientX - resizeStart.value.x
    const deltaY = e.clientY - resizeStart.value.y

    let nuevoAncho = resizeStart.value.ancho
    let nuevoAlto = resizeStart.value.alto
    let nuevoX = resizeStart.value.panelX
    let nuevoY = resizeStart.value.panelY

    const MIN_ANCHO = 200
    const MIN_ALTO = 150

    // Calcular nuevas dimensiones según la dirección
    if (resizeDirection.value.includes('e')) {
        nuevoAncho = Math.max(MIN_ANCHO, resizeStart.value.ancho + deltaX)
    }
    if (resizeDirection.value.includes('w')) {
        const anchoTemporal = Math.max(MIN_ANCHO, resizeStart.value.ancho - deltaX)
        if (anchoTemporal > MIN_ANCHO) {
            nuevoAncho = anchoTemporal
            nuevoX = resizeStart.value.panelX + deltaX
        }
    }
    if (resizeDirection.value.includes('s')) {
        nuevoAlto = Math.max(MIN_ALTO, resizeStart.value.alto + deltaY)
    }
    if (resizeDirection.value.includes('n')) {
        const altoTemporal = Math.max(MIN_ALTO, resizeStart.value.alto - deltaY)
        if (altoTemporal > MIN_ALTO) {
            nuevoAlto = altoTemporal
            nuevoY = resizeStart.value.panelY + deltaY
        }
    }

    emit('resize', props.panel.id, nuevoAncho, nuevoAlto, nuevoX, nuevoY)
}

const finalizarResize = () => {
    resizing.value = false
    resizeDirection.value = ''
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', finalizarResize)
}

const maximizar = () => {
    // Implementar lógica de maximización
    console.log('Maximizar panel')
}

const eliminar = () => {
    emit('delete', props.panel.id)
}
</script>