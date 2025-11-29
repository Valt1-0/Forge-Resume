<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex flex-col">
    <!-- Toast notifications -->
    <ToastContainer />
    <!-- Toolbar supérieur amélioré -->
    <div class="min-h-[72px] bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 flex flex-col lg:flex-row items-start lg:items-center justify-between px-3 sm:px-6 py-3 lg:py-0 flex-shrink-0 shadow-sm gap-3 lg:gap-0">
      <div class="flex items-center gap-2 sm:gap-4 animate-slide-in w-full lg:w-auto">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover-lift animate-float">
          <UIcon name="i-heroicons-document-text" class="w-5 h-5 sm:w-7 sm:h-7 text-white" />
        </div>
        <div class="flex flex-col flex-1 lg:flex-initial">
          <input
            v-model="documentTitle"
            class="text-sm sm:text-base font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-gray-50 transition-all-smooth w-full"
            placeholder="Sans titre"
          />
          <div class="hidden sm:flex items-center gap-3 text-xs text-gray-500 px-2 sm:px-3">
            <span class="flex items-center gap-1">
              <UIcon name="i-heroicons-clock" class="w-3 h-3" />
              Modifié {{ lastModified }}
            </span>
            <span v-if="lastSaved" class="flex items-center gap-1 text-green-600 font-medium animate-fade-in">
              <UIcon name="i-heroicons-check-circle-solid" class="w-3 h-3" />
              Sauvegardé {{ lastSaved }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3 animate-slide-in overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0" style="animation-delay: 0.1s">
        <!-- Groupe: Apparence -->
        <div class="flex items-center gap-1 sm:gap-2 bg-white rounded-xl p-1.5 sm:p-2 shadow-sm border border-gray-200 hover-lift flex-shrink-0">
          <!-- Sélecteur de template avec galerie -->
          <div class="relative">
            <button
              @click="showTemplateGallery = !showTemplateGallery"
              class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all-smooth group whitespace-nowrap"
            >
              <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4 sm:hidden text-indigo-600" />
              <div :class="`hidden sm:block w-5 h-5 sm:w-6 sm:h-6 rounded-md shadow-sm bg-gradient-to-br ${selectedTemplate.color}`"></div>
              <span class="text-xs sm:text-sm font-semibold text-gray-800">{{ selectedTemplate.label }}</span>
              <UIcon name="i-heroicons-chevron-down" class="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500 group-hover:text-indigo-700 transition-transform duration-300" :class="{ 'rotate-180': showTemplateGallery }" />
            </button>

          </div>

          <!-- Sélecteur de couleur -->
          <div class="hidden md:flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
            <label class="text-xs font-semibold text-gray-700 hidden lg:inline">Couleur</label>
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
                title="Couleur personnalisée"
              />
            </div>
          </div>
        </div>

        <!-- Groupe: Undo/Redo -->
        <div class="hidden sm:flex items-center gap-2 bg-white rounded-xl p-1.5 sm:p-2 shadow-sm border border-gray-200 hover-lift flex-shrink-0">
          <div class="flex items-center gap-1">
            <button @click="undo" :disabled="!canUndo" :title="`Annuler (Ctrl+Z)${!canUndo ? ' - Aucune action à annuler' : ''}`"
                    :class="['p-1.5 sm:p-2 rounded-lg transition-all-smooth', canUndo ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' : 'text-gray-300 cursor-not-allowed']">
              <UIcon name="i-heroicons-arrow-uturn-left" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button @click="redo" :disabled="!canRedo" :title="`Rétablir (Ctrl+Y)${!canRedo ? ' - Aucune action à rétablir' : ''}`"
                    :class="['p-1.5 sm:p-2 rounded-lg transition-all-smooth', canRedo ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' : 'text-gray-300 cursor-not-allowed']">
              <UIcon name="i-heroicons-arrow-uturn-right" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <!-- Groupe: Fichiers & Actions -->
        <div class="flex items-center gap-1 sm:gap-1.5 bg-white rounded-xl p-1.5 sm:p-2 shadow-sm border border-gray-200 hover-lift flex-shrink-0">
          <button @click="showShortcuts = !showShortcuts" title="Raccourcis clavier"
                  class="p-1.5 sm:p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all-smooth group flex-shrink-0">
            <UIcon name="i-heroicons-information-circle" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
          </button>
          <div class="w-px h-4 sm:h-5 bg-gray-200 hidden sm:block"></div>
          <button @click="showSavedCVsModal = true" title="Mes CV sauvegardés"
                  class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-folder-open" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span class="hidden lg:inline">Mes CV</span>
          </button>
          <button @click="saveCurrentCV" title="Sauvegarder ce CV"
                  class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-bookmark-solid" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span class="hidden sm:inline">Sauvegarder</span>
          </button>
          <div class="w-px h-4 sm:h-5 bg-gray-200 hidden sm:block"></div>
          <button @click="triggerImportJSON" title="Importer un CV (JSON)"
                  class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-arrow-up-tray" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span class="hidden sm:inline">Importer</span>
          </button>
          <input ref="fileInput" type="file" accept=".json" @change="importJSON" class="hidden" />
          <button @click="saveJSON" title="Télécharger le CV (JSON)"
                  class="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-arrow-down-tray" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span>Télécharger</span>
          </button>
          <div class="w-px h-4 sm:h-5 bg-gray-200 hidden sm:block"></div>
          <button @click="createNewCV" title="Créer un nouveau CV vide"
                  class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-document-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span class="hidden lg:inline">Nouveau</span>
          </button>
          <button @click="loadExampleData" title="Charger un exemple de CV"
                  class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all-smooth group whitespace-nowrap">
            <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span class="hidden lg:inline">Exemple</span>
          </button>
        </div>

        <!-- Boutons Export -->
        <div class="flex gap-2 flex-shrink-0">
          <button @click="exporterPDF"
                  class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all-smooth group whitespace-nowrap"
                  title="Exporter en PDF">
            <UIcon name="i-heroicons-document-arrow-down" class="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span class="hidden sm:inline">PDF</span>
          </button>
          <button @click="exporterPNG"
                  class="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all-smooth group whitespace-nowrap"
                  title="Exporter en PNG">
            <UIcon name="i-heroicons-photo" class="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span class="hidden sm:inline">PNG</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toggle mobile pour basculer entre formulaire et prévisualisation -->
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
          <span>Éditer</span>
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
          <span>Aperçu</span>
        </div>
        <div v-if="mobileView === 'preview'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
      </button>
    </div>

    <!-- Layout principal -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[400px_1fr] overflow-hidden">
      <!-- Sidebar formulaire avec onglets -->
      <div class="bg-white border-r border-gray-200 overflow-hidden flex flex-col" :class="{ 'hidden lg:flex': mobileView === 'preview' }">
        <!-- Onglets -->
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

        <!-- Barre de progression et stats améliorée -->
        <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-3 sm:px-5 py-3 sm:py-4 border-b border-indigo-100 shadow-sm">
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <UIcon name="i-heroicons-chart-bar" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <span class="text-[11px] sm:text-xs font-bold text-gray-800">Progression</span>
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

          <!-- Barre de progression moderne -->
          <div class="relative w-full h-2.5 sm:h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden shadow-inner mb-3 sm:mb-4">
            <div
              class="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out progress-indeterminate"
              :style="{ width: completionPercentage + '%' }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          </div>

          <!-- Stats détaillées -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            <div class="bg-white/70 backdrop-blur rounded-lg p-1.5 sm:p-2 text-center hover-lift transition-all cursor-pointer" title="Nombre de mots total">
              <div class="text-base sm:text-lg font-bold text-indigo-600">{{ cvStats.wordCount }}</div>
              <div class="text-[10px] sm:text-2xs text-gray-600 font-medium">Mots</div>
            </div>
            <div class="bg-white/70 backdrop-blur rounded-lg p-1.5 sm:p-2 text-center hover-lift transition-all cursor-pointer" title="Compétences listées">
              <div class="text-base sm:text-lg font-bold text-purple-600">{{ cvStats.skillCount }}</div>
              <div class="text-[10px] sm:text-2xs text-gray-600 font-medium">Compétences</div>
            </div>
            <div class="bg-white/70 backdrop-blur rounded-lg p-1.5 sm:p-2 text-center hover-lift transition-all cursor-pointer" title="Langues parlées">
              <div class="text-base sm:text-lg font-bold text-pink-600">{{ cvStats.languageCount }}</div>
              <div class="text-[10px] sm:text-2xs text-gray-600 font-medium">Langues</div>
            </div>
            <div class="bg-white/70 backdrop-blur rounded-lg p-1.5 sm:p-2 text-center hover-lift transition-all cursor-pointer" title="Formations académiques">
              <div class="text-base sm:text-lg font-bold text-blue-600">{{ cvStats.educationCount }}</div>
              <div class="text-[10px] sm:text-2xs text-gray-600 font-medium">Formations</div>
            </div>
          </div>
        </div>

        <!-- Contenu des onglets -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-3 sm:p-5 space-y-3 sm:space-y-4">

            <!-- Onglet Informations -->
            <div v-if="activeTab === 'info'">
              <!-- Informations personnelles -->
              <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-indigo-200 transition-all hover:shadow-sm">
                <div class="flex items-center justify-between mb-2 sm:mb-3 pb-2 border-b border-gray-200">
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <div class="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <UIcon name="i-heroicons-user" class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600" />
                    </div>
                    <h3 class="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-gray-700">Infos personnelles</h3>
                  </div>
                </div>
                <div class="space-y-3">
                  <!-- Toggle pour afficher/masquer la photo -->
                  <div class="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-heroicons-photo" class="w-3.5 h-3.5 text-gray-600" />
                      <span class="text-xs font-medium text-gray-700">Afficher la photo</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="cv.showPhoto" class="sr-only peer">
                      <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <UInput
                    v-if="cv.showPhoto"
                    v-model="cv.photo"
                    label="Photo de profil (URL)"
                    hint="Recommandé: format carré, min 400x400px"
                    placeholder="https://exemple.com/photo.jpg"
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
                      v-model="cv.prenom"
                      label="Prénom *"
                      placeholder="Jean"
                      size="sm"
                      icon="i-heroicons-user"
                      :color="cv.prenom ? 'primary' : 'gray'"
                    />
                    <UInput
                      v-model="cv.nom"
                      label="Nom *"
                      placeholder="Dupont"
                      size="sm"
                      icon="i-heroicons-user"
                      :color="cv.nom ? 'primary' : 'gray'"
                    />
                  </div>

                  <UInput
                    v-model="cv.titre"
                    label="Titre / Poste *"
                    hint="Ex: Développeur Full Stack Senior"
                    placeholder="Développeur Full Stack"
                    size="sm"
                    icon="i-heroicons-briefcase"
                    :color="cv.titre ? 'primary' : 'gray'"
                  >
                    <template #trailing>
                      <span v-if="cv.titre" class="text-xs text-gray-400">{{ cv.titre.length }}</span>
                    </template>
                  </UInput>

                  <UTextarea
                    v-model="cv.apropos"
                    label="À propos"
                    :hint="`${cv.apropos?.length || 0} / 500 caractères recommandés`"
                    :rows="4"
                    placeholder="Développeur passionné avec 5 ans d'expérience..."
                    size="sm"
                    :color="cv.apropos ? 'primary' : 'gray'"
                    :maxlength="1000"
                  />
                  <div v-if="cv.apropos && cv.apropos.length > 0" class="mt-1.5 flex items-center gap-2">
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="cv.apropos.length <= 500 ? 'bg-green-500' : cv.apropos.length <= 750 ? 'bg-yellow-500' : 'bg-red-500'"
                        :style="{ width: Math.min((cv.apropos.length / 1000) * 100, 100) + '%' }"
                      ></div>
                    </div>
                    <span class="text-xs font-medium" :class="cv.apropos.length <= 500 ? 'text-green-600' : cv.apropos.length <= 750 ? 'text-yellow-600' : 'text-red-600'">
                      {{ cv.apropos.length }}
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
                      placeholder="jean.dupont@email.com"
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
                      v-model="cv.telephone"
                      label="Téléphone *"
                      placeholder="+33 6 12 34 56 78"
                      size="sm"
                      icon="i-heroicons-phone"
                      :color="cv.telephone ? 'primary' : 'gray'"
                    />
                    <UInput
                      v-model="cv.localisation"
                      label="Localisation"
                      placeholder="Paris, France"
                      size="sm"
                      icon="i-heroicons-map-pin"
                      :color="cv.localisation ? 'primary' : 'gray'"
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
                      label="Âge"
                      type="number"
                      placeholder="25"
                      size="sm"
                      icon="i-heroicons-cake"
                      :color="cv.age ? 'primary' : 'gray'"
                      min="16"
                      max="99"
                    />
                    <div class="flex flex-col gap-1">
                      <label class="text-xs font-medium text-gray-700">Permis de conduire</label>
                      <label class="relative inline-flex items-center cursor-pointer h-9 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                        <input type="checkbox" v-model="cv.permis" class="sr-only peer">
                        <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[11px] after:start-[14px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span class="ml-3 text-xs font-medium text-gray-700">{{ cv.permis ? 'Oui' : 'Non' }}</span>
                      </label>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-2">
                    <UInput
                      v-model="cv.linkedin"
                      label="LinkedIn"
                      placeholder="linkedin.com/in/jeandupont"
                      size="sm"
                      icon="i-heroicons-link"
                      :color="cv.linkedin ? 'primary' : 'gray'"
                    />
                    <UInput
                      v-model="cv.website"
                      label="Site Web"
                      placeholder="www.jeandupont.fr"
                      size="sm"
                      icon="i-heroicons-globe-alt"
                      :color="cv.website ? 'primary' : 'gray'"
                    />
                    <UInput
                      v-model="cv.github"
                      label="GitHub"
                      placeholder="github.com/jeandupont"
                      size="sm"
                      icon="i-heroicons-code-bracket"
                      :color="cv.github ? 'primary' : 'gray'"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Onglet Expérience -->
            <div v-if="activeTab === 'experience'">
              <div class="mb-2 sm:mb-3 flex items-center justify-between">
                <p class="text-[11px] sm:text-xs text-gray-600">{{ cv.experiences.filter(e => e.poste).length }} expérience(s)</p>
                <UButton @click="ajouterExperience" size="xs" color="indigo" icon="i-heroicons-plus">
                  <span class="hidden sm:inline">Nouvelle expérience</span>
                  <span class="sm:hidden">Ajouter</span>
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
                      <span class="text-[11px] sm:text-xs font-semibold text-gray-700">Expérience {{ index + 1 }}</span>
                    </div>
                    <div class="flex gap-0.5 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <UButton
                        v-if="index > 0"
                        @click="moveExperience(index, -1)"
                        size="xs"
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-arrow-up"
                        title="Monter"
                      />
                      <UButton
                        v-if="index < cv.experiences.length - 1"
                        @click="moveExperience(index, 1)"
                        size="xs"
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-arrow-down"
                        title="Descendre"
                      />
                      <UButton
                        @click="dupliquerExperience(index)"
                        size="xs"
                        color="blue"
                        variant="ghost"
                        icon="i-heroicons-document-duplicate"
                        title="Dupliquer"
                      />
                      <UButton
                        @click="supprimerExperience(index)"
                        size="xs"
                        color="red"
                        variant="ghost"
                        icon="i-heroicons-trash"
                        title="Supprimer"
                      />
                    </div>
                  </div>
                  <div class="space-y-2 sm:space-y-2.5">
                    <div class="grid grid-cols-1 gap-2">
                      <UInput
                        v-model="exp.poste"
                        label="Poste"
                        placeholder="Développeur Full Stack"
                        size="sm"
                        icon="i-heroicons-briefcase"
                        :color="exp.poste ? 'primary' : 'gray'"
                        list="job-suggestions"
                      />
                      <datalist id="job-suggestions">
                        <option value="Développeur Full Stack" />
                        <option value="Développeur Frontend" />
                        <option value="Développeur Backend" />
                        <option value="Ingénieur DevOps" />
                        <option value="Data Scientist" />
                        <option value="Chef de Projet" />
                        <option value="Product Manager" />
                        <option value="Designer UX/UI" />
                      </datalist>
                      <UInput
                        v-model="exp.entreprise"
                        label="Entreprise"
                        placeholder="Google"
                        size="sm"
                        icon="i-heroicons-building-office"
                        :color="exp.entreprise ? 'primary' : 'gray'"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <UInput
                        v-model="exp.dateDebut"
                        label="Début"
                        placeholder="Jan 2020"
                        size="sm"
                        icon="i-heroicons-calendar"
                        :color="exp.dateDebut ? 'primary' : 'gray'"
                      />
                      <UInput
                        v-model="exp.dateFin"
                        label="Fin"
                        placeholder="Présent"
                        size="sm"
                        icon="i-heroicons-calendar"
                        :color="exp.dateFin ? 'primary' : 'gray'"
                        list="date-end-suggestions"
                      />
                      <datalist id="date-end-suggestions">
                        <option value="Présent" />
                        <option value="Actuellement" />
                      </datalist>
                    </div>
                    <UTextarea
                      v-model="exp.description"
                      label="Description"
                      :hint="`${exp.description?.length || 0} caractères`"
                      :rows="3"
                      placeholder="• Développement d'une API REST avec Node.js&#10;• Réduction du temps de chargement de 40%&#10;• Gestion d'une équipe de 3 développeurs"
                      size="sm"
                      :color="exp.description ? 'primary' : 'gray'"
                      :maxlength="1000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Onglet Formation -->
            <div v-if="activeTab === 'education'">
              <div class="mb-2 sm:mb-3 flex items-center justify-between">
                <p class="text-[11px] sm:text-xs text-gray-600">{{ cv.formations.filter(f => f.diplome).length }} formation(s)</p>
                <UButton @click="ajouterFormation" size="xs" color="indigo" icon="i-heroicons-plus">
                  <span class="hidden sm:inline">Nouvelle formation</span>
                  <span class="sm:hidden">Ajouter</span>
                </UButton>
              </div>

              <div class="space-y-2 sm:space-y-3">
                <div v-for="(form, index) in cv.formations" :key="index"
                     class="bg-white border-2 border-gray-200 rounded-xl p-3 sm:p-4 hover:border-indigo-300 transition-all hover:shadow-md group">
                  <div class="flex justify-between items-center mb-2 sm:mb-3">
                    <div class="flex items-center gap-1.5 sm:gap-2">
                      <div class="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span class="text-[11px] sm:text-xs font-bold text-purple-600">{{ index + 1 }}</span>
                      </div>
                      <span class="text-[11px] sm:text-xs font-semibold text-gray-700">Formation {{ index + 1 }}</span>
                    </div>
                    <div class="flex gap-0.5 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <UButton
                        v-if="index > 0"
                        @click="moveFormation(index, -1)"
                        size="xs"
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-arrow-up"
                        title="Monter"
                      />
                      <UButton
                        v-if="index < cv.formations.length - 1"
                        @click="moveFormation(index, 1)"
                        size="xs"
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-arrow-down"
                        title="Descendre"
                      />
                      <UButton
                        @click="dupliquerFormation(index)"
                        size="xs"
                        color="blue"
                        variant="ghost"
                        icon="i-heroicons-document-duplicate"
                        title="Dupliquer"
                      />
                      <UButton
                        @click="supprimerFormation(index)"
                        size="xs"
                        color="red"
                        variant="ghost"
                        icon="i-heroicons-trash"
                        title="Supprimer"
                      />
                    </div>
                  </div>
                  <div class="space-y-2 sm:space-y-2.5">
                    <div class="grid grid-cols-1 gap-2">
                      <UInput
                        v-model="form.diplome"
                        label="Diplôme"
                        placeholder="Master en Informatique"
                        size="sm"
                        icon="i-heroicons-academic-cap"
                        :color="form.diplome ? 'primary' : 'gray'"
                      />
                      <UInput
                        v-model="form.ecole"
                        label="École / Université"
                        placeholder="Université Paris-Saclay"
                        size="sm"
                        icon="i-heroicons-building-library"
                        :color="form.ecole ? 'primary' : 'gray'"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <UInput
                        v-model="form.ville"
                        label="Ville"
                        placeholder="Paris"
                        size="sm"
                        icon="i-heroicons-map-pin"
                        :color="form.ville ? 'primary' : 'gray'"
                        list="city-suggestions-formation"
                      />
                      <datalist id="city-suggestions-formation">
                        <option value="Paris" />
                        <option value="Lyon" />
                        <option value="Marseille" />
                        <option value="Toulouse" />
                        <option value="Bordeaux" />
                        <option value="Lille" />
                        <option value="Nantes" />
                        <option value="Bruxelles" />
                        <option value="Genève" />
                        <option value="Luxembourg" />
                        <option value="Montréal" />
                      </datalist>
                      <UInput
                        v-model="form.annee"
                        label="Période"
                        placeholder="2018 - 2020"
                        size="sm"
                        icon="i-heroicons-calendar-days"
                        :color="form.annee ? 'primary' : 'gray'"
                      />
                    </div>
                    <UTextarea
                      v-model="form.description"
                      label="Description"
                      :hint="`${form.description?.length || 0} caractères`"
                      :rows="2"
                      placeholder="Spécialisation en Intelligence Artificielle, mention Très Bien"
                      size="sm"
                      :color="form.description ? 'primary' : 'gray'"
                      :maxlength="500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Onglet Compétences -->
            <div v-if="activeTab === 'skills'">
              <!-- Compétences techniques -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-xl p-4 hover:border-indigo-300 transition-all hover:shadow-sm mb-4">
                <div class="flex items-center justify-between mb-3 pb-2 border-b border-blue-200">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UIcon name="i-heroicons-code-bracket" class="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <h3 class="text-xs font-bold uppercase tracking-wide text-gray-700">Compétences techniques</h3>
                  </div>
                </div>
                <UTextarea
                  v-model="cv.competences"
                  label="Vos compétences"
                  :hint="`${competencesArray.length} compétence(s) • Séparez par des virgules`"
                  :rows="4"
                  placeholder="JavaScript, Python, React, Node.js, Docker, MongoDB, PostgreSQL, AWS..."
                  size="sm"
                  :color="cv.competences ? 'primary' : 'gray'"
                />
                <div v-if="competencesArray.length > 0" class="mt-3 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-medium text-blue-700">{{ competencesArray.length }} compétence{{ competencesArray.length > 1 ? 's' : '' }} ajoutée{{ competencesArray.length > 1 ? 's' : '' }}</span>
                    <button
                      @click="cv.competences = ''"
                      class="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Tout effacer
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="(comp, i) in competencesArray"
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

              <!-- Langues -->
              <div class="bg-gradient-to-br from-emerald-50 to-green-50/50 border border-emerald-200 rounded-xl p-3 sm:p-4 hover:border-emerald-300 transition-all hover:shadow-sm mb-3 sm:mb-4">
                <div class="flex items-center justify-between mb-2 sm:mb-3 pb-2 border-b border-emerald-200">
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <div class="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <UIcon name="i-heroicons-language" class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                    </div>
                    <h3 class="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-gray-700">Langues</h3>
                  </div>
                  <UButton @click="ajouterLangue" size="xs" color="emerald" variant="ghost" icon="i-heroicons-plus">
                    Ajouter
                  </UButton>
                </div>
                <div class="space-y-2">
                  <div v-for="(langue, index) in cv.langues" :key="index" class="bg-white rounded-lg p-2 sm:p-2.5 border border-emerald-100 hover:border-emerald-300 transition-all group">
                    <div class="flex gap-1.5 sm:gap-2 items-end mb-2">
                      <UInput
                        v-model="langue.nom"
                        label="Langue"
                        class="flex-1"
                        placeholder="Français"
                        size="sm"
                        icon="i-heroicons-language"
                        :color="langue.nom ? 'primary' : 'gray'"
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
                      <option value="Français" />
                      <option value="Anglais" />
                      <option value="Espagnol" />
                      <option value="Allemand" />
                      <option value="Italien" />
                      <option value="Chinois" />
                      <option value="Japonais" />
                      <option value="Arabe" />
                      <option value="Portugais" />
                      <option value="Russe" />
                    </datalist>
                    <div class="space-y-1">
                      <label class="block text-xs font-medium text-gray-700">Niveau</label>
                      <select
                        v-model="langue.niveau"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                        :class="langue.niveau ? 'border-indigo-500' : 'border-gray-300'"
                      >
                        <option value="">Sélectionnez un niveau</option>
                        <option v-for="niveau in niveauxLangue" :key="niveau" :value="niveau">{{ niveau }}</option>
                      </select>
                    </div>
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
                    Ajouter
                  </UButton>
                </div>
                <div class="space-y-2">
                  <div v-for="(cert, index) in cv.certifications" :key="index" class="bg-white rounded-lg p-2 sm:p-2.5 border border-amber-100 hover:border-amber-300 transition-all group">
                    <div class="flex gap-1.5 sm:gap-2 items-end mb-2">
                      <UInput
                        v-model="cert.nom"
                        label="Certification"
                        class="flex-1"
                        placeholder="AWS Certified Solutions Architect"
                        size="sm"
                        icon="i-heroicons-shield-check"
                        :color="cert.nom ? 'primary' : 'gray'"
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
                      v-model="cert.annee"
                      label="Année"
                      placeholder="2024"
                      size="sm"
                      icon="i-heroicons-calendar"
                      :color="cert.annee ? 'primary' : 'gray'"
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

    <!-- Modal des raccourcis clavier -->
    <div v-if="showShortcuts" @click="showShortcuts = false" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div @click.stop class="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <UIcon name="i-heroicons-command-line" class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            Raccourcis clavier
          </h3>
          <button @click="showShortcuts = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div class="space-y-2 sm:space-y-3">
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Annuler</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + Z</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Rétablir</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + Y</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Sauvegarder (JSON)</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + S</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Exporter PDF</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + P</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Zoom +</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + +</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Zoom -</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + -</kbd>
          </div>
          <div class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="text-xs sm:text-sm text-gray-700">Réinitialiser zoom</span>
            <kbd class="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">Ctrl + 0</kbd>
          </div>
        </div>

        <div class="mt-4 sm:mt-6 p-3 sm:p-4 bg-indigo-50 rounded-lg">
          <p class="text-[11px] sm:text-xs text-indigo-800 flex items-start gap-2">
            <UIcon name="i-heroicons-information-circle-solid" class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
            <span>Vos données sont sauvegardées automatiquement toutes les 30 secondes dans votre navigateur.</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Modal des CV sauvegardés -->
    <SavedCVsModal
      :show="showSavedCVsModal"
      :templates="templates"
      @close="showSavedCVsModal = false"
      @load="loadSavedCV"
    />

    <!-- Galerie de templates (modale globale) -->
    <!-- Backdrop pour la galerie -->
    <div v-if="showTemplateGallery" @click="showTemplateGallery = false" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"></div>

    <!-- Galerie de templates équilibrée -->
    <div v-if="showTemplateGallery" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-5 z-[9999] w-[90vw] sm:w-[600px] max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-bold text-gray-900">Choisir un template</h3>
          <p class="text-xs text-gray-500 mt-0.5">6 styles disponibles</p>
        </div>
        <button @click="showTemplateGallery = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          v-for="template in templates"
          :key="template.id"
          @click="selectedTemplate = template; showTemplateGallery = false"
          :class="[
            'group relative p-4 rounded-xl border-2 transition-all',
            selectedTemplate.id === template.id
              ? 'border-indigo-500 bg-indigo-50 shadow-md'
              : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
          ]"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <div :class="`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} shadow-md flex items-center justify-center group-hover:scale-105 transition-transform`">
              <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-white" />
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-900">{{ template.label }}</div>
              <p class="text-[11px] text-gray-500 mt-0.5">{{ template.description }}</p>
            </div>
          </div>
          <!-- Badge sélectionné -->
          <div v-if="selectedTemplate.id === template.id" class="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-check" class="w-3 h-3 text-white" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { COLOR_PRESETS, TABS, TEMPLATES, NIVEAUX_LANGUE } from '~/utils/constants'
import { isValidEmail, isValidUrl, getColorVariant } from '~/utils/validation'
import { parseCompetences } from '~/composables/useCV'
import { formatDate, generateFilename, countWords } from '~/utils/helpers'
import { useToast } from '~/composables/useToast'
import { useSavedCVs } from '~/composables/useSavedCVs'
import SavedCVsModal from '~/components/cv/SavedCVsModal.vue'

const toast = useToast()
const savedCVsManager = useSavedCVs()

const documentTitle = ref('Mon CV')
const lastModified = ref(formatDate())
const activeTab = ref('info')
const mobileView = ref('form') // 'form' ou 'preview'
const zoom = ref(0.5)
const accentColor = ref('#4f46e5')
const fileInput = ref(null)
const autoSaveEnabled = ref(true)
const lastSaved = ref(null)
const showShortcuts = ref(false)
const showTemplateGallery = ref(false)
const showSavedCVsModal = ref(false)
const currentCVId = ref(null)
const history = ref([])
const historyIndex = ref(-1)
const maxHistory = 50

const colorPresets = COLOR_PRESETS
const tabs = TABS
const templates = TEMPLATES
const selectedTemplate = ref(templates[0])
const niveauxLangue = NIVEAUX_LANGUE

const cv = ref({
  photo: '',
  showPhoto: true, // Nouveau champ pour activer/désactiver la photo
  prenom: '',
  nom: '',
  titre: '',
  apropos: '',
  age: '',
  permis: false,
  email: '',
  telephone: '',
  localisation: '',
  linkedin: '',
  website: '',
  github: '',
  experiences: [{ poste: '', entreprise: '', dateDebut: '', dateFin: '', description: '' }],
  formations: [{ diplome: '', ecole: '', ville: '', annee: '', description: '' }],
  competences: '',
  langues: [{ nom: '', niveau: 'Intermédiaire' }],
  certifications: [{ nom: '', annee: '' }]
})

const cvPreview = ref(null)

// Calcul du pourcentage de complétion
const completionPercentage = computed(() => {
  let total = 0
  let filled = 0

  // Champs basiques (40 points)
  if (cv.value.prenom) filled += 5
  if (cv.value.nom) filled += 5
  if (cv.value.titre) filled += 5
  if (cv.value.apropos) filled += 5
  if (cv.value.email) filled += 5
  if (cv.value.telephone) filled += 5
  if (cv.value.localisation) filled += 5
  if (cv.value.photo) filled += 5
  total += 40

  // Expériences (30 points)
  if (cv.value.experiences.some(e => e.poste && e.entreprise)) filled += 30
  total += 30

  // Formations (15 points)
  if (cv.value.formations.some(f => f.diplome && f.ecole)) filled += 15
  total += 15

  // Compétences (10 points)
  if (cv.value.competences) filled += 10
  total += 10

  // Langues (5 points)
  if (cv.value.langues.some(l => l.nom)) filled += 5
  total += 5

  return Math.round((filled / total) * 100)
})

// Statistiques du CV
const cvStats = computed(() => {
  const stats = {
    wordCount: 0,
    experienceYears: 0,
    educationCount: cv.value.formations.filter(f => f.diplome).length,
    skillCount: competencesArray.value.length,
    languageCount: cv.value.langues.filter(l => l.nom).length,
    certificationCount: cv.value.certifications?.filter(c => c.nom).length || 0
  }

  // Compter les mots de manière optimisée
  const text = [
    cv.value.apropos || '',
    ...cv.value.experiences.map(e => e.description || ''),
    ...cv.value.formations.map(f => f.description || '')
  ].join(' ')
  stats.wordCount = countWords(text)

  // Calculer les années d'expérience (approximation)
  stats.experienceYears = cv.value.experiences.filter(e => e.poste).length * 2.5

  return stats
})

const cvInsight = computed(() => {
  const completion = completionPercentage.value
  if (completion === 100) return { text: 'CV complet ! Prêt à impressionner les recruteurs', color: 'text-green-600', icon: '🎉' }
  if (completion >= 80) return { text: 'Presque parfait ! Quelques détails à ajouter', color: 'text-blue-600', icon: '⭐' }
  if (completion >= 60) return { text: 'Bon début ! Continuez à remplir les sections', color: 'text-indigo-600', icon: '💪' }
  if (completion >= 40) return { text: 'En cours... Ajoutez plus d\'informations', color: 'text-yellow-600', icon: '📝' }
  return { text: 'Démarrez votre CV en ajoutant vos informations', color: 'text-gray-600', icon: '🚀' }
})

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

const competencesArray = computed(() => parseCompetences(cv.value.competences))

// Gestion des expériences
const ajouterExperience = () => {
  cv.value.experiences.push({ poste: '', entreprise: '', dateDebut: '', dateFin: '', description: '' })
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
  toast.success('Expérience dupliquée')
}

// Gestion des formations
const ajouterFormation = () => {
  cv.value.formations.push({ diplome: '', ecole: '', ville: '', annee: '', description: '' })
}

const supprimerFormation = (index) => {
  cv.value.formations.splice(index, 1)
}

const moveFormation = (index, direction) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < cv.value.formations.length) {
    const temp = cv.value.formations[index]
    cv.value.formations[index] = cv.value.formations[newIndex]
    cv.value.formations[newIndex] = temp
  }
}

