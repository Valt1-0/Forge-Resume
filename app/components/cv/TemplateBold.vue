<template>
  <div class="flex h-full w-full">
    <!-- Barre latérale noire -->
    <div class="w-2 bg-(--accent-color) shrink-0"></div>

    <!-- Contenu principal -->
    <div class="flex-1 bg-white px-12 py-10">
      <!-- En-tête puissant -->
      <div class="mb-10">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h1 class="text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-3">
              {{ cv.prenom }}<br/>{{ cv.nom }}
            </h1>
            <div :class="`w-24 h-2 bg-(--accent-color) mb-4`"></div>
            <h2 :class="`text-2xl font-bold text-(--accent-color) uppercase tracking-wide`">{{ cv.titre }}</h2>
          </div>

          <!-- Photo carrée -->
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

        <!-- Contact en barre -->
        <div class="flex flex-wrap gap-6 text-xs font-bold text-gray-700 uppercase tracking-wider border-t-2 border-b-2 border-gray-900 py-3">
          <span v-if="cv.email">{{ cv.email }}</span>
          <span v-if="cv.telephone">{{ cv.telephone }}</span>
          <span v-if="cv.localisation">{{ cv.localisation }}</span>
          <span v-if="cv.age">{{ cv.age }} ans</span>
          <span v-if="cv.permis">Permis B</span>
          <span v-if="cv.linkedin">{{ cv.linkedin }}</span>
          <span v-if="cv.website">{{ cv.website }}</span>
        </div>
      </div>

      <!-- À propos -->
      <div v-if="cv.apropos" class="mb-10">
        <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-3">
          <div :class="`w-12 h-1 bg-(--accent-color)`"></div>
          À PROPOS
        </h3>
        <p class="text-sm text-gray-700 leading-relaxed font-medium">{{ cv.apropos }}</p>
      </div>

      <!-- Layout 2 colonnes -->
      <div class="grid grid-cols-[1.3fr_1fr] gap-10">
        <!-- Colonne principale -->
        <div class="space-y-8">
          <!-- Expériences -->
          <div v-if="cv.experiences.some(e => e.poste)">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
              <div :class="`w-12 h-1 bg-(--accent-color)`"></div>
              EXPÉRIENCE
            </h3>
            <div class="space-y-6">
              <div v-for="(exp, index) in cv.experiences" :key="index" v-show="exp.poste" class="border-l-4 border-(--accent-color) pl-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-lg font-black text-gray-900 uppercase">{{ exp.poste }}</h4>
                  <span :class="`text-xs font-black text-white bg-(--accent-color) px-3 py-1 uppercase tracking-wider whitespace-nowrap ml-4`">
                    {{ exp.dateDebut }} - {{ exp.dateFin }}
                  </span>
                </div>
                <p class="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{{ exp.entreprise }}</p>
                <p v-if="exp.description" class="text-sm text-gray-600 leading-relaxed">{{ exp.description }}</p>
              </div>
            </div>
          </div>

          <!-- Formation -->
          <div v-if="cv.formations.some(f => f.diplome)">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
              <div :class="`w-12 h-1 bg-(--accent-color)`"></div>
              FORMATION
            </h3>
            <div class="space-y-6">
              <div v-for="(form, index) in cv.formations" :key="index" v-show="form.diplome" class="border-l-4 border-gray-300 pl-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-base font-black text-gray-900 uppercase">{{ form.diplome }}</h4>
                  <span class="text-xs font-black text-gray-600 bg-gray-100 px-3 py-1 uppercase tracking-wider whitespace-nowrap ml-4">
                    {{ form.annee }}
                  </span>
                </div>
                <p class="text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">{{ form.ecole }}</p>
                <p v-if="form.ville" class="text-xs text-gray-500 mb-2 font-semibold flex items-center gap-1">
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
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">COMPÉTENCES</h3>
            <div class="space-y-2">
              <div v-for="(comp, index) in competencesArray" :key="index"
                   :class="`text-xs font-bold text-white bg-(--accent-color) px-3 py-2 uppercase tracking-wide`">
                {{ comp }}
              </div>
            </div>
          </div>

          <!-- Langues -->
          <div v-if="cv.langues.some(l => l.nom)">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">LANGUES</h3>
            <div class="space-y-3">
              <div v-for="(langue, index) in cv.langues" :key="index" v-show="langue.nom" class="border-l-4 border-(--accent-color) pl-3">
                <div class="text-sm font-black text-gray-900 uppercase">{{ langue.nom }}</div>
                <div class="text-xs font-semibold text-gray-600">{{ langue.niveau }}</div>
              </div>
            </div>
          </div>

          <!-- Certifications -->
          <div v-if="cv.certifications && cv.certifications.some(c => c.nom)">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">CERTIFICATIONS</h3>
            <div class="space-y-3">
              <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.nom" class="bg-gray-50 p-3 border-l-4 border-gray-300">
                <div class="text-xs font-bold text-gray-900">{{ cert.nom }}</div>
                <div v-if="cert.annee" class="text-xs font-semibold text-gray-600 mt-1">{{ cert.annee }}</div>
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
