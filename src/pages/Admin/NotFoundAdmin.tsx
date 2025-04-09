
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Eye } from 'lucide-react';

const NotFoundAdmin = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">The admin page you're looking for doesn't exist</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="secondary" 
            className="flex items-center gap-2"
          >
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4" />
              Preview Site
            </a>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NotFoundAdmin;
