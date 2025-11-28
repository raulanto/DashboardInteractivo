<template>
    <div class="flex flex-col h-full ">
        <div class="flex flex-col flex-1 max-w-screen mx-auto w-full">
            <!-- Contenedor del Canvas -->
            <div
                ref="contenedorRef"
                class="relative overflow-hidden border flex-1 transition-colors"
                :class="[
          modoPanActivo
            ? 'border-blue-400 bg-blue-50/20 dark:bg-blue-950/20'
            : '',
          modoDragActivo
            ? 'border-green-400 bg-green-50/20 dark:bg-green-950/20'
            : '',
        ]"
                @mousedown="handleMouseDown"
                @mousemove="handleMouseMove"
                @mouseup="handleMouseUp"
                @mouseleave="handleMouseLeave"
                @wheel.prevent="handleWheel"
            >
                <!-- Canvas transformable -->
                <div
                    class="canvas-wrapper absolute inset-0"
                    :style="canvasStyle"
                    :class="obtenerCursorClase"
                >
                    <!-- Grid de fondo infinito -->
                    <div class="absolute pointer-events-none" :style="gridStyle"></div>

                    <!-- Guías de Alineación (NUEVO) -->
                    <template v-for="(guia, index) in guiasAlineacion" :key="index">
                        <!-- Guía Vertical -->
                        <div
                            v-if="guia.tipo === 'vertical'"
                            class="absolute w-px bg-red-500 z-50 pointer-events-none shadow-[0_0_2px_rgba(255,255,255,0.8)]"
                            :style="{
                                left: `${guia.x}px`,
                                top: `${guia.inicio}px`,
                                height: `${guia.longitud}px`
                            }"
                        >
                            <!-- Etiqueta de distancia opcional -->
                            <!-- <div class="absolute top-1/2 left-2 bg-red-500 text-white text-[10px] px-1 rounded -translate-y-1/2">
                                {{ Math.round(guia.longitud) }}px
                            </div> -->
                        </div>
                        <!-- Guía Horizontal -->
                        <div
                            v-else
                            class="absolute h-px bg-red-500 z-50 pointer-events-none shadow-[0_0_2px_rgba(255,255,255,0.8)]"
                            :style="{
                                left: `${guia.inicio}px`,
                                top: `${guia.y}px`,
                                width: `${guia.longitud}px`
                            }"
                        >
                        </div>
                    </template>

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
                </div>

                <!-- Indicador de coordenadas y modos -->
                <div class="absolute bottom-4 left-4 space-y-2 pointer-events-none">
                    <!-- Info del canvas -->
                    <div
                        class="px-3 py-2 bg-black/50 text-white text-xs rounded-lg font-mono"
                    >
                        <div>
                            Canvas: X: {{ Math.round(canvas.x) }}, Y:
                            {{ Math.round(canvas.y) }}
                        </div>
                        <div>Zoom: {{ Math.round(canvas.scale * 100) }}%</div>
                        <div>Paneles: {{ totalPaneles }}</div>
                    </div>

                    <!-- Indicadores de modo -->
                    <div class="flex gap-2">
                        <div
                            v-if="modoPanActivo"
                            class="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg font-medium flex items-center gap-1.5 animate-pulse"
                        >
                            <UIcon name="i-heroicons-hand-raised" class="w-4 h-4" />
                            Modo Pan Activo
                        </div>
                        <div
                            v-if="modoDragActivo"
                            class="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-medium flex items-center gap-1.5 animate-pulse"
                        >
                            <UIcon name="i-heroicons-arrows-pointing-out" class="w-4 h-4" />
                            Modo Drag Activo
                        </div>
                    </div>
                </div>

                <div
                    class="p-2 w-fit -mt-2 absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto z-10 bg-neutral-100/80 dark:bg-neutral-950 rounded-md shadow-md"
                >


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
                        @clear-all="confirmarLimpiar"
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
        <!-- Agrega aquí más slideovers si es necesario -->

    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { Panel as PanelInterface, PanelType, PanelData, GraficoData, EstadisticaData, TablaData } from "~/types/panel"; // Importar tipos específicos

import { usePanelManager } from "~/composables/usePanelManager";
import { usePanelDrag } from "~/composables/usePanelDrag";
import { usePanelResize } from "~/composables/usePanelResize";
import { useCanvasPan } from "~/composables/useCanvasPan";
import { usePanelAlignment } from "~/composables/usePanelAlignment"; // Importar nuevo composable

import Panel from "~/components/Panel.vue";
import DashboardControls from "~/components/Dashboard/DashboardControls.vue";
import MiniMap from "~/components/MiniMap.vue";

// Importar los nuevos slideovers
import SlideoverConfigGrafico from "~/components/SlideoverConfigGrafico.vue";
import SlideoverConfigEstadistica from "~/components/SlideoverConfigEstadistica.vue";
import SlideoverConfigTabla from "~/components/SlideoverConfigTabla.vue";

