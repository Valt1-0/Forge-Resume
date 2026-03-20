<template>
  <div class="flex flex-col items-center px-10 py-12 bg-white h-full w-full">
    <!-- En-tête centré avec photo -->
    <div class="text-center mb-10 pb-8 border-b border-gray-200 w-full">
      <template v-if="cv.showPhoto">
        <div v-if="cv.photo" class="mb-6">
          <img :src="cv.photo" alt="Photo" class="w-28 h-28 rounded-full border-4 border-gray-100 object-cover mx-auto" />
        </div>
        <div v-else class="mb-6">
          <div class="w-28 h-28 rounded-full border-4 border-gray-100 bg-gray-50 flex items-center justify-center mx-auto">
            <svg class="w-14 h-14 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </template>
      <h1 :class="`text-5xl font-normal text-(--accent-color) mb-2 font-serif`">
        {{ cv.firstName }} {{ cv.lastName }}
      </h1>
      <h2 class="text-xl text-gray-500 font-medium italic mb-6 font-serif">{{ cv.title }}</h2>

      <!-- Contact en ligne -->
      <div class="flex flex-wrap justify-center gap-6 text-xs text-gray-600">
        <span v-if="cv.email" class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          {{ cv.email }}
        </span>
        <span v-if="cv.phone" class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          {{ cv.phone }}
        </span>
        <span v-if="cv.location" class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          {{ cv.location }}
        </span>
        <span v-if="cv.age" class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          {{ cv.age }} ans
        </span>
        <span v-if="cv.drivingLicense" class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5A1.5 1.5 0 0 1 6.5 13A1.5 1.5 0 0 1 8 14.5A1.5 1.5 0 0 1 6.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8l-2.08-6Z"/>
          </svg>
          {{ t('personal.license') }}
        </span>
        <span v-if="cv.linkedin" class="flex items-center gap-1.5">LinkedIn</span>
        <span v-if="cv.website" class="flex items-center gap-1.5">{{ cv.website }}</span>
      </div>
    </div>

    <!-- About -->
    <div v-if="cv.about" class="mb-8 w-full">
      <h3 :class="`text-lg font-semibold text-(--accent-color) mb-3 text-center font-serif`">{{ t('personal.about') }}</h3>
      <p class="text-gray-700 text-center leading-relaxed text-sm max-w-[90%] mx-auto">{{ cv.about }}</p>
    </div>

    <!-- 2-column body -->
    <div class="grid grid-cols-2 gap-10 w-full">
      <!-- Left column -->
      <div>
        <!-- Experience -->
        <div v-if="cv.experiences.some(e => e.position)" class="mb-8">
          <h3 :class="`text-lg font-semibold text-(--accent-color) mb-4 font-serif`">{{ t('experience.title') }}</h3>
          <div class="space-y-4">
            <div v-for="(exp, index) in cv.experiences" :key="index" v-show="exp.position" class="border-l-2 border-gray-200 pl-4">
              <div class="flex justify-between items-start mb-1">
                <h4 class="text-base font-semibold text-gray-800">{{ exp.position }}</h4>
                <span class="text-xs text-gray-400 whitespace-nowrap ml-3">
                  <template v-if="exp.startDate && exp.endDate">{{ exp.startDate }} - {{ exp.endDate }}</template>
                  <template v-else>{{ exp.startDate || exp.endDate }}</template>
                </span>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <p class="text-sm text-gray-600 font-medium">{{ exp.company }}</p>
                <span v-if="exp.contractType" class="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                  {{ exp.contractType }}
                </span>
              </div>
              <p v-if="exp.description" class="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{{ exp.description }}</p>
            </div>
          </div>
        </div>

        <!-- Certifications -->
        <div v-if="cv.certifications && cv.certifications.some(c => c.name)" class="mb-8">
          <h3 :class="`text-lg font-semibold text-(--accent-color) mb-4 font-serif`">{{ t('personal.certifications') }}</h3>
          <div class="flex flex-col gap-2.5">
            <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.name" class="text-sm text-gray-600">
              <span class="font-semibold">{{ cert.name }}</span>
              <span v-if="cert.year" class="text-gray-400"> - {{ cert.year }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div>
        <!-- Education -->
        <div v-if="cv.education.some(f => f.degree)" class="mb-8">
          <h3 :class="`text-lg font-semibold text-(--accent-color) mb-4 font-serif`">{{ t('education.title') }}</h3>
          <div class="space-y-4">
            <div v-for="(form, index) in cv.education" :key="index" v-show="form.degree" class="border-l-2 border-gray-200 pl-4">
              <div class="flex justify-between items-start mb-1">
                <h4 class="text-base font-semibold text-gray-800">{{ form.degree }}</h4>
                <span class="text-xs text-gray-400 whitespace-nowrap ml-3">{{ form.year }}</span>
              </div>
              <p class="text-sm text-gray-600 font-medium mb-1">{{ form.school }}</p>
              <p v-if="form.city" class="text-xs text-gray-500 mb-2">{{ form.city }}</p>
              <p v-if="form.description" class="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{{ form.description }}</p>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div v-if="cv.skills" class="mb-8">
          <h3 :class="`text-lg font-semibold text-(--accent-color) mb-4 font-serif`">{{ t('skills.title') }}</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="(comp, index) in skillsArray" :key="index"
                  :class="`bg-(--accent-color-light) text-(--accent-color) px-2.5 py-1.5 rounded text-xs font-medium`">
              {{ comp }}
            </span>
          </div>
        </div>

        <!-- Languages -->
        <div v-if="cv.languages.some(l => l.name)" class="mb-8">
          <h3 :class="`text-lg font-semibold text-(--accent-color) mb-4 font-serif`">{{ t('languages.title') }}</h3>
          <div class="flex flex-col gap-2 text-sm text-gray-600">
            <div v-for="(langue, index) in cv.languages" :key="index" v-show="langue.name">
              <span class="font-semibold">{{ langue.name }}</span>
              <span class="text-gray-400"> - {{ langue.level }}</span>
            </div>
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
