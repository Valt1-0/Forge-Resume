<template>
  <div>
    <div class="mb-2 sm:mb-3 flex items-center justify-between">
      <p class="text-[11px] sm:text-xs text-gray-600">
        {{ education.filter(e => e.degree).length }} {{ $t('education.title').toLowerCase() }}(s)
      </p>
      <UButton @click="addEducation" size="xs" color="indigo" icon="i-heroicons-plus">
        <span class="hidden sm:inline">{{ $t('education.addEducation') }}</span>
        <span class="sm:hidden">Add</span>
      </UButton>
    </div>

    <div class="space-y-2 sm:space-y-3">
      <div v-for="(edu, index) in education" :key="index"
           class="bg-white border-2 border-gray-200 rounded-xl p-3 sm:p-4 hover:border-indigo-300 transition-all hover:shadow-md group">
        <div class="flex justify-between items-center mb-2 sm:mb-3">
          <div class="flex items-center gap-1.5 sm:gap-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="text-[11px] sm:text-xs font-bold text-purple-600">{{ index + 1 }}</span>
            </div>
            <span class="text-[11px] sm:text-xs font-semibold text-gray-700">{{ $t('education.title') }} {{ index + 1 }}</span>
          </div>
          <div class="flex gap-0.5 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <UButton @click="removeEducation(index)" size="xs" color="red" variant="ghost" icon="i-heroicons-trash" :title="$t('education.remove')" />
          </div>
        </div>
        <div class="space-y-2 sm:space-y-2.5">
          <UInput
            v-model="edu.degree"
            :label="$t('education.degree')"
            :placeholder="$t('education.degreePlaceholder')"
            size="sm"
            icon="i-heroicons-academic-cap"
            :color="edu.degree ? 'primary' : 'gray'"
          />
          <UInput
            v-model="edu.school"
            :label="$t('education.school')"
            :placeholder="$t('education.schoolPlaceholder')"
            size="sm"
            icon="i-heroicons-building-library"
            :color="edu.school ? 'primary' : 'gray'"
          />
          <UInput
            v-model="edu.year"
            :label="$t('education.endDate')"
            :placeholder="$t('education.endDatePlaceholder')"
            size="sm"
            icon="i-heroicons-calendar"
            :color="edu.year ? 'primary' : 'gray'"
          />
          <UTextarea
            v-model="edu.description"
            :label="$t('education.description')"
            :hint="`${edu.description?.length || 0} characters`"
            :rows="3"
            :placeholder="$t('education.descriptionPlaceholder')"
            size="sm"
            :color="edu.description ? 'primary' : 'gray'"
            :maxlength="1000"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CV } from '~/composables/useCV'

const props = defineProps<{ modelValue: CV }>()

const education = computed({
  get: () => props.modelValue.education,
  set: (value) => { props.modelValue.education = value }
})

const addEducation = () => {
  education.value.push({ degree: '', school: '', year: '', description: '' })
}

const removeEducation = (index: number) => {
  education.value.splice(index, 1)
}
</script>
