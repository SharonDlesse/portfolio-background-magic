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
  Maximize,
  Minimize,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  RotateCcw
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
import { Slider } from "@/components/ui/slider";

import { initialProjects } from '@/data/initialProjects';
import { saveProjectsToStorage, loadProjectsFromStorage, clearOtherStorage } from '@/utils/storageUtils';

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [isImageControlsOpen, setIsImageControlsOpen] = useState(false);
  const [selectedImagePosition, setSelectedImagePosition] = useState({ x: 0, y: 0 });
  const [selectedImageSize, setSelectedImageSize] = useState({ width: 100, height: 100 });
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        clearOtherStorage();
        const loadedProjects = await loadProjectsFromStorage(initialProjects);
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
    const enhancedProject = {
      ...project,
      clientProblem: project.clientProblem || "This project addressed specific client challenges that required innovative solutions.",
      solution: project.solution || "A comprehensive solution was developed to meet the client's needs and objectives.",
      businessImpact: project.businessImpact || "The implementation delivered measurable business value and positive outcomes for the client.",
      overview: project.overview || project.description,
      client: project.client || "Various clients",
      year: project.year || "Recent",
      category: project.category || "Project"
    };
    
    setCurrentProject(enhancedProject);
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

  const handleToggleImageControls = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedImagePosition(project.imagePosition || { x: 0, y: 0 });
      setSelectedImageSize(project.imageSize || { width: 100, height: 100 });
      
      if (activeProject === projectId) {
        setActiveProject(null);
        setIsImageControlsOpen(false);
      } else {
        setActiveProject(projectId);
        setIsImageControlsOpen(true);
      }
    }
  };

  const handleRepositionImage = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!activeProject) return;
    
    const step = 10;
    let newPosition = { ...selectedImagePosition };
    
    switch (direction) {
      case 'up':
        newPosition.y += step;
        break;
      case 'down':
        newPosition.y -= step;
        break;
      case 'left':
        newPosition.x += step;
        break;
      case 'right':
        newPosition.x -= step;
        break;
    }
    
    setSelectedImagePosition(newPosition);
    saveImageSettings(activeProject, newPosition, selectedImageSize);
  };

  const handleResizeImage = (dimension: 'width' | 'height', value: number) => {
    if (!activeProject) return;
    
    let newSize = { ...selectedImageSize };
    newSize[dimension] = value;
    
    setSelectedImageSize(newSize);
    saveImageSettings(activeProject, selectedImagePosition, newSize);
  };

  const handleResetImage = () => {
    if (!activeProject) return;
    
    const defaultPosition = { x: 0, y: 0 };
    const defaultSize = { width: 100, height: 100 };
    
    setSelectedImagePosition(defaultPosition);
    setSelectedImageSize(defaultSize);
    saveImageSettings(activeProject, defaultPosition, defaultSize);
  };

  const saveImageSettings = (projectId: string, position: {x: number, y: number}, size: {width: number, height: number}) => {
    setProjects(prev => 
      prev.map(p => 
        p.id === projectId ? { 
          ...p, 
          imagePosition: position,
          imageSize: size
        } : p
      )
    );
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
                      <React.Fragment key={project.id}>
                        <TableRow>
                          <TableCell>
                            <div className="w-16 h-12 relative rounded overflow-hidden">
                              {(project.imageData || project.imageUrl) ? (
                                <img 
                                  src={project.imageData || project.imageUrl} 
                                  alt={project.title}
                                  className="object-cover"
                                  style={{ 
                                    objectPosition: `${50 + (project.imagePosition?.x || 0)}% ${50 + (project.imagePosition?.y || 0)}%`,
                                    width: `${project.imageSize?.width || 100}%`,
                                    height: `${project.imageSize?.height || 100}%`,
                                    marginLeft: `${(100 - (project.imageSize?.width || 100)) / 2}%`,
                                    marginTop: `${(100 - (project.imageSize?.height || 100)) / 2}%`
                                  }}
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
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleToggleImageControls(project.id)}
                              >
                                <Maximize className="h-4 w-4" />
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
                        {activeProject === project.id && isImageControlsOpen && (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-sm font-medium">Image Controls</h3>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleResetImage}
                                    className="flex items-center gap-1 text-xs"
                                  >
                                    <RotateCcw className="h-3 w-3" /> Reset
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="text-xs font-medium mb-2">Position</h4>
                                    <div className="flex justify-center mb-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRepositionImage('up')}
                                        className="h-8 w-8 p-0"
                                      >
                                        <ArrowUp className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="flex justify-center gap-2 mb-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRepositionImage('left')}
                                        className="h-8 w-8 p-0"
                                      >
                                        <ArrowLeft className="h-4 w-4" />
                                      </Button>
                                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-xs">
                                        {selectedImagePosition.x},{selectedImagePosition.y}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRepositionImage('right')}
                                        className="h-8 w-8 p-0"
                                      >
                                        <ArrowRight className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="flex justify-center">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRepositionImage('down')}
                                        className="h-8 w-8 p-0"
                                      >
                                        <ArrowDown className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <div className="flex justify-between mb-2">
                                        <span className="text-xs font-medium">Width: {selectedImageSize.width}%</span>
                                      </div>
                                      <Slider
                                        defaultValue={[selectedImageSize.width]}
                                        min={50}
                                        max={150}
                                        step={5}
                                        value={[selectedImageSize.width]}
                                        onValueChange={(value) => handleResizeImage('width', value[0])}
                                      />
                                    </div>
                                    <div>
                                      <div className="flex justify-between mb-2">
                                        <span className="text-xs font-medium">Height: {selectedImageSize.height}%</span>
                                      </div>
                                      <Slider
                                        defaultValue={[selectedImageSize.height]}
                                        min={50}
                                        max={150}
                                        step={5}
                                        value={[selectedImageSize.height]}
                                        onValueChange={(value) => handleResizeImage('height', value[0])}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
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
                        className="object-cover"
                        style={{ 
                          objectPosition: `${50 + (project.imagePosition?.x || 0)}% ${50 + (project.imagePosition?.y || 0)}%`,
                          width: `${project.imageSize?.width || 100}%`,
                          height: `${project.imageSize?.height || 100}%`,
                          marginLeft: `${(100 - (project.imageSize?.width || 100)) / 2}%`,
                          marginTop: `${(100 - (project.imageSize?.height || 100)) / 2}%`
                        }}
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
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                        onClick={() => handleToggleImageControls(project.id)}
                      >
                        <Maximize className="h-4 w-4" />
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
                    
                    {activeProject === project.id && isImageControlsOpen && (
                      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xs font-medium">Image Controls</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleResetImage}
                            className="flex items-center gap-1 text-xs h-6"
                          >
                            <RotateCcw className="h-3 w-3" /> Reset
                          </Button>
                        </div>
                        
                        <div className="space-y-2 mb-2">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs">Width: {selectedImageSize.width}%</span>
                            </div>
                            <Slider
                              defaultValue={[selectedImageSize.width]}
                              min={50}
                              max={150}
                              step={5}
                              value={[selectedImageSize.width]}
                              onValueChange={(value) => handleResizeImage('width', value[0])}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs">Height: {selectedImageSize.height}%</span>
                            </div>
                            <Slider
                              defaultValue={[selectedImageSize.height]}
                              min={50}
                              max={150}
                              step={5}
                              value={[selectedImageSize.height]}
                              onValueChange={(value) => handleResizeImage('height', value[0])}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1 text-center">
                          <div></div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRepositionImage('up')}
                            className="h-7 w-7 p-0 mx-auto"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <div></div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRepositionImage('left')}
                            className="h-7 w-7 p-0 mx-auto"
                          >
                            <ArrowLeft className="h-3 w-3" />
                          </Button>
                          <div className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-background text-xs mx-auto">
                            <span className="text-[10px]">{selectedImagePosition.x},{selectedImagePosition.y}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRepositionImage('right')}
                            className="h-7 w-7 p-0 mx-auto"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                          <div></div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRepositionImage('down')}
                            className="h-7 w-7 p-0 mx-auto"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <div></div>
                        </div>
                      </div>
                    )}
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
