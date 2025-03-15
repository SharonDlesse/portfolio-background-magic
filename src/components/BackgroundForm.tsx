
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { BackgroundImage, useBackground } from '@/contexts/BackgroundContext';

const BackgroundForm = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const { addBackground } = useBackground();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 dark:bg-slate-900/80 p-4 rounded-lg">
      <h3 className="text-lg font-medium">Add Custom Background</h3>
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
  );
};

export default BackgroundForm;
