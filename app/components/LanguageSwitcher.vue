<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-all-smooth border border-gray-200 shadow-sm hover-lift"
      :title="$t('toolbar.changeLanguage')"
    >
      <UIcon name="i-heroicons-language" class="w-4 h-4 text-gray-600" />
      <span class="text-sm font-medium text-gray-700 uppercase">{{ locale }}</span>
      <UIcon
        name="i-heroicons-chevron-down"
        class="w-3 h-3 text-gray-500 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[9999]"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          @click="changeLocale(loc.code)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors',
            locale === loc.code
              ? 'bg-indigo-50 text-indigo-700 font-semibold'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
        >
          <span class="text-lg">{{ loc.flag }}</span>
          <span>{{ loc.name }}</span>
          <UIcon
            v-if="locale === loc.code"
            name="i-heroicons-check"
            class="w-4 h-4 ml-auto text-indigo-600"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { locale, setLocale } = useI18n()
const isOpen = ref(false)

const availableLocales = computed(() => [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
])

const changeLocale = async (newLocale: string) => {
  await setLocale(newLocale)
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-1px);
}

.transition-all-smooth {
  transition: all 0.3s ease;
}
</style>
