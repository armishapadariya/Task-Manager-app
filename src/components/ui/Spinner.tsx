import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
  className?: string;
}

export function Spinner({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };
  
  const colorClasses = {
    primary: 'border-blue-600 border-r-transparent',
    white: 'border-white border-r-transparent',
  };
  
  return (
    <div 
      className={`
        inline-block rounded-full animate-spin 
        ${sizeClasses[size]} 
        ${colorClasses[color]}
        ${className}
      `}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}