<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex flex-col">
    <!-- Toast notifications -->
    <ToastContainer />
    <!-- Top improved toolbar -->
    <div class="bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 flex flex-col lg:flex-row items-start lg:items-center justify-between px-3 sm:px-6 py-2 lg:py-3 flex-shrink-0 shadow-sm gap-2 lg:gap-0">
      <div class="flex items-center gap-2 sm:gap-4 animate-slide-in w-full lg:w-auto">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover-lift animate-float">
          <UIcon name="i-heroicons-document-text" class="w-5 h-5 sm:w-7 sm:h-7 text-white" />
        </div>
        <div class="flex flex-col flex-1 lg:flex-initial">
          <input
            v-model="documentTitle"
            class="text-sm sm:text-base font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-gray-50 transition-all-smooth w-full"
            :placeholder="$t('app.untitled')"
          />
          <div class="hidden sm:flex items-center gap-3 text-xs text-gray-500 px-2 sm:px-3">
            <span class="flex items-center gap-1">
              <UIcon name="i-heroicons-clock" class="w-3 h-3" />
              {{ $t('toolbar.modified') }} {{ lastModified }}
            </span>
            <span v-if="lastSaved" class="flex items-center gap-1 text-green-600 font-medium animate-fade-in">
              <UIcon name="i-heroicons-check-circle-solid" class="w-3 h-3" />
              {{ $t('toolbar.saved') }} {{ lastSaved }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3 animate-slide-in w-full lg:w-auto flex-wrap lg:flex-nowrap" style="animation-delay: 0.1s">
        <!-- Group: Appearance -->
        <div class="flex items-center gap-1 sm:gap-2 bg-white rounded-xl p-1.5 sm:p-2 shadow-sm border border-gray-200 hover-lift flex-shrink-0">
          <!-- Template selector with gallery -->
          <div class="relative">
            <button
              @click="showTemplateGallery = !showTemplateGallery"
              class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all-smooth group whitespace-nowrap"
            >
              <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4 sm:hidden text-indigo-600" />
              <div :class="`hidden sm:block w-5 h-5 sm:w-6 sm:h-6 rounded-md shadow-sm bg-gradient-to-br ${selectedTemplate?.color || 'from-indigo-500 to-purple-600'}`"></div>
              <span class="text-xs sm:text-sm font-semibold text-gray-800">{{ selectedTemplate?.label || 'Modern' }}</span>
              <UIcon name="i-heroicons-chevron-down" class="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500 group-hover:text-indigo-700 transition-transform duration-300" :class="{ 'rotate-180': showTemplateGallery }" />
            </button>

          </div>

          <!-- Color selector -->
          <div class="hidden md:flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
            <label class="text-xs font-semibold text-gray-700 hidden lg:inline">{{ $t('toolbar.color') }}</label>
            <div class="flex gap-1 sm:gap-1.5">
              <button
                v-for="color in colorPresets"
                :key="color.value"
                @click="accentColor = color.value"
                :class="[
                  'w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 transition-all-smooth hover-scale flex-shrink-0',
                  accentColor === color.value ? 'border-gray-900 ring-2 ring-offset-1 ring-indigo-300 scale-110 shadow-md' : 'border-white shadow hover:shadow-md'
                ]"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
              />
              <input
                type="color"
                v-model="accentColor"
                class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg cursor-pointer border-2 border-white shadow hover:shadow-md hover-scale transition-all-smooth flex-shrink-0"
                :title="$t('toolbar.customColor')"
              />
            </div>
          </div>
        </div>

        <!-- Group: Undo/Redo -->
        <div class="hidden sm:flex items-center gap-2 bg-white rounded-xl p-1.5 sm:p-2 shadow-sm border border-gray-200 hover-lift flex-shrink-0">
          <div class="flex items-center gap-1">
            <button @click="undo" :disabled="!canUndo" :title="canUndo ? $t('toolbar.undo') : `${$t('toolbar.undo')} - ${$t('toolbar.noUndo')}`"
                    :class="['p-1.5 sm:p-2 rounded-lg transition-all-smooth', canUndo ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' : 'text-gray-300 cursor-not-allowed']">
              <UIcon name="i-heroicons-arrow-uturn-left" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button @click="redo" :disabled="!canRedo" :title="canRedo ? $t('toolbar.redo') : `${$t('toolbar.redo')} - ${$t('toolbar.noRedo')}`"
                    :class="['p-1.5 sm:p-2 rounded-lg transition-all-smooth', canRedo ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' : 'text-gray-300 cursor-not-allowed']">
              <UIcon name="i-heroicons-arrow-uturn-right" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <!-- Group: Files & Actions -->
        <div class="flex items-center gap-1 sm:gap-1.5 bg-white rounded-xl p-1.5 sm:p-2 shadow-sm border border-gray-200 hover-lift flex-shrink-0">
          <button @click="showShortcuts = !showShortcuts" :title="$t('toolbar.shortcuts')"
                  class="p-1.5 sm:p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all-smooth group flex-shrink-0">
            <UIcon name="i-heroicons-information-circle" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
          </button>
          <div class="w-px h-4 sm:h-5 bg-gray-200 hidden sm:block"></div>
          <button @click="showSavedCVsModal = true" :title="$t('toolbar.myCVs')"
                  class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-folder-open" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span class="hidden lg:inline">{{ $t('toolbar.myCVs') }}</span>
          </button>
          <button @click="saveCurrentCV" :title="$t('toolbar.saveCV')"
                  class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-bookmark-solid" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span class="hidden sm:inline">{{ $t('common.save') }}</span>
          </button>
          <div class="w-px h-4 sm:h-5 bg-gray-200 hidden sm:block"></div>
          <button @click="triggerImportJSON" :title="$t('toolbar.importCV')"
                  class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-arrow-up-tray" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span class="hidden sm:inline">{{ $t('common.import') }}</span>
          </button>
          <input ref="fileInput" type="file" accept=".json" @change="importJSON" class="hidden" />
          <button @click="saveJSON" :title="$t('toolbar.downloadCV')"
                  class="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-arrow-down-tray" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span>{{ $t('common.export') }}</span>
          </button>
          <div class="w-px h-4 sm:h-5 bg-gray-200 hidden sm:block"></div>
          <button @click="createNewCV" :title="$t('toolbar.newCV')"
                  class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-document-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span class="hidden lg:inline">{{ $t('toolbar.newCV') }}</span>
          </button>
          <button @click="loadExampleData" :title="$t('toolbar.loadExample')"
                  class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span class="hidden lg:inline">{{ $t('common.load') }}</span>
          </button>
        </div>

        <!-- Language Switcher -->
        <LanguageSwitcher />

        <!-- Export Buttons -->
        <div class="flex gap-2 flex-shrink-0">
          <button @click="exporterPDF"
                  class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all-smooth group whitespace-nowrap"
                  :title="$t('toolbar.exportPDF')">
            <UIcon name="i-heroicons-document-arrow-down" class="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span class="hidden sm:inline">PDF</span>
          </button>
          <button @click="exporterPNG"
                  class="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all-smooth group whitespace-nowrap"
                  :title="$t('toolbar.exportPNG')">
            <UIcon name="i-heroicons-photo" class="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span class="hidden sm:inline">PNG</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile toggle to switch between form and preview -->
    <div class="lg:hidden bg-white border-b border-gray-200 flex">
      <button
        @click="mobileView = 'form'"
        :class="[
          'flex-1 px-4 py-3 text-sm font-semibold transition-all relative',
          mobileView === 'form'
            ? 'text-indigo-600 bg-indigo-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        ]"
      >
        <div class="flex items-center justify-center gap-2">
          <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
          <span>{{ $t('toolbar.edit') }}</span>
        </div>
        <div v-if="mobileView === 'form'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
      </button>
      <button
        @click="mobileView = 'preview'"
        :class="[
          'flex-1 px-4 py-3 text-sm font-semibold transition-all relative',
          mobileView === 'preview'
            ? 'text-indigo-600 bg-indigo-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        ]"
      >
        <div class="flex items-center justify-center gap-2">
          <UIcon name="i-heroicons-eye" class="w-4 h-4" />
          <span>{{ $t('toolbar.preview') }}</span>
        </div>
        <div v-if="mobileView === 'preview'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
      </button>
    </div>

    <!-- Main layout -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[400px_1fr] overflow-hidden">
      <!-- Form sidebar with tabs -->
      <div class="bg-white border-r border-gray-200 overflow-hidden flex flex-col" :class="{ 'hidden lg:flex': mobileView === 'preview' }">
        <!-- Tabs -->
        <div class="border-b border-gray-200 flex bg-gray-50/50 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 min-w-[70px] px-1.5 sm:px-2 py-2 sm:py-2.5 text-xs font-semibold transition-all relative',
              activeTab === tab.id
                ? 'text-indigo-600 bg-white'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            ]"
          >
            <div class="flex flex-col items-center justify-center gap-0.5 sm:gap-1">
              <UIcon :name="tab.icon" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span class="text-[9px] sm:text-[10px] leading-tight">{{ tab.label }}</span>
            </div>
            <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
          </button>
        </div>

        <!-- Progress bar and improved stats -->
        <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-3 sm:px-5 py-3 sm:py-4 border-b border-indigo-100 shadow-sm">
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <UIcon name="i-heroicons-chart-bar" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <span class="text-[11px] sm:text-xs font-bold text-gray-800">Progress</span>
                <div :class="`text-[10px] sm:text-2xs font-semibold ${cvInsight.color} flex items-center gap-1 mt-0.5`">
                  <span class="hidden sm:inline">{{ cvInsight.icon }}</span>
                  <span class="line-clamp-1">{{ cvInsight.text }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {{ completionPercentage }}%
              </div>
            </div>
          </div>

          <!-- Modern progress bar -->
          <div class="relative w-full h-2.5 sm:h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden shadow-inner mb-3 sm:mb-4">
            <div
              class="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out progress-indeterminate"
              :style="{ width: completionPercentage + '%' }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          </div>

          <!-- Detailed stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            <div class="bg-white/70 backdrop-blur rounded-lg p-1.5 sm:p-2 text-center hover-lift transition-all cursor-pointer" title="Total word count">
              <div class="text-base sm:text-lg font-bold text-indigo-600">{{ cvStats.wordCount }}</div>
              <div class="text-[10px] sm:text-2xs text-gray-600 font-medium">Words</div>
            </div>
            <div class="bg-white/70 backdrop-blur rounded-lg p-1.5 sm:p-2 text-center hover-lift transition-all cursor-pointer" title="Listed skills">
              <div class="text-base sm:text-lg font-bold text-purple-600">{{ cvStats.skillCount }}</div>
              <div class="text-[10px] sm:text-2xs text-gray-600 font-medium">Skills</div>
            </div>
            <div class="bg-white/70 backdrop-blur rounded-lg p-1.5 sm:p-2 text-center hover-lift transition-all cursor-pointer" title="Spoken languages">
              <div class="text-base sm:text-lg font-bold text-pink-600">{{ cvStats.languageCount }}</div>
              <div class="text-[10px] sm:text-2xs text-gray-600 font-medium">Languages</div>
            </div>
            <div class="bg-white/70 backdrop-blur rounded-lg p-1.5 sm:p-2 text-center hover-lift transition-all cursor-pointer" title="Academic education">
              <div class="text-base sm:text-lg font-bold text-blue-600">{{ cvStats.educationCount }}</div>
              <div class="text-[10px] sm:text-2xs text-gray-600 font-medium">Education</div>
            </div>
          </div>
        </div>

        <!-- Contenu des onglets -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-3 sm:p-5 space-y-3 sm:space-y-4">

            <!-- Information tab -->
            <div v-if="activeTab === 'info'">
              <!-- Personal information -->
              <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-indigo-200 transition-all hover:shadow-sm">
                <div class="flex items-center justify-between mb-2 sm:mb-3 pb-2 border-b border-gray-200">
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <div class="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <UIcon name="i-heroicons-user" class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600" />
                    </div>
                    <h3 class="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-gray-700">Personal information</h3>
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
                      <input type="checkbox" v-model="cv.showPhoto" class="sr-only peer">
                      <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <UInput
                    v-if="cv.showPhoto"
                    v-model="cv.photo"
                    label="Profile photo (URL)"
                    hint="Recommended: square format, min 400x400px"
                    placeholder="https://example.com/photo.jpg"
                    size="sm"
                    icon="i-heroicons-photo"
                    :ui="{ icon: { trailing: { pointer: '' } } }"
                  >
                    <template #trailing>
                      <span v-if="cv.photo && isValidUrl(cv.photo)" class="text-green-500">
                        <UIcon name="i-heroicons-check-circle-solid" class="w-4 h-4" />
                      </span>
                    </template>
                  </UInput>

                  <div class="grid grid-cols-2 gap-3">
                    <UInput
                      v-model="cv.firstName"
                      label="First name *"
                      placeholder="John"
                      size="sm"
                      icon="i-heroicons-user"
                      :color="cv.firstName ? 'primary' : 'gray'"
                    />
                    <UInput
                      v-model="cv.lastName"
                      label="Last name *"
                      placeholder="Doe"
                      size="sm"
                      icon="i-heroicons-user"
                      :color="cv.lastName ? 'primary' : 'gray'"
                    />
                  </div>

                  <UInput
                    v-model="cv.title"
                    label="Title / Position *"
                    hint="Ex: Senior Full Stack Developer"
                    placeholder="Full Stack Developer"
                    size="sm"
                    icon="i-heroicons-briefcase"
                    :color="cv.title ? 'primary' : 'gray'"
                  >
                    <template #trailing>
                      <span v-if="cv.title" class="text-xs text-gray-400">{{ cv.title.length }}</span>
                    </template>
                  </UInput>

                  <UTextarea
                    v-model="cv.about"
                    label="About"
                    :hint="`${cv.about?.length || 0} / 500 characters recommended`"
                    :rows="4"
                    placeholder="Passionate developer with 5 years of experience..."
                    size="sm"
                    :color="cv.about ? 'primary' : 'gray'"
                    :maxlength="1000"
                  />
                  <div v-if="cv.about && cv.about.length > 0" class="mt-1.5 flex items-center gap-2">
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="cv.about.length <= 500 ? 'bg-green-500' : cv.about.length <= 750 ? 'bg-yellow-500' : 'bg-red-500'"
                        :style="{ width: Math.min((cv.about.length / 1000) * 100, 100) + '%' }"
                      ></div>
                    </div>
                    <span class="text-xs font-medium" :class="cv.about.length <= 500 ? 'text-green-600' : cv.about.length <= 750 ? 'text-yellow-600' : 'text-red-600'">
                      {{ cv.about.length }}
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
                    <h3 class="text-xs font-bold uppercase tracking-wide text-gray-700">Contact</h3>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="grid grid-cols-1 gap-2">
                    <UInput
                      v-model="cv.email"
                      label="Email *"
                      type="email"
                      placeholder="john.doe@email.com"
                      size="sm"
                      icon="i-heroicons-envelope"
                      :color="cv.email && isValidEmail(cv.email) ? 'primary' : 'gray'"
                      :ui="{ icon: { trailing: { pointer: '' } } }"
                    >
                      <template #trailing>
                        <span v-if="cv.email && isValidEmail(cv.email)" class="text-green-500">
                          <UIcon name="i-heroicons-check-circle-solid" class="w-4 h-4" />
                        </span>
                        <span v-else-if="cv.email && !isValidEmail(cv.email)" class="text-red-500">
                          <UIcon name="i-heroicons-x-circle-solid" class="w-4 h-4" />
                        </span>
                      </template>
                    </UInput>
                    <UInput
                      v-model="cv.phone"
                      label="Phone *"
                      placeholder="+1 555-123-4567"
                      size="sm"
                      icon="i-heroicons-phone"
                      :color="cv.phone ? 'primary' : 'gray'"
                    />
                    <UInput
                      v-model="cv.location"
                      label="City"
                      placeholder="New York, USA"
                      size="sm"
                      icon="i-heroicons-map-pin"
                      :color="cv.location ? 'primary' : 'gray'"
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
                      v-model="cv.age"
                      label="Age"
                      type="number"
                      placeholder="25"
                      size="sm"
                      icon="i-heroicons-cake"
                      :color="cv.age ? 'primary' : 'gray'"
                      min="16"
                      max="99"
                    />
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-700">Driving license</label>
                      <label class="relative inline-flex items-center cursor-pointer h-9 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                        <input type="checkbox" v-model="cv.drivingLicense" class="sr-only peer">
                        <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[11px] after:start-[14px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span class="ml-3 text-xs font-medium text-gray-700">{{ cv.drivingLicense ? 'Yes' : 'No' }}</span>
                      </label>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-2">
                    <UInput
                      v-model="cv.linkedin"
                      label="LinkedIn"
                      placeholder="linkedin.com/in/johndoe"
                      size="sm"
                      icon="i-heroicons-link"
                      :color="cv.linkedin ? 'primary' : 'gray'"
                    />
                    <UInput
                      v-model="cv.website"
                      label="Portfolio"
                      placeholder="www.johndoe.com"
                      size="sm"
                      icon="i-heroicons-globe-alt"
                      :color="cv.website ? 'primary' : 'gray'"
                    />
                    <UInput
                      v-model="cv.github"
                      label="GitHub"
                      placeholder="github.com/johndoe"
                      size="sm"
                      icon="i-heroicons-code-bracket"
                      :color="cv.github ? 'primary' : 'gray'"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Experience tab -->
            <div v-if="activeTab === 'experience'">
              <div class="mb-2 sm:mb-3 flex items-center justify-between">
                <p class="text-[11px] sm:text-xs text-gray-600">{{ cv.experiences.filter(e => e.position).length }} experience(s)</p>
                <UButton @click="ajouterExperience" size="xs" color="indigo" icon="i-heroicons-plus">
                  <span class="hidden sm:inline">New experience</span>
                  <span class="sm:hidden">Add</span>
                </UButton>
              </div>

              <div class="space-y-2 sm:space-y-3">
                <div v-for="(exp, index) in cv.experiences" :key="index"
                     class="bg-white border-2 border-gray-200 rounded-xl p-3 sm:p-4 hover:border-indigo-300 transition-all hover:shadow-md group">
                  <div class="flex justify-between items-center mb-2 sm:mb-3">
                    <div class="flex items-center gap-1.5 sm:gap-2">
                      <div class="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span class="text-[11px] sm:text-xs font-bold text-indigo-600">{{ index + 1 }}</span>
                      </div>
                      <span class="text-[11px] sm:text-xs font-semibold text-gray-700">Experience {{ index + 1 }}</span>
                    </div>
                    <div class="flex gap-0.5 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <UButton
                        v-if="index > 0"
                        @click="moveExperience(index, -1)"
                        size="xs"
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-arrow-up"
                        title="Move up"
                      />
                      <UButton
                        v-if="index < cv.experiences.length - 1"
                        @click="moveExperience(index, 1)"
                        size="xs"
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-arrow-down"
                        title="Move down"
                      />
                      <UButton
                        @click="dupliquerExperience(index)"
                        size="xs"
                        color="blue"
                        variant="ghost"
                        icon="i-heroicons-document-duplicate"
                        title="Duplicate"
                      />
                      <UButton
                        @click="supprimerExperience(index)"
                        size="xs"
                        color="red"
                        variant="ghost"
                        icon="i-heroicons-trash"
                        title="Delete"
                      />
                    </div>
                  </div>
                  <div class="space-y-2 sm:space-y-2.5">
                    <div class="grid grid-cols-1 gap-2">
                      <UInput
                        v-model="exp.position"
                        label="Position"
                        placeholder="Full Stack Developer"
                        size="sm"
                        icon="i-heroicons-briefcase"
                        :color="exp.position ? 'primary' : 'gray'"
                        list="job-suggestions"
                      />
                      <datalist id="job-suggestions">
                        <option value="Full Stack Developer" />
                        <option value="Frontend Developer" />
                        <option value="Backend Developer" />
                        <option value="DevOps Engineer" />
                        <option value="Data Scientist" />
                        <option value="Project Manager" />
                        <option value="Product Manager" />
                        <option value="UX/UI Designer" />
                      </datalist>
                      <UInput
                        v-model="exp.company"
                        label="Company"
                        placeholder="Google"
                        size="sm"
                        icon="i-heroicons-building-office"
                        :color="exp.company ? 'primary' : 'gray'"
                      />
                      <UInput
                        v-model="exp.contractType"
                        :label="$t('experience.contractType')"
                        :placeholder="$t('experience.contractTypePlaceholder')"
                        size="sm"
                        icon="i-heroicons-document-text"
                        :color="exp.contractType ? 'primary' : 'gray'"
                        list="contract-type-suggestions"
                      />
                      <datalist id="contract-type-suggestions">
                        <option :value="$t('experience.contractTypes.internship')" />
                        <option :value="$t('experience.contractTypes.cdi')" />
                        <option :value="$t('experience.contractTypes.cdd')" />
                        <option :value="$t('experience.contractTypes.freelance')" />
                        <option :value="$t('experience.contractTypes.apprenticeship')" />
                      </datalist>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <UInput
                        v-model="exp.startDate"
                        label="Start"
                        placeholder="Jan 2020"
                        size="sm"
                        icon="i-heroicons-calendar"
                        :color="exp.startDate ? 'primary' : 'gray'"
                      />
                      <UInput
                        v-model="exp.endDate"
                        label="End"
                        placeholder="Present"
                        size="sm"
                        icon="i-heroicons-calendar"
                        :color="exp.endDate ? 'primary' : 'gray'"
                        list="date-end-suggestions"
                      />
                      <datalist id="date-end-suggestions">
                        <option value="Present" />
                        <option value="Currently" />
                      </datalist>
                    </div>
                    <UTextarea
                      v-model="exp.description"
                      label="Description"
                      :hint="`${exp.description?.length || 0} characters`"
                      :rows="3"
                      placeholder="• Developed REST API with Node.js&#10;• Reduced loading time by 40%&#10;• Managed team of 3 developers"
                      size="sm"
                      :color="exp.description ? 'primary' : 'gray'"
                      :maxlength="1000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Education tab -->
            <div v-if="activeTab === 'education'">
              <div class="mb-2 sm:mb-3 flex items-center justify-between">
                <p class="text-[11px] sm:text-xs text-gray-600">{{ cv.education.filter(f => f.degree).length }} education(s)</p>
                <UButton @click="ajouterFormation" size="xs" color="indigo" icon="i-heroicons-plus">
                  <span class="hidden sm:inline">New education</span>
                  <span class="sm:hidden">Add</span>
                </UButton>
              </div>

              <div class="space-y-2 sm:space-y-3">
                <div v-for="(form, index) in cv.education" :key="index"
                     class="bg-white border-2 border-gray-200 rounded-xl p-3 sm:p-4 hover:border-indigo-300 transition-all hover:shadow-md group">
                  <div class="flex justify-between items-center mb-2 sm:mb-3">
                    <div class="flex items-center gap-1.5 sm:gap-2">
                      <div class="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span class="text-[11px] sm:text-xs font-bold text-purple-600">{{ index + 1 }}</span>
                      </div>
                      <span class="text-[11px] sm:text-xs font-semibold text-gray-700">Education {{ index + 1 }}</span>
                    </div>
                    <div class="flex gap-0.5 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <UButton
                        v-if="index > 0"
                        @click="moveFormation(index, -1)"
                        size="xs"
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-arrow-up"
                        title="Move up"
                      />
                      <UButton
                        v-if="index < cv.education.length - 1"
                        @click="moveFormation(index, 1)"
                        size="xs"
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-arrow-down"
                        title="Move down"
                      />
                      <UButton
                        @click="dupliquerFormation(index)"
                        size="xs"
                        color="blue"
                        variant="ghost"
                        icon="i-heroicons-document-duplicate"
                        title="Duplicate"
                      />
                      <UButton
                        @click="supprimerFormation(index)"
                        size="xs"
                        color="red"
                        variant="ghost"
                        icon="i-heroicons-trash"
                        title="Delete"
                      />
                    </div>
                  </div>
                  <div class="space-y-2 sm:space-y-2.5">
                    <div class="grid grid-cols-1 gap-2">
                      <UInput
                        v-model="form.degree"
                        label="Degree"
                        placeholder="Master in Computer Science"
                        size="sm"
                        icon="i-heroicons-academic-cap"
                        :color="form.degree ? 'primary' : 'gray'"
                      />
                      <UInput
                        v-model="form.school"
                        label="School / University"
                        placeholder="University of California"
                        size="sm"
                        icon="i-heroicons-building-library"
                        :color="form.school ? 'primary' : 'gray'"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <UInput
                        v-model="form.city"
                        label="City"
                        placeholder="New York"
                        size="sm"
                        icon="i-heroicons-map-pin"
                        :color="form.city ? 'primary' : 'gray'"
                        list="city-suggestions-formation"
                      />
                      <datalist id="city-suggestions-formation">
                        <option value="New York" />
                        <option value="Los Angeles" />
                        <option value="Chicago" />
                        <option value="Houston" />
                        <option value="Phoenix" />
                        <option value="Philadelphia" />
                        <option value="San Antonio" />
                        <option value="San Diego" />
                        <option value="Dallas" />
                        <option value="San Jose" />
                      </datalist>
                      <UInput
                        v-model="form.year"
                        label="Period"
                        placeholder="2018 - 2020"
                        size="sm"
                        icon="i-heroicons-calendar-days"
                        :color="form.year ? 'primary' : 'gray'"
                      />
                    </div>
                    <UTextarea
                      v-model="form.description"
                      label="Description"
                      :hint="`${form.description?.length || 0} characters`"
                      :rows="2"
                      placeholder="Specialization in Artificial Intelligence, with highest honors"
                      size="sm"
                      :color="form.description ? 'primary' : 'gray'"
                      :maxlength="500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Skills tab -->
            <div v-if="activeTab === 'skills'">
              <!-- Technical skills -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-xl p-4 hover:border-indigo-300 transition-all hover:shadow-sm mb-4">
                <div class="flex items-center justify-between mb-3 pb-2 border-b border-blue-200">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UIcon name="i-heroicons-code-bracket" class="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <h3 class="text-xs font-bold uppercase tracking-wide text-gray-700">Technical skills</h3>
                  </div>
                </div>
                <UTextarea
                  v-model="cv.skills"
                  label="Your skills"
                  :hint="`${skillsArray.length} skill(s) • Separate with commas`"
                  :rows="4"
                  placeholder="JavaScript, Python, React, Node.js, Docker, MongoDB, PostgreSQL, AWS..."
                  size="sm"
                  :color="cv.skills ? 'primary' : 'gray'"
                />
                <div v-if="skillsArray.length > 0" class="mt-3 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-medium text-blue-700">{{ skillsArray.length }} skill{{ skillsArray.length > 1 ? 's' : '' }} added</span>
                    <button
                      @click="cv.skills = ''"
                      class="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="(comp, i) in skillsArray"
                      :key="i"
                      class="group relative px-2.5 py-1 bg-white border border-blue-200 rounded-full text-xs font-medium text-blue-700 hover:border-blue-400 transition-all hover:shadow-sm"
                    >
                      {{ comp }}
                      <button
                        @click="removeSkill(comp)"
                        class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Languages -->
              <div class="bg-gradient-to-br from-emerald-50 to-green-50/50 border border-emerald-200 rounded-xl p-3 sm:p-4 hover:border-emerald-300 transition-all hover:shadow-sm mb-3 sm:mb-4">
                <div class="flex items-center justify-between mb-2 sm:mb-3 pb-2 border-b border-emerald-200">
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <div class="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <UIcon name="i-heroicons-language" class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                    </div>
                    <h3 class="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-gray-700">Languages</h3>
                  </div>
                  <UButton @click="ajouterLangue" size="xs" color="emerald" variant="ghost" icon="i-heroicons-plus">
                    Add
                  </UButton>
                </div>
                <div class="space-y-2">
                  <div v-for="(langue, index) in cv.languages" :key="index" class="bg-white rounded-lg p-2 sm:p-2.5 border border-emerald-100 hover:border-emerald-300 transition-all group">
                    <div class="flex gap-1.5 sm:gap-2 items-end mb-2">
                      <UInput
                        v-model="langue.name"
                        label="Language"
                        class="flex-1"
                        placeholder="English"
                        size="sm"
                        icon="i-heroicons-language"
                        :color="langue.name ? 'primary' : 'gray'"
                        list="language-suggestions"
                      />
                      <UButton
                        @click="supprimerLangue(index)"
                        size="sm"
                        color="red"
                        variant="ghost"
                        icon="i-heroicons-trash"
                        class="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <datalist id="language-suggestions">
                      <option value="English" />
                      <option value="Spanish" />
                      <option value="French" />
                      <option value="German" />
                      <option value="Italian" />
                      <option value="Chinese" />
                      <option value="Japanese" />
                      <option value="Arabic" />
                      <option value="Portuguese" />
                      <option value="Russian" />
                    </datalist>
                    <UInput
                      v-model="langue.level"
                      label="Level"
                      placeholder="Native, Fluent, Intermediate, Basic, A1, B2, C1..."
                      size="sm"
                      icon="i-heroicons-chart-bar"
                      :color="langue.level ? 'primary' : 'gray'"
                      list="level-suggestions"
                    />
                    <datalist id="level-suggestions">
                      <option value="Native" />
                      <option value="Fluent" />
                      <option value="Conversational" />
                      <option value="Intermediate" />
                      <option value="Basic" />
                      <option value="A1" />
                      <option value="A2" />
                      <option value="B1" />
                      <option value="B2" />
                      <option value="C1" />
                      <option value="C2" />
                    </datalist>
                  </div>
                </div>
              </div>

              <!-- Certifications -->
              <div class="bg-gradient-to-br from-amber-50 to-yellow-50/50 border border-amber-200 rounded-xl p-3 sm:p-4 hover:border-amber-300 transition-all hover:shadow-sm">
                <div class="flex items-center justify-between mb-2 sm:mb-3 pb-2 border-b border-amber-200">
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <div class="w-5 h-5 sm:w-6 sm:h-6 bg-amber-100 rounded-lg flex items-center justify-center">
                      <UIcon name="i-heroicons-shield-check" class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
                    </div>
                    <h3 class="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-gray-700">Certifications</h3>
                  </div>
                  <UButton @click="ajouterCertification" size="xs" color="amber" variant="ghost" icon="i-heroicons-plus">
                    Add
                  </UButton>
                </div>
                <div class="space-y-2">
                  <div v-for="(cert, index) in cv.certifications" :key="index" class="bg-white rounded-lg p-2 sm:p-2.5 border border-amber-100 hover:border-amber-300 transition-all group">
                    <div class="flex gap-1.5 sm:gap-2 items-end mb-2">
                      <UInput
                        v-model="cert.name"
                        label="Certification"
                        class="flex-1"
                        placeholder="AWS Certified Solutions Architect"
                        size="sm"
                        icon="i-heroicons-shield-check"
                        :color="cert.name ? 'primary' : 'gray'"
                        list="certification-suggestions"
                      />
                      <UButton
                        @click="supprimerCertification(index)"
                        size="sm"
                        color="red"
                        variant="ghost"
                        icon="i-heroicons-trash"
                        class="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <datalist id="certification-suggestions">
                      <option value="AWS Certified Solutions Architect" />
                      <option value="Google Cloud Professional" />
                      <option value="Microsoft Azure Fundamentals" />
                      <option value="Certified Kubernetes Administrator" />
                      <option value="PMP - Project Management Professional" />
                      <option value="Scrum Master Certification" />
                      <option value="CISSP - Security Professional" />
                    </datalist>
                    <UInput
                      v-model="cert.year"
                      label="Year"
                      placeholder="2024"
                      size="sm"
                      icon="i-heroicons-calendar"
                      :color="cert.year ? 'primary' : 'gray'"
                      maxlength="4"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Zone de prévisualisation -->
      <div class="bg-gradient-to-br from-gray-100 to-gray-200 overflow-y-auto flex items-start justify-center p-3 sm:p-6 lg:p-8 relative" :class="{ 'hidden lg:flex': mobileView === 'form' }">
        <!-- Contrôles de zoom -->
        <div class="fixed bottom-3 sm:bottom-6 right-3 sm:right-6 bg-white rounded-xl shadow-xl border border-gray-200 p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-3 z-10">
          <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-minus" @click="zoomOut" class="p-1 sm:p-1.5" />
          <span class="text-[11px] sm:text-xs font-bold text-gray-700 w-10 sm:w-14 text-center">{{ Math.round(zoom * 100) }}%</span>
          <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-plus" @click="zoomIn" class="p-1 sm:p-1.5" />
          <div class="h-4 sm:h-5 w-px bg-gray-300"></div>
          <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-arrows-pointing-out" @click="zoom = 0.5" title="Ajuster" class="p-1 sm:p-1.5" />
        </div>

        <!-- CV Preview avec échelle A4 -->
        <div :style="{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }">
          <div class="bg-white rounded-2xl overflow-hidden shadow-2xl" style="width: 210mm; height: 297mm;">
            <div ref="cvPreview" data-cv-preview style="width: 210mm; height: 297mm; display: flex;">
              <!-- Templates avec composants -->
              <CvTemplateModern v-if="selectedTemplate.id === 'modern'" :cv="cv" />
              <CvTemplateClassic v-else-if="selectedTemplate.id === 'classic'" :cv="cv" />
              <CvTemplateMinimal v-else-if="selectedTemplate.id === 'minimal'" :cv="cv" />
              <CvTemplateCreative v-else-if="selectedTemplate.id === 'creative'" :cv="cv" />
              <CvTemplateElegant v-else-if="selectedTemplate.id === 'elegant'" :cv="cv" />
              <CvTemplateBold v-else-if="selectedTemplate.id === 'bold'" :cv="cv" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Keyboard shortcuts modal -->
    <div v-if="showShortcuts" @click="showShortcuts = false" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div @click.stop class="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <UIcon name="i-heroicons-command-line" class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            Keyboard shortcuts
          </h3>
          <button @click="showShortcuts = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div class="space-y-2 sm:space-y-3">
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Undo</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + Z</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Redo</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + Y</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Save (JSON)</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + S</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Export PDF</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + P</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Zoom in</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + +</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Zoom out</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + -</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Reset zoom</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + 0</kbd>
          </div>
        </div>

        <div class="mt-4 sm:mt-6 p-3 sm:p-4 bg-indigo-50 rounded-lg">
          <p class="text-[11px] sm:text-xs text-indigo-800 flex items-start gap-2">
            <UIcon name="i-heroicons-information-circle-solid" class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
            <span>Your data is automatically saved every 30 seconds in your browser.</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Saved CVs modal -->
    <SavedCVsModal
      :show="showSavedCVsModal"
      :templates="templates"
      @close="showSavedCVsModal = false"
      @load="loadSavedCV"
    />

    <!-- Template gallery (global modal) -->
    <!-- Backdrop for gallery -->
    <div v-if="showTemplateGallery" @click="showTemplateGallery = false" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"></div>

    <!-- Balanced template gallery -->
    <div v-if="showTemplateGallery" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-5 z-[9999] w-[90vw] sm:w-[600px] max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-bold text-gray-900">Choose a template</h3>
          <p class="text-xs text-gray-500 mt-0.5">6 styles available</p>
        </div>
        <button @click="showTemplateGallery = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          v-for="template in templates"
          :key="template?.id || 'template'"
          @click="selectedTemplate = template; showTemplateGallery = false"
          :class="[
            'group relative p-4 rounded-xl border-2 transition-all',
            selectedTemplate?.id === template?.id
              ? 'border-indigo-500 bg-indigo-50 shadow-md'
              : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
          ]"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <div :class="`w-12 h-12 rounded-lg bg-gradient-to-br ${template?.color || 'from-indigo-500 to-purple-600'} shadow-md flex items-center justify-center group-hover:scale-105 transition-transform`">
              <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-white" />
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-900">{{ template?.label || 'Template' }}</div>
              <p class="text-[11px] text-gray-500 mt-0.5">{{ template?.description || '' }}</p>
            </div>
          </div>
          <!-- Badge sélectionné -->
          <div v-if="selectedTemplate?.id === template?.id" class="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-check" class="w-3 h-3 text-white" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { domToBlob } from 'modern-screenshot'
import jsPDF from 'jspdf'
import { isValidEmail, isValidUrl, getColorVariant } from '~/utils/validation'
import { parseSkills } from '~/composables/useCV'
import { formatDate, generateFilename, countWords } from '~/utils/helpers'
import { useCustomToast } from '~/composables/useCustomToast'
import { useSavedCVs } from '~/composables/useSavedCVs'
import { useTranslatedConstants } from '~/composables/useTranslatedConstants'
import { useAutoSave } from '~/composables/useAutoSave'
import { useHistory } from '~/composables/useHistory'
import { useCVStats } from '~/composables/useCVStats'
import SavedCVsModal from '~/components/cv/SavedCVsModal.vue'
import ToastContainer from '~/components/ui/ToastContainer.vue'

const { t } = useI18n()

const toast = useCustomToast()
const savedCVsManager = useSavedCVs()
const { tabs, templates, colorPresets, languageLevels, skillLevels } = useTranslatedConstants()

const documentTitle = ref('My CV')
const lastModified = ref(formatDate())
const activeTab = ref('info')
const mobileView = ref('form') // 'form' or 'preview'
const zoom = ref(0.5)
const accentColor = ref('#4f46e5')
const fileInput = ref(null)
const autoSaveEnabled = ref(true)
const lastSaved = ref(null)
const showShortcuts = ref(false)
const showTemplateGallery = ref(false)
const showSavedCVsModal = ref(false)
const currentCVId = ref(null)

const selectedTemplate = ref(templates.value[0] || { id: 'modern', label: 'Modern', description: 'Modern template', color: 'from-indigo-500 to-purple-600' })

const cv = ref({
  photo: '',
  showPhoto: true, // New field to enable/disable photo
  firstName: '',
  lastName: '',
  title: '',
  about: '',
  age: '',
  drivingLicense: false,
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
  github: '',
  experiences: [{ position: '', company: '', contractType: '', startDate: '', endDate: '', description: '' }],
  education: [{ degree: '', school: '', city: '', year: '', description: '' }],
  skills: '',
  languages: [{ name: '', level: 'Intermediate' }],
  certifications: [{ name: '', year: '' }]
})

const cvPreview = ref(null)

// Initialize CV stats composable
const { skillsArray, completionPercentage, cvStats, cvInsight } = useCVStats(cv)

// Initialize optimized composables
const { undo, redo, canUndo, canRedo, reset: resetHistory } = useHistory(cv, {
  maxSize: 50,
  debounceMs: 1000
})

const { forceSave: forceSaveToStorage } = useAutoSave(
  [cv, documentTitle, accentColor, selectedTemplate],
  {
    enabled: autoSaveEnabled,
    saveFn: () => {
      saveToLocalStorage()
      lastSaved.value = formatDate()
    },
    debounceMs: 2000,
    intervalMs: 30000
  }
)

// CV stats (completionPercentage, cvStats, cvInsight, skillsArray) now from useCVStats composable

// CSS Variables pour la couleur d'accent
const accentColorDark = computed(() => getColorVariant(accentColor.value, 'dark'))
const accentColorLight = computed(() => getColorVariant(accentColor.value, 'light'))

watch([accentColor, accentColorDark, accentColorLight], () => {
  if (cvPreview.value) {
    cvPreview.value.style.setProperty('--accent-color', accentColor.value)
    cvPreview.value.style.setProperty('--accent-color-dark', accentColorDark.value)
    cvPreview.value.style.setProperty('--accent-color-light', accentColorLight.value)
  }
}, { immediate: true })

// skillsArray now from useCVStats composable

// Gestion des expériences
const ajouterExperience = () => {
  cv.value.experiences.push({ position: '', company: '', contractType: '', startDate: '', endDate: '', description: '' })
}

const supprimerExperience = (index) => {
  cv.value.experiences.splice(index, 1)
}

const moveExperience = (index, direction) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < cv.value.experiences.length) {
    const temp = cv.value.experiences[index]
    cv.value.experiences[index] = cv.value.experiences[newIndex]
    cv.value.experiences[newIndex] = temp
  }
}

