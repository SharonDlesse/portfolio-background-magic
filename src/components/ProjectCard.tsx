
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-white/70 hover:bg-white/80 dark:bg-slate-900/70 dark:hover:bg-slate-900/80 transition-all hover:-translate-y-1 border border-slate-200/50 dark:border-slate-800/50">
      <AspectRatio ratio={16 / 9}>
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="object-cover w-full h-full"
        />
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
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {project.liveUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          </Button>
        )}
        {project.repoUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <Github className="h-4 w-4" /> Repo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
