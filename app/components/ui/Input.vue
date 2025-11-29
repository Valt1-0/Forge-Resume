<template>
  <input
    :class="inputClass"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    v-bind="$attrs"
  />
</template>

<script setup>
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  error: Boolean
})

defineEmits(['update:modelValue'])

const input = tv({
  base: 'w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
  variants: {
    error: {
      true: 'border-red-500 focus:ring-red-500',
      false: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }
  },
  defaultVariants: {
    error: false
  }
})

const inputClass = computed(() => input({ error: props.error }))
</script>
