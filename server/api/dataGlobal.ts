import { defineEventHandler } from 'h3'

// Tipos para asegurar consistencia (puedes moverlos a un archivo compartido si prefieres)
interface GlobalDataset {
    id: string
    nombre: string
    tipo: 'grafico' | 'tabla' | 'estadistica'
    columnas: string[]
    datos: any[]
}

export default defineEventHandler(() => {

    const datasets: GlobalDataset[] = [

        {
            id: 'global-finance-2024',
            nombre: 'Ingresos vs Egresos 2024',
            tipo: 'grafico',
            columnas: ['date', 'Ingresos', 'Egresos', 'Beneficio'],
            datos: Array.from({ length: 12 }, (_, i) => {
                const mes = i + 1
                const ingresos = Math.floor(Math.random() * 50000) + 20000
                const egresos = Math.floor(ingresos * (Math.random() * 0.6 + 0.2))
                return {
                    date: `2024-${mes.toString().padStart(2, '0')}-01`,
                    Ingresos: ingresos,
                    Egresos: egresos,
                    Beneficio: ingresos - egresos
                }
            })
        },

        {
            id: 'global-users-active',
            nombre: 'Usuarios Activos por Plataforma',
            tipo: 'grafico',
            columnas: ['date', 'Web', 'Mobile', 'Desktop'],
            datos: Array.from({ length: 30 }, (_, i) => {
                const date = new Date(2024, 0, 1)
                date.setDate(date.getDate() + i)
                return {
                    date: date.toISOString().split('T')[0],
                    Web: Math.floor(Math.random() * 1000) + 500,
                    Mobile: Math.floor(Math.random() * 2000) + 1000,
                    Desktop: Math.floor(Math.random() * 500) + 100
                }
            })
        },

        {
            id: 'global-inventory-master',
            nombre: 'Inventario Maestro - Almacén Central',
            tipo: 'tabla',
            columnas: ['SKU', 'Producto', 'Categoría', 'Stock', 'Precio', 'Estado'],
            datos: Array.from({ length: 50 }, (_, i) => {
                const categorias = ['Electrónica', 'Muebles', 'Oficina', 'Accesorios']
                const estados = ['En Stock', 'Bajo Stock', 'Agotado', 'Descontinuado']
                const cat = categorias[Math.floor(Math.random() * categorias.length)]
                const stock = Math.floor(Math.random() * 200)

                let estado = 'En Stock'
                if (stock === 0) estado = 'Agotado'
                else if (stock < 20) estado = 'Bajo Stock'

                return {
                    SKU: `PROD-${1000 + i}`,
                    Producto: `${cat} Item ${i + 1}`,
                    Categoría: cat,
                    Stock: stock,
                    Precio: `$${(Math.random() * 100 + 10).toFixed(2)}`,
                    Estado: estado
                }
            })
        },

        {
            id: 'global-hr-employees',
            nombre: 'Directorio de Empleados',
            tipo: 'tabla',
            columnas: ['ID', 'Nombre', 'Departamento', 'Rol', 'Ubicación', 'Status'],
            datos: [
                { ID: 'E001', Nombre: 'Ana García', Departamento: 'Ingeniería', Rol: 'Senior Dev', Ubicación: 'Remoto', Status: 'Activo' },
                { ID: 'E002', Nombre: 'Carlos Ruiz', Departamento: 'Ventas', Rol: 'Manager', Ubicación: 'Madrid', Status: 'Activo' },
                { ID: 'E003', Nombre: 'Lucía Méndez', Departamento: 'Marketing', Rol: 'Designer', Ubicación: 'Barcelona', Status: 'Permiso' },
                { ID: 'E004', Nombre: 'Miguel Torres', Departamento: 'Ingeniería', Rol: 'Junior Dev', Ubicación: 'Remoto', Status: 'Activo' },
                { ID: 'E005', Nombre: 'Sofía L.', Departamento: 'RRHH', Rol: 'Recruiter', Ubicación: 'Madrid', Status: 'Activo' },

            ]
        }
    ]

    return datasets
})