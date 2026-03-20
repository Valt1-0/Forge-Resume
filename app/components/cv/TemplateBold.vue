<template>
  <div class="flex h-full w-full">
    <!-- Black sidebar -->
    <div class="w-2 bg-(--accent-color) shrink-0"></div>

    <!-- Main content -->
    <div class="flex-1 bg-white px-9 py-10">
      <!-- Powerful header -->
      <div class="mb-10">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h1 class="text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-3">
              {{ cv.firstName }}<br/>{{ cv.lastName }}
            </h1>
            <div :class="`w-24 h-2 bg-(--accent-color) mb-4`"></div>
            <h2 :class="`text-2xl font-bold text-(--accent-color) uppercase tracking-wide`">{{ cv.title }}</h2>
          </div>

          <!-- Square photo -->
          <template v-if="cv.showPhoto">
            <div v-if="cv.photo" class="shrink-0 ml-8">
              <img :src="cv.photo" alt="Photo" class="w-40 h-40 object-cover border-8 border-gray-900 shadow-2xl" />
            </div>
            <div v-else class="shrink-0 ml-8">
              <div class="w-40 h-40 bg-gray-900 flex items-center justify-center border-8 border-gray-800">
                <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </template>
        </div>

        <!-- Contact bar -->
        <div class="flex flex-wrap gap-6 text-xs font-bold text-gray-700 uppercase tracking-wider border-t-2 border-b-2 border-gray-900 py-3">
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
      </div>

      <!-- About -->
      <div v-if="cv.about" class="mb-10">
        <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-3">
          <div :class="`w-12 h-1 bg-(--accent-color)`"></div>
          ABOUT
        </h3>
        <p class="text-sm text-gray-700 leading-relaxed font-medium">{{ cv.about }}</p>
      </div>

      <!-- 2-column layout -->
      <div class="grid grid-cols-[1.3fr_1fr] gap-10">
        <!-- Main column -->
        <div class="space-y-8">
          <!-- Experience -->
          <div v-if="cv.experiences.some(e => e.position)">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
              <div :class="`w-12 h-1 bg-(--accent-color)`"></div>
              EXPERIENCE
            </h3>
            <div class="space-y-6">
              <div v-for="(exp, index) in cv.experiences" :key="index" v-show="exp.position" class="border-l-4 border-(--accent-color) pl-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-lg font-black text-gray-900 uppercase">{{ exp.position }}</h4>
                  <span :class="`text-xs font-black text-white bg-(--accent-color) px-3 py-1 uppercase tracking-wider whitespace-nowrap ml-4`">
                    <template v-if="exp.startDate && exp.endDate">{{ exp.startDate }} - {{ exp.endDate }}</template>
                    <template v-else>{{ exp.startDate || exp.endDate }}</template>
                  </span>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <p class="text-sm font-bold text-gray-700 uppercase tracking-wide">{{ exp.company }}</p>
                  <span v-if="exp.contractType" class="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium normal-case tracking-normal">
                    {{ exp.contractType }}
                  </span>
                </div>
                <p v-if="exp.description" class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ exp.description }}</p>
              </div>
            </div>
          </div>

          <!-- Education -->
          <div v-if="cv.education.some(f => f.degree)">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
              <div :class="`w-12 h-1 bg-(--accent-color)`"></div>
              EDUCATION
            </h3>
            <div class="space-y-6">
              <div v-for="(edu, index) in cv.education" :key="index" v-show="edu.degree" class="border-l-4 border-gray-300 pl-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-base font-black text-gray-900 uppercase">{{ edu.degree }}</h4>
                  <span class="text-xs font-black text-gray-600 bg-gray-100 px-3 py-1 uppercase tracking-wider whitespace-nowrap ml-4">
                    {{ edu.year }}
                  </span>
                </div>
                <p class="text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">{{ edu.school }}</p>
                <p v-if="edu.city" class="text-xs text-gray-500 mb-2 font-semibold flex items-center gap-1">
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
        <div class="space-y-8">
          <!-- Skills -->
          <div v-if="cv.skills">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">{{ t('skills.title').toUpperCase() }}</h3>
            <div class="space-y-2">
              <div v-for="(comp, index) in skillsArray" :key="index"
                   :class="`text-xs font-bold text-white bg-(--accent-color) px-3 py-2 uppercase tracking-wide`">
                {{ comp }}
              </div>
            </div>
          </div>

          <!-- Languages -->
          <div v-if="cv.languages.some(l => l.name)">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">{{ t('languages.title').toUpperCase() }}</h3>
            <div class="space-y-3">
              <div v-for="(lang, index) in cv.languages" :key="index" v-show="lang.name" class="border-l-4 border-(--accent-color) pl-3">
                <div class="text-sm font-black text-gray-900 uppercase">{{ lang.name }}</div>
                <div class="text-xs font-semibold text-gray-600">{{ lang.level }}</div>
              </div>
            </div>
          </div>

          <!-- Certifications -->
          <div v-if="cv.certifications && cv.certifications.some(c => c.name)">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">{{ t('personal.certifications').toUpperCase() }}</h3>
            <div class="space-y-3">
              <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.name" class="bg-gray-50 p-3 border-l-4 border-gray-300">
                <div class="text-xs font-bold text-gray-900">{{ cert.name }}</div>
                <div v-if="cert.year" class="text-xs font-semibold text-gray-600 mt-1">{{ cert.year }}</div>
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
