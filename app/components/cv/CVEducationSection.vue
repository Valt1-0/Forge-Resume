<template>
  <div class="mb-10">
    <h3 :class="`text-lg font-extrabold text-(--accent-color) mb-6 uppercase tracking-widest pb-2 border-b-2 border-(--accent-color)`">Formation</h3>
    <div class="flex flex-col gap-6">
      <div v-for="(form, index) in formations" :key="index" v-show="form.diplome" class="relative pl-5 border-l-[3px] border-gray-200">
        <div :class="`absolute left-[-7px] top-1.5 w-[11px] h-[11px] rounded-full bg-(--accent-color) border-2 border-white`"></div>
        <div class="flex justify-between items-start mb-1.5 flex-wrap gap-2">
          <div>
            <h4 class="text-base font-bold text-gray-900 mb-0.5">{{ form.diplome }}</h4>
            <p :class="`text-sm text-(--accent-color) font-semibold`">{{ form.ecole }}</p>
            <p v-if="form.ville" class="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              {{ form.ville }}
            </p>
          </div>
          <span class="text-xs text-gray-500 font-semibold whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full">
            {{ form.annee }}
          </span>
        </div>
        <p v-if="form.description" class="text-gray-600 text-sm leading-relaxed text-justify mt-2">{{ form.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  formations: {
    type: Array,
    required: true
  }
})
</script>
