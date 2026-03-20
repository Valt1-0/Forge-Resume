import type { CV } from './useCV'

export interface SavedCV {
  id: string
  name: string
  cv: CV
  accentColor: string
  templateId: string
  createdAt: string
  updatedAt: string
}

export const useSavedCVs = () => {
  const STORAGE_KEY = 'cv-builder-saved-cvs'

  const getAllCVs = (): SavedCV[] => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    try {
      return JSON.parse(saved)
    } catch (error) {
      console.error('Error loading saved CVs:', error)
      return []
    }
  }

  const saveCV = (name: string, cv: CV, accentColor: string, templateId: string): SavedCV => {
    const cvs = getAllCVs()
    const now = new Date().toISOString()

    const newCV: SavedCV = {
      id: Date.now().toString(),
      name,
      cv: JSON.parse(JSON.stringify(cv)), // Deep clone
      accentColor,
      templateId,
      createdAt: now,
      updatedAt: now
    }

    cvs.push(newCV)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs))
    return newCV
  }

  const updateCV = (id: string, name: string, cv: CV, accentColor: string, templateId: string): boolean => {
    const cvs = getAllCVs()
    const index = cvs.findIndex(item => item.id === id)

    if (index === -1) return false

    cvs[index] = {
      ...cvs[index],
      name,
      cv: JSON.parse(JSON.stringify(cv)),
      accentColor,
      templateId,
      updatedAt: new Date().toISOString()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs))
    return true
  }

  const deleteCV = (id: string): boolean => {
    const cvs = getAllCVs()
    const filtered = cvs.filter(item => item.id !== id)

    if (filtered.length === cvs.length) return false

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  }

  const getCV = (id: string): SavedCV | null => {
    const cvs = getAllCVs()
    return cvs.find(item => item.id === id) || null
  }

  const duplicateCV = (id: string): SavedCV | null => {
    const original = getCV(id)
    if (!original) return null

    const cvs = getAllCVs()
    const now = new Date().toISOString()

    const duplicated: SavedCV = {
      id: Date.now().toString(),
      name: `${original.name} (copy)`,
      cv: JSON.parse(JSON.stringify(original.cv)),
      accentColor: original.accentColor,
      templateId: original.templateId,
      createdAt: now,
      updatedAt: now
    }

    cvs.push(duplicated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs))
    return duplicated
  }

  return {
    getAllCVs,
    saveCV,
    updateCV,
    deleteCV,
    getCV,
    duplicateCV
  }
}