const dupliquerFormation = (index) => {
  const formation = { ...cv.value.formations[index] }
  cv.value.formations.splice(index + 1, 0, formation)
  toast.success('Formation dupliquée')
}

// Gestion des langues
const ajouterLangue = () => {
  cv.value.langues.push({ nom: '', niveau: 'Intermédiaire' })
}

const supprimerLangue = (index) => {
  cv.value.langues.splice(index, 1)
}

// Gestion des certifications
const ajouterCertification = () => {
  cv.value.certifications.push({ nom: '', annee: '' })
}

const supprimerCertification = (index) => {
  cv.value.certifications.splice(index, 1)
}

// Note: isValidEmail and isValidUrl are now imported from ~/utils/validation

// Gestion des compétences
const removeSkill = (skillToRemove) => {
  const skills = competencesArray.value.filter(skill => skill !== skillToRemove)
  cv.value.competences = skills.join(', ')
}

// Zoom
const zoomIn = () => {
  if (zoom.value < 1.5) zoom.value += 0.1
}

const zoomOut = () => {
  if (zoom.value > 0.3) zoom.value -= 0.1
}

// Charger des données d'exemple
const loadExampleData = () => {
  if (confirm('Charger un CV d\'exemple ? Vos données actuelles seront remplacées.')) {
    toast.info('Chargement des données d\'exemple...')
    cv.value = {
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      showPhoto: true,
      prenom: 'Alexandre',
      nom: 'Martin',
      titre: 'Développeur Full Stack Senior',
      apropos: 'Passionné par le développement web moderne avec plus de 8 ans d\'expérience. Spécialisé dans les architectures cloud-native et les applications performantes. Expert en Vue.js, React et Node.js avec une forte appétence pour l\'innovation et les nouvelles technologies.',
      age: '32',
      permis: true,
      email: 'alexandre.martin@email.com',
      telephone: '+33 6 12 34 56 78',
      localisation: 'Paris, France',
      linkedin: 'linkedin.com/in/alexandre-martin',
      website: 'alexandre-martin.dev',
      github: 'github.com/amartin',
      experiences: [
        {
          poste: 'Lead Developer',
          entreprise: 'TechCorp',
          dateDebut: 'Jan 2021',
          dateFin: 'Présent',
          description: '• Direction technique d\'une équipe de 6 développeurs\n• Refonte complète de l\'architecture microservices (Node.js, Docker, Kubernetes)\n• Amélioration des performances de 60% et réduction des coûts cloud de 40%\n• Mise en place de CI/CD et bonnes pratiques DevOps'
        },
        {
          poste: 'Développeur Full Stack',
          entreprise: 'StartupTech',
          dateDebut: 'Mar 2018',
          dateFin: 'Déc 2020',
          description: '• Développement de features complexes en Vue.js et Node.js\n• Création d\'une API REST utilisée par plus de 100k utilisateurs\n• Intégration de solutions de paiement (Stripe, PayPal)\n• Optimisation SEO et amélioration de l\'accessibilité'
        },
        {
          poste: 'Développeur Web Junior',
          entreprise: 'WebAgency',
          dateDebut: 'Sep 2016',
          dateFin: 'Fév 2018',
          description: '• Développement de sites web responsive avec React et WordPress\n• Collaboration avec les équipes design pour l\'intégration pixel-perfect\n• Maintenance et évolution de projets clients existants'
        }
      ],
      formations: [
        {
          diplome: 'Master Informatique - Génie Logiciel',
          ecole: 'Université Paris-Saclay',
          ville: 'Paris',
          annee: '2014 - 2016',
          description: 'Spécialisation en architectures logicielles et développement web. Mention Très Bien.'
        },
        {
          diplome: 'Licence Informatique',
          ecole: 'Université Pierre et Marie Curie',
          ville: 'Paris',
          annee: '2011 - 2014',
          description: 'Formation généraliste en informatique avec focus sur la programmation orientée objet.'
        }
      ],
      competences: 'JavaScript, TypeScript, Vue.js, React, Node.js, Express, NestJS, MongoDB, PostgreSQL, Redis, Docker, Kubernetes, AWS, CI/CD, Git, Agile, TDD',
      langues: [
        { nom: 'Français', niveau: 'Natif' },
        { nom: 'Anglais', niveau: 'Courant (C1)' },
        { nom: 'Espagnol', niveau: 'Intermédiaire (B1)' }
      ],
      certifications: [
        { nom: 'AWS Certified Solutions Architect', annee: '2023' },
        { nom: 'Google Cloud Professional Developer', annee: '2022' },
        { nom: 'MongoDB Certified Developer', annee: '2021' }
      ]
    }
    documentTitle.value = 'CV - Alexandre Martin'
    accentColor.value = '#7c3aed'
    toast.success('✨ Données d\'exemple chargées avec succès!')
  }
}

