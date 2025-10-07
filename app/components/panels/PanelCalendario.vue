<template>
    <div class="h-full flex flex-col items-center justify-center text-center">
        <UIcon name="i-heroicons-calendar-days" class="w-16 h-16 text-primary mb-4" />
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Calendario
        </h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">
            Próximamente disponible
        </p>
    </div>
</template>

<script setup lang="ts">
interface Props {
    data?: any
}

defineProps<Props>()
</script>