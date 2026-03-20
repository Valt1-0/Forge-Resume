<template>
  <div class="grid grid-cols-[250px_1fr] h-full w-full">
    <!-- Colored left sidebar -->
    <div :class="`bg-[var(--accent-color)] text-white px-6 py-8 flex flex-col`">
      <!-- Photo -->
      <template v-if="cv.showPhoto">
        <div v-if="cv.photo" class="mb-8">
          <img :src="cv.photo" alt="Photo" class="w-full aspect-square object-cover rounded-lg border-4 border-white/30" />
        </div>
        <div v-else class="mb-8">
          <div class="w-full aspect-square rounded-lg border-4 border-white/30 bg-white/20 flex items-center justify-center">
            <svg class="w-16 h-16 text-white/80" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </template>

      <!-- Contact -->
      <div class="mb-8">
        <h3 class="text-2xs font-extrabold tracking-wider mb-4 opacity-90">CONTACT</h3>
        <div class="flex flex-col gap-3 text-2xs">
          <div v-if="cv.email" class="break-all leading-snug">{{ cv.email }}</div>
          <div v-if="cv.phone">{{ cv.phone }}</div>
          <div v-if="cv.location" class="leading-snug">{{ cv.location }}</div>
          <div v-if="cv.age">{{ cv.age }} ans</div>
          <div v-if="cv.drivingLicense" class="flex items-center gap-1.5">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5A1.5 1.5 0 0 1 6.5 13A1.5 1.5 0 0 1 8 14.5A1.5 1.5 0 0 1 6.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8l-2.08-6Z"/>
            </svg>
            {{ t('personal.license') }}
          </div>
          <div v-if="cv.linkedin" class="break-all leading-snug">{{ cv.linkedin }}</div>
          <div v-if="cv.website" class="break-all leading-snug">{{ cv.website }}</div>
        </div>
      </div>

      <!-- Skills -->
      <div v-if="cv.skills" class="mb-8">
        <h3 class="text-2xs font-extrabold tracking-wider mb-4 opacity-90">SKILLS</h3>
        <div class="flex flex-col gap-2 text-2xs leading-relaxed">
          <div v-for="(comp, index) in skillsArray" :key="index">• {{ comp }}</div>
        </div>
      </div>

      <!-- Languages -->
      <div v-if="cv.languages.some(l => l.name)" class="mb-8">
        <h3 class="text-2xs font-extrabold tracking-wider mb-4 opacity-90">LANGUAGES</h3>
        <div class="flex flex-col gap-2.5 text-2xs">
          <div v-for="(lang, index) in cv.languages" :key="index" v-show="lang.name">
            <div class="font-bold mb-0.5">{{ lang.name }}</div>
            <div class="opacity-85 text-[0.65rem]">{{ lang.level }}</div>
          </div>
        </div>
      </div>

      <!-- Certifications -->
      <div v-if="cv.certifications && cv.certifications.some(c => c.name)">
        <h3 class="text-2xs font-extrabold tracking-wider mb-4 opacity-90">CERTIFICATIONS</h3>
        <div class="flex flex-col gap-2.5 text-2xs leading-snug">
          <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.name">
            <div class="font-semibold">{{ cert.name }}</div>
            <div v-if="cert.year" class="opacity-85 text-[0.65rem]">{{ cert.year }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="px-7 py-10 pl-6 bg-white">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-5xl font-black text-gray-900 mb-1 uppercase tracking-tight leading-tight">
          {{ cv.firstName }}<br/>{{ cv.lastName }}
        </h1>
        <h2 :class="`text-xl text-[var(--accent-color)] font-bold mb-6`">{{ cv.title }}</h2>
        <div :class="`w-16 h-1 bg-[var(--accent-color)]`"></div>
      </div>

      <!-- About -->
      <div v-if="cv.about" class="mb-10">
        <h3 :class="`text-sm font-extrabold text-[var(--accent-color)] mb-3 uppercase tracking-wider`">{{ t('personal.about') }}</h3>
        <p class="text-gray-700 leading-relaxed text-sm text-justify">{{ cv.about }}</p>
      </div>

      <!-- Experience -->
      <div v-if="cv.experiences.some(e => e.position)" class="mb-10">
        <h3 :class="`text-sm font-extrabold text-[var(--accent-color)] mb-5 uppercase tracking-wider`">{{ t('experience.title') }}</h3>
        <div class="flex flex-col gap-6">
          <div v-for="(exp, index) in cv.experiences" :key="index" v-show="exp.position">
            <div class="flex justify-between items-start mb-1.5 flex-wrap gap-2">
              <div>
                <h4 class="text-base font-extrabold text-gray-900 mb-0.5">{{ exp.position }}</h4>
                <div class="flex items-center gap-2">
                  <p class="text-sm text-gray-500 font-semibold">{{ exp.company }}</p>
                  <span v-if="exp.contractType" class="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {{ exp.contractType }}
                  </span>
                </div>
              </div>
              <span :class="`text-2xs text-white font-bold whitespace-nowrap bg-[var(--accent-color)] px-3 py-1.5 rounded`">
                <template v-if="exp.startDate && exp.endDate">{{ exp.startDate }} - {{ exp.endDate }}</template>
                <template v-else>{{ exp.startDate || exp.endDate }}</template>
              </span>
            </div>
            <p v-if="exp.description" class="text-gray-600 text-sm leading-relaxed text-justify mt-2 whitespace-pre-line">{{ exp.description }}</p>
          </div>
        </div>
      </div>

      <!-- Education -->
      <div v-if="cv.education.some(f => f.degree)">
        <h3 :class="`text-sm font-extrabold text-[var(--accent-color)] mb-5 uppercase tracking-wider`">{{ t('education.title') }}</h3>
        <div class="flex flex-col gap-6">
          <div v-for="(edu, index) in cv.education" :key="index" v-show="edu.degree">
            <div class="flex justify-between items-start mb-1.5 flex-wrap gap-2">
              <div>
                <h4 class="text-base font-extrabold text-gray-900 mb-0.5">{{ edu.degree }}</h4>
                <p class="text-sm text-gray-500 font-semibold">{{ edu.school }}</p>
                <p v-if="edu.city" class="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  {{ edu.city }}
                </p>
              </div>
              <span :class="`text-2xs text-white font-bold whitespace-nowrap bg-[var(--accent-color)] px-3 py-1.5 rounded`">
                {{ edu.year }}
              </span>
            </div>
            <p v-if="edu.description" class="text-gray-600 text-sm leading-relaxed text-justify mt-2 whitespace-pre-line">{{ edu.description }}</p>
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
