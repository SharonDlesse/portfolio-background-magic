import React from 'react';
import { Button } from '../ui/button';
import { RefreshCw, Lock, Unlock } from 'lucide-react';
import { GithubImageGrid } from './GithubImageGrid';
import { GithubImage } from '@/types/github';

interface GithubBrowserViewProps {
  images: GithubImage[];
  loading: boolean;
  error: string | null;
  isSaved: boolean;
  onRefresh: () => void;
  onSettingsClick: () => void;
  showSelectButton?: boolean;
  onSelectImage?: (imageUrl: string) => void;
  lockedImages?: boolean;
  onToggleLock?: () => void;
}

const GithubBrowserView: React.FC<GithubBrowserViewProps> = ({
  images,
  loading,
  error,
  isSaved,
  onRefresh,
  onSettingsClick,
  showSelectButton,
  onSelectImage,
  lockedImages = false,
  onToggleLock,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">GitHub Images</h3>
        <div className="flex gap-2">
          <Button
            variant={lockedImages ? 'default' : 'outline'}
            onClick={onToggleLock}
            disabled={loading || !isSaved}
            className="flex items-center gap-2"
          >
            {lockedImages ? (
              <>
                <Lock className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                Save Images
              </>
            )}
          </Button>
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
      </div>

      <GithubImageGrid
        images={images}
        loading={loading}
        error={error}
        isSaved={isSaved}
        showSelectButton={showSelectButton}
        onSelectImage={onSelectImage}
        onSettingsClick={onSettingsClick}
        hideUrls={true}
      />
    </div>
  );
};

export default GithubBrowserView;
