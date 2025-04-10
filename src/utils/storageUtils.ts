
/**
 * Utility functions for managing localStorage and IndexedDB to avoid quota issues
 */

import { Project } from '@/components/ProjectCard';

// Maximum allowed image size in localStorage (in bytes) - reduced to prevent quota issues
const MAX_IMAGE_SIZE = 10 * 1024; // 10KB for better storage management
const STORAGE_KEY = 'portfolioProjects';
const INDEXED_DB_NAME = 'projectImagesDB';
const INDEXED_DB_STORE = 'projectImages';
const INDEXED_DB_VERSION = 2; // Increased version to handle schema upgrades

// Function to compress image data (base64 string) with aggressive compression
const compressImageData = async (imageData: string): Promise<string> => {
  // Only compress if it's image data
  if (imageData.startsWith('data:image')) {
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');
    
    // Set up image loading
    return new Promise<string>((resolve, reject) => {
      img.onload = () => {
        // Scale down image dimensions
        const MAX_WIDTH = 400; // Reduced maximum width
        const MAX_HEIGHT = 300; // Reduced maximum height
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
          
          // Get compressed data URL with reduced quality (0.4 instead of 0.5)
          const compressedData = canvas.toDataURL('image/jpeg', 0.4);
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
 * Checks if IndexedDB is available and properly working
 */
const isIndexedDBAvailable = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Quick feature detection
    if (!window.indexedDB) {
      resolve(false);
      return;
    }
    
    // Attempt to open and use IndexedDB
    try {
      const testDb = indexedDB.open('testDB', 1);
      testDb.onerror = () => resolve(false);
      testDb.onsuccess = () => {
        // Clean up test database
        testDb.result.close();
        try {
          indexedDB.deleteDatabase('testDB');
        } catch (e) {
          console.warn('Could not delete test database', e);
        }
        resolve(true);
      };
    } catch (e) {
      resolve(false);
    }
  });
};

/**
 * Opens IndexedDB connection for storing project images
 */
const openImageDatabase = async (): Promise<IDBDatabase> => {
  if (!(await isIndexedDBAvailable())) {
    throw new Error('IndexedDB not supported');
  }
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as any).error);
      reject(new Error('Failed to open IndexedDB'));
    };
    
    request.onblocked = () => {
      // This event is triggered if the database was previously loaded but not closed
      console.warn('IndexedDB blocked - another connection is still open');
      reject(new Error('IndexedDB is blocked'));
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create or update object store
      if (!db.objectStoreNames.contains(INDEXED_DB_STORE)) {
        db.createObjectStore(INDEXED_DB_STORE, { keyPath: 'id' });
      }
      
      // If we have existing data but need to migrate to a new schema
      // Additional upgrade logic could go here
    };
  });
};

/**
 * Stores image data in IndexedDB with improved reliability
 */
const storeImageInIndexedDB = async (projectId: string, imageData: string): Promise<boolean> => {
  try {
    // Always compress the image first
    const compressedImage = await compressImageData(imageData);
    
    // Check for IndexedDB availability
    const indexedDBAvailable = await isIndexedDBAvailable();
    if (!indexedDBAvailable) {
      console.error('IndexedDB not available for image storage');
      return false;
    }
    
    const db = await openImageDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction([INDEXED_DB_STORE], 'readwrite');
      const store = transaction.objectStore(INDEXED_DB_STORE);
      
      const request = store.put({ id: projectId, imageData: compressedImage, timestamp: new Date().toISOString() });
      
      request.onsuccess = () => {
        console.log(`Successfully stored image for project ${projectId} in IndexedDB`);
        db.close();
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error(`Failed to store image for project ${projectId} in IndexedDB:`, (event.target as any)?.error);
        db.close();
        resolve(false);
      };
    });
  } catch (error) {
    console.error('Error storing image in IndexedDB:', error);
    return false;
  }
};

/**
 * Retrieves image data from IndexedDB with improved reliability
 */
export const getImageFromIndexedDB = async (projectId: string): Promise<string | null> => {
  try {
    // Check for IndexedDB availability
    const indexedDBAvailable = await isIndexedDBAvailable();
    if (!indexedDBAvailable) {
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
          console.log(`Retrieved image for project ${projectId} from IndexedDB`);
          db.close();
          resolve(request.result.imageData);
        } else {
          console.log(`No image found for project ${projectId} in IndexedDB`);
          db.close();
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error(`Failed to retrieve image for project ${projectId} from IndexedDB:`, (event.target as any)?.error);
        db.close();
        resolve(null);
      };
    });
  } catch (error) {
    console.error('Error retrieving image from IndexedDB:', error);
    return null;
  }
};

/**
 * Attempt to sync persistent storage for the site
 */
export const requestPersistentStorage = async (): Promise<boolean> => {
  try {
    // Check if persistent storage API is available
    if (navigator.storage && navigator.storage.persist) {
      // Request persistent storage permission
      const isPersisted = await navigator.storage.persist();
      console.log(`Persistent storage granted: ${isPersisted}`);
      return isPersisted;
    }
    return false;
  } catch (error) {
    console.error('Error requesting persistent storage:', error);
    return false;
  }
};

/**
 * Saves projects to localStorage with optimized image handling
 * and IndexedDB fallback for all images
 */
