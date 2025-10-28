/**
 * Convert yacht name to URL-friendly slug
 * Example: "Azure Explorer" -> "azure-explorer"
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
}

/**
 * Convert slug back to searchable format
 * Example: "azure-explorer" -> "azure explorer"
 */
export function slugToName(slug: string): string {
  return slug.replace(/-/g, ' ')
}

/**
 * Check if a yacht name matches a slug
 */
export function matchesSlug(yachtName: string, slug: string): boolean {
  return createSlug(yachtName) === slug.toLowerCase()
}

