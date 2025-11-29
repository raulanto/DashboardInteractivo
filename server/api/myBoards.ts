import { defineEventHandler } from 'h3'

interface SavedBoard {
    id: string
    title: string
    description: string
    icon: string
    color: string
    createdAt: string
    panels: any[]
}

export default defineEventHandler(() => {
    const boards: SavedBoard[] = [
        // --- DASHBOARD EJECUTIVO ---
        {
            id: 'board-executive',
            title: 'Resumen Ejecutivo',
            description: 'KPIs principales, rendimiento financiero y métricas de usuarios activos.',
            icon: 'i-heroicons-presentation-chart-line',
            color: 'blue',
            createdAt: '2024-11-28',
            panels: [
                {
                    id: 'p-exec-1',
                    tipo: 'estadistica',
                    titulo: 'Ingresos Totales',
                    posicion: { x: 50, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 1,
                    activo: false,
                    data: {
                        valor: '$1.2M',
                        subtitulo: 'Vs mes anterior (+12%)',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-exec-2',
                    tipo: 'estadistica',
                    titulo: 'Usuarios Activos',
                    posicion: { x: 350, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 2,
                    activo: false,
                    data: {
                        valor: '142K',
                        subtitulo: 'Esta semana (+8%)',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-exec-3',
                    tipo: 'estadistica',
                    titulo: 'Tasa de Conversión',
                    posicion: { x: 650, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 3,
                    activo: false,
                    data: {
                        valor: '3.2%',
                        subtitulo: 'Último mes (-0.5%)',
                        tendencia: 'down'
                    }
                },
                {
                    id: 'p-exec-4',
                    tipo: 'grafico',
                    titulo: 'Ingresos vs Egresos 2024',
                    posicion: { x: 50, y: 260 },
                    tamaño: { width: 580, height: 400 },
                    zIndex: 4,
                    activo: false,
                    data: {
                        datasetId: 'global-finance-2024',
                        curveType: 'monotoneX',
                        legendPosition: 'bottom'
                    }
                },
                {
                    id: 'p-exec-5',
                    tipo: 'grafico',
                    titulo: 'Usuarios por Plataforma',
                    posicion: { x: 650, y: 260 },
                    tamaño: { width: 580, height: 400 },
                    zIndex: 5,
                    activo: false,
                    data: {
                        datasetId: 'global-users-active',
                        curveType: 'natural',
                        legendPosition: 'top'
                    }
                }
            ]
        },

        // --- DASHBOARD DE VENTAS ---
        {
            id: 'board-sales',
            title: 'Ventas y Revenue',
            description: 'Análisis de ventas por región, transacciones recientes y top clientes.',
            icon: 'i-heroicons-chart-bar',
            color: 'green',
            createdAt: '2024-11-27',
            panels: [
                {
                    id: 'p-sales-1',
                    tipo: 'estadistica',
                    titulo: 'Revenue Total',
                    posicion: { x: 50, y: 50 },
                    tamaño: { width: 300, height: 180 },
                    zIndex: 1,
                    activo: false,
                    data: {
                        valor: '$2.8M',
                        subtitulo: 'Año actual',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-sales-2',
                    tipo: 'estadistica',
                    titulo: 'Transacciones',
                    posicion: { x: 370, y: 50 },
                    tamaño: { width: 300, height: 180 },
                    zIndex: 2,
                    activo: false,
                    data: {
                        valor: '12,543',
                        subtitulo: 'Este mes (+15%)',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-sales-3',
                    tipo: 'grafico',
                    titulo: 'Ventas por Región - Tendencia Semanal',
                    posicion: { x: 50, y: 260 },
                    tamaño: { width: 900, height: 420 },
                    zIndex: 3,
                    activo: false,
                    data: {
                        datasetId: 'global-sales-region',
                        curveType: 'monotoneX',
                        legendPosition: 'right'
                    }
                },
                {
                    id: 'p-sales-4',
                    tipo: 'tabla',
                    titulo: 'Transacciones Recientes',
                    posicion: { x: 50, y: 710 },
                    tamaño: { width: 1200, height: 400 },
                    zIndex: 4,
                    activo: false,
                    data: {
                        datasetId: 'global-transactions',
                        maxRows: 15
                    }
                }
            ]
        },

        // --- DASHBOARD DE INVENTARIO ---
        {
            id: 'board-inventory',
            title: 'Gestión de Inventario',
            description: 'Control de stock, productos críticos y alertas de reabastecimiento.',
            icon: 'i-heroicons-cube',
            color: 'amber',
            createdAt: '2024-11-25',
            panels: [
                {
                    id: 'p-inv-1',
                    tipo: 'estadistica',
                    titulo: 'Total SKUs',
                    posicion: { x: 50, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 1,
                    activo: false,
                    data: {
                        valor: '200',
                        subtitulo: 'Productos activos'
                    }
                },
                {
                    id: 'p-inv-2',
                    tipo: 'estadistica',
                    titulo: 'Bajo Stock',
                    posicion: { x: 350, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 2,
                    activo: false,
                    data: {
                        valor: '23',
                        subtitulo: 'Requieren atención',
                        tendencia: 'warning'
                    }
                },
                {
                    id: 'p-inv-3',
                    tipo: 'estadistica',
                    titulo: 'Agotados',
                    posicion: { x: 650, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 3,
                    activo: false,
                    data: {
                        valor: '8',
                        subtitulo: 'Sin stock disponible',
                        tendencia: 'down'
                    }
                },
                {
                    id: 'p-inv-4',
                    tipo: 'tabla',
                    titulo: 'Inventario Maestro - Almacén Central',
                    posicion: { x: 50, y: 260 },
                    tamaño: { width: 1250, height: 550 },
                    zIndex: 4,
                    activo: false,
                    data: {
                        datasetId: 'global-inventory-master',
                        maxRows: 20
                    }
                }
            ]
        },

        // --- DASHBOARD DE RECURSOS HUMANOS ---
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
                    posicion: { x: 50, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 1,
                    activo: false,
                    data: {
                        valor: '150',
                        subtitulo: 'Activos (+5 este mes)'
                    }
                },
                {
                    id: 'p-hr-2',
                    tipo: 'estadistica',
                    titulo: 'Nuevas Contrataciones',
                    posicion: { x: 350, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 2,
                    activo: false,
                    data: {
                        valor: '8',
                        subtitulo: 'Último trimestre',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-hr-3',
                    tipo: 'estadistica',
                    titulo: 'Tasa de Retención',
                    posicion: { x: 650, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 3,
                    activo: false,
                    data: {
                        valor: '94%',
                        subtitulo: 'Anual',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-hr-4',
                    tipo: 'tabla',
                    titulo: 'Directorio de Empleados',
                    posicion: { x: 50, y: 260 },
                    tamaño: { width: 1300, height: 500 },
                    zIndex: 4,
                    activo: false,
                    data: {
                        datasetId: 'global-hr-employees',
                        maxRows: 18
                    }
                }
            ]
        },

        // --- DASHBOARD DE INFRAESTRUCTURA ---
        {
            id: 'board-infra',
            title: 'Monitoreo de Infraestructura',
            description: 'Estado de servidores, performance del sistema y métricas de uptime.',
            icon: 'i-heroicons-server-stack',
            color: 'orange',
            createdAt: '2024-11-15',
            panels: [
                {
                    id: 'p-infra-1',
                    tipo: 'estadistica',
                    titulo: 'Uptime',
                    posicion: { x: 50, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 1,
                    activo: false,
                    data: {
                        valor: '99.98%',
                        subtitulo: 'Últimos 30 días',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-infra-2',
                    tipo: 'estadistica',
                    titulo: 'Latencia Promedio',
                    posicion: { x: 350, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 2,
                    activo: false,
                    data: {
                        valor: '42ms',
                        subtitulo: 'API Response Time'
                    }
                },
                {
                    id: 'p-infra-3',
                    tipo: 'estadistica',
                    titulo: 'Requests/min',
                    posicion: { x: 650, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 3,
                    activo: false,
                    data: {
                        valor: '8.5K',
                        subtitulo: 'Promedio actual'
                    }
                },
                {
                    id: 'p-infra-4',
                    tipo: 'grafico',
                    titulo: 'Métricas de Sistema - Últimas 24 Horas',
                    posicion: { x: 50, y: 260 },
                    tamaño: { width: 1100, height: 450 },
                    zIndex: 4,
                    activo: false,
                    data: {
                        datasetId: 'global-system-performance',
                        curveType: 'monotoneX',
                        legendPosition: 'top'
                    }
                }
            ]
        },

        // --- DASHBOARD DE CLIENTES ---
        {
            id: 'board-customers',
            title: 'Gestión de Clientes',
            description: 'Base de clientes, segmentación y métricas de satisfacción.',
            icon: 'i-heroicons-users',
            color: 'purple',
            createdAt: '2024-11-18',
            panels: [
                {
                    id: 'p-cust-1',
                    tipo: 'estadistica',
                    titulo: 'Total Clientes',
                    posicion: { x: 50, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 1,
                    activo: false,
                    data: {
                        valor: '300',
                        subtitulo: 'Clientes activos'
                    }
                },
                {
                    id: 'p-cust-2',
                    tipo: 'estadistica',
                    titulo: 'NPS Score',
                    posicion: { x: 350, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 2,
                    activo: false,
                    data: {
                        valor: '68',
                        subtitulo: 'Último mes (+5)',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-cust-3',
                    tipo: 'estadistica',
                    titulo: 'CSAT',
                    posicion: { x: 650, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 3,
                    activo: false,
                    data: {
                        valor: '82%',
                        subtitulo: 'Satisfacción general',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-cust-4',
                    tipo: 'grafico',
                    titulo: 'NPS y Satisfacción - Tendencia Mensual',
                    posicion: { x: 50, y: 260 },
                    tamaño: { width: 600, height: 380 },
                    zIndex: 4,
                    activo: false,
                    data: {
                        datasetId: 'global-customer-satisfaction',
                        curveType: 'natural',
                        legendPosition: 'bottom'
                    }
                },
                {
                    id: 'p-cust-5',
                    tipo: 'tabla',
                    titulo: 'Base de Datos de Clientes',
                    posicion: { x: 50, y: 670 },
                    tamaño: { width: 1400, height: 450 },
                    zIndex: 5,
                    activo: false,
                    data: {
                        datasetId: 'global-customers',
                        maxRows: 15
                    }
                }
            ]
        },

        // --- DASHBOARD DE MARKETING ---
        {
            id: 'board-marketing',
            title: 'Marketing y Tráfico',
            description: 'Análisis de tráfico web, conversiones y patrones de uso.',
            icon: 'i-heroicons-megaphone',
            color: 'pink',
            createdAt: '2024-11-22',
            panels: [
                {
                    id: 'p-mkt-1',
                    tipo: 'estadistica',
                    titulo: 'Visitas Totales',
                    posicion: { x: 50, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 1,
                    activo: false,
                    data: {
                        valor: '485K',
                        subtitulo: 'Este mes (+22%)',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-mkt-2',
                    tipo: 'estadistica',
                    titulo: 'Conversión',
                    posicion: { x: 350, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 2,
                    activo: false,
                    data: {
                        valor: '4.2%',
                        subtitulo: 'Tasa promedio',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-mkt-3',
                    tipo: 'estadistica',
                    titulo: 'Bounce Rate',
                    posicion: { x: 650, y: 50 },
                    tamaño: { width: 280, height: 180 },
                    zIndex: 3,
                    activo: false,
                    data: {
                        valor: '42%',
                        subtitulo: 'Promedio general'
                    }
                },
                {
                    id: 'p-mkt-4',
                    tipo: 'grafico',
                    titulo: 'Tráfico Web - Patrón de 24 Horas',
                    posicion: { x: 50, y: 260 },
                    tamaño: { width: 880, height: 420 },
                    zIndex: 4,
                    activo: false,
                    data: {
                        datasetId: 'global-traffic-hourly',
                        curveType: 'monotoneX',
                        legendPosition: 'top'
                    }
                },
                {
                    id: 'p-mkt-5',
                    tipo: 'grafico',
                    titulo: 'Usuarios Activos - Últimos 90 Días',
                    posicion: { x: 50, y: 710 },
                    tamaño: { width: 880, height: 380 },
                    zIndex: 5,
                    activo: false,
                    data: {
                        datasetId: 'global-users-active',
                        curveType: 'natural',
                        legendPosition: 'bottom'
                    }
                }
            ]
        },

        // --- DASHBOARD DE FINANZAS ---
        {
            id: 'board-finance',
            title: 'Análisis Financiero',
            description: 'Reporting financiero, flujo de caja y proyecciones.',
            icon: 'i-heroicons-currency-dollar',
            color: 'teal',
            createdAt: '2024-11-10',
            panels: [
                {
                    id: 'p-fin-1',
                    tipo: 'estadistica',
                    titulo: 'Revenue YTD',
                    posicion: { x: 50, y: 50 },
                    tamaño: { width: 300, height: 180 },
                    zIndex: 1,
                    activo: false,
                    data: {
                        valor: '$3.6M',
                        subtitulo: 'Año a la fecha',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-fin-2',
                    tipo: 'estadistica',
                    titulo: 'Margen Bruto',
                    posicion: { x: 370, y: 50 },
                    tamaño: { width: 300, height: 180 },
                    zIndex: 2,
                    activo: false,
                    data: {
                        valor: '38%',
                        subtitulo: 'Promedio anual'
                    }
                },
                {
                    id: 'p-fin-3',
                    tipo: 'estadistica',
                    titulo: 'EBITDA',
                    posicion: { x: 690, y: 50 },
                    tamaño: { width: 300, height: 180 },
                    zIndex: 3,
                    activo: false,
                    data: {
                        valor: '$842K',
                        subtitulo: 'Último trimestre (+18%)',
                        tendencia: 'up'
                    }
                },
                {
                    id: 'p-fin-4',
                    tipo: 'grafico',
                    titulo: 'Rendimiento Financiero - Ingresos vs Egresos 2024',
                    posicion: { x: 50, y: 260 },
                    tamaño: { width: 940, height: 450 },
                    zIndex: 4,
                    activo: false,
                    data: {
                        datasetId: 'global-finance-2024',
                        curveType: 'monotoneX',
                        legendPosition: 'bottom'
                    }
                },
                {
                    id: 'p-fin-5',
                    tipo: 'tabla',
                    titulo: 'Transacciones Recientes - Flujo de Caja',
                    posicion: { x: 50, y: 740 },
                    tamaño: { width: 940, height: 380 },
                    zIndex: 5,
                    activo: false,
                    data: {
                        datasetId: 'global-transactions',
                        maxRows: 12
                    }
                }
            ]
        }
    ]

    return boards
})