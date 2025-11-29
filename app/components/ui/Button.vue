<template>
  <button :class="buttonClass" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup>
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  }
})

const button = tv({
  base: 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
})

const buttonClass = computed(() => button({ variant: props.variant, size: props.size }))
</script>
