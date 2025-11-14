
// src/components/shared/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'indigo';
  showPercentage?: boolean;
  height?: 'thin' | 'normal' | 'thick';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'blue',
  showPercentage = false,
  height = 'normal'
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-500'
  };
  
  const heightClasses = {
    thin: 'h-1',
    normal: 'h-2',
    thick: 'h-3'
  };
  
  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${colorClasses[color]} ${heightClasses[height]} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${normalizedProgress}%` }}
          role="progressbar"
          aria-valuenow={normalizedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {Math.round(normalizedProgress)}%
        </div>
      )}
    </div>
  );
};