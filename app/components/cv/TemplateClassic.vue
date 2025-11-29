<template>
  <div class="flex flex-col items-center px-14 py-12 bg-white h-full w-full">
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
        {{ cv.prenom }} {{ cv.nom }}
      </h1>
      <h2 class="text-xl text-gray-500 font-medium italic mb-6 font-serif">{{ cv.titre }}</h2>

      <!-- Contact en ligne -->
      <div class="flex flex-wrap justify-center gap-6 text-xs text-gray-600">
        <span v-if="cv.email" class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          {{ cv.email }}
        </span>
        <span v-if="cv.telephone" class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          {{ cv.telephone }}
        </span>
        <span v-if="cv.localisation" class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          {{ cv.localisation }}
        </span>
        <span v-if="cv.age" class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          {{ cv.age }} ans
        </span>
        <span v-if="cv.permis" class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
          </svg>
          Permis B
        </span>
        <span v-if="cv.linkedin" class="flex items-center gap-1.5">LinkedIn</span>
        <span v-if="cv.website" class="flex items-center gap-1.5">{{ cv.website }}</span>
      </div>
    </div>

    <!-- À propos -->
    <div v-if="cv.apropos" class="mb-8 w-full">
      <h3 :class="`text-lg font-semibold text-(--accent-color) mb-3 text-center font-serif`">Profil</h3>
      <p class="text-gray-700 text-center leading-relaxed text-sm max-w-[90%] mx-auto">{{ cv.apropos }}</p>
    </div>

    <!-- Corps en 2 colonnes -->
    <div class="grid grid-cols-2 gap-10 w-full">
      <!-- Colonne gauche -->
      <div>
        <!-- Expériences -->
        <CVExperienceSection v-if="cv.experiences.some(e => e.poste)" :experiences="cv.experiences" />

        <!-- Certifications -->
        <div v-if="cv.certifications && cv.certifications.some(c => c.nom)" class="mb-8">
          <h3 :class="`text-lg font-semibold text-(--accent-color) mb-4 font-serif`">Certifications</h3>
          <div class="flex flex-col gap-2.5">
            <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.nom" class="text-sm text-gray-600">
              <span class="font-semibold">{{ cert.nom }}</span>
              <span v-if="cert.annee" class="text-gray-400"> - {{ cert.annee }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne droite -->
      <div>
        <!-- Formation -->
        <CVEducationSection v-if="cv.formations.some(f => f.diplome)" :formations="cv.formations" />

        <!-- Compétences -->
        <div v-if="cv.competences" class="mb-8">
          <h3 :class="`text-lg font-semibold text-(--accent-color) mb-4 font-serif`">Compétences</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="(comp, index) in competencesArray" :key="index"
                  :class="`bg-(--accent-color-light) text-(--accent-color) px-2.5 py-1.5 rounded text-xs font-medium`">
              {{ comp }}
            </span>
          </div>
        </div>

        <!-- Langues -->
        <div v-if="cv.langues.some(l => l.nom)" class="mb-8">
          <h3 :class="`text-lg font-semibold text-(--accent-color) mb-4 font-serif`">Langues</h3>
          <div class="flex flex-col gap-2 text-sm text-gray-600">
            <div v-for="(langue, index) in cv.langues" :key="index" v-show="langue.nom">
              <span class="font-semibold">{{ langue.nom }}</span>
              <span class="text-gray-400"> - {{ langue.niveau }}</span>
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

const props = defineProps({
  cv: {
    type: Object,
    required: true
  }
})

const { parseCompetences } = useTemplate(props.cv)
const competencesArray = computed(() => parseCompetences(props.cv.competences))
</script>
