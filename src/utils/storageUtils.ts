
/**
 * Utility functions for managing localStorage to avoid quota issues
 */

import { Project } from '@/components/ProjectCard';

// Maximum allowed image size in localStorage (in bytes)
const MAX_IMAGE_SIZE = 500 * 1024; // 500KB

/**
 * Saves projects to localStorage with image size optimization
 */
export const saveProjectsToStorage = (projects: Project[]): void => {
  try {
    // Create a copy of projects with optimized images
    const optimizedProjects = projects.map(project => {
      const optimizedProject = { ...project };
      
      // Handle image data optimization
      if (project.imageData) {
        // If imageData is larger than MAX_IMAGE_SIZE, don't store it in localStorage
        // We'll rely on the imageUrl instead
        if (project.imageData.length > MAX_IMAGE_SIZE) {
          delete optimizedProject.imageData;
          console.log(`Image data for project "${project.title}" exceeds size limit and won't be stored in localStorage`);
        }
      }
      
      return optimizedProject;
    });
    
    localStorage.setItem('portfolioProjects', JSON.stringify(optimizedProjects));
    console.log(`Successfully saved ${projects.length} projects to localStorage`);
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
    
    // If we hit quota error, try to save without any image data
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      try {
        const strippedProjects = projects.map(project => {
          const stripped = { ...project };
          delete stripped.imageData;
          return stripped;
        });
        
        localStorage.setItem('portfolioProjects', JSON.stringify(strippedProjects));
        console.log('Saved projects without image data due to quota limitations');
      } catch (fallbackError) {
        console.error('Failed to save even with stripped images:', fallbackError);
      }
    }
  }
};

/**
 * Loads projects from localStorage
 */
export const loadProjectsFromStorage = (initialProjects: Project[]): Project[] => {
  try {
    const savedProjects = localStorage.getItem('portfolioProjects');
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
