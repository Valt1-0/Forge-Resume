<template>
  <div class="space-y-3 sm:space-y-4">
    <!-- Personal information -->
    <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-indigo-200 transition-all hover:shadow-sm">
      <div class="flex items-center justify-between mb-2 sm:mb-3 pb-2 border-b border-gray-200">
        <div class="flex items-center gap-1.5 sm:gap-2">
          <div class="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-user" class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600" />
          </div>
          <h3 class="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-gray-700">
            {{ $t('personal.title') }}
          </h3>
        </div>
      </div>
      <div class="space-y-3">
        <!-- Toggle to show/hide photo -->
        <div class="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-photo" class="w-3.5 h-3.5 text-gray-600" />
            <span class="text-xs font-medium text-gray-700">Show photo</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="modelValue.showPhoto" class="sr-only peer">
            <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <UInput
          v-if="modelValue.showPhoto"
          v-model="modelValue.photo"
          :label="$t('personal.photoURL')"
          hint="Recommended: square format, min 400x400px"
          :placeholder="$t('personal.photoPlaceholder')"
          size="sm"
          icon="i-heroicons-photo"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <span v-if="modelValue.photo && isValidUrl(modelValue.photo)" class="text-green-500">
              <UIcon name="i-heroicons-check-circle-solid" class="w-4 h-4" />
            </span>
          </template>
        </UInput>

        <div class="grid grid-cols-2 gap-3">
          <UInput
            v-model="modelValue.firstName"
            :label="$t('personal.firstName')"
            :placeholder="$t('personal.firstNamePlaceholder')"
            size="sm"
            icon="i-heroicons-user"
            :color="modelValue.firstName ? 'primary' : 'gray'"
          />
          <UInput
            v-model="modelValue.lastName"
            :label="$t('personal.lastName')"
            :placeholder="$t('personal.lastNamePlaceholder')"
            size="sm"
            icon="i-heroicons-user"
            :color="modelValue.lastName ? 'primary' : 'gray'"
          />
        </div>

        <UInput
          v-model="modelValue.title"
          :label="$t('personal.position')"
          :hint="$t('personal.positionPlaceholder')"
          :placeholder="$t('personal.positionPlaceholder')"
          size="sm"
          icon="i-heroicons-briefcase"
          :color="modelValue.title ? 'primary' : 'gray'"
        >
          <template #trailing>
            <span v-if="modelValue.title" class="text-xs text-gray-400">{{ modelValue.title.length }}</span>
          </template>
        </UInput>

        <UTextarea
          v-model="modelValue.about"
          :label="$t('personal.about')"
          :hint="`${modelValue.about?.length || 0} / 500 characters recommended`"
          :rows="4"
          :placeholder="$t('personal.aboutPlaceholder')"
          size="sm"
          :color="modelValue.about ? 'primary' : 'gray'"
          :maxlength="1000"
        />
        <div v-if="modelValue.about && modelValue.about.length > 0" class="mt-1.5 flex items-center gap-2">
          <div class="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="modelValue.about.length <= 500 ? 'bg-green-500' : modelValue.about.length <= 750 ? 'bg-yellow-500' : 'bg-red-500'"
              :style="{ width: Math.min((modelValue.about.length / 1000) * 100, 100) + '%' }"
            ></div>
          </div>
          <span class="text-xs font-medium" :class="modelValue.about.length <= 500 ? 'text-green-600' : modelValue.about.length <= 750 ? 'text-yellow-600' : 'text-red-600'">
            {{ modelValue.about.length }}
          </span>
        </div>
      </div>
    </div>

    <!-- Contact -->
    <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-xl p-4 hover:border-indigo-200 transition-all hover:shadow-sm">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-envelope" class="w-3.5 h-3.5 text-green-600" />
          </div>
          <h3 class="text-xs font-bold uppercase tracking-wide text-gray-700">{{ $t('personal.contact') }}</h3>
        </div>
      </div>
      <div class="space-y-3">
        <div class="grid grid-cols-1 gap-2">
          <UInput
            v-model="modelValue.email"
            :label="$t('personal.email')"
            type="email"
            :placeholder="$t('personal.emailPlaceholder')"
            size="sm"
            icon="i-heroicons-envelope"
            :color="modelValue.email && isValidEmail(modelValue.email) ? 'primary' : 'gray'"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #trailing>
              <span v-if="modelValue.email && isValidEmail(modelValue.email)" class="text-green-500">
                <UIcon name="i-heroicons-check-circle-solid" class="w-4 h-4" />
              </span>
              <span v-else-if="modelValue.email && !isValidEmail(modelValue.email)" class="text-red-500">
                <UIcon name="i-heroicons-x-circle-solid" class="w-4 h-4" />
              </span>
            </template>
          </UInput>
          <UInput
            v-model="modelValue.phone"
            :label="$t('personal.phone')"
            :placeholder="$t('personal.phonePlaceholder')"
            size="sm"
            icon="i-heroicons-phone"
            :color="modelValue.phone ? 'primary' : 'gray'"
          />
          <UInput
            v-model="modelValue.location"
            :label="$t('personal.location')"
            :placeholder="$t('personal.locationPlaceholder')"
            size="sm"
            icon="i-heroicons-map-pin"
            :color="modelValue.location ? 'primary' : 'gray'"
            list="city-suggestions"
          />
          <datalist id="city-suggestions">
            <option value="Paris, France" />
            <option value="Lyon, France" />
            <option value="Marseille, France" />
            <option value="Toulouse, France" />
            <option value="Bordeaux, France" />
            <option value="Lille, France" />
            <option value="Nantes, France" />
            <option value="Bruxelles, Belgique" />
            <option value="Genève, Suisse" />
            <option value="Luxembourg, Luxembourg" />
            <option value="Montréal, Canada" />
          </datalist>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <UInput
            v-model="modelValue.age"
            label="Age"
            type="number"
            placeholder="25"
            size="sm"
            icon="i-heroicons-cake"
            :color="modelValue.age ? 'primary' : 'gray'"
            min="16"
            max="99"
          />
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-700">Driving license</label>
            <label class="relative inline-flex items-center cursor-pointer h-9 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <input type="checkbox" v-model="modelValue.drivingLicense" class="sr-only peer">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[11px] after:start-[14px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              <span class="ml-3 text-xs font-medium text-gray-700">{{ modelValue.drivingLicense ? 'Yes' : 'No' }}</span>
            </label>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-2">
          <UInput
            v-model="modelValue.linkedin"
            :label="$t('personal.linkedin')"
            :placeholder="$t('personal.linkedinPlaceholder')"
            size="sm"
            icon="i-heroicons-link"
            :color="modelValue.linkedin ? 'primary' : 'gray'"
          />
          <UInput
            v-model="modelValue.website"
            :label="$t('personal.website')"
            :placeholder="$t('personal.websitePlaceholder')"
            size="sm"
            icon="i-heroicons-globe-alt"
            :color="modelValue.website ? 'primary' : 'gray'"
          />
          <UInput
            v-model="modelValue.github"
            :label="$t('personal.github')"
            :placeholder="$t('personal.githubPlaceholder')"
            size="sm"
            icon="i-heroicons-link"
            :color="modelValue.github ? 'primary' : 'gray'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isValidEmail, isValidUrl } from '~/utils/validation'
import type { CV } from '~/composables/useCV'

defineProps<{
  modelValue: CV
}>()
</script>
