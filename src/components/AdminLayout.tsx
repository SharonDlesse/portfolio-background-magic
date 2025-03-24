
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  LayoutDashboard,
  Image,
  Settings,
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-slate-400">Logged in as: {user?.username}</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                className={`flex items-center space-x-2 p-2 rounded ${
                  isActive('/admin/dashboard')
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/projects"
                className={`flex items-center space-x-2 p-2 rounded ${
                  isActive('/admin/projects')
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-slate-800'
                }`}
              >
                <Image className="h-5 w-5" />
                <span>Projects</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className={`flex items-center space-x-2 p-2 rounded ${
                  isActive('/admin/settings')
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-slate-800'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              className="justify-start text-white hover:bg-slate-800"
              onClick={() => navigate('/')}
            >
              <Home className="h-5 w-5 mr-2" />
              View Website
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-white hover:bg-slate-800"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-900">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
