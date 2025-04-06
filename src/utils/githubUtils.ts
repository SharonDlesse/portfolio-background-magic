
import { GithubImage, GithubRepoInfo } from "@/types/github";
import { toast } from "sonner";
import { standardizeGithubImageUrl } from "./imageUrlUtils";

/**
 * Fetches images from a GitHub repository
 */
export const fetchGithubImages = async (info: GithubRepoInfo): Promise<GithubImage[]> => {
  if (!info.owner || !info.repo) {
    throw new Error('Please enter repository information');
  }

  try {
    const apiUrl = `https://api.github.com/repos/${info.owner}/${info.repo}/contents/${info.path}`;
    const headers: HeadersInit = { 
      'Accept': 'application/vnd.github+json'
    };
    
    if (info.token) {
      headers['Authorization'] = `token ${info.token}`;
    }

    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // Filter only image files
    const imageFiles = Array.isArray(data) 
      ? data.filter(file => 
          file.type === 'file' && 
          /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(file.name)
        )
      : [];
    
    if (imageFiles.length > 0) {
      // Save successfully fetched images to sessionStorage for quick restoration
      sessionStorage.setItem('githubImages', JSON.stringify(imageFiles));
      // Also save to localStorage for longer-term persistence
      localStorage.setItem('githubImages', JSON.stringify(imageFiles));
    }
    
    return imageFiles;
  } catch (err) {
    console.error('Error fetching GitHub images:', err);
    throw err;
  }
};

/**
 * Saves GitHub repository settings to local storage
 */
export const saveGithubRepoSettings = (repoInfo: GithubRepoInfo): boolean => {
  try {
    // Ensure we have valid data before saving
    if (!repoInfo.owner || !repoInfo.repo) {
      toast.error('Please enter repository owner and name');
      return false;
    }
    
    localStorage.setItem('githubRepoInfo', JSON.stringify(repoInfo));
    
    // Store a timestamp to indicate fresh settings
    localStorage.setItem('githubRepoInfoLastUpdated', new Date().toISOString());
    
    // Also save to sessionStorage for more reliable persistence
    sessionStorage.setItem('githubRepoInfo', JSON.stringify(repoInfo));
    
    return true;
  } catch (error) {
    console.error('Error saving GitHub settings:', error);
    return false;
  }
};

/**
 * Loads GitHub repository settings from storage
 */
export const loadGithubRepoSettings = (): GithubRepoInfo | null => {
  try {
    const savedRepoInfo = localStorage.getItem('githubRepoInfo');
    if (savedRepoInfo) {
      return JSON.parse(savedRepoInfo);
    }
    return null;
  } catch (error) {
    console.error('Error parsing GitHub repo info:', error);
    return null;
  }
};

/**
 * Handles image selection and saves to recent selections
 */
export const handleImageSelection = (image: GithubImage, onSelectImage?: (imageUrl: string) => void): void => {
  if (onSelectImage) {
    const standardizedUrl = standardizeGithubImageUrl(image.download_url) || image.download_url;
    onSelectImage(standardizedUrl);
    
    // Save recently selected images for persistence
    try {
      const recentSelections = JSON.parse(localStorage.getItem('recentImageSelections') || '[]');
      const newSelection = { 
        url: standardizedUrl, 
        name: image.name,
        timestamp: new Date().toISOString() 
      };
      
      // Add to beginning, limit to 10 items
      recentSelections.unshift(newSelection);
      if (recentSelections.length > 10) recentSelections.pop();
      
      localStorage.setItem('recentImageSelections', JSON.stringify(recentSelections));
    } catch (error) {
      console.error('Error saving recent selection:', error);
    }
  }
};
