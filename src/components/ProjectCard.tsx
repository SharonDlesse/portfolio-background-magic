import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ImageOff } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getImageFromIndexedDB } from '@/utils/storageUtils';

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageData?: string; // Base64 data for the image
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  additionalLinks?: {
    title: string;
    url: string;
  }[];
  categories?: string[];
  attributes?: string[];
  detailedDescription?: string;
  imagePosition?: {
    x: number;
    y: number;
  };
  client?: string;
  year?: string;
  category?: string;
  overview?: string;
  clientProblem?: string;
  solution?: string;
  businessImpact?: string;
  imageStoredExternally?: boolean;
};

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  showEdit?: boolean;
}

const IconButton: React.FC<{
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
}> = ({ icon, onClick, ariaLabel, disabled = false, className }) => (
  <Button
    variant="ghost"
    size="icon"
    className={`h-8 w-8 ${className || ''}`}
    onClick={onClick}
    aria-label={ariaLabel}
    disabled={disabled}
  >
    {icon}
  </Button>
);

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, showEdit = false }) => {
  const navigate = useNavigate();
  const [isZoomed, setIsZoomed] = useState(false);
  const [imagePosition, setImagePosition] = useState(project.imagePosition || { x: 0, y: 0 });
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const standardizeGithubImageUrl = (url: string): string => {
    if (!url) return url;
    if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
      return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }
    return url;
  };

  const enhancedProject = useMemo(
    () => ({
      ...project,
      overview: project.overview || project.description || 'No overview provided for this project.',
      clientProblem: project.clientProblem || 'This project addressed specific client challenges that required innovative solutions.',
      solution: project.solution || 'A comprehensive solution was developed to meet the client\'s needs and objectives.',
      businessImpact: project.businessImpact || 'The implementation delivered measurable business value and positive outcomes for the client.',
      client: project.client || 'Various clients',
      year: project.year || 'Recent',
      category: project.category || 'Project',
      imageUrl: standardizeGithubImageUrl(project.imageUrl),
    }),
    [project]
  );

  useEffect(() => {
    const loadImage = async () => {
      setIsImageLoading(true);
      setImageError(false);

      try {
        if (project.imageData) {
          setImageSource(project.imageData);
        } else if (project.imageStoredExternally) {
          const image = await getImageFromIndexedDB(project.id);
          setImageSource(image || standardizeGithubImageUrl(project.imageUrl));
          if (!image && !project.imageUrl) setImageError(true);
        } else if (project.imageUrl) {
          setImageSource(standardizeGithubImageUrl(project.imageUrl));
        } else {
          setImageError(true);
        }
      } catch (error) {
        console.error('Failed to load image:', error);
        setImageError(true);
      } finally {
        setIsImageLoading(false);
      }
    };

    loadImage();
  }, [project.id, project.imageData, project.imageUrl, project.imageStoredExternally]);

  const handleCardClick = () => navigate(`/projects/${project.id}`);
  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(true);
  };
  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
  };
  const handleToggleRepositioning = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRepositioning(!isRepositioning);
  };
  const handleRepositionImage = (direction: 'up' | 'down' | 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    const step = 10;
    const newPosition = { ...imagePosition };
    if (direction === 'up') newPosition.y += step;
    if (direction === 'down') newPosition.y -= step;
    if (direction === 'left') newPosition.x -= step;
    if (direction === 'right') newPosition.x += step;
    setImagePosition(newPosition);

    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
      const projects: Project[] = JSON.parse(savedProjects);
      const updatedProjects = projects.map(p =>
        p.id === project.id ? { ...p, imagePosition: newPosition } : p
      );
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit({ ...enhancedProject });
  };

  const handleImageError = () => setImageError(true);

  return (
    <Card
      className="overflow-hidden bg-white dark:bg-slate-900 border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {isImageLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
              <span className="text-sm text-muted-foreground">Loading image...</span>
            </div>
          ) : imageSource && !imageError ? (
            <img
              src={imageSource}
              alt={project.title}
              onError={handleImageError}
              style={{ objectPosition: `${50 + imagePosition.x}% ${50 + imagePosition.y}%` }}
              className="object-fill w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
              <ImageOff className="h-6 w-6 mr-2 opacity-50" />
              <span className="text-sm">No image available</span>
            </div>
          )}
        </AspectRatio>

        {showEdit && imageSource && !imageError && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            <IconButton
              icon={<ZoomIn className="h-4 w-4" />}
              onClick={handleZoomIn}
              ariaLabel="Zoom In"
              disabled={isZoomed}
              className="bg-white/70 hover:bg-white/90 text-black rounded-full backdrop-blur-sm"
            />
            <IconButton
              icon={<ZoomOut className="h-4 w-4" />}
              onClick={handleZoomOut}
              ariaLabel="Zoom Out"
              disabled={!isZoomed}
              className="bg-white/70 hover:bg-white/90 text-black rounded-full backdrop-blur-sm"
            />
            <IconButton
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={handleToggleRepositioning}
              ariaLabel="Toggle Repositioning"
              className="bg-white/70 hover:bg-white/90 text-black rounded-full backdrop-blur-sm"
            />
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-1 text-primary text-xl font-bold">{project.title}</CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-card-foreground line-clamp-3 text-sm font-medium">{project.description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        {showEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditClick}
            className="ml-auto border-primary/50 text-primary hover:bg-primary/10"
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
