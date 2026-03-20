<template>
  <div class="flex h-full w-full">
    <!-- Colonne gauche avec dégradé -->
    <div class="w-[35%] text-white px-5 py-6 relative overflow-hidden"
         :style="{ background: `linear-gradient(135deg, ${accentColorDark}, ${accentColor})` }">
      <!-- Motifs décoratifs -->
      <div class="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full"></div>
      <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-white/3 rounded-full"></div>

      <div class="relative z-10">
        <!-- Photo -->
        <template v-if="cv.showPhoto">
          <div v-if="cv.photo" class="mb-8">
            <img :src="cv.photo" alt="Photo" class="w-36 h-36 rounded-full border-[5px] border-white/90 object-cover mx-auto shadow-[0_15px_35px_rgba(0,0,0,0.3)]" />
          </div>
          <div v-else class="mb-8">
            <div class="w-36 h-36 rounded-full border-[5px] border-white/90 bg-white/15 backdrop-blur-lg flex items-center justify-center mx-auto shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
              <svg class="w-18 h-18 text-white/90" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </template>

        <!-- Contact -->
        <div class="mb-5">
          <h3 class="text-xs font-black uppercase tracking-widest mb-3 border-b-2 border-white/30 pb-1.5">{{ t('personal.contact') }}</h3>
          <div class="flex flex-col gap-2 text-[10px]">
            <div v-if="cv.email" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span class="break-all">{{ cv.email }}</span>
            </div>
            <div v-if="cv.phone" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{{ cv.phone }}</span>
            </div>
            <div v-if="cv.location" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <span>{{ cv.location }}</span>
            </div>
            <div v-if="cv.age" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              <span>{{ cv.age }} ans</span>
            </div>
            <div v-if="cv.drivingLicense" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5A1.5 1.5 0 0 1 6.5 13A1.5 1.5 0 0 1 8 14.5A1.5 1.5 0 0 1 6.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8l-2.08-6Z"/>
              </svg>
              <span>{{ t('personal.license') }}</span>
            </div>
            <div v-if="cv.linkedin" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
              <span class="break-all">{{ cv.linkedin }}</span>
            </div>
            <div v-if="cv.website" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd" />
              </svg>
              <span class="break-all">{{ cv.website }}</span>
            </div>
            <div v-if="cv.github" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              <span class="break-all">{{ cv.github }}</span>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div v-if="cv.skills" class="mb-5">
          <h3 class="text-xs font-black uppercase tracking-widest mb-3 border-b-2 border-white/30 pb-1.5">{{ t('skills.title') }}</h3>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="(comp, index) in skillsArray" :key="index"
                  class="bg-white/20 backdrop-blur-lg px-2 py-1 rounded-full text-[9px] font-semibold border border-white/15">
              {{ comp }}
            </span>
          </div>
        </div>

        <!-- Languages -->
        <div v-if="cv.languages.some(l => l.name)" class="mb-5">
          <h3 class="text-xs font-black uppercase tracking-widest mb-3 border-b-2 border-white/30 pb-1.5">{{ t('languages.title') }}</h3>
          <div class="flex flex-col gap-2 text-[10px]">
            <div v-for="(langue, index) in cv.languages" :key="index" v-show="langue.name"
                 class="p-2 bg-white/8 rounded-lg backdrop-blur-lg">
              <div class="flex justify-between items-center">
                <span class="font-bold">{{ langue.name }}</span>
                <span class="opacity-85 font-medium">{{ langue.level }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications -->
        <div v-if="cv.certifications && cv.certifications.some(c => c.name)" class="mb-8">
          <h3 class="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-white/30 pb-2">{{ t('personal.certifications') }}</h3>
          <div class="flex flex-col gap-3 text-xs">
            <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.name"
                 class="p-2 bg-white/8 rounded-lg backdrop-blur-lg">
              <div class="flex justify-between items-start gap-2">
                <span class="font-semibold flex-1 leading-snug">{{ cert.name }}</span>
                <span class="opacity-85 whitespace-nowrap font-semibold">{{ cert.year }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right column -->
    <div class="w-[65%] px-5 py-6 bg-white">
      <!-- Header -->
      <div class="mb-6 pb-4 border-b-[3px] border-gray-100">
        <h1 class="text-4xl font-black text-gray-900 mb-1.5 uppercase tracking-tight leading-[1.1]">
          {{ cv.firstName }} {{ cv.lastName }}
        </h1>
        <h2 class="text-xl font-bold tracking-tight" :style="{ color: accentColor }">{{ cv.title }}</h2>
      </div>

      <!-- About -->
      <div v-if="cv.about" class="mb-6">
        <h3 class="text-sm font-extrabold mb-2.5 uppercase tracking-widest pb-1.5 border-b-2"
            :style="{ color: accentColor, borderColor: accentColor }">
          {{ t('personal.about') }}
        </h3>
        <p class="text-gray-700 text-justify leading-snug text-[11px]">{{ cv.about }}</p>
      </div>

      <!-- Experience -->
      <div v-if="cv.experiences.some(e => e.position)" class="mb-6">
        <h3 class="text-sm font-extrabold mb-3 uppercase tracking-widest pb-1.5 border-b-2"
            :style="{ color: accentColor, borderColor: accentColor }">
          {{ t('experience.title') }}
        </h3>
        <div class="space-y-3">
          <div v-for="(exp, index) in cv.experiences" :key="index" v-show="exp.position" class="relative pl-4 border-l-[3px]"
               :style="{ borderColor: accentColor }">
            <div class="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full"
                 :style="{ backgroundColor: accentColor }"></div>
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-sm font-bold text-gray-900">{{ exp.position }}</h4>
              <span class="text-[10px] font-semibold text-gray-500 whitespace-nowrap ml-3">
                <template v-if="exp.startDate && exp.endDate">{{ exp.startDate }} - {{ exp.endDate }}</template>
                <template v-else>{{ exp.startDate || exp.endDate }}</template>
              </span>
            </div>
            <div class="flex items-center gap-2 mb-1.5">
              <p class="text-xs font-semibold" :style="{ color: accentColor }">{{ exp.company }}</p>
              <span v-if="exp.contractType" class="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                {{ exp.contractType }}
              </span>
            </div>
            <p v-if="exp.description" class="text-[10px] text-gray-600 leading-snug text-justify whitespace-pre-line">{{ exp.description }}</p>
          </div>
        </div>
      </div>

      <!-- Education -->
      <div v-if="cv.education.some(f => f.degree)">
        <h3 class="text-sm font-extrabold mb-3 uppercase tracking-widest pb-1.5 border-b-2"
            :style="{ color: accentColor, borderColor: accentColor }">
          {{ t('education.title') }}
        </h3>
        <div class="space-y-3">
          <div v-for="(form, index) in cv.education" :key="index" v-show="form.degree" class="relative pl-4 border-l-[3px] border-gray-300">
            <div class="absolute -left-[7px] top-1.5 w-3 h-3 bg-gray-300 rounded-full"></div>
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-sm font-bold text-gray-900">{{ form.degree }}</h4>
              <span class="text-[10px] font-semibold text-gray-500 whitespace-nowrap ml-3">{{ form.year }}</span>
            </div>
            <p class="text-xs font-semibold mb-0.5" :style="{ color: accentColor }">{{ form.school }}</p>
            <p v-if="form.city" class="text-[10px] text-gray-500 mb-1.5 flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              {{ form.city }}
            </p>
            <p v-if="form.description" class="text-[10px] text-gray-600 leading-snug whitespace-pre-line">{{ form.description }}</p>
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

const { accentColor, accentColorDark, parseSkills } = useTemplate(props.cv)
const skillsArray = computed(() => parseSkills(props.cv.skills))
</script>
