import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  // Update document title
  useEffect(() => {
    document.title = 'Page Not Found | Blog Management';
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white">404</h1>
        <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-300 mt-2">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button variant="primary" leftIcon={<Home size={16} />}>
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}