
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, 
  Eye, 
  Plus, 
  Trash, 
  RotateCw 
} from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '@/components/ProjectCard';
import ProjectForm from '@/components/ProjectForm';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { initialProjects } from '@/data/initialProjects';
import { saveProjectsToStorage, loadProjectsFromStorage, clearOtherStorage } from '@/utils/storageUtils';

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Load projects from localStorage on initial render
  useEffect(() => {
    const loadProjects = () => {
      try {
        // Clear other storage to make room before loading
        clearOtherStorage();
        const loadedProjects = loadProjectsFromStorage(initialProjects);
        setProjects(loadedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects(initialProjects);
        saveProjectsToStorage(initialProjects).catch(err => 
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
    setCurrentProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    toast.success('Project deleted successfully');
  };

  const handleSaveProject = (project: Project) => {
    if (currentProject) {
      setProjects(prev => 
        prev.map(p => {
          if (p.id === project.id) {
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading projects...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Projects</h1>
          <div className="flex gap-2">
            <Button onClick={handleAddProject} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Project
            </Button>
            <Button variant="outline" onClick={handleResetProjects} className="flex items-center gap-1">
              <RotateCw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="w-full">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div className="w-16 h-12 relative rounded overflow-hidden">
                            {(project.imageData || project.imageUrl) ? (
                              <img 
                                src={project.imageData || project.imageUrl} 
                                alt={project.title}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                <span className="text-xs text-slate-500">No image</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>{project.category || '-'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {project.tags?.slice(0, 2).map((tag, index) => (
                              <span 
                                key={index}
                                className="text-xs px-2 py-0.5 bg-primary/10 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags && project.tags.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{project.tags.length - 2} more
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => navigate(`/projects/${project.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditProject(project)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{project.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => handleDeleteProject(project.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden flex flex-col">
                  <div className="relative aspect-video">
                    {(project.imageData || project.imageUrl) ? (
                      <img 
                        src={project.imageData || project.imageUrl} 
                        alt={project.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-500">No image available</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{project.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="font-bold mb-2 truncate">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {project.tags?.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-0.5 bg-primary/10 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
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
