<template>
  <div class="flex h-full w-full">
    <!-- Colonne gauche avec dégradé -->
    <div class="w-[35%] text-white px-8 py-10 relative overflow-hidden"
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
        <div class="mb-8">
          <h3 class="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-white/30 pb-2">Contact</h3>
          <div class="flex flex-col gap-3 text-xs">
            <div v-if="cv.email" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span class="break-all">{{ cv.email }}</span>
            </div>
            <div v-if="cv.telephone" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{{ cv.telephone }}</span>
            </div>
            <div v-if="cv.localisation" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <span>{{ cv.localisation }}</span>
            </div>
            <div v-if="cv.age" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              <span>{{ cv.age }} ans</span>
            </div>
            <div v-if="cv.permis" class="flex items-center gap-3">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <span>Permis B</span>
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

        <!-- Compétences -->
        <div v-if="cv.competences" class="mb-8">
          <h3 class="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-white/30 pb-2">Compétences</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="(comp, index) in competencesArray" :key="index"
                  class="bg-white/20 backdrop-blur-lg px-3 py-1.5 rounded-full text-2xs font-semibold border border-white/15">
              {{ comp }}
            </span>
          </div>
        </div>

        <!-- Langues -->
        <div v-if="cv.langues.some(l => l.nom)" class="mb-8">
          <h3 class="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-white/30 pb-2">Langues</h3>
          <div class="flex flex-col gap-3 text-xs">
            <div v-for="(langue, index) in cv.langues" :key="index" v-show="langue.nom"
                 class="p-2 bg-white/8 rounded-lg backdrop-blur-lg">
              <div class="flex justify-between items-center">
                <span class="font-bold">{{ langue.nom }}</span>
                <span class="opacity-85 font-medium">{{ langue.niveau }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications -->
        <div v-if="cv.certifications && cv.certifications.some(c => c.nom)" class="mb-8">
          <h3 class="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-white/30 pb-2">Certifications</h3>
          <div class="flex flex-col gap-3 text-xs">
            <div v-for="(cert, index) in cv.certifications" :key="index" v-show="cert.nom"
                 class="p-2 bg-white/8 rounded-lg backdrop-blur-lg">
              <div class="flex justify-between items-start gap-2">
                <span class="font-semibold flex-1 leading-snug">{{ cert.nom }}</span>
                <span class="opacity-85 whitespace-nowrap font-semibold">{{ cert.annee }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Colonne droite -->
    <div class="w-[65%] px-10 py-10 bg-white">
      <!-- En-tête -->
      <div class="mb-10 pb-6 border-b-[3px] border-gray-100">
        <h1 class="text-6xl font-black text-gray-900 mb-2 uppercase tracking-tight leading-[1.1]">
          {{ cv.prenom }} {{ cv.nom }}
        </h1>
        <h2 class="text-2xl font-bold tracking-tight" :style="{ color: accentColor }">{{ cv.titre }}</h2>
      </div>

      <!-- À propos -->
      <div v-if="cv.apropos" class="mb-10">
        <h3 class="text-lg font-extrabold mb-4 uppercase tracking-widest pb-2 border-b-2"
            :style="{ color: accentColor, borderColor: accentColor }">
          À propos
        </h3>
        <p class="text-gray-700 text-justify leading-relaxed text-sm">{{ cv.apropos }}</p>
      </div>

      <!-- Expériences -->
      <div v-if="cv.experiences.some(e => e.poste)" class="mb-10">
        <h3 class="text-lg font-extrabold mb-6 uppercase tracking-widest pb-2 border-b-2"
            :style="{ color: accentColor, borderColor: accentColor }">
          Expérience
        </h3>
        <div class="space-y-6">
          <div v-for="(exp, index) in cv.experiences" :key="index" v-show="exp.poste" class="relative pl-6 border-l-[3px]"
               :style="{ borderColor: accentColor }">
            <div class="absolute -left-[7px] top-2 w-3 h-3 rounded-full"
                 :style="{ backgroundColor: accentColor }"></div>
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-lg font-bold text-gray-900">{{ exp.poste }}</h4>
              <span class="text-xs font-semibold text-gray-500 whitespace-nowrap ml-4">
                {{ exp.dateDebut }} - {{ exp.dateFin }}
              </span>
            </div>
            <p class="text-sm font-semibold mb-2" :style="{ color: accentColor }">{{ exp.entreprise }}</p>
            <p v-if="exp.description" class="text-sm text-gray-600 leading-relaxed text-justify">{{ exp.description }}</p>
          </div>
        </div>
      </div>

      <!-- Formation -->
      <div v-if="cv.formations.some(f => f.diplome)">
        <h3 class="text-lg font-extrabold mb-6 uppercase tracking-widest pb-2 border-b-2"
            :style="{ color: accentColor, borderColor: accentColor }">
          Formation
        </h3>
        <div class="space-y-6">
          <div v-for="(form, index) in cv.formations" :key="index" v-show="form.diplome" class="relative pl-6 border-l-[3px] border-gray-300">
            <div class="absolute -left-[7px] top-2 w-3 h-3 bg-gray-300 rounded-full"></div>
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-base font-bold text-gray-900">{{ form.diplome }}</h4>
              <span class="text-xs font-semibold text-gray-500 whitespace-nowrap ml-4">{{ form.annee }}</span>
            </div>
            <p class="text-sm font-semibold mb-1" :style="{ color: accentColor }">{{ form.ecole }}</p>
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

const { accentColor, accentColorDark, parseCompetences } = useTemplate(props.cv)
const competencesArray = computed(() => parseCompetences(props.cv.competences))
</script>
