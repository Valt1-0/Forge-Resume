import type { Ref } from 'vue'
import type { CV } from './useCV'
import { getAllSkills } from './useCV'
import { countWords } from '~/utils/helpers'

export interface ATSIssue {
  severity: 'error' | 'warning' | 'info'
  category: string
  message: string
  tip: string
}

export interface ATSCategory {
  name: string
  score: number
  maxScore: number
  pct: number
  icon: string
  colorClass: string
  bgClass: string
}

export interface ATSResult {
  score: number
  grade: string
  gradeColor: string
  scoreBg: string
  scoreRing: string
  label: string
  labelColor: string
  categories: ATSCategory[]
  issues: ATSIssue[]
  strengths: string[]
}

const ACTION_VERBS = [
  'led', 'managed', 'developed', 'implemented', 'created', 'designed', 'built',
  'improved', 'increased', 'reduced', 'achieved', 'delivered', 'launched',
  'optimized', 'coordinated', 'established', 'maintained', 'analyzed', 'trained',
  'supervised', 'directed', 'spearheaded', 'initiated', 'transformed', 'generated',
  'streamlined', 'collaborated', 'oversaw', 'mentored', 'negotiated', 'resolved',
  'accelerated', 'automated', 'deployed', 'enhanced', 'integrated', 'migrated',
  'architected', 'contributed', 'drove', 'executed', 'facilitated', 'grew',
  'handled', 'identified', 'owned', 'planned', 'produced', 'proposed', 'rebuilt',
  'refactored', 'reviewed', 'scaled', 'secured', 'shaped', 'tested', 'upgraded'
]

