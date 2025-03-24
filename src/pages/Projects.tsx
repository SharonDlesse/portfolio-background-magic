
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProjectCard, { Project } from '@/components/ProjectCard';
import ProjectForm from '@/components/ProjectForm';
import { Button } from '@/components/ui/button';
import { Plus, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

// Initial projects data (will be replaced by local storage data if available)
const initialProjects: Project[] = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    description: 'A fully responsive e-commerce platform built with React, Node.js, and MongoDB. Includes user authentication, product search, shopping cart, and payment processing.',
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/ecommerce',
    client: 'Fashion Retailer',
    year: '2023',
    category: 'Web Development',
    clientProblem: 'The client needed a modern e-commerce platform to replace their outdated system, which was causing lost sales and customer frustration.',
    solution: 'I developed a custom e-commerce solution with improved UX, mobile responsiveness, and integrated payment processing.',
    businessImpact: 'Online sales increased by 45% within the first quarter after launch, with a 30% reduction in cart abandonment rates.'
  },
  {
    id: 'project-2',
    title: 'Task Management App',
    description: 'A Kanban-style task management application. Users can create, assign, and track tasks through different stages of completion.',
    imageUrl: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91',
    tags: ['React', 'TypeScript', 'Firebase'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/taskmanager'
  },
  {
    id: 'project-3',
    title: 'Weather Dashboard',
    description: 'A weather dashboard that displays current weather conditions and forecasts for multiple locations using the OpenWeatherMap API.',
    imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b',
    tags: ['JavaScript', 'API', 'CSS'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/weather'
  },
  {
    id: 'project-4',
    title: 'Personal Finance Tracker',
    description: 'An application to track personal finances, including income, expenses, and investments. Features include budgeting, reports, and goal tracking.',
    imageUrl: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6',
    tags: ['React', 'Chart.js', 'Firebase'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/finance'
  },
  {
    id: 'project-5',
    title: 'Recipe Sharing Platform',
    description: 'A community-driven recipe sharing platform where users can post, search, and save recipes. Includes features like ratings, comments, and ingredient-based search.',
    imageUrl: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf',
    tags: ['Vue.js', 'Node.js', 'PostgreSQL'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/recipes'
  },
  {
    id: 'project-6',
    title: 'Travel Blog',
    description: 'A blog for travel enthusiasts to share their adventures. Features include rich text editing, image galleries, and interactive maps.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    tags: ['WordPress', 'PHP', 'MySQL'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/example/travelblog'
  },
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load projects from localStorage on initial render
  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjects = localStorage.getItem('portfolioProjects');
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects);
          if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
            // Process projects to ensure images are handled properly
            const processedProjects = parsedProjects.map(project => {
              // If a project has imageData but no valid imageUrl, we'll rely on imageData
              if (project.imageData && (!project.imageUrl || project.imageUrl.startsWith('blob:'))) {
                // The ProjectCard component will use imageData instead
              }
              return project;
            });
            setProjects(processedProjects);
          } else {
            setProjects(initialProjects);
            localStorage.setItem('portfolioProjects', JSON.stringify(initialProjects));
          }
        } else {
          setProjects(initialProjects);
          localStorage.setItem('portfolioProjects', JSON.stringify(initialProjects));
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects(initialProjects);
        localStorage.setItem('portfolioProjects', JSON.stringify(initialProjects));
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadProjects();
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && !isLoading) {
      localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    }
  }, [projects, isLoading, isInitialized]);

  const handleAddProject = () => {
    setCurrentProject(undefined);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setIsFormOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    // Make sure we preserve image data when saving projects
    if (currentProject) {
      setProjects(prev => 
        prev.map(p => {
          if (p.id === project.id) {
            // If we have a blob URL but also have imageData, make sure it's preserved
            if (project.imageUrl?.startsWith('blob:') && !currentProject.imageUrl?.startsWith('blob:')) {
              project.imageUrl = currentProject.imageUrl;
            }
            return project;
          }
          return p;
        })
      );
      toast.success('Project updated successfully');
    } else {
      setProjects(prev => [project, ...prev]);
      toast.success('Project added successfully');
    }
  };

  const handleResetProjects = () => {
    if (confirm('Are you sure you want to reset all projects to the default examples?')) {
      setProjects(initialProjects);
      toast.success('Projects have been reset to defaults');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 p-6 rounded-lg animate-fade-up">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">My Projects</h1>
            <div className="flex gap-2">
              <Button onClick={handleAddProject} className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Project
              </Button>
              <Button variant="outline" onClick={handleResetProjects} className="flex items-center gap-1">
                <RotateCw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground mt-3">A collection of my work, from web applications to UI designs</p>
        </header>
        
        {isLoading ? (
          <div className="text-center py-12">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={project.id} className="animate-fade-up" style={{animationDelay: `${index * 0.1}s`}}>
                <ProjectCard project={project} onEdit={handleEditProject} />
              </div>
            ))}
          </div>
        )}
      </div>

      <ProjectForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        project={currentProject}
        onSave={handleSaveProject}
      />
    </Layout>
  );
};

export default Projects;
