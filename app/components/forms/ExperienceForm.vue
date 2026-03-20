<template>
  <div>
    <div class="mb-2 sm:mb-3 flex items-center justify-between">
      <p class="text-[11px] sm:text-xs text-gray-600">
        {{ experiences.filter(e => e.position).length }} {{ $t('experience.title').toLowerCase() }}(s)
      </p>
      <UButton @click="addExperience" size="xs" color="indigo" icon="i-heroicons-plus">
        <span class="hidden sm:inline">{{ $t('experience.addExperience') }}</span>
        <span class="sm:hidden">Add</span>
      </UButton>
    </div>

    <div class="space-y-2 sm:space-y-3">
      <div v-for="(exp, index) in experiences" :key="index"
           class="bg-white border-2 border-gray-200 rounded-xl p-3 sm:p-4 hover:border-indigo-300 transition-all hover:shadow-md group">
        <div class="flex justify-between items-center mb-2 sm:mb-3">
          <div class="flex items-center gap-1.5 sm:gap-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span class="text-[11px] sm:text-xs font-bold text-indigo-600">{{ index + 1 }}</span>
            </div>
            <span class="text-[11px] sm:text-xs font-semibold text-gray-700">{{ $t('experience.title') }} {{ index + 1 }}</span>
          </div>
          <div class="flex gap-0.5 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <UButton
              v-if="index > 0"
              @click="moveExperience(index, -1)"
              size="xs"
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-up"
              title="Move up"
            />
            <UButton
              v-if="index < experiences.length - 1"
              @click="moveExperience(index, 1)"
              size="xs"
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-down"
              title="Move down"
            />
            <UButton
              @click="duplicateExperience(index)"
              size="xs"
              color="blue"
              variant="ghost"
              icon="i-heroicons-document-duplicate"
              title="Duplicate"
            />
            <UButton
              @click="removeExperience(index)"
              size="xs"
              color="red"
              variant="ghost"
              icon="i-heroicons-trash"
              :title="$t('experience.remove')"
            />
          </div>
        </div>
        <div class="space-y-2 sm:space-y-2.5">
          <div class="grid grid-cols-1 gap-2">
            <UInput
              v-model="exp.position"
              :label="$t('experience.position')"
              :placeholder="$t('experience.positionPlaceholder')"
              size="sm"
              icon="i-heroicons-briefcase"
              :color="exp.position ? 'primary' : 'gray'"
              list="job-suggestions"
            />
            <datalist id="job-suggestions">
              <option value="Full Stack Developer" />
              <option value="Frontend Developer" />
              <option value="Backend Developer" />
              <option value="DevOps Engineer" />
              <option value="Data Scientist" />
              <option value="Project Manager" />
              <option value="Product Manager" />
              <option value="UX/UI Designer" />
            </datalist>
            <UInput
              v-model="exp.company"
              :label="$t('experience.company')"
              :placeholder="$t('experience.companyPlaceholder')"
              size="sm"
              icon="i-heroicons-building-office"
              :color="exp.company ? 'primary' : 'gray'"
            />
          </div>
          <div class="grid grid-cols-1 gap-2">
            <UInput
              v-model="exp.contractType"
              :label="$t('experience.contractType')"
              :placeholder="$t('experience.contractTypePlaceholder')"
              size="sm"
              icon="i-heroicons-document-text"
              :color="exp.contractType ? 'primary' : 'gray'"
              list="contract-type-suggestions"
            />
            <datalist id="contract-type-suggestions">
              <option :value="$t('experience.contractTypes.internship')" />
              <option :value="$t('experience.contractTypes.cdi')" />
              <option :value="$t('experience.contractTypes.cdd')" />
              <option :value="$t('experience.contractTypes.freelance')" />
              <option :value="$t('experience.contractTypes.apprenticeship')" />
            </datalist>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <UInput
              v-model="exp.startDate"
              :label="$t('experience.startDate')"
              :placeholder="$t('experience.startDatePlaceholder')"
              size="sm"
              icon="i-heroicons-calendar"
              :color="exp.startDate ? 'primary' : 'gray'"
            />
            <UInput
              v-model="exp.endDate"
              :label="$t('experience.endDate')"
              :placeholder="$t('experience.endDatePlaceholder')"
              size="sm"
              icon="i-heroicons-calendar"
              :color="exp.endDate ? 'primary' : 'gray'"
              list="date-end-suggestions"
            />
            <datalist id="date-end-suggestions">
              <option value="Present" />
              <option value="Currently" />
            </datalist>
          </div>
          <UTextarea
            v-model="exp.description"
            :label="$t('experience.description')"
            :hint="`${exp.description?.length || 0} characters`"
            :rows="3"
            :placeholder="$t('experience.descriptionPlaceholder')"
            size="sm"
            :color="exp.description ? 'primary' : 'gray'"
            :maxlength="1000"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CV } from '~/composables/useCV'

const props = defineProps<{
  modelValue: CV
}>()

const experiences = computed({
  get: () => props.modelValue.experiences,
  set: (value) => {
    props.modelValue.experiences = value
  }
})

const addExperience = () => {
  experiences.value.push({ position: '', company: '', startDate: '', endDate: '', description: '' })
}

const removeExperience = (index: number) => {
  experiences.value.splice(index, 1)
}

const duplicateExperience = (index: number) => {
  const original = experiences.value[index]
  experiences.value.splice(index + 1, 0, { ...original })
}

const moveExperience = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < experiences.value.length) {
    const temp = experiences.value[index]
    experiences.value[index] = experiences.value[newIndex]
    experiences.value[newIndex] = temp
  }
}
</script>
