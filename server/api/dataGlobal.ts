import { defineEventHandler } from 'h3'

interface GlobalDataset {
    id: string
    nombre: string
    tipo: 'grafico' | 'tabla' | 'estadistica'
    columnas: string[]
    datos: any[]
}

export default defineEventHandler(() => {
    const datasets: GlobalDataset[] = [
        // --- GRÁFICO: Rendimiento Financiero Trimestral ---
        {
            id: 'global-finance-2024',
            nombre: 'Ingresos vs Egresos 2024',
            tipo: 'grafico',
            columnas: ['date', 'Ingresos', 'Egresos', 'Beneficio', 'Proyección'],
            datos: Array.from({ length: 12 }, (_, i) => {
                const mes = i + 1
                const tendencia = 1 + (i * 0.05)
                const ingresos = Math.floor((Math.random() * 30000 + 40000) * tendencia)
                const egresos = Math.floor(ingresos * (Math.random() * 0.15 + 0.55))
                return {
                    date: `2024-${mes.toString().padStart(2, '0')}-01`,
                    Ingresos: ingresos,
                    Egresos: egresos,
                    Beneficio: ingresos - egresos,
                    Proyección: Math.floor(ingresos * 1.15)
                }
            })
        },

        // --- GRÁFICO: Usuarios Activos Diarios (90 días) ---
        {
            id: 'global-users-active',
            nombre: 'Usuarios Activos por Plataforma',
            tipo: 'grafico',
            columnas: ['date', 'Web', 'Mobile', 'Desktop', 'Tablet'],
            datos: Array.from({ length: 90 }, (_, i) => {
                const date = new Date(2024, 8, 1)
                date.setDate(date.getDate() + i)
                const esFinde = date.getDay() === 0 || date.getDay() === 6
                const factor = esFinde ? 0.7 : 1

                return {
                    date: date.toISOString().split('T')[0],
                    Web: Math.floor((Math.random() * 1500 + 800) * factor),
                    Mobile: Math.floor((Math.random() * 3000 + 2000) * factor),
                    Desktop: Math.floor((Math.random() * 600 + 300) * factor),
                    Tablet: Math.floor((Math.random() * 400 + 150) * factor)
                }
            })
        },

        // --- GRÁFICO: Ventas por Región ---
        {
            id: 'global-sales-region',
            nombre: 'Ventas por Región 2024',
            tipo: 'grafico',
            columnas: ['date', 'Norte', 'Sur', 'Este', 'Oeste', 'Centro'],
            datos: Array.from({ length: 52 }, (_, i) => {
                const semana = i + 1
                const date = new Date(2024, 0, 1)
                date.setDate(date.getDate() + (i * 7))

                return {
                    date: date.toISOString().split('T')[0],
                    Norte: Math.floor(Math.random() * 25000 + 15000),
                    Sur: Math.floor(Math.random() * 20000 + 12000),
                    Este: Math.floor(Math.random() * 30000 + 18000),
                    Oeste: Math.floor(Math.random() * 22000 + 14000),
                    Centro: Math.floor(Math.random() * 28000 + 16000)
                }
            })
        },

        // --- GRÁFICO: Tráfico Web por Hora ---
        {
            id: 'global-traffic-hourly',
            nombre: 'Tráfico Web - Patrón Diario',
            tipo: 'grafico',
            columnas: ['hora', 'Visitas', 'Conversiones', 'ReboteRate'],
            datos: Array.from({ length: 24 }, (_, i) => {
                let visitas = 1000
                if (i >= 9 && i <= 17) visitas = Math.floor(Math.random() * 3000 + 2500)
                else if (i >= 18 && i <= 22) visitas = Math.floor(Math.random() * 2000 + 1500)
                else visitas = Math.floor(Math.random() * 500 + 200)

                return {
                    hora: `${i.toString().padStart(2, '0')}:00`,
                    Visitas: visitas,
                    Conversiones: Math.floor(visitas * (Math.random() * 0.05 + 0.02)),
                    ReboteRate: Math.floor(Math.random() * 30 + 35)
                }
            })
        },

        // --- TABLA: Inventario Maestro (200 productos) ---
        {
            id: 'global-inventory-master',
            nombre: 'Inventario Maestro - Almacén Central',
            tipo: 'tabla',
            columnas: ['SKU', 'Producto', 'Categoría', 'Subcategoría', 'Stock', 'Precio', 'Proveedor', 'Estado', 'UltimaActualización'],
            datos: Array.from({ length: 200 }, (_, i) => {
                const categorias = [
                    { cat: 'Electrónica', subs: ['Computadoras', 'Smartphones', 'Accesorios', 'Audio'] },
                    { cat: 'Muebles', subs: ['Oficina', 'Hogar', 'Exterior', 'Infantil'] },
                    { cat: 'Papelería', subs: ['Escritura', 'Organización', 'Impresión', 'Arte'] },
                    { cat: 'Deportes', subs: ['Fitness', 'Outdoor', 'Natación', 'Team Sports'] },
                    { cat: 'Textil', subs: ['Ropa', 'Calzado', 'Accesorios', 'Uniformes'] }
                ]

                const proveedores = ['TechSupply SA', 'GlobalGoods Inc', 'MegaDistribuidor', 'ImportPlus', 'DirectFactory']
                const catObj = categorias[Math.floor(Math.random() * categorias.length)]
                const sub = catObj.subs[Math.floor(Math.random() * catObj.subs.length)]
                const stock = Math.floor(Math.random() * 500)

                let estado = 'En Stock'
                if (stock === 0) estado = 'Agotado'
                else if (stock < 50) estado = 'Bajo Stock'
                else if (stock > 400) estado = 'Sobrestock'

                const fecha = new Date(2024, Math.floor(Math.random() * 11), Math.floor(Math.random() * 28) + 1)

                return {
                    SKU: `${catObj.cat.substring(0, 3).toUpperCase()}-${(1000 + i).toString()}`,
                    Producto: `${catObj.cat} ${sub} Pro ${i + 1}`,
                    Categoría: catObj.cat,
                    Subcategoría: sub,
                    Stock: stock,
                    Precio: `$${(Math.random() * 500 + 10).toFixed(2)}`,
                    Proveedor: proveedores[Math.floor(Math.random() * proveedores.length)],
                    Estado: estado,
                    UltimaActualización: fecha.toISOString().split('T')[0]
                }
            })
        },

        // --- TABLA: Empleados (150 registros) ---
        {
            id: 'global-hr-employees',
            nombre: 'Directorio de Empleados',
            tipo: 'tabla',
            columnas: ['ID', 'Nombre', 'Email', 'Departamento', 'Rol', 'Ubicación', 'FechaIngreso', 'Salario', 'Status'],
            datos: Array.from({ length: 150 }, (_, i) => {
                const nombres = ['Ana', 'Carlos', 'Lucía', 'Miguel', 'Sofía', 'Diego', 'Elena', 'Javier', 'María', 'Pablo']
                const apellidos = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores']
                const departamentos = [
                    { dept: 'Ingeniería', roles: ['Senior Dev', 'Junior Dev', 'Tech Lead', 'DevOps', 'QA Engineer'] },
                    { dept: 'Ventas', roles: ['Sales Rep', 'Account Manager', 'Sales Director', 'BDR'] },
                    { dept: 'Marketing', roles: ['Designer', 'Content Writer', 'SEO Specialist', 'Marketing Manager'] },
                    { dept: 'RRHH', roles: ['Recruiter', 'HR Manager', 'Training Specialist', 'Compensation Analyst'] },
                    { dept: 'Finanzas', roles: ['Accountant', 'Financial Analyst', 'CFO', 'Auditor'] },
                    { dept: 'Operaciones', roles: ['Operations Manager', 'Logistics Coord', 'Quality Control', 'Project Manager'] }
                ]

                const ubicaciones = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Remoto', 'Bilbao', 'Málaga']
                const status = ['Activo', 'Activo', 'Activo', 'Activo', 'Permiso', 'Vacaciones']

                const deptObj = departamentos[Math.floor(Math.random() * departamentos.length)]
                const rol = deptObj.roles[Math.floor(Math.random() * deptObj.roles.length)]
                const nombre = nombres[Math.floor(Math.random() * nombres.length)]
                const apellido = apellidos[Math.floor(Math.random() * apellidos.length)]

                const año = 2018 + Math.floor(Math.random() * 7)
                const mes = Math.floor(Math.random() * 12)
                const dia = Math.floor(Math.random() * 28) + 1

                const salarioBase = {
                    'Junior Dev': 35000, 'Senior Dev': 65000, 'Tech Lead': 80000,
                    'Sales Rep': 40000, 'Account Manager': 55000,
                    'Designer': 45000, 'Marketing Manager': 60000,
                    'Recruiter': 38000, 'HR Manager': 58000,
                    'Accountant': 42000, 'Financial Analyst': 52000,
                    'Operations Manager': 62000, 'Project Manager': 58000
                }

                const salario = (salarioBase[rol as keyof typeof salarioBase] || 40000) + Math.floor(Math.random() * 10000)

                return {
                    ID: `E${(i + 1).toString().padStart(4, '0')}`,
                    Nombre: `${nombre} ${apellido}`,
                    Email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@empresa.com`,
                    Departamento: deptObj.dept,
                    Rol: rol,
                    Ubicación: ubicaciones[Math.floor(Math.random() * ubicaciones.length)],
                    FechaIngreso: `${año}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`,
                    Salario: `$${salario.toLocaleString()}`,
                    Status: status[Math.floor(Math.random() * status.length)]
                }
            })
        },

        // --- TABLA: Transacciones Recientes (500 registros) ---
        {
            id: 'global-transactions',
            nombre: 'Historial de Transacciones',
            tipo: 'tabla',
            columnas: ['TransactionID', 'Fecha', 'Cliente', 'Producto', 'Cantidad', 'Monto', 'Método', 'Estado'],
            datos: Array.from({ length: 500 }, (_, i) => {
                const clientes = ['Empresa A', 'Corporación B', 'Grupo C', 'Industrias D', 'Comercial E', 'Tech F', 'Global G', 'Nacional H']
                const productos = ['Licencia Software', 'Consultoría', 'Soporte Premium', 'Hardware', 'Capacitación', 'Mantenimiento']
                const metodos = ['Transferencia', 'Tarjeta', 'PayPal', 'Cheque', 'Crédito']
                const estados = ['Completado', 'Completado', 'Completado', 'Completado', 'Pendiente', 'Cancelado']

                const diasAtras = Math.floor(Math.random() * 180)
                const fecha = new Date()
                fecha.setDate(fecha.getDate() - diasAtras)

                const cantidad = Math.floor(Math.random() * 20) + 1
                const precioUnitario = Math.floor(Math.random() * 5000) + 100
                const monto = cantidad * precioUnitario

                return {
                    TransactionID: `TRX-${(100000 + i).toString()}`,
                    Fecha: fecha.toISOString().split('T')[0],
                    Cliente: clientes[Math.floor(Math.random() * clientes.length)],
                    Producto: productos[Math.floor(Math.random() * productos.length)],
                    Cantidad: cantidad,
                    Monto: `$${monto.toLocaleString()}`,
                    Método: metodos[Math.floor(Math.random() * metodos.length)],
                    Estado: estados[Math.floor(Math.random() * estados.length)]
                }
            })
        },

        // --- TABLA: Clientes (300 registros) ---
        {
            id: 'global-customers',
            nombre: 'Base de Datos de Clientes',
            tipo: 'tabla',
            columnas: ['CustomerID', 'NombreEmpresa', 'Contacto', 'Email', 'Teléfono', 'Ciudad', 'País', 'Segmento', 'ValorVida', 'UltimaCompra'],
            datos: Array.from({ length: 300 }, (_, i) => {
                const empresas = ['Tech', 'Solutions', 'Industries', 'Group', 'Corp', 'Global', 'Systems', 'Dynamics', 'Innovations', 'Partners']
                const ciudades = [
                    { ciudad: 'Madrid', pais: 'España' },
                    { ciudad: 'Barcelona', pais: 'España' },
                    { ciudad: 'México DF', pais: 'México' },
                    { ciudad: 'Buenos Aires', pais: 'Argentina' },
                    { ciudad: 'Santiago', pais: 'Chile' },
                    { ciudad: 'Bogotá', pais: 'Colombia' },
                    { ciudad: 'Lima', pais: 'Perú' },
                    { ciudad: 'Miami', pais: 'USA' }
                ]
                const segmentos = ['Enterprise', 'SMB', 'Startup', 'Gobierno', 'Educación']

                const nombreEmpresa = `${empresas[Math.floor(Math.random() * empresas.length)]} ${empresas[Math.floor(Math.random() * empresas.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
                const loc = ciudades[Math.floor(Math.random() * ciudades.length)]

                const diasUltimaCompra = Math.floor(Math.random() * 365)
                const fechaCompra = new Date()
                fechaCompra.setDate(fechaCompra.getDate() - diasUltimaCompra)

                return {
                    CustomerID: `CUST-${(10000 + i).toString()}`,
                    NombreEmpresa: nombreEmpresa,
                    Contacto: `Contact ${i + 1}`,
                    Email: `contact${i + 1}@${nombreEmpresa.toLowerCase().replace(/\s/g, '')}.com`,
                    Teléfono: `+${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 900000000 + 100000000)}`,
                    Ciudad: loc.ciudad,
                    País: loc.pais,
                    Segmento: segmentos[Math.floor(Math.random() * segmentos.length)],
                    ValorVida: `$${(Math.floor(Math.random() * 500000) + 50000).toLocaleString()}`,
                    UltimaCompra: fechaCompra.toISOString().split('T')[0]
                }
            })
        },

        // --- GRÁFICO: Performance del Sistema ---
        {
            id: 'global-system-performance',
            nombre: 'Métricas de Sistema - Últimas 24h',
            tipo: 'grafico',
            columnas: ['timestamp', 'CPU', 'RAM', 'Disco', 'Red'],
            datos: Array.from({ length: 288 }, (_, i) => {
                const ahora = new Date()
                ahora.setMinutes(ahora.getMinutes() - ((288 - i) * 5))

                return {
                    timestamp: ahora.toISOString(),
                    CPU: Math.floor(Math.random() * 40 + 20),
                    RAM: Math.floor(Math.random() * 35 + 40),
                    Disco: Math.floor(Math.random() * 20 + 60),
                    Red: Math.floor(Math.random() * 50 + 10)
                }
            })
        },

        // --- GRÁFICO: Satisfacción del Cliente ---
        {
            id: 'global-customer-satisfaction',
            nombre: 'NPS y Satisfacción Mensual',
            tipo: 'grafico',
            columnas: ['mes', 'NPS', 'CSAT', 'Respuestas'],
            datos: Array.from({ length: 12 }, (_, i) => {
                return {
                    mes: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i],
                    NPS: Math.floor(Math.random() * 30 + 50),
                    CSAT: Math.floor(Math.random() * 15 + 75),
                    Respuestas: Math.floor(Math.random() * 500 + 300)
                }
            })
        }
    ]

    return datasets
})