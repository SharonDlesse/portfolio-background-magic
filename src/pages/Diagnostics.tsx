
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Bug, Terminal, Zap, Info, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { DiagnosticTool } from '@/components/diagnostic/DiagnosticTool';
import { LogViewer } from '@/components/diagnostic/LogViewer';
import { TroubleshootingGuide } from '@/components/diagnostic/TroubleshootingGuide';
import { StatusDashboard } from '@/components/diagnostic/StatusDashboard';
import PublicRoute from '@/components/PublicRoute';

// Environment configuration helper
const getEnvConfig = () => {
  return {
    nodeEnv: import.meta.env.MODE || 'development',
    basePath: import.meta.env.BASE_URL || '/',
    browserInfo: navigator.userAgent,
    screenResolution: `${window.innerWidth}x${window.innerHeight}`
  };
};

// Memory usage monitor
const useMemoryUsage = () => {
  const [memoryUsage, setMemoryUsage] = useState(0);
  
  useEffect(() => {
    // Check if performance.memory is available (Chrome only)
    const checkMemory = () => {
      if (performance && 'memory' in performance) {
        const memory = (performance as any).memory;
        if (memory) {
          const usedJSHeapSize = memory.usedJSHeapSize;
          const jsHeapSizeLimit = memory.jsHeapSizeLimit;
          // Calculate percentage of memory used
          const percentage = (usedJSHeapSize / jsHeapSizeLimit) * 100;
          setMemoryUsage(Math.min(Math.round(percentage), 100));
        }
      }
    };
    
    checkMemory();
    const interval = setInterval(checkMemory, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return memoryUsage;
};

// Resource cleanup utility
const useResourceCleanup = () => {
  useEffect(() => {
    // Store references to created objects for cleanup
    const objectUrls: string[] = [];
    
    // Override URL.createObjectURL to track created URLs
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function(blob) {
      const url = originalCreateObjectURL(blob);
      objectUrls.push(url);
      return url;
    };
    
    // Clean up on component unmount
    return () => {
      objectUrls.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.warn('Failed to revoke object URL:', e);
        }
      });
      // Restore original function
      URL.createObjectURL = originalCreateObjectURL;
    };
  }, []);
};

const Diagnostics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const memoryUsage = useMemoryUsage();
  const envConfig = useMemo(() => getEnvConfig(), []);
  
  // Use the resource cleanup utility
  useResourceCleanup();

  useEffect(() => {
    // Use a more optimized loading approach with timeout
    let isMounted = true;
    
    // Simulate loading time with a shorter timeout and check if component is still mounted
    const timer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 800);
    
    // Clear localStorage items that might be causing issues
    try {
      // Check localStorage size
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
      }
      
      // If localStorage is nearly full (approaching 5MB limit)
      if (totalSize > 4000000) {
        // Find and remove any temporary or diagnostic data
        const keysToCheck = ['tempData', 'debugLogs', 'cachedAssets'];
        keysToCheck.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (e) {
      console.warn('LocalStorage access error:', e);
    }
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <PublicRoute>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
              <Zap className="h-8 w-8" />
              Preview Rescue Squad
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Diagnostic and troubleshooting tools for development environment preview issues
          </p>
        </header>

        {/* Environment summary card */}
        <Card className="mb-6">
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
              <Settings className="h-4 w-4" />
              Environment Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Environment:</span>
                <span className="font-medium">{envConfig.nodeEnv}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Base Path:</span>
                <span className="font-medium">{envConfig.basePath}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Browser:</span>
                <span className="font-medium truncate max-w-[300px]" title={envConfig.browserInfo}>
                  {envConfig.browserInfo.split(' ').slice(0, 3).join(' ')}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Resolution:</span>
                <span className="font-medium">{envConfig.screenResolution}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory usage indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Memory Usage</span>
            <span className={`text-sm font-medium ${
              memoryUsage > 80 ? 'text-red-600' : memoryUsage > 60 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {memoryUsage}%
            </span>
          </div>
          <Progress value={memoryUsage} className="h-2" />
        </div>

        <Tabs defaultValue="status" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Status</span>
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              <span>Run Tests</span>
            </TabsTrigger>
            <TabsTrigger value="troubleshoot" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Troubleshoot</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span>Logs</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ) : (
              <StatusDashboard />
            )}
          </TabsContent>
          
          <TabsContent value="diagnostics" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ) : (
              <DiagnosticTool />
            )}
          </TabsContent>
          
          <TabsContent value="troubleshoot" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ) : (
              <TroubleshootingGuide />
            )}
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ) : (
              <LogViewer />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PublicRoute>
  );
};

export default Diagnostics;
