<template>
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
                <th
                    v-for="col in data.columnas"
                    :key="col"
                    class="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                    {{ col }}
                </th>
            </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            <tr
                v-for="(fila, idx) in data.filas"
                :key="idx"
                class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                <td
                    v-for="(celda, cellIdx) in fila"
                    :key="cellIdx"
                    class="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap"
                >
                    <UBadge
                        v-if="esColumnaEstado(cellIdx, celda)"
                        :label="celda"
                        size="xs"
                        :color="celda === 'Activo' ? 'success' : 'neutral'"
                        variant="subtle"
                    />
                    <span v-else>{{ celda }}</span>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
interface TablaData {
    columnas: string[]
    filas: (string | number)[][]
}

interface Props {
    data: TablaData
}

defineProps<Props>()

const esColumnaEstado = (cellIdx: number, celda: string | number): boolean => {
    // La columna de estado suele ser la tercera (índice 2)
    // Puedes ajustar esta lógica según tus necesidades
    return cellIdx === 2 && typeof celda === 'string' &&
        (celda === 'Activo' || celda === 'Inactivo')
}
</script>