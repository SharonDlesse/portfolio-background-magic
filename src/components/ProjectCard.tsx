import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Edit, Video, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useState } from 'react';

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
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
};

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
  const navigate = useNavigate();
  const [isZoomed, setIsZoomed] = useState(false);
  const [imagePosition, setImagePosition] = useState(project.imagePosition || { x: 0, y: 0 });
  const [isRepositioning, setIsRepositioning] = useState(false);

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
    
    // Update project in localStorage
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
      className="overflow-hidden backdrop-blur-sm bg-white/70 hover:bg-white/80 dark:bg-slate-900/70 dark:hover:bg-slate-900/80 transition-all hover:-translate-y-1 border border-slate-200/50 dark:border-slate-800/50 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {project.imageUrl ? (
            <div className="w-full h-full overflow-hidden">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className={`object-cover w-full h-full transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                style={{ 
                  objectPosition: `${50 + imagePosition.x}% ${50 + imagePosition.y}%` 
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-slate-200 dark:bg-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400">No image available</span>
            </div>
          )}
        </AspectRatio>
        {project.imageUrl && (
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
        {isRepositioning && project.imageUrl && (
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
      </div>

      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
        <div className="flex flex-wrap gap-1 mt-2">
          {project.tags.map((tag, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-foreground dark:bg-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="line-clamp-3">{project.description}</CardDescription>
        
        {project.videoUrl && (
          <div className="mt-4">
            <div className="relative pt-[56.25%]">
              <iframe 
                src={project.videoUrl} 
                className="absolute top-0 left-0 w-full h-full rounded-md"
                allowFullScreen
                title={`Video for ${project.title}`}
              />
            </div>
          </div>
        )}
        
        {project.additionalLinks && project.additionalLinks.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Additional Resources:</h4>
            <ul className="space-y-1">
              {project.additionalLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2 flex-wrap">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project);
          }}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        
        {project.videoUrl && (
          <Button variant="outline" size="sm" asChild>
            <a 
              href={project.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Video className="h-4 w-4" /> Watch Video
            </a>
          </Button>
        )}
        
        {project.liveUrl && (
          <Button variant="outline" size="sm" asChild>
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          </Button>
        )}
        
        {project.repoUrl && (
          <Button variant="outline" size="sm" asChild>
            <a 
              href={project.repoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-4 w-4" /> Repo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
