
import React, { useState, useEffect } from 'react';
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
  storePermanentImage,
  generatePlaceholderImage
} from '@/utils/storageUtils';
import { trackSectionVisit } from '@/utils/scormUtils';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { isAdmin } = useAuth();

  // Track page visit for SCORM
  useEffect(() => {
    trackSectionVisit('projects');
  }, []);

  // Load projects from localStorage on initial render
  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Clear other storage to make room before loading
        clearOtherStorage();
        const loadedProjects = await loadProjectsFromStorage(initialProjects);
        
        // Ensure all projects have persistentImageKey and default image settings set
        const projectsWithSettings = loadedProjects.map(project => {
          const updatedProject = { ...project };
          
          // Set default image size if not present
          if (!updatedProject.imageSize) {
            updatedProject.imageSize = { width: 100, height: 100 };
          }
          
          // Set default image position if not present
          if (!updatedProject.imagePosition) {
            updatedProject.imagePosition = { x: 0, y: 0 };
          }
          
          // Replace any external URLs with placeholder images
          if (updatedProject.imageUrl && updatedProject.imageUrl.startsWith('http')) {
            updatedProject.imageData = generatePlaceholderImage(project.id);
            delete updatedProject.imageUrl;
          }
          
          // Ensure image data is stored permanently
          if (updatedProject.imageData && !updatedProject.persistentImageKey) {
            storePermanentImage(project.id, updatedProject.imageData);
            updatedProject.persistentImageKey = project.id;
          }
          
          return updatedProject;
        });
        
        setProjects(projectsWithSettings);
      } catch (error) {
        console.error('Error in loading projects:', error);
        
        // Initialize with default projects, but ensure they have no external URLs
        const processedInitialProjects = initialProjects.map(project => {
          const processedProject = { ...project };
          
          // Add default image settings
          processedProject.imageSize = { width: 100, height: 100 };
          processedProject.imagePosition = { x: 0, y: 0 };
          
          // Replace external URLs with generated placeholders
          if (processedProject.imageUrl && processedProject.imageUrl.startsWith('http')) {
            processedProject.imageData = generatePlaceholderImage(project.id);
            delete processedProject.imageUrl;
            
            // Store the image permanently
            storePermanentImage(project.id, processedProject.imageData);
            processedProject.persistentImageKey = project.id;
          }
          
          return processedProject;
        });
        
        setProjects(processedInitialProjects);
        
        // Save processed projects to storage
        saveProjectsToStorage(processedInitialProjects).catch(err => 
          console.error('Error saving initial projects:', err)
        );
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadProjects();
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && !isLoading && !isSaving) {
      const saveProjects = async () => {
        try {
          setIsSaving(true);
          await saveProjectsToStorage(projects);
        } catch (error) {
          console.error('Error saving projects:', error);
          toast.error('Failed to save all project data due to storage limitations');
        } finally {
          setIsSaving(false);
        }
      };
      
      saveProjects();
    }
  }, [projects, isLoading, isInitialized, isSaving]);

  const handleAddProject = () => {
    setCurrentProject(undefined);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    // Ensure the project has image sizing properties
    const enhancedProject = {
      ...project,
      imageSize: project.imageSize || { width: 100, height: 100 },
      imagePosition: project.imagePosition || { x: 0, y: 0 }
    };
    
    setCurrentProject(enhancedProject);
    setIsFormOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    // Make sure we preserve image data and settings when saving projects
    if (currentProject) {
      setProjects(prev => 
        prev.map(p => {
          if (p.id === project.id) {
            const updatedProject = { ...project };
            
            // Preserve image size settings
            updatedProject.imageSize = project.imageSize || p.imageSize || { width: 100, height: 100 };
            updatedProject.imagePosition = project.imagePosition || p.imagePosition || { x: 0, y: 0 };
            
            // If we have new image data, ensure it's permanently stored
            if (updatedProject.imageData && updatedProject.imageData !== p.imageData) {
              storePermanentImage(project.id, updatedProject.imageData);
              updatedProject.persistentImageKey = project.id;
            } else if (p.persistentImageKey) {
              // Preserve the persistent image key
              updatedProject.persistentImageKey = p.persistentImageKey;
            }
            
            // If we have a blob URL but also have imageData, make sure it's preserved
            if (updatedProject.imageUrl?.startsWith('blob:') && !currentProject.imageUrl?.startsWith('blob:')) {
              updatedProject.imageUrl = currentProject.imageUrl;
            }
            
            // Remove any external URLs to ensure we only use stored images
            if (updatedProject.imageUrl && updatedProject.imageUrl.startsWith('http')) {
              delete updatedProject.imageUrl;
              
              // If we don't have image data, generate a placeholder
              if (!updatedProject.imageData) {
                updatedProject.imageData = generatePlaceholderImage(project.id);
                storePermanentImage(project.id, updatedProject.imageData);
                updatedProject.persistentImageKey = project.id;
              }
            }
            
            return updatedProject;
          }
          return p;
        })
      );
      toast.success('Project updated successfully');
    } else {
      // For new projects, ensure image is permanently stored
      const newProject = { 
        ...project,
        imageSize: { width: 100, height: 100 },
        imagePosition: { x: 0, y: 0 }
      };
      
      // Remove any external URLs
      if (newProject.imageUrl && newProject.imageUrl.startsWith('http')) {
        delete newProject.imageUrl;
        
        // If we don't have image data, generate a placeholder
        if (!newProject.imageData) {
          newProject.imageData = generatePlaceholderImage(project.id);
        }
      }
      
      if (newProject.imageData) {
        storePermanentImage(newProject.id, newProject.imageData);
        newProject.persistentImageKey = newProject.id;
      }
      
      setProjects(prev => [newProject, ...prev]);
      toast.success('Project added successfully');
    }
    
    setIsFormOpen(false);
  };

  const handleResetProjects = () => {
    if (confirm('Are you sure you want to reset all projects to the default examples?')) {
      // Process initial projects to ensure they have permanent images and no external URLs
      const processedInitialProjects = initialProjects.map(project => {
        const processedProject = { 
          ...project,
          imageSize: { width: 100, height: 100 },
          imagePosition: { x: 0, y: 0 }
        };
        
        // Replace external URLs with generated placeholders
        if (processedProject.imageUrl && processedProject.imageUrl.startsWith('http')) {
          processedProject.imageData = generatePlaceholderImage(project.id);
          delete processedProject.imageUrl;
        }
        
        if (processedProject.imageData) {
          storePermanentImage(project.id, processedProject.imageData);
          processedProject.persistentImageKey = project.id;
        }
        
        return processedProject;
      });
      
      setProjects(processedInitialProjects);
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
