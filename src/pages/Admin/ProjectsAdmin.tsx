
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types/project';
import ProjectForm from '@/components/ProjectForm';
import { Button } from '@/components/ui/button';
import { Plus, RotateCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { initialProjects } from '@/data/initialProjects';
import { saveProjectsToStorage, loadProjectsFromStorage } from '@/utils/storageUtils';
import { standardizeGithubImageUrl } from '@/utils/imageUrlUtils';

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const {
    refreshSession
  } = useAuth();

  // Use more frequent session refreshing to prevent admin timeout
  useEffect(() => {
    refreshSession();
    
    // Refresh session more frequently
    const intervalId = setInterval(() => {
      console.log('Refreshing admin session...');
      refreshSession();
    }, 30 * 1000); // Every 30 seconds (reduced from 60s)
    
    return () => clearInterval(intervalId);
  }, [refreshSession]);

  // Load projects from storage
  useEffect(() => {
    const loadProjectsData = async () => {
      try {
        const loadedProjects = await loadProjectsFromStorage(initialProjects);
        
        // Standardize all image URLs before setting state
        const standardizedProjects = loadedProjects.map(project => ({
          ...project,
          imageUrl: standardizeGithubImageUrl(project.imageUrl) || project.imageUrl
        }));
        
        setProjects(standardizedProjects);
      } catch (error) {
        console.error('Error in loading projects:', error);
        
        // Standardize default projects if loading fails
        const standardizedDefaultProjects = initialProjects.map(project => ({
          ...project,
          imageUrl: standardizeGithubImageUrl(project.imageUrl) || project.imageUrl
        }));
        
        setProjects(standardizedDefaultProjects);
      } finally {
        setIsLoading(false);
      }
    };
    loadProjectsData();
  }, []);

  // Save projects when they change
  useEffect(() => {
    if (!isLoading && !isSaving && projects.length > 0) {
      const saveProjects = async () => {
        try {
          setIsSaving(true);
          await saveProjectsToStorage(projects);
        } catch (error) {
          console.error('Error saving projects:', error);
          toast.error('Failed to save project data');
        } finally {
          setIsSaving(false);
        }
      };
      saveProjects();
    }
  }, [projects, isLoading, isSaving]);

  const handleAddProject = () => {
    setCurrentProject(undefined);
    setIsFormOpen(true);
  };

  const handleEditProject = useCallback((project: Project) => {
    console.log("Editing project:", project);
    
    // Ensure GitHub URLs are standardized
    const standardizedImageUrl = standardizeGithubImageUrl(project.imageUrl) || project.imageUrl;
    
    const enhancedProject = {
      ...project,
      imageUrl: standardizedImageUrl
    };
    
    setCurrentProject({...enhancedProject});
    setIsFormOpen(true);
  }, []);

  const handleDeleteProject = useCallback((projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        // Filter out the project with the specified ID
        setProjects(prev => prev.filter(p => p.id !== projectId));
        toast.success('Project deleted permanently');
        
        // Force refresh session to prevent timeouts after edits
        refreshSession();
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  }, [refreshSession]);

  const handleSaveProject = useCallback((project: Project) => {
    try {
      // Ensure GitHub URLs are standardized before saving
      const standardizedProject = {
        ...project,
        imageUrl: standardizeGithubImageUrl(project.imageUrl) || project.imageUrl
      };
      
      if (currentProject) {
        setProjects(prev => prev.map(p => {
          if (p.id === standardizedProject.id) {
            return standardizedProject;
          }
          return p;
        }));
        toast.success('Project updated successfully');
      } else {
        setProjects(prev => [standardizedProject, ...prev]);
        toast.success('Project added successfully');
      }

      // Force refresh session to prevent timeouts after edits
      refreshSession();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  }, [currentProject, refreshSession]);

  const handleResetProjects = () => {
    if (confirm('Are you sure you want to reset all projects to the default examples?')) {
      // Standardize image URLs in initial projects
      const standardizedProjects = initialProjects.map(project => ({
        ...project,
        imageUrl: standardizeGithubImageUrl(project.imageUrl) || project.imageUrl
      }));
      setProjects(standardizedProjects);
      toast.success('Projects have been reset to defaults');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8 backdrop-blur-sm p-6 animate-fade-up bg-red-800 rounded-3xl">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-6xl">Projects Manager</h1>
            <div className="flex gap-2">
              <Button onClick={handleAddProject} className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Project
              </Button>
              <Button variant="outline" onClick={handleResetProjects} className="flex items-center gap-1">
                <RotateCw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
          <p className="mt-3 text-red-50 font-extrabold">Manage your portfolio projects</p>
        </header>
        
        {isLoading ? (
          <div className="text-center py-12 bg-inherit">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="animate-fade-up" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <ProjectCard 
                  project={project} 
                  onEdit={handleEditProject} 
                  onDelete={() => handleDeleteProject(project.id)}
                  showEdit={true} 
                  showDelete={true}
                />
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
    </AdminLayout>
  );
};

export default ProjectsAdmin;
