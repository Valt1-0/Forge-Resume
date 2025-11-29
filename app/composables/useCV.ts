import type { Ref } from 'vue'

export interface CV {
  photo: string
  showPhoto?: boolean
  prenom: string
  nom: string
  titre: string
  apropos: string
  age?: string
  permis?: boolean
  email: string
  telephone: string
  localisation: string
  linkedin: string
  website: string
  github: string
  experiences: Array<{
    poste: string
    entreprise: string
    dateDebut: string
    dateFin: string
    description: string
  }>
  formations: Array<{
    diplome: string
    ecole: string
    ville?: string
    annee: string
    description: string
  }>
  competences: string
  langues: Array<{
    nom: string
    niveau: string
  }>
  certifications: Array<{
    nom: string
    annee: string
  }>
}

// Utility function to parse skills - can be used standalone
export const parseCompetences = (competences: string): string[] => {
  if (!competences) return []
  return competences.split(',').map(c => c.trim()).filter(c => c.length > 0)
}

export const useCV = () => {
  const cv = ref<CV>({
    photo: '',
    prenom: '',
    nom: '',
    titre: '',
    apropos: '',
    email: '',
    telephone: '',
    localisation: '',
    linkedin: '',
    website: '',
    github: '',
    experiences: [{ poste: '', entreprise: '', dateDebut: '', dateFin: '', description: '' }],
    formations: [{ diplome: '', ecole: '', annee: '', description: '' }],
    competences: '',
    langues: [{ nom: '', niveau: 'Intermédiaire' }],
    certifications: [{ nom: '', annee: '' }]
  })

  const competencesArray = computed(() => parseCompetences(cv.value.competences))

  const completionPercentage = computed(() => {
    let total = 0
    let filled = 0

    if (cv.value.prenom) filled += 5
    if (cv.value.nom) filled += 5
    if (cv.value.titre) filled += 5
    if (cv.value.apropos) filled += 5
    if (cv.value.email) filled += 5
    if (cv.value.telephone) filled += 5
    if (cv.value.localisation) filled += 5
    if (cv.value.photo) filled += 5
    total += 40

    if (cv.value.experiences.some(e => e.poste && e.entreprise)) filled += 30
    total += 30

    if (cv.value.formations.some(f => f.diplome && f.ecole)) filled += 15
    total += 15

    if (cv.value.competences) filled += 10
    total += 10

    if (cv.value.langues.some(l => l.nom)) filled += 5
    total += 5

    return Math.round((filled / total) * 100)
  })

  const cvStats = computed(() => {
    const stats = {
      wordCount: 0,
      experienceYears: 0,
      educationCount: cv.value.formations.filter(f => f.diplome).length,
      skillCount: competencesArray.value.length,
      languageCount: cv.value.langues.filter(l => l.nom).length,
      certificationCount: cv.value.certifications?.filter(c => c.nom).length || 0
    }

    const text = [
      cv.value.apropos,
      ...cv.value.experiences.map(e => e.description),
      ...cv.value.formations.map(f => f.description)
    ].join(' ')
    stats.wordCount = text.split(/\s+/).filter(w => w.length > 0).length
    stats.experienceYears = cv.value.experiences.filter(e => e.poste).length * 2.5

    return stats
  })

  const cvInsight = computed(() => {
    const completion = completionPercentage.value
    if (completion === 100) return { text: 'CV complet ! Prêt à impressionner les recruteurs', color: 'text-green-600', icon: '🎉' }
    if (completion >= 80) return { text: 'Presque parfait ! Quelques détails à ajouter', color: 'text-blue-600', icon: '⭐' }
    if (completion >= 60) return { text: 'Bon début ! Continuez à remplir les sections', color: 'text-indigo-600', icon: '💪' }
    if (completion >= 40) return { text: 'En cours... Ajoutez plus d\'informations', color: 'text-yellow-600', icon: '📝' }
    return { text: 'Démarrez votre CV en ajoutant vos informations', color: 'text-gray-600', icon: '🚀' }
  })

  return {
    cv,
    competencesArray,
    completionPercentage,
    cvStats,
    cvInsight
  }
}
