import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProjectCard, { Project } from '@/components/ProjectCard';
import ProjectForm from '@/components/ProjectForm';
import { Button } from '@/components/ui/button';
import { Plus, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { initialProjects } from '@/data/initialProjects';
import { saveProjectsToStorage, loadProjectsFromStorage } from '@/utils/storageUtils';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAdmin } = useAuth();

  // Load projects from localStorage on initial render
  useEffect(() => {
    const loadProjects = () => {
      try {
        const loadedProjects = loadProjectsFromStorage(initialProjects);
        setProjects(loadedProjects);
      } catch (error) {
        console.error('Error in loading projects:', error);
        setProjects(initialProjects);
        
        // Initialize with default projects
        saveProjectsToStorage(initialProjects);
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
      saveProjectsToStorage(projects);
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
            {isAdmin && (
              <div className="flex gap-2">
                <Button onClick={handleAddProject} className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add Project
                </Button>
                <Button variant="outline" onClick={handleResetProjects} className="flex items-center gap-1">
                  <RotateCw className="h-4 w-4" /> Reset
                </Button>
              </div>
            )}
          </div>
          <p className="text-muted-foreground mt-3">A collection of my work, from web applications to UI designs</p>
        </header>
        
        {isLoading ? (
          <div className="text-center py-12">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={project.id} className="animate-fade-up" style={{animationDelay: `${index * 0.1}s`}}>
                <ProjectCard 
                  project={project} 
                  onEdit={handleEditProject} 
                  showEdit={isAdmin}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {isAdmin && (
        <ProjectForm 
          open={isFormOpen} 
          onOpenChange={setIsFormOpen}
          project={currentProject}
          onSave={handleSaveProject}
        />
      )}
    </Layout>
  );
};

export default Projects;
