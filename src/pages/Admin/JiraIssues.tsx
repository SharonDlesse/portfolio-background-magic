
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Filter, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface JiraIssue {
  id: string;
  type: 'bug' | 'feature' | 'task' | 'debt';
  title: string;
  status: 'backlog' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

const JiraIssues = () => {
  // Sample mock data for Jira issues
  const [issues] = useState<JiraIssue[]>([
    {
      id: 'PROJ-1',
      type: 'bug',
      title: 'Mobile navigation not working on iOS devices',
      status: 'in-progress',
      priority: 'high',
      assignee: 'John Doe',
      createdAt: '2025-04-01',
      updatedAt: '2025-04-08'
    },
    {
      id: 'PROJ-2',
      type: 'feature',
      title: 'Implement user profile editing functionality',
      status: 'backlog',
      priority: 'medium',
      assignee: 'Jane Smith',
      createdAt: '2025-04-02',
      updatedAt: '2025-04-02'
    },
    {
      id: 'PROJ-3',
      type: 'task',
      title: 'Update project documentation',
      status: 'done',
      priority: 'low',
      assignee: 'John Doe',
      createdAt: '2025-04-03',
      updatedAt: '2025-04-07'
    },
    {
      id: 'PROJ-4',
      type: 'debt',
      title: 'Refactor Header component',
      status: 'review',
      priority: 'medium',
      assignee: null,
      createdAt: '2025-04-04',
      updatedAt: '2025-04-08'
    },
    {
      id: 'PROJ-5',
      type: 'bug',
      title: 'Project card images not loading correctly',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Jane Smith',
      createdAt: '2025-04-05',
      updatedAt: '2025-04-08'
    },
    {
      id: 'PROJ-6',
      type: 'debt',
      title: 'Clean up unused CSS classes',
      status: 'backlog',
      priority: 'low',
      assignee: null,
      createdAt: '2025-04-06',
      updatedAt: '2025-04-06'
    },
    {
      id: 'PROJ-7',
      type: 'feature',
      title: 'Add dark mode toggle',
      status: 'done',
      priority: 'medium',
      assignee: 'John Doe',
      createdAt: '2025-04-01',
      updatedAt: '2025-04-05'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter issues based on search query
  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count issues by type for the dashboard
  const bugCount = issues.filter(issue => issue.type === 'bug').length;
  const featureCount = issues.filter(issue => issue.type === 'feature').length;
  const taskCount = issues.filter(issue => issue.type === 'task').length;
  const debtCount = issues.filter(issue => issue.type === 'debt').length;

  // Render the badge for issue type
  const renderTypeBadge = (type: JiraIssue['type']) => {
    switch (type) {
      case 'bug':
        return <Badge variant="destructive">Bug</Badge>;
      case 'feature':
        return <Badge variant="default" className="bg-blue-500">Feature</Badge>;
      case 'task':
        return <Badge variant="secondary">Task</Badge>;
      case 'debt':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Tech Debt</Badge>;
    }
  };

  // Render the badge for issue status
  const renderStatusBadge = (status: JiraIssue['status']) => {
    switch (status) {
      case 'backlog':
        return <Badge variant="outline">Backlog</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-blue-500">In Progress</Badge>;
      case 'review':
        return <Badge variant="default" className="bg-purple-500">Review</Badge>;
      case 'done':
        return <Badge variant="default" className="bg-green-500">Done</Badge>;
    }
  };

  // Render the badge for issue priority
  const renderPriorityBadge = (priority: JiraIssue['priority']) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="border-green-500 text-green-500">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">High</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
              Jira Issues
            </h1>
            <p className="text-muted-foreground">
              Track and manage project issues and technical debt
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Bugs</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-2xl font-bold">{bugCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Features</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-2xl font-bold">{featureCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-2xl font-bold">{taskCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Technical Debt</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-2xl font-bold">{debtCount}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All Issues</TabsTrigger>
              <TabsTrigger value="bugs">Bugs</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="debt">Tech Debt</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Filter by assignee</DropdownMenuItem>
                    <DropdownMenuItem>Filter by status</DropdownMenuItem>
                    <DropdownMenuItem>Filter by priority</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <TabsContent value="all" className="border-none p-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Priority</TableHead>
                      <TableHead className="w-[150px]">Assignee</TableHead>
                      <TableHead className="w-[120px]">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues.map((issue) => (
                      <TableRow key={issue.id} className="hover:bg-accent cursor-pointer">
                        <TableCell className="font-medium">{issue.id}</TableCell>
                        <TableCell>{renderTypeBadge(issue.type)}</TableCell>
                        <TableCell>{issue.title}</TableCell>
                        <TableCell>{renderStatusBadge(issue.status)}</TableCell>
                        <TableCell>{renderPriorityBadge(issue.priority)}</TableCell>
                        <TableCell>{issue.assignee ?? 'Unassigned'}</TableCell>
                        <TableCell>{issue.updatedAt}</TableCell>
                      </TableRow>
                    ))}
                    {filteredIssues.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No issues found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bugs" className="border-none p-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Priority</TableHead>
                      <TableHead className="w-[150px]">Assignee</TableHead>
                      <TableHead className="w-[120px]">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues
                      .filter(issue => issue.type === 'bug')
                      .map((issue) => (
                        <TableRow key={issue.id} className="hover:bg-accent cursor-pointer">
                          <TableCell className="font-medium">{issue.id}</TableCell>
                          <TableCell>{issue.title}</TableCell>
                          <TableCell>{renderStatusBadge(issue.status)}</TableCell>
                          <TableCell>{renderPriorityBadge(issue.priority)}</TableCell>
                          <TableCell>{issue.assignee ?? 'Unassigned'}</TableCell>
                          <TableCell>{issue.updatedAt}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="features" className="border-none p-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Priority</TableHead>
                      <TableHead className="w-[150px]">Assignee</TableHead>
                      <TableHead className="w-[120px]">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues
                      .filter(issue => issue.type === 'feature')
                      .map((issue) => (
                        <TableRow key={issue.id} className="hover:bg-accent cursor-pointer">
                          <TableCell className="font-medium">{issue.id}</TableCell>
                          <TableCell>{issue.title}</TableCell>
                          <TableCell>{renderStatusBadge(issue.status)}</TableCell>
                          <TableCell>{renderPriorityBadge(issue.priority)}</TableCell>
                          <TableCell>{issue.assignee ?? 'Unassigned'}</TableCell>
                          <TableCell>{issue.updatedAt}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="debt" className="border-none p-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Priority</TableHead>
                      <TableHead className="w-[150px]">Assignee</TableHead>
                      <TableHead className="w-[120px]">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues
                      .filter(issue => issue.type === 'debt')
                      .map((issue) => (
                        <TableRow key={issue.id} className="hover:bg-accent cursor-pointer">
                          <TableCell className="font-medium">{issue.id}</TableCell>
                          <TableCell>{issue.title}</TableCell>
                          <TableCell>{renderStatusBadge(issue.status)}</TableCell>
                          <TableCell>{renderPriorityBadge(issue.priority)}</TableCell>
                          <TableCell>{issue.assignee ?? 'Unassigned'}</TableCell>
                          <TableCell>{issue.updatedAt}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default JiraIssues;
