<template>
  <div class="flex flex-col h-full relative">
    <!-- Loader superpuesto -->
    <div
      v-if="cargandoTablero"
      class="absolute inset-0 z-[100] bg-white/80 dark:bg-neutral-950/80 flex flex-col items-center justify-center backdrop-blur-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary animate-spin mb-3"
      />
      <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">
        Cargando tablero...
      </p>
    </div>

    <div class="flex flex-col flex-1 max-w-screen mx-auto w-full">
      <!-- Contenedor del Canvas -->
      <div
        ref="contenedorRef"
        class="relative overflow-hidden border flex-1 transition-colors"
        :class="[
          modoPanActivo
            ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-950/20'
            : '',
          modoDragActivo
            ? 'border-green-400 bg-green-50/50 dark:bg-green-950/20'
            : '',
        ]"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
        @wheel.prevent="handleWheel"
      >
        <!-- Canvas transformable -->
        <CanvasLayer :canvas="canvas" :is-interacting="isInteracting">
          <!-- Grid de fondo infinito -->
          <template #grid>
            <CanvasGrid :x="canvas.x" :y="canvas.y" :scale="canvas.scale" />
          </template>

          <!-- Guías de alineación -->
          <CanvasGuides
            :alignment-guides="alignmentGuides"
            :measurement-guides="measurementGuides"
          />

          <!-- Paneles -->
          <Panel
            v-for="panel in paneles"
            :key="panel.id"
            :panel="panel"
            :drag-enabled="modoDragActivo"
            @drag-start="(e) => iniciarArrastrePanel(panel, e)"
            @resize-start="(e) => iniciarRedimensionPanel(panel, e)"
            @delete="eliminarPanel(panel.id)"
            @duplicate="duplicarPanel(panel.id)"
            @update:data="actualizarDataPanel(panel.id, $event)"
            @open-config="abrirConfigPanel(panel)"
          />
        </CanvasLayer>

        <!-- Indicador de coordenadas -->
        <section
          class="absolute bottom-4 left-4 pointer-events-none space-y-2 z-50"
        >
          <div class="px-3 py-2 text-default text-xs rounded-lg font-mono">
            <div class="flex gap-4">
              <span>X: {{ Math.round(canvas.x) }}</span>
              <span>Y: {{ Math.round(canvas.y) }}</span>
              <span class="text-primary"
                >Scale: {{ Math.round(canvas.scale * 100) }}%</span
              >
            </div>
          </div>
        </section>

        <!-- Controles del dashboard -->
        <DashboardControls
          :total-paneles="totalPaneles"
          :zoom="canvas.scale"
          :modo-pan-activo="modoPanActivo"
          :modo-drag-activo="modoDragActivo"
          :mapa-visible="mapaVisible"
          @add-panel="handleAgregarPanel"
          @reset-view="resetearVista"
          @zoom-in="zoomIn"
          @zoom-out="zoomOut"
          @clear-all="limpiarTodos"
          @auto-organize="autoOrganizar"
          @auto-organize-masonry="autoOrganizarPanelesMansory"
          @toggle-pan="toggleModoPan"
          @toggle-drag="toggleModoDrag"
          @toggle-map="toggleMapa"
        />
      </div>
    </div>
  </div>

  <!-- Minimapa -->
  <MiniMap
    v-if="contenedorRef"
    :paneles="paneles"
    :canvas-x="canvas.x"
    :canvas-y="canvas.y"
    :canvas-scale="canvas.scale"
    :container-width="contenedorRef?.clientWidth || 0"
    :container-height="contenedorRef?.clientHeight || 0"
    :visible="mapaVisible"
    @navigate="navegarDesdeMapa"
    @toggle="toggleMapa"
    @fit-view="ajustarVistaGlobal"
  />

  <!-- Slideovers de configuración -->
  <SlideoverConfigGrafico
    v-if="panelConfigurando?.tipo === 'grafico'"
    v-model="slideoverGraficoAbierto"
    :data="panelConfigurando.data as GraficoData"
    @save="guardarConfigPanel"
  />
  <SlideoverConfigEstadistica
    v-if="panelConfigurando?.tipo === 'estadistica'"
    v-model="slideoverEstadisticaAbierto"
    :data="panelConfigurando.data as EstadisticaData"
    @save="guardarConfigPanel"
  />
  <SlideoverConfigTabla
    v-if="panelConfigurando?.tipo === 'tabla'"
    v-model="slideoverTablaAbierto"
    :data="panelConfigurando.data as TablaData"
    @save="guardarConfigPanel"
  />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { EstadisticaData, GraficoData, TablaData } from "~/types/panel";

import { useDashboardEditor } from "~/composables/dashboard/useDashboardEditor";

import Panel from "~/components/Panel.vue";
import DashboardControls from "~/components/Dashboard/DashboardControls.vue";
import MiniMap from "~/components/MiniMap.vue";
import SlideoverConfigGrafico from "~/components/SlideoverConfigGrafico.vue";
import SlideoverConfigEstadistica from "~/components/SlideoverConfigEstadistica.vue";
import SlideoverConfigTabla from "~/components/SlideoverConfigTabla.vue";
import CanvasGrid from "~/components/Dashboard/editor/CanvasGrid.vue";
import CanvasGuides from "~/components/Dashboard/editor/CanvasGuides.vue";
import CanvasLayer from "~/components/Dashboard/editor/CanvasLayer.vue";

const route = useRoute();
const contenedorRef = ref<HTMLElement | null>(null);

// Usar el composable orquestador principal
const {
  // Estados
  paneles,
  totalPaneles,
  canvas,
  cargandoTablero,
  modoPanActivo,
  modoDragActivo,
  mapaVisible,
  panelConfigurando,
  slideoverGraficoAbierto,
  slideoverEstadisticaAbierto,
  slideoverTablaAbierto,
  alignmentGuides,
  measurementGuides,
  isInteracting,

  // Eventos
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleMouseLeave,
  handleWheel,

  // Acciones
  handleAgregarPanel,
  eliminarPanel,
  duplicarPanel,
  iniciarArrastrePanel,
  iniciarRedimensionPanel,
  actualizarDataPanel,
  abrirConfigPanel,
  guardarConfigPanel,

  // Controles
  toggleModoPan,
  toggleModoDrag,
  toggleMapa,
  zoomIn,
  zoomOut,
  resetearVista,
  limpiarTodos,
  autoOrganizar,
  autoOrganizarPanelesMansory,
  navegarDesdeMapa,
  ajustarVistaGlobal,
  cargarTableroDesdeUrl,
  cleanup,
  shortcuts,
} = useDashboardEditor(contenedorRef, {
  enableKeyboardShortcuts: true,
});
onMounted(() => {
  const boardId = route.query.id as string;
  cargarTableroDesdeUrl(boardId || null);

  // Prevenir click medio del mouse
  document.addEventListener("mousedown", (e) => {
    if (e.button === 1) e.preventDefault();
  });
});

onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
.canvas-wrapper {
  will-change: transform;
}

.canvas-wrapper * {
  user-select: none;
  -webkit-user-select: none;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
