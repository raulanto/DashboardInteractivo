<template>
    <div class="absolute inset-0 pointer-events-none z-[9999]">

        <template v-for="(guia, i) in alignmentGuides" :key="`align-${i}`">
            <div
                class="absolute bg-red-500 shadow-sm"
                :style="{
                    left: guia.type === 'vertical' ? `${guia.pos}px` : `${guia.start}px`,
                    top: guia.type === 'horizontal' ? `${guia.pos}px` : `${guia.start}px`,
                    width: guia.type === 'vertical' ? '1px' : `${guia.length}px`,
                    height: guia.type === 'horizontal' ? '1px' : `${guia.length}px`
                }"
            ></div>
        </template>

        <template v-for="(measure, i) in measurementGuides" :key="`measure-${i}`">
            <div
                class="absolute flex items-center justify-center"
                :class="measure.type === 'horizontal' ? 'flex-row' : 'flex-col'"
                :style="{
                    left: `${measure.x}px`,
                    top: `${measure.y}px`,
                    width: measure.type === 'horizontal' ? `${measure.length}px` : '1px',
                    height: measure.type === 'vertical' ? `${measure.length}px` : '1px'
                }"
            >
                <div
                    class="absolute bg-blue-500/50"
                    :class="measure.type === 'horizontal' ? 'h-px w-full' : 'w-px h-full'"
                ></div>

                <div class="relative z-10">
                    <span class="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                        {{ Math.round(measure.value) }}px
                    </span>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
// Definimos las interfaces aquí o las importamos de tus types
interface AlignmentGuide {
    type: 'vertical' | 'horizontal';
    pos: number;
    start: number;
    length: number;
}

interface MeasurementGuide {
    type: 'vertical' | 'horizontal';
    x: number;
    y: number;
    length: number;
    value: number;
}

defineProps<{
    alignmentGuides: AlignmentGuide[];
    measurementGuides: MeasurementGuide[];
}>();
</script>