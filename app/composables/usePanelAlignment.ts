import { ref } from 'vue'
import type { Panel } from '~/types/panel'

export interface GuiaAlineacion {
    tipo: 'vertical' | 'horizontal'
    x: number
    y: number
    longitud: number
    inicio: number // Coordenada donde empieza la línea
}

export const usePanelAlignment = () => {
    const guias = ref<GuiaAlineacion[]>([])

    const limpiarGuias = () => {
        guias.value = []
    }

    /**
     * Compara el panel activo con los demás y calcula guías y posición de snap
     */
    const verificarAlineacion = (panelActivo: Panel, paneles: Panel[], threshold: number = 5) => {
        const activeRect = {
            left: panelActivo.posicion.x,
            right: panelActivo.posicion.x + panelActivo.tamaño.width,
            top: panelActivo.posicion.y,
            bottom: panelActivo.posicion.y + panelActivo.tamaño.height,
            centerX: panelActivo.posicion.x + panelActivo.tamaño.width / 2,
            centerY: panelActivo.posicion.y + panelActivo.tamaño.height / 2,
            width: panelActivo.tamaño.width,
            height: panelActivo.tamaño.height
        }

        let snapX: number | null = null
        let snapY: number | null = null
        const nuevasGuias: GuiaAlineacion[] = []

        // Filtrar el panel activo para no compararlo consigo mismo
        const otrosPaneles = paneles.filter(p => p.id !== panelActivo.id)

        for (const otro of otrosPaneles) {
            const targetRect = {
                left: otro.posicion.x,
                right: otro.posicion.x + otro.tamaño.width,
                centerX: otro.posicion.x + otro.tamaño.width / 2,
                top: otro.posicion.y,
                bottom: otro.posicion.y + otro.tamaño.height,
                centerY: otro.posicion.y + otro.tamaño.height / 2
            }

            // --- EJE X (Vertical Guides) ---
            const checkX = [
                { type: 'left', val: activeRect.left, targetVal: targetRect.left },
                { type: 'left', val: activeRect.left, targetVal: targetRect.right },
                { type: 'left', val: activeRect.left, targetVal: targetRect.centerX },
                { type: 'right', val: activeRect.right, targetVal: targetRect.left },
                { type: 'right', val: activeRect.right, targetVal: targetRect.right },
                { type: 'right', val: activeRect.right, targetVal: targetRect.centerX },
                { type: 'centerX', val: activeRect.centerX, targetVal: targetRect.left },
                { type: 'centerX', val: activeRect.centerX, targetVal: targetRect.right },
                { type: 'centerX', val: activeRect.centerX, targetVal: targetRect.centerX },
            ]

            for (const check of checkX) {
                if (Math.abs(check.val - check.targetVal) < threshold) {
                    // Calcular offset para snap
                    if (snapX === null) {
                        if (check.type === 'left') snapX = check.targetVal
                        else if (check.type === 'right') snapX = check.targetVal - activeRect.width
                        else if (check.type === 'centerX') snapX = check.targetVal - activeRect.width / 2
                    }

                    // Definir visualización de la guía (abarca la altura combinada de ambos paneles)
                    const minY = Math.min(activeRect.top, targetRect.top)
                    const maxY = Math.max(activeRect.bottom, targetRect.bottom)

                    nuevasGuias.push({
                        tipo: 'vertical',
                        x: check.targetVal,
                        y: minY,
                        inicio: minY,
                        longitud: maxY - minY
                    })
                }
            }

            // --- EJE Y (Horizontal Guides) ---
            const checkY = [
                { type: 'top', val: activeRect.top, targetVal: targetRect.top },
                { type: 'top', val: activeRect.top, targetVal: targetRect.bottom },
                { type: 'top', val: activeRect.top, targetVal: targetRect.centerY },
                { type: 'bottom', val: activeRect.bottom, targetVal: targetRect.top },
                { type: 'bottom', val: activeRect.bottom, targetVal: targetRect.bottom },
                { type: 'bottom', val: activeRect.bottom, targetVal: targetRect.centerY },
                { type: 'centerY', val: activeRect.centerY, targetVal: targetRect.top },
                { type: 'centerY', val: activeRect.centerY, targetVal: targetRect.bottom },
                { type: 'centerY', val: activeRect.centerY, targetVal: targetRect.centerY },
            ]

            for (const check of checkY) {
                if (Math.abs(check.val - check.targetVal) < threshold) {
                    // Calcular offset para snap
                    if (snapY === null) {
                        if (check.type === 'top') snapY = check.targetVal
                        else if (check.type === 'bottom') snapY = check.targetVal - activeRect.height
                        else if (check.type === 'centerY') snapY = check.targetVal - activeRect.height / 2
                    }

                    // Definir visualización de la guía (abarca la anchura combinada)
                    const minX = Math.min(activeRect.left, targetRect.left)
                    const maxX = Math.max(activeRect.right, targetRect.right)

                    nuevasGuias.push({
                        tipo: 'horizontal',
                        x: minX,
                        y: check.targetVal,
                        inicio: minX,
                        longitud: maxX - minX
                    })
                }
            }
        }

        guias.value = nuevasGuias
        return { snapX, snapY }
    }

    return {
        guias,
        verificarAlineacion,
        limpiarGuias
    }
}