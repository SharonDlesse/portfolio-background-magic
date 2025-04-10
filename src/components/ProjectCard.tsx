
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export type GithubImage = {
  imageUrl: string;
  name: string;
  path: string;
  // Add other properties as needed
};

interface GithubImageBrowserProps {
  images: GithubImage[];
  onSelect?: (image: GithubImage) => void;
  initialIndex?: number;
}

const GithubImageBrowser: React.FC<GithubImageBrowserProps> = ({
  images,
  onSelect,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);

  const currentImage = images[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsLoading(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsLoading(true);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageClick = () => {
    if (onSelect) {
      onSelect(currentImage);
    }
  };

  if (!images || images.length === 0) {
    return (
      <Card className="p-4">
        <CardHeader>
          <CardTitle>No Images Found</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <Image className="h-16 w-16 text-gray-400" />
            <p className="mt-2 text-gray-500">No images available in the repository.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Image Browser</span>
          <span className="text-sm font-normal">
            {currentIndex + 1} of {images.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-center justify-between mb-2">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="relative w-full mx-4">
            <AspectRatio ratio={16 / 9}>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              <img
                src={currentImage.imageUrl}
                alt={currentImage.name}
                className={`rounded-md object-contain w-full h-full transition-opacity ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onClick={handleImageClick}
                loading="lazy"
              />
            </AspectRatio>
          </div>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          {currentImage.path}
        </div>
      </CardContent>
    </Card>
  );
};

export default GithubImageBrowser;
