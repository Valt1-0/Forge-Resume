<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot />
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-if="hint && !error" class="text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  id: String,
  error: String,
  hint: String,
  required: Boolean
})
</script>
