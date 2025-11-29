<template>
  <div class="grid grid-cols-[250px_1fr] h-full w-full">
    <!-- Sidebar gauche colorée -->
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
          <div v-if="cv.telephone">{{ cv.telephone }}</div>
          <div v-if="cv.localisation" class="leading-snug">{{ cv.localisation }}</div>
          <div v-if="cv.age">{{ cv.age }} ans</div>
          <div v-if="cv.permis">Permis B</div>
          <div v-if="cv.linkedin" class="break-all leading-snug">{{ cv.linkedin }}</div>
          <div v-if="cv.website" class="break-all leading-snug">{{ cv.website }}</div>
        </div>
      </div>

      <!-- Compétences -->
      <div v-if="cv.competences" class="mb-8">
        <h3 class="text-2xs font-extrabold tracking-wider mb-4 opacity-90">COMPÉTENCES</h3>
        <div class="flex flex-col gap-2 text-2xs leading-relaxed">
          <div v-for="(comp, index) in competencesArray" :key="index">• {{ comp }}</div>
        </div>
      </div>

      <!-- Langues -->
      <div v-if="cv.langues.some(l => l.nom)" class="mb-8">
        <h3 class="text-2xs font-extrabold tracking-wider mb-4 opacity-90">LANGUES</h3>
        <div class="flex flex-col gap-2.5 text-2xs">
          <div v-for="(langue, index) in cv.langues" :key="index" v-show="langue.nom">
            <div class="font-bold mb-0.5">{{ langue.nom }}</div>
            <div class="opacity-85 text-[0.65rem]">{{ langue.niveau }}</div>
          </div>
        </div>
      </div>

      <!-- Certifications -->
      <div v-if="cv.certifications && cv.certifications.some(c => c.nom)">
        <h3 class="text-2xs font-extrabold tracking-wider mb-4 opacity-90">CERTIFICATIONS</h3>
        <div class="flex flex-col gap-2.5 text-2xs leading-snug">
          <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.nom">
            <div class="font-semibold">{{ cert.nom }}</div>
            <div v-if="cert.annee" class="opacity-85 text-[0.65rem]">{{ cert.annee }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="px-10 py-10 pl-8 bg-white">
      <!-- En-tête -->
      <div class="mb-10">
        <h1 class="text-5xl font-black text-gray-900 mb-1 uppercase tracking-tight leading-tight">
          {{ cv.prenom }}<br/>{{ cv.nom }}
        </h1>
        <h2 :class="`text-xl text-[var(--accent-color)] font-bold mb-6`">{{ cv.titre }}</h2>
        <div :class="`w-16 h-1 bg-[var(--accent-color)]`"></div>
      </div>

      <!-- À propos -->
      <div v-if="cv.apropos" class="mb-10">
        <h3 :class="`text-sm font-extrabold text-[var(--accent-color)] mb-3 uppercase tracking-wider`">À propos</h3>
        <p class="text-gray-700 leading-relaxed text-sm text-justify">{{ cv.apropos }}</p>
      </div>

      <!-- Expériences -->
      <div v-if="cv.experiences.some(e => e.poste)" class="mb-10">
        <h3 :class="`text-sm font-extrabold text-[var(--accent-color)] mb-5 uppercase tracking-wider`">Expériences</h3>
        <div class="flex flex-col gap-6">
          <div v-for="(exp, index) in cv.experiences" :key="index" v-show="exp.poste">
            <div class="flex justify-between items-start mb-1.5 flex-wrap gap-2">
              <div>
                <h4 class="text-base font-extrabold text-gray-900 mb-0.5">{{ exp.poste }}</h4>
                <p class="text-sm text-gray-500 font-semibold">{{ exp.entreprise }}</p>
              </div>
              <span :class="`text-2xs text-white font-bold whitespace-nowrap bg-[var(--accent-color)] px-3 py-1.5 rounded`">
                {{ exp.dateDebut }} - {{ exp.dateFin }}
              </span>
            </div>
            <p v-if="exp.description" class="text-gray-600 text-sm leading-relaxed text-justify mt-2">{{ exp.description }}</p>
          </div>
        </div>
      </div>

      <!-- Formation -->
      <div v-if="cv.formations.some(f => f.diplome)">
        <h3 :class="`text-sm font-extrabold text-[var(--accent-color)] mb-5 uppercase tracking-wider`">Formation</h3>
        <div class="flex flex-col gap-6">
          <div v-for="(form, index) in cv.formations" :key="index" v-show="form.diplome">
            <div class="flex justify-between items-start mb-1.5 flex-wrap gap-2">
              <div>
                <h4 class="text-base font-extrabold text-gray-900 mb-0.5">{{ form.diplome }}</h4>
                <p class="text-sm text-gray-500 font-semibold">{{ form.ecole }}</p>
                <p v-if="form.ville" class="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  {{ form.ville }}
                </p>
              </div>
              <span :class="`text-2xs text-white font-bold whitespace-nowrap bg-[var(--accent-color)] px-3 py-1.5 rounded`">
                {{ form.annee }}
              </span>
            </div>
            <p v-if="form.description" class="text-gray-600 text-sm leading-relaxed text-justify mt-2">{{ form.description }}</p>
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
