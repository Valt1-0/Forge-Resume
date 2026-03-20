<template>
  <div class="px-10 py-12 bg-white h-full w-full">
    <!-- Minimalist horizontal header -->
    <div class="flex justify-between items-start mb-12 pb-6 border-b-2 border-gray-900">
      <div class="flex-1">
        <h1 class="text-5xl font-light text-gray-900 mb-1 tracking-tight">
          {{ cv.firstName }} <span class="font-bold">{{ cv.lastName }}</span>
        </h1>
        <h2 :class="`text-lg text-[var(--accent-color)] font-medium tracking-wider uppercase`">{{ cv.title }}</h2>
      </div>
      <template v-if="cv.showPhoto">
        <div v-if="cv.photo" class="flex-shrink-0 ml-8">
          <img :src="cv.photo" alt="Photo" class="w-24 h-24 rounded object-cover border-2 border-gray-200" />
        </div>
        <div v-else class="flex-shrink-0 ml-8">
          <div class="w-24 h-24 rounded bg-gray-50 flex items-center justify-center border-2 border-gray-200">
            <svg class="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </template>
    </div>

    <!-- Contact horizontal -->
    <div class="flex flex-wrap gap-8 mb-10 text-xs text-gray-500">
      <span v-if="cv.email">{{ cv.email }}</span>
      <span v-if="cv.phone">{{ cv.phone }}</span>
      <span v-if="cv.location">{{ cv.location }}</span>
      <span v-if="cv.age">{{ cv.age }} ans</span>
      <span v-if="cv.drivingLicense" class="flex items-center gap-1.5">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5A1.5 1.5 0 0 1 6.5 13A1.5 1.5 0 0 1 8 14.5A1.5 1.5 0 0 1 6.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8l-2.08-6Z"/>
        </svg>
        {{ t('personal.license') }}
      </span>
      <span v-if="cv.linkedin">{{ cv.linkedin }}</span>
      <span v-if="cv.website">{{ cv.website }}</span>
    </div>

    <!-- About -->
    <div v-if="cv.about" class="mb-10">
      <p class="text-gray-600 leading-relaxed text-sm text-justify">{{ cv.about }}</p>
    </div>

    <!-- Timeline layout for Experience and Education -->
    <div class="flex flex-col gap-10">
      <!-- Experience -->
      <div v-if="cv.experiences.some(e => e.position)">
        <h3 class="text-xs font-bold text-gray-900 mb-6 uppercase tracking-widest">{{ t('experience.title') }}</h3>
        <div class="flex flex-col gap-8">
          <div v-for="(exp, index) in cv.experiences" :key="index" v-show="exp.position" class="grid grid-cols-[140px_1fr] gap-8">
            <div class="text-right pt-0.5">
              <div class="text-2xs text-gray-400 font-semibold whitespace-nowrap">
                <template v-if="exp.startDate && exp.endDate">{{ exp.startDate }} - {{ exp.endDate }}</template>
                <template v-else>{{ exp.startDate || exp.endDate }}</template>
              </div>
            </div>
            <div class="border-l-2 border-gray-200 pl-6 relative">
              <div :class="`absolute left-[-6px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent-color)]`"></div>
              <h4 class="text-base font-bold text-gray-900 mb-1">{{ exp.position }}</h4>
              <div class="flex items-center gap-2 mb-2">
                <p :class="`text-sm text-[var(--accent-color)] font-semibold`">{{ exp.company }}</p>
                <span v-if="exp.contractType" class="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                  {{ exp.contractType }}
                </span>
              </div>
              <p v-if="exp.description" class="text-gray-500 text-sm leading-relaxed text-justify whitespace-pre-line">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Education -->
      <div v-if="cv.education.some(f => f.degree)">
        <h3 class="text-xs font-bold text-gray-900 mb-6 uppercase tracking-widest">{{ t('education.title') }}</h3>
        <div class="flex flex-col gap-8">
          <div v-for="(edu, index) in cv.education" :key="index" v-show="edu.degree" class="grid grid-cols-[140px_1fr] gap-8">
            <div class="text-right pt-0.5">
              <div class="text-2xs text-gray-400 font-semibold">{{ edu.year }}</div>
            </div>
            <div class="border-l-2 border-gray-200 pl-6 relative">
              <div :class="`absolute left-[-6px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent-color)]`"></div>
              <h4 class="text-base font-bold text-gray-900 mb-1">{{ edu.degree }}</h4>
              <p :class="`text-sm text-[var(--accent-color)] font-semibold mb-1`">{{ edu.school }}</p>
              <p v-if="edu.city" class="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                {{ edu.city }}
              </p>
              <p v-if="edu.description" class="text-gray-500 text-sm leading-relaxed text-justify whitespace-pre-line">{{ edu.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills and Languages inline -->
      <div class="grid grid-cols-2 gap-10">
        <!-- Skills -->
        <div v-if="cv.skills">
          <h3 class="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">{{ t('skills.title') }}</h3>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="(comp, index) in skillsArray" :key="index"
                  class="bg-gray-100 text-gray-700 px-2.5 py-1.5 text-2xs font-medium">
              {{ comp }}
            </span>
          </div>
        </div>

        <!-- Languages -->
        <div v-if="cv.languages.some(l => l.name)">
          <h3 class="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">{{ t('languages.title') }}</h3>
          <div class="flex flex-col gap-1.5 text-xs text-gray-600">
            <div v-for="(lang, index) in cv.languages" :key="index" v-show="lang.name">
              <span class="font-semibold">{{ lang.name }}</span>
              <span class="text-gray-400"> - {{ lang.level }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Certifications -->
      <div v-if="cv.certifications && cv.certifications.some(c => c.name)">
        <h3 class="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">{{ t('personal.certifications') }}</h3>
        <div class="flex flex-wrap gap-3">
          <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.name" class="text-xs text-gray-600">
            <span class="font-semibold">{{ cert.name }}</span>
            <span v-if="cert.year" class="text-gray-400"> ({{ cert.year }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTemplate } from '~/composables/useTemplate'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  cv: {
    type: Object,
    required: true
  }
})

const { parseSkills } = useTemplate(props.cv)
const skillsArray = computed(() => parseSkills(props.cv.skills))
</script>
