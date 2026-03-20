<template>
  <div class="fixed top-2 sm:top-4 right-2 sm:right-4 left-2 sm:left-auto z-[9999] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl shadow-2xl backdrop-blur-lg border animate-slide-in w-full sm:max-w-md',
          getToastClasses(toast.type)
        ]"
      >
        <div class="flex-shrink-0">
          <UIcon :name="getToastIcon(toast.type)" class="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div class="flex-1 text-xs sm:text-sm font-medium break-words">
          {{ toast.message }}
        </div>
        <button
          @click="removeToast(toast.id)"
          class="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
        >
          <UIcon name="i-heroicons-x-mark" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useCustomToast } from '~/composables/useCustomToast'

const { toasts, removeToast } = useCustomToast()

const getToastClasses = (type: string) => {
  const classes = {
    success: 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white border-green-300',
    error: 'bg-gradient-to-r from-red-500/90 to-rose-500/90 text-white border-red-300',
    warning: 'bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white border-yellow-300',
    info: 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 text-white border-blue-300'
  }
  return classes[type] || classes.info
}

const getToastIcon = (type: string) => {
  const icons = {
    success: 'i-heroicons-check-circle',
    error: 'i-heroicons-x-circle',
    warning: 'i-heroicons-exclamation-triangle',
    info: 'i-heroicons-information-circle'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.toast-enter-active {
  animation: slideInRight 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
}
</style>
