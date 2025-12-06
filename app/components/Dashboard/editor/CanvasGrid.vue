<script setup lang="ts">
import {computed} from "vue";

interface CanvasGridProps {
    x: number;
    y: number;
    scale: number;
}

const props = defineProps<CanvasGridProps>();
const gridStyle = computed(() => {
    const size = 50 * props.scale;
    const offsetX = props.x % size;
    const offsetY = props.y % size;

    return {
        backgroundImage: `
            linear-gradient(to right, rgba(200, 200, 200, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(200, 200, 200, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        width: "10000px",
        height: "10000px",
        left: "-5000px",
        top: "-5000px",
    };
});

</script>

<template>
    <div class="absolute inset-0 pointer-events-none canvas-background" :style="gridStyle"></div>
</template>

<style scoped>

</style>