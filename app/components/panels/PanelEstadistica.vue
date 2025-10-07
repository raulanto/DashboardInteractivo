<template>
    <div class="flex flex-col items-center justify-center h-full">
        <div
            class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-3"
        >
            {{ data.valor }}
        </div>
        <UBadge :label="data.subtitulo" size="md" color="neutral" variant="soft" />
    </div>
</template>

<script setup lang="ts">
interface EstadisticaData {
    valor: string | number
    subtitulo: string
}

interface Props {
    data: EstadisticaData
}

defineProps<Props>()
</script>