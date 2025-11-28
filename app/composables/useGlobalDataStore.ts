import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import type { GlobalDataset } from '~/types/globalData'

const _useGlobalDataStore = () => {

    // Estado reactivo global
    const datasets = ref<GlobalDataset[]>([])

    /**
     * Agrega o actualiza un dataset en el store.
     * Usa desestructuración para asegurar que Vue detecte el cambio de objeto.
     */
    const agregarDataset = (dataset: GlobalDataset) => {
        const index = datasets.value.findIndex(d => d.id === dataset.id)

        if (index !== -1) {
            // Reemplazar existente: Usamos spread operator para crear una nueva referencia de objeto
            // Esto ayuda a que los watchers profundos detecten el cambio
            datasets.value.splice(index, 1, { ...dataset })
        } else {
            // Agregar nuevo
            datasets.value.push({ ...dataset })
        }
    }

    /**
     * Obtiene un dataset por su ID.
     * Nota: Para reactividad total en componentes, se recomienda usar datasets.value.find()
     * dentro de un computed en el componente.
     */
    const obtenerDatasetPorId = (id: string): GlobalDataset | undefined => {
        return datasets.value.find(d => d.id === id)
    }

    /**
     * Obtiene un dataset por su nombre.
     */
    const obtenerDatasetPorNombre = (nombre: string): GlobalDataset | undefined => {
        return datasets.value.find(d => d.nombre === nombre)
    }

    /**
     * Elimina un dataset por su ID.
     */
    const eliminarDataset = (id: string) => {
        datasets.value = datasets.value.filter(d => d.id !== id)
    }

    // Datos de ejemplo iniciales (Solo se ejecutan una vez al iniciar la app)
    if (datasets.value.length === 0) {
        agregarDataset({
            id: 'global-1',
            nombre: 'Ventas Mensuales - Q3',
            tipo: 'grafico',
            columnas: ['date', 'Ingresos', 'Gastos'],
            datos: [
                { date: '2024-07-01', Ingresos: 500, Gastos: 150 },
                { date: '2024-08-01', Ingresos: 750, Gastos: 200 },
                { date: '2024-09-01', Ingresos: 600, Gastos: 180 },
                { date: '2024-10-01', Ingresos: 820, Gastos: 240 },
            ]
        })
        agregarDataset({
            id: 'global-2',
            nombre: 'Inventario de Productos',
            tipo: 'tabla',
            columnas: ['id', 'Nombre', 'Stock', 'Proveedor', 'Estado'],
            datos: [
                { id: 101, Nombre: 'Laptop X1', Stock: 45, Proveedor: 'TechSol', Estado: 'Activo' },
                { id: 102, Nombre: 'Mouse Gamer', Stock: 120, Proveedor: 'LogiBest', Estado: 'Activo' },
                { id: 103, Nombre: 'Monitor Ultra', Stock: 15, Proveedor: 'Visuals', Estado: 'Inactivo' },
                { id: 104, Nombre: 'Teclado Mecánico', Stock: 60, Proveedor: 'TypeMaster', Estado: 'Activo' },
            ]
        })
    }

    return {
        datasets,
        agregarDataset,
        obtenerDatasetPorId,
        obtenerDatasetPorNombre,
        eliminarDataset
    }
}

// Exportar como composable compartido para que el estado sea verdaderamente global
export const useGlobalDataStore = createSharedComposable(_useGlobalDataStore)