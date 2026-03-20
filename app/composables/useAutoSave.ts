import type { Ref } from 'vue'
import { watch, onBeforeUnmount } from 'vue'

export interface AutoSaveOptions {
  enabled: Ref<boolean>
  saveFn: () => void
  debounceMs?: number
  intervalMs?: number
}

/**
 * Composable optimisé pour l'auto-save avec debounce et interval
 * Évite les saves multiples et gère le cleanup automatiquement
 */
export const useAutoSave = (
  watchSource: Ref | Ref[],
  options: AutoSaveOptions
) => {
  const {
    enabled,
    saveFn,
    debounceMs = 2000,
    intervalMs = 30000
  } = options

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null
  let intervalId: ReturnType<typeof setInterval> | null = null
  let lastSaveTime = Date.now()

  const SAVE_THROTTLE = 1000 // Minimum time between saves

  const performSave = () => {
    const now = Date.now()
    // Throttle: éviter les saves trop rapprochées
    if (now - lastSaveTime < SAVE_THROTTLE) {
      return
    }

    lastSaveTime = now
    saveFn()
  }

  // Debounced save sur les changements
  const debouncedSave = () => {
    if (!enabled.value) return

    if (debounceTimeout) clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(performSave, debounceMs)
  }

  // Watch pour les changements
  watch(watchSource, debouncedSave, { deep: true })

  // Interval save (backup)
  const startInterval = () => {
    if (intervalMs && intervalMs > 0 && typeof window !== 'undefined') {
      intervalId = setInterval(() => {
        if (enabled.value) {
          performSave()
        }
      }, intervalMs)
    }
  }

  // Démarrer l'interval uniquement côté client
  if (typeof window !== 'undefined') {
    startInterval()
  }

  // Cleanup
  const cleanup = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout)
    if (intervalId) clearInterval(intervalId)
    debounceTimeout = null
    intervalId = null
  }

  onBeforeUnmount(() => {
    cleanup()
    // Final save avant de partir
    if (enabled.value) {
      performSave()
    }
  })

  return {
    cleanup,
    forceSave: performSave
  }
}
