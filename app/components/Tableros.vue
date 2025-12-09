<template>
  <UPageCard
    v-for="board in savedBoards"
    :key="board.id"
    class="group bg-accented cursor-pointer hover:ring-2 hover:ring-primary-500/50 transition-all duration-200 hover:-translate-y-1"
    @click="abrirTablero(board.id)"
    :icon="board.icon"
    :description="board.description"
    spotlight
    spotlight-color="primary"
  >
    <template #title>
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div>
            <h3
              class="font-semibold text-highlighted group-hover:text-primary transition-colors"
            >
              {{ board.title }}
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              {{ new Date(board.createdAt).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div
        class="flex items-center justify-between text-xs text-neutral-500 w-full"
      >
        <UBadge
          class="flex items-center gap-1"
          variant="soft"
          icon="i-heroicons-rectangle-group"
        >
          <span>{{ board.panels.length }} Paneles</span>
        </UBadge>
      </div>
    </template>
  </UPageCard>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import type { SavedBoard } from "~/types/saveBoard";
const props = defineProps({
  savedBoards: {
    type: Array as () => SavedBoard[],
    required: true,
  },
});
const router = useRouter();

const abrirTablero = (boardId: string) => {
  router.push({ path: "/board/CreateBoard", query: { id: boardId } });
};


</script>

<style></style>