const dupliquerExperience = (index) => {
  const experience = { ...cv.value.experiences[index] }
  cv.value.experiences.splice(index + 1, 0, experience)
  toast.success('Experience duplicated')
}

// Gestion des formations
const ajouterFormation = () => {
  cv.value.education.push({ degree: '', school: '', city: '', year: '', description: '' })
}

const supprimerFormation = (index) => {
  cv.value.education.splice(index, 1)
}

const moveFormation = (index, direction) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < cv.value.education.length) {
    const temp = cv.value.education[index]
    cv.value.education[index] = cv.value.education[newIndex]
    cv.value.education[newIndex] = temp
  }
}

const dupliquerFormation = (index) => {
  const formation = { ...cv.value.education[index] }
  cv.value.education.splice(index + 1, 0, formation)
  toast.success('Education duplicated')
}

// Language management
const ajouterLangue = () => {
  cv.value.languages.push({ name: '', level: 'Intermediate' })
}

const supprimerLangue = (index) => {
  cv.value.languages.splice(index, 1)
}

// Gestion des certifications
const ajouterCertification = () => {
  cv.value.certifications.push({ name: '', year: '' })
}

const supprimerCertification = (index) => {
  cv.value.certifications.splice(index, 1)
}

// Note: isValidEmail and isValidUrl are now imported from ~/utils/validation