// Créer un nouveau CV vide
const createNewCV = () => {
  if (confirm('Voulez-vous créer un nouveau CV vide ?\n\nLes données actuelles non sauvegardées seront perdues.')) {
    cv.value = {
      photo: '',
      showPhoto: true,
      prenom: '',
      nom: '',
      titre: '',
      apropos: '',
      email: '',
      telephone: '',
      localisation: '',
      linkedin: '',
      website: '',
      github: '',
      experiences: [{ poste: '', entreprise: '', dateDebut: '', dateFin: '', description: '' }],
      formations: [{ diplome: '', ecole: '', ville: '', annee: '', description: '' }],
      competences: '',
      langues: [{ nom: '', niveau: 'Intermédiaire' }],
      certifications: [{ nom: '', annee: '' }]
    }
    accentColor.value = '#4f46e5'
    documentTitle.value = 'Nouveau CV'
    currentCVId.value = null // Important : réinitialiser l'ID pour créer un nouveau CV
    toast.success('✨ Nouveau CV créé')
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
      alert('CV importé avec succès !')
    } catch (error) {
      console.error('Erreur lors de l\'import:', error)
      alert('Erreur lors de l\'import du fichier. Assurez-vous qu\'il s\'agit d\'un fichier JSON valide.')
    }
  }
  reader.readAsText(file)

  // Reset input
  event.target.value = ''
}

