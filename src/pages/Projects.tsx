
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import ProjectCard, { Project } from '@/components/ProjectCard';
import ProjectForm from '@/components/ProjectForm';
import { Button } from '@/components/ui/button';
import { Plus, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { initialProjects } from '@/data/initialProjects';
import { 
  saveProjectsToStorage, 
  loadProjectsFromStorage, 
  clearOtherStorage, 
  optimizeForEnvironment
} from '@/utils/storageUtils';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { isAdmin, refreshSession } = useAuth();

  // Use more frequent session refreshing to prevent admin timeout
  useEffect(() => {
    if (isAdmin) {
      refreshSession();
      
      // Refresh session more frequently (every 1 minute)
      const intervalId = setInterval(() => {
        refreshSession();
      }, 60 * 1000); // Every minute
      
      return () => clearInterval(intervalId);
    }
  }, [isAdmin, refreshSession]);

  // Persistent load of projects data with environment optimization
  useEffect(() => {
    const loadProjects = async () => {
      try {
        // First optimize storage for current environment
        await optimizeForEnvironment();
        
        // Clear non-essential storage to make room
        clearOtherStorage();
        
        // Load projects with our improved loader
        const loadedProjects = await loadProjectsFromStorage(initialProjects);
        
        setProjects(loadedProjects);
        
        // If no projects were loaded and we're in a fresh state, ensure defaults are saved
        if (loadedProjects.length === 0 || loadedProjects === initialProjects) {
          console.log('Ensuring initial projects are properly saved');
          await saveProjectsToStorage(initialProjects);
        }
      } catch (error) {
        console.error('Error in loading projects:', error);
        setProjects(initialProjects);
        
        // Try saving initial projects as fallback
        try {
          await saveProjectsToStorage(initialProjects);
        } catch (err) {
          console.error('Error saving initial projects:', err);
        }
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    loadProjects();
  }, []);

  // Improved saving with error recovery and debouncing
  useEffect(() => {
    if (!isInitialized || isLoading) return;
    
    // Debounce the save operation
    let saveTimeout: number | null = null;
    
    if (!isSaving) {
      saveTimeout = window.setTimeout(async () => {
        try {
          setIsSaving(true);
          await saveProjectsToStorage(projects);
        } catch (error) {
          console.error('Error saving projects:', error);
          toast.error('Failed to save all project data. Some data may be lost.');
        } finally {
          setIsSaving(false);
        }
      }, 1000); // 1 second debounce
    }
    
    return () => {
      if (saveTimeout) window.clearTimeout(saveTimeout);
    };
  }, [projects, isLoading, isInitialized, isSaving]);

  const handleAddProject = () => {
    setCurrentProject(undefined);
    setIsFormOpen(true);
  };

  const handleEditProject = useCallback((project: Project) => {
    // Ensure project has all required fields before editing
    const enhancedProject = {
      ...project,
      clientProblem: project.clientProblem || "This project addressed specific client challenges that required innovative solutions.",
      solution: project.solution || "A comprehensive solution was developed to meet the client's needs and objectives.",
      businessImpact: project.businessImpact || "The implementation delivered measurable business value and positive outcomes for the client.",
      overview: project.overview || project.description,
      description: project.description || "",
      client: project.client || "Various clients",
      year: project.year || "Recent",
      category: project.category || "Project",
      categories: project.categories || [],
      attributes: project.attributes || [],
      additionalLinks: project.additionalLinks || [],
      tags: project.tags || []
    };
    
    setCurrentProject({...enhancedProject});
    setIsFormOpen(true);
    
    // Refresh session when editing to prevent timeouts
    if (isAdmin) {
      refreshSession();
    }
  }, [isAdmin, refreshSession]);

  const handleSaveProject = useCallback((project: Project) => {
    try {
      if (currentProject) {
        setProjects(prev => prev.map(p => p.id === project.id ? project : p));
        toast.success('Project updated successfully');
      } else {
        setProjects(prev => [project, ...prev]);
        toast.success('Project added successfully');
      }

      // Force refresh session to prevent timeouts after edits
      if (isAdmin) {
        refreshSession();
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  }, [currentProject, isAdmin, refreshSession]);

  const handleResetProjects = () => {
    if (confirm('Are you sure you want to reset all projects to the default examples?')) {
      setProjects([...initialProjects]);
      toast.success('Projects have been reset to defaults');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8 backdrop-blur-sm p-6 animate-fade-up bg-red-800 rounded-3xl">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-6xl">My Projects</h1>
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
          <p className="mt-3 text-red-50 font-extrabold">A collection of my work, from web applications to UI designs</p>
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
