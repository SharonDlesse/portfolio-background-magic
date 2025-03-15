
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { BackgroundImage, useBackground } from '@/contexts/BackgroundContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';

const BackgroundForm = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [uploadName, setUploadName] = useState('');
  const { addBackground, uploadBackground } = useBackground();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) {
      toast({
        title: "Validation Error",
        description: "Both name and URL are required",
        variant: "destructive"
      });
      return;
    }
    
    // Basic URL validation
    try {
      new URL(url);
    } catch (_) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive"
      });
      return;
    }
    
    const newBackground: BackgroundImage = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      url: url.trim(),
      isPreset: false
    };
    
    addBackground(newBackground);
    
    toast({
      title: "Background Added",
      description: `"${name}" has been added to your backgrounds`,
    });
    
    // Reset form
    setName('');
    setUrl('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Set default name if not provided
    const backgroundName = uploadName.trim() || file.name;
    
    // Upload the file
    uploadBackground(file, backgroundName);
    
    toast({
      title: "Background Uploaded",
      description: `"${backgroundName}" has been added to your backgrounds`,
    });
    
    // Reset the form
    setUploadName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-4 bg-white/80 dark:bg-slate-900/80 p-4 rounded-lg">
      <h3 className="text-lg font-medium">Add Custom Background</h3>
      
      <Tabs defaultValue="url">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">From URL</TabsTrigger>
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url" className="space-y-4 mt-4">
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bg-name">Background Name</Label>
              <Input 
                id="bg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Custom Background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bg-url">Image URL</Label>
              <Input 
                id="bg-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <Button type="submit">Add Background</Button>
          </form>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="bg-upload-name">Background Name (Optional)</Label>
            <Input 
              id="bg-upload-name"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder="My Uploaded Background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bg-file">Choose Image</Label>
            <Input 
              id="bg-file"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
          <div className="pt-2">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              Upload Image
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackgroundForm;
