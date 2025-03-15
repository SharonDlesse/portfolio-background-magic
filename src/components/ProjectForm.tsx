
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { Project } from './ProjectCard';

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
  additionalLinks: []
};

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  open, 
  onOpenChange,
  project,
  onSave
}) => {
  const [formData, setFormData] = React.useState<Project>(project || {...defaultProject, id: crypto.randomUUID()});
  const [tagInput, setTagInput] = React.useState('');
  
  // Reset form when project changes
  React.useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({...defaultProject, id: crypto.randomUUID()});
    }
  }, [project, open]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl }));
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
    onSave(formData);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            
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
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="videoUrl">Video URL (YouTube/Vimeo embed link)</Label>
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
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
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
          
          <DialogFooter>
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
