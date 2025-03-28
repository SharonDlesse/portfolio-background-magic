import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, showEdit = false }) => {
  const navigate = useNavigate();
  const [isZoomed, setIsZoomed] = useState(false);
  const [imagePosition, setImagePosition] = useState(project.imagePosition || { x: 0, y: 0 });
  const [isRepositioning, setIsRepositioning] = useState(false);

  const imageSource = project.imageData || project.imageUrl;

  const enhancedProject = {
    ...project,
    overview: project.overview || project.description || "No overview provided for this project.",
    clientProblem: project.clientProblem || "This project addressed specific client challenges that required innovative solutions.",
    solution: project.solution || "A comprehensive solution was developed to meet the client's needs and objectives.",
    businessImpact: project.businessImpact || "The implementation delivered measurable business value and positive outcomes for the client.",
    client: project.client || "Various clients",
    year: project.year || "Recent",
    category: project.category || "Project"
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
    
    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
      const projects: Project[] = JSON.parse(savedProjects);
      const updatedProjects = projects.map(p => 
        p.id === project.id ? { ...p, imagePosition: newPosition } : p
      );
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
    }
  };

  return (
    <Card 
      className="overflow-hidden bg-card border-2 border-primary/50 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
      onClick={handleCardClick}
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {imageSource ? (
            <div className="w-full h-full overflow-hidden">
              <img 
                src={imageSource} 
                alt={project.title} 
                className={`object-cover w-full h-full transition-transform duration-300 
                  ${isZoomed ? 'scale-150' : 'scale-100'} 
                  grayscale hover:grayscale-0 transition-all`}
                style={{ 
                  objectPosition: `${50 + imagePosition.x}% ${50 + imagePosition.y}%` 
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
              <span className="text-sm">No image available</span>
            </div>
          )}
        </AspectRatio>
        
        {imageSource && showEdit && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-white/70 hover:bg-white/90 text-black rounded-full backdrop-blur-sm"
              onClick={handleToggleRepositioning}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-white/70 hover:bg-white/90 text-black rounded-full backdrop-blur-sm"
              onClick={handleZoomIn}
              disabled={isZoomed}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-white/70 hover:bg-white/90 text-black rounded-full backdrop-blur-sm"
              onClick={handleZoomOut}
              disabled={!isZoomed}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {isRepositioning && imageSource && showEdit && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 p-1 bg-white/70 backdrop-blur-sm rounded-lg">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-black hover:bg-white/20"
              onClick={(e) => handleRepositionImage('up', e)}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-black hover:bg-white/20"
                onClick={(e) => handleRepositionImage('left', e)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-black hover:bg-white/20"
                onClick={(e) => handleRepositionImage('right', e)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-black hover:bg-white/20"
              onClick={(e) => handleRepositionImage('down', e)}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-1 text-primary text-xl font-bold">{enhancedProject.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-card-foreground line-clamp-3 text-sm">{enhancedProject.description}</p>
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
            className="ml-auto border-primary text-primary hover:bg-primary/10"
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