const contenedorRef = ref<HTMLElement | null>(null);
const mostrarAyuda = ref(false);
const mapaVisible = ref(true);

// Estados de los modos
const modoPanActivo = ref(true);
const modoDragActivo = ref(true);

// Estado de los Slideovers de configuración
const panelConfigurando = ref<PanelInterface | null>(null); // Panel que se está configurando
const slideoverGraficoAbierto = ref(false);
const slideoverEstadisticaAbierto = ref(false);
const slideoverTablaAbierto = ref(false);
// Agrega más refs para otros slideovers si los creas

// Composables
const {
    paneles,
    totalPaneles,
    agregarPanel,
    eliminarPanel,
    duplicarPanel,
    actualizarPanel,
    desactivarTodos,
    limpiarTodos,
    autoOrganizarPaneles,
    autoOrganizarMasonry,
    activarPanel,
} = usePanelManager();

const {
    isDragging,
    iniciarArrastre,
    moverPanel: moverPanelDrag,
    soltarPanel,
} = usePanelDrag();

const {
    isResizing,
    iniciarRedimension,
    redimensionarPanel,
    finalizarRedimension,
} = usePanelResize();

const {
    canvas,
    isPanning,
    iniciarPan,
    moverCanvas,
    detenerPan,
    hacerZoom,
    resetearCanvas,
} = useCanvasPan();

// Nuevo composable de alineación
const {
    guias: guiasAlineacion,
    verificarAlineacion,
    limpiarGuias
} = usePanelAlignment();

// Computed properties
const canvasStyle = computed(() => ({
    transform: `translate(${canvas.value.x}px, ${canvas.value.y}px) scale(${canvas.value.scale})`,
    transformOrigin: "0 0",
    transition:
        canvas.value.panning || isDragging.value || isResizing.value
            ? "none"
            : "transform 0.3s ease-out",
}));

