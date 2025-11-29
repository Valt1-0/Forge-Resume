<template>
  <div class="mb-10">
    <h3 :class="`text-lg font-extrabold text-(--accent-color) mb-6 uppercase tracking-widest pb-2 border-b-2 border-(--accent-color)`">Expériences</h3>
    <div class="flex flex-col gap-6">
      <div v-for="(exp, index) in experiences" :key="index" v-show="exp.poste" class="relative pl-5 border-l-[3px] border-gray-200">
        <div :class="`absolute left-[-7px] top-1.5 w-[11px] h-[11px] rounded-full bg-(--accent-color) border-2 border-white`"></div>
        <div class="flex justify-between items-start mb-1.5 flex-wrap gap-2">
          <div>
            <h4 class="text-base font-bold text-gray-900 mb-0.5">{{ exp.poste }}</h4>
            <p :class="`text-sm text-(--accent-color) font-semibold`">{{ exp.entreprise }}</p>
          </div>
          <span class="text-xs text-gray-500 font-semibold whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full">
            {{ exp.dateDebut }} - {{ exp.dateFin }}
          </span>
        </div>
        <p v-if="exp.description" class="text-gray-600 text-sm leading-relaxed text-justify mt-2">{{ exp.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  experiences: {
    type: Array,
    required: true
  }
})
</script>
