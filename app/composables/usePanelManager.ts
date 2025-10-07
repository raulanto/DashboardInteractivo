import { ref, computed } from 'vue'
import type { Panel, PanelType, PanelData } from '~/types/panel'
import { PANEL_SIZE_PRESETS } from '~/types/panel'

const paneles = ref<Panel[]>([])
const maxZIndex = ref(1)

/**
 * Obtiene datos de ejemplo según el tipo de panel
 */
const obtenerDataEjemplo = (tipo: PanelType): PanelData => {
    switch (tipo) {
        case 'estadistica':
            return {
                valor: Math.floor(Math.random() * 10000),
                subtitulo: 'Total de usuarios'
            }

        case 'grafico':
            return {
                datos: [
                    { label: 'Ventas', valor: Math.floor(Math.random() * 100) },
                    { label: 'Marketing', valor: Math.floor(Math.random() * 100) },
                    { label: 'Desarrollo', valor: Math.floor(Math.random() * 100) },
                    { label: 'Soporte', valor: Math.floor(Math.random() * 100) }
                ]
            }

        case 'lista':
            return {
                items: [
                    { id: 1, titulo: 'Implementar autenticación', estado: 'Completado' },
                    { id: 2, titulo: 'Diseñar dashboard', estado: 'En progreso' },
                    { id: 3, titulo: 'Optimizar base de datos', estado: 'Pendiente' },
                    { id: 4, titulo: 'Testing de integración', estado: 'Pendiente' }
                ]
            }

        case 'tabla':
            return {
                columnas: ['Nombre', 'Cargo', 'Estado'],
                filas: [
                    ['Juan Pérez', 'Desarrollador', 'Activo'],
                    ['María García', 'Diseñadora', 'Activo'],
                    ['Carlos López', 'Manager', 'Inactivo'],
                    ['Ana Martínez', 'Product Owner', 'Activo']
                ]
            }

        case 'calendario':
            return { eventos: [] }

        case 'mapa':
            return { ubicaciones: [] }

        case 'notas':
            return { contenido: '' }

        default:
            return {}
    }
}

/**
 * Obtiene el título según el tipo de panel
 */
const obtenerTituloPanel = (tipo: PanelType): string => {
    const titulos: Record<PanelType, string> = {
        estadistica: 'Estadísticas',
        grafico: 'Gráfico de Rendimiento',
        lista: 'Tareas Pendientes',
        tabla: 'Tabla de Datos',
        calendario: 'Calendario',
        mapa: 'Mapa',
        notas: 'Notas'
    }
    return titulos[tipo] || 'Panel'
}

