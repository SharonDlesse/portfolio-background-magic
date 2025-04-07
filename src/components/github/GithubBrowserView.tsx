
import React from 'react';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import GithubImageGrid from './GithubImageGrid';
import { GithubImage, GithubRepoInfo } from '@/types/github';

interface GithubBrowserViewProps {
  images: GithubImage[];
  loading: boolean;
  error: string | null;
  isSaved: boolean;
  onRefresh: () => void;
  onSettingsClick: () => void;
  showSelectButton?: boolean;
  onSelectImage?: (imageUrl: string) => void;
}

const GithubBrowserView: React.FC<GithubBrowserViewProps> = ({ 
  images, 
  loading, 
  error, 
  isSaved,
  onRefresh,
  onSettingsClick,
  showSelectButton,
  onSelectImage
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">GitHub Images</h3>
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={loading || !isSaved}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <GithubImageGrid 
        images={images}
        loading={loading}
        error={error}
        isSaved={isSaved}
        showSelectButton={showSelectButton}
        onSelectImage={onSelectImage}
        onSettingsClick={onSettingsClick}
      />
    </div>
  );
};

export default GithubBrowserView;
