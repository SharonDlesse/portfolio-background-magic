
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle, Activity, Zap } from 'lucide-react';

interface SystemStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  latency?: number;
  message?: string;
}

export const StatusDashboard = () => {
  const [systems, setSystems] = useState<SystemStatus[]>([
    { name: 'Preview Container', status: 'healthy' },
    { name: 'Resource Allocation', status: 'healthy' },
    { name: 'Network Connectivity', status: 'healthy' },
    { name: 'Sandbox Environment', status: 'healthy' }
  ]);
  
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isChecking, setIsChecking] = useState(false);

  const runSystemCheck = () => {
    setIsChecking(true);
    
    // Simulate system check
    setTimeout(() => {
      const updatedSystems = [
        { 
          name: 'Preview Container', 
          status: Math.random() > 0.3 ? 'healthy' : 'warning',
          latency: Math.floor(Math.random() * 300) + 10,
          message: Math.random() > 0.7 ? 'Container resources constrained' : undefined
        },
        { 
          name: 'Resource Allocation', 
          status: Math.random() > 0.2 ? 'healthy' : 'error',
          latency: Math.floor(Math.random() * 100) + 5,
          message: Math.random() > 0.8 ? 'Memory usage exceeds threshold' : undefined
        },
        { 
          name: 'Network Connectivity', 
          status: Math.random() > 0.1 ? 'healthy' : 'warning',
          latency: Math.floor(Math.random() * 500) + 20,
          message: Math.random() > 0.9 ? 'High network latency detected' : undefined
        },
        { 
          name: 'Sandbox Environment', 
          status: Math.random() > 0.15 ? 'healthy' : 'error',
          latency: Math.floor(Math.random() * 200) + 15,
          message: Math.random() > 0.85 ? 'Sandbox initialization error' : undefined
        }
      ] as SystemStatus[];
      
      setSystems(updatedSystems);
      setLastChecked(new Date());
      setIsChecking(false);
    }, 1500);
  };

  useEffect(() => {
    runSystemCheck();
  }, []);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'healthy':
        return <CheckCircle className="text-green-500 h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="text-yellow-500 h-5 w-5" />;
      case 'error':
        return <XCircle className="text-red-500 h-5 w-5" />;
      default:
        return <Activity className="text-blue-500 h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status Overview
          </CardTitle>
          <CardDescription>
            Current health status of preview environment components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {systems.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 shadow-sm">
                <div className="flex items-center gap-3">
                  {getStatusIcon(system.status)}
                  <div>
                    <h3 className="font-medium">{system.name}</h3>
                    {system.message && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{system.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {system.latency && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">{system.latency}ms</span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                    {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
          <Button 
            onClick={runSystemCheck} 
            disabled={isChecking}
            className="flex items-center gap-1"
          >
            <Zap className="h-4 w-4" />
            {isChecking ? 'Checking...' : 'Run Health Check'}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
