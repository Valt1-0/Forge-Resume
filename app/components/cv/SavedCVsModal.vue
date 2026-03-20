<template>
  <div v-if="show" @click="close" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div @click.stop class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <UIcon name="i-heroicons-folder-open" class="w-7 h-7 text-indigo-600" />
            {{ $t('savedCVs.title') }}
          </h3>
          <p class="text-sm text-gray-600 mt-1">{{ savedCVs.length }} saved CV{{ savedCVs.length > 1 ? 's' : '' }}</p>
        </div>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/50 rounded-lg">
          <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Empty state -->
        <div v-if="savedCVs.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
            <UIcon name="i-heroicons-document-plus" class="w-12 h-12 text-indigo-600" />
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">{{ $t('savedCVs.noSaved') }}</h4>
          <p class="text-gray-600 max-w-sm mb-6">{{ $t('savedCVs.noSavedDescription') }}</p>
          <UButton @click="close" color="indigo" size="lg">
            {{ $t('toolbar.newCV') }}
          </UButton>
        </div>

        <!-- CV Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="savedCV in sortedCVs"
            :key="savedCV.id"
            class="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer"
          >
            <!-- CV Preview Header -->
            <div @click="loadCV(savedCV)" class="mb-4">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{{ savedCV.name }}</h4>
                  <p class="text-xs text-gray-500">
                    Modified {{ formatDate(savedCV.updatedAt) }}
                  </p>
                </div>
                <div
                  class="w-8 h-8 rounded-lg flex-shrink-0 ml-2"
                  :style="{ backgroundColor: savedCV.accentColor }"
                ></div>
              </div>

              <!-- CV Info -->
              <div class="space-y-2">
                <div v-if="savedCV.cv.firstName || savedCV.cv.lastName" class="flex items-center gap-2 text-sm">
                  <UIcon name="i-heroicons-user" class="w-4 h-4 text-gray-400" />
                  <span class="text-gray-700 font-medium">{{ savedCV.cv.firstName }} {{ savedCV.cv.lastName }}</span>
                </div>
                <div v-if="savedCV.cv.title" class="flex items-center gap-2 text-sm">
                  <UIcon name="i-heroicons-briefcase" class="w-4 h-4 text-gray-400" />
                  <span class="text-gray-600 line-clamp-1">{{ savedCV.cv.title }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-gray-400" />
                  <span class="text-gray-600">Template: {{ getTemplateName(savedCV.templateId) }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t border-gray-200">
              <UButton
                @click="loadCV(savedCV)"
                color="indigo"
                size="sm"
                class="flex-1"
                icon="i-heroicons-folder-open"
              >
                {{ $t('savedCVs.load') }}
              </UButton>
              <UButton
                @click="duplicateCV(savedCV.id)"
                color="blue"
                variant="soft"
                size="sm"
                icon="i-heroicons-document-duplicate"
                :title="$t('common.duplicate')"
              />
              <UButton
                @click="confirmDelete(savedCV)"
                color="red"
                variant="soft"
                size="sm"
                icon="i-heroicons-trash"
                :title="$t('savedCVs.delete')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
        <p class="text-sm text-gray-600">
          <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline mr-1" />
          {{ $t('savedCVs.localStorageInfo') }}
        </p>
        <UButton @click="close" color="gray" variant="ghost">
          {{ $t('savedCVs.close') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSavedCVs, type SavedCV } from '~/composables/useSavedCVs'

const { t } = useI18n()

const props = defineProps<{
  show: boolean
  templates: any[]
}>()

const emit = defineEmits<{
  close: []
  load: [cv: SavedCV]
}>()

const { getAllCVs, deleteCV: deleteCVFromStorage, duplicateCV: duplicateCVInStorage } = useSavedCVs()

const savedCVs = ref<SavedCV[]>([])
const refreshCVs = () => {
  savedCVs.value = getAllCVs()
}

// Refresh the list when the modal opens
watch(() => props.show, (isShown) => {
  if (isShown) {
    refreshCVs()
  }
})

// Load initially
refreshCVs()

const sortedCVs = computed(() => {
  return [...savedCVs.value].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
})

const close = () => {
  emit('close')
}

const loadCV = (savedCV: SavedCV) => {
  emit('load', savedCV)
  close()
}

const confirmDelete = (savedCV: SavedCV) => {
  if (confirm(t('savedCVs.confirmDelete', { name: savedCV.name }))) {
    deleteCVFromStorage(savedCV.id)
    refreshCVs() // Refresh after deletion
  }
}

const duplicateCV = (id: string) => {
  duplicateCVInStorage(id)
  refreshCVs() // Refresh after duplication
}

const getTemplateName = (templateId: string) => {
  const template = props.templates.find(t => t.id === templateId)
  return template?.label || 'Modern'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
