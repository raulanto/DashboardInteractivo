<template>
    <div class="flex flex-col min-h-screen p-6">
        <div class="flex flex-col flex-1 max-w-screen mx-auto w-full">
            <!-- Controles superiores -->
            <DashboardControls
                :total-paneles="totalPaneles"
                :zoom="canvas.scale"
                :modo-pan-activo="modoPanActivo"
                :modo-drag-activo="modoDragActivo"
                :mapa-visible="mapaVisible"
                @add-panel="handleAgregarPanel"
                @reset-view="resetearVista"
                @zoom-in="zoomIn"
                @zoom-out="zoomOut"
                @clear-all="confirmarLimpiar"
                @auto-organize="autoOrganizar"
                @auto-organize-masonry="autoOrganizarPanelesMansory"
                @toggle-pan="toggleModoPan"
                @toggle-drag="toggleModoDrag"
                @toggle-map="toggleMapa"
            />

            <!-- Contenedor del Canvas -->
            <div
                ref="contenedorRef"
                class="relative overflow-hidden border flex-1 transition-colors"
                :class="[
                    modoPanActivo ? 'border-blue-400 bg-blue-50/20 dark:bg-blue-950/20' : '',
                    modoDragActivo ? 'border-green-400 bg-green-50/20 dark:bg-green-950/20' : ''
                ]"
                @mousedown="handleMouseDown"
                @mousemove="handleMouseMove"
                @mouseup="handleMouseUp"
                @mouseleave="handleMouseLeave"
                @wheel.prevent="handleWheel"
            >
                <!-- Canvas transformable -->
                <div
                    class="canvas-wrapper absolute inset-0"
                    :style="canvasStyle"
                    :class="obtenerCursorClase"
                >
                    <!-- Grid de fondo infinito -->
                    <div class="absolute pointer-events-none" :style="gridStyle"></div>

                    <!-- Paneles -->
                    <Panel
                        v-for="panel in paneles"
                        :key="panel.id"
                        :panel="panel"
                        :drag-enabled="modoDragActivo"
                        @drag-start="(e) => iniciarArrastrePanel(panel, e)"
                        @resize-start="(e) => iniciarRedimensionPanel(panel, e)"
                        @delete="eliminarPanel(panel.id)"
                        @duplicate="duplicarPanel(panel.id)"
                        @update:data="actualizarDataPanel(panel.id, $event)"
                    />
                </div>

                <!-- Indicador de coordenadas y modos -->
                <div class="absolute bottom-4 left-4 space-y-2 pointer-events-none">
                    <!-- Info del canvas -->
                    <div class="px-3 py-2 bg-black/70 text-white text-xs rounded-lg font-mono">
                        <div>Canvas: X: {{ Math.round(canvas.x) }}, Y: {{ Math.round(canvas.y) }}</div>
                        <div>Zoom: {{ Math.round(canvas.scale * 100) }}%</div>
                        <div>Paneles: {{ totalPaneles }}</div>
                    </div>

                    <!-- Indicadores de modo -->
                    <div class="flex gap-2">
                        <div
                            v-if="modoPanActivo"
                            class="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg font-medium flex items-center gap-1.5 animate-pulse"
                        >
                            <UIcon name="i-heroicons-hand-raised" class="w-4 h-4" />
                            Modo Pan Activo
                        </div>
                        <div
                            v-if="modoDragActivo"
                            class="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-medium flex items-center gap-1.5 animate-pulse"
                        >
                            <UIcon name="i-heroicons-arrows-pointing-out" class="w-4 h-4" />
                            Modo Drag Activo
                        </div>
                    </div>
                </div>

                <!-- Ayuda rápida flotante -->
                <div
                    v-if="mostrarAyuda"
                    class="absolute top-4 right-4 px-4 py-3 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 max-w-sm"
                >
                    <div class="flex items-start justify-between mb-2">
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Controles</h4>
                        <UButton
                            icon="i-heroicons-x-mark"
                            size="xs"
                            color="neutral"
                            variant="ghost"
                            @click="mostrarAyuda = false"
                        />
                    </div>
                    <div class="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        <div class="flex items-center gap-2">
                            <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Shift + Arrastrar</kbd>
                            <span>Pan del canvas</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Scroll</kbd>
                            <span>Zoom in/out</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Click en Mapa</kbd>
                            <span>Navegar rápido</span>
                        </div>
                    </div>
                </div>

                <!-- Botón de ayuda -->
                <UButton
                    icon="i-heroicons-question-mark-circle"
                    size="sm"
                    color="neutral"
                    variant="soft"
                    class="absolute top-4 right-4"
                    @click="mostrarAyuda = !mostrarAyuda"
                />
            </div>
        </div>

        <!-- Minimapa -->
        <MiniMap
            v-if="contenedorRef"
            :paneles="paneles"
            :canvas-x="canvas.x"
            :canvas-y="canvas.y"
            :canvas-scale="canvas.scale"
            :container-width="contenedorRef?.clientWidth || 0"
            :container-height="contenedorRef?.clientHeight || 0"
            :visible="mapaVisible"
            @navigate="navegarDesdeMapa"
            @toggle="toggleMapa"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { PanelType, Panel as PanelInterface } from '~/types/panel'

