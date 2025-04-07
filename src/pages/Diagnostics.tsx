
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Bug, Terminal, Zap, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DiagnosticTool } from '@/components/diagnostic/DiagnosticTool';
import { LogViewer } from '@/components/diagnostic/LogViewer';
import { TroubleshootingGuide } from '@/components/diagnostic/TroubleshootingGuide';
import { StatusDashboard } from '@/components/diagnostic/StatusDashboard';
import PublicRoute from '@/components/PublicRoute';

const Diagnostics = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
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

        <Tabs defaultValue="status" className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4">
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
