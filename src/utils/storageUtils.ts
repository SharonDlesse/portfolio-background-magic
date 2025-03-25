
/**
 * Utility functions for managing localStorage to avoid quota issues
 */

import { Project } from '@/components/ProjectCard';

// Maximum allowed image size in localStorage (in bytes)
const MAX_IMAGE_SIZE = 100 * 1024; // Reduced to 100KB for better storage management
const STORAGE_KEY = 'portfolioProjects';

// Function to compress image data (base64 string)
const compressImageData = (imageData: string): string => {
  // Simple compression by reducing quality
  // This is a basic implementation - for production, you might want to use a proper image compression library
  if (imageData.startsWith('data:image')) {
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');
    
    // Set up image loading
    return new Promise<string>((resolve) => {
      img.onload = () => {
        // Scale down if image is large
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height = Math.round(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        }
        
        if (height > MAX_HEIGHT) {
          width = Math.round(width * (MAX_HEIGHT / height));
          height = MAX_HEIGHT;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image at reduced size
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Get compressed data URL with reduced quality
        const compressedData = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedData);
      };
      
      img.src = imageData;
    });
  }
  
  return imageData;
};

/**
 * Saves projects to localStorage with advanced image size optimization
 */
export const saveProjectsToStorage = async (projects: Project[]): Promise<void> => {
  try {
    // Create a copy of projects with optimized images
    const optimizedProjects: Project[] = [];
    
    for (const project of projects) {
      const optimizedProject = { ...project };
      
      // Handle image data optimization
      if (project.imageData) {
        try {
          // If the image is too large, try to compress it first
          if (project.imageData.length > MAX_IMAGE_SIZE) {
            try {
              // Only compress if it's an image
              if (project.imageData.startsWith('data:image')) {
                optimizedProject.imageData = await compressImageData(project.imageData);
              }
              
              // If still too large after compression, don't store it
              if ((optimizedProject.imageData?.length || 0) > MAX_IMAGE_SIZE) {
                delete optimizedProject.imageData;
                console.log(`Image for "${project.title}" is too large even after compression`);
              }
            } catch (compressionError) {
              console.error('Error compressing image:', compressionError);
              delete optimizedProject.imageData;
            }
          }
        } catch (error) {
          console.error('Error processing image data:', error);
          delete optimizedProject.imageData;
        }
      }
      
      optimizedProjects.push(optimizedProject);
    }
    
    // Save projects in batches if necessary
    try {
      const projectsJSON = JSON.stringify(optimizedProjects);
      localStorage.setItem(STORAGE_KEY, projectsJSON);
      console.log(`Successfully saved ${projects.length} projects to localStorage`);
    } catch (storageError) {
      console.error('Error in primary storage method:', storageError);
      
      // If we hit quota error, try to save without any image data
      if (storageError instanceof DOMException && storageError.name === 'QuotaExceededError') {
        console.log('Quota exceeded, trying alternative storage method...');
        const strippedProjects = optimizedProjects.map(project => {
          const stripped = { ...project };
          delete stripped.imageData;
          return stripped;
        });
        
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(strippedProjects));
          console.log('Saved projects without image data due to quota limitations');
        } catch (fallbackError) {
          console.error('Failed to save even with stripped images:', fallbackError);
          
          // Last resort: Try to save just the essential project data
          const minimalProjects = projects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            tags: project.tags,
            category: project.category,
          }));
          
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalProjects));
            console.log('Saved minimal project data as last resort');
          } catch (lastResortError) {
            console.error('All storage attempts failed:', lastResortError);
            throw new Error('Unable to save project data due to storage limitations');
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in saveProjectsToStorage:', error);
    throw error;
  }
};

/**
 * Loads projects from localStorage
 */
export const loadProjectsFromStorage = (initialProjects: Project[]): Project[] => {
  try {
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
        return parsedProjects;
      }
    }
    return initialProjects;
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
    return initialProjects;
  }
};

/**
 * Clears storage to make room
 */
export const clearOtherStorage = (): void => {
  try {
    // Clear any non-essential storage items to make room
    // Be careful to not remove important items!
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== STORAGE_KEY && !key.includes('essential')) {
        localStorage.removeItem(key);
      }
    }
    console.log('Cleared non-essential storage to make room');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