export const useATSCheck = (cv: Ref<CV>) => {
  const atsResult = computed((): ATSResult => {
    const issues: ATSIssue[] = []
    const strengths: string[] = []

    // ── 1. Contact Info (20 pts) ─────────────────────────────────────────────
    let contactScore = 0

    if (cv.value.firstName && cv.value.lastName) {
      contactScore += 5
      strengths.push('Full name provided')
    } else {
      issues.push({
        severity: 'error', category: 'Contact',
        message: 'Missing full name',
        tip: 'Add your first and last name'
      })
    }

    if (cv.value.email) {
      contactScore += 5
    } else {
      issues.push({
        severity: 'error', category: 'Contact',
        message: 'Missing email address',
        tip: 'Add a professional email address'
      })
    }

    if (cv.value.phone) {
      contactScore += 5
    } else {
      issues.push({
        severity: 'warning', category: 'Contact',
        message: 'Missing phone number',
        tip: 'Add a phone number so recruiters can reach you'
      })
    }

    if (cv.value.location) {
      contactScore += 3
    } else {
      issues.push({
        severity: 'warning', category: 'Contact',
        message: 'Missing location',
        tip: 'Add your city and country'
      })
    }

    if (cv.value.linkedin) {
      contactScore += 2
      strengths.push('LinkedIn profile included')
    }

    // ── 2. Professional Summary (20 pts) ──────────────────────────────────────
    let summaryScore = 0
    const aboutWordCount = countWords(cv.value.about || '')

    if (cv.value.about && cv.value.about.trim().length > 0) {
      summaryScore += 5

      if (aboutWordCount >= 30 && aboutWordCount <= 200) {
        summaryScore += 8
        strengths.push('Professional summary well-sized')
      } else if (aboutWordCount < 30) {
        summaryScore += 2
        issues.push({
          severity: 'warning', category: 'Summary',
          message: `Summary too short (${aboutWordCount} words)`,
          tip: 'Aim for 50–150 words in your professional summary'
        })
      } else {
        summaryScore += 4
        issues.push({
          severity: 'info', category: 'Summary',
          message: `Summary may be too long (${aboutWordCount} words)`,
          tip: 'Keep your summary concise (50–150 words) for better ATS parsing'
        })
      }

      const aboutLower = cv.value.about.toLowerCase()
      const hasActionVerbs = ACTION_VERBS.some(v => aboutLower.includes(v))
      if (hasActionVerbs) {
        summaryScore += 7
        strengths.push('Action verbs used in summary')
      } else {
        issues.push({
          severity: 'info', category: 'Summary',
          message: 'No action verbs detected in summary',
          tip: 'Use words like: developed, managed, achieved, led, created…'
        })
      }
    } else {
      issues.push({
        severity: 'error', category: 'Summary',
        message: 'Missing professional summary',
        tip: 'Add a 50–150 word summary highlighting your expertise and goals'
      })
    }

    // ── 3. Work Experience (25 pts) ───────────────────────────────────────────
    let experienceScore = 0
    const validExp = cv.value.experiences.filter(e => e.position && e.company)

    if (validExp.length > 0) {
      experienceScore += 5
      if (validExp.length >= 2) strengths.push(`${validExp.length} work experiences listed`)

      const hasDates = validExp.every(e => e.startDate && e.startDate.length > 0)
      if (hasDates) {
        experienceScore += 5
        strengths.push('All experiences have dates')
      } else {
        issues.push({
          severity: 'warning', category: 'Experience',
          message: 'Some experiences are missing dates',
          tip: 'Add start and end dates for every position (e.g. "Jan 2021 – Present")'
        })
      }

      const allDesc = validExp.map(e => e.description || '').join(' ')
      const hasDescriptions = validExp.some(e => (e.description || '').trim().length > 20)

      if (hasDescriptions) {
        experienceScore += 5

        const descLower = allDesc.toLowerCase()
        const hasActionVerbs = ACTION_VERBS.some(v => descLower.includes(v))
        if (hasActionVerbs) {
          experienceScore += 5
          strengths.push('Action verbs used in experience descriptions')
        } else {
          issues.push({
            severity: 'warning', category: 'Experience',
            message: 'No action verbs in experience descriptions',
            tip: 'Start each bullet with: developed, led, improved, created, managed…'
          })
        }

        const hasMetrics = /\d+\s*(%|k\b|million|thousand|€|\$|£|users|clients|team|member)/i.test(allDesc)
          || /\b\d{2,}\b/.test(allDesc)
        if (hasMetrics) {
          experienceScore += 5
          strengths.push('Quantified achievements detected')
        } else {
          issues.push({
            severity: 'warning', category: 'Experience',
            message: 'No quantified achievements found',
            tip: 'Add metrics: "Improved performance by 30%", "Managed a team of 5"'
          })
        }
      } else {
        issues.push({
          severity: 'warning', category: 'Experience',
          message: 'Missing experience descriptions',
          tip: 'Describe your responsibilities and accomplishments for each role'
        })
      }
    } else {
      issues.push({
        severity: 'error', category: 'Experience',
        message: 'No work experience added',
        tip: 'Add at least one position with company and description'
      })
    }

    // ── 4. Skills (20 pts) ────────────────────────────────────────────────────
    let skillsScore = 0
    const skillsArr = getAllSkills(cv.value.skillGroups)

    if (skillsArr.length > 0) {
      skillsScore += 5
      if (skillsArr.length >= 5) {
        skillsScore += 5
        if (skillsArr.length >= 10) {
          skillsScore += 5
        } else {
          issues.push({
            severity: 'info', category: 'Skills',
            message: `Only ${skillsArr.length} skills listed`,
            tip: 'Add more skills (10–15 is ideal for ATS keyword matching)'
          })
        }
        if (skillsArr.length <= 20) {
          skillsScore += 5
          strengths.push(`Skills section has ${skillsArr.length} keyword-rich entries`)
        } else {
          issues.push({
            severity: 'info', category: 'Skills',
            message: 'Too many skills listed',
            tip: 'Focus on the most relevant 10–20 skills for your target role'
          })
          skillsScore += 3
        }
      } else {
        issues.push({
          severity: 'warning', category: 'Skills',
          message: `Only ${skillsArr.length} skill(s) listed`,
          tip: 'Add at least 5–10 relevant skills to improve ATS keyword matching'
        })
      }
    } else {
      issues.push({
        severity: 'error', category: 'Skills',
        message: 'No skills listed',
        tip: 'Add your technical and professional skills separated by commas'
      })
    }

    // ── 5. Education (15 pts) ─────────────────────────────────────────────────
    let educationScore = 0
    const validEdu = cv.value.education.filter(e => e.degree && e.school)

    if (validEdu.length > 0) {
      educationScore += 5
      educationScore += 5 // has both degree + school

      const hasYears = validEdu.some(e => e.year && e.year.length > 0)
      if (hasYears) {
        educationScore += 5
        strengths.push('Education section is complete')
      } else {
        issues.push({
          severity: 'warning', category: 'Education',
          message: 'Missing education dates',
          tip: 'Add the graduation or attendance year for each degree'
        })
      }
    } else {
      issues.push({
        severity: 'error', category: 'Education',
        message: 'No education added',
        tip: 'Add your highest degree, school name, and graduation year'
      })
    }

    // ── Totals ────────────────────────────────────────────────────────────────
    const raw = contactScore + summaryScore + experienceScore + skillsScore + educationScore
    const maxRaw = 20 + 20 + 25 + 20 + 15 // = 100
    const score = Math.min(100, Math.round((raw / maxRaw) * 100))

    let grade = 'F'
    let gradeColor = 'text-red-600'
    let scoreBg = 'bg-red-50'
    let scoreRing = 'ring-red-400'
    let label = 'Needs Work'
    let labelColor = 'text-red-600'

    if (score >= 90) {
      grade = 'A+'; gradeColor = 'text-green-600'; scoreBg = 'bg-green-50'
      scoreRing = 'ring-green-400'; label = 'Excellent'; labelColor = 'text-green-600'
    } else if (score >= 80) {
      grade = 'A'; gradeColor = 'text-green-600'; scoreBg = 'bg-green-50'
      scoreRing = 'ring-green-400'; label = 'Very Good'; labelColor = 'text-green-600'
    } else if (score >= 70) {
      grade = 'B'; gradeColor = 'text-blue-600'; scoreBg = 'bg-blue-50'
      scoreRing = 'ring-blue-400'; label = 'Good'; labelColor = 'text-blue-600'
    } else if (score >= 55) {
      grade = 'C'; gradeColor = 'text-yellow-600'; scoreBg = 'bg-yellow-50'
      scoreRing = 'ring-yellow-400'; label = 'Average'; labelColor = 'text-yellow-600'
    } else if (score >= 40) {
      grade = 'D'; gradeColor = 'text-orange-600'; scoreBg = 'bg-orange-50'
      scoreRing = 'ring-orange-400'; label = 'Below Average'; labelColor = 'text-orange-600'
    }

    const categories: ATSCategory[] = [
      {
        name: 'Contact Info',
        score: Math.min(contactScore, 20),
        maxScore: 20,
        pct: Math.round((Math.min(contactScore, 20) / 20) * 100),
        icon: 'i-heroicons-identification',
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-500'
      },
      {
        name: 'Summary',
        score: Math.min(summaryScore, 20),
        maxScore: 20,
        pct: Math.round((Math.min(summaryScore, 20) / 20) * 100),
        icon: 'i-heroicons-document-text',
        colorClass: 'text-purple-600',
        bgClass: 'bg-purple-500'
      },
      {
        name: 'Experience',
        score: Math.min(experienceScore, 25),
        maxScore: 25,
        pct: Math.round((Math.min(experienceScore, 25) / 25) * 100),
        icon: 'i-heroicons-briefcase',
        colorClass: 'text-indigo-600',
        bgClass: 'bg-indigo-500'
      },
      {
        name: 'Skills',
        score: Math.min(skillsScore, 20),
        maxScore: 20,
        pct: Math.round((Math.min(skillsScore, 20) / 20) * 100),
        icon: 'i-heroicons-star',
        colorClass: 'text-pink-600',
        bgClass: 'bg-pink-500'
      },
      {
        name: 'Education',
        score: Math.min(educationScore, 15),
        maxScore: 15,
        pct: Math.round((Math.min(educationScore, 15) / 15) * 100),
        icon: 'i-heroicons-academic-cap',
        colorClass: 'text-emerald-600',
        bgClass: 'bg-emerald-500'
      }
    ]

    return {
      score,
      grade,
      gradeColor,
      scoreBg,
      scoreRing,
      label,
      labelColor,
      categories,
      issues,
      strengths
    }
  })

  return { atsResult }
}
