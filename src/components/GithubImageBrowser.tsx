import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { GithubImage, GithubRepoInfo } from '@/types/github';
import { fetchGithubImages, loadGithubRepoSettings } from '@/utils/githubUtils';
import GithubRepoSettings from './github/GithubRepoSettings';
import GithubBrowserView from './github/GithubBrowserView';
import { optimizeForEnvironment } from '@/utils/storageUtils';

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
  const [cachedImages, setCachedImages] = useState<GithubImage[]>([]);

  useEffect(() => {
    const loadSettings = async () => {
      await optimizeForEnvironment();
      
      const savedInfo = loadGithubRepoSettings();
      if (savedInfo) {
        setRepoInfo(savedInfo);
        setIsSaved(true);
        
        try {
          const cachedImagesJson = sessionStorage.getItem('githubImages');
          if (cachedImagesJson) {
            const parsedImages = JSON.parse(cachedImagesJson);
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
              setCachedImages(parsedImages);
              setImages(parsedImages);
            }
          }
        } catch (e) {
          console.error('Error loading cached images:', e);
        }
        
        if (activeTab === 'browser') {
          fetchImages(savedInfo);
        }
      }
    };
    
    loadSettings();
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'githubRepoInfo' && event.newValue) {
        loadSettings();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [activeTab]);

  const fetchImages = async (info = repoInfo) => {
    if (!info.owner || !info.repo) {
      setError('Please enter repository information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imageFiles = await fetchGithubImages(info);
      
      try {
        sessionStorage.setItem('githubImages', JSON.stringify(imageFiles));
        
        if (imageFiles.length > 0) {
          const minimalCache = imageFiles.slice(0, 10).map(img => ({
            name: img.name,
            path: img.path,
            url: img.url
          }));
          localStorage.setItem('githubImagesMini', JSON.stringify(minimalCache));
        }
      } catch (e) {
        console.warn('Could not cache GitHub images:', e);
      }
      
      setImages(imageFiles);
      setCachedImages(imageFiles);
      
      if (imageFiles.length === 0) {
        setError('No images found in the specified repository path');
      }
    } catch (err) {
      console.error('Error fetching GitHub images:', err);
      
      if (cachedImages.length > 0) {
        setImages(cachedImages);
        setError('Using cached images - failed to refresh from GitHub');
      } else {
        try {
          const miniCache = localStorage.getItem('githubImagesMini');
          if (miniCache) {
            const parsedImages = JSON.parse(miniCache);
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
              setImages(parsedImages);
              setError('Using minimal cached images - failed to refresh from GitHub');
              return;
            }
          }
        } catch (e) {
          console.error('Error loading mini cache:', e);
        }
        
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

  const handleSelectImage = (imageUrl: string) => {
    let standardizedUrl = imageUrl;
    
    if (imageUrl.includes('github.com') && !imageUrl.includes('raw.githubusercontent.com')) {
      try {
        const match = imageUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.*)/);
        if (match) {
          const [, user, repo, branch, path] = match;
          standardizedUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
        }
      } catch (e) {
        console.error('Error standardizing GitHub URL:', e);
      }
    }
    
    if (onSelectImage) {
      onSelectImage(standardizedUrl);
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
              onSelectImage={handleSelectImage}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GithubImageBrowser;
