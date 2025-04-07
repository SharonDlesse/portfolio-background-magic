
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { GithubRepoInfo } from '@/types/github';
import { saveGithubRepoSettings } from '@/utils/githubUtils';
import { toast } from 'sonner';

interface GithubRepoSettingsProps {
  repoInfo: GithubRepoInfo;
  setRepoInfo: React.Dispatch<React.SetStateAction<GithubRepoInfo>>;
  onSaveSuccess: () => void;
}

const GithubRepoSettings: React.FC<GithubRepoSettingsProps> = ({ 
  repoInfo, 
  setRepoInfo, 
  onSaveSuccess 
}) => {
  const handleSaveSettings = () => {
    const success = saveGithubRepoSettings(repoInfo);
    if (success) {
      toast.success('GitHub repository settings saved');
      onSaveSuccess();
    } else {
      toast.error('Failed to save GitHub settings');
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="owner" className="text-sm font-medium">GitHub Username/Organization</label>
        <Input 
          id="owner"
          value={repoInfo.owner}
          onChange={(e) => setRepoInfo({...repoInfo, owner: e.target.value})}
          placeholder="e.g. username"
        />
      </div>
      
      <div className="grid gap-2">
        <label htmlFor="repo" className="text-sm font-medium">Repository Name</label>
        <Input 
          id="repo"
          value={repoInfo.repo}
          onChange={(e) => setRepoInfo({...repoInfo, repo: e.target.value})}
          placeholder="e.g. my-project"
        />
      </div>
      
      <div className="grid gap-2">
        <label htmlFor="path" className="text-sm font-medium">Image Directory Path</label>
        <Input 
          id="path"
          value={repoInfo.path}
          onChange={(e) => setRepoInfo({...repoInfo, path: e.target.value})}
          placeholder="e.g. public/images"
        />
        <p className="text-sm text-muted-foreground">
          Relative path to your images directory in the repository
        </p>
      </div>
      
      <div className="grid gap-2">
        <label htmlFor="token" className="text-sm font-medium">Personal Access Token (Optional)</label>
        <Input 
          id="token"
          type="password"
          value={repoInfo.token}
          onChange={(e) => setRepoInfo({...repoInfo, token: e.target.value})}
          placeholder="Only needed for private repositories"
        />
        <p className="text-sm text-muted-foreground">
          Only required for private repositories or to avoid rate limits
        </p>
      </div>

      <Button onClick={handleSaveSettings} className="mt-2">Save Repository Settings</Button>
    </div>
  );
};

export default GithubRepoSettings;
