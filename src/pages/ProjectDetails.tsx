import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Project } from '@/components/ProjectCard';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronLeft, Edit, ExternalLink, Github, Video, Upload, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Users, Calendar, Layers, FileText, LightbulbIcon, Wrench, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ProjectForm from '@/components/ProjectForm';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
const ProjectDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [imagePosition, setImagePosition] = useState({
    x: 0,
    y: 0
  });
  const {
    isAdmin
  } = useAuth();
  useEffect(() => {
    const loadProject = () => {
      const savedProjects = localStorage.getItem('portfolioProjects');
      if (savedProjects && id) {
        try {
          const projects: Project[] = JSON.parse(savedProjects);
          const foundProject = projects.find(p => p.id === id);
          if (foundProject) {
            const enhancedProject = {
              ...foundProject,
              clientProblem: foundProject.clientProblem || "This project addressed specific client challenges that required innovative solutions.",
              solution: foundProject.solution || "A comprehensive solution was developed to meet the client's needs and objectives.",
              businessImpact: foundProject.businessImpact || "The implementation delivered measurable business value and positive outcomes for the client.",
              overview: foundProject.overview || foundProject.description,
              client: foundProject.client || "Various clients",
              year: foundProject.year || "Recent",
              category: foundProject.category || "Project",
              detailedDescription: foundProject.detailedDescription || foundProject.description
            };
            setProject(enhancedProject);
            setImagePosition(enhancedProject.imagePosition || {
              x: 0,
              y: 0
            });
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
    const savedProjects = localStorage.getItem('portfolioProjects');
    if (savedProjects) {
      try {
        const projects: Project[] = JSON.parse(savedProjects);
        let projectToSave = {
          ...updatedProject
        };
        if (project && projectToSave.imageUrl?.startsWith('blob:') && !project.imageUrl?.startsWith('blob:')) {
          projectToSave.imageUrl = project.imageUrl;
        }
        const updatedProjects = projects.map(p => p.id === projectToSave.id ? projectToSave : p);
        localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
        setProject(projectToSave);
        toast.success("Project updated successfully");
      } catch (error) {
        console.error('Error updating project:', error);
        toast.error("Error updating project");
      }
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && project) {
      const file = e.target.files[0];
      try {
        const imageData = await fileToBase64(file);
        const blobUrl = URL.createObjectURL(file);
        setTempImage(blobUrl);
        const updatedProject = {
          ...project,
          imageUrl: blobUrl,
          imageData: imageData
        };
        handleSaveProject(updatedProject);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error("Error uploading image");
      }
    }
  };
  const handleZoomIn = () => {
    setIsImageZoomed(true);
  };
  const handleZoomOut = () => {
    setIsImageZoomed(false);
  };
  const handleToggleRepositioning = () => {
    setIsRepositioning(!isRepositioning);
  };
  const handleRepositionImage = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!project) return;
    const step = 10;
    let newPosition = {
      ...imagePosition
    };
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
    setImagePosition(newPosition);
    const updatedProject = {
      ...project,
      imagePosition: newPosition
    };
    handleSaveProject(updatedProject);
  };
  if (isLoading) {
    return <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-lg">Loading project details...</div>
        </div>
      </Layout>;
  }
  if (!project) {
    return <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Button onClick={() => navigate('/projects')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </Layout>;
  }
  return <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
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
              <BreadcrumbPage>{project?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Card className="overflow-hidden">
              <div className="relative">
                <AspectRatio ratio={16 / 9} className="overflow-hidden">
                  {tempImage || project?.imageData || project?.imageUrl ? <img src={tempImage || project?.imageData || project?.imageUrl} alt={project?.title} className={`object-cover w-full h-full transition-transform duration-300 ${isImageZoomed ? 'scale-150' : 'scale-100'}`} style={{
                  objectPosition: `${50 + imagePosition.x}% ${50 + imagePosition.y}%`
                }} /> : <div className="flex items-center justify-center w-full h-full bg-slate-200 dark:bg-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">No image available</span>
                    </div>}
                </AspectRatio>
                
                {isAdmin && <div className="absolute bottom-4 right-4 flex gap-2">
                    {(tempImage || project?.imageData || project?.imageUrl) && <>
                        <Button variant="secondary" size="sm" className="bg-black/70 hover:bg-black/80 text-white rounded-md backdrop-blur-sm" onClick={handleToggleRepositioning}>
                          <ArrowLeft className="h-4 w-4 mr-1" /> {isRepositioning ? 'Done' : 'Reposition'}
                        </Button>
                        <Button variant="secondary" size="sm" className="bg-black/70 hover:bg-black/80 text-white rounded-md backdrop-blur-sm" onClick={handleZoomIn} disabled={isImageZoomed}>
                          <ZoomIn className="h-4 w-4 mr-1" /> Zoom In
                        </Button>
                        <Button variant="secondary" size="sm" className="bg-black/70 hover:bg-black/80 text-white rounded-md backdrop-blur-sm" onClick={handleZoomOut} disabled={!isImageZoomed}>
                          <ZoomOut className="h-4 w-4 mr-1" /> Zoom Out
                        </Button>
                      </>}
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 bg-black/70 hover:bg-black/80 text-white px-3 py-2 rounded-md transition-colors">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">Upload Image</span>
                      </div>
                      <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>}

                {isRepositioning && (tempImage || project?.imageData || project?.imageUrl) && isAdmin && <div className="absolute top-4 right-4 flex flex-col gap-1 p-2 bg-black/70 backdrop-blur-sm rounded-lg">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => handleRepositionImage('up')}>
                      <ArrowUp className="h-4 w-4 mr-1" /> Up
                    </Button>
                    <div className="flex gap-2 justify-center">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => handleRepositionImage('left')}>
                        <ArrowLeft className="h-4 w-4 mr-1" /> Left
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => handleRepositionImage('right')}>
                        <ArrowRight className="h-4 w-4 mr-1" /> Right
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => handleRepositionImage('down')}>
                      <ArrowDown className="h-4 w-4 mr-1" /> Down
                    </Button>
                  </div>}
              </div>
              <CardContent className="p-6 bg-sky-100">
                <h1 className="text-3xl font-bold mb-6">{project?.title}</h1>
                
                {(project?.client || project?.year || project?.category) && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    {project?.client && <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-blue-600">Client</p>
                          <p className="font-medium">{project.client}</p>
                        </div>
                      </div>}
                    
                    {project?.year && <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-blue-600">Year</p>
                          <p className="font-medium">{project.year}</p>
                        </div>
                      </div>}
                    
                    {project?.category && <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-blue-600">Category</p>
                          <p className="font-medium">{project.category}</p>
                        </div>
                      </div>}
                  </div>}
                
                <Tabs defaultValue="overview" className="mb-8">
                  <TabsList className="w-full justify-start mb-4 bg-sky-100">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="business" className="text-rose-600 bg-sky-100">Business Value</TabsTrigger>
                    {project?.detailedDescription && <TabsTrigger value="detailed">Detailed Info</TabsTrigger>}
                    {project?.attributes && project?.attributes.length > 0 && <TabsTrigger value="attributes">Attributes</TabsTrigger>}
                    {project?.videoUrl && <TabsTrigger value="video">Video</TabsTrigger>}
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-0">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line text-base">
                        {project?.overview || project?.description}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="business" className="mt-0">
                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                      <div>
                        <h3 className="flex items-center gap-2 text-xl font-medium mb-2">
                          <LightbulbIcon className="h-5 w-5 text-primary" />
                          Client's Problem
                        </h3>
                        <div className="whitespace-pre-line text-base">
                          {project.clientProblem}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 text-xl font-medium mb-2">
                          <Wrench className="h-5 w-5 text-primary" />
                          My Solution
                        </h3>
                        <div className="whitespace-pre-line text-base">
                          {project.solution}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 text-xl font-medium mb-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Impact on Business Value
                        </h3>
                        <div className="whitespace-pre-line text-base">
                          {project.businessImpact}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="detailed" className="mt-0">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line text-base">
                        {project?.detailedDescription}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="attributes" className="mt-0">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <ul className="list-disc pl-6 space-y-2">
                        {project?.attributes?.map((attribute, index) => <li key={index} className="text-base">{attribute}</li>)}
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="video" className="mt-0">
                    {project?.videoUrl ? <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
                        <iframe src={project.videoUrl} className="absolute top-0 left-0 w-full h-full" allowFullScreen title={`Video for ${project.title}`} />
                      </div> : <p className="text-muted-foreground">No video available for this project.</p>}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {project?.videoUrl && <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Project Video</h2>
                  <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
                    <iframe src={project.videoUrl} className="absolute top-0 left-0 w-full h-full" allowFullScreen title={`Video for ${project.title}`} />
                  </div>
                </CardContent>
              </Card>}
          </div>

          <div className="lg:col-span-4">
            <div className="backdrop-blur-sm rounded-lg p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 sticky top-6 bg-sky-100">
              <h2 className="text-xl font-bold mb-4">Project Info</h2>
              
              <div className="mb-6">
                {isAdmin && <Button onClick={handleEdit} className="w-full mb-4">
                    <Edit className="h-4 w-4 mr-2" /> Edit Project
                  </Button>}
                
                {project?.liveUrl && <Button variant="outline" className="w-full mb-2" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> View Live Demo
                    </a>
                  </Button>}
                
                {project?.repoUrl && <Button variant="outline" className="w-full mb-2" asChild>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" /> View Repository
                    </a>
                  </Button>}
                
                {project?.videoUrl && <Button variant="outline" className="w-full mb-2" asChild>
                    <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4 mr-2" /> Watch Video
                    </a>
                  </Button>}
              </div>
              
              {(project?.clientProblem || project?.solution || project?.businessImpact) && <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Business Value</h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 rounded-md bg-zinc-100">
                      <span className="font-medium">Problem:</span> {project.clientProblem.substring(0, 60)}...
                    </div>
                    <div className="p-2 rounded-md bg-gray-50">
                      <span className="font-medium">Solution:</span> {project.solution.substring(0, 60)}...
                    </div>
                    <div className="p-2 rounded-md bg-gray-50">
                      <span className="font-medium">Impact:</span> {project.businessImpact.substring(0, 60)}...
                    </div>
                  </div>
                </div>}
              
              {project?.categories && project?.categories.length > 0 && <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {project?.categories.map((category, index) => <span key={index} className="text-sm px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground dark:bg-secondary/30">
                        {category}
                      </span>)}
                  </div>
                </div>}
              
              {project?.tags && project?.tags.length > 0 && <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project?.tags.map((tag, index) => <span key={index} className="text-sm px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-blue-700">
                        {tag}
                      </span>)}
                  </div>
                </div>}
              
              {project?.attributes && project?.attributes.length > 0 && <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Attributes</h3>
                  <div className="flex flex-col gap-2">
                    {project?.attributes.map((attribute, index) => <span key={index} className="text-sm px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                        {attribute}
                      </span>)}
                  </div>
                </div>}
              
              {project?.additionalLinks && project?.additionalLinks.length > 0 && <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Additional Resources</h3>
                  <ul className="space-y-2">
                    {project?.additionalLinks.map((link, index) => <li key={index}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          {link.title}
                        </a>
                      </li>)}
                  </ul>
                </div>}
              
              <Button variant="outline" onClick={() => navigate('/projects')} className="w-full text-sky-600">
                <ChevronLeft className="h-4 w-4 mr-2" /> Back to Projects
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isAdmin && <ProjectForm open={isFormOpen} onOpenChange={setIsFormOpen} project={project ?? undefined} onSave={handleSaveProject} />}
    </Layout>;
};
export default ProjectDetails;
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    reader.readAsDataURL(file);
  });
}