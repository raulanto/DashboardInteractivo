// types/panel.ts

export type PanelType = 'estadistica' | 'grafico' | 'lista' | 'tabla' | 'mapa' | 'calendario' | 'notas'

export interface PanelPosition {
    x: number
    y: number
}

export interface PanelSize {
    width: number
    height: number
}

export interface PanelData {
    valor?: string | number
    subtitulo?: string
    items?: any[]
    datos?: any
}

export interface Panel {
    id: string
    titulo: string
    tipo: PanelType
    posicion: PanelPosition
    tamaño: PanelSize
    data: PanelData
    activo: boolean
    arrastrando: boolean
    redimensionando: boolean
    zIndex: number
}

export interface CanvasState {
    x: number
    y: number
    scale: number
    panning: boolean
}

export interface DragState {
    panel: Panel | null
    offsetX: number
    offsetY: number
    startX: number
    startY: number
}

export interface ResizeState {
    panel: Panel | null
    startX: number
    startY: number
    startWidth: number
    startHeight: number
}

// Configuración de tamaños predefinidos para diferentes tipos de paneles
export interface PanelSizePreset {
    width: number
    height: number
    minWidth: number
    minHeight: number
}

export const PANEL_SIZE_PRESETS: Record<PanelType, PanelSizePreset> = {
    estadistica: {
        width: 280,
        height: 200,
        minWidth: 200,
        minHeight: 150
    },
    grafico: {
        width: 400,
        height: 300,
        minWidth: 300,
        minHeight: 250
    },
    lista: {
        width: 350,
        height: 400,
        minWidth: 280,
        minHeight: 300
    },
    tabla: {
        width: 600,
        height: 400,
        minWidth: 400,
        minHeight: 300
    },
    mapa: {
        width: 500,
        height: 450,
        minWidth: 400,
        minHeight: 400
    },
    calendario: {
        width: 450,
        height: 500,
        minWidth: 350,
        minHeight: 400
    },
    notas: {
        width: 300,
        height: 250,
        minWidth: 250,
        minHeight: 200
    }
}