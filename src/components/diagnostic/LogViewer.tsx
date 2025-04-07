
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Download, Trash, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LogEntry {
  id: string;
  type: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  source: string;
}

export const LogViewer = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  
  // Generate sample logs on component mount
  useEffect(() => {
    generateSampleLogs();
    
    // Set up auto-refresh if enabled
    let refreshInterval: NodeJS.Timeout | null = null;
    
    if (autoRefresh) {
      refreshInterval = setInterval(() => {
        addRandomLog();
      }, 5000);
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh]);
  
  const generateSampleLogs = () => {
    const sampleLogs: LogEntry[] = [
      {
        id: '1',
        type: 'info',
        message: 'Application initialized',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        source: 'app.js'
      },
      {
        id: '2',
        type: 'info',
        message: 'Loading resources from CDN',
        timestamp: new Date(Date.now() - 55000).toISOString(),
        source: 'resource-loader.js'
      },
      {
        id: '3',
        type: 'warn',
        message: 'Slow network detected, resources may load with delay',
        timestamp: new Date(Date.now() - 50000).toISOString(),
        source: 'network-monitor.js'
      },
      {
        id: '4',
        type: 'error',
        message: 'Failed to load asset: background-image.webp',
        timestamp: new Date(Date.now() - 45000).toISOString(),
        source: 'asset-loader.js'
      },
      {
        id: '5',
        type: 'debug',
        message: 'DOM Render cycle completed in 235ms',
        timestamp: new Date(Date.now() - 40000).toISOString(),
        source: 'render-manager.js'
      },
      {
        id: '6',
        type: 'info',
        message: 'User session started',
        timestamp: new Date(Date.now() - 35000).toISOString(),
        source: 'auth.js'
      },
      {
        id: '7',
        type: 'warn',
        message: 'LocalStorage quota almost reached (90%)',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        source: 'storage.js'
      },
      {
        id: '8',
        type: 'error',
        message: 'Uncaught TypeError: Cannot read property "length" of undefined',
        timestamp: new Date(Date.now() - 25000).toISOString(),
        source: 'data-processor.js'
      },
      {
        id: '9',
        type: 'debug',
        message: 'API request completed in 350ms',
        timestamp: new Date(Date.now() - 20000).toISOString(),
        source: 'api-client.js'
      },
      {
        id: '10',
        type: 'info',
        message: 'Route changed: /home -> /dashboard',
        timestamp: new Date(Date.now() - 15000).toISOString(),
        source: 'router.js'
      },
    ];
    
    setLogs(sampleLogs);
  };
  
  const addRandomLog = () => {
    const types: Array<'info' | 'warn' | 'error' | 'debug'> = ['info', 'warn', 'error', 'debug'];
    const sources = ['app.js', 'router.js', 'api-client.js', 'render-manager.js', 'asset-loader.js'];
    
    const messages = {
      info: [
        'User interaction: button click',
        'Component mounted',
        'Data fetched successfully',
        'Cache updated',
        'Route navigation completed'
      ],
      warn: [
        'Deprecated API usage detected',
        'Component taking too long to render',
        'Network request retry attempt',
        'Non-critical resource failed to load',
        'Performance bottleneck detected'
      ],
      error: [
        'Uncaught exception in event handler',
        'API request failed with status 500',
        'Unable to parse response data',
        'WebSocket connection closed unexpectedly',
        'Runtime error: maximum call stack exceeded'
      ],
      debug: [
        'Props received: {...}',
        'State updated: {...}',
        'Effect cleanup executed',
        'Event propagation path: ...',
        'Memory usage: 24.3MB'
      ]
    };
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomMessage = messages[randomType][Math.floor(Math.random() * messages[randomType].length)];
    
    const newLog: LogEntry = {
      id: Date.now().toString(),
      type: randomType,
      message: randomMessage,
      timestamp: new Date().toISOString(),
      source: randomSource
    };
    
    setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep the last 100 logs
  };
  
  const clearLogs = () => {
    setLogs([]);
  };
  
  const downloadLogs = () => {
    const logText = logs
      .map(log => `[${log.timestamp}] [${log.type.toUpperCase()}] [${log.source}] ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preview-logs-${new Date().toISOString().split('.')[0].replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const filteredLogs = logs.filter(log => {
    // Apply type filter
    if (filter !== 'all' && log.type !== filter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !log.source.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const getLogTypeColor = (type: string) => {
    switch(type) {
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'warn':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'debug':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

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
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  type="text"
                  placeholder="Search logs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-40">
              <Select value={filter} onValueChange={value => setFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={downloadLogs}
              title="Download Logs"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={clearLogs}
              title="Clear Logs"
            >
              <Trash className="h-4 w-4" />
            </Button>
            
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              size="sm"
            >
              {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
            </Button>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-auto max-h-[500px] bg-gray-50 dark:bg-gray-900/50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <div 
                    key={log.id}
                    className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-start gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full mt-1 uppercase ${getLogTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono">{log.message}</p>
                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span className="font-medium">{log.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Terminal className="h-12 w-12 mb-4 text-gray-400" />
                  <p>No logs to display</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Showing {filteredLogs.length} of {logs.length} log entries
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
