<template>
  <div class="px-14 py-12 bg-white h-full w-full">
    <!-- En-tête horizontal minimaliste -->
    <div class="flex justify-between items-start mb-12 pb-6 border-b-2 border-gray-900">
      <div class="flex-1">
        <h1 class="text-5xl font-light text-gray-900 mb-1 tracking-tight">
          {{ cv.prenom }} <span class="font-bold">{{ cv.nom }}</span>
        </h1>
        <h2 :class="`text-lg text-[var(--accent-color)] font-medium tracking-wider uppercase`">{{ cv.titre }}</h2>
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
      <span v-if="cv.telephone">{{ cv.telephone }}</span>
      <span v-if="cv.localisation">{{ cv.localisation }}</span>
      <span v-if="cv.age">{{ cv.age }} ans</span>
      <span v-if="cv.permis">Permis B</span>
      <span v-if="cv.linkedin">{{ cv.linkedin }}</span>
      <span v-if="cv.website">{{ cv.website }}</span>
    </div>

    <!-- À propos -->
    <div v-if="cv.apropos" class="mb-10">
      <p class="text-gray-600 leading-relaxed text-sm text-justify">{{ cv.apropos }}</p>
    </div>

    <!-- Timeline layout pour Expériences et Formation -->
    <div class="flex flex-col gap-10">
      <!-- Expériences -->
      <div v-if="cv.experiences.some(e => e.poste)">
        <h3 class="text-xs font-bold text-gray-900 mb-6 uppercase tracking-widest">Expériences professionnelles</h3>
        <div class="flex flex-col gap-8">
          <div v-for="(exp, index) in cv.experiences" :key="index" v-show="exp.poste" class="grid grid-cols-[140px_1fr] gap-8">
            <div class="text-right pt-0.5">
              <div class="text-2xs text-gray-400 font-semibold whitespace-nowrap">
                {{ exp.dateDebut }} - {{ exp.dateFin }}
              </div>
            </div>
            <div class="border-l-2 border-gray-200 pl-6 relative">
              <div :class="`absolute left-[-6px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent-color)]`"></div>
              <h4 class="text-base font-bold text-gray-900 mb-1">{{ exp.poste }}</h4>
              <p :class="`text-sm text-[var(--accent-color)] font-semibold mb-2`">{{ exp.entreprise }}</p>
              <p v-if="exp.description" class="text-gray-500 text-sm leading-relaxed text-justify">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formation -->
      <div v-if="cv.formations.some(f => f.diplome)">
        <h3 class="text-xs font-bold text-gray-900 mb-6 uppercase tracking-widest">Formation</h3>
        <div class="flex flex-col gap-8">
          <div v-for="(form, index) in cv.formations" :key="index" v-show="form.diplome" class="grid grid-cols-[140px_1fr] gap-8">
            <div class="text-right pt-0.5">
              <div class="text-2xs text-gray-400 font-semibold">{{ form.annee }}</div>
            </div>
            <div class="border-l-2 border-gray-200 pl-6 relative">
              <div :class="`absolute left-[-6px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent-color)]`"></div>
              <h4 class="text-base font-bold text-gray-900 mb-1">{{ form.diplome }}</h4>
              <p :class="`text-sm text-[var(--accent-color)] font-semibold mb-1`">{{ form.ecole }}</p>
              <p v-if="form.ville" class="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                {{ form.ville }}
              </p>
              <p v-if="form.description" class="text-gray-500 text-sm leading-relaxed text-justify">{{ form.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Compétences et Langues en ligne -->
      <div class="grid grid-cols-2 gap-10">
        <!-- Compétences -->
        <div v-if="cv.competences">
          <h3 class="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">Compétences</h3>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="(comp, index) in competencesArray" :key="index"
                  class="bg-gray-100 text-gray-700 px-2.5 py-1.5 text-2xs font-medium">
              {{ comp }}
            </span>
          </div>
        </div>

        <!-- Langues -->
        <div v-if="cv.langues.some(l => l.nom)">
          <h3 class="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">Langues</h3>
          <div class="flex flex-col gap-1.5 text-xs text-gray-600">
            <div v-for="(langue, index) in cv.langues" :key="index" v-show="langue.nom">
              <span class="font-semibold">{{ langue.nom }}</span>
              <span class="text-gray-400"> - {{ langue.niveau }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Certifications -->
      <div v-if="cv.certifications && cv.certifications.some(c => c.nom)">
        <h3 class="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">Certifications</h3>
        <div class="flex flex-wrap gap-3">
          <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.nom" class="text-xs text-gray-600">
            <span class="font-semibold">{{ cert.nom }}</span>
            <span v-if="cert.annee" class="text-gray-400"> ({{ cert.annee }})</span>
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