export const usePanelManager = () => {
    const totalPaneles = computed(() => paneles.value.length)

    /**
     * Genera una posición aleatoria dentro del viewport
     */
    const generarPosicionAleatoria = (
        anchoContenedor: number,
        altoContenedor: number,
        canvasX: number = 0,
        canvasY: number = 0
    ) => {
        const margen = 50
        const anchoPanel = 400
        const altoPanel = 300

        const x = Math.random() * (anchoContenedor - anchoPanel - margen * 2) + margen - canvasX
        const y = Math.random() * (altoContenedor - altoPanel - margen * 2) + margen - canvasY

        return { x, y }
    }

    /**
     * Agrega un nuevo panel al canvas
     */
    const agregarPanel = (
        tipo: PanelType,
        anchoContenedor: number = 1200,
        altoContenedor: number = 800,
        canvasX: number = 0,
        canvasY: number = 0
    ) => {
        const posicion = generarPosicionAleatoria(anchoContenedor, altoContenedor, canvasX, canvasY)

        // Obtener tamaño predefinido según el tipo de panel
        const sizePreset = PANEL_SIZE_PRESETS[tipo]

        const nuevoPanel: Panel = {
            id: `panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            titulo: obtenerTituloPanel(tipo),
            tipo,
            posicion,
            tamaño: {
                width: sizePreset.width,
                height: sizePreset.height
            },
            data: obtenerDataEjemplo(tipo),
            zIndex: maxZIndex.value++,
            activo: false,
            arrastrando: false,
            redimensionando: false
        }

        paneles.value.push(nuevoPanel)
        return nuevoPanel
    }

    /**
     * Elimina un panel por su ID
     */
    const eliminarPanel = (id: string) => {
        const index = paneles.value.findIndex(p => p.id === id)
        if (index !== -1) {
            paneles.value.splice(index, 1)
        }
    }

    /**
     * Duplica un panel existente
     */
    const duplicarPanel = (id: string) => {
        const panelOriginal = paneles.value.find(p => p.id === id)
        if (!panelOriginal) return

        const offset = 30
        const nuevoPosicion = {
            x: panelOriginal.posicion.x + offset,
            y: panelOriginal.posicion.y + offset
        }

        const nuevoPanel: Panel = {
            ...panelOriginal,
            id: `panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            posicion: nuevoPosicion,
            zIndex: maxZIndex.value++,
            activo: false,
            arrastrando: false,
            redimensionando: false,
            data: JSON.parse(JSON.stringify(panelOriginal.data))
        }

        paneles.value.push(nuevoPanel)
        return nuevoPanel
    }

    /**
     * Actualiza las propiedades de un panel
     */
    const actualizarPanel = (id: string, actualizaciones: Partial<Panel>) => {
        const panel = paneles.value.find(p => p.id === id)
        if (panel) {
            Object.assign(panel, actualizaciones)
        }
    }

    /**
     * Actualiza la posición de un panel
     */
    const actualizarPosicion = (id: string, x: number, y: number) => {
        const panel = paneles.value.find(p => p.id === id)
        if (panel) {
            panel.posicion = { x, y }
        }
    }

    /**
     * Actualiza el tamaño de un panel
     */
    const actualizarTamano = (id: string, width: number, height: number) => {
        const panel = paneles.value.find(p => p.id === id)
        if (panel) {
            const preset = PANEL_SIZE_PRESETS[panel.tipo]

            // Aplicar límites mínimos
            let newWidth = Math.max(width, preset.minWidth)
            let newHeight = Math.max(height, preset.minHeight)

            // Aplicar límites máximos si existen
            if (preset.maxWidth !== undefined) {
                newWidth = Math.min(newWidth, preset.maxWidth)
            }
            if (preset.maxHeight !== undefined) {
                newHeight = Math.min(newHeight, preset.maxHeight)
            }

            panel.tamaño = {
                width: newWidth,
                height: newHeight
            }
        }
    }

    /**
     * Activa un panel y desactiva los demás
     */
    const activarPanel = (id: string) => {
        paneles.value.forEach(p => {
            p.activo = p.id === id
        })

        const panel = paneles.value.find(p => p.id === id)
        if (panel) {
            panel.zIndex = maxZIndex.value++
        }
    }

    /**
     * Desactiva todos los paneles
     */
    const desactivarTodos = () => {
        paneles.value.forEach(p => {
            p.activo = false
        })
    }

    /**
     * Limpia todos los paneles
     */
    const limpiarTodos = () => {
        paneles.value = []
        maxZIndex.value = 1
    }

    /**
     * Organiza los paneles en una cuadrícula inteligente
     * Respeta los tamaños actuales de cada panel y evita encimamientos
     */
    const autoOrganizarPaneles = () => {
        if (paneles.value.length === 0) return

        const padding = 20
        const margenInicial = 20

        // Calcular el ancho máximo por fila basado en los paneles
        const anchoMaximoPorFila = Math.max(
            ...paneles.value.map(p => p.tamaño.width)
        )

        // Determinar número óptimo de columnas basado en anchos
        const anchoTotalDisponible = 1400 // Ancho típico de viewport
        const columnas = Math.max(
            1,
            Math.floor(anchoTotalDisponible / (anchoMaximoPorFila + padding))
        )

        // Organizar paneles en filas
        const filas: Panel[][] = []
        for (let i = 0; i < paneles.value.length; i += columnas) {
            filas.push(paneles.value.slice(i, i + columnas))
        }

        let yActual = margenInicial

        // Posicionar cada fila
        filas.forEach((fila) => {
            // Encontrar la altura máxima de esta fila
            const alturaMaximaFila = Math.max(...fila.map(p => p.tamaño.height))

            let xActual = margenInicial

            // Posicionar cada panel en la fila
            fila.forEach((panel) => {
                panel.posicion = {
                    x: xActual,
                    y: yActual
                }

                // Mover x para el siguiente panel (usar el ancho del panel actual)
                xActual += panel.tamaño.width + padding
            })

            // Mover y para la siguiente fila (usar la altura máxima de la fila actual)
            yActual += alturaMaximaFila + padding
        })
    }

    /**
     * Organiza los paneles en estilo Masonry (cascada) mejorado
     * Respeta los tamaños actuales y evita encimamientos
     */
    const autoOrganizarMasonry = () => {
        if (paneles.value.length === 0) return

        const padding = 20
        const margenInicial = 20

        // Determinar número de columnas basado en el ancho promedio de los paneles
        const anchoProm = paneles.value.reduce((sum, p) => sum + p.tamaño.width, 0) / paneles.value.length
        const anchoTotalDisponible = 1400
        const numColumnas = Math.max(
            1,
            Math.min(4, Math.floor(anchoTotalDisponible / (anchoProm + padding)))
        )

        // Crear estructura de columnas con información detallada
        interface ColumnaInfo {
            x: number          // Posición X de la columna
            altura: number     // Altura actual de la columna
            anchoMax: number   // Ancho máximo usado en esta columna
        }

        const columnas: ColumnaInfo[] = []

        // Inicializar columnas
        let xInicial = margenInicial
        for (let i = 0; i < numColumnas; i++) {
            columnas.push({
                x: xInicial,
                altura: margenInicial,
                anchoMax: 0
            })
            // Dejar espacio para la columna más ancha posible
            xInicial += 600 // Ancho máximo estimado por columna
        }

        // Colocar cada panel en la columna más corta
        paneles.value.forEach((panel) => {
            // Encontrar la columna con menor altura
            let columnaMinIndex = 0
            let alturaMinima = columnas[0].altura

            for (let i = 1; i < columnas.length; i++) {
                if (columnas[i].altura < alturaMinima) {
                    alturaMinima = columnas[i].altura
                    columnaMinIndex = i
                }
            }

            const columnaSeleccionada = columnas[columnaMinIndex]

            // Posicionar el panel
            panel.posicion = {
                x: columnaSeleccionada.x,
                y: columnaSeleccionada.altura
            }

            // Actualizar información de la columna
            columnaSeleccionada.altura += panel.tamaño.height + padding
            columnaSeleccionada.anchoMax = Math.max(
                columnaSeleccionada.anchoMax,
                panel.tamaño.width
            )
        })

        // Ajustar las posiciones X para evitar solapamientos
        let xAcumulada = margenInicial
        columnas.forEach((columna, index) => {
            if (index > 0) {
                xAcumulada += columnas[index - 1].anchoMax + padding
            }

            // Actualizar todos los paneles de esta columna
            paneles.value.forEach((panel) => {
                if (panel.posicion.x === columna.x) {
                    panel.posicion.x = xAcumulada
                }
            })

            columna.x = xAcumulada
        })
    }

    /**
     * Organiza los paneles en una cuadrícula compacta
     * Agrupa paneles similares en tamaño para mejor aprovechamiento del espacio
     */
    const autoOrganizarCompacto = () => {
        if (paneles.value.length === 0) return

        const padding = 20
        const margenInicial = 20

        // Ordenar paneles por altura (de menor a mayor) para mejor empaquetado
        const panelesOrdenados = [...paneles.value].sort(
            (a, b) => a.tamaño.height - b.tamaño.height
        )

        interface Fila {
            paneles: Panel[]
            y: number
            alturaMaxima: number
            anchoTotal: number
        }

        const filas: Fila[] = []
        const anchoMaximo = 1400

        panelesOrdenados.forEach((panel) => {
            let filaColocada = false

            // Intentar colocar en una fila existente
            for (const fila of filas) {
                const anchoNecesario = fila.anchoTotal + panel.tamaño.width + padding

                if (anchoNecesario <= anchoMaximo) {
                    fila.paneles.push(panel)
                    fila.anchoTotal = anchoNecesario
                    fila.alturaMaxima = Math.max(fila.alturaMaxima, panel.tamaño.height)
                    filaColocada = true
                    break
                }
            }

            // Si no cabe en ninguna fila, crear una nueva
            if (!filaColocada) {
                filas.push({
                    paneles: [panel],
                    y: 0, // Se calculará después
                    alturaMaxima: panel.tamaño.height,
                    anchoTotal: panel.tamaño.width
                })
            }
        })

        // Calcular posiciones Y de cada fila
        let yActual = margenInicial
        filas.forEach((fila) => {
            fila.y = yActual
            yActual += fila.alturaMaxima + padding
        })

        // Posicionar paneles dentro de sus filas
        filas.forEach((fila) => {
            let xActual = margenInicial

            fila.paneles.forEach((panel) => {
                // Centrar verticalmente en la fila
                const offsetY = (fila.alturaMaxima - panel.tamaño.height) / 2

                panel.posicion = {
                    x: xActual,
                    y: fila.y + offsetY
                }

                xActual += panel.tamaño.width + padding
            })
        })
    }

    /**
     * Exporta la configuración de todos los paneles
     */
    const exportarPaneles = () => {
        return JSON.stringify(paneles.value, null, 2)
    }

    /**
     * Importa una configuración de paneles
     */
    const importarPaneles = (json: string) => {
        try {
            const panelesImportados = JSON.parse(json) as Panel[]
            paneles.value = panelesImportados

            const maxZ = Math.max(...panelesImportados.map(p => p.zIndex), 0)
            maxZIndex.value = maxZ + 1
        } catch (error) {
            console.error('Error al importar paneles:', error)
        }
    }

    return {
        paneles,
        totalPaneles,
        agregarPanel,
        eliminarPanel,
        duplicarPanel,
        actualizarPanel,
        actualizarPosicion,
        actualizarTamano,
        activarPanel,
        desactivarTodos,
        limpiarTodos,
        autoOrganizarPaneles,
        autoOrganizarMasonry,
        autoOrganizarCompacto,
        exportarPaneles,
        importarPaneles
    }
}