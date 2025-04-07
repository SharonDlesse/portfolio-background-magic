
import React, { Suspense, lazy } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal } from 'lucide-react';
import { useLogManager } from './logs/useLogManager';
import { LogControls } from './logs/LogControls';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

// Use React.lazy for code splitting
const LazyLogList = lazy(() => import('./logs/LazyLogList').then(module => ({ default: module.LazyLogList })));

export const LogViewer = () => {
  const {
    logs,
    filter,
    searchQuery,
    autoRefresh,
    filteredLogs,
    setFilter,
    setSearchQuery,
    setAutoRefresh,
    clearLogs,
    downloadLogs,
    memoryUsage
  } = useLogManager();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-600 flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Console Log Viewer
        </CardTitle>
        <CardDescription>
          Monitor and search application logs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Memory usage indicator */}
          <div>
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
          
          <LogControls
            filter={filter}
            searchQuery={searchQuery}
            autoRefresh={autoRefresh}
            setFilter={setFilter}
            setSearchQuery={setSearchQuery}
            setAutoRefresh={setAutoRefresh}
            downloadLogs={downloadLogs}
            clearLogs={clearLogs}
          />
          
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <LazyLogList logs={filteredLogs} />
          </Suspense>
          
          <div className="text-xs text-gray-500">
            Showing {filteredLogs.length} of {logs.length} log entries
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
