
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, FileText, Image, Layers, Settings, Users, Bug, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // In a real app, you would fetch this data from your database
  const statistics = {
    totalProjects: localStorage.getItem('portfolioProjects') ? JSON.parse(localStorage.getItem('portfolioProjects') || '[]').length : 0,
    publishedProjects: localStorage.getItem('portfolioProjects') ? JSON.parse(localStorage.getItem('portfolioProjects') || '[]').length : 0,
    jiraIssues: 7,
    openIssues: 5,
    techDebtItems: 2,
    confluenceNotes: 5,
    prototypeCount: 5
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin/projects')}>
              Manage Projects
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/diagnostics')}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Run Diagnostics
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                Projects in your portfolio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Published Projects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.publishedProjects}</div>
              <p className="text-xs text-muted-foreground">
                Projects visible to visitors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Prototypes</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.prototypeCount}</div>
              <p className="text-xs text-muted-foreground">
                Lo-Fi and Hi-Fi design prototypes
              </p>
              <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={() => navigate('/admin/prototypes')}>
                View prototypes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Jira Issues</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.openIssues}/{statistics.jiraIssues}</div>
              <p className="text-xs text-muted-foreground">
                Open issues / Total issues
              </p>
              <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={() => navigate('/admin/jira-issues')}>
                Manage issues
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Technical Debt</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.techDebtItems}</div>
              <p className="text-xs text-muted-foreground">
                Items identified as technical debt
              </p>
              <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={() => navigate('/admin/jira-issues?tab=debt')}>
                View tech debt
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Confluence Notes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.confluenceNotes}</div>
              <p className="text-xs text-muted-foreground">
                Project documentation notes
              </p>
              <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={() => navigate('/admin/confluence-notes')}>
                View documentation
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => navigate('/admin/projects')}>
                <Image className="h-4 w-4 mr-2" />
                Manage Projects
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/admin/prototypes')}>
                <Layers className="h-4 w-4 mr-2" />
                View Prototypes
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/admin/jira-issues')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Track Issues
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/admin/confluence-notes')}>
                <FileText className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/diagnostics')}>
                <Bug className="h-4 w-4 mr-2" />
                Run Diagnostics
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/')}>
                <Users className="h-4 w-4 mr-2" />
                View Public Site
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/admin/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 border-l-2 border-primary pl-4">
                  <div>
                    <p className="text-sm font-medium">Added new prototype</p>
                    <p className="text-xs text-muted-foreground">Today at 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-l-2 border-primary pl-4">
                  <div>
                    <p className="text-sm font-medium">Created Jira issue PROJ-7</p>
                    <p className="text-xs text-muted-foreground">Yesterday at 2:15 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-l-2 border-primary pl-4">
                  <div>
                    <p className="text-sm font-medium">Updated project documentation</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-l-2 border-primary pl-4">
                  <div>
                    <p className="text-sm font-medium">Ran diagnostics tests</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
