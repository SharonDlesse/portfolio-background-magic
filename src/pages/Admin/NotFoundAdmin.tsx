
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundAdmin = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">The admin page you're looking for doesn't exist</p>
        <Button onClick={() => navigate('/admin/dashboard')}>
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </AdminLayout>
  );
};

export default NotFoundAdmin;
