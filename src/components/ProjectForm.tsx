import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus } from 'lucide-react';
import { Project } from './ProjectCard';
import { fileToBase64 } from '@/contexts/BackgroundContext';

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
  const [attributeInput, setAttributeInput] = React.useState('');
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  
  useEffect(() => {
    let keepAliveInterval: number | null = null;
    
    if (open) {
      keepAliveInterval = window.setInterval(() => {
        console.log('Keeping form session active...');
      }, 60000);
    }
    
    return () => {
      if (keepAliveInterval) {
        window.clearInterval(keepAliveInterval);
      }
    };
  }, [open]);
  
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

  const addAttribute = () => {
    if (attributeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        attributes: [...(prev.attributes || []), attributeInput.trim()]
      }));
      setAttributeInput('');
    }
  };
  
  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes?.filter((_, i) => i !== index)
    }));
  };
  
  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      additionalLinks: [...(prev.additionalLinks || []), { title: '', url: '' }]
    }));
  };
  
  const updateLink = (index: number, field: 'title' | 'url', value: string) => {
    setFormData(prev => {
      const updatedLinks = [...(prev.additionalLinks || [])];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      return { ...prev, additionalLinks: updatedLinks };
    });
  };
  
  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalLinks: prev.additionalLinks?.filter((_, i) => i !== index)
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
    
    onSave(projectToSave);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="mt-6">
            <TabsList className="grid grid-cols-6 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Detailed Info</TabsTrigger>
              <TabsTrigger value="project">Project Info</TabsTrigger>
              <TabsTrigger value="business">Business Value</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="mt-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
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
                  <Label htmlFor="categories">Categories</Label>
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
            
            <TabsContent value="project" className="mt-0">
              <div className="grid gap-4">
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
                    placeholder="Project year (e.g., 2023)"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Primary Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    placeholder="e.g., eLearning Development"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="overview">Project Overview</Label>
                  <Textarea
                    id="overview"
                    name="overview"
                    value={formData.overview || ''}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Provide a detailed overview of the project, including approach, tools used, and outcomes."
                  />
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
                  <Label htmlFor="solution">My Solution</Label>
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
                  <Label htmlFor="businessImpact">Impact on Business Value</Label>
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
            
            <TabsContent value="details" className="mt-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="detailedDescription">Detailed Description</Label>
                  <Textarea
                    id="detailedDescription"
                    name="detailedDescription"
                    value={formData.detailedDescription || ''}
                    onChange={handleChange}
                    rows={10}
                    placeholder="Provide a comprehensive description of your project. You can include project goals, challenges faced, solutions implemented, outcomes, etc."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="attributes">Project Attributes</Label>
                  <div className="flex gap-2">
                    <Input
                      id="attributes"
                      value={attributeInput}
                      onChange={(e) => setAttributeInput(e.target.value)}
                      placeholder="Add an attribute (skills, features, etc.)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addAttribute();
                        }
                      }}
                    />
                    <Button type="button" onClick={addAttribute} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.attributes?.map((attribute, index) => (
                      <div key={index} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                        <span className="text-xs">{attribute}</span>
                        <button
                          type="button"
                          onClick={() => removeAttribute(index)}
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
            
            <TabsContent value="media" className="mt-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="projectImage">Or Upload Image</Label>
                  <Input
                    id="projectImage"
                    name="projectImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="rounded-md max-h-40 object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="videoUrl">Video Embed URL</Label>
                  <Input
                    id="videoUrl"
                    name="videoUrl"
                    type="url"
                    value={formData.videoUrl || ''}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="projectVideo">Or Upload Video</Label>
                  <Input
                    id="projectVideo"
                    name="projectVideo"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                  />
                  
                  {videoFile && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Video Preview:</p>
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
            </TabsContent>
            
            <TabsContent value="links" className="mt-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="liveUrl">Live Demo URL</Label>
                  <Input
                    id="liveUrl"
                    name="liveUrl"
                    type="url"
                    value={formData.liveUrl || ''}
                    onChange={handleChange}
                    placeholder="https://your-project.com"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="repoUrl">Repository URL</Label>
                  <Input
                    id="repoUrl"
                    name="repoUrl"
                    type="url"
                    value={formData.repoUrl || ''}
                    onChange={handleChange}
                    placeholder="https://github.com/your-username/your-repo"
                  />
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Additional Links</Label>
                    <Button type="button" onClick={addLink} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add Link
                    </Button>
                  </div>
                  
                  {formData.additionalLinks?.map((link, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="grid gap-2 flex-1">
                        <Input
                          placeholder="Link Title"
                          value={link.title}
                          onChange={(e) => updateLink(index, 'title', e.target.value)}
                        />
                        <Input
                          placeholder="URL"
                          type="url"
                          value={link.url}
                          onChange={(e) => updateLink(index, 'url', e.target.value)}
                        />
                      </div>
                      <Button 
                        type="button" 
                        onClick={() => removeLink(index)} 
                        variant="outline" 
                        size="icon"
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
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
