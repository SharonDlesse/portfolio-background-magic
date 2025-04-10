
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { GithubImage, GithubRepoInfo } from '@/types/github';
import { fetchGithubImages, loadGithubRepoSettings } from '@/utils/githubUtils';
import GithubRepoSettings from './github/GithubRepoSettings';
import GithubBrowserView from './github/GithubBrowserView';

interface GithubImageBrowserProps {
  onSelectImage?: (imageUrl: string) => void;
  showSelectButton?: boolean;
  defaultTab?: string;
}

const GithubImageBrowser: React.FC<GithubImageBrowserProps> = ({ 
  onSelectImage, 
  showSelectButton = true,
  defaultTab = "browser"
}) => {
  const [images, setImages] = useState<GithubImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState<GithubRepoInfo>({
    owner: '',
    repo: '',
    path: 'public/Images',
    token: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [lockedImages, setLockedImages] = useState<boolean>(false);

  // Initialize from localStorage with improved loading
  useEffect(() => {
    const loadSettings = () => {
      const savedInfo = loadGithubRepoSettings();
      if (savedInfo) {
        setRepoInfo(savedInfo);
        setIsSaved(true);
        
        // Fetch images if we're on browser tab and have settings
        if (activeTab === 'browser') {
          fetchImages(savedInfo);
        }
      }
      
      // Check if images are locked
      const locked = localStorage.getItem('githubImagesLocked') === 'true';
      setLockedImages(locked);
      
      // Load cached images if locked
      if (locked) {
        const cachedImages = sessionStorage.getItem('githubImages');
        if (cachedImages) {
          try {
            setImages(JSON.parse(cachedImages));
          } catch (err) {
            console.error('Error loading cached images:', err);
          }
        }
      }
    };
    
    // Load settings immediately
    loadSettings();
    
    // Set up an event listener for storage changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'githubRepoInfo' && event.newValue) {
        loadSettings();
      }
      if (event.key === 'githubImagesLocked') {
        setLockedImages(event.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [activeTab]);

  // Enhanced fetch images function with better error handling
  const fetchImages = async (info = repoInfo) => {
    // Don't fetch if images are locked
    if (lockedImages) {
      const cachedImages = sessionStorage.getItem('githubImages');
      if (cachedImages) {
        try {
          setImages(JSON.parse(cachedImages));
          return;
        } catch (err) {
          console.error('Error loading cached images:', err);
        }
      }
    }
    
    if (!info.owner || !info.repo) {
      setError('Please enter repository information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imageFiles = await fetchGithubImages(info);
      setImages(imageFiles);
      
      // Cache images in session storage
      sessionStorage.setItem('githubImages', JSON.stringify(imageFiles));
      
      if (imageFiles.length === 0) {
        setError('No images found in the specified repository path');
      }
    } catch (err) {
      console.error('Error fetching GitHub images:', err);
      
      // Try to load images from session storage as fallback
      const cachedImages = sessionStorage.getItem('githubImages');
      if (cachedImages) {
        try {
          const parsedImages = JSON.parse(cachedImages);
          setImages(parsedImages);
          setError('Using cached images - failed to refresh from GitHub');
        } catch (cacheErr) {
          setError(`Failed to fetch images: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      } else {
        setError(`Failed to fetch images: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSaveSuccess = () => {
    setIsSaved(true);
    fetchImages(repoInfo);
    setActiveTab('browser');
  };

  const handleSettingsClick = () => {
    setActiveTab('settings');
  };
  
  const toggleLockImages = () => {
    const newLockedState = !lockedImages;
    setLockedImages(newLockedState);
    localStorage.setItem('githubImagesLocked', newLockedState.toString());
    
    if (newLockedState) {
      // Save current images to session storage
      sessionStorage.setItem('githubImages', JSON.stringify(images));
      toast.success('Images saved and locked until manually refreshed');
    } else {
      toast.info('Images unlocked - new images will be fetched on refresh');
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue={isSaved ? "browser" : "settings"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browser">Image Browser</TabsTrigger>
            <TabsTrigger value="settings">Repository Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <GithubRepoSettings 
              repoInfo={repoInfo} 
              setRepoInfo={setRepoInfo} 
              onSaveSuccess={handleSaveSuccess} 
            />
          </TabsContent>

          <TabsContent value="browser" className="mt-4">
            <GithubBrowserView
              images={images}
              loading={loading}
              error={error}
              isSaved={isSaved}
              onRefresh={() => fetchImages()}
              onSettingsClick={handleSettingsClick}
              showSelectButton={showSelectButton}
              onSelectImage={onSelectImage}
              lockedImages={lockedImages}
              onToggleLock={toggleLockImages}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GithubImageBrowser;
