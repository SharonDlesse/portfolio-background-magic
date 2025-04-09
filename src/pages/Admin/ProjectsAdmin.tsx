
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
  RotateCw,
  Star 
} from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '@/components/ProjectCard';
import ProjectForm from '@/components/ProjectForm';
import FeaturedProjectToggle from '@/components/FeaturedProjectToggle';
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
import { useAuth } from '@/contexts/AuthContext';
import { initialProjects } from '@/data/initialProjects';
import { saveProjectsToStorage, loadProjectsFromStorage, clearOtherStorage } from '@/utils/storageUtils';
import { standardizeGithubImageUrl } from '@/utils/imageUrlUtils';

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  useEffect(() => {
    // Refresh session immediately when component mounts
    refreshSession();
    
    const intervalId = setInterval(() => {
      refreshSession();
    }, 60 * 1000); // Every minute for admin pages
    
    return () => clearInterval(intervalId);
  }, [refreshSession]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        clearOtherStorage();
        const loadedProjects = await loadProjectsFromStorage(initialProjects);
        
        // Standardize all image URLs before setting state
        const standardizedProjects = loadedProjects.map(project => ({
          ...project,
          imageUrl: standardizeGithubImageUrl(project.imageUrl) || project.imageUrl
        }));
        
        setProjects(standardizedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        
        // Standardize default projects too
        const standardizedDefaultProjects = initialProjects.map(project => ({
          ...project,
          imageUrl: standardizeGithubImageUrl(project.imageUrl) || project.imageUrl
        }));
        
        setProjects(standardizedDefaultProjects);
        saveProjectsToStorage(standardizedDefaultProjects).catch(err => 
          console.error('Error saving initial projects:', err)
        );
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadProjects();
  }, []);

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
    console.log("Admin: Editing project:", project);
    
    // Ensure GitHub URLs are standardized
    const standardizedImageUrl = standardizeGithubImageUrl(project.imageUrl) || project.imageUrl;
    
    const enhancedProject = {
      ...project,
      imageUrl: standardizedImageUrl,
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
      tags: project.tags || [],
      isFeatured: project.isFeatured || false
    };
    
    setCurrentProject({...enhancedProject});
    setIsFormOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    toast.success('Project deleted successfully');
  };

  const handleToggleFeatured = (projectId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          isFeatured: !project.isFeatured
        };
      }
      return project;
    }));
    toast.success('Featured status updated successfully');
  };

  const handleSaveProject = (project: Project) => {
    try {
      // Ensure GitHub URLs are standardized before saving
      const standardizedProject = {
        ...project,
        imageUrl: standardizeGithubImageUrl(project.imageUrl) || project.imageUrl
      };
      
      if (currentProject) {
        setProjects(prev => 
          prev.map(p => {
            if (p.id === standardizedProject.id) {
              // Preserve featured status if not changed in form
              if (standardizedProject.isFeatured === undefined) {
                standardizedProject.isFeatured = p.isFeatured;
              }
              
              if (standardizedProject.imageUrl?.startsWith('https://raw.githubusercontent.com') || 
                  standardizedProject.imageUrl?.startsWith('https://github.com')) {
                return standardizedProject;
              }
              
              if (standardizedProject.imageUrl?.startsWith('blob:') && !currentProject.imageUrl?.startsWith('blob:')) {
                standardizedProject.imageUrl = currentProject.imageUrl;
              }
              return standardizedProject;
            }
            return p;
          })
        );
        toast.success('Project updated successfully');
      } else {
        setProjects(prev => [standardizedProject, ...prev]);
        toast.success('Project added successfully');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

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
                      <TableHead>Featured</TableHead>
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
                                src={project.imageData || standardizeGithubImageUrl(project.imageUrl) || project.imageUrl} 
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
                        <TableCell>
                          <FeaturedProjectToggle 
                            isFeatured={project.isFeatured || false} 
                            onToggle={() => handleToggleFeatured(project.id)} 
                          />
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
                    {project.isFeatured && (
                      <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Star className="h-3 w-3 fill-white" />
                        <span className="text-xs font-bold">Featured</span>
                      </div>
                    )}
                    {(project.imageData || project.imageUrl) ? (
                      <img 
                        src={project.imageData || standardizeGithubImageUrl(project.imageUrl) || project.imageUrl} 
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
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {project.tags?.slice(0, 2).map((tag, index) => (
                          <span 
                            key={index}
                            className="text-xs px-2 py-0.5 bg-primary/10 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <FeaturedProjectToggle 
                        isFeatured={project.isFeatured || false} 
                        onToggle={() => handleToggleFeatured(project.id)} 
                      />
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