import { usePanelManager } from '~/composables/usePanelManager'
import { usePanelDrag } from '~/composables/usePanelDrag'
import { usePanelResize } from '~/composables/usePanelResize'
import { useCanvasPan } from '~/composables/useCanvasPan'

import Panel from '~/components/Panel.vue'
import DashboardControls from '~/components/Dashboard/DashboardControls.vue'
import MiniMap from '~/components/MiniMap.vue'

const contenedorRef = ref<HTMLElement | null>(null)
const mostrarAyuda = ref(false)
const mapaVisible = ref(true)

// Estados de los modos
const modoPanActivo = ref(true)
const modoDragActivo = ref(true)

// Composables
const {
    paneles,
    totalPaneles,
    agregarPanel,
    eliminarPanel,
    duplicarPanel,
    actualizarPanel,
    desactivarTodos,
    limpiarTodos,
    autoOrganizarPaneles,
    autoOrganizarMasonry
} = usePanelManager()

const {
    isDragging,
    iniciarArrastre,
    moverPanel: moverPanelDrag,
    soltarPanel
} = usePanelDrag()

const {
    isResizing,
    iniciarRedimension,
    redimensionarPanel,
    finalizarRedimension
} = usePanelResize()

const {
    canvas,
    isPanning,
    iniciarPan,
    moverCanvas,
    detenerPan,
    hacerZoom,
    resetearCanvas
} = useCanvasPan()

// Computed properties
const canvasStyle = computed(() => ({
    transform: `translate(${canvas.value.x}px, ${canvas.value.y}px) scale(${canvas.value.scale})`,
    transformOrigin: '0 0',
    transition: canvas.value.panning || isDragging.value || isResizing.value
        ? 'none'
        : 'transform 0.3s ease-out'
}))

