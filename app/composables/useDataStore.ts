import { ref, computed } from 'vue'

/**
 * Tipos para el Data Store
 */
export interface ConjuntoDatos {
    id: string
    nombre: string
    tipo: 'grafico' | 'tabla' | 'lista' | 'manual'
    panelOrigenId?: string
    fechaCreacion: Date
    datos: any
    metadata?: {
        descripcion?: string
        etiquetas?: string[]
        unidad?: string
    }
}

export interface EstadisticasCalculadas {
    suma?: number
    promedio?: number
    maximo?: number
    minimo?: number
    conteo?: number
    mediana?: number
    desviacionEstandar?: number
}

// Store global (singleton)
const conjuntosDatos = ref<ConjuntoDatos[]>([])
const cargandoDatos = ref(false)

/**
 * Composable para gestión global de datos compartidos
 */
export function useDataStore() {
    /**
     * Agrega un nuevo conjunto de datos al store
     */
    const agregarConjuntoDatos = (
        nombre: string,
        tipo: ConjuntoDatos['tipo'],
        datos: any,
        metadata?: ConjuntoDatos['metadata'],
        panelOrigenId?: string
    ): ConjuntoDatos => {
        const nuevoConjunto: ConjuntoDatos = {
            id: `dataset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            nombre,
            tipo,
            panelOrigenId,
            fechaCreacion: new Date(),
            datos,
            metadata
        }

        conjuntosDatos.value.push(nuevoConjunto)
        guardarEnLocalStorage()

        return nuevoConjunto
    }

    /**
     * Actualiza un conjunto de datos existente
     */
    const actualizarConjuntoDatos = (id: string, datos: any, metadata?: ConjuntoDatos['metadata']) => {
        const index = conjuntosDatos.value.findIndex(c => c.id === id)
        if (index !== -1) {
            conjuntosDatos.value[index] = {
                ...conjuntosDatos.value[index],
                datos,
                metadata: metadata || conjuntosDatos.value[index].metadata
            }
            guardarEnLocalStorage()
        }
    }

    /**
     * Elimina un conjunto de datos
     */
    const eliminarConjuntoDatos = (id: string) => {
        conjuntosDatos.value = conjuntosDatos.value.filter(c => c.id !== id)
        guardarEnLocalStorage()
    }

    /**
     * Obtiene un conjunto de datos por ID
     */
    const obtenerConjuntoDatos = (id: string): ConjuntoDatos | undefined => {
        return conjuntosDatos.value.find(c => c.id === id)
    }

    /**
     * Obtiene conjuntos de datos por tipo
     */
    const obtenerPorTipo = (tipo: ConjuntoDatos['tipo']): ConjuntoDatos[] => {
        return conjuntosDatos.value.filter(c => c.tipo === tipo)
    }

    /**
     * Calcula estadísticas de un conjunto de datos numéricos
     */
    const calcularEstadisticas = (conjuntoId: string, campoNumerico?: string): EstadisticasCalculadas | null => {
        const conjunto = obtenerConjuntoDatos(conjuntoId)
        if (!conjunto) return null

        let valores: number[] = []

        // Extraer valores numéricos según el tipo de datos
        if (conjunto.tipo === 'grafico') {
            // Para gráficos, extraer valores de un campo específico
            if (campoNumerico && Array.isArray(conjunto.datos.datos)) {
                valores = conjunto.datos.datos
                    .map((item: any) => Number(item[campoNumerico]))
                    .filter((v: number) => !isNaN(v))
            }
        } else if (conjunto.tipo === 'tabla') {
            // Para tablas, extraer valores de una columna específica
            if (campoNumerico && Array.isArray(conjunto.datos.filas)) {
                valores = conjunto.datos.filas
                    .map((fila: any) => Number(fila[campoNumerico]))
                    .filter((v: number) => !isNaN(v))
            }
        } else if (Array.isArray(conjunto.datos)) {
            // Para arrays directos
            valores = conjunto.datos.map(Number).filter((v: number) => !isNaN(v))
        }

        if (valores.length === 0) return null

        // Calcular estadísticas
        const suma = valores.reduce((acc, val) => acc + val, 0)
        const promedio = suma / valores.length
        const maximo = Math.max(...valores)
        const minimo = Math.min(...valores)
        const conteo = valores.length

        // Mediana
        const valoresOrdenados = [...valores].sort((a, b) => a - b)
        const medio = Math.floor(valoresOrdenados.length / 2)
        const mediana = valoresOrdenados.length % 2 === 0
            ? (valoresOrdenados[medio - 1] + valoresOrdenados[medio]) / 2
            : valoresOrdenados[medio]

        // Desviación estándar
        const varianza = valores.reduce((acc, val) => acc + Math.pow(val - promedio, 2), 0) / valores.length
        const desviacionEstandar = Math.sqrt(varianza)

        return {
            suma,
            promedio,
            maximo,
            minimo,
            conteo,
            mediana,
            desviacionEstandar
        }
    }

    /**
     * Obtiene los campos numéricos disponibles de un conjunto de datos
     */
    const obtenerCamposNumericos = (conjuntoId: string): string[] => {
        const conjunto = obtenerConjuntoDatos(conjuntoId)
        if (!conjunto) return []

        const campos: string[] = []

        if (conjunto.tipo === 'grafico' && conjunto.datos.series) {
            campos.push(...conjunto.datos.series.map((s: any) => s.dataKey))
        } else if (conjunto.tipo === 'tabla' && conjunto.datos.columnas) {
            campos.push(...conjunto.datos.columnas
                .filter((c: any) => c.tipo === 'texto')
                .map((c: any) => c.key))
        }

        return campos
    }

    /**
     * Formatea un valor numérico según preferencias
     */
    const formatearValor = (
        valor: number,
        formato: 'number' | 'currency' | 'percent' | 'compact' = 'number',
        decimales: number = 2
    ): string => {
        if (isNaN(valor)) return '0'

        switch (formato) {
            case 'currency':
                return new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    minimumFractionDigits: decimales,
                    maximumFractionDigits: decimales
                }).format(valor)

            case 'percent':
                return new Intl.NumberFormat('es-MX', {
                    style: 'percent',
                    minimumFractionDigits: decimales,
                    maximumFractionDigits: decimales
                }).format(valor / 100)

            case 'compact':
                if (valor >= 1000000) return `${(valor / 1000000).toFixed(1)}M`
                if (valor >= 1000) return `${(valor / 1000).toFixed(1)}K`
                return valor.toFixed(decimales)

            default:
                return new Intl.NumberFormat('es-MX', {
                    minimumFractionDigits: decimales,
                    maximumFractionDigits: decimales
                }).format(valor)
        }
    }

    /**
     * Guarda en localStorage
     */
    const guardarEnLocalStorage = () => {
        try {
            localStorage.setItem('dashboard-datasets', JSON.stringify(conjuntosDatos.value))
        } catch (e) {
            console.error('Error al guardar datos:', e)
        }
    }

    /**
     * Carga desde localStorage
     */
    const cargarDesdeLocalStorage = () => {
        try {
            cargandoDatos.value = true
            const datos = localStorage.getItem('dashboard-datasets')
            if (datos) {
                const parsed = JSON.parse(datos)
                conjuntosDatos.value = parsed.map((c: any) => ({
                    ...c,
                    fechaCreacion: new Date(c.fechaCreacion)
                }))
            }
        } catch (e) {
            console.error('Error al cargar datos:', e)
        } finally {
            cargandoDatos.value = false
        }
    }

    /**
     * Limpia todos los datos
     */
    const limpiarTodo = () => {
        conjuntosDatos.value = []
        localStorage.removeItem('dashboard-datasets')
    }

    // Computed
    const totalConjuntos = computed(() => conjuntosDatos.value.length)

    const conjuntosPorTipo = computed(() => {
        return {
            grafico: conjuntosDatos.value.filter(c => c.tipo === 'grafico').length,
            tabla: conjuntosDatos.value.filter(c => c.tipo === 'tabla').length,
            lista: conjuntosDatos.value.filter(c => c.tipo === 'lista').length,
            manual: conjuntosDatos.value.filter(c => c.tipo === 'manual').length
        }
    })

    return {
        // Estado
        conjuntosDatos: computed(() => conjuntosDatos.value),
        cargandoDatos: computed(() => cargandoDatos.value),
        totalConjuntos,
        conjuntosPorTipo,

        // Métodos CRUD
        agregarConjuntoDatos,
        actualizarConjuntoDatos,
        eliminarConjuntoDatos,
        obtenerConjuntoDatos,
        obtenerPorTipo,

        // Métodos de análisis
        calcularEstadisticas,
        obtenerCamposNumericos,
        formatearValor,

        // Persistencia
        guardarEnLocalStorage,
        cargarDesdeLocalStorage,
        limpiarTodo
    }
}