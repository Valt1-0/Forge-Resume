<template>
  <div :class="dividerClass" />
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

const divider = tv({
  base: 'my-4',
  variants: {
    variant: {
      default: 'border-t border-gray-200',
      thick: 'border-t-2 border-gray-300',
      dashed: 'border-t border-dashed border-gray-300'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const dividerClass = computed(() => divider({ variant: props.variant }))
</script>
