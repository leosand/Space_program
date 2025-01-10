import React from 'react';

interface ErrorMessageProps {
  fullScreen?: boolean;
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  fullScreen = false,
  message = 'An error occurred while loading the data. Please try again later.'
}) => {
  const errorContent = (
    <div className="text-center">
      <div className="text-red-600 text-xl mb-2">Error</div>
      <p className="text-gray-600">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        {errorContent}
      </div>
    );
  }

  return <div className="p-4">{errorContent}</div>;
};

export default ErrorMessage; 