// Sauvegarder comme nouveau CV
const saveAsNewCV = () => {
  const defaultName = documentTitle.value || `CV - ${cv.value.prenom || ''} ${cv.value.nom || ''}`.trim()
  const name = prompt('Donnez un nom à ce nouveau CV:', defaultName)

  if (!name) {
    toast.error('Sauvegarde annulée')
    return
  }

  try {
    const savedCV = savedCVsManager.saveCV(name, cv.value, accentColor.value, selectedTemplate.value.id)
    currentCVId.value = savedCV.id
    documentTitle.value = name
    toast.success(`✅ Nouveau CV "${name}" créé avec succès!`)
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    toast.error('❌ Erreur lors de la sauvegarde du CV')
  }
}

// Sauvegarder le CV actuel (crée ou met à jour)
const saveCurrentCV = () => {
  if (currentCVId.value) {
    // Un CV est déjà chargé, demander si on veut le mettre à jour ou en créer un nouveau
    const action = confirm('Ce CV est déjà sauvegardé.\n\nOK = Mettre à jour le CV existant\nAnnuler = Créer une copie (nouveau CV)')

    if (action) {
      // Mettre à jour le CV existant
      const name = documentTitle.value || `CV - ${cv.value.prenom || ''} ${cv.value.nom || ''}`.trim()
      try {
        const success = savedCVsManager.updateCV(currentCVId.value, name, cv.value, accentColor.value, selectedTemplate.value.id)
        if (success) {
          toast.success(`✅ CV "${name}" mis à jour avec succès!`)
        } else {
          throw new Error('Échec de la mise à jour')
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error)
        toast.error('❌ Erreur lors de la mise à jour du CV')
      }
    } else {
      // Créer une copie (nouveau CV)
      saveAsNewCV()
    }
  } else {
    // Pas de CV chargé, créer un nouveau
    saveAsNewCV()
  }
}

