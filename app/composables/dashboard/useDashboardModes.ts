import { ref } from 'vue';

export const useDashboardModes = () => {
  const modoPanActivo = ref(true);
  const modoDragActivo = ref(true);
  const mapaVisible = ref(true);

  const toggleModoPan = () => {
    modoPanActivo.value = !modoPanActivo.value;
  };

  const toggleModoDrag = () => {
    modoDragActivo.value = !modoDragActivo.value;
  };

  const toggleMapa = () => {
    mapaVisible.value = !mapaVisible.value;
  };

  return {
    modoPanActivo,
    modoDragActivo,
    mapaVisible,
    toggleModoPan,
    toggleModoDrag,
    toggleMapa,
  };
};