
import React from 'react';
import AdminLink from './AdminLink';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { LogOut, Home, Eye, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-border bg-card">
          <div className="flex items-center h-16 flex-shrink-0 px-4 py-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <AdminLink to="/admin/dashboard" icon="home">Dashboard</AdminLink>
              <AdminLink to="/admin/projects" icon="projects">Projects</AdminLink>
              <AdminLink to="/admin/images" icon="images">Images</AdminLink>
              <AdminLink to="/admin/prototypes" icon="prototypes">Prototypes</AdminLink>
              <AdminLink to="/admin/jira-issues" icon="jira">Jira Issues</AdminLink>
              <AdminLink to="/admin/confluence-notes" icon="confluence">Confluence Notes</AdminLink>
              <AdminLink to="/diagnostics" icon="diagnostics">Diagnostics</AdminLink>
              <AdminLink to="/admin/settings" icon="settings">Settings</AdminLink>
            </nav>
            
            <div className="p-4 space-y-2">
              <Button 
                asChild
                variant="outline" 
                className="w-full flex items-center gap-2"
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                className="w-full flex items-center gap-2"
              >
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4" />
                  Preview Site
                </a>
              </Button>
              
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="w-full flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border lg:hidden">
        <div className="grid h-full max-w-lg grid-cols-8 mx-auto">
          <AdminLink to="/admin/dashboard" icon="home">
            Dashboard
          </AdminLink>
          <AdminLink to="/admin/projects" icon="projects">
            Projects
          </AdminLink>
          <AdminLink to="/admin/images" icon="images">
            Images
          </AdminLink>
          <AdminLink to="/admin/prototypes" icon="prototypes">
            Prototypes
          </AdminLink>
          <AdminLink to="/admin/jira-issues" icon="jira">
            Jira
          </AdminLink>
          <AdminLink to="/admin/confluence-notes" icon="confluence">
            Confluence
          </AdminLink>
          <AdminLink to="/diagnostics" icon="diagnostics">
            Diagnostics
          </AdminLink>
          <AdminLink to="/admin/settings" icon="settings">
            Settings
          </AdminLink>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col lg:pl-64 w-full">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background px-4 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center gap-4">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              asChild
              variant="outline" 
              size="sm" 
              className="hidden sm:flex items-center gap-1"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="sm" 
              className="hidden sm:flex items-center gap-1"
            >
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4" />
                Preview
              </a>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="sm" 
              className="hidden sm:flex items-center gap-1"
            >
              <Link to="/diagnostics">
                <Zap className="h-4 w-4" />
                Diagnostics
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="lg:hidden"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1">
          <div className="container py-6 space-y-6 lg:space-y-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