// Gestion des compétences
const removeSkill = (skillToRemove) => {
  const skills = skillsArray.value.filter(skill => skill !== skillToRemove)
  cv.value.skills = skills.join(', ')
}

// Zoom
const zoomIn = () => {
  if (zoom.value < 1.5) zoom.value += 0.1
}

const zoomOut = () => {
  if (zoom.value > 0.3) zoom.value -= 0.1
}

// Load example data
const loadExampleData = () => {
  if (confirm('Load example CV? Your current data will be replaced.')) {
    toast.info('Loading example data...')
    cv.value = {
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      showPhoto: true,
      firstName: 'John',
      lastName: 'Smith',
      title: 'Senior Full Stack Developer',
      about: 'Passionate about modern web development with over 8 years of experience. Specialized in cloud-native architectures and high-performance applications. Expert in Vue.js, React, and Node.js with a strong appetite for innovation and emerging technologies.',
      age: '32',
      drivingLicense: true,
      email: 'john.smith@email.com',
      phone: '+1 555-123-4567',
      location: 'San Francisco, USA',
      linkedin: 'linkedin.com/in/john-smith',
      website: 'johnsmith.dev',
      github: 'github.com/jsmith',
      experiences: [
        {
          position: 'Lead Developer',
          company: 'TechCorp',
          contractType: 'CDI (Contrat à Durée Indéterminée)',
          startDate: 'Jan 2021',
          endDate: 'Present',
          description: '• Technical leadership of a team of 6 developers\n• Complete microservices architecture overhaul (Node.js, Docker, Kubernetes)\n• Improved performance by 60% and reduced cloud costs by 40%\n• Implemented CI/CD and DevOps best practices'
        },
        {
          position: 'Full Stack Developer',
          company: 'StartupTech',
          contractType: 'CDI (Contrat à Durée Indéterminée)',
          startDate: 'Mar 2018',
          endDate: 'Dec 2020',
          description: '• Developed complex features in Vue.js and Node.js\n• Created REST API used by over 100k users\n• Integrated payment solutions (Stripe, PayPal)\n• SEO optimization and accessibility improvements'
        },
        {
          position: 'Junior Web Developer',
          company: 'WebAgency',
          contractType: 'Stage',
          startDate: 'Sep 2016',
          endDate: 'Feb 2018',
          description: '• Developed responsive websites with React and WordPress\n• Collaborated with design teams for pixel-perfect integration\n• Maintained and evolved existing client projects'
        }
      ],
      education: [
        {
          degree: 'Master in Computer Science - Software Engineering',
          school: 'University of California',
          city: 'San Francisco',
          year: '2014 - 2016',
          description: 'Specialization in software architectures and web development. With highest honors.'
        },
        {
          degree: 'Bachelor in Computer Science',
          school: 'State University',
          city: 'Los Angeles',
          year: '2011 - 2014',
          description: 'General computer science education with focus on object-oriented programming.'
        }
      ],
      skills: 'JavaScript, TypeScript, Vue.js, React, Node.js, Express, NestJS, MongoDB, PostgreSQL, Redis, Docker, Kubernetes, AWS, CI/CD, Git, Agile, TDD',
      languages: [
        { name: 'English', level: 'Native' },
        { name: 'Spanish', level: 'Fluent (C1)' },
        { name: 'French', level: 'Intermediate (B1)' }
      ],
      certifications: [
        { name: 'AWS Certified Solutions Architect', year: '2023' },
        { name: 'Google Cloud Professional Developer', year: '2022' },
        { name: 'MongoDB Certified Developer', year: '2021' }
      ]
    }
    documentTitle.value = 'CV - John Smith'
    accentColor.value = '#7c3aed'
    toast.success('✨ Example data loaded successfully!')
  }
}

