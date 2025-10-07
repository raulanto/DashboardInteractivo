<template>
    <div class="space-y-3">
        <div v-for="(item, idx) in data.datos" :key="idx">
            <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
          {{ item.label }}
        </span>
                <UBadge :label="`${item.valor}%`" size="xs" color="primary" variant="subtle" />
            </div>
            <UProgress :value="item.valor" color="primary" />
        </div>
    </div>
</template>

<script setup lang="ts">
interface GraficoItem {
    label: string
    valor: number
}

interface GraficoData {
    datos: GraficoItem[]
}

interface Props {
    data: GraficoData
}

defineProps<Props>()
</script>