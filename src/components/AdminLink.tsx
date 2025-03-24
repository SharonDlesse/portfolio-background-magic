
import React from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const AdminLink: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated && isAdmin) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link to="/admin/dashboard" className="flex items-center gap-1 text-sm">
          <LockKeyhole className="h-4 w-4" />
          <span>Admin</span>
        </Link>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link to="/admin/login" className="flex items-center gap-1 text-sm">
        <LockKeyhole className="h-4 w-4" />
        <span>Admin</span>
      </Link>
    </Button>
  );
};

export default AdminLink;
