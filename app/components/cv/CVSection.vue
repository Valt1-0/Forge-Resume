<template>
  <div class="mb-7">
    <h3 class="text-sm font-extrabold tracking-wider mb-4 pb-2 border-b-2 border-white/25">
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
