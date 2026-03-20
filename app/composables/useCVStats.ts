import type { Ref } from 'vue'
import type { CV } from './useCV'
import { parseSkills } from './useCV'
import { countWords } from '~/utils/helpers'

/**
 * Composable pour calculer les statistiques d'un CV
 * Accepte une référence CV externe
 */
export const useCVStats = (cv: Ref<CV>) => {
  const skillsArray = computed(() => parseSkills(cv.value.skills))

  const completionPercentage = computed(() => {
    let total = 0
    let filled = 0

    // Champs basiques (40 points)
    if (cv.value.firstName) filled += 5
    if (cv.value.lastName) filled += 5
    if (cv.value.title) filled += 5
    if (cv.value.about) filled += 5
    if (cv.value.email) filled += 5
    if (cv.value.phone) filled += 5
    if (cv.value.location) filled += 5
    if (cv.value.photo) filled += 5
    total += 40

    // Expériences (30 points)
    if (cv.value.experiences.some(e => e.position && e.company)) filled += 30
    total += 30

    // Formations (15 points)
    if (cv.value.education.some(f => f.degree && f.school)) filled += 15
    total += 15

    // Compétences (10 points)
    if (cv.value.skills) filled += 10
    total += 10

    // Langues (5 points)
    if (cv.value.languages.some(l => l.name)) filled += 5
    total += 5

    return Math.round((filled / total) * 100)
  })

  const cvStats = computed(() => {
    const stats = {
      wordCount: 0,
      experienceYears: 0,
      educationCount: cv.value.education.filter(f => f.degree).length,
      skillCount: skillsArray.value.length,
      languageCount: cv.value.languages.filter(l => l.name).length,
      certificationCount: cv.value.certifications?.filter(c => c.name).length || 0
    }

    // Compter les mots de manière optimisée
    const text = [
      cv.value.about || '',
      ...cv.value.experiences.map(e => e.description || ''),
      ...cv.value.education.map(f => f.description || '')
    ].join(' ')
    stats.wordCount = countWords(text)

    // Calculer les années d'expérience (approximation)
    stats.experienceYears = cv.value.experiences.filter(e => e.position).length * 2.5

    return stats
  })

  const cvInsight = computed(() => {
    const completion = completionPercentage.value
    if (completion === 100) return { text: 'CV complete! Ready to impress recruiters', color: 'text-green-600', icon: '🎉' }
    if (completion >= 80) return { text: 'Almost perfect! A few details to add', color: 'text-blue-600', icon: '⭐' }
    if (completion >= 60) return { text: 'Good start! Continue filling the sections', color: 'text-indigo-600', icon: '💪' }
    if (completion >= 40) return { text: 'In progress... Add more information', color: 'text-yellow-600', icon: '📝' }
    return { text: 'Start your CV by adding your information', color: 'text-gray-600', icon: '🚀' }
  })

  return {
    skillsArray,
    completionPercentage,
    cvStats,
    cvInsight
  }
}
