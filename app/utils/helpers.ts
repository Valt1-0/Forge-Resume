/**
 * Utility functions for CV builder
 */

/**
 * Debounce function to limit the rate at which a function is executed
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Format a date for display
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Generate a filename for CV export
 * @param documentTitle - Document title
 * @param firstName - First name
 * @param lastName - Last name
 * @param extension - File extension
 * @returns Generated filename
 */
export const generateFilename = (
  documentTitle: string,
  firstName?: string,
  lastName?: string,
  extension: string = 'pdf'
): string => {
  const parts = [documentTitle || 'CV']

  if (firstName) parts.push(firstName)
  if (lastName) parts.push(lastName)

  return `${parts.join('-')}.${extension}`
}

/**
 * Count words in text
 * @param text - Text to count words in
 * @returns Number of words
 */
export const countWords = (text: string): number => {
  if (!text) return 0
  return text.split(/\s+/).filter(w => w.length > 0).length
}

/**
 * Sanitize a string for use as a filename
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeFilename = (str: string): string => {
  return str
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}
