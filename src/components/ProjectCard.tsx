
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize, Minimize, RotateCcw } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useState } from 'react';

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
  additionalLinks?: { title: string; url: string }[];
  categories?: string[];
  attributes?: string[];
  detailedDescription?: string;
  imagePosition?: { x: number; y: number };
  imageSize?: { width: number; height: number }; // New property for image size
  client?: string;
  year?: string;
  category?: string;
  overview?: string;
  clientProblem?: string;
  solution?: string;
  businessImpact?: string;
  imageStoredExternally?: boolean; // Flag for external storage
  persistentImageKey?: string; // Key to retrieve image from localStorage
};

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  showEdit?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, showEdit = false }) => {
  const navigate = useNavigate();
  const [isZoomed, setIsZoomed] = useState(false);
  const [imagePosition, setImagePosition] = useState(project.imagePosition || { x: 0, y: 0 });
  const [imageSize, setImageSize] = useState(project.imageSize || { width: 100, height: 100 });
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Use persistentImageKey to retrieve saved image if available
  const getPersistentImage = () => {
    if (project.persistentImageKey) {
      const savedImage = localStorage.getItem(`project_image_${project.persistentImageKey}`);
      if (savedImage) {
        return savedImage;
      }
    }
    return project.imageData || project.imageUrl;
  };

  // Get image source with fallback chain
  const imageSource = getPersistentImage();

  // Ensure project has all necessary fields with default values
  const enhancedProject = {
    ...project,
    overview: project.overview || project.description || "No overview provided for this project.",
    clientProblem: project.clientProblem || "This project addressed specific client challenges that required innovative solutions.",
    solution: project.solution || "A comprehensive solution was developed to meet the client's needs and objectives.",
    businessImpact: project.businessImpact || "The implementation delivered measurable business value and positive outcomes for the client.",
    client: project.client || "Various clients",
    year: project.year || "Recent",
    category: project.category || "Project",
    imagePosition: imagePosition,
    imageSize: imageSize
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
    if (isResizing) setIsResizing(false);
  };

  const handleToggleResizing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(!isResizing);
    if (isRepositioning) setIsRepositioning(false);
  };

  const handleRepositionImage = (direction: 'up' | 'down' | 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    
    const step = 10;
    let newPosition = { ...imagePosition };
    
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
    saveImageSettings(newPosition, imageSize);
  };

  const handleResizeImage = (dimension: 'width' | 'height', value: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    let newSize = { ...imageSize };
    newSize[dimension] = value;
    
    setImageSize(newSize);
    saveImageSettings(imagePosition, newSize);
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultPosition = { x: 0, y: 0 };
    const defaultSize = { width: 100, height: 100 };
    setImagePosition(defaultPosition);
    setImageSize(defaultSize);
    saveImageSettings(defaultPosition, defaultSize);
  };

  const saveImageSettings = (position: {x: number, y: number}, size: {width: number, height: number}) => {
    // Update project in localStorage with position and ensure image persistence
    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
      const projects: Project[] = JSON.parse(savedProjects);
      const updatedProjects = projects.map(p => 
        p.id === project.id ? { 
          ...p, 
          imagePosition: position,
          imageSize: size,
          // Ensure we're saving any persistentImageKey
          persistentImageKey: p.persistentImageKey || p.id
        } : p
      );
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
    }
  };

  return (
    <Card 
      className="overflow-hidden backdrop-blur-sm bg-white/70 hover:bg-white/80 dark:bg-slate-900/70 dark:hover:bg-slate-900/80 transition-all hover:-translate-y-1 border border-slate-200/50 dark:border-slate-800/50 cursor-pointer flex flex-col h-full"
      onClick={handleCardClick}
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {imageSource ? (
            <div className="w-full h-full overflow-hidden">
              <img 
                src={imageSource} 
                alt={project.title} 
                className={`object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                style={{ 
                  objectPosition: `${50 + imagePosition.x}% ${50 + imagePosition.y}%`,
                  width: `${imageSize.width}%`,
                  height: `${imageSize.height}%`,
                  marginLeft: `${(100 - imageSize.width) / 2}%`,
                  marginTop: `${(100 - imageSize.height) / 2}%`
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-slate-200 dark:bg-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400">No image available</span>
            </div>
          )}
        </AspectRatio>
        
        {/* Image controls */}
        {imageSource && showEdit && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
              onClick={handleToggleRepositioning}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
              onClick={handleToggleResizing}
            >
              {isResizing ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
              onClick={handleResetImage}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
              onClick={handleZoomIn}
              disabled={isZoomed}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
              onClick={handleZoomOut}
              disabled={!isZoomed}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Image repositioning controls */}
        {isRepositioning && imageSource && showEdit && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 p-1 bg-black/60 backdrop-blur-sm rounded-lg">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => handleRepositionImage('up', e)}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={(e) => handleRepositionImage('left', e)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={(e) => handleRepositionImage('right', e)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => handleRepositionImage('down', e)}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Image resizing controls */}
        {isResizing && imageSource && showEdit && (
          <div className="absolute top-2 left-2 p-2 bg-black/60 backdrop-blur-sm rounded-lg w-48">
            <div className="text-white text-xs mb-2">Width: {imageSize.width}%</div>
            <div className="mb-3">
              <input 
                type="range" 
                min="50" 
                max="150" 
                value={imageSize.width} 
                onChange={(e) => handleResizeImage('width', parseInt(e.target.value), e as unknown as React.MouseEvent)}
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="text-white text-xs mb-2">Height: {imageSize.height}%</div>
            <div>
              <input 
                type="range" 
                min="50" 
                max="150" 
                value={imageSize.height} 
                onChange={(e) => handleResizeImage('height', parseInt(e.target.value), e as unknown as React.MouseEvent)}
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-1">{enhancedProject.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-muted-foreground line-clamp-3">{enhancedProject.description}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto">
        {showEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(enhancedProject);
            }}
            className="ml-auto"
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
