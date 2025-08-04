import React from 'react';
import { Target } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 animate-pulse">
          <Target className="w-8 h-8 text-white animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Aim Achiever</h2>
        <p className="text-gray-500">Loading your productivity dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;