export const saveProjectsToStorage = async (projects: Project[]): Promise<void> => {
  try {
    // Request persistent storage permission
    await requestPersistentStorage();
    
    // Create a copy of projects with optimized image handling
    const optimizedProjects: Project[] = [];
    
    for (const project of projects) {
      // Skip this project if it's empty or invalid
      if (!project || !project.id) continue;
      
      const optimizedProject = { ...project };
      
      // Process GitHub image URLs to ensure they're standardized
      if (optimizedProject.imageUrl && 
          (optimizedProject.imageUrl.includes('githubusercontent.com') || 
           optimizedProject.imageUrl.includes('github.com'))) {
        // Standardize GitHub URLs to raw format
        const standardizedUrl = standardizeGitHubImageUrl(optimizedProject.imageUrl);
        optimizedProject.imageUrl = standardizedUrl || optimizedProject.imageUrl;
      }
      
      // Handle images - store all in IndexedDB to prevent localStorage quota issues
      if (project.imageData) {
        try {
          // Always try to store image in IndexedDB first
          const success = await storeImageInIndexedDB(project.id, project.imageData);
          
          if (success) {
            // Set flag to indicate image is stored in IndexedDB
            optimizedProject.imageStoredExternally = true;
            
            // Remove image data from localStorage object
            delete optimizedProject.imageData;
          } else {
            // If IndexedDB fails, try aggressive compression
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
    
    // Save projects in localStorage without large images
    try {
      const strippedProjects = optimizedProjects.map(project => {
        const stripped = { ...project };
        delete stripped.imageData; // Always remove imageData from localStorage
        return stripped;
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(strippedProjects));
      console.log(`Successfully saved ${projects.length} projects to localStorage`);
    } catch (storageError) {
      console.error('Error in primary storage method:', storageError);
      
      // If quota error, try to save minimal project data
      if (storageError instanceof DOMException && storageError.name === 'QuotaExceededError') {
        console.log('Quota exceeded, trying alternative storage method...');
        
        // Clear non-essential data to make room
        clearOtherStorage();
        
        // Save minimal project data
        const minimalProjects = projects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description || '',
          tags: project.tags || [],
          category: project.category || '',
          imageUrl: project.imageUrl || '',
          imageStoredExternally: true 
        }));
        
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalProjects));
          console.log('Saved minimal project data as fallback');
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
 * Standardize GitHub image URLs to ensure consistency
 */
const standardizeGitHubImageUrl = (url: string): string | null => {
  if (!url) return null;
  
  // Already in raw format
  if (url.startsWith('https://raw.githubusercontent.com')) {
    return url;
  }
  
  // Convert github.com URLs to raw.githubusercontent.com
  if (url.includes('github.com')) {
    try {
      // Match github.com/USERNAME/REPO/blob/BRANCH/PATH pattern
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.*)/);
      if (match) {
        const [, user, repo, branch, path] = match;
        return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
      }
    } catch (e) {
      console.error('Error standardizing GitHub URL:', e);
    }
  }
  
  return url;
};

/**
 * Loads projects from localStorage and restores images from IndexedDB 
 * with improved reliability
 */
export const loadProjectsFromStorage = async (initialProjects: Project[]): Promise<Project[]> => {
  try {
    // Ensure persistent storage if possible
    await requestPersistentStorage();
    
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        
        if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
          console.log(`Loading ${parsedProjects.length} projects from storage`);
          
          // Restore images from IndexedDB where needed
          const restoredProjects = await Promise.all(
            parsedProjects.map(async (project) => {
              // Skip invalid projects
              if (!project || !project.id) {
                return null;
              }
              
              // If using GitHub images, ensure URLs are standardized
              if (project.imageUrl && 
                  (project.imageUrl.includes('githubusercontent.com') || 
                   project.imageUrl.includes('github.com'))) {
                project.imageUrl = standardizeGitHubImageUrl(project.imageUrl) || project.imageUrl;
              }
              
              // If project has flag indicating the image is stored externally
              // or has no imageData, try to get from IndexedDB
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
          
          // Filter out null projects
          const filteredProjects = restoredProjects.filter(Boolean) as Project[];
          
          if (filteredProjects.length > 0) {
            console.log(`Successfully restored ${filteredProjects.length} projects`);
            return filteredProjects;
          }
        }
      } catch (parseError) {
        console.error('Error parsing saved projects:', parseError);
      }
    }
    
    console.log(`No valid saved projects found, using ${initialProjects.length} initial projects`);
    return initialProjects;
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
    return initialProjects;
  }
};

/**
 * Clears non-essential storage to make room
 */
export const clearOtherStorage = (): void => {
  try {
    // Clear any temporary or non-essential storage items
    const essentialKeys = [
      STORAGE_KEY, 
      'portfolioUser', 
      'portfolioBackground', 
      'githubRepoInfo'
    ];
    
    // Get total localStorage size
    let totalSize = 0;
    let itemsRemoved = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
        
        if (!essentialKeys.includes(key) && !key.includes('essential')) {
          localStorage.removeItem(key);
          itemsRemoved++;
        }
      }
    }
    
    console.log(`Cleared ${itemsRemoved} non-essential storage items. Total storage used: ${totalSize} chars`);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Checks if the environment is likely the published site vs. preview
 */
export const isPublishedEnvironment = (): boolean => {
  // Heuristics to determine if we're in the published environment
  const url = window.location.href;
  
  // Check if we're in lovable.app preview
  const isPreview = url.includes('lovable.dev') || url.includes('localhost');
  
  return !isPreview;
};

/**
 * Optimizes storage strategy based on detected environment
 */
export const optimizeForEnvironment = async (): Promise<void> => {
  const isPublished = isPublishedEnvironment();
  
  // Request persistence - critical for published site
  if (isPublished) {
    await requestPersistentStorage();
  }
  
  console.log(`Running in ${isPublished ? 'published' : 'preview'} environment`);
};
