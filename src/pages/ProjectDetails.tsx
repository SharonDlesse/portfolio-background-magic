
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Project } from '@/components/ProjectCard';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { ChevronLeft, Edit, ExternalLink, Github, Video } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ProjectForm from '@/components/ProjectForm';
import { toast } from 'sonner';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const loadProject = () => {
      const savedProjects = localStorage.getItem('portfolioProjects');
      if (savedProjects) {
        try {
          const projects: Project[] = JSON.parse(savedProjects);
          const foundProject = projects.find(p => p.id === id);
          if (foundProject) {
            setProject(foundProject);
          } else {
            toast.error("Project not found");
            navigate('/projects');
          }
        } catch (error) {
          console.error('Error parsing saved projects:', error);
          toast.error("Error loading project");
          navigate('/projects');
        }
      } else {
        toast.error("No projects found");
        navigate('/projects');
      }
      setIsLoading(false);
    };

    loadProject();
  }, [id, navigate]);

  const handleEdit = () => {
    if (project) {
      setIsFormOpen(true);
    }
  };

  const handleSaveProject = (updatedProject: Project) => {
    // Update project in localStorage
    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
      try {
        const projects: Project[] = JSON.parse(savedProjects);
        const updatedProjects = projects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        );
        localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
        setProject(updatedProject);
        toast.success("Project updated successfully");
      } catch (error) {
        console.error('Error updating project:', error);
        toast.error("Error updating project");
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-lg">Loading project details...</div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Button onClick={() => navigate('/projects')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 animate-fade-in">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AspectRatio ratio={16 / 9} className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="object-cover w-full h-full" 
              />
            </AspectRatio>

            {project.videoUrl && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Project Video</h3>
                <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
                  <iframe 
                    src={project.videoUrl} 
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    title={`Video for ${project.title}`}
                  />
                </div>
              </div>
            )}

            <Tabs defaultValue="description" className="mb-8">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                {project.detailedDescription && (
                  <TabsTrigger value="detailed">Detailed Info</TabsTrigger>
                )}
                {project.attributes && project.attributes.length > 0 && (
                  <TabsTrigger value="attributes">Attributes</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="description" className="mt-0">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                  <p className="text-lg mb-6">{project.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="detailed" className="mt-0">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Project Details</h2>
                  <div className="whitespace-pre-line">
                    {project.detailedDescription}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="attributes" className="mt-0">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Project Attributes</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    {project.attributes?.map((attribute, index) => (
                      <li key={index}>{attribute}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Project Info</h2>
              
              <div className="mb-6">
                <Button onClick={handleEdit} className="w-full mb-4">
                  <Edit className="h-4 w-4 mr-2" /> Edit Project
                </Button>
                
                {project.liveUrl && (
                  <Button variant="outline" className="w-full mb-2" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> View Live Demo
                    </a>
                  </Button>
                )}
                
                {project.repoUrl && (
                  <Button variant="outline" className="w-full mb-2" asChild>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" /> View Repository
                    </a>
                  </Button>
                )}
                
                {project.videoUrl && (
                  <Button variant="outline" className="w-full mb-2" asChild>
                    <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4 mr-2" /> Watch Video
                    </a>
                  </Button>
                )}
              </div>
              
              {project.tags && project.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary-foreground dark:bg-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {project.categories && project.categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.categories.map((category, index) => (
                      <span 
                        key={index}
                        className="text-sm px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground dark:bg-secondary/30"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {project.additionalLinks && project.additionalLinks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Additional Resources</h3>
                  <ul className="space-y-2">
                    {project.additionalLinks.map((link, index) => (
                      <li key={index}>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button variant="outline" className="w-full" onClick={() => navigate('/projects')}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Back to Projects
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ProjectForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        project={project}
        onSave={handleSaveProject}
      />
    </Layout>
  );
};

export default ProjectDetails;
