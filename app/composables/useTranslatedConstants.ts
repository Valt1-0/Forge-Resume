import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { COLOR_PRESETS, LANGUAGE_LEVELS } from '~/utils/constants'

export const useTranslatedConstants = () => {
  const { t } = useI18n()

  const tabs = computed(() => [
    {
      id: 'info',
      label: t('tabs.personal'),
      icon: 'i-heroicons-user'
    },
    {
      id: 'experience',
      label: t('tabs.experience'),
      icon: 'i-heroicons-briefcase'
    },
    {
      id: 'education',
      label: t('tabs.education'),
      icon: 'i-heroicons-academic-cap'
    },
    {
      id: 'skills',
      label: t('tabs.skills'),
      icon: 'i-heroicons-star'
    },
    {
      id: 'languages',
      label: t('tabs.languages'),
      icon: 'i-heroicons-language'
    }
  ])

  const templates = computed(() => [
    {
      id: 'modern',
      label: t('templates.modern'),
      description: 'Contemporary design with gradient',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'classic',
      label: t('templates.classic'),
      description: 'Centered and symmetrical',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'minimal',
      label: t('templates.minimal'),
      description: 'Clean with timeline',
      color: 'from-gray-700 to-gray-900'
    },
    {
      id: 'creative',
      label: t('templates.creative'),
      description: 'Colorful asymmetric sidebar',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'elegant',
      label: t('templates.elegant'),
      description: 'Sophisticated with accent bars',
      color: 'from-violet-500 to-purple-600'
    },
    {
      id: 'bold',
      label: t('templates.bold'),
      description: 'Powerful and impactful',
      color: 'from-orange-500 to-red-600'
    }
  ])

  const languageLevels = computed(() => [
    { value: 'Beginner', label: t('languages.beginner') },
    { value: 'Intermediate', label: t('languages.intermediate') },
    { value: 'Fluent', label: t('languages.fluent') },
    { value: 'Native', label: t('languages.native') },
    { value: 'Bilingual', label: t('languages.bilingual') },
    { value: 'A1', label: t('languages.a1') },
    { value: 'A2', label: t('languages.a2') },
    { value: 'B1', label: t('languages.b1') },
    { value: 'B2', label: t('languages.b2') },
    { value: 'C1', label: t('languages.c1') },
    { value: 'C2', label: t('languages.c2') }
  ])

  const skillLevels = computed(() => [
    { value: 'beginner', label: t('skills.beginner') },
    { value: 'intermediate', label: t('skills.intermediate') },
    { value: 'advanced', label: t('skills.advanced') },
    { value: 'expert', label: t('skills.expert') }
  ])

  return {
    tabs,
    templates,
    languageLevels,
    skillLevels,
    colorPresets: COLOR_PRESETS,
    languageLevelsRaw: LANGUAGE_LEVELS
  }
}
