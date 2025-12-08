import { computed, type Ref } from 'vue';
import type { Panel as PanelInterface } from '~/types/panel';

interface InteractionDependencies {
  contenedorRef: Ref<HTMLElement | null>;
  modoPanActivo: Ref<boolean>;
  modoDragActivo: Ref<boolean>;
  canvas: any;
  paneles: Ref<PanelInterface[]>;
  isDragging: Ref<boolean>;
  isResizing: Ref<boolean>;
  iniciarPan: (event: MouseEvent) => void;
  moverCanvas: (event: MouseEvent) => void;
  detenerPan: () => void;
  moverPanelDrag: (event: MouseEvent, x: number, y: number, scale: number) => void;
  soltarPanel: () => void;
  redimensionarPanel: (event: MouseEvent, x: number, y: number, scale: number) => void;
  finalizarRedimension: () => void;
  desactivarTodos: () => void;
  verificarAlineacion: (panel: PanelInterface, paneles: PanelInterface[]) => { snapX: number | null; snapY: number | null };
  limpiarGuias: () => void;
  hacerZoom: (delta: number, centerX: number, centerY: number) => void;
}

export const useDashboardInteraction = (deps: InteractionDependencies) => {
  const {
    contenedorRef,
    modoPanActivo,
    modoDragActivo,
    canvas,
    paneles,
    isDragging,
    isResizing,
    iniciarPan,
    moverCanvas,
    detenerPan,
    moverPanelDrag,
    soltarPanel,
    redimensionarPanel,
    finalizarRedimension,
    desactivarTodos,
    verificarAlineacion,
    limpiarGuias,
    hacerZoom,
  } = deps;

  const isInteracting = computed(
    () => canvas.value.panning || isDragging.value || isResizing.value
  );

  const handleMouseDown = (event: MouseEvent) => {
    // Pan con Shift o botón medio
    if (modoPanActivo.value && (event.shiftKey || event.button === 1)) {
      iniciarPan(event);
      return;
    }

    // Pan si drag está desactivado
    if (modoPanActivo.value && !modoDragActivo.value && event.button === 0) {
      iniciarPan(event);
      return;
    }

    // Desactivar paneles si se hace clic en el fondo
    const targetElement = event.target as HTMLElement;
    if (
      targetElement === contenedorRef.value ||
      targetElement.classList.contains('canvas-wrapper')
    ) {
      if (!isDragging.value && !isResizing.value) {
        desactivarTodos();
      }
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (canvas.value.panning && modoPanActivo.value) {
      moverCanvas(event);
    } else if (isDragging.value && modoDragActivo.value) {
      // Mover el panel
      moverPanelDrag(event, canvas.value.x, canvas.value.y, canvas.value.scale);

      // Calcular alineación y snap
      const panelActivo = paneles.value.find((p) => p.arrastrando);
      if (panelActivo) {
        const { snapX, snapY } = verificarAlineacion(panelActivo, paneles.value);
        if (snapX !== null) panelActivo.posicion.x = snapX;
        if (snapY !== null) panelActivo.posicion.y = snapY;
      }
    } else if (isResizing.value) {
      redimensionarPanel(
        event,
        canvas.value.x,
        canvas.value.y,
        canvas.value.scale
      );
    }
  };

  const handleMouseUp = () => {
    if (canvas.value.panning) {
      detenerPan();
    } else if (isDragging.value) {
      soltarPanel();
      limpiarGuias();
    } else if (isResizing.value) {
      finalizarRedimension();
    }
  };

  const handleMouseLeave = () => {
    handleMouseUp();
  };

  const handleWheel = (event: WheelEvent) => {
    if (!contenedorRef.value) return;
    const rect = contenedorRef.value.getBoundingClientRect();
    const centerX = event.clientX - rect.left;
    const centerY = event.clientY - rect.top;
    hacerZoom(event.deltaY, centerX, centerY);
  };

  return {
    isInteracting,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleWheel,
  };
};