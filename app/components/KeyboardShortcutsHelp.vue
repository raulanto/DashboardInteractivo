<template>
  <UModal v-model="isOpen">

      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Atajos de Teclado</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="isOpen = false"
          />
        </div>
      </template>

      <div class="space-y-6">
        <!-- Zoom -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Zoom
          </h4>
          <div class="space-y-2">
            <div
              v-for="shortcut in shortcuts.zoom"
              :key="shortcut.keys"
              class="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ shortcut.description }}
              </span>
              <kbd
                class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
              >
                {{ shortcut.keys }}
              </kbd>
            </div>
          </div>
        </div>

        <!-- Modos -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Modos de Interacción
          </h4>
          <div class="space-y-2">
            <div
              v-for="shortcut in shortcuts.modes"
              :key="shortcut.keys"
              class="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ shortcut.description }}
              </span>
              <kbd
                class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
              >
                {{ shortcut.keys }}
              </kbd>
            </div>
          </div>
        </div>

        <!-- Paneles -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Gestión de Paneles
          </h4>
          <div class="space-y-2">
            <div
              v-for="shortcut in shortcuts.panels"
              :key="shortcut.keys"
              class="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ shortcut.description }}
              </span>
              <kbd
                class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
              >
                {{ shortcut.keys }}
              </kbd>
            </div>
          </div>
        </div>

        <!-- Organización -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Organización
          </h4>
          <div class="space-y-2">
            <div
              v-for="shortcut in shortcuts.organization"
              :key="shortcut.keys"
              class="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ shortcut.description }}
              </span>
              <kbd
                class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
              >
                {{ shortcut.keys }}
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton color="primary" @click="isOpen = false">
            Cerrar
          </UButton>
        </div>
      </template>

  </UModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Shortcut {
  keys: string;
  description: string;
}

interface Shortcuts {
  zoom: Shortcut[];
  modes: Shortcut[];
  panels: Shortcut[];
  organization: Shortcut[];
}

defineProps<{
  shortcuts: Shortcuts;
}>();

const isOpen = defineModel<boolean>({ default: false });
</script>