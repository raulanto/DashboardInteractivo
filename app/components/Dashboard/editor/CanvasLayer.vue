<template>
    <div
        class="absolute inset-0 will-change-transform origin-top-left backface-hidden"
        :style="layerStyle"
    >
        <slot name="grid" />

        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface CanvasState {
    x: number;
    y: number;
    scale: number;
    panning?: boolean;
}

const props = defineProps<{
    canvas: CanvasState;
    isInteracting?: boolean;
}>();

const layerStyle = computed(() => {
    const { x, y, scale, panning } = props.canvas;

    // Decidimos si animar o no
    const shouldAnimate = !panning && !props.isInteracting;

    return {
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        // Optimizamos renderizado de texto al escalar
        // 'perspective': '1000px', // Opcional: a veces ayuda con el flickering en Chrome
        transition: shouldAnimate ? 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none'
    };
});
</script>

<style scoped>
/* Utilidad para evitar parpadeos en transformaciones 3D/2D complejas */
.backface-hidden {
    backface-visibility: hidden;
    -webkit-font-smoothing: subpixel-antialiased;
}
</style>