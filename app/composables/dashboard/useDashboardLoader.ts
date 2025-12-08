import { ref, type Ref } from 'vue';
import type { Panel as PanelInterface } from '~/types/panel';

interface LoaderOptions {
  paneles: Ref<PanelInterface[]>;
  limpiarTodos: () => void;
  ajustarVistaGlobal: () => void;
}

export const useDashboardLoader = (options: LoaderOptions) => {
  const { paneles, limpiarTodos, ajustarVistaGlobal } = options;
  const cargandoTablero = ref(false);

  const cargarTableroDesdeUrl = async (boardId: string | null) => {
    if (!boardId) {
      limpiarTodos();
      return;
    }

    cargandoTablero.value = true;

    try {
      const { data, error } = await useFetch('/api/myBoards');

      if (data.value && Array.isArray(data.value)) {
        const tableroEncontrado = data.value.find((b: any) => b.id === boardId);

        if (tableroEncontrado && tableroEncontrado.panels) {
          // Asignar paneles con deep copy
          paneles.value = JSON.parse(JSON.stringify(tableroEncontrado.panels));

          // Ajustar vista después de cargar
          setTimeout(() => {
            ajustarVistaGlobal();
          }, 100);

          const toast = useToast();
          toast.add({
            title: 'Tablero Cargado',
            description: `Se cargó "${tableroEncontrado.title}" correctamente.`,
            icon: 'i-heroicons-check-circle',
          });
        } else {
          console.warn(`Tablero con ID ${boardId} no encontrado o sin paneles.`);
        }
      }
    } catch (e) {
      console.error('Error al cargar el tablero:', e);
      const toast = useToast();
      toast.add({
        title: 'Error',
        description: 'No se pudo cargar el tablero.',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle',
      });
    } finally {
      cargandoTablero.value = false;
    }
  };

  return {
    cargandoTablero,
    cargarTableroDesdeUrl,
  };
};