// Charger un CV sauvegardé
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
    toast.success(`📂 CV "${savedCV.name}" chargé avec succès!`)
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    toast.error('❌ Erreur lors du chargement du CV')
  }
}

// Téléchargement JSON
const saveJSON = () => {
  toast.info('Génération du fichier JSON...')
  const dataStr = JSON.stringify(cv.value, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
  const exportFileDefaultName = `${documentTitle.value || 'cv'}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
  toast.success(`💾 Fichier JSON téléchargé: ${exportFileDefaultName}`)
}

// Export PDF
const exporterPDF = async () => {
  if (!cvPreview.value) return

  try {
    toast.info('📄 Génération du PDF en cours...')
    const currentZoom = zoom.value
    zoom.value = 1

    // Wait for zoom transition to complete
    await new Promise(resolve => setTimeout(resolve, 150))

    const canvas = await html2canvas(cvPreview.value, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: cvPreview.value.offsetWidth,
      height: cvPreview.value.offsetHeight,
      // Optimize performance by reducing unnecessary reflows
      windowWidth: cvPreview.value.offsetWidth,
      windowHeight: cvPreview.value.offsetHeight,
      onclone: (clonedDoc) => {
        const clonedPreview = clonedDoc.querySelector('[data-cv-preview]')
        if (clonedPreview) {
          // Apply CSS variables to the clone
          clonedPreview.style.setProperty('--accent-color', accentColor.value)
          clonedPreview.style.setProperty('--accent-color-dark', accentColorDark.value)
          clonedPreview.style.setProperty('--accent-color-light', accentColorLight.value)
        }
      }
    })

    // Use JPEG with quality setting for better performance (smaller file size)
    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    })

    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297)

    // Generate filename
    const filename = generateFilename(documentTitle.value, cv.value.prenom, cv.value.nom, 'pdf')
    pdf.save(filename)

    zoom.value = currentZoom
    toast.success(`🎉 PDF exporté avec succès: ${filename}`)
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error)
    toast.error('❌ Erreur lors de l\'export PDF. Veuillez réessayer.')
  }
}

// Export en PNG
const exporterPNG = async () => {
  if (!cvPreview.value) return

  try {
    toast.info('🖼️ Génération de l\'image en cours...')
    const currentZoom = zoom.value
    zoom.value = 1

    await new Promise(resolve => setTimeout(resolve, 150))

    const canvas = await html2canvas(cvPreview.value, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: cvPreview.value.offsetWidth,
      height: cvPreview.value.offsetHeight,
      windowWidth: cvPreview.value.offsetWidth,
      windowHeight: cvPreview.value.offsetHeight,
      onclone: (clonedDoc) => {
        const clonedPreview = clonedDoc.querySelector('[data-cv-preview]')
        if (clonedPreview) {
          clonedPreview.style.setProperty('--accent-color', accentColor.value)
          clonedPreview.style.setProperty('--accent-color-dark', accentColorDark.value)
          clonedPreview.style.setProperty('--accent-color-light', accentColorLight.value)
        }
      }
    })

    canvas.toBlob((blob) => {
      const filename = generateFilename(documentTitle.value, cv.value.prenom, cv.value.nom, 'png')
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)

      zoom.value = currentZoom
      toast.success(`🎉 Image exportée avec succès: ${filename}`)
    }, 'image/png', 1.0)
  } catch (error) {
    console.error('Erreur lors de l\'export PNG:', error)
    toast.error('❌ Erreur lors de l\'export PNG. Veuillez réessayer.')
  }
}

// Mettre à jour la date de modification
watch(cv, () => {
  lastModified.value = formatDate()
}, { deep: true })

// Sauvegarde automatique dans localStorage
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
    lastSaved.value = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
}

// Charger depuis localStorage
const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('cv-builder-data')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      cv.value = data.cv
      documentTitle.value = data.documentTitle || 'Mon CV'
      accentColor.value = data.accentColor || '#4f46e5'
      selectedTemplate.value = data.selectedTemplate || templates[0]
      zoom.value = data.zoom || 0.5
      lastSaved.value = 'Données restaurées'
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    }
  }
}

// Système d'historique
const saveToHistory = () => {
  const snapshot = JSON.stringify(cv.value)

  // Si on est pas à la fin de l'historique, supprimer tout ce qui suit
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }

  // Ajouter le nouveau snapshot
  history.value.push(snapshot)
  historyIndex.value++

  // Limiter la taille de l'historique
  if (history.value.length > maxHistory) {
    history.value.shift()
    historyIndex.value--
  }
}

const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    cv.value = JSON.parse(history.value[historyIndex.value])
  }
}

const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    cv.value = JSON.parse(history.value[historyIndex.value])
  }
}

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

// Raccourcis clavier
const handleKeyboardShortcuts = (e) => {
  // Ctrl/Cmd + Z : Undo
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault()
    undo()
  }
  // Ctrl/Cmd + Shift + Z ou Ctrl/Cmd + Y : Redo
  if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
    e.preventDefault()
    redo()
  }
  // Ctrl/Cmd + S : Sauvegarder JSON
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    saveJSON()
  }
  // Ctrl/Cmd + P : Exporter PDF
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
  // Initialiser l'historique
  saveToHistory()

  window.addEventListener('keydown', handleKeyboardShortcuts)

  // Auto-save toutes les 30 secondes
  const autoSaveInterval = setInterval(() => {
    saveToLocalStorage()
  }, 30000)

  // Cleanup
  onBeforeUnmount(() => {
    clearInterval(autoSaveInterval)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardShortcuts)
  saveToLocalStorage() // Sauvegarder avant de quitter
})

// Watch pour auto-save et historique
let saveTimeout = null
let autoSaveTimeout = null
watch([cv], () => {
  // Sauvegarder dans l'historique avec debounce
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveToHistory()
  }, 1000)

  // Auto-save avec debounce approprié
  if (autoSaveEnabled.value) {
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout)
    autoSaveTimeout = setTimeout(() => {
      saveToLocalStorage()
    }, 2000)
  }
}, { deep: true })

let settingsTimeout = null
watch([documentTitle, accentColor, selectedTemplate], () => {
  if (autoSaveEnabled.value) {
    if (settingsTimeout) clearTimeout(settingsTimeout)
    settingsTimeout = setTimeout(() => {
      saveToLocalStorage()
    }, 2000)
  }
})
</script>