// Create new empty CV
const createNewCV = () => {
  if (confirm('Do you want to create a new empty CV?\n\nUnsaved current data will be lost.')) {
    cv.value = {
      photo: '',
      showPhoto: true,
      firstName: '',
      lastName: '',
      title: '',
      about: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      github: '',
      experiences: [{ position: '', company: '', contractType: '', startDate: '', endDate: '', description: '' }],
      education: [{ degree: '', school: '', city: '', year: '', description: '' }],
      skills: '',
      languages: [{ name: '', level: 'Intermediate' }],
      certifications: [{ name: '', year: '' }]
    }
    accentColor.value = '#4f46e5'
    documentTitle.value = 'New CV'
    currentCVId.value = null // Important: reset ID to create a new CV
    toast.success('✨ New CV created')
  }
}

// Reset (garde pour compatibilité, mais redirige vers createNewCV)
const resetCV = () => {
  createNewCV()
}

// Import JSON
const triggerImportJSON = () => {
  fileInput.value?.click()
}

const importJSON = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      cv.value = data
      alert('CV imported successfully!')
    } catch (error) {
      console.error('Import error:', error)
      alert('Error importing file. Make sure it is a valid JSON file.')
    }
  }
  reader.readAsText(file)

  // Reset input
  event.target.value = ''
}

