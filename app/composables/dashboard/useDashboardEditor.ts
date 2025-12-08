import { computed, type Ref } from "vue";
import type {
  Panel as PanelInterface,
  PanelData,
  PanelType,
} from "~/types/panel";

import { usePanelConfiguration } from "./usePanelConfiguration";
import { useDashboardLoader } from "./useDashboardLoader";
import { useDashboardInteraction } from "./useDashboardInteraction";
import { useDashboardModes } from "./useDashboardModes";

import { useDashboardKeyboard } from "./useDashboardKeyboard";

interface DashboardEditorOptions {
  enableKeyboardShortcuts?: boolean;
}

export const useDashboardEditor = (
  contenedorRef: Ref<HTMLElement | null>,
  options: DashboardEditorOptions = {}
) => {
  const { enableKeyboardShortcuts = true } = options;

  // Composables base
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
    autoOrganizarMasonry,
    activarPanel,
  } = usePanelManager();

  const {
    isDragging,
    iniciarArrastre,
    moverPanel: moverPanelDrag,
    soltarPanel,
  } = usePanelDrag();

  const {
    isResizing,
    iniciarRedimension,
    redimensionarPanel,
    finalizarRedimension,
  } = usePanelResize();

  const {
    canvas,
    isPanning,
    iniciarPan,
    moverCanvas,
    detenerPan,
    hacerZoom,
    resetearCanvas,
    ajustarZoomATodos,
  } = useCanvasPan();

  const {
    alignmentGuides,
    measurementGuides,
    verificarAlineacion,
    limpiarGuias,
  } = usePanelAlignment();

  // Composables de UI
  const {
    modoPanActivo,
    modoDragActivo,
    mapaVisible,
    toggleModoPan,
    toggleModoDrag,
    toggleMapa,
  } = useDashboardModes();

  const {
    panelConfigurando,
    slideoverGraficoAbierto,
    slideoverEstadisticaAbierto,
    slideoverTablaAbierto,
    abrirConfigPanel,
    cerrarSlideovers,
  } = usePanelConfiguration();

  // Funciones de vista
  const ajustarVistaGlobal = () => {
    if (paneles.value.length === 0 || !contenedorRef.value) return;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    paneles.value.forEach((p) => {
      if (p.posicion.x < minX) minX = p.posicion.x;
      if (p.posicion.y < minY) minY = p.posicion.y;
      if (p.posicion.x + p.tamaño.width > maxX)
        maxX = p.posicion.x + p.tamaño.width;
      if (p.posicion.y + p.tamaño.height > maxY)
        maxY = p.posicion.y + p.tamaño.height;
    });

    if (minX === Infinity) return;

    ajustarZoomATodos(
      minX,
      minY,
      maxX,
      maxY,
      contenedorRef.value.clientWidth,
      contenedorRef.value.clientHeight,
      50
    );
  };

  const navegarDesdeMapa = (x: number, y: number) => {
    canvas.value.x = x;
    canvas.value.y = y;
  };

  // Loader
  const { cargandoTablero, cargarTableroDesdeUrl } = useDashboardLoader({
    paneles,
    limpiarTodos,
    ajustarVistaGlobal,
  });

  // Interacción
  const interaction = useDashboardInteraction({
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
  });

  // Handlers de paneles
  const iniciarArrastrePanel = (panel: PanelInterface, event: MouseEvent) => {
    if (!modoDragActivo.value) return;
    activarPanel(panel.id);
    iniciarArrastre(
      panel,
      event,
      canvas.value.x,
      canvas.value.y,
      canvas.value.scale
    );
  };

  const iniciarRedimensionPanel = (
    panel: PanelInterface,
    event: MouseEvent
  ) => {
    iniciarRedimension(
      panel,
      event,
      canvas.value.x,
      canvas.value.y,
      canvas.value.scale
    );
    activarPanel(panel.id);
  };

  const actualizarDataPanel = (panelId: string, nuevaData: PanelData) => {
    const panel = paneles.value.find((p) => p.id === panelId);
    if (panel) {
      actualizarPanel(panelId, { data: nuevaData });
    }
  };

  const guardarConfigPanel = (nuevaData: PanelData) => {
    if (panelConfigurando.value) {
      actualizarDataPanel(panelConfigurando.value.id, nuevaData);
      cerrarSlideovers();
    }
  };

  const handleAgregarPanel = (tipo: PanelType) => {
    if (!contenedorRef.value) return;
    const rect = contenedorRef.value.getBoundingClientRect();
    const nuevoPanel = agregarPanel(
      tipo,
      rect.width,
      rect.height,
      canvas.value.x,
      canvas.value.y
    );

    if (
      (tipo === "grafico" || tipo === "tabla" || tipo === "estadistica") &&
      nuevoPanel
    ) {
      setTimeout(() => abrirConfigPanel(nuevoPanel), 100);
    }
  };
  const duplicarPanelActivo = () => {
    const panelActivo = paneles.value.find((p) => p.activo);
    if (panelActivo) {
      duplicarPanel(panelActivo.id);
    }
  };

  const eliminarPanelActivo = () => {
    const panelActivo = paneles.value.find((p) => p.activo);
    if (panelActivo) {
      eliminarPanel(panelActivo.id);
    }
  };

  // Funciones de zoom
  const zoomIn = () => {
    if (!contenedorRef.value) return;
    const rect = contenedorRef.value.getBoundingClientRect();
    hacerZoom(-100, rect.width / 2, rect.height / 2);
  };

  const zoomOut = () => {
    if (!contenedorRef.value) return;
    const rect = contenedorRef.value.getBoundingClientRect();
    hacerZoom(100, rect.width / 2, rect.height / 2);
  };

  const resetearVista = () => resetearCanvas();

  const autoOrganizar = () => {
    autoOrganizarPaneles();
    resetearCanvas();
  };

  const autoOrganizarPanelesMansory = () => {
    autoOrganizarMasonry();
    resetearCanvas();
  };

  const keyboard = enableKeyboardShortcuts
    ? useDashboardKeyboard({
        onAddPanel: handleAgregarPanel,
        onZoomIn: zoomIn,
        onZoomOut: zoomOut,
        onResetView: resetearVista,
        onTogglePan: toggleModoPan,
        onToggleDrag: toggleModoDrag,
        onToggleMap: toggleMapa,
        onAutoOrganize: autoOrganizar,
        onClearAll: limpiarTodos,
        onDuplicate: duplicarPanelActivo,
        onDelete: eliminarPanelActivo,
      })
    : null;

  // Función para limpiar interacciones al desmontar
  const cleanup = () => {
    interaction.handleMouseUp();
  };

  return {
    // Estados
    paneles,
    totalPaneles,
    canvas,
    cargandoTablero,
    modoPanActivo,
    modoDragActivo,
    mapaVisible,
    panelConfigurando,
    slideoverGraficoAbierto,
    slideoverEstadisticaAbierto,
    slideoverTablaAbierto,
    alignmentGuides,
    measurementGuides,
    isInteracting: interaction.isInteracting,

    // Eventos de mouse
    handleMouseDown: interaction.handleMouseDown,
    handleMouseMove: interaction.handleMouseMove,
    handleMouseUp: interaction.handleMouseUp,
    handleMouseLeave: interaction.handleMouseLeave,
    handleWheel: interaction.handleWheel,

    // Acciones de paneles
    handleAgregarPanel,
    eliminarPanel,
    duplicarPanel,
    iniciarArrastrePanel,
    iniciarRedimensionPanel,
    actualizarDataPanel,
    abrirConfigPanel,
    guardarConfigPanel,

    // Controles
    toggleModoPan,
    toggleModoDrag,
    toggleMapa,
    zoomIn,
    zoomOut,
    resetearVista,
    limpiarTodos,
    autoOrganizar,
    autoOrganizarPanelesMansory,
    navegarDesdeMapa,
    ajustarVistaGlobal,
    cargarTableroDesdeUrl,
    cleanup,

    shortcuts: keyboard?.shortcuts,
  };
};
