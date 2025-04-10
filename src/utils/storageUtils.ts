/**
 * Utility functions for managing localStorage and IndexedDB to avoid quota issues
 */

import { Project } from '@/types/project';

// Maximum allowed image size in localStorage (in bytes) - reduced further to prevent quota issues
const MAX_IMAGE_SIZE = 20 * 1024; // Reduced to 20KB for better storage management
const STORAGE_KEY = 'portfolioProjects';
const INDEXED_DB_NAME = 'projectImagesDB';
const INDEXED_DB_STORE = 'projectImages';
const INDEXED_DB_VERSION = 1;

// Function to compress image data (base64 string) with more aggressive compression
const compressImageData = async (imageData: string): Promise<string> => {
  // Simple compression by reducing quality
  if (imageData.startsWith('data:image')) {
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');
    
    // Set up image loading
    return new Promise<string>((resolve) => {
      img.onload = () => {
        // Scale down if image is large
        const MAX_WIDTH = 500; // Further reduced maximum width
        const MAX_HEIGHT = 350; // Further reduced maximum height
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
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed data URL with reduced quality (0.5 instead of 0.6)
          const compressedData = canvas.toDataURL('image/jpeg', 0.5);
          resolve(compressedData);
        } else {
          resolve(imageData); // Fallback if context not available
        }
      };
      
      img.onerror = () => {
        console.error('Error loading image for compression');
        resolve(imageData);
      };
      
      img.src = imageData;
    });
  }
  
  return Promise.resolve(imageData);
};

/**
 * Checks if IndexedDB is available
 */
const isIndexedDBAvailable = (): boolean => {
  return !!window.indexedDB;
};

/**
 * Opens IndexedDB connection for storing project images
 */
const openImageDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    
    const request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);
    
    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(INDEXED_DB_STORE)) {
        db.createObjectStore(INDEXED_DB_STORE, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Stores image data in IndexedDB with improved error handling
 */
const storeImageInIndexedDB = async (projectId: string, imageData: string): Promise<boolean> => {
  try {
    // Always try to compress the image first
    const compressedImage = await compressImageData(imageData);
    
    // If IndexedDB is not available, return false to indicate failure
    if (!isIndexedDBAvailable()) {
      console.error('IndexedDB not available for image storage');
      return false;
    }
    
    const db = await openImageDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction([INDEXED_DB_STORE], 'readwrite');
      const store = transaction.objectStore(INDEXED_DB_STORE);
      
      const request = store.put({ id: projectId, imageData: compressedImage });
      
      request.onsuccess = () => {
        console.log(`Successfully stored image for project ${projectId} in IndexedDB`);
        resolve(true);
      };
      
      request.onerror = () => {
        console.error(`Failed to store image for project ${projectId} in IndexedDB`);
        resolve(false);
      };
      
      // Ensure we close the database when transaction completes
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error storing image in IndexedDB:', error);
    return false;
  }
};

/**
 * Retrieves image data from IndexedDB with improved error handling
 */
export const getImageFromIndexedDB = async (projectId: string): Promise<string | null> => {
  try {
    // If IndexedDB is not available, return null
    if (!isIndexedDBAvailable()) {
      console.error('IndexedDB not available for image retrieval');
      return null;
    }
    
    const db = await openImageDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction([INDEXED_DB_STORE], 'readonly');
      const store = transaction.objectStore(INDEXED_DB_STORE);
      
      const request = store.get(projectId);
      
      request.onsuccess = () => {
        if (request.result) {
          console.log(`Successfully retrieved image for project ${projectId} from IndexedDB`);
          resolve(request.result.imageData);
        } else {
          console.log(`No image found for project ${projectId} in IndexedDB`);
          resolve(null);
        }
      };
      
      request.onerror = () => {
        console.error(`Failed to retrieve image for project ${projectId} from IndexedDB`);
        resolve(null);
      };
      
      // Ensure we close the database when transaction completes
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error retrieving image from IndexedDB:', error);
    return null;
  }
};

/**
 * Saves projects to localStorage with advanced image size optimization
 * and IndexedDB fallback for all images
 */
export const saveProjectsToStorage = async (projects: Project[]): Promise<void> => {
  try {
    // Create a copy of projects with optimized images
    const optimizedProjects: Project[] = [];
    
    for (const project of projects) {
      const optimizedProject = { ...project };
      
      // Always store all images in IndexedDB to prevent localStorage quota issues
      if (project.imageData) {
        try {
          const success = await storeImageInIndexedDB(project.id, project.imageData);
          
          if (success) {
            // Set a flag to indicate image is stored in IndexedDB
            optimizedProject.imageStoredExternally = true;
            
            // Remove image data from the object going to localStorage
            delete optimizedProject.imageData;
          } else {
            // If IndexedDB storage fails, try to store a highly compressed version
            const compressedImage = await compressImageData(project.imageData);
            if (compressedImage.length <= MAX_IMAGE_SIZE) {
              optimizedProject.imageData = compressedImage;
            } else {
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
    
    // Save projects in localStorage without any images if possible
    try {
      const strippedProjects = optimizedProjects.map(project => {
        const stripped = { ...project };
        delete stripped.imageData; // Always remove imageData from localStorage
        return stripped;
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(strippedProjects));
      console.log(`Successfully saved ${projects.length} projects to localStorage (images in IndexedDB)`);
    } catch (storageError) {
      console.error('Error in primary storage method:', storageError);
      
      // If we hit quota error, try to save minimal project data
      if (storageError instanceof DOMException && storageError.name === 'QuotaExceededError') {
        console.log('Quota exceeded, trying alternative storage method...');
        
        // Last resort: Save just the essential project data
        const minimalProjects = projects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          tags: project.tags,
          category: project.category,
          imageStoredExternally: true // Indicate images should be loaded from IndexedDB
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
  } catch (error) {
    console.error('Error in saveProjectsToStorage:', error);
    throw error;
  }
};

/**
 * Loads projects from localStorage and restores images from IndexedDB 
 * with improved reliability
 */
export const loadProjectsFromStorage = async (initialProjects: Project[]): Promise<Project[]> => {
  try {
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
        console.log(`Loading ${parsedProjects.length} projects from storage`);
        
        // Check for any projects with images stored in IndexedDB
        const restoredProjects = await Promise.all(
          parsedProjects.map(async (project) => {
            // If project has a flag indicating the image is stored externally or has no imageData
            // Try to get the image from IndexedDB
            if (project.imageStoredExternally || !project.imageData) {
              try {
                const imageData = await getImageFromIndexedDB(project.id);
                if (imageData) {
                  return {
                    ...project,
                    imageData,
                    imageStoredExternally: false // Clear the flag
                  };
                }
              } catch (error) {
                console.error(`Failed to restore image for project ${project.id}:`, error);
              }
            }
            return project;
          })
        );
        
        console.log(`Successfully restored ${restoredProjects.length} projects`);
        return restoredProjects;
      }
    }
    console.log(`No saved projects found, using ${initialProjects.length} initial projects`);
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
      if (key && key !== STORAGE_KEY && key !== 'portfolioUser' && key !== 'portfolioBackground' && !key.includes('essential')) {
        localStorage.removeItem(key);
      }
    }
    console.log('Cleared non-essential storage to make room');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
