/**
 * Utility functions for standardizing image URLs
 */

/**
 * Standardizes GitHub image URLs to ensure they always use raw.githubusercontent.com
 * This solves the issue of inconsistent image display when copying/pasting links
 */
export const standardizeGithubImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return url;
  
  // Convert github.com URLs to raw.githubusercontent.com format
  if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
    return url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }
  
  return url;
};

/**
 * Checks if a URL is a valid image URL
 */
export const isValidImageUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  
  // Check if URL has an image extension or is from a known image hosting service
  const imageExtensionRegex = /\.(jpeg|jpg|gif|png|bmp|webp|svg)$/i;
  const knownImageHostsRegex = /raw\.githubusercontent\.com|i\.imgur\.com/i; // Removed Unsplash reference
  
  return imageExtensionRegex.test(url) || knownImageHostsRegex.test(url);
};

/**
 * Extracts image format (extension) from a URL
 */
export const getImageFormatFromUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  
  const match = url.match(/\.([a-z]{3,4})(?:\?.*)?$/i);
  return match ? match[1].toLowerCase() : null;
};

/**
 * Validate website URL to ensure it's properly formatted
 */
export const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};
