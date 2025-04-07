
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TroubleshootingEntry {
  id: string;
  problem: string;
  symptoms: string[];
  causes: string[];
  solutions: string[];
  category: 'network' | 'resources' | 'rendering' | 'scripting' | 'environment';
}

export const TroubleshootingGuide = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const troubleshootingData: TroubleshootingEntry[] = [
    {
      id: 'blank-screen',
      problem: 'Blank Screen / White Page',
      symptoms: [
        'Preview shows a completely blank page',
        'No error messages in console',
        'No visible content rendered'
      ],
      causes: [
        'JavaScript runtime error preventing app initialization',
        'Missing root element in HTML',
        'CSS hiding all content',
        'Failed bundle loading'
      ],
      solutions: [
        'Check browser console for errors',
        'Verify the root element exists in HTML (e.g., <div id="root"></div>)',
        'Check network tab for failed resource loading',
        'Clear browser cache and refresh',
        'Check for CSS styles that might be hiding content'
      ],
      category: 'rendering'
    },
    {
      id: 'infinite-loading',
      problem: 'Infinite Loading / Spinning',
      symptoms: [
        'Loading indicator spins indefinitely',
        'Application never becomes interactive',
        'No error messages'
      ],
      causes: [
        'Unresolved promise or infinite loop',
        'Missing dependency in useEffect',
        'Network request that never completes',
        'Event handler that doesn\'t complete'
      ],
      solutions: [
        'Check for infinite loops in your code',
        'Add error boundaries to React components',
        'Verify all useEffect dependencies are correct',
        'Add timeouts to network requests',
        'Look for state updates that might trigger re-renders'
      ],
      category: 'scripting'
    },
    {
      id: 'slow-preview',
      problem: 'Slow Preview Performance',
      symptoms: [
        'UI feels sluggish and unresponsive',
        'Animations stutter',
        'High CPU usage',
        'Long task warnings in console'
      ],
      causes: [
        'Inefficient rendering',
        'Too many re-renders',
        'Large bundle size',
        'Memory leaks',
        'Expensive calculations on main thread'
      ],
      solutions: [
        'Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders',
        'Move expensive calculations to web workers',
        'Implement code splitting and lazy loading',
        'Use performance profiler to identify bottlenecks',
        'Optimize images and assets'
      ],
      category: 'resources'
    },
    {
      id: 'network-errors',
      problem: 'Network Request Failures',
      symptoms: [
        'API calls fail or timeout',
        'CORS errors in console',
        'Failed to fetch errors',
        'API endpoints return 404 or 500'
      ],
      causes: [
        'Incorrect API endpoints',
        'CORS policy restrictions',
        'Network connectivity issues',
        'API rate limiting',
        'Invalid request payload'
      ],
      solutions: [
        'Verify API endpoints and request format',
        'Check CORS configuration',
        'Implement proper error handling for failed requests',
        'Use retry mechanisms for transient failures',
        'Verify network connectivity and check server status'
      ],
      category: 'network'
    },
    {
      id: 'resource-allocation',
      problem: 'Resource Allocation Issues',
      symptoms: [
        'Out of memory errors',
        'High CPU usage',
        'Preview crashes or freezes',
        'Slow performance over time'
      ],
      causes: [
        'Memory leaks in application code',
        'Excessive DOM elements',
        'Large assets or bundle size',
        'Inefficient data structures',
        'Background processes consuming resources'
      ],
      solutions: [
        'Clean up event listeners and subscriptions',
        'Implement virtual scrolling for large lists',
        'Optimize asset sizes',
        'Monitor memory usage with Performance tools',
        'Implement code splitting to reduce initial load'
      ],
      category: 'resources'
    },
    {
      id: 'routing-issues',
      problem: 'Routing Problems',
      symptoms: [
        'Links lead to 404 pages',
        'Unable to navigate between routes',
        'URL changes but content doesn\'t update',
        'Back button doesn\'t work properly'
      ],
      causes: [
        'Incorrectly configured routes',
        'Missing route handlers',
        'Route conflicts',
        'History API issues'
      ],
      solutions: [
        'Check route definitions and ensure they match URL patterns',
        'Verify that all routes are properly registered',
        'Use <Router> component correctly',
        'Implement proper route guards and fallbacks',
        'Check for route parameter handling issues'
      ],
      category: 'rendering'
    },
    {
      id: 'sandbox-environment',
      problem: 'Sandbox Environment Issues',
      symptoms: [
        'Works locally but fails in preview',
        'Environment-specific errors',
        'Preview fails to initialize',
        'Inconsistent behavior between environments'
      ],
      causes: [
        'Environment variable differences',
        'Resource limitations in sandbox',
        'Path resolution issues',
        'Browser compatibility problems',
        'Dependency version conflicts'
      ],
      solutions: [
        'Check environment variable configuration',
        'Use relative paths for assets and imports',
        'Optimize resource usage for constrained environments',
        'Test with the same browser version used in preview',
        'Verify dependencies and check for conflicts'
      ],
      category: 'environment'
    }
  ];
  
  const filteredEntries = searchQuery
    ? troubleshootingData.filter(entry => 
        entry.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        entry.causes.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : troubleshootingData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-600 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Troubleshooting Guide
        </CardTitle>
        <CardDescription>
          Common preview issues and their solutions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input 
            type="text"
            placeholder="Search for issues..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-6">
          {filteredEntries.length > 0 ? (
            filteredEntries.map(entry => (
              <div 
                key={entry.id} 
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-medium text-blue-700 dark:text-blue-400">{entry.problem}</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symptoms:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {entry.symptoms.map((symptom, i) => (
                        <li key={i}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Possible Causes:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {entry.causes.map((cause, i) => (
                        <li key={i}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommended Solutions:</h4>
                    <ul className="list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {entry.solutions.map((solution, i) => (
                        <li key={i}>{solution}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-1">No matching issues found</h3>
              <p>Try adjusting your search terms or browse the full list</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
