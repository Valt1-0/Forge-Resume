import type { Ref } from 'vue'
import { ref, watch } from 'vue'

export interface HistoryOptions<T> {
  maxSize?: number
  debounceMs?: number
}

/**
 * Composable optimisé pour l'historique undo/redo
 * Utilise des snapshots JSON pour le deep clone
 * Throttling automatique pour éviter trop d'entrées
 */
export const useHistory = <T>(
  source: Ref<T>,
  options: HistoryOptions<T> = {}
) => {
  const { maxSize = 50, debounceMs = 1000 } = options

  const history = ref<string[]>([])
  const currentIndex = ref(-1)
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null
  let lastSnapshot: string | null = null

  /**
   * Sauvegarde un snapshot dans l'historique
   */
  const saveSnapshot = () => {
    try {
      const snapshot = JSON.stringify(source.value)

      // Éviter les doublons consécutifs
      if (snapshot === lastSnapshot) {
        return
      }

      lastSnapshot = snapshot

      // Supprimer l'historique après l'index actuel
      if (currentIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, currentIndex.value + 1)
      }

      // Ajouter le nouveau snapshot
      history.value.push(snapshot)

      // Limiter la taille
      if (history.value.length > maxSize) {
        history.value.shift()
      } else {
        currentIndex.value++
      }
    } catch (error) {
      console.error('Error saving history snapshot:', error)
    }
  }

  /**
   * Undo - retour en arrière
   */
  const undo = () => {
    if (!canUndo.value) return false

    currentIndex.value--
    try {
      const snapshot = history.value[currentIndex.value]
      source.value = JSON.parse(snapshot)
      lastSnapshot = snapshot
      return true
    } catch (error) {
      console.error('Error during undo:', error)
      currentIndex.value++
      return false
    }
  }

  /**
   * Redo - en avant
   */
  const redo = () => {
    if (!canRedo.value) return false

    currentIndex.value++
    try {
      const snapshot = history.value[currentIndex.value]
      source.value = JSON.parse(snapshot)
      lastSnapshot = snapshot
      return true
    } catch (error) {
      console.error('Error during redo:', error)
      currentIndex.value--
      return false
    }
  }

  /**
   * Clear history
   */
  const clear = () => {
    history.value = []
    currentIndex.value = -1
    lastSnapshot = null
  }

  /**
   * Reset avec le state actuel
   */
  const reset = () => {
    clear()
    saveSnapshot()
  }

  // Computed
  const canUndo = computed(() => currentIndex.value > 0)
  const canRedo = computed(() => currentIndex.value < history.value.length - 1)
  const historySize = computed(() => history.value.length)

  // Watch avec debounce
  watch(
    source,
    () => {
      if (debounceTimeout) clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(saveSnapshot, debounceMs)
    },
    { deep: true }
  )

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    historySize,
    saveSnapshot,
    clear,
    reset
  }
}
