
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="text-center py-16">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">The page you're looking for doesn't exist.</p>
        <Button asChild size="lg">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
