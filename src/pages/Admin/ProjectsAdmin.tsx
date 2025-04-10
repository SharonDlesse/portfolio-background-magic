
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ProjectForm from '@/components/ProjectForm';
import { toast } from 'sonner';

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  useEffect(() => {
    // Load projects from localStorage on component mount
    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (error) {
        console.error('Error loading projects:', error);
        toast.error('Failed to load projects');
      }
    }
  }, []);

  const handleCreateProject = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    // Check if we're editing an existing project or adding a new one
    const updatedProjects = editingProject 
      ? projects.map(p => p.id === project.id ? project : p)
      : [...projects, project];
    
    // Save to localStorage
    setProjects(updatedProjects);
    localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
    
    toast.success(editingProject ? 'Project updated successfully' : 'Project created successfully');
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
      toast.success('Project deleted successfully');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Projects</h1>
          <Button onClick={handleCreateProject} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">You haven't added any projects yet</p>
            <Button onClick={handleCreateProject} variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={handleEditProject}
                showEdit={true}
              />
            ))}
          </div>
        )}

        <ProjectForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          project={editingProject}
          onSave={handleSaveProject}
        />
      </div>
    </AdminLayout>
  );
};

export default ProjectsAdmin;
