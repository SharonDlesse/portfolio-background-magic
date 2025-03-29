import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate = useNavigate();

  // In a real app, you would fetch this data from your database
  const statistics = {
    totalProjects: localStorage.getItem('portfolioProjects') ? JSON.parse(localStorage.getItem('portfolioProjects') || '[]').length : 0,
    publishedProjects: localStorage.getItem('portfolioProjects') ? JSON.parse(localStorage.getItem('portfolioProjects') || '[]').length : 0
  };
  return <AdminLayout>
      <div className="space-y-6 bg-zinc-300">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate('/admin/projects')}>
            Manage Projects
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 bg-zinc-300">
          <Card className="bg-gray-50">
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

          <Card className="bg-slate-50">
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
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-slate-50">
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="bg-slate-50">
              <div className="text-sm">
                <p className="text-xs text-muted-foreground mb-2">
                  Manage your portfolio settings
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate('/admin/settings')}>
                  View Settings
                </Button>
              </div>
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
              <p className="text-sm text-muted-foreground">
                No recent activity to display.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>;
};
export default Dashboard;