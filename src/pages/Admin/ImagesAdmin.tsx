import React, { useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import GithubImageBrowser from '@/components/GithubImageBrowser';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ImagesAdmin = () => {
  const { refreshSession } = useAuth();

  // More aggressive session refresh to prevent timeouts
  useEffect(() => {
    // Immediate refresh on component mount
    refreshSession();
    
    const intervalId = setInterval(() => {
      refreshSession();
    }, 2 * 60 * 1000); // Every 2 minutes (reduced from 3)
    
    return () => clearInterval(intervalId);
  }, [refreshSession]);

  const handleSelectImage = (imageUrl: string) => {
    // Copy the image URL to clipboard
    navigator.clipboard.writeText(imageUrl);
    
    // Save to recent selections in localStorage for easy access
    try {
      const recentSelections = JSON.parse(localStorage.getItem('recentImageSelections') || '[]');
      const newSelection = { url: imageUrl, timestamp: new Date().toISOString() };
      
      // Add to beginning, limit to 10 items
      recentSelections.unshift(newSelection);
      if (recentSelections.length > 10) recentSelections.pop();
      
      localStorage.setItem('recentImageSelections', JSON.stringify(recentSelections));
    } catch (error) {
      console.error('Error saving recent selection:', error);
    }
    
    toast.success('Image URL copied to clipboard');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">GitHub Images</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage images from your GitHub repository.
          </p>
        </div>

        <div className="grid gap-6">
          <GithubImageBrowser onSelectImage={handleSelectImage} />
        </div>

        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">How to use GitHub images in your projects</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Set up your GitHub repository information in the settings tab</li>
            <li>Refresh the image browser to view available images</li>
            <li>Select an image to copy its URL to your clipboard</li>
            <li>Paste the URL in your project where needed</li>
            <li>When editing a project, you can access GitHub images directly from the Media & Links tab</li>
            <li>Add new images to your GitHub repository at any time</li>
            <li>Refresh the browser to see newly added images</li>
          </ol>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ImagesAdmin;
