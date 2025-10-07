// types/panel.ts

export type PanelType = 'estadistica' | 'grafico' | 'lista' | 'tabla' | 'mapa' | 'calendario' | 'notas'

export interface PanelPosition {
    x: number
    y: number
}

// Tipo para la configuración inicial de un panel
export interface PanelConfig {
    tipo: Panel['tipo']
    titulo: string
    data: PanelData
    posicion?: {
        x: number
        y: number
    }
    tamaño?: {
        width: number
        height: number
    }
}
export interface PanelSize {
    width: number
    height: number
}

// export interface PanelData {
//     valor?: string | number
//     subtitulo?: string
//     items?: any[]
//     datos?: any
// }

export interface Panel {
    id: string
    titulo: string
    tipo: 'estadistica' | 'grafico' | 'lista' | 'tabla' | 'calendario' | 'mapa' | 'notas'
    posicion: {
        x: number
        y: number
    }
    tamaño: {
        width: number
        height: number
    }
    data: PanelData
    zIndex: number
    activo?: boolean
    arrastrando?: boolean
    redimensionando?: boolean
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
    minHeight: number,
    maxWidth?: number
    maxHeight?: number
}

export const PANEL_SIZE_PRESETS: Record<PanelType, PanelSizePreset> = {
    estadistica: {
        width: 280,
        height: 200,
        minWidth: 200,
        minHeight: 150,
        maxWidth: 600,
        maxHeight: 400
    },
    grafico: {
        width: 400,
        height: 300,
        minWidth: 300,
        minHeight: 250,
        maxWidth: 900,
        maxHeight: 600
    },
    lista: {
        width: 350,
        height: 400,
        minWidth: 280,
        minHeight: 300,
        maxWidth: 500,
        maxHeight: 800
    },
    tabla: {
        width: 600,
        height: 400,
        minWidth: 400,
        minHeight: 300,
        maxWidth: 1200,
        maxHeight: 800
    },
    mapa: {
        width: 500,
        height: 450,
        minWidth: 400,
        minHeight: 400,
        maxWidth: 1000,
        maxHeight: 800
    },
    calendario: {
        width: 450,
        height: 500,
        minWidth: 350,
        minHeight: 400,
        maxWidth: 800,
        maxHeight: 900
    },
    notas: {
        width: 300,
        height: 250,
        minWidth: 250,
        minHeight: 200,
        maxWidth: 600,
        maxHeight: 600
    }
}


export interface EstadisticaData {
    valor: string | number
    subtitulo: string
}

export interface GraficoItem {
    label: string
    valor: number
}

export interface GraficoData {
    datos: GraficoItem[]
}

export interface ListaItem {
    id: number
    titulo: string
    estado: string
}

export interface ListaData {
    items: ListaItem[]
}

export interface TablaData {
    columnas: string[]
    filas: (string | number)[][]
}

export interface CalendarioData {
    eventos?: any[]
}

export interface MapaData {
    ubicaciones?: any[]
}

export interface NotasData {
    contenido?: string
}

export type PanelData =
    | EstadisticaData
    | GraficoData
    | ListaData
    | TablaData
    | CalendarioData
    | MapaData
    | NotasData