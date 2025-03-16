
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Edit, Video } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
};

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card 
      className="overflow-hidden backdrop-blur-sm bg-white/70 hover:bg-white/80 dark:bg-slate-900/70 dark:hover:bg-slate-900/80 transition-all hover:-translate-y-1 border border-slate-200/50 dark:border-slate-800/50 cursor-pointer"
      onClick={handleCardClick}
    >
      <AspectRatio ratio={16 / 9}>
        {project.imageUrl ? (
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-slate-200 dark:bg-slate-800">
            <span className="text-sm text-slate-500 dark:text-slate-400">No image available</span>
          </div>
        )}
      </AspectRatio>
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
