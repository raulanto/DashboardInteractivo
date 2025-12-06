// composables/useDashboardEvents.ts
import type { Ref } from 'vue';
import type { Panel } from '~/types/panel';

// Importa tus otros composables aquí
import { useCanvasPan } from "~/composables/useCanvasPan";
import { usePanelDrag } from "~/composables/usePanelDrag";
import { usePanelResize } from "~/composables/usePanelResize";
import { usePanelAlignment } from "~/composables/usePanelAlignment";

interface DashboardEventsParams {
    contenedorRef: Ref<HTMLElement | null>;
    paneles: Ref<Panel[]>;
    modoPanActivo: Ref<boolean>;
    modoDragActivo: Ref<boolean>;
    activarPanel: (id: string) => void;
    desactivarTodos: () => void;
}

export const useDashboardEvents = ({
                                       contenedorRef,
                                       paneles,
                                       modoPanActivo,
                                       modoDragActivo,
                                       activarPanel,
                                       desactivarTodos
                                   }: DashboardEventsParams) => {

    // Inicializamos los sub-composables aquí para centralizar
    const canvasPan = useCanvasPan();
    const panelDrag = usePanelDrag();
    const panelResize = usePanelResize();
    const alignment = usePanelAlignment();

    const { canvas, moverCanvas, iniciarPan, detenerPan, hacerZoom } = canvasPan;
    const { isDragging, moverPanel, iniciarArrastre, soltarPanel } = panelDrag;
    const { isResizing, redimensionarPanel, finalizarRedimension } = panelResize;
    const { verificarAlineacion, limpiarGuias } = alignment;

    // Lógica consolidada de MouseDown
    const handleMouseDown = (event: MouseEvent) => {
        // Lógica de Pan con Shift o botón central
        if (modoPanActivo.value && (event.shiftKey || event.button === 1 || !modoDragActivo.value)) {
            iniciarPan(event);
            return;
        }

        const target = event.target as HTMLElement;
        // Si clicamos en el fondo vacío, deseleccionamos
        if (target === contenedorRef.value || target.classList.contains('canvas-background')) {
            if (!isDragging.value && !isResizing.value) {
                desactivarTodos();
            }
        }
    };

    // Lógica consolidada de MouseMove
    const handleMouseMove = (event: MouseEvent) => {
        if (canvas.value.panning && modoPanActivo.value) {
            moverCanvas(event);
            return;
        }

        // Optimización: Usar requestAnimationFrame si el rendimiento baja
        if (isDragging.value && modoDragActivo.value) {
            moverPanel(event, canvas.value.x, canvas.value.y, canvas.value.scale);

            // Lógica de snapping
            const panelActivo = paneles.value.find(p => p.arrastrando);
            if (panelActivo) {
                const { snapX, snapY } = verificarAlineacion(panelActivo, paneles.value);
                if (snapX !== null) panelActivo.posicion.x = snapX;
                if (snapY !== null) panelActivo.posicion.y = snapY;
            }
        } else if (isResizing.value) {
            redimensionarPanel(event, canvas.value.x, canvas.value.y, canvas.value.scale);
        }
    };

    // Lógica consolidada de MouseUp
    const handleMouseUp = () => {
        if (canvas.value.panning) detenerPan();
        if (isDragging.value) {
            soltarPanel();
            limpiarGuias();
        }
        if (isResizing.value) finalizarRedimension();
    };

    const handleWheel = (event: WheelEvent) => {
        if (!contenedorRef.value) return;
        const rect = contenedorRef.value.getBoundingClientRect();
        const centerX = event.clientX - rect.left;
        const centerY = event.clientY - rect.top;
        hacerZoom(event.deltaY, centerX, centerY);
    };

    // Exponemos todo lo necesario
    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleWheel,
        // Exponemos el estado interno de los composables para la UI
        canvas,
        isDragging,
        isResizing,
        alignmentGuides: alignment.alignmentGuides,
        measurementGuides: alignment.measurementGuides,
        // Helpers de canvas
        canvasPan,
        panelDrag,
        panelResize
    };
};