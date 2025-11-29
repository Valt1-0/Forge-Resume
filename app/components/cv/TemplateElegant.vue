<template>
  <div class="flex flex-col h-full w-full bg-white">
    <!-- En-tête avec photo latérale -->
    <div class="relative px-16 pt-12 pb-8 border-b-4 border-(--accent-color)">
      <div class="flex items-start gap-8">
        <!-- Photo -->
        <template v-if="cv.showPhoto">
          <div v-if="cv.photo" class="shrink-0">
            <img :src="cv.photo" alt="Photo" class="w-32 h-32 rounded-2xl object-cover shadow-xl border-4 border-white ring-2 ring-(--accent-color)/20" />
          </div>
          <div v-else class="shrink-0">
            <div class="w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center shadow-lg border-4 border-white ring-2 ring-gray-200">
              <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </template>

        <!-- Informations principales -->
        <div class="flex-1">
          <h1 class="text-5xl font-light text-gray-900 mb-2 tracking-tight">
            {{ cv.prenom }} <span class="font-semibold">{{ cv.nom }}</span>
          </h1>
          <h2 :class="`text-2xl font-light text-(--accent-color) mb-6 italic`">{{ cv.titre }}</h2>

          <!-- Contact compact -->
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600">
            <span v-if="cv.email" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {{ cv.email }}
            </span>
            <span v-if="cv.telephone" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {{ cv.telephone }}
            </span>
            <span v-if="cv.localisation" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              {{ cv.localisation }}
            </span>
            <span v-if="cv.age" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              {{ cv.age }} ans
            </span>
            <span v-if="cv.permis" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              Permis B
            </span>
            <span v-if="cv.linkedin" class="flex items-center gap-2">{{ cv.linkedin }}</span>
            <span v-if="cv.website" class="flex items-center gap-2">{{ cv.website }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Corps du CV -->
    <div class="flex-1 px-16 py-8">
      <!-- À propos -->
      <div v-if="cv.apropos" class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <div :class="`w-2 h-8 bg-(--accent-color) rounded-full`"></div>
          <h3 class="text-xl font-light text-gray-900 tracking-wide">Profil</h3>
        </div>
        <p class="text-gray-700 leading-relaxed text-sm text-justify pl-6">{{ cv.apropos }}</p>
      </div>

      <!-- Mise en page 2 colonnes -->
      <div class="grid grid-cols-[1.5fr_1fr] gap-12">
        <!-- Colonne principale -->
        <div class="space-y-8">
          <!-- Expériences -->
          <div v-if="cv.experiences.some(e => e.poste)">
            <div class="flex items-center gap-4 mb-6">
              <div :class="`w-2 h-8 bg-(--accent-color) rounded-full`"></div>
              <h3 class="text-xl font-light text-gray-900 tracking-wide">Expérience professionnelle</h3>
            </div>
            <div class="pl-6 space-y-6">
              <div v-for="(exp, index) in cv.experiences" :key="index" v-show="exp.poste" class="relative">
                <div class="flex justify-between items-baseline mb-2">
                  <h4 class="text-base font-semibold text-gray-900">{{ exp.poste }}</h4>
                  <span class="text-xs font-medium text-gray-500 whitespace-nowrap ml-4">{{ exp.dateDebut }} - {{ exp.dateFin }}</span>
                </div>
                <p :class="`text-sm font-medium text-(--accent-color) mb-2`">{{ exp.entreprise }}</p>
                <p v-if="exp.description" class="text-sm text-gray-600 leading-relaxed text-justify">{{ exp.description }}</p>
              </div>
            </div>
          </div>

          <!-- Formation -->
          <div v-if="cv.formations.some(f => f.diplome)">
            <div class="flex items-center gap-4 mb-6">
              <div :class="`w-2 h-8 bg-(--accent-color) rounded-full`"></div>
              <h3 class="text-xl font-light text-gray-900 tracking-wide">Formation</h3>
            </div>
            <div class="pl-6 space-y-6">
              <div v-for="(form, index) in cv.formations" :key="index" v-show="form.diplome">
                <div class="flex justify-between items-baseline mb-2">
                  <h4 class="text-base font-semibold text-gray-900">{{ form.diplome }}</h4>
                  <span class="text-xs font-medium text-gray-500 whitespace-nowrap ml-4">{{ form.annee }}</span>
                </div>
                <p :class="`text-sm font-medium text-(--accent-color) mb-1`">{{ form.ecole }}</p>
                <p v-if="form.ville" class="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  {{ form.ville }}
                </p>
                <p v-if="form.description" class="text-sm text-gray-600 leading-relaxed">{{ form.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne latérale -->
        <div class="space-y-8">
          <!-- Compétences -->
          <div v-if="cv.competences">
            <div class="flex items-center gap-4 mb-4">
              <div :class="`w-2 h-6 bg-(--accent-color) rounded-full`"></div>
              <h3 class="text-lg font-light text-gray-900">Compétences</h3>
            </div>
            <div class="pl-6 flex flex-col gap-2">
              <span v-for="(comp, index) in competencesArray" :key="index"
                    class="text-sm text-gray-700 border-l-2 border-(--accent-color)/30 pl-3 py-1">
                {{ comp }}
              </span>
            </div>
          </div>

          <!-- Langues -->
          <div v-if="cv.langues.some(l => l.nom)">
            <div class="flex items-center gap-4 mb-4">
              <div :class="`w-2 h-6 bg-(--accent-color) rounded-full`"></div>
              <h3 class="text-lg font-light text-gray-900">Langues</h3>
            </div>
            <div class="pl-6 space-y-3">
              <div v-for="(langue, index) in cv.langues" :key="index" v-show="langue.nom" class="border-l-2 border-(--accent-color)/30 pl-3">
                <div class="text-sm font-semibold text-gray-900">{{ langue.nom }}</div>
                <div class="text-xs text-gray-600">{{ langue.niveau }}</div>
              </div>
            </div>
          </div>

          <!-- Certifications -->
          <div v-if="cv.certifications && cv.certifications.some(c => c.nom)">
            <div class="flex items-center gap-4 mb-4">
              <div :class="`w-2 h-6 bg-(--accent-color) rounded-full`"></div>
              <h3 class="text-lg font-light text-gray-900">Certifications</h3>
            </div>
            <div class="pl-6 space-y-3">
              <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.nom" class="border-l-2 border-(--accent-color)/30 pl-3">
                <div class="text-sm font-semibold text-gray-900">{{ cert.nom }}</div>
                <div v-if="cert.annee" class="text-xs text-gray-600">{{ cert.annee }}</div>
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

const props = defineProps({
  cv: {
    type: Object,
    required: true
  }
})

const { parseCompetences } = useTemplate(props.cv)
const competencesArray = computed(() => parseCompetences(props.cv.competences))
</script>
