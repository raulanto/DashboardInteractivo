import { onMounted, onBeforeUnmount } from 'vue';
import type { PanelType } from '~/types/panel';

interface KeyboardShortcutsOptions {
  onAddPanel?: (type: PanelType) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  onTogglePan?: () => void;
  onToggleDrag?: () => void;
  onToggleMap?: () => void;
  onAutoOrganize?: () => void;
  onClearAll?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export const useDashboardKeyboard = (options: KeyboardShortcutsOptions = {}) => {
  const {
    onAddPanel,
    onZoomIn,
    onZoomOut,
    onResetView,
    onTogglePan,
    onToggleDrag,
    onToggleMap,
    onAutoOrganize,
    onClearAll,
    onDuplicate,
    onDelete,
  } = options;

  const handleKeyDown = (event: KeyboardEvent) => {
    const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
      (event.target as HTMLElement)?.tagName
    );

    // No ejecutar atajos si hay un input activo
    if (isInputActive && !event.ctrlKey && !event.metaKey) {
      return;
    }

    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;

    // Prevenir comportamiento por defecto para atajos conocidos
    const preventDefaults = () => event.preventDefault();

    // Zoom
    if (ctrl && key === '+' && onZoomIn) {
      preventDefaults();
      onZoomIn();
      return;
    }

    if (ctrl && key === '-' && onZoomOut) {
      preventDefaults();
      onZoomOut();
      return;
    }

    if (ctrl && key === '0' && onResetView) {
      preventDefaults();
      onResetView();
      return;
    }

    // Modos
    if (key === 'h' && onTogglePan) {
      preventDefaults();
      onTogglePan();
      return;
    }

    if (key === 'v' && onToggleDrag) {
      preventDefaults();
      onToggleDrag();
      return;
    }

    if (key === 'm' && onToggleMap) {
      preventDefaults();
      onToggleMap();
      return;
    }

    // Organización
    if (ctrl && shift && key === 'o' && onAutoOrganize) {
      preventDefaults();
      onAutoOrganize();
      return;
    }

    // Agregar paneles (Ctrl + Shift + tecla)
    if (ctrl && shift && onAddPanel) {
      const panelTypes: Record<string, PanelType> = {
        g: 'grafico',
        t: 'tabla',
        e: 'estadistica',
        n: 'nota',
      };

      if (panelTypes[key]) {
        preventDefaults();
        onAddPanel(panelTypes[key]);
        return;
      }
    }

    // Duplicar (Ctrl + D)
    if (ctrl && key === 'd' && onDuplicate) {
      preventDefaults();
      onDuplicate();
      return;
    }

    // Eliminar (Delete o Backspace)
    if ((key === 'delete' || key === 'backspace') && onDelete) {
      if (!isInputActive) {
        preventDefaults();
        onDelete();
        return;
      }
    }

    // Limpiar todo (Ctrl + Shift + Delete)
    if (ctrl && shift && key === 'delete' && onClearAll) {
      preventDefaults();
      onClearAll();
      return;
    }

    // Espacio para activar pan temporalmente
    if (key === ' ' && onTogglePan && !isInputActive) {
      preventDefaults();
      // Esto se manejaría mejor con keydown/keyup para pan temporal
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  // Retornar mapa de atajos para mostrar ayuda
  const shortcuts = {
    zoom: [
      { keys: 'Ctrl/⌘ + +', description: 'Acercar zoom' },
      { keys: 'Ctrl/⌘ + -', description: 'Alejar zoom' },
      { keys: 'Ctrl/⌘ + 0', description: 'Restablecer vista' },
    ],
    modes: [
      { keys: 'H', description: 'Alternar modo Pan' },
      { keys: 'V', description: 'Alternar modo Drag' },
      { keys: 'M', description: 'Alternar minimapa' },
    ],
    panels: [
      { keys: 'Ctrl/⌘ + Shift + G', description: 'Agregar gráfico' },
      { keys: 'Ctrl/⌘ + Shift + T', description: 'Agregar tabla' },
      { keys: 'Ctrl/⌘ + Shift + E', description: 'Agregar estadística' },
      { keys: 'Ctrl/⌘ + Shift + N', description: 'Agregar nota' },
      { keys: 'Ctrl/⌘ + D', description: 'Duplicar panel activo' },
      { keys: 'Delete/Backspace', description: 'Eliminar panel activo' },
    ],
    organization: [
      { keys: 'Ctrl/⌘ + Shift + O', description: 'Auto-organizar paneles' },
      { keys: 'Ctrl/⌘ + Shift + Delete', description: 'Limpiar todo' },
    ],
  };

  return {
    shortcuts,
  };
};