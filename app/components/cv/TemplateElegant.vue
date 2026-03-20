<template>
  <div class="flex flex-col h-full w-full bg-white">
    <!-- Header with side photo -->
    <div class="relative px-10 pt-9 pb-5 border-b-4 border-(--accent-color)">
      <div class="flex items-start gap-6">
        <!-- Photo -->
        <template v-if="cv.showPhoto">
          <div v-if="cv.photo" class="shrink-0">
            <img :src="cv.photo" alt="Photo" class="w-26 h-26 rounded-2xl object-cover shadow-xl border-4 border-white ring-2 ring-(--accent-color)/20" />
          </div>
          <div v-else class="shrink-0">
            <div class="w-26 h-26 rounded-2xl bg-gray-100 flex items-center justify-center shadow-lg border-4 border-white ring-2 ring-gray-200">
              <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </template>

        <!-- Main information -->
        <div class="flex-1">
          <h1 class="text-5xl font-light text-gray-900 mb-1.5 tracking-tight">
            {{ cv.firstName }} <span class="font-semibold">{{ cv.lastName }}</span>
          </h1>
          <h2 :class="`text-2xl font-light text-(--accent-color) mb-4 italic`">{{ cv.title }}</h2>

          <!-- Compact contact -->
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600">
            <span v-if="cv.email" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {{ cv.email }}
            </span>
            <span v-if="cv.phone" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {{ cv.phone }}
            </span>
            <span v-if="cv.location" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              {{ cv.location }}
            </span>
            <span v-if="cv.age" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              {{ cv.age }} ans
            </span>
            <span v-if="cv.drivingLicense" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5A1.5 1.5 0 0 1 6.5 13A1.5 1.5 0 0 1 8 14.5A1.5 1.5 0 0 1 6.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8l-2.08-6Z"/>
              </svg>
              {{ t('personal.license') }}
            </span>
            <span v-if="cv.linkedin" class="flex items-center gap-2">{{ cv.linkedin }}</span>
            <span v-if="cv.website" class="flex items-center gap-2">{{ cv.website }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- CV Body -->
    <div class="flex-1 px-10 py-6">
      <!-- About -->
      <div v-if="cv.about" class="mb-6">
        <div class="flex items-center gap-3 mb-3">
          <div :class="`w-2 h-7 bg-(--accent-color) rounded-full`"></div>
          <h3 class="text-xl font-light text-gray-900 tracking-wide">Profile</h3>
        </div>
        <p class="text-gray-700 leading-relaxed text-sm text-justify pl-5">{{ cv.about }}</p>
      </div>

      <!-- 2-column layout -->
      <div class="grid grid-cols-[1.5fr_1fr] gap-8">
        <!-- Main column -->
        <div class="space-y-6">
          <!-- Experience -->
          <div v-if="cv.experiences.some(e => e.position)">
            <div class="flex items-center gap-3 mb-4">
              <div :class="`w-2 h-7 bg-(--accent-color) rounded-full`"></div>
              <h3 class="text-xl font-light text-gray-900 tracking-wide">{{ t('experience.title') }}</h3>
            </div>
            <div class="pl-5 space-y-4">
              <div v-for="(exp, index) in cv.experiences" :key="index" v-show="exp.position" class="relative">
                <div class="flex justify-between items-baseline mb-1.5">
                  <h4 class="text-base font-semibold text-gray-900">{{ exp.position }}</h4>
                  <span class="text-xs font-medium text-gray-500 whitespace-nowrap ml-4">
                    <template v-if="exp.startDate && exp.endDate">{{ exp.startDate }} - {{ exp.endDate }}</template>
                    <template v-else>{{ exp.startDate || exp.endDate }}</template>
                  </span>
                </div>
                <div class="flex items-center gap-2 mb-1.5">
                  <p :class="`text-sm font-medium text-(--accent-color)`">{{ exp.company }}</p>
                  <span v-if="exp.contractType" class="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {{ exp.contractType }}
                  </span>
                </div>
                <p v-if="exp.description" class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ exp.description }}</p>
              </div>
            </div>
          </div>

          <!-- Education -->
          <div v-if="cv.education.some(f => f.degree)">
            <div class="flex items-center gap-3 mb-4">
              <div :class="`w-2 h-7 bg-(--accent-color) rounded-full`"></div>
              <h3 class="text-xl font-light text-gray-900 tracking-wide">{{ t('education.title') }}</h3>
            </div>
            <div class="pl-5 space-y-3.5">
              <div v-for="(edu, index) in cv.education" :key="index" v-show="edu.degree">
                <div class="flex justify-between items-baseline mb-1.5">
                  <h4 class="text-base font-semibold text-gray-900">{{ edu.degree }}</h4>
                  <span class="text-xs font-medium text-gray-500 whitespace-nowrap ml-4">{{ edu.year }}</span>
                </div>
                <p :class="`text-sm font-medium text-(--accent-color) mb-1`">{{ edu.school }}</p>
                <p v-if="edu.city" class="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  {{ edu.city }}
                </p>
                <p v-if="edu.description" class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ edu.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar column -->
        <div class="space-y-6">
          <!-- Skills -->
          <div v-if="cv.skills">
            <div class="flex items-center gap-3 mb-3">
              <div :class="`w-2 h-6 bg-(--accent-color) rounded-full`"></div>
              <h3 class="text-lg font-light text-gray-900">{{ t('skills.title') }}</h3>
            </div>
            <div class="pl-5 grid grid-cols-2 gap-1.5">
              <div v-for="(comp, index) in skillsArray" :key="index"
                   :class="`text-xs px-2 py-1.5 text-gray-700 font-medium border-l-2 border-(--accent-color)/40 bg-gray-50/50 hover:bg-gray-100/70 transition-colors`">
                {{ comp }}
              </div>
            </div>
          </div>

          <!-- Languages -->
          <div v-if="cv.languages.some(l => l.name)">
            <div class="flex items-center gap-3 mb-3">
              <div :class="`w-2 h-6 bg-(--accent-color) rounded-full`"></div>
              <h3 class="text-lg font-light text-gray-900">{{ t('languages.title') }}</h3>
            </div>
            <div class="pl-5 space-y-2">
              <div v-for="(lang, index) in cv.languages" :key="index" v-show="lang.name" class="flex justify-between items-baseline border-l-2 border-(--accent-color)/30 pl-3 py-1">
                <span class="text-sm font-semibold text-gray-900">{{ lang.name }}</span>
                <span class="text-xs text-gray-600 font-medium">{{ lang.level }}</span>
              </div>
            </div>
          </div>

          <!-- Certifications -->
          <div v-if="cv.certifications && cv.certifications.some(c => c.name)">
            <div class="flex items-center gap-3 mb-3">
              <div :class="`w-2 h-6 bg-(--accent-color) rounded-full`"></div>
              <h3 class="text-lg font-light text-gray-900">{{ t('personal.certifications') }}</h3>
            </div>
            <div class="pl-5 space-y-2">
              <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.name" class="flex justify-between items-baseline border-l-2 border-(--accent-color)/30 pl-3 py-1">
                <span class="text-sm font-semibold text-gray-900 flex-1 pr-2 leading-snug">{{ cert.name }}</span>
                <span v-if="cert.year" class="text-xs text-gray-600 font-medium whitespace-nowrap">{{ cert.year }}</span>
              </div>
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
