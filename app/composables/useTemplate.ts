import { ref, onMounted, onBeforeUnmount } from 'vue'
import { parseCompetences } from './useCV'

/**
 * Composable for CV template components
 * Handles accent color caching and competences parsing
 */
export const useTemplate = (cvRef: any) => {
  // Cache colors to avoid repeated getComputedStyle calls
  const accentColor = ref('#4f46e5')
  const accentColorDark = ref('#3730a3')
  const accentColorLight = ref('rgba(79, 70, 229, 0.1)')

  // Update colors from CSS variables
  const updateColors = () => {
    if (typeof document !== 'undefined') {
      // Chercher d'abord dans l'élément parent [data-cv-preview]
      const cvPreview = document.querySelector('[data-cv-preview]') as HTMLElement
      const element = cvPreview || document.documentElement
      const computedStyle = getComputedStyle(element)

      const color = computedStyle.getPropertyValue('--accent-color').trim()
      const colorDark = computedStyle.getPropertyValue('--accent-color-dark').trim()
      const colorLight = computedStyle.getPropertyValue('--accent-color-light').trim()

      if (color) accentColor.value = color
      if (colorDark) accentColorDark.value = colorDark
      if (colorLight) accentColorLight.value = colorLight
    }
  }

  let observer: MutationObserver | null = null

  onMounted(() => {
    updateColors()

    // Observer les changements de style sur l'élément CV preview
    if (typeof document !== 'undefined') {
      const cvPreview = document.querySelector('[data-cv-preview]') as HTMLElement
      if (cvPreview) {
        observer = new MutationObserver(() => {
          updateColors()
        })

        observer.observe(cvPreview, {
          attributes: true,
          attributeFilter: ['style']
        })
      }
    }
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    accentColor,
    accentColorDark,
    accentColorLight,
    updateColors,
    parseCompetences
  }
}
