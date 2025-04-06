
import React from 'react';
import { Button } from '../ui/button';
import { Check, Copy, ExternalLink, Download } from 'lucide-react';
import { GithubImage } from '@/types/github';
import { standardizeGithubImageUrl } from '@/utils/imageUrlUtils';
import { toast } from 'sonner';
import { handleImageSelection } from '@/utils/githubUtils';

interface GithubImageGridProps {
  images: GithubImage[];
  loading: boolean;
  error: string | null;
  isSaved: boolean;
  showSelectButton?: boolean;
  onSelectImage?: (imageUrl: string) => void;
  onSettingsClick: () => void;
}

const GithubImageGrid: React.FC<GithubImageGridProps> = ({
  images,
  loading,
  error,
  isSaved,
  showSelectButton = true,
  onSelectImage,
  onSettingsClick
}) => {
  const copyImageUrl = (url: string) => {
    const standardizedUrl = standardizeGithubImageUrl(url) || url;
    navigator.clipboard.writeText(standardizedUrl);
    toast.success('Image URL copied to clipboard');
  };

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
        {error}
      </div>
    );
  }

  if (!isSaved) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Please configure your GitHub repository settings first
        </p>
        <Button 
          variant="outline" 
          onClick={onSettingsClick} 
          className="mt-4"
        >
          Go to Settings
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Loading images...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No images found</p>
      </div>
    );
  }

  return (
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
                onClick={() => handleImageSelection(image, onSelectImage)}
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
                href={standardizeGithubImageUrl(image.download_url) || image.download_url} 
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
  );
};

export default GithubImageGrid;
