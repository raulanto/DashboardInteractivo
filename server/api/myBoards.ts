import { defineEventHandler } from 'h3'

// Estructura de un Tablero Guardado
interface SavedBoard {
    id: string
    title: string
    description: string
    icon: string
    color: string
    createdAt: string
    panels: any[] // Aquí iría el array de objetos Panel
}

export default defineEventHandler(() => {
    // Simulamos una base de datos de tableros
    const boards: SavedBoard[] = [
        {
            id: 'board-executive',
            title: 'Resumen Ejecutivo',
            description: 'KPIs principales, rendimiento de ventas mensuales y alertas de sistema.',
            icon: 'i-heroicons-presentation-chart-line',
            color: 'blue',
            createdAt: '2024-11-28',
            panels: [
                // 1. Panel de Estadística (KPI)
                {
                    id: 'p-1',
                    tipo: 'estadistica',
                    titulo: 'Ingresos Totales',
                    posicion: { x: 50, y: 50 },
                    tamaño: { width: 300, height: 200 },
                    zIndex: 1,
                    activo: false,
                    data: {
                        valor: '$1.2M',
                        subtitulo: 'Vs mes anterior (+12%)'
                    }
                },
                // 2. Panel de Gráfico (Ventas)
                {
                    id: 'p-2',
                    tipo: 'grafico',
                    titulo: 'Tendencia de Ventas Q3',
                    posicion: { x: 370, y: 50 },
                    tamaño: { width: 500, height: 350 },
                    zIndex: 2,
                    activo: false,
                    data: {
                        titulo: 'Ventas Mensuales',
                        curveType: 'monotoneX',
                        legendPosition: 'top',
                        // Datos locales para el ejemplo (podría ser un datasetId)
                        datos: [
                            { date: '2024-07-01', Ventas: 4000, Costos: 2400 },
                            { date: '2024-08-01', Ventas: 3000, Costos: 1398 },
                            { date: '2024-09-01', Ventas: 2000, Costos: 9800 },
                            { date: '2024-10-01', Ventas: 2780, Costos: 3908 }
                        ],
                        series: [
                            { key: 'Ventas', name: 'Ventas Netas', color: '#3b82f6' },
                            { key: 'Costos', name: 'Costos Operativos', color: '#ef4444' }
                        ]
                    }
                },
                // 3. Panel de Tabla (Inventario)
                {
                    id: 'p-3',
                    tipo: 'tabla',
                    titulo: 'Estado de Inventario',
                    posicion: { x: 50, y: 420 },
                    tamaño: { width: 820, height: 300 },
                    zIndex: 3,
                    activo: false,
                    data: {
                        columnas: ['Producto', 'SKU', 'Stock', 'Estado'],
                        filas: [
                            ['Laptop Pro 14"', 'LP-2024', '45', 'Activo'],
                            ['Monitor 4K', 'MN-400', '12', 'Bajo Stock'],
                            ['Teclado Mecánico', 'KB-99', '0', 'Agotado'],
                            ['Mouse Ergo', 'MS-01', '120', 'Activo']
                        ]
                    }
                }
            ]
        },
        {
            id: 'board-rrhh',
            title: 'Recursos Humanos',
            description: 'Gestión de personal, nuevas contrataciones y métricas de retención.',
            icon: 'i-heroicons-user-group',
            color: 'emerald',
            createdAt: '2024-11-20',
            panels: [
                {
                    id: 'p-hr-1',
                    tipo: 'estadistica',
                    titulo: 'Total Empleados',
                    posicion: { x: 100, y: 100 },
                    tamaño: { width: 300, height: 200 },
                    zIndex: 1,
                    data: { valor: '142', subtitulo: 'Activos' }
                }
            ]
        },
        {
            id: 'board-infra',
            title: 'Monitoreo de Infraestructura',
            description: 'Estado de servidores, latencia de API y uso de base de datos.',
            icon: 'i-heroicons-server-stack',
            color: 'orange',
            createdAt: '2024-11-15',
            panels: []
        }
    ]

    return boards
})