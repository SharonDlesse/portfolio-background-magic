
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal } from 'lucide-react';
import { useLogManager } from './logs/useLogManager';
import { LogControls } from './logs/LogControls';
import { LogList } from './logs/LogList';

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
    downloadLogs
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
          
          <LogList logs={filteredLogs} />
          
          <div className="text-xs text-gray-500">
            Showing {filteredLogs.length} of {logs.length} log entries
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
