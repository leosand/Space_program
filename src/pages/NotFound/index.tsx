import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            You might want to check out these pages instead:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary"
            >
              Return Home
            </Link>
            <Link
              to="/launches"
              className="btn btn-secondary"
            >
              View Launches
            </Link>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-sm text-gray-500">
            If you believe this is a mistake, please{' '}
            <a
              href="mailto:support@spacelaunchescomparison.com"
              className="text-primary-600 hover:text-primary-700"
            >
              contact our support team
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 