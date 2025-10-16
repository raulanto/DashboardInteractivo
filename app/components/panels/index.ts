// Exportaciones centralizadas de componentes de paneles
export { default as PanelEstadistica } from './PanelEstadistica.vue'
export { default as PanelGrafico } from './PanelGrafico.vue'
export { default as PanelLista } from './PanelLista.vue'
export { default as PanelTabla } from './PanelTabla.vue'
export { default as PanelCalendario } from './PanelCalendario.vue'
export { default as PanelMapa } from './PanelMapa.vue'
export { default as PanelNotas } from './PanelNotas.vue'

// Mapa de componentes por tipo
import PanelEstadistica from './PanelEstadistica.vue'
import PanelGrafico from './PanelGrafico.vue'
import PanelLista from './PanelLista.vue'
import PanelTabla from './PanelTabla.vue'
import PanelCalendario from './PanelCalendario.vue'
import PanelMapa from './PanelMapa.vue'
import PanelNotas from './PanelNotas.vue'
import type { PanelType } from '~/types/panel'

export const PANEL_COMPONENTS: Record<PanelType, any> = {
    estadistica: PanelEstadistica,
    grafico: PanelGrafico,
    lista: PanelLista,
    tabla: PanelTabla,
    calendario: PanelCalendario,
    mapa: PanelMapa,
    notas: PanelNotas
}


// Helper para obtener componente por tipo
export function getPanelComponent(tipo: PanelType) {
    return PANEL_COMPONENTS[tipo]
}