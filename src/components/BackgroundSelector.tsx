
import React, { useState } from 'react';
import { useBackground } from '@/contexts/BackgroundContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import BackgroundForm from './BackgroundForm';
import { X } from 'lucide-react';

const BackgroundSelector = () => {
  const { savedBackgrounds, currentBackground, setCurrentBackground, removeBackground } = useBackground();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSelectBackground = (url: string, name: string) => {
    setCurrentBackground(url);
    toast({
      title: "Background Changed",
      description: `Background set to "${name}"`,
    });
    setOpen(false);
  };

  const handleRemoveBackground = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeBackground(id);
    toast({
      title: "Background Removed",
      description: `"${name}" has been removed from your backgrounds`,
    });
  };

  const presetBackgrounds = savedBackgrounds.filter(bg => bg.isPreset);
  const customBackgrounds = savedBackgrounds.filter(bg => !bg.isPreset);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 z-50 bg-white/80 hover:bg-white/90 dark:bg-slate-800/80 dark:hover:bg-slate-800/90">
          Change Background
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Background</DialogTitle>
          <DialogDescription>
            Select a preset background or upload your own custom image.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="presets">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Preset Backgrounds</TabsTrigger>
            <TabsTrigger value="custom">Custom Backgrounds</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              {presetBackgrounds.map((bg) => (
                <div 
                  key={bg.id}
                  onClick={() => handleSelectBackground(bg.url, bg.name)}
                  className={`relative overflow-hidden rounded-lg cursor-pointer transition-all h-32 bg-cover bg-center ${bg.url === currentBackground ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'}`}
                  style={{ backgroundImage: `url(${bg.url})` }}
                >
                  <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                    <p className="text-white text-sm font-medium truncate w-full">{bg.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            {customBackgrounds.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {customBackgrounds.map((bg) => (
                  <div 
                    key={bg.id}
                    onClick={() => handleSelectBackground(bg.url, bg.name)}
                    className={`relative overflow-hidden rounded-lg cursor-pointer transition-all h-32 bg-cover bg-center ${bg.url === currentBackground ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'}`}
                    style={{ backgroundImage: `url(${bg.url})` }}
                  >
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-1 right-1 h-6 w-6" 
                      onClick={(e) => handleRemoveBackground(bg.id, bg.name, e)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                      <p className="text-white text-sm font-medium truncate w-full">{bg.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No custom backgrounds added yet.</p>
            )}
            
            <BackgroundForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BackgroundSelector;
