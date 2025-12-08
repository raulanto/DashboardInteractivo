import { ref } from 'vue';
import type { Panel as PanelInterface, PanelData } from '~/types/panel';

export const usePanelConfiguration = () => {
  const panelConfigurando = ref<PanelInterface | null>(null);
  const slideoverGraficoAbierto = ref(false);
  const slideoverEstadisticaAbierto = ref(false);
  const slideoverTablaAbierto = ref(false);

  const abrirConfigPanel = (panel: PanelInterface) => {
    panelConfigurando.value = panel;
    
    switch (panel.tipo) {
      case 'grafico':
        slideoverGraficoAbierto.value = true;
        break;
      case 'estadistica':
        slideoverEstadisticaAbierto.value = true;
        break;
      case 'tabla':
        slideoverTablaAbierto.value = true;
        break;
    }
  };

  const cerrarSlideovers = () => {
    slideoverGraficoAbierto.value = false;
    slideoverEstadisticaAbierto.value = false;
    slideoverTablaAbierto.value = false;
    panelConfigurando.value = null;
  };

  return {
    panelConfigurando,
    slideoverGraficoAbierto,
    slideoverEstadisticaAbierto,
    slideoverTablaAbierto,
    abrirConfigPanel,
    cerrarSlideovers,
  };
};