// Save as new CV
const saveAsNewCV = () => {
  const defaultName = documentTitle.value || `CV - ${cv.value.firstName || ''} ${cv.value.lastName || ''}`.trim()
  const name = prompt('Give a name to this new CV:', defaultName)

  if (!name) {
    toast.error('Save cancelled')
    return
  }

  try {
    const savedCV = savedCVsManager.saveCV(name, cv.value, accentColor.value, selectedTemplate.value.id)
    currentCVId.value = savedCV.id
    documentTitle.value = name
    toast.success(`✅ New CV "${name}" created successfully!`)
  } catch (error) {
    console.error('Save error:', error)
    toast.error('❌ CV save error')
  }
}

// Save current CV (create or update)
const saveCurrentCV = () => {
  if (currentCVId.value) {
    // A CV is already loaded, ask if we want to update it or create a new one
    const action = confirm('This CV is already saved.\n\nOK = Update the existing CV\nCancel = Create a copy (new CV)')

    if (action) {
      // Update the existing CV
      const name = documentTitle.value || `CV - ${cv.value.firstName || ''} ${cv.value.lastName || ''}`.trim()
      try {
        const success = savedCVsManager.updateCV(currentCVId.value, name, cv.value, accentColor.value, selectedTemplate.value.id)
        if (success) {
          toast.success(`✅ CV "${name}" updated successfully!`)
        } else {
          throw new Error('Update failed')
        }
      } catch (error) {
        console.error('Update error:', error)
        toast.error('❌ CV update error')
      }
    } else {
      // Create a copy (new CV)
      saveAsNewCV()
    }
  } else {
    // No CV loaded, create a new one
    saveAsNewCV()
  }
}

