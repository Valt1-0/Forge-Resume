<template>
  <div class="space-y-3 sm:space-y-4">

    <!-- Score Header -->
    <div :class="`${result.scoreBg} border border-gray-200 rounded-xl p-4 sm:p-5`">
      <div class="flex items-center gap-4">
        <!-- Score circle -->
        <div :class="`w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ${result.scoreRing} flex flex-col items-center justify-center flex-shrink-0 bg-white shadow-md`">
          <span :class="`text-2xl sm:text-3xl font-black ${result.gradeColor}`">{{ result.score }}</span>
          <span class="text-[9px] sm:text-[10px] text-gray-400 font-semibold -mt-0.5">/ 100</span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span :class="`text-xl sm:text-2xl font-black ${result.gradeColor}`">{{ result.grade }}</span>
            <span :class="`text-sm font-bold ${result.labelColor}`">— {{ result.label }}</span>
          </div>
          <p class="text-xs text-gray-600 mb-2">ATS Compatibility Score</p>
          <!-- Progress bar -->
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="scoreBarColor"
              :style="{ width: result.score + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Quick summary -->
      <div class="mt-3 pt-3 border-t border-gray-200 flex items-start gap-2 text-xs text-gray-700">
        <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <span>
          This score reflects how well your CV is structured for ATS (Applicant Tracking System) scanners used by recruiters.
          <span v-if="result.issues.filter(i => i.severity === 'error').length > 0" class="text-red-600 font-semibold">
            {{ result.issues.filter(i => i.severity === 'error').length }} critical issue(s) to fix.
          </span>
        </span>
      </div>
    </div>

    <!-- Category Breakdown -->
    <div class="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
      <h4 class="text-xs font-bold uppercase tracking-wide text-gray-700 mb-3 flex items-center gap-2">
        <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 text-indigo-500" />
        Score Breakdown
      </h4>
      <div class="space-y-2.5">
        <div v-for="cat in result.categories" :key="cat.name" class="group">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-1.5">
              <UIcon :name="cat.icon" :class="`w-3.5 h-3.5 ${cat.colorClass}`" />
              <span class="text-xs font-semibold text-gray-700">{{ cat.name }}</span>
            </div>
            <span class="text-xs font-bold text-gray-600">{{ cat.score }}/{{ cat.maxScore }}</span>
          </div>
          <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="cat.bgClass"
              :style="{ width: cat.pct + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Issues -->
    <div v-if="result.issues.length > 0" class="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
      <h4 class="text-xs font-bold uppercase tracking-wide text-gray-700 mb-3 flex items-center gap-2">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-orange-500" />
        Issues to Fix
        <span class="ml-auto flex gap-1">
          <span v-if="errorCount > 0" class="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
            {{ errorCount }} critical
          </span>
          <span v-if="warnCount > 0" class="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full">
            {{ warnCount }} warnings
          </span>
          <span v-if="infoCount > 0" class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
            {{ infoCount }} tips
          </span>
        </span>
      </h4>
      <div class="space-y-2">
        <div
          v-for="(issue, i) in sortedIssues"
          :key="i"
          :class="[
            'rounded-lg p-2.5 border text-xs',
            issue.severity === 'error' ? 'bg-red-50 border-red-200' :
            issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
            'bg-blue-50 border-blue-200'
          ]"
        >
          <div class="flex items-start gap-2">
            <UIcon
              :name="issue.severity === 'error' ? 'i-heroicons-x-circle' : issue.severity === 'warning' ? 'i-heroicons-exclamation-circle' : 'i-heroicons-light-bulb'"
              :class="[
                'w-3.5 h-3.5 flex-shrink-0 mt-0.5',
                issue.severity === 'error' ? 'text-red-500' :
                issue.severity === 'warning' ? 'text-yellow-600' :
                'text-blue-500'
              ]"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 mb-0.5">
                <span :class="[
                  'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded',
                  issue.severity === 'error' ? 'bg-red-100 text-red-700' :
                  issue.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                ]">{{ issue.category }}</span>
              </div>
              <p :class="[
                'font-semibold',
                issue.severity === 'error' ? 'text-red-800' :
                issue.severity === 'warning' ? 'text-yellow-800' :
                'text-blue-800'
              ]">{{ issue.message }}</p>
              <p class="text-gray-600 mt-0.5">{{ issue.tip }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Strengths -->
    <div v-if="result.strengths.length > 0" class="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
      <h4 class="text-xs font-bold uppercase tracking-wide text-gray-700 mb-3 flex items-center gap-2">
        <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
        Strengths
      </h4>
      <div class="space-y-1.5">
        <div
          v-for="(s, i) in result.strengths"
          :key="i"
          class="flex items-center gap-2 text-xs text-green-800"
        >
          <UIcon name="i-heroicons-check" class="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
          <span>{{ s }}</span>
        </div>
      </div>
    </div>

    <!-- ATS Export Explainer -->
    <div class="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-xl p-3 sm:p-4">
      <h4 class="text-xs font-bold uppercase tracking-wide text-amber-800 mb-2.5 flex items-center gap-2">
        <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-amber-600" />
        How to Submit to ATS
      </h4>
      <div class="space-y-2 text-xs text-amber-900">
        <div class="flex items-start gap-2 p-2 bg-white/60 rounded-lg border border-amber-200">
          <UIcon name="i-heroicons-x-circle" class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-semibold text-red-700">PDF button → image-based PDF</p>
            <p class="text-gray-600">Pretty for humans, but ATS scanners <strong>cannot read the text</strong>.</p>
          </div>
        </div>
        <div class="flex items-start gap-2 p-2 bg-white/60 rounded-lg border border-amber-200">
          <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-semibold text-green-700">ATS button → text-based PDF</p>
            <p class="text-gray-600">Plain text, <strong>fully machine-readable</strong>. Use this when applying online through platforms like LinkedIn, Workday, Greenhouse, Lever, etc.</p>
          </div>
        </div>
        <p class="text-[10px] text-amber-700 pt-1">Use <strong>PDF</strong> when emailing to a recruiter directly. Use <strong>ATS</strong> when uploading to a job portal.</p>
      </div>
    </div>

    <!-- ATS Tips -->
    <div class="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-3 sm:p-4">
      <h4 class="text-xs font-bold uppercase tracking-wide text-indigo-800 mb-2.5 flex items-center gap-2">
        <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-indigo-500" />
        ATS Best Practices
      </h4>
      <ul class="space-y-1.5 text-xs text-indigo-900">
        <li class="flex items-start gap-1.5">
          <span class="text-indigo-400 mt-0.5">•</span>
          <span>Include <strong>keywords from the job description</strong> in your skills and summary</span>
        </li>
        <li class="flex items-start gap-1.5">
          <span class="text-indigo-400 mt-0.5">•</span>
          <span>Start bullet points with <strong>action verbs</strong> (led, built, improved…)</span>
        </li>
        <li class="flex items-start gap-1.5">
          <span class="text-indigo-400 mt-0.5">•</span>
          <span>Add <strong>numbers and metrics</strong> to quantify your impact</span>
        </li>
        <li class="flex items-start gap-1.5">
          <span class="text-indigo-400 mt-0.5">•</span>
          <span>Keep your summary between <strong>50–150 words</strong></span>
        </li>
        <li class="flex items-start gap-1.5">
          <span class="text-indigo-400 mt-0.5">•</span>
          <span>List skills as <strong>comma-separated keywords</strong>, not icons or bars</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { ATSResult } from '~/composables/useATSCheck'

const props = defineProps<{
  result: ATSResult
}>()

const scoreBarColor = computed(() => {
  const s = props.result.score
  if (s >= 80) return 'bg-green-500'
  if (s >= 70) return 'bg-blue-500'
  if (s >= 55) return 'bg-yellow-500'
  if (s >= 40) return 'bg-orange-500'
  return 'bg-red-500'
})

const sortedIssues = computed(() => {
  const order = { error: 0, warning: 1, info: 2 }
  return [...props.result.issues].sort((a, b) => order[a.severity] - order[b.severity])
})

const errorCount = computed(() => props.result.issues.filter(i => i.severity === 'error').length)
const warnCount = computed(() => props.result.issues.filter(i => i.severity === 'warning').length)
const infoCount = computed(() => props.result.issues.filter(i => i.severity === 'info').length)
</script>
