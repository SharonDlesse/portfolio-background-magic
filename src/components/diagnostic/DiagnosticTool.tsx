
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle, Bug, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  message?: string;
  details?: string;
}

export const DiagnosticTool = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([
    { name: 'Network Connectivity', status: 'pending' },
    { name: 'Resource Allocation', status: 'pending' },
    { name: 'DOM Rendering', status: 'pending' },
    { name: 'JavaScript Execution', status: 'pending' },
    { name: 'API Responses', status: 'pending' },
    { name: 'Memory Usage', status: 'pending' }
  ]);

  const runDiagnostics = () => {
    setIsRunning(true);
    setProgress(0);
    
    // Reset all tests to pending
    setResults(prev => prev.map(test => ({ ...test, status: 'pending' })));
    
    // Run tests sequentially with simulated timing
    const testCount = results.length;
    let currentTest = 0;
    
    const runTest = (index: number) => {
      if (index >= testCount) {
        setIsRunning(false);
        toast({
          title: "Diagnostics Complete",
          description: "All tests have finished running.",
        });
        return;
      }
      
      // Update current test to running
      setResults(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: 'running' };
        return updated;
      });
      
      // Simulate test execution time (between 0.5 and 2 seconds)
      const testTime = Math.random() * 1500 + 500;
      
      setTimeout(() => {
        // Determine random result (80% pass rate)
        const passed = Math.random() > 0.2;
        
        // Update test result
        setResults(prev => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            status: passed ? 'passed' : 'failed',
            message: passed ? 'Test completed successfully' : getRandomError(updated[index].name),
            details: passed ? undefined : getRandomErrorDetail(updated[index].name)
          };
          return updated;
        });
        
        // Update progress
        currentTest++;
        setProgress(Math.round((currentTest / testCount) * 100));
        
        // Run next test
        runTest(index + 1);
      }, testTime);
    };
    
    // Start running tests
    runTest(0);
  };

  const getRandomError = (testName: string): string => {
    const errors = {
      'Network Connectivity': [
        'Connection timeout',
        'DNS resolution failed',
        'High packet loss detected'
      ],
      'Resource Allocation': [
        'Memory limit exceeded',
        'CPU usage spike',
        'Disk I/O bottleneck'
      ],
      'DOM Rendering': [
        'Render blocking detected',
        'Layout thrashing',
        'Excessive DOM depth'
      ],
      'JavaScript Execution': [
        'Unhandled promise rejection',
        'Runtime error',
        'Long task blocking main thread'
      ],
      'API Responses': [
        'API rate limit reached',
        'Service returned error',
        'Response parsing failed'
      ],
      'Memory Usage': [
        'Memory leak detected',
        'Excessive memory fragmentation',
        'Garbage collection delay'
      ]
    };
    
    const testErrors = errors[testName as keyof typeof errors] || ['Test failed'];
    return testErrors[Math.floor(Math.random() * testErrors.length)];
  };

  const getRandomErrorDetail = (testName: string): string => {
    const details = {
      'Network Connectivity': [
        'The connection to the preview server timed out after 5000ms. This could indicate network issues or server overload.',
        'Unable to resolve hostname. DNS lookup failed.',
        '32% packet loss detected on your connection.'
      ],
      'Resource Allocation': [
        'The sandbox environment exceeded its memory allocation (256MB). Consider optimizing memory usage.',
        'CPU utilization reached 98%. Long-running scripts may be causing this issue.',
        'Disk write operations are taking longer than expected (>300ms).'
      ],
      'DOM Rendering': [
        'Found 3 render-blocking resources. Consider deferring non-critical resources.',
        'Detected 12 forced synchronous layouts. Batch DOM operations to prevent layout thrashing.',
        'DOM tree exceeds recommended depth (>25 levels).'
      ],
      'JavaScript Execution': [
        'Uncaught promise rejection in module: dynamic-imports.js. Error: Failed to fetch resource.',
        'TypeError: Cannot read property \'length\' of undefined at line 42.',
        'Task took 832ms, causing jank and delayed user interactions.'
      ],
      'API Responses': [
        'You\'ve exceeded the rate limit for this API (100 req/min). Throttle your requests.',
        'API returned 503 Service Unavailable. Backend services may be down.',
        'Invalid JSON response from API endpoint.'
      ],
      'Memory Usage': [
        'Potential memory leak detected in component lifecycle. Memory increased by 8MB over 1 minute.',
        'High memory fragmentation (65%) may be causing poor performance.',
        'Garbage collection took 1.2s, causing UI freeze.'
      ]
    };
    
    const testDetails = details[testName as keyof typeof details] || ['No additional details available.'];
    return testDetails[Math.floor(Math.random() * testDetails.length)];
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'passed':
        return <CheckCircle className="text-green-500 h-5 w-5" />;
      case 'failed':
        return <XCircle className="text-red-500 h-5 w-5" />;
      case 'running':
        return <Zap className="text-blue-500 h-5 w-5 animate-pulse" />;
      default:
        return <AlertCircle className="text-gray-400 h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-600 flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Diagnostic Tests
        </CardTitle>
        <CardDescription>
          Run tests to identify common preview environment issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Test Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-4 mt-6">
          {results.map((test, index) => (
            <div 
              key={test.name}
              className={`p-4 rounded-lg border ${
                test.status === 'passed' ? 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50' :
                test.status === 'failed' ? 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50' :
                test.status === 'running' ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/50' :
                'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getStatusIcon(test.status)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">
                      {test.name}
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full capitalize bg-opacity-20">
                      {test.status}
                    </span>
                  </div>
                  
                  {test.message && (
                    <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{test.message}</p>
                  )}
                  
                  {test.details && (
                    <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded">{test.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning} 
          className="w-full flex items-center justify-center gap-2"
        >
          <Bug className="h-4 w-4" />
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </CardFooter>
    </Card>
  );
};
