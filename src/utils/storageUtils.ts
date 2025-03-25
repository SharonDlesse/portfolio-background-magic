
/**
 * Utility functions for managing localStorage and IndexedDB to avoid quota issues
 */

import { Project } from '@/components/ProjectCard';

// Maximum allowed image size in localStorage (in bytes)
const MAX_IMAGE_SIZE = 50 * 1024; // Reduced to 50KB for better storage management
const STORAGE_KEY = 'portfolioProjects';
const INDEXED_DB_NAME = 'projectImagesDB';
const INDEXED_DB_STORE = 'projectImages';
const INDEXED_DB_VERSION = 1;

// Function to compress image data (base64 string)
const compressImageData = async (imageData: string): Promise<string> => {
  // Simple compression by reducing quality
  if (imageData.startsWith('data:image')) {
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');
    
    // Set up image loading
    return new Promise<string>((resolve) => {
      img.onload = () => {
        // Scale down if image is large
        const MAX_WIDTH = 600; // Reduced maximum width
        const MAX_HEIGHT = 400; // Reduced maximum height
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
          
          // Get compressed data URL with reduced quality (0.6 instead of 0.7)
          const compressedData = canvas.toDataURL('image/jpeg', 0.6);
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
 * Opens IndexedDB connection for storing project images
 */
const openImageDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    
    const request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);
    
    request.onerror = (event) => {
      reject(new Error('Failed to open IndexedDB'));
    };
    
    request.onsuccess = (event) => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(INDEXED_DB_STORE)) {
        db.createObjectStore(INDEXED_DB_STORE, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Stores image data in IndexedDB
 */
const storeImageInIndexedDB = async (projectId: string, imageData: string): Promise<void> => {
  try {
    const db = await openImageDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([INDEXED_DB_STORE], 'readwrite');
      const store = transaction.objectStore(INDEXED_DB_STORE);
      
      const request = store.put({ id: projectId, imageData });
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to store image in IndexedDB'));
      };
    });
  } catch (error) {
    console.error('Error storing image in IndexedDB:', error);
    throw error;
  }
};

/**
 * Retrieves image data from IndexedDB
 */
const getImageFromIndexedDB = async (projectId: string): Promise<string | null> => {
  try {
    const db = await openImageDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([INDEXED_DB_STORE], 'readonly');
      const store = transaction.objectStore(INDEXED_DB_STORE);
      
      const request = store.get(projectId);
      
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.imageData);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => {
        reject(new Error('Failed to retrieve image from IndexedDB'));
      };
    });
  } catch (error) {
    console.error('Error retrieving image from IndexedDB:', error);
    return null;
  }
};

/**
 * Stores an image permanently in localStorage for a specific project
 */
const storePermanentImage = (projectId: string, imageData: string): void => {
  try {
    // Create a permanent storage key
    const storageKey = `project_image_${projectId}`;
    
    // Store compressed version in localStorage
    compressImageData(imageData).then(compressedImage => {
      localStorage.setItem(storageKey, compressedImage);
      console.log(`Permanently stored image for project ${projectId}`);
    });
  } catch (error) {
    console.error('Error storing permanent image:', error);
  }
};

/**
 * Saves projects to localStorage with advanced image size optimization
 * and IndexedDB fallback for larger images
 */
export const saveProjectsToStorage = async (projects: Project[]): Promise<void> => {
  try {
    // Create a copy of projects with optimized images
    const optimizedProjects: Project[] = [];
    
    for (const project of projects) {
      const optimizedProject = { ...project };
      
      // Ensure persistentImageKey exists
      if (project.imageData && !optimizedProject.persistentImageKey) {
        optimizedProject.persistentImageKey = project.id;
        
        // Store the image permanently
        storePermanentImage(project.id, project.imageData);
      }
      
      // Handle image data optimization
      if (project.imageData) {
        try {
          // First try to compress the image
          const compressedImage = await compressImageData(project.imageData);
          
          // If image is too large even after compression, store in IndexedDB
          if (compressedImage.length > MAX_IMAGE_SIZE) {
            try {
              // Store original image in IndexedDB
              await storeImageInIndexedDB(project.id, project.imageData);
              
              // Set a flag to indicate image is stored in IndexedDB
              optimizedProject.imageStoredExternally = true;
              
              // Remove image data from the object going to localStorage
              delete optimizedProject.imageData;
            } catch (indexedDBError) {
              console.error('Error storing in IndexedDB:', indexedDBError);
              // If IndexedDB fails, still try to save compressed version
              optimizedProject.imageData = compressedImage;
            }
          } else {
            // Image is small enough after compression
            optimizedProject.imageData = compressedImage;
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
            imageStoredExternally: project.imageData ? true : false,
            persistentImageKey: project.persistentImageKey || project.id
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
 * Loads projects from localStorage and restores images from permanent storage or IndexedDB if needed
 */
export const loadProjectsFromStorage = async (initialProjects: Project[]): Promise<Project[]> => {
  try {
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
        // Check for any projects with permanent images or images stored in IndexedDB
        const restoredProjects = await Promise.all(
          parsedProjects.map(async (project) => {
            let restoredProject = { ...project };
            
            // First check for permanently stored images
            if (project.persistentImageKey) {
              const permanentImage = localStorage.getItem(`project_image_${project.persistentImageKey}`);
              if (permanentImage) {
                restoredProject.imageData = permanentImage;
                // Clear external storage flag since we have the image now
                restoredProject.imageStoredExternally = false;
              }
            }
            
            // If we still don't have the image and it's marked as externally stored, try IndexedDB
            if (!restoredProject.imageData && project.imageStoredExternally) {
              try {
                const imageData = await getImageFromIndexedDB(project.id);
                if (imageData) {
                  restoredProject.imageData = imageData;
                  restoredProject.imageStoredExternally = false;
                  
                  // Also store permanently for future use
                  if (!restoredProject.persistentImageKey) {
                    restoredProject.persistentImageKey = project.id;
                    storePermanentImage(project.id, imageData);
                  }
                }
              } catch (error) {
                console.error(`Failed to restore image for project ${project.id}:`, error);
              }
            }
            
            // Clear any external image URLs to ensure we only use our stored images
            if (restoredProject.imageUrl && restoredProject.imageUrl.startsWith('http')) {
              restoredProject.imageUrl = '';
            }
            
            return restoredProject;
          })
        );
        
        return restoredProjects;
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
      if (key && key !== STORAGE_KEY && !key.includes('essential') && !key.startsWith('project_image_')) {
        localStorage.removeItem(key);
      }
    }
    console.log('Cleared non-essential storage to make room');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

// Export the new function for direct use
export { storePermanentImage };
