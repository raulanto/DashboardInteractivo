<template>
    <div
        v-if="visible"
        class="fixed bottom-4 right-4 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50"
        :style="{ width: `${width}px`, height: `${height}px` }"
    >
        <!-- Header del minimapa -->
        <div class="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800">
            <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-map" class="w-4 h-4 text-primary" />
                <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Mapa</span>
            </div>
            <div class="flex gap-1">
                <UButton
                    icon="i-heroicons-minus"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    @click="$emit('toggle')"
                />
            </div>
        </div>

        <!-- Canvas del minimapa -->
        <div
            ref="miniMapRef"
            class="relative cursor-pointer bg-neutral-50 dark:bg-neutral-900"
            :style="{ height: `${height - 40}px` }"
            @click="handleMapClick"
            @mousedown="handleMapMouseDown"
            @mousemove="handleMapMouseMove"
            @mouseup="handleMapMouseUp"
            @mouseleave="handleMapMouseUp"
        >
            <!-- Paneles en el minimapa -->
            <div
                v-for="panel in paneles"
                :key="panel.id"
                class="absolute rounded transition-colors"
                :class="[
          panel.activo
            ? 'bg-primary/70 border-2 border-primary'
            : 'bg-neutral-400 dark:bg-neutral-600 border border-neutral-500 dark:border-neutral-700'
        ]"
                :style="getPanelStyle(panel)"
            />

            <!-- Viewport actual (área visible) -->
            <div
                class="absolute border-2 border-primary-500 bg-primary-500/10 cursor-move"
                :style="getViewportStyle()"
            />

            <!-- Grid de referencia -->
            <div
                class="absolute inset-0 pointer-events-none opacity-20"
                :style="gridStyle"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Panel } from '~/types/panel'

interface Props {
    paneles: Panel[]
    canvasX: number
    canvasY: number
    canvasScale: number
    containerWidth: number
    containerHeight: number
    visible?: boolean
    width?: number
    height?: number
}

const props = withDefaults(defineProps<Props>(), {
    visible: true,
    width: 200,
    height: 160
})

const emit = defineEmits<{
    'navigate': [x: number, y: number]
    'toggle': []
}>()

const miniMapRef = ref<HTMLElement | null>(null)
const isDraggingViewport = ref(false)

// Calcular los límites del canvas con todos los paneles
const canvasBounds = computed(() => {
    if (props.paneles.length === 0) {
        return {
            minX: -500,
            minY: -500,
            maxX: 1500,
            maxY: 1500
        }
    }

    const minX = Math.min(...props.paneles.map(p => p.posicion.x), 0) - 100
    const minY = Math.min(...props.paneles.map(p => p.posicion.y), 0) - 100
    const maxX = Math.max(...props.paneles.map(p => p.posicion.x + p.tamaño.width), props.containerWidth) + 100
    const maxY = Math.max(...props.paneles.map(p => p.posicion.y + p.tamaño.height), props.containerHeight) + 100

    return { minX, minY, maxX, maxY }
})

// Escala del minimapa
const scale = computed(() => {
    const bounds = canvasBounds.value
    const canvasWidth = bounds.maxX - bounds.minX
    const canvasHeight = bounds.maxY - bounds.minY

    const scaleX = (props.width - 20) / canvasWidth
    const scaleY = (props.height - 60) / canvasHeight

    return Math.min(scaleX, scaleY)
})

// Offset del minimapa
const offset = computed(() => {
    const bounds = canvasBounds.value
    return {
        x: -bounds.minX * scale.value + 10,
        y: -bounds.minY * scale.value + 10
    }
})

// Convertir coordenadas de canvas a minimapa
const toMiniMapCoords = (x: number, y: number, width: number = 0, height: number = 0) => {
    return {
        x: x * scale.value + offset.value.x,
        y: y * scale.value + offset.value.y,
        width: width * scale.value,
        height: height * scale.value
    }
}

// Convertir coordenadas de minimapa a canvas
const fromMiniMapCoords = (miniX: number, miniY: number) => {
    return {
        x: (miniX - offset.value.x) / scale.value,
        y: (miniY - offset.value.y) / scale.value
    }
}

// Estilo de cada panel en el minimapa
const getPanelStyle = (panel: Panel) => {
    const coords = toMiniMapCoords(
        panel.posicion.x,
        panel.posicion.y,
        panel.tamaño.width,
        panel.tamaño.height
    )

    return {
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        width: `${Math.max(coords.width, 4)}px`,
        height: `${Math.max(coords.height, 3)}px`
    }
}

// Estilo del viewport actual
const getViewportStyle = () => {
    const viewportWidth = props.containerWidth / props.canvasScale
    const viewportHeight = props.containerHeight / props.canvasScale
    const viewportX = -props.canvasX / props.canvasScale
    const viewportY = -props.canvasY / props.canvasScale

    const coords = toMiniMapCoords(viewportX, viewportY, viewportWidth, viewportHeight)

    return {
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        width: `${coords.width}px`,
        height: `${coords.height}px`
    }
}

// Grid de referencia
const gridStyle = computed(() => {
    const gridSize = 50 * scale.value

    return {
        backgroundImage: `
      linear-gradient(to right, rgba(156, 163, 175, 0.3) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(156, 163, 175, 0.3) 1px, transparent 1px)
    `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundPosition: `${offset.value.x}px ${offset.value.y}px`
    }
})

// Click en el minimapa para navegar
const handleMapClick = (event: MouseEvent) => {
    if (isDraggingViewport.value) return

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const miniX = event.clientX - rect.left
    const miniY = event.clientY - rect.top

    const canvasCoords = fromMiniMapCoords(miniX, miniY)

    // Centrar el viewport en el punto clickeado
    const newX = -(canvasCoords.x * props.canvasScale - props.containerWidth / 2)
    const newY = -(canvasCoords.y * props.canvasScale - props.containerHeight / 2)

    emit('navigate', newX, newY)
}

// Arrastrar el viewport en el minimapa
const handleMapMouseDown = (event: MouseEvent) => {
    if (!miniMapRef.value) return

    const rect = miniMapRef.value.getBoundingClientRect()
    const miniX = event.clientX - rect.left
    const miniY = event.clientY - rect.top

    const viewportStyle = getViewportStyle()
    const vpLeft = parseFloat(viewportStyle.left)
    const vpTop = parseFloat(viewportStyle.top)
    const vpWidth = parseFloat(viewportStyle.width)
    const vpHeight = parseFloat(viewportStyle.height)

    // Verificar si el click está dentro del viewport
    if (
        miniX >= vpLeft &&
        miniX <= vpLeft + vpWidth &&
        miniY >= vpTop &&
        miniY <= vpTop + vpHeight
    ) {
        isDraggingViewport.value = true
        event.preventDefault()
    }
}

const handleMapMouseMove = (event: MouseEvent) => {
    if (!isDraggingViewport.value || !miniMapRef.value) return

    const rect = miniMapRef.value.getBoundingClientRect()
    const miniX = event.clientX - rect.left
    const miniY = event.clientY - rect.top

    const canvasCoords = fromMiniMapCoords(miniX, miniY)

    // Centrar el viewport en la posición del cursor
    const newX = -(canvasCoords.x * props.canvasScale - props.containerWidth / 2)
    const newY = -(canvasCoords.y * props.canvasScale - props.containerHeight / 2)

    emit('navigate', newX, newY)
}

const handleMapMouseUp = () => {
    isDraggingViewport.value = false
}
</script>