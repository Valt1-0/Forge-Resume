<template>
  <div :class="cardClass">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200">
      <slot name="header" />
    </div>
    <div class="px-6 py-4">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})

const card = tv({
  base: 'bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200',
  variants: {
    variant: {
      default: 'border border-gray-200',
      elevated: 'shadow-xl',
      flat: 'shadow-none bg-gray-50'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const cardClass = computed(() => card({ variant: props.variant }))
</script>
