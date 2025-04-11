
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ImageOff, Star, Trash2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getImageFromIndexedDB } from '@/utils/storageUtils';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  showEdit?: boolean;
  showDelete?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  showEdit = false,
  showDelete = false
}) => {
  const navigate = useNavigate();
  const [isZoomed, setIsZoomed] = useState(false);
  const [imagePosition, setImagePosition] = useState(project.imagePosition || {
    x: 0,
    y: 0
  });
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const standardizeGithubImageUrl = (url: string): string => {
    if (!url) return url;
    if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
      return url
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
    }
    return url;
  };

  useEffect(() => {
    const loadImage = async () => {
      setIsImageLoading(true);
      setImageError(false);
      
      try {
        if (imageSource?.startsWith('blob:')) {
          URL.revokeObjectURL(imageSource);
        }
        
        if (project.imageData) {
          setImageSource(project.imageData);
        } else if (project.imageStoredExternally) {
          const image = await getImageFromIndexedDB(project.id);
          if (image) {
            setImageSource(image);
          } else if (project.imageUrl) {
            const cleanedUrl = project.imageUrl.replace(/^blob:https?:\/\/.*?\//, '');
            setImageSource(standardizeGithubImageUrl(cleanedUrl));
          } else {
            setImageError(true);
          }
        } else if (project.imageUrl) {
          if (project.imageUrl.startsWith('blob:')) {
            const fallbackImage = await getImageFromIndexedDB(project.id);
            if (fallbackImage) {
              setImageSource(fallbackImage);
            } else {
              setImageError(true);
            }
          } else {
            setImageSource(standardizeGithubImageUrl(project.imageUrl));
          }
        } else {
          setImageError(true);
        }
      } catch (error) {
        console.error("Failed to load image:", error);
        setImageError(true);
      } finally {
        setIsImageLoading(false);
      }
    };
    
    loadImage();
    
    return () => {
      if (imageSource?.startsWith('blob:')) {
        URL.revokeObjectURL(imageSource);
      }
    };
  }, [project.id, project.imageData, project.imageUrl, project.imageStoredExternally]);

  const enhancedProject = {
    ...project,
    overview: project.overview || project.description || "No overview provided for this project.",
    clientProblem: project.clientProblem || "This project addressed specific client challenges that required innovative solutions.",
    solution: project.solution || "A comprehensive solution was developed to meet the client's needs and objectives.",
    businessImpact: project.businessImpact || "The implementation delivered measurable business value and positive outcomes for the client.",
    client: project.client || "Various clients",
    year: project.year || "Recent",
    category: project.category || "Project",
    imageUrl: standardizeGithubImageUrl(project.imageUrl),
    isFeatured: project.isFeatured || false
  };

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

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
    let newPosition = {
      ...imagePosition
    };
    switch (direction) {
      case 'up':
        newPosition.y += step;
        break;
      case 'down':
        newPosition.y -= step;
        break;
      case 'left':
        newPosition.x += step;
        break;
      case 'right':
        newPosition.x -= step;
        break;
    }
    setImagePosition(newPosition);
    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
      const projects: Project[] = JSON.parse(savedProjects);
      const updatedProjects = projects.map(p => p.id === project.id ? {
        ...p,
        imagePosition: newPosition
      } : p);
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit({ ...enhancedProject });
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(project.id);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="overflow-hidden bg-white dark:bg-slate-900 border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 flex flex-col h-full" onClick={handleCardClick}>
      <div className="relative">
        {enhancedProject.isFeatured && (
          <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star className="h-3 w-3 fill-white" />
            <span className="text-xs font-bold">Featured</span>
          </div>
        )}
        
        <AspectRatio ratio={16 / 9}>
          {isImageLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
              <span className="text-sm text-muted-foreground">Loading image...</span>
            </div>
          ) : imageSource && !imageError ? (
            <div className="w-full h-full overflow-hidden">
              <img 
                src={imageSource} 
                alt={project.title} 
                onError={handleImageError}
                style={{
                  objectPosition: `${50 + imagePosition.x}% ${50 + imagePosition.y}%`
                }} 
                className="object-fill w-full h-full" 
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
              <ImageOff className="h-6 w-6 mr-2 opacity-50" />
              <span className="text-sm">No image available</span>
            </div>
          )}
        </AspectRatio>
        
        {imageSource && !imageError && showEdit && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/70 hover:bg-white/90 text-black rounded-full backdrop-blur-sm" onClick={handleToggleRepositioning}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/70 hover:bg-white/90 text-black rounded-full backdrop-blur-sm" onClick={handleZoomIn} disabled={isZoomed}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/70 hover:bg-white/90 text-black rounded-full backdrop-blur-sm" onClick={handleZoomOut} disabled={!isZoomed}>
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {isRepositioning && imageSource && !imageError && showEdit && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 p-1 bg-white/70 backdrop-blur-sm rounded-lg">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:bg-white/20" onClick={e => handleRepositionImage('up', e)}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:bg-white/20" onClick={e => handleRepositionImage('left', e)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:bg-white/20" onClick={e => handleRepositionImage('right', e)}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:bg-white/20" onClick={e => handleRepositionImage('down', e)}>
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-1 text-primary text-xl font-bold">{project.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-card-foreground line-clamp-3 text-sm font-medium">{project.description}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto flex gap-2 justify-end">
        {showDelete && onDelete && (
          <Button variant="destructive" size="sm" onClick={handleDeleteClick} className="border-red-500 bg-red-500 hover:bg-red-600">
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        )}
        {showEdit && (
          <Button variant="outline" size="sm" onClick={handleEditClick} className="border-primary/50 text-primary hover:bg-primary/10">
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