// Load a saved CV
const loadSavedCV = (savedCV) => {
  try {
    cv.value = JSON.parse(JSON.stringify(savedCV.cv))
    accentColor.value = savedCV.accentColor
    const template = templates.find(t => t.id === savedCV.templateId)
    if (template) {
      selectedTemplate.value = template
    }
    documentTitle.value = savedCV.name
    currentCVId.value = savedCV.id
    toast.success(`📂 CV "${savedCV.name}" loaded successfully!`)
  } catch (error) {
    console.error('Load error:', error)
    toast.error('❌ CV load error')
  }
}

// JSON Download
const saveJSON = () => {
  toast.info('Generating JSON file...')
  const dataStr = JSON.stringify(cv.value, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
  const exportFileDefaultName = `${documentTitle.value || 'cv'}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
  toast.success(`💾 JSON file downloaded: ${exportFileDefaultName}`)
}

// Export PDF
const exporterPDF = async () => {
  if (!cvPreview.value) return

  try {
    toast.info('📄 Generating PDF...')
    const currentZoom = zoom.value
    zoom.value = 1

    // Wait for zoom transition to complete
    await new Promise(resolve => setTimeout(resolve, 150))

    // Use modern-screenshot which supports oklch
    const blob = await domToBlob(cvPreview.value, {
      scale: 2,
      backgroundColor: '#ffffff',
      width: cvPreview.value.offsetWidth,
      height: cvPreview.value.offsetHeight,
    })

    // Convert blob to data URL
    const reader = new FileReader()
    const imgData = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    })

    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)

    // Generate filename
    const filename = generateFilename(documentTitle.value, cv.value.firstName, cv.value.lastName, 'pdf')
    pdf.save(filename)

    zoom.value = currentZoom
    toast.success(`🎉 PDF exported successfully: ${filename}`)
  } catch (error) {
    console.error('PDF export error:', error)
    toast.error('❌ PDF export error. Please try again.')
  }
}

// Export PNG
const exporterPNG = async () => {
  if (!cvPreview.value) return

  try {
    toast.info('🖼️ Generating image...')
    const currentZoom = zoom.value
    zoom.value = 1

    await new Promise(resolve => setTimeout(resolve, 150))

    // Use modern-screenshot which supports oklch
    const blob = await domToBlob(cvPreview.value, {
      scale: 3,
      backgroundColor: '#ffffff',
      width: cvPreview.value.offsetWidth,
      height: cvPreview.value.offsetHeight,
    })

    const filename = generateFilename(documentTitle.value, cv.value.firstName, cv.value.lastName, 'png')
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)

    zoom.value = currentZoom
    toast.success(`🎉 Image exported successfully: ${filename}`)
  } catch (error) {
    console.error('PNG export error:', error)
    toast.error('❌ PNG export error. Please try again.')
  }
}

// Update modification date
watch(cv, () => {
  lastModified.value = formatDate()
}, { deep: true })

// Auto-save to localStorage
const saveToLocalStorage = () => {
  if (autoSaveEnabled.value) {
    const dataToSave = {
      cv: cv.value,
      documentTitle: documentTitle.value,
      accentColor: accentColor.value,
      selectedTemplate: selectedTemplate.value,
      zoom: zoom.value
    }
    localStorage.setItem('cv-builder-data', JSON.stringify(dataToSave))
    lastSaved.value = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
}

// Load from localStorage
const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('cv-builder-data')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      cv.value = data.cv
      documentTitle.value = data.documentTitle || 'My CV'
      accentColor.value = data.accentColor || '#4f46e5'
      selectedTemplate.value = data.selectedTemplate || templates[0]
      zoom.value = data.zoom || 0.5
      lastSaved.value = 'Data restored'
    } catch (error) {
      console.error('Load error:', error)
    }
  }
}

// History system now handled by useHistory composable

// Keyboard shortcuts
const handleKeyboardShortcuts = (e) => {
  // Ctrl/Cmd + Z : Undo
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault()
    undo()
  }
  // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y : Redo
  if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
    e.preventDefault()
    redo()
  }
  // Ctrl/Cmd + S : Save JSON
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    saveJSON()
  }
  // Ctrl/Cmd + P : Export PDF
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault()
    exporterPDF()
  }
  // Ctrl/Cmd + + : Zoom in
  if ((e.ctrlKey || e.metaKey) && e.key === '+') {
    e.preventDefault()
    zoomIn()
  }
  // Ctrl/Cmd + - : Zoom out
  if ((e.ctrlKey || e.metaKey) && e.key === '-') {
    e.preventDefault()
    zoomOut()
  }
  // Ctrl/Cmd + 0 : Reset zoom
  if ((e.ctrlKey || e.metaKey) && e.key === '0') {
    e.preventDefault()
    zoom.value = 0.5
  }
}

// Lifecycle hooks
onMounted(() => {
  loadFromLocalStorage()
  // Initialize history with current state
  resetHistory()

  window.addEventListener('keydown', handleKeyboardShortcuts)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardShortcuts)
  // Auto-save handles final save automatically
})

// Auto-save and history are now handled by useAutoSave and useHistory composables
</script>
