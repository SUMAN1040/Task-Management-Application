import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col items-center justify-center animate-pulse-slow">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-primary-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <CheckCircle2 className="relative w-20 h-20 text-primary-600 dark:text-primary-500 drop-shadow-lg" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Task<span className="text-primary-600 dark:text-primary-500">Pro</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
          Organize your life efficiently.
        </p>
      </div>
      
      {/* Loading bar at the bottom */}
      <div className="absolute bottom-12 w-48 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-primary-600 rounded-full animate-loading-bar"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
