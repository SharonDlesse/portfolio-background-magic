
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RefreshCw, Check, Copy, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';

interface GithubImage {
  name: string;
  path: string;
  download_url: string;
  html_url: string;
  sha: string;
  size: number;
  type: string;
}

interface GithubImageBrowserProps {
  onSelectImage?: (imageUrl: string) => void;
  showSelectButton?: boolean;
}

const GithubImageBrowser: React.FC<GithubImageBrowserProps> = ({ 
  onSelectImage, 
  showSelectButton = true 
}) => {
  const [images, setImages] = useState<GithubImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState({
    owner: '',
    repo: '',
    path: 'public/Images',
    token: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedRepoInfo = localStorage.getItem('githubRepoInfo');
    if (savedRepoInfo) {
      setRepoInfo(JSON.parse(savedRepoInfo));
      setIsSaved(true);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('githubRepoInfo', JSON.stringify(repoInfo));
    setIsSaved(true);
    toast.success('GitHub repository settings saved');
    fetchImages();
  };

  const fetchImages = async () => {
    if (!repoInfo.owner || !repoInfo.repo) {
      setError('Please enter repository information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${repoInfo.path}`;
      const headers: HeadersInit = { 
        'Accept': 'application/vnd.github+json'
      };
      
      if (repoInfo.token) {
        headers['Authorization'] = `token ${repoInfo.token}`;
      }

      const response = await fetch(apiUrl, { headers });
      
      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Filter only image files
      const imageFiles = Array.isArray(data) 
        ? data.filter(file => 
            file.type === 'file' && 
            /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(file.name)
          )
        : [];
      
      setImages(imageFiles);
      
      if (imageFiles.length === 0 && Array.isArray(data)) {
        setError('No images found in the specified repository path');
      }
    } catch (err) {
      console.error('Error fetching GitHub images:', err);
      setError(`Failed to fetch images: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (image: GithubImage) => {
    if (onSelectImage) {
      onSelectImage(image.download_url);
      toast.success(`Selected image: ${image.name}`);
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Image URL copied to clipboard');
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Tabs defaultValue={isSaved ? "browser" : "settings"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browser">Image Browser</TabsTrigger>
            <TabsTrigger value="settings">Repository Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="owner" className="text-sm font-medium">GitHub Username/Organization</label>
                <Input 
                  id="owner"
                  value={repoInfo.owner}
                  onChange={(e) => setRepoInfo({...repoInfo, owner: e.target.value})}
                  placeholder="e.g. username"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="repo" className="text-sm font-medium">Repository Name</label>
                <Input 
                  id="repo"
                  value={repoInfo.repo}
                  onChange={(e) => setRepoInfo({...repoInfo, repo: e.target.value})}
                  placeholder="e.g. my-project"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="path" className="text-sm font-medium">Image Directory Path</label>
                <Input 
                  id="path"
                  value={repoInfo.path}
                  onChange={(e) => setRepoInfo({...repoInfo, path: e.target.value})}
                  placeholder="e.g. public/images"
                />
                <p className="text-sm text-muted-foreground">
                  Relative path to your images directory in the repository
                </p>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="token" className="text-sm font-medium">Personal Access Token (Optional)</label>
                <Input 
                  id="token"
                  type="password"
                  value={repoInfo.token}
                  onChange={(e) => setRepoInfo({...repoInfo, token: e.target.value})}
                  placeholder="Only needed for private repositories"
                />
                <p className="text-sm text-muted-foreground">
                  Only required for private repositories or to avoid rate limits
                </p>
              </div>

              <Button onClick={saveSettings}>Save Repository Settings</Button>
            </div>
          </TabsContent>

          <TabsContent value="browser" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">GitHub Images</h3>
              <Button 
                variant="outline" 
                onClick={fetchImages} 
                disabled={loading || !isSaved}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                {error}
              </div>
            )}

            {!isSaved ? (
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  Please configure your GitHub repository settings first
                </p>
              </div>
            ) : loading ? (
              <div className="text-center p-8">
                <p className="text-muted-foreground">Loading images...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No images found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.sha} className="group relative border rounded-md overflow-hidden">
                    <div className="aspect-square w-full overflow-hidden bg-muted">
                      <img 
                        src={image.download_url} 
                        alt={image.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-xs truncate">{image.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(image.size / 1024)}KB
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-2">
                      {showSelectButton && (
                        <Button 
                          variant="default" 
                          size="sm"
                          className="w-full flex items-center gap-2"
                          onClick={() => handleSelectImage(image)}
                        >
                          <Check className="h-4 w-4" />
                          Select
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full flex items-center gap-2"
                        onClick={() => copyImageUrl(image.download_url)}
                      >
                        <Copy className="h-4 w-4" />
                        Copy URL
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full flex items-center gap-2"
                        asChild
                      >
                        <a 
                          href={image.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View on GitHub
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full flex items-center gap-2"
                        asChild
                      >
                        <a 
                          href={image.download_url} 
                          download={image.name}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GithubImageBrowser;
