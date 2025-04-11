
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus } from 'lucide-react';
import { Project } from '@/types/project';
import { fileToBase64 } from '@/contexts/BackgroundContext';
import GithubImageBrowser from './GithubImageBrowser';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  onSave: (project: Project) => void;
}

const defaultProject: Project = {
  id: '',
  title: '',
  description: '',
  imageUrl: '',
  tags: [],
  additionalLinks: [],
  categories: [],
  attributes: [],
  detailedDescription: '',
  imagePosition: { x: 0, y: 0 },
  client: '',
  year: '',
  category: '',
  overview: '',
  clientProblem: '',
  solution: '',
  businessImpact: '',
  isFeatured: false,
};

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  open, 
  onOpenChange,
  project,
  onSave
}) => {
  const [formData, setFormData] = React.useState<Project>(project || {...defaultProject, id: crypto.randomUUID()});
  const [tagInput, setTagInput] = React.useState('');
  const [categoryInput, setCategoryInput] = React.useState('');
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const [useGithubImage, setUseGithubImage] = React.useState(false);
  const [activeTabMedia, setActiveTabMedia] = React.useState<string>("upload");
  const { refreshSession } = useAuth();
  
  useEffect(() => {
    let keepAliveInterval: number | null = null;
    
    if (open) {
      refreshSession();
      
      keepAliveInterval = window.setInterval(() => {
        console.log('Keeping form session active...');
        refreshSession();
      }, 60000);
    }
    
    return () => {
      if (keepAliveInterval) {
        window.clearInterval(keepAliveInterval);
      }
    };
  }, [open, refreshSession]);
  
  React.useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({...defaultProject, id: crypto.randomUUID()});
    }
    setVideoFile(null);
  }, [project, open]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'overview') {
      const firstParagraph = value.split('\n')[0].trim();
      if (firstParagraph) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          description: firstParagraph.length > 150 ? firstParagraph.substring(0, 147) + '...' : firstParagraph
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      try {
        const imageData = await fileToBase64(file);
        const imageUrl = URL.createObjectURL(file);
        
        setFormData(prev => ({ 
          ...prev, 
          imageUrl,
          imageData
        }));
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  const handleGithubImageSelect = (imageUrl: string) => {
    setFormData(prev => ({ 
      ...prev, 
      imageUrl,
      imageData: undefined
    }));
    setUseGithubImage(false);
    setActiveTabMedia("upload");
    toast.success("GitHub image selected successfully");
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      
      const videoUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, videoUrl }));
    }
  };
  
  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addCategory = () => {
    if (categoryInput.trim()) {
      setFormData(prev => ({
        ...prev,
        categories: [...(prev.categories || []), categoryInput.trim()]
      }));
      setCategoryInput('');
    }
  };
  
  const removeCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories?.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectToSave = { ...formData };
    
    if (projectToSave.imageUrl?.startsWith('blob:') && project?.imageUrl && !project.imageUrl.startsWith('blob:')) {
      projectToSave.imageUrl = project.imageUrl;
    }
    
    if (projectToSave.imageUrl?.startsWith('blob:') && projectToSave.imageData) {
      projectToSave.imageUrl = projectToSave.imageData;
    }
    
    const enhancedProject = {
      ...projectToSave,
      attributes: projectToSave.attributes || [],
      categories: projectToSave.categories || [],
      additionalLinks: projectToSave.additionalLinks || [],
      imagePosition: projectToSave.imagePosition || { x: 0, y: 0 },
      isFeatured: projectToSave.isFeatured
    };
    
    onSave(enhancedProject);
    onOpenChange(false);
  };
  
  const handleMediaTabChange = (tab: string) => {
    setActiveTabMedia(tab);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="main" className="mt-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="main">Essential Info</TabsTrigger>
              <TabsTrigger value="business">Business Value</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="main" className="mt-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="overview">Project Overview *</Label>
                  <Textarea
                    id="overview"
                    name="overview"
                    value={formData.overview || formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Provide an overview of your project. The first paragraph will appear in the project thumbnail."
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The first paragraph will be used as the thumbnail description.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      name="client"
                      value={formData.client || ''}
                      onChange={handleChange}
                      placeholder="Client name"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      value={formData.year || ''}
                      onChange={handleChange}
                      placeholder="e.g., 2023"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Primary Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    placeholder="e.g., Web Development"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tags">Technologies/Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a technology or tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                        <span className="text-xs">{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="categories">Additional Categories</Label>
                  <div className="flex gap-2">
                    <Input
                      id="categories"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      placeholder="Add a category"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCategory();
                        }
                      }}
                    />
                    <Button type="button" onClick={addCategory} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.categories?.map((category, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary/20 px-2 py-1 rounded-full">
                        <span className="text-xs">{category}</span>
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="business" className="mt-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="clientProblem">Client's Problem</Label>
                  <Textarea
                    id="clientProblem"
                    name="clientProblem"
                    value={formData.clientProblem || ''}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the client's problem that your project addressed"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="solution">Your Solution</Label>
                  <Textarea
                    id="solution"
                    name="solution"
                    value={formData.solution || ''}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your solution to the client's problem"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="businessImpact">Business Impact</Label>
                  <Textarea
                    id="businessImpact"
                    name="businessImpact"
                    value={formData.businessImpact || ''}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the impact your solution had on the client's business"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="mt-0">
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <h3 className="font-medium text-sm">Project Image</h3>
                  
                  <Tabs value={activeTabMedia} onValueChange={handleMediaTabChange} className="w-full">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="upload">Upload</TabsTrigger>
                      <TabsTrigger value="github">GitHub Images</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload">
                      <div className="grid gap-2">
                        <Label htmlFor="projectImage">Upload Image</Label>
                        <Input
                          id="projectImage"
                          name="projectImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="github">
                      <div className="border rounded-md">
                        <GithubImageBrowser 
                          onSelectImage={handleGithubImageSelect}
                          defaultTab="browser"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="rounded-md max-h-40 object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid gap-4">
                  <h3 className="font-medium text-sm">Repository Link</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="repoUrl">GitHub Repository URL</Label>
                    <Input
                      id="repoUrl"
                      name="repoUrl"
                      type="url"
                      value={formData.repoUrl || ''}
                      onChange={handleChange}
                      placeholder="https://github.com/your-username/your-repo"
                    />
                  </div>
                </div>
                
                <div className="grid gap-4">
                  <h3 className="font-medium text-sm">Video (Optional)</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="projectVideo">Upload Video</Label>
                    <Input
                      id="projectVideo"
                      name="projectVideo"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                    />
                    
                    {videoFile && (
                      <div className="mt-2">
                        <video 
                          src={formData.videoUrl} 
                          controls
                          className="rounded-md max-h-40 w-full"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
