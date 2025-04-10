
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, HardDrive, Database, Trash, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { requestPersistentStorage } from '@/utils/storageUtils';

interface StorageInfo {
  persistentStorage: boolean;
  localStorageUsage: number;
  localStorageLimit: number;
  indexedDBAvailable: boolean;
  imageStorage: 'ok' | 'warning' | 'error';
  cleanupRecommended: boolean;
}

export const StorageDiagnostic = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [progress, setProgress] = useState(0);

  // Check if IndexedDB is available and working
  const checkIndexedDB = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('test-db', 1);
        
        request.onerror = () => {
          resolve(false);
        };
        
        request.onsuccess = () => {
          request.result.close();
          resolve(true);
        };
      } catch (error) {
        resolve(false);
      }
    });
  };
  
  // Check local storage usage and limits
  const checkLocalStorageUsage = (): { used: number, limit: number } => {
    try {
      let totalSize = 0;
      const tempKey = '___size_test___';
      
      // Get size of all items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        const value = localStorage.getItem(key) || '';
        totalSize += (key.length + value.length) * 2; // UTF-16 uses 2 bytes per character
      }
      
      // Estimate limit by trying to add large strings until it fails
      let limit = 5 * 1024 * 1024; // Start with default 5MB
      try {
        // Try to estimate remaining space
        const testString = 'a'.repeat(1024 * 1024); // 1MB string
        localStorage.setItem(tempKey, testString);
        localStorage.removeItem(tempKey);
        
        // If that worked, we have at least 1MB free
        limit = Math.max(totalSize + (1024 * 1024), 5 * 1024 * 1024);
      } catch (e) {
        // If we couldn't add 1MB, estimate remaining space
        let testSize = 512 * 1024;
        
        while (testSize > 1024) {
          try {
            const test = 'a'.repeat(testSize);
            localStorage.setItem(tempKey, test);
            localStorage.removeItem(tempKey);
            
            // If successful, we have at least this much free space
            limit = totalSize + testSize;
            break;
          } catch (e) {
            testSize = Math.floor(testSize / 2);
          }
        }
      }
      
      return { used: totalSize, limit };
    } catch (error) {
      console.error('Error checking localStorage:', error);
      return { used: 0, limit: 5 * 1024 * 1024 }; // Default to 5MB if we can't check
    }
  };

  // Check if any image data is stored directly in localStorage
  const checkForDirectImageStorage = (): boolean => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          // Check for base64 encoded images
          if (value.includes('data:image/') && value.includes('base64,')) {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const runChecks = async () => {
    setIsChecking(true);
    setProgress(0);
    
    // Check persistent storage permission
    setProgress(20);
    const isPersistent = await requestPersistentStorage();
    
    // Check IndexedDB availability
    setProgress(40);
    const indexedDBAvailable = await checkIndexedDB();
    
    // Check localStorage usage
    setProgress(60);
    const { used, limit } = checkLocalStorageUsage();
    
    // Check for direct image storage in localStorage
    setProgress(80);
    const hasDirectImages = checkForDirectImageStorage();
    
    // Determine image storage recommendation
    let imageStorage: 'ok' | 'warning' | 'error' = 'ok';
    if (!indexedDBAvailable) {
      imageStorage = 'error';
    } else if (hasDirectImages) {
      imageStorage = 'warning';
    }
    
    // Check if cleanup is recommended
    const usageRatio = used / limit;
    const cleanupRecommended = usageRatio > 0.7; // More than 70% used
    
    setProgress(100);
    setStorageInfo({
      persistentStorage: isPersistent,
      localStorageUsage: used,
      localStorageLimit: limit,
      indexedDBAvailable,
      imageStorage,
      cleanupRecommended
    });
    
    setIsChecking(false);
  };

  useEffect(() => {
    // Run initial check on component mount
    runChecks();
  }, []);

  // Clean up unnecessary localStorage data
  const handleCleanup = () => {
    try {
      // List of keys to preserve
      const keysToKeep = [
        'portfolioProjects',
        'portfolioBackground',
        'githubRepoInfo',
        'portfolioUser'
      ];
      
      const keysToRemove = [];
      // Identify keys to remove
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keysToKeep.includes(key) && !key.includes('essential')) {
          keysToRemove.push(key);
        }
      }
      
      // Remove unnecessary keys
      for (const key of keysToRemove) {
        localStorage.removeItem(key);
      }
      
      // Count removed items
      toast.success(`Cleanup complete: Removed ${keysToRemove.length} items`);
      
      // Re-run checks
      runChecks();
    } catch (error) {
      console.error('Error during cleanup:', error);
      toast.error('Cleanup failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-600 flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Storage Diagnostics
        </CardTitle>
        <CardDescription>
          Diagnose issues with project storage and image persistence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Diagnostic Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {storageInfo && (
          <div className="space-y-4 mt-6">
            {/* Persistent Storage */}
            <div className={`p-4 rounded-lg border ${
              storageInfo.persistentStorage ? 
                'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50' : 
                'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50'
            }`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {storageInfo.persistentStorage ? 
                    <CheckCircle className="text-green-500 h-5 w-5" /> :
                    <AlertCircle className="text-amber-500 h-5 w-5" />
                  }
                </div>
                <div>
                  <h3 className="font-medium">
                    Persistent Storage
                  </h3>
                  <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                    {storageInfo.persistentStorage ? 
                      'Persistent storage is enabled. Your data should persist between sessions.' :
                      'Persistent storage is not enabled. Data may be cleared by the browser between sessions.'
                    }
                  </p>
                  {!storageInfo.persistentStorage && (
                    <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      Without persistent storage, some browsers may clear your data after periods of inactivity or when storage pressure is high.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* IndexedDB Status */}
            <div className={`p-4 rounded-lg border ${
              storageInfo.indexedDBAvailable ? 
                'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50' : 
                'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50'
            }`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {storageInfo.indexedDBAvailable ? 
                    <CheckCircle className="text-green-500 h-5 w-5" /> :
                    <AlertCircle className="text-red-500 h-5 w-5" />
                  }
                </div>
                <div>
                  <h3 className="font-medium">
                    IndexedDB Status
                  </h3>
                  <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                    {storageInfo.indexedDBAvailable ? 
                      'IndexedDB is available and working. Large images can be properly stored.' :
                      'IndexedDB is not available. Large images cannot be stored properly.'
                    }
                  </p>
                  {!storageInfo.indexedDBAvailable && (
                    <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      Without IndexedDB support, large images cannot be stored efficiently. This may be caused by private browsing mode or browser settings that restrict storage.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* localStorage Usage */}
            <div className={`p-4 rounded-lg border ${
              (storageInfo.localStorageUsage / storageInfo.localStorageLimit) > 0.8 ? 
                'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50' :
                (storageInfo.localStorageUsage / storageInfo.localStorageLimit) > 0.6 ?
                'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50' :
                'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50'
            }`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Database className={`h-5 w-5 ${
                    (storageInfo.localStorageUsage / storageInfo.localStorageLimit) > 0.8 ?
                    'text-red-500' :
                    (storageInfo.localStorageUsage / storageInfo.localStorageLimit) > 0.6 ?
                    'text-amber-500' : 'text-green-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    localStorage Usage
                  </h3>
                  <div className="flex justify-between mb-1 mt-1">
                    <span className="text-sm text-gray-500">
                      {Math.round(storageInfo.localStorageUsage / 1024)} KB of {Math.round(storageInfo.localStorageLimit / 1024)} KB
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round((storageInfo.localStorageUsage / storageInfo.localStorageLimit) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(storageInfo.localStorageUsage / storageInfo.localStorageLimit) * 100} 
                    className="h-2"
                  />
                  {storageInfo.cleanupRecommended && (
                    <p className="text-xs mt-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded">
                      You're nearing your browser's storage limit. Consider cleaning up unnecessary data to prevent data loss.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Image Storage Status */}
            <div className={`p-4 rounded-lg border ${
              storageInfo.imageStorage === 'error' ? 
                'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50' :
                storageInfo.imageStorage === 'warning' ?
                'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50' :
                'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50'
            }`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {storageInfo.imageStorage === 'ok' ? 
                    <CheckCircle className="text-green-500 h-5 w-5" /> :
                    storageInfo.imageStorage === 'warning' ?
                    <AlertCircle className="text-amber-500 h-5 w-5" /> :
                    <AlertCircle className="text-red-500 h-5 w-5" />
                  }
                </div>
                <div>
                  <h3 className="font-medium">
                    Image Storage
                  </h3>
                  <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                    {storageInfo.imageStorage === 'ok' ? 
                      'Images are being stored efficiently. Your project can save and load images properly.' :
                      storageInfo.imageStorage === 'warning' ?
                      'Some images are being stored inefficiently in localStorage. Consider using GitHub-hosted images instead of direct uploads.' :
                      'Image storage is not working properly. Images may not persist between sessions.'
                    }
                  </p>
                  {storageInfo.imageStorage !== 'ok' && (
                    <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {storageInfo.imageStorage === 'warning' ?
                        'For best results with image-heavy projects, use GitHub-hosted images rather than direct uploads.' :
                        'Your browser may be blocking IndexedDB storage needed for images. Try disabling private browsing mode or adjusting browser privacy settings.'
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          onClick={runChecks} 
          disabled={isChecking} 
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? 'Checking...' : 'Check Again'}
        </Button>
        
        {storageInfo?.cleanupRecommended && (
          <Button 
            onClick={handleCleanup} 
            variant="default" 
            className="flex items-center justify-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Clean Up Storage
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
