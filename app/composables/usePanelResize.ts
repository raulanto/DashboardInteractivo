// composables/usePanelResize.ts

import { ref } from 'vue'
import type { Panel, ResizeState } from '~/types/panel'
import { validarTamanoMinimo } from '~/utils/panelHelpers'

export const usePanelResize = () => {
    const resizeState = ref<ResizeState>({
        panel: null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0
    })

    const isResizing = ref(false)

    /**
     * Inicia el redimensionamiento de un panel
     */
    const iniciarRedimension = (
        panel: Panel,
        event: MouseEvent,
        canvasX: number = 0,
        canvasY: number = 0,
        canvasScale: number = 1
    ) => {
        event.preventDefault()
        event.stopPropagation()

        const clientX = (event.clientX - canvasX) / canvasScale
        const clientY = (event.clientY - canvasY) / canvasScale

        resizeState.value = {
            panel,
            startX: clientX,
            startY: clientY,
            startWidth: panel.tamaño.width,
            startHeight: panel.tamaño.height
        }

        panel.redimensionando = true
        panel.activo = true
        isResizing.value = true
    }

    /**
     * Redimensiona el panel mientras se arrastra
     */
    const redimensionarPanel = (
        event: MouseEvent,
        canvasX: number = 0,
        canvasY: number = 0,
        canvasScale: number = 1
    ) => {
        if (!resizeState.value.panel || !isResizing.value) return

        const clientX = (event.clientX - canvasX) / canvasScale
        const clientY = (event.clientY - canvasY) / canvasScale

        const deltaX = clientX - resizeState.value.startX
        const deltaY = clientY - resizeState.value.startY

        const nuevoWidth = resizeState.value.startWidth + deltaX
        const nuevoHeight = resizeState.value.startHeight + deltaY

        // Validar tamaño mínimo según tipo de panel
        const tamañoValidado = validarTamanoMinimo(
            resizeState.value.panel.tipo,
            nuevoWidth,
            nuevoHeight
        )

        resizeState.value.panel.tamaño = tamañoValidado
    }

    /**
     * Finaliza el redimensionamiento
     */
    const finalizarRedimension = () => {
        if (resizeState.value.panel) {
            resizeState.value.panel.redimensionando = false
            resizeState.value.panel.activo = false
        }

        resizeState.value = {
            panel: null,
            startX: 0,
            startY: 0,
            startWidth: 0,
            startHeight: 0
        }

        isResizing.value = false
    }

    /**
     * Cancela el redimensionamiento y restaura tamaño original
     */
    const cancelarRedimension = () => {
        if (resizeState.value.panel) {
            resizeState.value.panel.tamaño = {
                width: resizeState.value.startWidth,
                height: resizeState.value.startHeight
            }
            finalizarRedimension()
        }
    }

    return {
        // State
        resizeState,
        isResizing,

        // Methods
        iniciarRedimension,
        redimensionarPanel,
        finalizarRedimension,
        cancelarRedimension
    }
}