import type { Ref } from 'vue'

export interface SkillGroup {
  name: string
  skills: string
}

export interface CV {
  photo: string
  showPhoto?: boolean
  firstName: string
  lastName: string
  title: string
  about: string
  age?: string
  drivingLicense?: boolean
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
  github: string
  experiences: Array<{
    position: string
    company: string
    contractType?: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    degree: string
    school: string
    city?: string
    year: string
    description: string
  }>
  skillGroups: SkillGroup[]
  languages: Array<{
    name: string
    level: string
  }>
  certifications: Array<{
    name: string
    year: string
  }>
}

// Utility function to parse skills - can be used standalone
export const parseSkills = (skills: string): string[] => {
  if (!skills) return []
  return skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
}

// Get all skills flattened across all groups
export const getAllSkills = (skillGroups: SkillGroup[] | undefined): string[] => {
  if (!skillGroups?.length) return []
  return skillGroups.flatMap(g => parseSkills(g.skills))
}

// Migrate old format (skills: string) to new format (skillGroups: SkillGroup[])
export const migrateCV = (data: any): any => {
  if (!data) return data
  if (!data.skillGroups) {
    data.skillGroups = [{ name: '', skills: data.skills || '' }]
  }
  return data
}

export const useCV = () => {
  const cv = ref<CV>({
    photo: '',
    firstName: '',
    lastName: '',
    title: '',
    about: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    github: '',
    experiences: [{ position: '', company: '', startDate: '', endDate: '', description: '' }],
    education: [{ degree: '', school: '', year: '', description: '' }],
    skillGroups: [{ name: '', skills: '' }],
    languages: [{ name: '', level: 'Intermediate' }],
    certifications: [{ name: '', year: '' }]
  })

  const skillsArray = computed(() => getAllSkills(cv.value.skillGroups))

  const completionPercentage = computed(() => {
    let total = 0
    let filled = 0

    if (cv.value.firstName) filled += 5
    if (cv.value.lastName) filled += 5
    if (cv.value.title) filled += 5
    if (cv.value.about) filled += 5
    if (cv.value.email) filled += 5
    if (cv.value.phone) filled += 5
    if (cv.value.location) filled += 5
    if (cv.value.photo) filled += 5
    total += 40

    if (cv.value.experiences.some(e => e.position && e.company)) filled += 30
    total += 30

    if (cv.value.education.some(f => f.degree && f.school)) filled += 15
    total += 15

    if (cv.value.skillGroups?.some(g => g.skills)) filled += 10
    total += 10

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

    const text = [
      cv.value.about,
      ...cv.value.experiences.map(e => e.description),
      ...cv.value.education.map(f => f.description)
    ].join(' ')
    stats.wordCount = text.split(/\s+/).filter(w => w.length > 0).length
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
    cv,
    skillsArray,
    completionPercentage,
    cvStats,
    cvInsight
  }
}