const gridStyle = computed(() => {
    const size = 50 * canvas.value.scale
    const offsetX = canvas.value.x % size
    const offsetY = canvas.value.y % size

    return {
        backgroundImage: `
            linear-gradient(to right, rgba(200, 200, 200, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(200, 200, 200, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        width: '10000px',
        height: '10000px',
        left: '-5000px',
        top: '-5000px'
    }
})

const obtenerCursorClase = computed(() => {
    if (canvas.value.panning) return 'cursor-grabbing'
    if (isDragging.value || isResizing.value) return ''

    if (modoPanActivo.value && !modoDragActivo.value) return 'cursor-grab'
    if (!modoPanActivo.value && modoDragActivo.value) return 'cursor-move'
    if (modoPanActivo.value && modoDragActivo.value) return 'cursor-grab'

    return 'cursor-default'
})

// Funciones de modos
const toggleModoPan = () => {
    modoPanActivo.value = !modoPanActivo.value
    if (!modoPanActivo.value && canvas.value.panning) {
        detenerPan()
    }
}

const toggleModoDrag = () => {
    modoDragActivo.value = !modoDragActivo.value
    if (!modoDragActivo.value && isDragging.value) {
        soltarPanel()
    }
}

const toggleMapa = () => {
    mapaVisible.value = !mapaVisible.value
}

// Navegación desde el minimapa
const navegarDesdeMapa = (x: number, y: number) => {
    canvas.value.x = x
    canvas.value.y = y
}

// Event Handlers
const handleMouseDown = (event: MouseEvent) => {
    if (modoPanActivo.value && (event.shiftKey || event.button === 1)) {
        iniciarPan(event)
        return
    }

    if (modoPanActivo.value && !modoDragActivo.value && event.button === 0) {
        iniciarPan(event)
        return
    }

    if (!isDragging.value && !isResizing.value && event.target === contenedorRef.value) {
        desactivarTodos()
    }
}

const handleMouseMove = (event: MouseEvent) => {
    if (canvas.value.panning && modoPanActivo.value) {
        moverCanvas(event)
    } else if (isDragging.value && modoDragActivo.value) {
        moverPanelDrag(event, canvas.value.x, canvas.value.y, canvas.value.scale)
    } else if (isResizing.value) {
        redimensionarPanel(event, canvas.value.x, canvas.value.y, canvas.value.scale)
    }
}

const handleMouseUp = () => {
    if (canvas.value.panning) {
        detenerPan()
    } else if (isDragging.value) {
        soltarPanel()
    } else if (isResizing.value) {
        finalizarRedimension()
    }
}

const handleMouseLeave = () => {
    handleMouseUp()
}

const handleWheel = (event: WheelEvent) => {
    if (!contenedorRef.value) return

    const rect = contenedorRef.value.getBoundingClientRect()
    const centerX = event.clientX - rect.left
    const centerY = event.clientY - rect.top

    hacerZoom(event.deltaY, centerX, centerY)
}

// Panel Handlers
const iniciarArrastrePanel = (panel: PanelInterface, event: MouseEvent) => {
    if (!modoDragActivo.value) return
    iniciarArrastre(panel, event, canvas.value.x, canvas.value.y, canvas.value.scale)
}

const iniciarRedimensionPanel = (panel: PanelInterface, event: MouseEvent) => {
    iniciarRedimension(panel, event, canvas.value.x, canvas.value.y, canvas.value.scale)
}

const actualizarDataPanel = (panelId: string, nuevaData: any) => {
    const panel = paneles.value.find(p => p.id === panelId)
    if (panel) {
        actualizarPanel(panelId, { data: nuevaData })
    }
}

const handleAgregarPanel = (tipo: PanelType) => {
    if (!contenedorRef.value) return

    const rect = contenedorRef.value.getBoundingClientRect()
    agregarPanel(tipo, rect.width, rect.height, canvas.value.x, canvas.value.y)
}

// Zoom Controls
const zoomIn = () => {
    if (!contenedorRef.value) return
    const rect = contenedorRef.value.getBoundingClientRect()
    hacerZoom(-100, rect.width / 2, rect.height / 2)
}

const zoomOut = () => {
    if (!contenedorRef.value) return
    const rect = contenedorRef.value.getBoundingClientRect()
    hacerZoom(100, rect.width / 2, rect.height / 2)
}

const resetearVista = () => {
    resetearCanvas()
}

// Organization
const confirmarLimpiar = () => {
    limpiarTodos()
}

const autoOrganizar = () => {
    autoOrganizarPaneles()
    resetearCanvas()
}

const autoOrganizarPanelesMansory = () => {
    autoOrganizarMasonry()
    resetearCanvas()
}

// Lifecycle
onMounted(() => {
    if (totalPaneles.value === 0 && contenedorRef.value) {
        const rect = contenedorRef.value.getBoundingClientRect()
        agregarPanel('estadistica', rect.width, rect.height, 0, 0)
        agregarPanel('grafico', rect.width, rect.height, 0, 0)
        agregarPanel('lista', rect.width, rect.height, 0, 0)
    }

    document.addEventListener('mousedown', (e) => {
        if (e.button === 1) e.preventDefault()
    })
})

onBeforeUnmount(() => {
    handleMouseUp()
})
</script>

<style scoped>
.canvas-wrapper {
    will-change: transform;
}

.canvas-wrapper * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>