const gridStyle = computed(() => {
    const size = 50 * canvas.value.scale;
    const offsetX = canvas.value.x % size;
    const offsetY = canvas.value.y % size;

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

const obtenerCursorClase = computed(() => {
    if (canvas.value.panning) return "cursor-grabbing";
    if (isDragging.value || isResizing.value) return "";

    if (modoPanActivo.value && !modoDragActivo.value) return "cursor-grab";
    if (!modoPanActivo.value && modoDragActivo.value) return "cursor-move";
    if (modoPanActivo.value && modoDragActivo.value) return "cursor-grab";

    return "cursor-default";
});

// Funciones de modos
const toggleModoPan = () => {
    modoPanActivo.value = !modoPanActivo.value;
    if (!modoPanActivo.value && canvas.value.panning) {
        detenerPan();
    }
};

const toggleModoDrag = () => {
    modoDragActivo.value = !modoDragActivo.value;
    if (!modoDragActivo.value && isDragging.value) {
        soltarPanel();
    }
};

const toggleMapa = () => {
    mapaVisible.value = !mapaVisible.value;
};

// Navegación desde el minimapa
const navegarDesdeMapa = (x: number, y: number) => {
    canvas.value.x = x;
    canvas.value.y = y;
};

// Event Handlers
const handleMouseDown = (event: MouseEvent) => {
    if (modoPanActivo.value && (event.shiftKey || event.button === 1)) {
        iniciarPan(event);
        return;
    }

    if (modoPanActivo.value && !modoDragActivo.value && event.button === 0) {
        iniciarPan(event);
        return;
    }

    // Desactivar paneles si se hace clic fuera de un panel
    const targetElement = event.target as HTMLElement;
    // Asegurarse de que el clic no fue dentro de un panel o sus controles
    if (targetElement === contenedorRef.value || targetElement.classList.contains('canvas-wrapper')) {
        if (!isDragging.value && !isResizing.value) {
            desactivarTodos();
        }
    }
};

const handleMouseMove = (event: MouseEvent) => {
    if (canvas.value.panning && modoPanActivo.value) {
        moverCanvas(event);
    } else if (isDragging.value && modoDragActivo.value) {
        // 1. Mover el panel normalmente (posición raw)
        moverPanelDrag(event, canvas.value.x, canvas.value.y, canvas.value.scale);

        // 2. Verificar alineación y aplicar snap
        const panelActivo = paneles.value.find(p => p.arrastrando);
        if (panelActivo) {
            const { snapX, snapY } = verificarAlineacion(panelActivo, paneles.value);

            // Aplicar snap si se detectó alineación
            if (snapX !== null) panelActivo.posicion.x = snapX;
            if (snapY !== null) panelActivo.posicion.y = snapY;
        }

    } else if (isResizing.value) {
        redimensionarPanel(
            event,
            canvas.value.x,
            canvas.value.y,
            canvas.value.scale
        );
    }
};

const handleMouseUp = () => {
    if (canvas.value.panning) {
        detenerPan();
    } else if (isDragging.value) {
        soltarPanel();
        limpiarGuias(); // Limpiar guías al soltar
    } else if (isResizing.value) {
        finalizarRedimension();
    }
};

const handleMouseLeave = () => {
    handleMouseUp();
};

const handleWheel = (event: WheelEvent) => {
    if (!contenedorRef.value) return;

    const rect = contenedorRef.value.getBoundingClientRect();
    const centerX = event.clientX - rect.left;
    const centerY = event.clientY - rect.top;

    hacerZoom(event.deltaY, centerX, centerY);
};

// Panel Handlers
const iniciarArrastrePanel = (panel: PanelInterface, event: MouseEvent) => {
    if (!modoDragActivo.value) return;
    iniciarArrastre(
        panel,
        event,
        canvas.value.x,
        canvas.value.y,
        canvas.value.scale
    );
    // Activar el panel al iniciar el arrastre
    activarPanel(panel.id);
};

const iniciarRedimensionPanel = (panel: PanelInterface, event: MouseEvent) => {
    iniciarRedimension(
        panel,
        event,
        canvas.value.x,
        canvas.value.y,
        canvas.value.scale
    );
    // Activar el panel al iniciar la redimensión
    activarPanel(panel.id);
};

const actualizarDataPanel = (panelId: string, nuevaData: PanelData) => {
    const panel = paneles.value.find((p) => p.id === panelId);
    if (panel) {
        actualizarPanel(panelId, { data: nuevaData });
    }
};

// --- Configuración de Paneles ---
const abrirConfigPanel = (panel: PanelInterface) => {
    console.log("Abriendo configuración para panel:", panel.id, panel.tipo);
    panelConfigurando.value = panel; // Guardar el panel actual
    switch (panel.tipo) {
        case 'grafico':
            slideoverGraficoAbierto.value = true;
            break;
        case 'estadistica':
            slideoverEstadisticaAbierto.value = true;
            break;
        case 'tabla':
            slideoverTablaAbierto.value = true;
            break;
        // Agrega casos para otros tipos de panel aquí
        default:
            console.warn(`Configuración no implementada para el tipo de panel: ${panel.tipo}`);
            panelConfigurando.value = null; // Resetear si no hay config
    }
};

const guardarConfigPanel = (nuevaData: PanelData) => {
    if (panelConfigurando.value) {
        actualizarDataPanel(panelConfigurando.value.id, nuevaData);
        // Cerrar el slideover específico (esto se maneja con v-model ahora)
        // No necesitamos cerrar explícitamente aquí si usamos v-model correctamente
        panelConfigurando.value = null; // Limpiar el panel en configuración
    }
}

const handleAgregarPanel = (tipo: PanelType) => {
    if (!contenedorRef.value) return;

    const rect = contenedorRef.value.getBoundingClientRect();
    const nuevoPanel = agregarPanel(
        tipo,
        rect.width,
        rect.height,
        canvas.value.x,
        canvas.value.y
    );

    // Si es un gráfico, tabla o estadistica, abrir automáticamente la configuración
    if ((tipo === 'grafico' || tipo === 'tabla' || tipo === 'estadistica') && nuevoPanel) {
        setTimeout(() => {
            abrirConfigPanel(nuevoPanel);
        }, 100); // Pequeño delay para asegurar que el panel se renderice
    }
};

// Zoom Controls
const zoomIn = () => {
    if (!contenedorRef.value) return;
    const rect = contenedorRef.value.getBoundingClientRect();
    hacerZoom(-100, rect.width / 2, rect.height / 2);
};

const zoomOut = () => {
    if (!contenedorRef.value) return;
    const rect = contenedorRef.value.getBoundingClientRect();
    hacerZoom(100, rect.width / 2, rect.height / 2);
};

const resetearVista = () => {
    resetearCanvas();
};

// Organization
const confirmarLimpiar = () => {
    limpiarTodos();
};

const autoOrganizar = () => {
    autoOrganizarPaneles();
    resetearCanvas();
};

const autoOrganizarPanelesMansory = () => {
    autoOrganizarMasonry();
    resetearCanvas();
};

// Lifecycle
onMounted(() => {
    // Inicialización o carga de paneles guardados iría aquí
    document.addEventListener("mousedown", (e) => {
        // Prevenir paneo por defecto del navegador con rueda del ratón
        if (e.button === 1) e.preventDefault();
    });
});

onBeforeUnmount(() => {
    // Limpiar listeners si es necesario
    handleMouseUp(); // Asegurarse de que no queden estados activos
});
</script>

<style scoped>
.canvas-wrapper {
    will-change: transform;
}

.canvas-wrapper * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
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